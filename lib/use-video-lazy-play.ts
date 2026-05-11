'use client';

import { useCallback, useEffect, useRef } from 'react';
import { requestPlay, releasePlay } from './video-coordinator';

// Universal lazy-play hook for every <video> on the site.
//
// Returns a **callback ref** (not a RefObject). React invokes the
// callback every time a <video> element attaches OR detaches —
// crucially, this means when one component swaps its conditionally-
// rendered <video> for another (e.g. WoodVsStone's active stage
// changing as the user scrolls), the hook tears down observers on
// the old element and sets up fresh observers on the new one.
//
// iOS Safari is the hard target — it rejects `v.play()` silently when
// the video has insufficient data buffered, even for muted+playsInline
// videos. So the three-stage flow is more aggressive than the typical
// "upgrade preload to metadata" pattern:
//
//   Stage 1  — IntersectionObserver at rootMargin: 200 px. Upgrade
//              preload="none" → "auto" (NOT "metadata", which iOS
//              doesn't buffer enough of for play() to succeed). Call
//              v.load() to actually start the network fetch — setting
//              `preload` after construction is just a hint, not a
//              trigger.
//   Stage 2  — IntersectionObserver at the configured threshold. When
//              enough of the element is visible, request the global
//              coordinator's play slot (max 1 concurrent). The play
//              call is wrapped in a `canplay` retry: if play() rejects
//              because data isn't ready, we listen once for `canplay`
//              and try again. iOS reliably autoplays muted+playsInline
//              videos once data is buffered.
//   Stage 3  — `document.visibilitychange`. Tab hidden? Pause.
//              Tab shown again? Re-request if still in view.
//
//   Cleanup  — When React detaches the element (passes null to the
//              callback), pause, release slot, strip src, force
//              `load()` to release the iOS hardware decoder.
//
// IMPORTANT: every <video> consuming this hook ALSO needs the
// `autoPlay` JSX attribute. iOS Safari's native autoplay logic for
// muted+playsInline videos is the most reliable trigger; the hook's
// programmatic play() is a backup for when the autoplay attribute
// gets ignored (low power mode, reduced motion preference, etc).

type LazyPlayCallbackRef = (v: HTMLVideoElement | null) => void;

export function useVideoLazyPlay(threshold = 0.25): LazyPlayCallbackRef {
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, []);

  return useCallback(
    (v: HTMLVideoElement | null) => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      if (!v) return;

      let inView = false;
      let canPlayHandler: (() => void) | null = null;

      // play() that retries via the `canplay` event when iOS rejects
      // because data hasn't buffered. Only one canplay handler is
      // attached at a time — replaced if play is requested again.
      const playWithRetry = () => {
        const tryPlay = () => {
          const p = requestPlay(v);
          if (p && typeof p.catch === 'function') {
            p.catch(() => {
              if (canPlayHandler) {
                v.removeEventListener('canplay', canPlayHandler);
              }
              canPlayHandler = () => {
                if (canPlayHandler) {
                  v.removeEventListener('canplay', canPlayHandler);
                  canPlayHandler = null;
                }
                if (inView) {
                  const p2 = requestPlay(v);
                  if (p2 && typeof p2.catch === 'function') {
                    p2.catch(() => {});
                  }
                }
              };
              v.addEventListener('canplay', canPlayHandler);
            });
          }
        };
        tryPlay();
      };

      // Stage 1: upgrade preload + kick off network fetch.
      const preloadObs = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting && v.preload !== 'auto') {
              v.preload = 'auto';
              try {
                // Setting preload alone doesn't trigger the browser
                // to start fetching when preload was previously
                // "none". load() forces the network fetch + decode.
                v.load();
              } catch {
                // Some browsers throw when load() is called mid-
                // navigation. Ignore — the visible-state handler
                // will retry play() once metadata fires.
              }
            }
          }
        },
        { rootMargin: '200px' }
      );
      preloadObs.observe(v);

      // Stage 2: play / pause on actual visibility.
      const playObs = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            inView =
              e.isIntersecting && e.intersectionRatio >= threshold;
            if (inView) {
              if (process.env.NODE_ENV !== 'production') {
                // eslint-disable-next-line no-console
                console.info(
                  '[video] requestPlay',
                  v.currentSrc || v.src
                );
              }
              playWithRetry();
            } else if (!v.paused) {
              v.pause();
              releasePlay(v);
            }
          }
        },
        { threshold: [0, threshold, 1] }
      );
      playObs.observe(v);

      // Stage 3: pause on tab hidden, resume on show if still in view.
      const onVis = () => {
        if (document.visibilityState === 'hidden') {
          v.pause();
          releasePlay(v);
        } else if (inView) {
          playWithRetry();
        }
      };
      document.addEventListener('visibilitychange', onVis);

      cleanupRef.current = () => {
        preloadObs.disconnect();
        playObs.disconnect();
        document.removeEventListener('visibilitychange', onVis);
        if (canPlayHandler) {
          v.removeEventListener('canplay', canPlayHandler);
          canPlayHandler = null;
        }
        try {
          v.pause();
          releasePlay(v);
          v.removeAttribute('src');
          v.load();
        } catch {
          // element may already be detached; ignore
        }
      };
    },
    [threshold]
  );
}
