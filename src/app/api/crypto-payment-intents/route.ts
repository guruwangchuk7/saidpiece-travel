import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient, getAuthenticatedUser } from '@/lib/supabaseAdmin';
import { getCryptoPaymentConfig, getExpectedTokenAmount, toTokenBaseUnits } from '@/lib/cryptoPayments';

type CreateIntentBody = {
  tripName?: string;
  travelerName?: string;
  fiatAmount?: string;
  currency?: string;
  cryptoAmount?: string | null;
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
    const body = (await request.json()) as CreateIntentBody;

    const tripName = body.tripName?.trim();
    const travelerName = body.travelerName?.trim();
    const fiatAmount = body.fiatAmount?.trim();
    const currency = body.currency?.trim().toUpperCase();

    if (!tripName || !travelerName || !fiatAmount || !currency) {
      return NextResponse.json(
        { ok: false, error: 'Missing required payment intent fields.' },
        { status: 400 },
      );
    }

    const config = getCryptoPaymentConfig();
    const expectedTokenAmount = getExpectedTokenAmount({
      fiatAmount,
      currency,
      tokenSymbol: config.tokenSymbol,
      cryptoAmount: body.cryptoAmount,
    });
    const expectedTokenAmountBaseUnits = toTokenBaseUnits(expectedTokenAmount, config.tokenDecimals).toString();
    const expiresAt = new Date(Date.now() + config.quoteLifetimeMinutes * 60_000).toISOString();

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('crypto_payment_intents')
      .insert({
        user_id: user.id,
        user_email: user.email,
        trip_name: tripName,
        traveler_name: travelerName,
        fiat_currency: currency,
        fiat_amount: fiatAmount,
        token_symbol: config.tokenSymbol,
        token_address: config.tokenAddress,
        token_decimals: config.tokenDecimals,
        expected_token_amount: expectedTokenAmount,
        expected_token_amount_base_units: expectedTokenAmountBaseUnits,
        chain_id: config.chainId,
        recipient_address: config.recipientAddress,
        status: 'pending',
        quote_expires_at: expiresAt,
      })
      .select('id, trip_name, fiat_currency, fiat_amount, token_symbol, expected_token_amount, chain_id, recipient_address, quote_expires_at, status')
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      intent: data,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create crypto payment intent.';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
