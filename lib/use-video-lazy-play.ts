'use client';

import { useCallback, useEffect, useRef } from 'react';
import { requestPlay, releasePlay } from './video-coordinator';

// Universal lazy-play hook for every <video> on the site.
//
// Returns a **callback ref** (not a RefObject). React invokes the
// callback every time a <video> element attaches OR detaches —
// crucially, this means when one component swaps its conditionally-
// rendered <video> for another (e.g. WhyStone's active card changing
// as the user scrolls), the hook tears down observers on the old
// element and sets up fresh observers on the new one.
//
// The previous useRef + useEffect([]) implementation captured
// ref.current at mount time and never re-ran — so if the video wasn't
// in the DOM yet, the hook bailed permanently. Videos that mounted
// later (active-card swaps, capability gate flips) got NO observers
// and never auto-played.
//
// Three stages of pressure relief per element:
//
//   Stage 1  — IntersectionObserver at rootMargin: 200 px. When the
//              video is within 200 px of viewport, upgrade
//              preload="none" → preload="metadata".
//   Stage 2  — IntersectionObserver at threshold 0.25. When 25%
//              visible, ask the video-coordinator for the play slot
//              (max 1 concurrent globally). Pause + release on
//              scroll-out.
//   Stage 3  — `document.visibilitychange`. Tab hidden? Pause.
//              Tab shown again? Play if still in view.
//
//   Cleanup  — When React detaches the element (passes null to the
//              callback), pause, release slot, strip src, force
//              `load()` to release the iOS hardware decoder.
//
// Usage:
//   const videoRef = useVideoLazyPlay();
//   <video ref={videoRef} playsInline muted ... />
//
// For components that ALSO need to access the underlying element
// (e.g. PoolsideKitchenBanner with its custom loop-seek), wrap with
// a combined callback ref that captures the element in a useRef too.

type LazyPlayCallbackRef = (v: HTMLVideoElement | null) => void;

export function useVideoLazyPlay(threshold = 0.25): LazyPlayCallbackRef {
  // Holds the cleanup fn for whatever element is currently attached.
  const cleanupRef = useRef<(() => void) | null>(null);

  // Component-unmount safety net: if the component using this hook
  // unmounts WITHOUT the ref callback being called with null first
  // (rare but possible during very fast navigation), make sure
  // observers + listeners aren't leaked.
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
      // Always tear down previous setup before attaching to a new
      // element. React calls this with null when the element detaches.
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      if (!v) return;

      // Fresh setup for the new element.
      let inView = false;

      // Stage 1: upgrade preload as the element nears the viewport.
      const preloadObs = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting && v.preload === 'none') {
              v.preload = 'metadata';
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
              // Dev-only telemetry: confirms in console that the hook
              // fired requestPlay() with the right resolved source.
              // Stripped from production by next.config.js
              // compiler.removeConsole.
              if (process.env.NODE_ENV !== 'production') {
                // eslint-disable-next-line no-console
                console.info(
                  '[video] requestPlay',
                  v.currentSrc || v.src
                );
              }
              requestPlay(v);
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
          requestPlay(v);
        }
      };
      document.addEventListener('visibilitychange', onVis);

      cleanupRef.current = () => {
        preloadObs.disconnect();
        playObs.disconnect();
        document.removeEventListener('visibilitychange', onVis);
        try {
          v.pause();
          releasePlay(v);
          v.removeAttribute('src');
          v.load(); // forces iOS hardware decoder release
        } catch {
          // element may already be detached; ignore
        }
      };
    },
    [threshold]
  );
}
