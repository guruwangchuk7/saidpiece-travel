import { NextRequest } from 'next/server';
import { enforceRateLimit, getClientIp, jsonNoStore } from '@/lib/apiSecurity';
import { createBinancePayOrder } from '@/lib/binancePay';
import { getAuthenticatedUser } from '@/lib/supabaseAdmin';

type CreateBinancePayBody = {
  tripName?: string;
  travelerName?: string;
  fiatAmount?: string;
  currency?: string;
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
    const body = (await request.json()) as CreateBinancePayBody;

    const tripName = body.tripName?.trim();
    const travelerName = body.travelerName?.trim();
    const fiatAmount = body.fiatAmount?.trim();
    const currency = body.currency?.trim().toUpperCase();

    if (!tripName || !travelerName || !fiatAmount || !currency) {
      return jsonNoStore({ ok: false, error: 'Missing required Binance Pay fields.' }, { status: 400 });
    }

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
