import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createSupabaseAdminClient, getAuthenticatedUser, ensureProfile } from '@/lib/supabaseAdmin';
import { enforceRateLimit, getClientIp, jsonNoStore, validateBodySize } from '@/lib/apiSecurity';

const createBookingSchema = z.object({
  tripId: z.string().uuid(),
  departureId: z.string().uuid().optional().nullable(),
  travelerName: z.string().min(2).max(100),
  passengersCount: z.number().int().min(1).max(20).default(1),
  paymentMethod: z.enum(['card', 'crypto', 'binance', 'wire']),
});

export async function POST(request: NextRequest) {
  try {
    if (!validateBodySize(request)) {
      return jsonNoStore({ ok: false, error: 'Payload too large.' }, { status: 413 });
    }

    const clientIp = getClientIp(request);
    const rateLimit = await enforceRateLimit({
      key: `bookings-create:${clientIp}`,
      limit: 5,
      windowMs: 60_000,
    });

    if (rateLimit) {
      return jsonNoStore(
        { ok: false, error: 'Too many booking attempts. Please wait.' },
        { status: 429 }
      );
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return jsonNoStore({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const user = await getAuthenticatedUser(token);
    await ensureProfile(user);

    const body = await request.json();
    const result = createBookingSchema.safeParse(body);

    if (!result.success) {
      return jsonNoStore({ ok: false, error: 'Invalid booking data', details: result.error.format() }, { status: 400 });
    }

    const { tripId, departureId, travelerName, passengersCount, paymentMethod } = result.data;

    const supabase = createSupabaseAdminClient();

    // 1. Fetch Trusted Pricing
    // Priority: Departure Price > Starting Price
    let finalPrice = 0;
    
    if (departureId) {
        const { data: dep, error: depError } = await supabase
            .from('trip_departures')
            .select('price')
            .eq('id', departureId)
            .single();
        
        if (depError || !dep) {
            return jsonNoStore({ ok: false, error: 'Selected departure date no longer available.' }, { status: 404 });
        }
        finalPrice = Number(dep.price);
    } else {
        const { data: trip, error: tripError } = await supabase
            .from('trips')
            .select('starting_price')
            .eq('id', tripId)
            .single();
        
        if (tripError || !trip) {
            return jsonNoStore({ ok: false, error: 'Trip not found.' }, { status: 404 });
        }
        finalPrice = Number(trip.starting_price);
    }

    const totalAmount = finalPrice * passengersCount;

    // 2. Create Persistent Booking Record
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        trip_id: tripId,
        departure_id: departureId,
        traveler_name: travelerName,
        traveler_email: user.email,
        passengers_count: passengersCount,
        total_amount: totalAmount,
        currency: 'USD',
        status: 'pending',
        payment_method: paymentMethod,
        metadata: {
            clientIp,
            userAgent: request.headers.get('user-agent'),
        }
      })
      .select()
      .single();

    if (bookingError) {
      console.error('[bookings] Create failed:', bookingError);
      return jsonNoStore({ ok: false, error: 'Failed to initialize booking.' }, { status: 500 });
    }

    return jsonNoStore({
      ok: true,
      bookingId: booking.id,
      amount: totalAmount,
      currency: 'USD'
    });

  } catch (error) {
    console.error('[bookings] System error:', error);
    return jsonNoStore({ ok: false, error: 'Internal system error' }, { status: 500 });
  }
}
