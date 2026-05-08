'use client';

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

type Direction = 'up' | 'down' | 'left' | 'right';

type MaskRevealProps = {
  children: ReactNode;
  className?: string;
  // Direction the mask retracts. 'up' (default): mask starts covering
  // the bottom and pulls upward, exposing the image from top down.
  // (Reads like a photographer's print emerging in a darkroom tray.)
  direction?: Direction;
  duration?: number;
  delay?: number;
};

const FROM_CLIP: Record<Direction, string> = {
  up:    'inset(0 0 100% 0)',  // mask hides bottom, reveals top→bottom
  down:  'inset(100% 0 0 0)',  // mask hides top, reveals bottom→top
  left:  'inset(0 100% 0 0)',  // mask hides right, reveals left→right
  right: 'inset(0 0 0 100%)'   // mask hides left, reveals right→left
};

/**
 * MaskReveal. Wraps an image / video / any block and animates
 * `clip-path` from a 100%-covered inset to `inset(0)` (fully revealed)
 * the first time the element enters the viewport.
 *
 * This is the "Awwwards 2024" image entrance — much more cinematic
 * than fade-up, because the image is *uncovered* rather than faded
 * in. The eye reads it as a deliberate reveal, not a load.
 *
 * Layout-safe: doesn't change `position`, `display`, or sizing of
 * its child. Drop it around any `<div className="relative aspect-..."`
 * media wrapper and it just works.
 *
 * Initial clip-path is set inline so the SSR'd HTML matches what
 * GSAP applies in `useEffect` — no flash of fully-visible image
 * before the mask kicks in.
 *
 * prefers-reduced-motion users get the image fully revealed, instant.
 */
export default function MaskReveal({
  children,
  className = '',
  direction = 'up',
  duration = 1.4,
  delay = 0
}: MaskRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) {
      gsap.set(el, { clipPath: 'inset(0)' });
      return;
    }

    gsap.set(el, {
      clipPath: FROM_CLIP[direction],
      // GPU promote during the animation so the compositor handles the
      // mask change without repainting the whole layer. Removed in
      // onComplete so we don't keep an idle layer around afterwards.
      willChange: 'clip-path'
    });

    const tween = gsap.to(el, {
      clipPath: 'inset(0)',
      duration,
      delay,
      // power4.inOut: slow start, accelerate, slow end. Reads as
      // intentional and weighty — the image isn't blinking on, it's
      // being uncovered.
      ease: 'power4.inOut',
      onComplete: () => {
        // Strip the clip-path entirely once revealed — keeping
        // `inset(0)` on the element leaves a clip-path stacking
        // context active, which costs compositor work on every
        // subsequent paint (especially expensive over a video).
        el.style.clipPath = '';
        el.style.willChange = '';
      },
      scrollTrigger: {
        trigger: el,
        start: 'top bottom-=120',
        toggleActions: 'play none none none'
      }
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [direction, duration, delay]);

  // Match the GSAP initial state in the inline style so SSR'd output
  // ships with the mask already applied; avoids the flash where the
  // image renders fully-visible for one frame before JS hydrates.
  const initialStyle: CSSProperties = {
    clipPath: FROM_CLIP[direction]
  };

  return (
    <div ref={ref} className={className} style={initialStyle}>
      {children}
    </div>
  );
}
