'use client';

import { useEffect } from 'react';

// User-gesture autoplay primer for iOS Safari (and any other mobile
// browser that quietly denies HTMLMediaElement.play() before a first
// gesture). When `autoplay` + `muted` + `playsInline` should work but
// doesn't — Low Power Mode, Reduced Motion preference, certain iOS
// versions in private browsing, certain network-saver modes — the
// browser ALWAYS permits .play() after a touchstart/scroll/click.
//
// This component listens once for the first gesture of any kind,
// then calls .play() on every <video> currently in the viewport.
// Off-screen videos are skipped so we don't burn iOS decoder
// budget. Native autoplay still does its job on capable devices;
// this primer just rescues the edge cases.

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
      // Run on next frame so the gesture event finishes propagating
      // first — some iOS versions reject .play() if called inside
      // the gesture handler's micro-task queue.
      requestAnimationFrame(() => {
        const videos = document.querySelectorAll('video');
        videos.forEach((v) => {
          // Only kick videos that should already be visible. Off-
          // screen videos with autoplay will start on their own
          // when scrolled into view.
          if (isInView(v)) {
            const p = v.play();
            if (p && typeof p.catch === 'function') {
              p.catch(() => {});
            }
          }
        });
      });
    };

    // `once` fires the handler at most one time and auto-removes.
    document.addEventListener('touchstart', prime, { once: true, passive: true });
    document.addEventListener('scroll', prime, { once: true, passive: true });
    document.addEventListener('click', prime, { once: true });
    document.addEventListener('keydown', prime, { once: true });

    return () => {
      document.removeEventListener('touchstart', prime);
      document.removeEventListener('scroll', prime);
      document.removeEventListener('click', prime);
      document.removeEventListener('keydown', prime);
    };
  }, []);

  return null;
}
