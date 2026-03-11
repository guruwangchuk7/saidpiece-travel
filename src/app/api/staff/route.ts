import { NextResponse } from 'next/server';

export async function GET() {
  const env = process.env.STAFF_EMAILS || process.env.NEXT_PUBLIC_STAFF_EMAILS || '';
  const staffEmails = env
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean);

  return NextResponse.json({
    configured: staffEmails.length > 0,
    staffEmails,
  });
}
