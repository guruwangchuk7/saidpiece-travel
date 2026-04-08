import { NextRequest } from 'next/server';
import { getAddress, isAddress } from 'viem';
import { getExplorerUrl, getCryptoPaymentConfig, fromTokenBaseUnits } from '@/lib/cryptoPayments';
import { createSupabaseAdminClient, getAuthenticatedUser } from '@/lib/supabaseAdmin';
import { enforceRateLimit, getClientIp, jsonNoStore, validateBodySize } from '@/lib/apiSecurity';
import { getOnchainBookingConfig, isOnchainBookingConfigured, toBookingId, verifyBookingPaymentEvent } from '@/lib/onchainBooking';

import { z } from 'zod';

const verifyIntentSchema = z.object({
  intentId: z.string().uuid(),
  txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
  senderAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
});

function getBearerToken(request: NextRequest) {
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }

  return header.slice('Bearer '.length);
}

export async function POST(request: NextRequest) {
  try {
    if (!validateBodySize(request)) {
      return jsonNoStore({ ok: false, error: 'Payload too large.' }, { status: 413 });
    }
    const clientIp = getClientIp(request);
    const rateLimit = await enforceRateLimit({
      key: `crypto-verify:${clientIp}`,
      limit: 20,
      windowMs: 60_000,
    });

    if (rateLimit) {
      const response = jsonNoStore(
        { ok: false, error: 'Too many payment verification requests. Please wait and try again.' },
        { status: 429 },
      );
      response.headers.set('Retry-After', String(rateLimit.retryAfterSeconds));
      return response;
    }

    const accessToken = getBearerToken(request);
    const user = await getAuthenticatedUser(accessToken);
    
    // Zod validation replacing manual checks
    const json = await request.json();
    const result = verifyIntentSchema.safeParse(json);

    if (!result.success) {
      return jsonNoStore(
        { ok: false, error: 'Invalid verification payload.', details: result.error.format() },
        { status: 400 },
      );
    }

    const { intentId, txHash, senderAddress: rawSenderAddress } = result.data;
    
    if (!isOnchainBookingConfigured()) {
      return jsonNoStore(
        { ok: false, error: 'Onchain booking contract is not configured. Add NEXT_PUBLIC_BOOKING_MANAGER_ADDRESS.' },
        { status: 500 },
      );
    }

    const config = getCryptoPaymentConfig();
    const onchainConfig = getOnchainBookingConfig();
    const senderAddress = getAddress(rawSenderAddress);
    const typedTxHash = txHash as `0x${string}`;
    const supabase = createSupabaseAdminClient();

    const { data: duplicatePayment, error: duplicateError } = await supabase
      .from('crypto_payment_intents')
      .select('id, status')
      .eq('tx_hash', typedTxHash)
      .neq('id', intentId)
      .maybeSingle();

    if (duplicateError) {
      return jsonNoStore({ ok: false, error: duplicateError.message }, { status: 500 });
    }

    if (duplicatePayment) {
      return jsonNoStore(
        { ok: false, error: 'This transaction hash has already been used for another payment.', code: 'duplicate_tx' },
        { status: 409 },
      );
    }

    const { data: intent, error: intentError } = await supabase
      .from('crypto_payment_intents')
      .select('*')
      .eq('id', intentId)
      .eq('user_id', user.id)
      .single();

    if (intentError || !intent) {
      return jsonNoStore({ ok: false, error: 'Payment intent not found.' }, { status: 404 });
    }

    if (intent.status === 'paid') {
      return jsonNoStore(
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

      return jsonNoStore(
        { ok: false, error: 'This payment quote has expired. Refresh the page to generate a new one.', code: 'expired_quote' },
        { status: 410 },
      );
    }

    if (intent.chain_id !== config.chainId || intent.chain_id !== onchainConfig.chainId) {
      return jsonNoStore(
        { ok: false, error: 'Server chain configuration does not match the active payment chain.', code: 'wrong_chain' },
        { status: 400 },
      );
    }

    const expectedAmount = BigInt(intent.expected_token_amount_base_units);
    const bookingId = toBookingId(intent.id);

    const verification = await verifyBookingPaymentEvent({
      chainId: intent.chain_id,
      txHash: typedTxHash,
      expectedBookingId: bookingId,
      expectedPayer: senderAddress,
      expectedToken: getAddress(intent.token_address),
      minimumAmount: expectedAmount,
      bookingManagerAddress: onchainConfig.bookingManagerAddress,
    });

    if (!verification.ok) {
      const failureCode = verification.reason;
      const failureReasonMap: Record<string, string> = {
        failed_receipt: 'The transaction was mined but failed onchain.',
        wrong_token: 'The deposited token does not match the quoted token.',
        underpayment: 'The transaction amount is below the quoted amount.',
        event_not_found: 'No matching PaymentDeposited event was found for this booking.',
      };

      await supabase
        .from('crypto_payment_intents')
        .update({
          tx_hash: typedTxHash,
          sender_address: senderAddress,
          status: failureCode === 'underpayment' ? 'underpaid' : 'failed',
          failure_code: failureCode,
          failure_reason: failureReasonMap[failureCode] || 'Onchain payment verification failed.',
          received_token_amount_base_units:
            'amount' in verification && verification.amount != null ? verification.amount.toString() : null,
          received_token_amount:
            'amount' in verification && verification.amount != null
              ? fromTokenBaseUnits(verification.amount, intent.token_decimals)
              : null,
        })
        .eq('id', intent.id);

      return jsonNoStore(
        { ok: false, error: failureReasonMap[failureCode] || 'Onchain payment verification failed.', code: failureCode },
        { status: 400 },
      );
    }

    const receivedAmount = fromTokenBaseUnits(verification.amount, intent.token_decimals);
    const { error: updateError } = await supabase
      .from('crypto_payment_intents')
      .update({
        tx_hash: typedTxHash,
        sender_address: senderAddress,
        received_token_amount_base_units: verification.amount.toString(),
        received_token_amount: receivedAmount,
        status: 'paid',
        verified_at: new Date().toISOString(),
        failure_code: null,
        failure_reason: null,
      })
      .eq('id', intent.id);

    if (updateError) {
      return jsonNoStore({ ok: false, error: updateError.message }, { status: 500 });
    }

    return jsonNoStore({
      ok: true,
      payment: {
        intentId: intent.id,
        txHash: typedTxHash,
        amount: receivedAmount,
        explorerUrl: getExplorerUrl(intent.chain_id, typedTxHash),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to verify crypto payment.';
    const status = message === 'Unauthorized' ? 401 : 500;
    return jsonNoStore({ ok: false, error: message }, { status });
  }
}
