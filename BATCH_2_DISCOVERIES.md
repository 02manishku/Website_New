# Batch 2 — Out-of-Scope Discoveries

> Surfaced during Batch 2 execution.

---

## D-03 — Phase 4 (asset generation) deferred by owner

**Decision:** "go" (after "WHAT IF I DO THIS LATER"). Owner has chosen to defer the OG / PWA / apple-icon generation step until they place the source files at `../magppie-source-assets/`.

**Findings deferred (still OPEN at end of Batch 2):**
- **I-01** — 7 OG images referenced by pages don't exist on disk
- **I-02** — 3 PWA manifest icons don't exist on disk
- **I-03** — `app/apple-icon.png` doesn't exist

**Effect on build:** none — Next.js doesn't fail on missing `/public/*` references. They surface at runtime as 404s (broken social previews, fallback to favicon for PWA install / iOS home-screen).

**Resume path:** drop the 8 source files into `../magppie-source-assets/` per the Phase 3 list, then run `node scripts/generate-social-assets.mjs`. The script is created in this batch (Phase 4 sub-step 4.0).

---

## D-04 — Phase 13 (founder + coordinates) deferred by owner

**Decision:** same "go" reply.

**Findings deferred:**
- **M-01** — Founder name placeholder in `lib/seo.ts:55`
- **M-02** — 9 showroom lat/lng placeholders in `lib/seo.ts:198`

**Effect on build:** none. JSON-LD ships with placeholder values; Google's Knowledge Graph picks up incorrect data until owner replaces.

**Resume path:** owner pastes founder name + 9 coordinate pairs; I'll edit `lib/seo.ts` and remove the TODO markers in one commit.

---

## D-05 — Resend SDK validates API key at construction (build-time crash)

**Discovered at:** Phase 11 build verification (`next build` post-CSP).

**Symptom:** `npx next build` failed during the "Collecting page data" step with `Error: Missing API key. Pass it to the constructor `new Resend("re_123")``. Stack pointed at `.next/server/app/api/newsletter/route.js`.

**Root cause:** `resend@latest` (the version `npm install resend` brought in during Phase 6.1) throws synchronously in its constructor when `RESEND_API_KEY` is empty. The route initialised Resend at module scope, so Next's page-data collector hit the constructor with an empty env and crashed before the build could finish.

**Fix:** Moved `new Resend(process.env.RESEND_API_KEY)` inside the POST handler, gated by an early `if (!process.env.RESEND_API_KEY)` short-circuit that logs and returns 200 without trying to construct the client. Build now completes; runtime gracefully accepts emails when the key is unset (per the Phase 6 design intent).

**Captured in commit `<see chore(api): lazy-init Resend>`.**

This was a one-shot fix-while-passing — keeping it logged because the Phase 6.4 source-of-truth code in the prompt also instantiates Resend at module scope. If a future contributor copies that pattern, they will hit the same wall.

---

## D-06 — Sentry (Phase 12.2 / N-02) deferred by owner

**Decision:** owner reply at Phase 12.2 STOP gate: defer Sentry; wire later.

**Finding deferred:** **N-02** — Server / client error monitoring is unwired. Vercel build / runtime logs are the only error surface until Sentry lands.

**Effect on build:** none. The site has no Sentry imports yet; CSP `connect-src` already whitelists `*.sentry.io` so the wire-up is non-breaking when it happens.

**Resume path:** create a project at sentry.io named `magppie-web`, paste the DSN. I'll add the three config files (`sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`), update `next.config.js` to wrap with `withSentryConfig`, and append `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` to `.env.example`. ~30 minutes of work.

---

## (Subsequent discoveries will be appended below as they arise.)
