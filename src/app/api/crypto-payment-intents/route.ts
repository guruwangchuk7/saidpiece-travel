import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient, ensureProfile, getAuthenticatedUser } from '@/lib/supabaseAdmin';
import { getCryptoPaymentConfig, getExpectedTokenAmount, toTokenBaseUnits } from '@/lib/cryptoPayments';
import { enforceRateLimit, getClientIp, jsonNoStore } from '@/lib/apiSecurity';
import { getOnchainBookingConfig, isOnchainBookingConfigured, toBookingId } from '@/lib/onchainBooking';

import { z } from 'zod';

const createIntentSchema = z.object({
  tripName: z.string().min(3).max(120),
  travelerName: z.string().min(2).max(80),
  fiatAmount: z.string().regex(/^\d+(\.\d{1,2})?$/),
  currency: z.string().length(3).toUpperCase(),
  cryptoAmount: z.string().nullable().optional(),
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
    const clientIp = getClientIp(request);
    const rateLimit = await enforceRateLimit({
      key: `crypto-intent:${clientIp}`,
      limit: 10,
      windowMs: 60_000,
    });

    if (rateLimit) {
      const response = jsonNoStore(
        { ok: false, error: 'Too many payment intent requests. Please wait and try again.' },
        { status: 429 },
      );
      response.headers.set('Retry-After', String(rateLimit.retryAfterSeconds));
      return response;
    }

    const accessToken = getBearerToken(request);
    const user = await getAuthenticatedUser(accessToken);
    
    // Zod validation replacing manual checks
    const json = await request.json();
    const result = createIntentSchema.safeParse(json);
    
    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: 'Invalid payment intent payload.', details: result.error.format() },
        { status: 400 },
      );
    }

    const { tripName, travelerName, fiatAmount, currency, cryptoAmount } = result.data;

    if (!user.email) {
      return NextResponse.json(
        { ok: false, error: 'Authenticated user is missing an email address.' },
        { status: 400 },
      );
    }

    await ensureProfile(user);

    const config = getCryptoPaymentConfig();
    const expectedTokenAmount = getExpectedTokenAmount({
      fiatAmount,
      currency,
      tokenSymbol: config.tokenSymbol,
      cryptoAmount: cryptoAmount,
    });
    const expectedTokenAmountBaseUnits = toTokenBaseUnits(expectedTokenAmount, config.tokenDecimals).toString();
    const expiresAt = new Date(Date.now() + config.quoteLifetimeMinutes * 60_000).toISOString();

    const supabase = createSupabaseAdminClient();
    const { data: existingIntent, error: existingIntentError } = await supabase
      .from('crypto_payment_intents')
      .select('id, trip_name, fiat_currency, fiat_amount, token_symbol, expected_token_amount, chain_id, recipient_address, quote_expires_at, status')
      .eq('user_id', user.id)
      .eq('trip_name', tripName)
      .eq('fiat_currency', currency)
      .eq('fiat_amount', fiatAmount)
      .eq('token_symbol', config.tokenSymbol)
      .eq('status', 'pending')
      .gte('quote_expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingIntentError) {
      console.error('Failed to look up existing crypto payment intent', {
        error: existingIntentError,
        userId: user.id,
        tripName,
        fiatAmount,
        currency,
      });
      return NextResponse.json({ ok: false, error: existingIntentError.message }, { status: 500 });
    }

    if (existingIntent) {
      const onchain = isOnchainBookingConfigured() ? getOnchainBookingConfig() : null;
      if (onchain) {
        await supabase.from('blockchain_bookings').upsert(
          {
            payment_intent_id: existingIntent.id,
            user_id: user.id,
            booking_id: toBookingId(existingIntent.id),
            token_address: config.tokenAddress,
            token_symbol: config.tokenSymbol,
            expected_amount_base_units: expectedTokenAmountBaseUnits,
            chain_id: onchain.chainId,
            booking_manager_address: onchain.bookingManagerAddress,
            status: 'draft',
          },
          { onConflict: 'booking_id' },
        );
      }

      return jsonNoStore({
        ok: true,
        intent: existingIntent,
        contractCall: onchain
          ? {
              chainId: onchain.chainId,
              bookingManagerAddress: onchain.bookingManagerAddress,
              functionName: 'payBooking',
              bookingId: toBookingId(existingIntent.id),
              tokenAddress: config.tokenAddress,
              amountBaseUnits: expectedTokenAmountBaseUnits,
            }
          : null,
      });
    }

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
      console.error('Failed to insert crypto payment intent', {
        error,
        userId: user.id,
        tripName,
        fiatAmount,
        currency,
      });
      return jsonNoStore({ ok: false, error: error.message }, { status: 500 });
    }

    const onchain = isOnchainBookingConfigured() ? getOnchainBookingConfig() : null;
    if (onchain) {
      await supabase.from('blockchain_bookings').upsert(
        {
          payment_intent_id: data.id,
          user_id: user.id,
          booking_id: toBookingId(data.id),
          token_address: config.tokenAddress,
          token_symbol: config.tokenSymbol,
          expected_amount_base_units: expectedTokenAmountBaseUnits,
          chain_id: onchain.chainId,
          booking_manager_address: onchain.bookingManagerAddress,
          status: 'draft',
        },
        { onConflict: 'booking_id' },
      );
    }

    return jsonNoStore({
      ok: true,
      intent: data,
      contractCall: onchain
        ? {
            chainId: onchain.chainId,
            bookingManagerAddress: onchain.bookingManagerAddress,
            functionName: 'payBooking',
            bookingId: toBookingId(data.id),
            tokenAddress: config.tokenAddress,
            amountBaseUnits: expectedTokenAmountBaseUnits,
          }
        : null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create crypto payment intent.';
    console.error('Crypto payment intent route failed', error);
    const status = message === 'Unauthorized' ? 401 : 500;
    return jsonNoStore({ ok: false, error: message }, { status });
  }
}
