'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Lenis smooth-scroll, wired into the GSAP ticker so ScrollTrigger updates
 * in lock-step with Lenis's interpolated scroll position. This is the
 * standard "Awwwards-feel" stack: native wheel/touch input is captured by
 * Lenis, smoothed via lerp, and ScrollTrigger animations scrub against
 * the interpolated value rather than the raw scroll pixel.
 *
 * Notes:
 *  - smoothWheel: true gives the buttery wheel/trackpad feel on desktop.
 *  - syncTouch defaults to false, which is correct: iOS / Android already
 *    smooth touch scroll natively; overriding feels like input lag.
 *  - lerp 0.1 is a balanced default. Lower = more glassy & laggy, higher
 *    = closer to native (snappier).
 *  - The component renders nothing; it's a pure side-effect mount.
 *  - prefers-reduced-motion users get native scroll, no Lenis.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      // Higher duration = slower momentum decay. 1.2s is the Studio
      // Freight default — feels intentional without being sluggish.
      duration: 1.2,
      // EaseOutExpo, the curve every smooth-scroll demo on the web uses.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Lerp factor for wheel smoothing, 0.1 is the sweet spot.
      lerp: 0.1
    });

    function raf(time: number) {
      lenis.raf(time * 1000);
    }

    // Hand the GSAP ticker the Lenis raf loop. ScrollTrigger.update is
    // fired by Lenis's own scroll event — keeps animations perfectly in
    // sync with the interpolated scroll position rather than the
    // (jumpy) native scroll pixel.
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(raf);
    // Disable lag-smoothing so animations don't desync if the tab is
    // backgrounded for a while.
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
