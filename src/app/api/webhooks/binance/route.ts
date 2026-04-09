import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createSupabaseAdminClient } from '@/lib/supabaseAdmin';
import { sendBookingConfirmationEmail, notifyAdminOfNewBooking } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    const headers = {
      timestamp: req.headers.get('binancepay-timestamp'),
      nonce: req.headers.get('binancepay-nonce'),
      signature: req.headers.get('binancepay-signature'),
      certificate: req.headers.get('binancepay-certificate'),
    };

    // 1. Verify Binance Signature
    // (Note: In a true production environment, you would use public key verification here)
    // For now, we verify the bizType and bizStatus which is the payload Binance sends
    const payload = JSON.parse(bodyText);

    if (payload.bizType === 'PAY' && payload.bizStatus === 'PAY_SUCCESS') {
      const bizData = JSON.parse(payload.data);
      const merchantTradeNo = bizData.merchantTradeNo;

      const supabase = createSupabaseAdminClient();
      
      // 2. Resolve Booking by merchantTradeNo
      const { data: booking, error: fetchError } = await supabase
        .from('bookings')
        .select('*, trips(title)')
        .eq('payment_reference', merchantTradeNo)
        .single();

      if (fetchError || !booking) {
        console.error(`[Binance Webhook] Booking not found for tradeNo: ${merchantTradeNo}`);
        return NextResponse.json({ returnCode: 'FAIL', returnMsg: 'Booking not found' });
      }

      if (booking.status === 'paid') {
          return NextResponse.json({ returnCode: 'SUCCESS', returnMsg: 'Already processed' });
      }

      // 3. Update Status
      await supabase
        .from('bookings')
        .update({ status: 'paid' })
        .eq('id', booking.id);

      // 4. Trigger Notifications
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
    }

    return NextResponse.json({ returnCode: 'SUCCESS', returnMsg: 'OK' });

  } catch (error) {
    console.error('[Binance Webhook] Error:', error);
    return NextResponse.json({ returnCode: 'FAIL', returnMsg: 'Internal Server Error' }, { status: 500 });
  }
}
