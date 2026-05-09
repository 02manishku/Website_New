// Newsletter signup endpoint. Accepts JSON { email, website? } from the
// Footer form and the NewsletterTeaser popup. Both flows POST through
// here; both pass an empty `website` honeypot.
//
//   POST /api/newsletter
//     Input  → { email, website? }
//     Output → 200 { ok: true }
//            | 400 { error: 'Invalid email' }
//            | 403 { error: 'Forbidden' }     (origin guard)
//            | 429 { error: 'Too many requests' }
//            | 502 { error: 'Service unavailable' }   (Resend down)

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { clientIp, isAllowedOrigin, rateLimited } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  // ── Origin + rate-limit gate ────────────────────────────────────
  if (!isAllowedOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (rateLimited(clientIp(req), 5, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  // ── Parse + validate ────────────────────────────────────────────
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  // Honeypot: if a bot fills the hidden `website` input, return 200
  // silently so the bot thinks it succeeded but no email lands in the
  // audience. Real visitors leave the field empty.
  if (typeof body.website === 'string' && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const email = String(body.email ?? '').trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  // ── Push to Resend audience ─────────────────────────────────────
  try {
    if (process.env.RESEND_AUDIENCE_ID) {
      await resend.contacts.create({
        email,
        audienceId: process.env.RESEND_AUDIENCE_ID
      });
    } else {
      // Resend audience not configured yet. Log and accept so the form
      // experience isn't blocked while the audience is being created
      // in the Resend dashboard.
      console.warn(
        '[newsletter] RESEND_AUDIENCE_ID not set — accepting email without persisting',
        { email }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[newsletter] Resend error', err);
    return NextResponse.json(
      { error: 'Service unavailable' },
      { status: 502 }
    );
  }
}
