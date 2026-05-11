'use client';

import { useEffect } from 'react';

// User-gesture autoplay primer for iOS Safari (and any other mobile
// browser that quietly denies HTMLMediaElement.play() before a first
// gesture). When `autoplay` + `muted` + `playsInline` should work but
// doesn't — Low Power Mode, Reduced Motion preference, certain iOS
// versions in private browsing, certain network-saver modes — the
// browser ALWAYS permits .play() after a touchstart/scroll/click.
//
// Two iOS-specific gotchas this primer deliberately respects:
//
//   1. The .play() call MUST happen synchronously inside the gesture
//      handler. Deferring with requestAnimationFrame or setTimeout
//      loses the user-gesture context, and iOS Safari then blocks the
//      .play() call with NotAllowedError. Earlier version of this
//      primer used rAF and silently failed on iOS.
//
//   2. If the video's readyState is 0 (HAVE_NOTHING — no data yet)
//      calling .play() returns a rejected Promise. We call v.load()
//      first to kick off the network fetch, then .play() — iOS picks
//      up the load and starts playback once the first frame buffers.

export default function VideoAutoplayPrimer() {
  useEffect(() => {
    let primed = false;

    const isInView = (v: HTMLVideoElement) => {
      const rect = v.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      return rect.top < vh && rect.bottom > 0;
    };

    const prime = () => {
      if (primed) return;
      primed = true;
      // Synchronous play loop — must stay inside the user-gesture
      // handler frame so iOS does not reject .play().
      const videos = document.querySelectorAll('video');
      videos.forEach((v) => {
        if (!isInView(v)) return;
        try {
          if (v.readyState === 0) {
            v.load();
          }
          const p = v.play();
          if (p && typeof p.catch === 'function') {
            p.catch(() => {
              // Final fallback: retry once when the element reaches
              // canplay state. After this the lazy-play hook keeps
              // managing the lifecycle.
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
          // Swallow — element might be detached mid-event.
        }
      });
    };

    // `once: true` removes the listener after a single fire. Multiple
    // gesture types because iOS Safari fires touchstart on tap and
    // scroll on flick; either one is enough to unlock autoplay.
    document.addEventListener('touchstart', prime, { once: true, passive: true });
    document.addEventListener('touchend', prime, { once: true, passive: true });
    document.addEventListener('scroll', prime, { once: true, passive: true });
    document.addEventListener('click', prime, { once: true });
    document.addEventListener('keydown', prime, { once: true });
    document.addEventListener('pointerdown', prime, { once: true });

    return () => {
      document.removeEventListener('touchstart', prime);
      document.removeEventListener('touchend', prime);
      document.removeEventListener('scroll', prime);
      document.removeEventListener('click', prime);
      document.removeEventListener('keydown', prime);
      document.removeEventListener('pointerdown', prime);
    };
  }, []);

  return null;
}
