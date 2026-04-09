import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createSupabaseAdminClient } from '@/lib/supabaseAdmin';
import { sendBookingConfirmationEmail, notifyAdminOfNewBooking } from '@/lib/notifications';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`[Stripe Webhook] Signature verification failed: ${err.message}`);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.client_reference_id;

    if (bookingId) {
      const supabase = createSupabaseAdminClient();
      
      // 1. Update Booking Status
      const { data: booking, error: updateError } = await supabase
        .from('bookings')
        .update({ 
          status: 'paid',
          payment_reference: session.id,
          metadata: {
            stripeCustomerId: session.customer,
            stripePaymentIntentId: session.payment_intent,
          }
        })
        .eq('id', bookingId)
        .select('*, trips(title)')
        .single();

      if (updateError || !booking) {
        console.error(`[Stripe Webhook] Failed to update booking ${bookingId}:`, updateError);
      } else {
        // 2. Trigger Notifications
        await Promise.all([
          sendBookingConfirmationEmail(
            booking.traveler_email, 
            booking.traveler_name, 
            booking.trips?.title || 'Your Trip', 
            booking.id
          ),
          notifyAdminOfNewBooking(
            booking.trips?.title || 'Your Trip', 
            booking.traveler_name, 
            booking.total_amount
          )
        ]);
        
        console.log(`[Stripe Webhook] Booking ${bookingId} confirmed and user notified.`);
      }
    }
  }

  return NextResponse.json({ received: true });
}
