import { NextRequest } from 'next/server';
import { createSupabaseAdminClient, getAuthenticatedUser } from '@/lib/supabaseAdmin';
import { jsonNoStore } from '@/lib/apiSecurity';
import { toBookingId } from '@/lib/onchainBooking';

function getBearerToken(request: NextRequest) {
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }
  return header.slice('Bearer '.length);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ intentId: string }> },
) {
  try {
    const accessToken = getBearerToken(request);
    const user = await getAuthenticatedUser(accessToken);
    const { intentId } = await params;
    const bookingId = toBookingId(intentId);

    const supabase = createSupabaseAdminClient();
    const { data: paymentIntent } = await supabase
      .from('crypto_payment_intents')
      .select('id, user_id, status, tx_hash, verified_at')
      .eq('id', intentId)
      .single();

    if (!paymentIntent || paymentIntent.user_id !== user.id) {
      return jsonNoStore({ ok: false, error: 'Booking not found.' }, { status: 404 });
    }

    const { data: booking } = await supabase
      .from('blockchain_bookings')
      .select('*')
      .eq('booking_id', bookingId)
      .maybeSingle();

    return jsonNoStore({
      ok: true,
      bookingId,
      paymentIntent,
      indexedBooking: booking,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load booking status.';
    const status = message === 'Unauthorized' ? 401 : 500;
    return jsonNoStore({ ok: false, error: message }, { status });
  }
}
