import { Resend } from 'resend';

// Initialize Resend with a fallback to avoid Vercel build errors when API_KEY is not yet set
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendBookingConfirmationEmail(email: string, travelerName: string, tripName: string, bookingId: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[Notifications] RESEND_API_KEY is missing. Email skipped.');
    return;
  }

  try {
    await resend?.emails.send({
      from: 'Saidpiece Travel <bookings@saidpiecetravels.com>',
      to: email,
      subject: `Booking Confirmed: ${tripName}`,
      html: `
        <div style="font-family: serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h1 style="color: #008080;">Your Bhutan Journey is Confirmed!</h1>
          <p>Dear ${travelerName},</p>
          <p>Thank you for choosing Saidpiece Travel. We are thrilled to confirm your booking for <strong>${tripName}</strong>.</p>
          <div style="background: #fcfaf7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Booking Reference:</strong> ${bookingId}</p>
          </div>
          <p>Our team will reach out to you within 24 hours with the next steps regarding your visa processing and flight coordination.</p>
          <p>Warm regards,<br/>The Saidpiece Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('[Notifications] Failed to send confirmation email:', error);
  }
}

export async function notifyAdminOfNewBooking(tripName: string, travelerName: string, amount: number) {
  if (!process.env.RESEND_API_KEY) return;

  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'saidpiece@gmail.com';

  try {
    await resend?.emails.send({
      from: 'Saidpiece System <system@saidpiecetravels.com>',
      to: adminEmail,
      subject: `🚨 NEW BOOKING: ${travelerName} - ${tripName}`,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2>New Booking Received</h2>
          <p><strong>Traveler:</strong> ${travelerName}</p>
          <p><strong>Trip:</strong> ${tripName}</p>
          <p><strong>Amount:</strong> $${amount}</p>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/enquiries" style="background: #008080; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View in Dashboard</a></p>
        </div>
      `,
    });
  } catch (error) {
    console.error('[Notifications] Failed to notify admin:', error);
  }
}

export async function sendEnquiryNotificationEmail(first_name: string, email: string, message: string, trip_name: string) {
  if (!process.env.RESEND_API_KEY) return;

  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'saidpiece@gmail.com';

  try {
    await resend?.emails.send({
      from: 'Saidpiece Enquiries <system@saidpiecetravels.com>',
      to: adminEmail,
      subject: `✉️ NEW ENQUIRY: ${first_name} - ${trip_name || 'General'}`,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2 style="color: #008080;">New Trip Enquiry Received</h2>
          <p><strong>From:</strong> ${first_name} (${email})</p>
          <p><strong>Topic/Trip:</strong> ${trip_name || 'General Inquiry'}</p>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #008080;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <p><a href="mailto:${email}" style="background: #008080; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Reply to Customer</a></p>
        </div>
      `,
    });
  } catch (error) {
    console.error('[Notifications] Failed to send enquiry notification:', error);
  }
}
