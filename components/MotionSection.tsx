'use client';

// audited 2026-05-09 — H-01: tween.scrollTrigger?.kill() + tween.kill() in
// cleanup, prefers-reduced-motion bypass, opacity + y (transform) only.

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type MotionSectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  style?: CSSProperties;
  // Initial Y offset (px) before the reveal. 30 is the tasteful default
  // — a subtle settle, not a dramatic slide.
  y?: number;
  // Reveal duration in seconds.
  duration?: number;
  // ScrollTrigger start position. Default fires the reveal when the
  // top of the section reaches 80px above the bottom of the viewport.
  start?: string;
};

/**
 * MotionSection. A `<section>` wrapper that fades + rises into place
 * the first time it enters the viewport.
 *
 * The animation curve is GSAP's `power4.out` — silky exponential
 * settle, no bounce. This is the "out-quint" curve every Awwwards
 * Site of the Day uses for section entrances; it feels designed
 * rather than computed.
 *
 * Stacks cleanly on top of internal animations (ScrollFloat headings,
 * Reveal grids): the section fades in, then the sub-animations play
 * over the now-visible content. No conflict with CSS opacity since
 * GSAP writes inline transforms.
 *
 * prefers-reduced-motion users get the section in its final state
 * with no reveal.
 */
export default function MotionSection({
  children,
  className = '',
  id,
  style,
  y = 30,
  duration = 1.0,
  start = 'top bottom-=80'
}: MotionSectionProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    gsap.set(el, { opacity: 0, y });

    const tween = gsap.to(el, {
      opacity: 1,
      y: 0,
      duration,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: 'play none none none'
      }
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [y, duration, start]);

  return (
    <section ref={ref} className={className} id={id} style={style}>
      {children}
    </section>
  );
}
