import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createSupabaseAdminClient } from '@/lib/supabaseAdmin';
import { enforceRateLimit, getClientIp, jsonNoStore, validateBodySize } from '@/lib/apiSecurity';

const enquirySchema = z.object({
  first_name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address').max(100, 'Email too long'),
  message: z.string().min(1, 'Message is required').max(2000, 'Message too long'),
  trip_name_fallback: z.string().max(120).optional().nullable(),
  user_id: z.string().uuid().optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    if (!validateBodySize(request, 256_000)) { // 256KB limit for enquiries
      return jsonNoStore({ ok: false, error: 'Payload too large.' }, { status: 413 });
    }

    const clientIp = getClientIp(request);
    
    // Rate Limit: Max 3 enquiries per 10 minutes from same IP
    const rateLimit = await enforceRateLimit({
      key: `enquiry:${clientIp}`,
      limit: 3,
      windowMs: 600_000, // 10 minutes
    });

    if (rateLimit) {
      const response = jsonNoStore(
        { ok: false, error: 'Too many requests. Please wait before submitting another enquiry.' },
        { status: 429 },
      );
      response.headers.set('Retry-After', String(rateLimit.retryAfterSeconds));
      return response;
    }

    const body = await request.json();
    const result = enquirySchema.safeParse(body);

    if (!result.success) {
      return jsonNoStore(
        { ok: false, error: 'Validation failed', details: result.error.format() },
        { status: 400 },
      );
    }

    const { first_name, email, message, trip_name_fallback, user_id } = result.data;

    const supabase = createSupabaseAdminClient();
    const { error } = await supabase
      .from('enquiries')
      .insert([
        {
          first_name,
          email,
          message,
          trip_name_fallback,
          user_id,
          status: 'new'
        }
      ]);

    if (error) {
      console.error('[enquiries] Database error:', error);
      return jsonNoStore({ ok: false, error: 'Database capture failed' }, { status: 500 });
    }

    return jsonNoStore({ ok: true, message: 'Enquiry received' });
  } catch (error) {
    console.error('[enquiries] System error:', error);
    return jsonNoStore({ ok: false, error: 'Internal system error' }, { status: 500 });
  }
}
