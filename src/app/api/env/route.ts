import { NextResponse } from 'next/server';

const REQUIRED_ENV = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

export async function GET() {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  return NextResponse.json({
    ok: missing.length === 0,
    missing,
    staffEmails: (process.env.STAFF_EMAILS || process.env.NEXT_PUBLIC_STAFF_EMAILS || '').split(',').map((e) => e.trim()).filter(Boolean),
  });
}
