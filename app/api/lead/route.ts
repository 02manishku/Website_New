// ─────────────────────────────────────────────────────────────────────────
// Lead capture endpoint. Receives JSON from any frontend form and
// pushes the lead into Zoho CRM via the REST v5 API.
//
// POST /api/lead
//   Input  → { name, phone, email?, location?, budget?, timeline?, utm? }
//   Output → 200 { ok: true, id }                  (new lead)
//          | 200 { ok: true, duplicate: true, id } (returning visitor)
//          | 400 { error }                          (validation)
//          | 500 { error }                          (server misconfig)
//          | 502 { error, debug }                   (Zoho rejected)
//
// Why REST, not Zoho's Web-to-Lead: Web-to-Lead bakes the field set
// into the generated HTML form (opaque LEADCF<N> ids). Adding a new
// custom field silently drops without code changes. REST accepts ANY
// field by api_name, so any future Zoho field works with zero code.
// ─────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { clientIp, isAllowedOrigin, rateLimited } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Email shape check (server-side mirror of the form's `type=email`).
// Rejects empty / malformed addresses with 400.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ACCOUNTS = process.env.ZOHO_ACCOUNTS_URL || 'https://accounts.zoho.in';
const API_BASE = process.env.ZOHO_API_BASE || 'https://www.zohoapis.in';
const CLIENT_ID = process.env.ZOHO_CLIENT_ID || '';
const CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET || '';
const REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN || '';

// UTM keys, written as Zoho api_names. The capital C in
// `utm_Campaignid` is intentional — Zoho api_names are case-sensitive
// and that's the column the Magppie CRM was set up with.
const UTM_FIELDS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_Campaignid',
  'utm_adgroupid',
  'utm_keyword',
  'utm_placement'
] as const;
type UTMField = (typeof UTM_FIELDS)[number];

// City → State mapping for the Zoho `State1` picklist. The form sends
// a single `location` (a city) and we derive the state here so the
// CRM sales view can filter by region without depending on the
// visitor to pick both correctly. Empty string for "Other (India)"
// so we don't pollute the State1 picklist with a default.
const STATE_MAP: Record<string, string> = {
  'Delhi NCR': 'Delhi',
  Mumbai: 'Maharashtra',
  Bengaluru: 'Karnataka',
  Hyderabad: 'Telangana',
  Chennai: 'Tamil Nadu',
  Ahmedabad: 'Gujarat',
  Kolkata: 'West Bengal',
  Pune: 'Maharashtra',
  Chandigarh: 'Chandigarh',
  Jaipur: 'Rajasthan',
  Kochi: 'Kerala',
  Lucknow: 'Uttar Pradesh',
  Surat: 'Gujarat',
  Goa: 'Goa',
  'Other (India)': ''
};

// Module-scope token cache. Lives as long as the serverless container
// is warm. Cold start re-refreshes — one extra hop, fine.
let cachedToken: { value: string; expiresAt: number } | null = null;

// fetch() with a single auto-retry on TCP-level failures only. Lead
// inserts aren't idempotent so we never retry on HTTP errors —
// retrying a 5xx that may have actually committed the lead would
// create silent duplicates. Connect-level errors are safe to retry
// because the request never reached Zoho's app layer.
async function fetchWithConnectRetry(
  url: string,
  init: RequestInit,
  maxAttempts = 2
): Promise<Response> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fetch(url, init);
    } catch (err: unknown) {
      lastErr = err;
      const cause = (err as { cause?: { code?: string } })?.cause;
      const retriable =
        cause?.code === 'UND_ERR_CONNECT_TIMEOUT' ||
        cause?.code === 'ECONNRESET' ||
        cause?.code === 'ECONNREFUSED' ||
        cause?.code === 'ETIMEDOUT' ||
        cause?.code === 'ENOTFOUND';
      if (!retriable || attempt === maxAttempts) throw err;
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  throw lastErr;
}

// Get a valid Zoho access token. Refreshes inline if the cached token
// is missing or about to expire (5-minute safety margin so we don't
// hand out a token that dies mid-flight).
async function getAccessToken(forceRefresh = false): Promise<string> {
  const now = Date.now();
  if (
    !forceRefresh &&
    cachedToken &&
    cachedToken.expiresAt > now + 5 * 60_000
  ) {
    return cachedToken.value;
  }

  const res = await fetchWithConnectRetry(`${ACCOUNTS}/oauth/v2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN
    })
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(
      `Zoho token refresh failed (${res.status}): ${errText.slice(0, 200)}`
    );
  }

  const json = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
  };

  if (!json.access_token) {
    throw new Error(
      `Zoho token refresh returned no access_token: ${json.error ?? 'unknown'}`
    );
  }

  cachedToken = {
    value: json.access_token,
    expiresAt: now + (json.expires_in ?? 3600) * 1000
  };
  return json.access_token;
}

export async function POST(req: NextRequest) {
  try {
    // ── 0. Origin + rate-limit gate ───────────────────────────────
    // Same-origin only. Rejects scripted submissions from arbitrary
    // domains. 10 leads per IP per hour caps the abuse surface; real
    // visitors never approach this rate, but it's loose enough for
    // QA testing without triggering on every reload during the same
    // session.
    if (!isAllowedOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (rateLimited(clientIp(req), 10, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // ── 1. Validate env ────────────────────────────────────────────
    if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
      console.error('[lead] Missing Zoho credentials in env');
      return NextResponse.json(
        { error: 'Server not configured.' },
        { status: 500 }
      );
    }

    // ── 2. Parse + validate input ─────────────────────────────────
    const body = await req.json();

    // Honeypot. If a bot fills the hidden `website` input, return 200
    // silently — bot thinks it succeeded, no lead lands in Zoho.
    if (typeof body.website === 'string' && body.website.length > 0) {
      return NextResponse.json({ ok: true });
    }

    const name = String(body.name ?? '').trim();
    const phone = String(body.phone ?? '').replace(/\D/g, '');
    const email = String(body.email ?? '').trim();
    const location = String(body.location ?? '').trim();
    const budget = String(body.budget ?? '').trim();
    const timeline = String(body.timeline ?? '').trim();

    // UTMs: keep only non-empty, non-"NA" values. Google Ads
    // tracking templates can resolve {campaignid} to the literal
    // string "NA" when no campaign id is set — strip it.
    const rawUtm = (body.utm ?? {}) as Record<string, unknown>;
    const utm: Record<UTMField, string> = {} as Record<UTMField, string>;
    UTM_FIELDS.forEach((k) => {
      const v = String(rawUtm[k] ?? '').trim();
      utm[k] = v && v.toUpperCase() !== 'NA' ? v : '';
    });

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required.' },
        { status: 400 }
      );
    }
    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit phone number.' },
        { status: 400 }
      );
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // ── 3. Build the Zoho record ──────────────────────────────────
    // Lead_Status is set explicitly because REST does NOT apply
    // picklist defaults the Zoho UI would. Without it, leads land
    // with null status and disappear from the sales team's "Fresh"
    // filter.
    const record: Record<string, string> = {
      Last_Name: name,
      Mobile: phone,
      Lead_Source: 'Website- Magppie',
      Lead_Status: 'Not Contacted Yet'
    };
    if (email) record.Email = email;
    if (location) record.City = location;

    const state = STATE_MAP[location];
    if (state) record.State1 = state;
    // Allow callers to send `state` directly. The site form does this —
    // its state picker covers all 28 Indian states + 8 UTs, much richer
    // than the 14-city STATE_MAP fallback. This overrides the derived
    // value when present.
    const explicitState = String(body.state ?? '').trim();
    if (explicitState) record.State1 = explicitState;

    if (budget) record.Est_Budget = budget;
    if (timeline) record.How_Soon_Do_You_Require_Magppie = timeline;

    UTM_FIELDS.forEach((k) => {
      if (utm[k]) record[k] = utm[k];
    });

    // ── 4. POST to Zoho ───────────────────────────────────────────
    const submit = async (forceFresh = false): Promise<Response> => {
      const accessToken = await getAccessToken(forceFresh);
      return fetchWithConnectRetry(`${API_BASE}/crm/v5/Leads`, {
        method: 'POST',
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: [record] })
      });
    };

    let res = await submit();
    // 401 = stale token (race between cache + revoke). Force a fresh
    // token and retry once. Belt-and-suspenders.
    if (res.status === 401) res = await submit(true);

    const zohoJson = await res.json().catch(() => null);

    // ── 5. Parse Zoho's response ──────────────────────────────────
    type ZohoDup = {
      api_name?: string;
      duplicate_record?: { id?: string };
    };
    type ZohoErrEntry = {
      code?: string;
      details?: ZohoDup;
    };
    type ZohoFirst = {
      status?: string;
      code?: string;
      message?: string;
      details?: { id?: string; errors?: ZohoErrEntry[] };
    };
    const first = (zohoJson as { data?: ZohoFirst[] } | null)?.data?.[0];

    // Duplicate handling: from the visitor's view, "your details are
    // on file" IS success. We never UPSERT — that would overwrite the
    // first-touch UTM attribution data, which is the whole point of
    // capturing UTMs.
    const isDirectDup = first?.code === 'DUPLICATE_DATA';
    const nestedErrors = first?.details?.errors;
    const isWrappedDup =
      first?.code === 'MULTIPLE_OR_MULTI_ERRORS' &&
      Array.isArray(nestedErrors) &&
      nestedErrors.length > 0 &&
      nestedErrors.every((e) => e.code === 'DUPLICATE_DATA');

    if (isDirectDup || isWrappedDup) {
      const existingId =
        first?.details?.id ??
        nestedErrors?.[0]?.details?.duplicate_record?.id;
      return NextResponse.json({
        ok: true,
        duplicate: true,
        id: existingId
      });
    }

    if (!res.ok) {
      console.error('[lead] Zoho REST rejected', res.status, zohoJson);
      return NextResponse.json(
        {
          error: `We could not submit your enquiry. (Zoho ${res.status})`,
          debug: zohoJson
        },
        { status: 502 }
      );
    }

    if (first?.status !== 'success') {
      console.error('[lead] Zoho REST non-success', first);
      return NextResponse.json(
        {
          error: first?.message || 'Lead submission failed.',
          debug: first
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, id: first.details?.id });
  } catch (err) {
    console.error('[lead] server error', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
