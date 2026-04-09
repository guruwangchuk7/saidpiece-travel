import { NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// --- Local Fallback Logic (For Local Dev / When Upstash is missing) ---
type RateLimitEntry = {
  count: number;
  resetAt: number;
};
const rateLimitStore = new Map<string, RateLimitEntry>();

function localRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = rateLimitStore.get(key);

  if (!current || now >= current.resetAt) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return null;
  }

  if (current.count >= limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    return { retryAfterSeconds };
  }

  current.count += 1;
  rateLimitStore.set(key, current);
  return null;
}

// --- Upstash Redis Logic (For Production) ---
const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

let redis: Redis | null = null;
if (upstashUrl && upstashToken) {
  redis = new Redis({
    url: upstashUrl,
    token: upstashToken,
  });
}

/**
 * Creates a persistent rate limiter using Redis but falls back to in-memory locally.
 */
export async function enforceRateLimit({
  key,
  limit,
  windowMs,
}: {
  key: string;
  limit: number;
  windowMs: number;
}) {
  // If no Redis configured, use local fallback
  if (!redis) {
    console.debug(`[apiSecurity] Redis not configured for rate limiting. Falling back to in-memory map for key: ${key}`);
    return localRateLimit(key, limit, windowMs);
  }

  try {
    const ratelimit = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(limit, `${windowMs} ms`),
      analytics: true,
      prefix: "@upstash/ratelimit/saidpiece-travel",
    });

    const result = await ratelimit.limit(key);

    if (!result.success) {
      const retryAfterSeconds = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
      return { retryAfterSeconds };
    }

    return null;
  } catch (error) {
    console.error("[apiSecurity] Upstash Rate Limit failed, using local fallback.", error);
    return localRateLimit(key, limit, windowMs);
  }
}

export function jsonNoStore(body: unknown, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  return response;
}

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  return 'unknown';
}

/**
 * Validates that the request body size is within the allowed limit.
 * Helps prevent DoS attacks using large payloads.
 */
export function validateBodySize(request: Request, maxBytes: number = 1_000_000) { // Default 1MB
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > maxBytes) {
    return false;
  }
  return true;
}

