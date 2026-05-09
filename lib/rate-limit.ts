// Lightweight in-process rate limiter and origin guard for our public API
// routes (lead + newsletter). Module-scope Map persists for the life of
// the serverless container — fine for organic traffic; abuse spikes get
// caught early enough to matter, the rest is Vercel's WAF problem.
//
// For higher-traffic deployments swap this for an upstash/Redis-backed
// implementation; the public surface stays the same.

const buckets = new Map<string, number[]>();

/**
 * @returns true when the key has hit the limit and the request should be
 * rejected with 429.
 */
export function rateLimited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const fresh = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (fresh.length >= max) {
    buckets.set(key, fresh);
    return true;
  }
  fresh.push(now);
  buckets.set(key, fresh);
  return false;
}

/**
 * Best-effort client IP for rate-limit keying. Vercel sets
 * `x-forwarded-for`; some hosts use `x-real-ip`. Falls through to a
 * stable string when neither is present so a single bad actor without
 * the headers doesn't bypass the limit by being keyed as `null`.
 */
export function clientIp(req: Request) {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

/**
 * Reject cross-origin POSTs to our APIs. Allows the production host,
 * any *.vercel.app preview, and (for local dev) the value of
 * NEXT_PUBLIC_SITE_URL when it's set to a localhost URL.
 */
export function isAllowedOrigin(req: Request) {
  const origin = req.headers.get('origin') ?? '';
  if (!origin) {
    // Same-origin form posts from <form action="/api/..."> don't always
    // send an Origin header; fall back to Referer host check.
    const referer = req.headers.get('referer') ?? '';
    return (
      referer.startsWith('https://magppie.com') ||
      referer.includes('.vercel.app') ||
      referer.startsWith('http://localhost')
    );
  }
  const allowed = [
    process.env.NEXT_PUBLIC_SITE_URL,
    'https://magppie.com'
  ].filter(Boolean) as string[];
  return (
    allowed.includes(origin) ||
    origin.endsWith('.vercel.app') ||
    origin.startsWith('http://localhost')
  );
}
