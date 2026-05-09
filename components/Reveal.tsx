'use client';

// audited 2026-05-09 — H-01: both code branches (mobile per-child triggers,
// desktop single trigger) kill ScrollTrigger + tween in cleanup;
// prefers-reduced-motion bypass; only opacity + y (transform) animated.

import {
  useEffect,
  useRef,
  type ElementType,
  type ReactNode,
  type RefObject
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  // Initial vertical offset (px) before reveal. 24 ≈ subtle slide,
  // 64 ≈ dramatic; both with fade.
  y?: number;
  // Reveal duration per element (seconds).
  duration?: number;
  // Stagger between sequential child reveals. Set 0 to reveal everything
  // at once (treat the whole element as one unit).
  stagger?: number;
  // Whether to reveal each direct child as its own staggered entrance,
  // or treat the wrapper as one element. Useful for grids vs. paragraphs.
  staggerChildren?: boolean;
  // Delay before the reveal kicks in (seconds).
  delay?: number;
  // 0–1, how far into viewport the trigger fires. 0.85 ≈ when the top
  // of the element reaches 85% down the viewport.
  start?: string;
};

/**
 * Generic fade-up-on-enter reveal. Wraps a section or grid; on first
 * scroll into view, content fades and slides up — the most-shipped
 * animation on Awwwards-tier sites for a reason: it adds polish
 * without taking attention away from the content.
 *
 * Variants:
 *  - <Reveal>...</Reveal>           — single fade-up of the whole element.
 *  - <Reveal staggerChildren>       — each direct child reveals in
 *    sequence with `stagger` between them. Use for grid rows, news
 *    cards, pillar columns.
 *
 * prefers-reduced-motion users see the final state immediately.
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  className = '',
  y = 24,
  duration = 0.9,
  stagger = 0.1,
  staggerChildren = false,
  delay = 0,
  start = 'top bottom-=80'
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    // Below the lg breakpoint (~1024px) grids stack vertically, so a
    // single-trigger stagger wastes itself: by the time the wrapper
    // enters the viewport, only the first child is on screen and the
    // rest animate while still below the fold. On mobile we trigger
    // each child individually so each one fades in as it enters view.
    // Cascade stagger is preserved on desktop where the row is
    // horizontal and all children appear together.
    const isMobile = window.matchMedia('(max-width: 1023px)').matches;

    const targets = staggerChildren
      ? (Array.from(el.children) as HTMLElement[])
      : [el];

    if (prefersReduced) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(targets, { opacity: 0, y });

    // Per-child triggers on mobile when staggering — each card animates
    // as it actually enters the viewport.
    if (staggerChildren && isMobile) {
      const tweens = targets.map((target) =>
        gsap.to(target, {
          opacity: 1,
          y: 0,
          duration,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: target,
            start: 'top bottom-=60',
            toggleActions: 'play none none none'
          }
        })
      );
      return () => {
        tweens.forEach((t) => {
          t.scrollTrigger?.kill();
          t.kill();
        });
      };
    }

    // Desktop (or single-element wrappers): single trigger + GSAP stagger.
    const tween = gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration,
      delay,
      stagger: staggerChildren ? stagger : 0,
      ease: 'power3.out',
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
  }, [y, duration, stagger, staggerChildren, delay, start]);

  const Component = Tag as unknown as 'div';

  return (
    <Component
      ref={ref as RefObject<HTMLDivElement> as never}
      className={className}
    >
      {children}
    </Component>
  );
}
