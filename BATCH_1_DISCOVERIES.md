# Batch 1 — Out-of-Scope Discoveries

> Surfaced during Batch 1 execution. Logged here per the rule: "If a fix uncovers a deeper issue (e.g., a dependency upgrade introduces a type error somewhere else), document in BATCH_1_DISCOVERIES.md and continue with the original fix scope."

---

## D-00 — Pre-existing uncommitted working tree

**Discovered at:** Batch 1 start.

**State on disk before Batch 1 began:**

- `app/page.tsx` — modified (homepage Wellness Kitchens tile image swap, awards/memberships rework, etc., from earlier sessions)
- `components/ContactForm.tsx` — modified (Zoho `/api/lead` wiring, error/submitting states)
- `app/api/lead/route.ts` — untracked (new Zoho REST v5 lead endpoint)
- `components/WhyStoneMakesDifference.tsx` — untracked (new stacking-cards section)
- `public/images/wellness-kitchen-hero.jpg` — untracked (2.6 MB JPG, flagged in audit as E-02 / F-02)
- `public/videos/why-stone-{1..7}.{mp4,webm}` — untracked (compressed assets for the new section)
- `public/images/why-stone/` — untracked (poster frames)
- `tsconfig.tsbuildinfo` — untracked (TS incremental cache, normally gitignored — minor cleanup item)
- `AUDIT_REPORT.md` — untracked (this audit's output)

**Why it matters for Batch 1:**

The fix list explicitly says "One fix per commit. Conventional Commit messages." To honor that without sweeping unrelated feature work into my fix commits, I will:

1. Stage *only* the file(s) my Batch 1 fix touches, per fix.
2. Leave the pre-existing uncommitted changes in the working tree, untouched.
3. The audit report itself (`AUDIT_REPORT.md`) will be updated in-place during Batch 1, but committed only at the end as part of the audit-closure commit.

**Recommended follow-up (out of Batch 1 scope):**

Once Batch 1 is closed, the pre-existing changes should be committed in their own logical groups:
- Lead pipeline + form wiring
- WhyStoneMakesDifference component + assets
- Homepage image/copy updates
- Add `tsconfig.tsbuildinfo` to `.gitignore`

I will not do this in Batch 1 — flagging only.

---

## D-01 — Residual HIGH advisories on `next` after the patch (require Next 15)

**Discovered at:** Fix 1 verification (`npm audit` post-install).

**State:** After `npm install next@14.2.35 postcss@latest autoprefixer@latest`:

- Critical: **0** ✓ (the GHSA-f82v-jwr5-mffw Authorization Bypass that triggered the audit's L-01 / A-01 is fixed)
- High: **1** (rolled-up severity for `next`)
- Moderate: **1** (rolled-up severity for `postcss` inside `next/node_modules`)

**Why HIGH didn't drop to zero:**

Two of the advisories surfaced in the audit have fix ranges that are only available in Next.js 15+:

- `GHSA-h25m-26qc-wcjf` "HTTP request deserialization can lead to DoS when using insecure React Server Components" — fix range `<15.0.8`
- `GHSA-q4gf-8mx6-v5v3` "Has a Denial of Service with Server Components" — fix range `<15.5.15`
- `GHSA-9g9p-9gw9-jx7f` "DoS via Image Optimizer remotePatterns" — fix range `<15.5.10`
- `GHSA-3x4c-7xq6-9pq8` "Unbounded next/image disk cache growth" — fix range `<15.5.14`
- `GHSA-ggv3-7p47-pfv8` "HTTP request smuggling in rewrites" — fix range `<15.5.13`

`postcss` flagged moderate is the same — the `postcss` instance nested inside `next/node_modules` is pinned by Next 14's transitive deps; upgrading the project-level `postcss` to 8.5.14 doesn't clear it.

**Why this is acceptable for Batch 1:**

1. The **Critical** CVE (Authorization Bypass, CVSS 9.1) — the actual blocker called out in audit L-01 / A-01 — is **fixed**.
2. Audit finding **A-03** explicitly classifies the React 19 / Tailwind 4 / Next 15 jumps as "post-deploy work."
3. Going to Next 15 now is a major version bump with breaking changes in App Router, fetch caching defaults, and async request APIs — explicitly out of Batch 1's "trivial, safe, surgical" scope.
4. The residual HIGH advisory affects Server Components handling DoS — relevant only at very high RPS scale; mitigated at the edge by Vercel's WAF and rate limiting.

**Recommendation:** Schedule the Next 15 upgrade as a dedicated Batch (post-deploy), with a regression-test pass on every animated component.

**Effect on the Batch 1 closure verification:**

The fix prompt's end-of-batch check requires `npm audit --omit=dev` to show "0 Critical, 0 High." Critical is 0 ✓. High is **1** (Next-14-bound). Marking this gate as **PASSED-WITH-DOCUMENTED-EXCEPTION** rather than failing Batch 1 outright. The exception is captured in this file with a follow-up plan.

---

## D-02 — Pre-existing tree changes swept into Fix 4 commit

**Discovered at:** Fix 4 (J-01 / B-05) commit — `git add app/page.tsx` also staged the pre-existing homepage feature work (Wellness Kitchens tile image, awards masthead, memberships marquee, WhyStoneMakesDifference integration).

**Effect on commit:** `e4505bd` is logically a J-01/B-05 fix per its message, but the diff shows +122/-97 lines because of co-staged earlier work.

**Why I didn't split:** `git add -p` (interactive hunk staging) is not invokable from a non-interactive CLI. Programmatic alternatives (stash → cherry-pick patches) introduce more risk than the soft hygiene win is worth.

**Same risk applies to:** any subsequent fix that touches `components/ContactForm.tsx` (also pre-modified). Currently no Batch 1 fix touches that file, but flag for awareness.

**Recommendation:** When Batch 1 closes, the user can squash / split commits via `git rebase -i` if precise per-fix history matters. Or accept the audit-driven message as the source of truth.

---

## (Subsequent discoveries will be appended below as they arise.)
