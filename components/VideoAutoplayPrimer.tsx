'use client';

import { useEffect } from 'react';

// User-gesture autoplay primer for iOS Safari (and any other mobile
// browser that quietly denies HTMLMediaElement.play() outside a
// gesture context).
//
// Why persistent, not one-shot:
//
//   iOS Safari authorises .play() ONLY inside a synchronous user-
//   gesture handler. The IntersectionObserver in useVideoLazyPlay
//   fires when a video scrolls into view, but that callback runs in
//   its own task, not inside the scroll-event handler — so iOS
//   rejects the .play() and the video sits frozen on its poster.
//
//   A one-shot primer fixes the initial-load case (first video on
//   the page) but every subsequent scroll into a new video section
//   silently fails again. So this primer stays armed for the life of
//   the page, listens to every meaningful gesture, and on each one
//   synchronously calls .play() on every <video> currently in the
//   viewport that isn't already playing. Throttled to one pass per
//   200 ms so we don't burn cycles during high-frequency scroll.
//
//   .play() is called synchronously inside the gesture handler —
//   never deferred via rAF or setTimeout — because deferral loses
//   the gesture privilege.
//
// Decoder safety: only in-viewport, currently-paused videos are
// played. Off-screen videos are left alone — they autoplay (or stay
// paused) on their own when the lazy-play hook detects intersection.

const THROTTLE_MS = 200;

export default function VideoAutoplayPrimer() {
  useEffect(() => {
    let lastFire = 0;

    const isInView = (v: HTMLVideoElement) => {
      const rect = v.getBoundingClientRect();
      const vh =
        window.innerHeight || document.documentElement.clientHeight;
      const vw =
        window.innerWidth || document.documentElement.clientWidth;
      return (
        rect.top < vh &&
        rect.bottom > 0 &&
        rect.left < vw &&
        rect.right > 0
      );
    };

    const tryPlayVisible = () => {
      const now = Date.now();
      if (now - lastFire < THROTTLE_MS) return;
      lastFire = now;

      // Synchronous loop — must stay inside the user-gesture handler
      // frame so iOS does not reject .play().
      const videos = document.querySelectorAll('video');
      videos.forEach((v) => {
        // Only kick paused, visible videos. Already-playing videos
        // stay untouched; off-screen ones will be played by the
        // lazy-play hook when they scroll in.
        if (!v.paused) return;
        if (!isInView(v)) return;
        try {
          if (v.readyState === 0) {
            v.load();
          }
          const p = v.play();
          if (p && typeof p.catch === 'function') {
            p.catch(() => {
              // Final fallback per element: retry once on canplay.
              const retry = () => {
                v.removeEventListener('canplay', retry);
                const p2 = v.play();
                if (p2 && typeof p2.catch === 'function') {
                  p2.catch(() => {});
                }
              };
              v.addEventListener('canplay', retry, { once: true });
            });
          }
        } catch {
          // Element might be detached mid-event.
        }
      });
    };

    // Every gesture type that iOS Safari accepts as a "user gesture"
    // for autoplay authorisation. `passive: true` on the scroll/
    // touch ones keeps the page from competing with scroll for
    // composite priority. No `once` flag — we stay armed.
    document.addEventListener('touchstart', tryPlayVisible, { passive: true });
    document.addEventListener('touchend', tryPlayVisible, { passive: true });
    document.addEventListener('scroll', tryPlayVisible, { passive: true });
    document.addEventListener('click', tryPlayVisible);
    document.addEventListener('keydown', tryPlayVisible);
    document.addEventListener('pointerdown', tryPlayVisible);

    // Fire once on mount too, in case the video is already in view
    // and the browser is permissive enough to autoplay without any
    // gesture (most desktops, modern Android).
    tryPlayVisible();

    return () => {
      document.removeEventListener('touchstart', tryPlayVisible);
      document.removeEventListener('touchend', tryPlayVisible);
      document.removeEventListener('scroll', tryPlayVisible);
      document.removeEventListener('click', tryPlayVisible);
      document.removeEventListener('keydown', tryPlayVisible);
      document.removeEventListener('pointerdown', tryPlayVisible);
    };
  }, []);

  return null;
}
