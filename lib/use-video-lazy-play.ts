'use client';

import { useEffect, useRef } from 'react';
import { requestPlay, releasePlay } from './video-coordinator';

// Universal lazy-play hook for every <video> on the site.
//
// Three stages of pressure relief:
//
//   Stage 1  — IntersectionObserver at rootMargin: 200 px. When the
//              video element is within 200 px of viewport, upgrade
//              preload="none" → preload="metadata" so the browser
//              fetches just enough header to seek. Decoder still NOT
//              allocated.
//   Stage 2  — IntersectionObserver at threshold 0.25. When the video
//              is 25% visible, ask the video-coordinator for the play
//              slot (max 1 concurrent). On scroll-out, pause and
//              release the slot.
//   Stage 3  — `document.visibilitychange`. Tab hidden? Pause everything.
//              Tab shown again? Play if still in view. Saves battery
//              + iOS background-tab memory.
//
//   Cleanup  — pause, release slot, remove src, force `video.load()`
//              to release the decoder context. iOS Safari only frees
//              the hardware decoder on src strip + load(), nothing
//              else.
//
// The hook returns a ref that must be attached to the <video> element.

export function useVideoLazyPlay(threshold = 0.25) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    let inView = false;

    // Stage 1: upgrade preload as we near the viewport.
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
          inView = e.isIntersecting && e.intersectionRatio >= threshold;
          if (inView) {
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

    return () => {
      preloadObs.disconnect();
      playObs.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      try {
        v.pause();
        releasePlay(v);
        v.removeAttribute('src');
        v.load(); // forces decoder release on iOS
      } catch {
        // ignore — element may already be detached
      }
    };
  }, [threshold]);

  return ref;
}
