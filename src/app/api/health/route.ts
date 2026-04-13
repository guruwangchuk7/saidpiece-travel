import { NextResponse } from 'next/server';
import { enforceRateLimit, getClientIp } from '@/lib/apiSecurity';

export async function GET(request: Request) {
  const clientIp = getClientIp(request);
  const rateLimit = await enforceRateLimit({
    key: `health:${clientIp}`,
    limit: 10,
    windowMs: 60_000,
  });

  if (rateLimit) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
}
