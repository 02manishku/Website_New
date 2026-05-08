'use client';

import { useEffect, useState } from 'react';

// Persistence flag. Stored in sessionStorage so the preloader fires once
// per browser session — returning to a different route within the same
// session skips it. A localStorage flag would feel sticky on a luxury
// brand site (visitor returns next week, no preloader at all is colder).
const STORAGE_KEY = 'magppie:preloader-played';

// Total visible time before the slide-up exit begins. Long enough to read
// the brand mark, sub-line and tagline in sequence; short enough that
// nobody calls it a delay. Last animation completes around 1.55s — we
// hold a beat after, then begin the slide-up.
const HOLD_MS = 1750;
// Exit slide duration. After this we unmount the overlay entirely.
const EXIT_MS = 800;

/**
 * First-visit preloader. Fades in the brand mark + tagline + a thin
 * hairline rule, holds, then slides upward off-screen revealing the site.
 *
 * Pure CSS keyframe animations (no framer-motion) so SSR renders the
 * overlay HTML directly — no flash of homepage between server paint and
 * client hydration. Framer Motion's `AnimatePresence` was being skipped
 * on SSR, which defeated the whole point of an opaque preloader.
 *
 * Locks body scroll while visible so the user doesn't accidentally
 * scroll the homepage behind the overlay. Restores on exit.
 *
 * Skipped on subsequent same-session visits (sessionStorage) and for
 * users with `prefers-reduced-motion: reduce` — both go straight to
 * content via instant unmount.
 */
export default function Preloader() {
  // Three phases:
  //   'visible' — rendering, animations playing in
  //   'exiting' — slide-up class applied, transitioning out
  //   'gone'    — unmounted, returns null
  const [phase, setPhase] = useState<'visible' | 'exiting' | 'gone'>(
    'visible'
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const alreadySeen = sessionStorage.getItem(STORAGE_KEY) === '1';

    if (prefersReduced || alreadySeen) {
      // No animation, no scroll lock, no timers. Unmount instantly.
      setPhase('gone');
      return;
    }

    // First visit: lock background scroll while the overlay is up.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const exitTimer = window.setTimeout(() => {
      setPhase('exiting');
    }, HOLD_MS);

    const goneTimer = window.setTimeout(() => {
      setPhase('gone');
      sessionStorage.setItem(STORAGE_KEY, '1');
      document.body.style.overflow = prevOverflow;
    }, HOLD_MS + EXIT_MS);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(goneTimer);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (phase === 'gone') return null;

  return (
    <div
      // Fixed full-screen overlay. z-100 sits above the header (z-50)
      // and the newsletter teaser (z-40). The base bg-bone class keeps
      // the SSR'd HTML opaque so the homepage never bleeds through
      // before hydration.
      className={`fixed inset-0 z-[100] bg-bone flex items-center justify-center px-6 ${
        phase === 'exiting' ? 'preloader-exiting' : ''
      }`}
      aria-hidden="true"
    >
      <div className="text-center w-full max-w-[640px]">
        {/* Wordmark — leads the composition. font-light keeps the
            Seasons display from feeling heavy at this size. */}
        <div className="font-display font-light text-5xl sm:text-7xl lg:text-8xl text-ink leading-[0.95] tracking-tight preloader-wordmark">
          MAGPPIE
        </div>

        {/* Sub-line — kicker style, sits directly under the wordmark
            like a product line tag in a magazine masthead. */}
        <div className="kicker text-smoke mt-5 sm:mt-7 preloader-kicker">
          Wellness Kitchens
        </div>

        {/* Hairline rule that grows out from the left edge of its
            container. Same gesture as opening a magazine to a clean
            spread. */}
        <div
          className="mx-auto my-8 sm:my-10 h-px bg-ink/30 origin-left preloader-hairline"
          style={{ width: 'min(80vw, 14rem)' }}
        />

        {/* Tagline — italic display, low contrast, lands last. */}
        <div className="font-display italic text-smoke text-base sm:text-lg lg:text-xl preloader-tagline">
          For People and Planet
        </div>
      </div>
    </div>
  );
}
