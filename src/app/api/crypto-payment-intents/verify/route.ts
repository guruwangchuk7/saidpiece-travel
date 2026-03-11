import { NextRequest, NextResponse } from 'next/server';
import { getAddress, isAddress } from 'viem';
import { getExplorerUrl, getCryptoPaymentConfig, verifyErc20Transfer, fromTokenBaseUnits } from '@/lib/cryptoPayments';
import { createSupabaseAdminClient, getAuthenticatedUser } from '@/lib/supabaseAdmin';

type VerifyIntentBody = {
  intentId?: string;
  txHash?: string;
  senderAddress?: string;
};

function getBearerToken(request: NextRequest) {
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }

  return header.slice('Bearer '.length);
}

export async function POST(request: NextRequest) {
  try {
    const accessToken = getBearerToken(request);
    const user = await getAuthenticatedUser(accessToken);
    const body = (await request.json()) as VerifyIntentBody;

    if (!body.intentId || !body.txHash || !body.senderAddress || !isAddress(body.senderAddress)) {
      return NextResponse.json({ ok: false, error: 'Missing or invalid verification payload.' }, { status: 400 });
    }

    const config = getCryptoPaymentConfig();
    const senderAddress = getAddress(body.senderAddress);
    const txHash = body.txHash as `0x${string}`;
    const supabase = createSupabaseAdminClient();

    const { data: duplicatePayment, error: duplicateError } = await supabase
      .from('crypto_payment_intents')
      .select('id, status')
      .eq('tx_hash', txHash)
      .neq('id', body.intentId)
      .maybeSingle();

    if (duplicateError) {
      return NextResponse.json({ ok: false, error: duplicateError.message }, { status: 500 });
    }

    if (duplicatePayment) {
      return NextResponse.json(
        { ok: false, error: 'This transaction hash has already been used for another payment.', code: 'duplicate_tx' },
        { status: 409 },
      );
    }

    const { data: intent, error: intentError } = await supabase
      .from('crypto_payment_intents')
      .select('*')
      .eq('id', body.intentId)
      .eq('user_id', user.id)
      .single();

    if (intentError || !intent) {
      return NextResponse.json({ ok: false, error: 'Payment intent not found.' }, { status: 404 });
    }

    if (intent.status === 'paid') {
      return NextResponse.json(
        {
          ok: true,
          payment: {
            intentId: intent.id,
            txHash: intent.tx_hash,
            amount: intent.received_token_amount || intent.expected_token_amount,
            explorerUrl: intent.tx_hash ? getExplorerUrl(intent.chain_id, intent.tx_hash) : null,
          },
        },
        { status: 200 },
      );
    }

    const now = Date.now();
    const expiresAt = new Date(intent.quote_expires_at).getTime();
    if (Number.isFinite(expiresAt) && now > expiresAt) {
      await supabase
        .from('crypto_payment_intents')
        .update({
          status: 'expired',
          failure_code: 'expired_quote',
          failure_reason: 'The quote expired before the transaction was verified.',
        })
        .eq('id', intent.id);

      return NextResponse.json(
        { ok: false, error: 'This payment quote has expired. Refresh the page to generate a new one.', code: 'expired_quote' },
        { status: 410 },
      );
    }

    if (intent.chain_id !== config.chainId) {
      return NextResponse.json(
        { ok: false, error: 'Server chain configuration does not match the active payment chain.', code: 'wrong_chain' },
        { status: 400 },
      );
    }

    const verification = await verifyErc20Transfer({
      chainId: intent.chain_id,
      txHash,
      expectedTokenAddress: getAddress(intent.token_address),
      expectedRecipient: getAddress(intent.recipient_address),
    });

    if (verification.receipt.status !== 'success') {
      await supabase
        .from('crypto_payment_intents')
        .update({
          tx_hash: txHash,
          sender_address: senderAddress,
          status: 'failed',
          failure_code: 'failed_receipt',
          failure_reason: 'The transaction was mined but failed onchain.',
        })
        .eq('id', intent.id);

      return NextResponse.json(
        { ok: false, error: 'The transaction failed onchain.', code: 'failed_receipt' },
        { status: 400 },
      );
    }

    if (!verification.transaction.to || getAddress(verification.transaction.to) !== getAddress(intent.token_address)) {
      await supabase
        .from('crypto_payment_intents')
        .update({
          tx_hash: txHash,
          sender_address: senderAddress,
          status: 'failed',
          failure_code: 'wrong_token',
          failure_reason: 'The transaction target token contract does not match the quoted token.',
        })
        .eq('id', intent.id);

      return NextResponse.json(
        { ok: false, error: 'The transaction did not target the expected token contract.', code: 'wrong_token' },
        { status: 400 },
      );
    }

    const matchingTransfer = verification.matchingTransfers.find(
      (transfer) => transfer.from === senderAddress,
    );

    if (!matchingTransfer) {
      await supabase
        .from('crypto_payment_intents')
        .update({
          tx_hash: txHash,
          sender_address: senderAddress,
          status: 'failed',
          failure_code: 'wrong_recipient',
          failure_reason: 'No matching transfer to the business wallet was found from this sender.',
        })
        .eq('id', intent.id);

      return NextResponse.json(
        { ok: false, error: 'No matching transfer to the business wallet was found in this transaction.', code: 'wrong_recipient' },
        { status: 400 },
      );
    }

    const expectedBaseUnits = BigInt(intent.expected_token_amount_base_units);
    const receivedAmount = fromTokenBaseUnits(matchingTransfer.value, intent.token_decimals);
    if (matchingTransfer.value < expectedBaseUnits) {
      await supabase
        .from('crypto_payment_intents')
        .update({
          tx_hash: txHash,
          sender_address: senderAddress,
          received_token_amount_base_units: matchingTransfer.value.toString(),
          received_token_amount: receivedAmount,
          status: 'underpaid',
          failure_code: 'underpayment',
          failure_reason: 'The transaction amount is below the quoted amount.',
        })
        .eq('id', intent.id);

      return NextResponse.json(
        { ok: false, error: 'The transaction amount is below the quoted payment amount.', code: 'underpayment' },
        { status: 400 },
      );
    }

    const { error: updateError } = await supabase
      .from('crypto_payment_intents')
      .update({
        tx_hash: txHash,
        sender_address: senderAddress,
        received_token_amount_base_units: matchingTransfer.value.toString(),
        received_token_amount: receivedAmount,
        status: 'paid',
        verified_at: new Date().toISOString(),
        failure_code: null,
        failure_reason: null,
      })
      .eq('id', intent.id);

    if (updateError) {
      return NextResponse.json({ ok: false, error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      payment: {
        intentId: intent.id,
        txHash,
        amount: receivedAmount,
        explorerUrl: getExplorerUrl(intent.chain_id, txHash),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to verify crypto payment.';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
