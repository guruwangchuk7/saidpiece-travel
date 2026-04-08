import { NextRequest, NextResponse } from 'next/server';
import { enforceRateLimit, getClientIp, jsonNoStore, validateBodySize } from '@/lib/apiSecurity';
import { createBinancePayOrder } from '@/lib/binancePay';
import { getAuthenticatedUser } from '@/lib/supabaseAdmin';
import { z } from 'zod';

const binancePaySchema = z.object({
  tripName: z.string().min(1).max(120),
  travelerName: z.string().min(1).max(80),
  fiatAmount: z.string().regex(/^\d+(\.\d{1,2})?$/),
  currency: z.string().length(3).toUpperCase(),
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
      key: `binance-pay:${clientIp}`,
      limit: 10,
      windowMs: 60_000,
    });

    if (rateLimit) {
      const response = jsonNoStore(
        { ok: false, error: 'Too many Binance Pay requests. Please wait and try again.' },
        { status: 429 },
      );
      response.headers.set('Retry-After', String(rateLimit.retryAfterSeconds));
      return response;
    }

    const accessToken = getBearerToken(request);
    const user = await getAuthenticatedUser(accessToken);
    
    const body = await request.json();
    const result = binancePaySchema.safeParse(body);

    if (!result.success) {
      return jsonNoStore({ ok: false, error: 'Invalid Binance Pay payload.', details: result.error.format() }, { status: 400 });
    }

    const { tripName, travelerName, fiatAmount, currency } = result.data;

    const order = await createBinancePayOrder({
      tripName,
      travelerName,
      fiatAmount,
      fiatCurrency: currency,
      buyerEmail: user.email,
      buyerRegistrationTime: user.created_at ? new Date(user.created_at).getTime() : undefined,
      orderClientIp: clientIp !== 'unknown' ? clientIp : undefined,
    });

    return jsonNoStore({
      ok: true,
      ...order,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create Binance Pay order.';
    const status = message === 'Unauthorized' ? 401 : 500;
    console.error('Binance Pay route failed', error);
    return jsonNoStore({ ok: false, error: message }, { status });
  }
}
