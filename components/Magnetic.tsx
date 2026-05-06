'use client';

import {
  useRef,
  useEffect,
  type ElementType,
  type ReactNode,
  type RefObject
} from 'react';
import { gsap } from 'gsap';

type MagneticProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  // 0–1, how strongly the element follows the cursor (0.3 ≈ feels alive
  // but stays anchored, 0.5 ≈ exaggerated). Anything above ~0.6 looks
  // gimmicky on a luxury site.
  strength?: number;
};

/**
 * Magnetic hover wrapper. The element's transform is gently pulled
 * toward the cursor while hovered, then springs home on leave. A staple
 * Awwwards interaction for primary CTAs (Book Now, Send Enquiry).
 *
 * Disabled on touch devices and for prefers-reduced-motion users.
 */
export default function Magnetic({
  children,
  as: Tag = 'div',
  className = '',
  strength = 0.3
}: MagneticProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Skip on touch (no hover surface, would feel jumpy on tap drift).
    if (window.matchMedia('(hover: none)').matches) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    function onMove(e: MouseEvent) {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, {
        x: x * strength,
        y: y * strength,
        duration: 0.45,
        ease: 'power3.out'
      });
    }

    function onLeave() {
      if (!el) return;
      // Elastic return — the springy "pull-back" is what sells the
      // magnetism. Light dampening so it doesn't jiggle forever.
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.4)'
      });
    }

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);

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
