'use client';

import Link from 'next/link';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useRef, type ReactNode, type MouseEvent } from 'react';

// Magnetic CTA wrapper. Reads the cursor position and translates the
// child link by a small fraction of the cursor's offset from the
// element's centre, smoothed through a spring. On mouseleave the
// spring returns to zero.
//
// Magnetic effects on touch devices are noise — the wrapper relies on
// onMouseMove/onMouseLeave which React only fires from real pointer
// devices, so taps don't trigger the springs. Touch users get the
// plain anchor unchanged.
//
// `strength` is the fraction of the cursor offset to follow. Default
// 0.18 keeps the displacement subtle (typically 4-8px on a standard
// button) — strong enough to read as intentional, soft enough that
// the link still reads as static when the cursor isn't over it.
//
// Spring tuned for "settled" motion (not bouncy): stiff enough to
// feel responsive, damped enough to never overshoot.

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  /** Fraction of cursor offset to translate by. Default 0.18. */
  strength?: number;
  /** Click handler (rare for a magnetic CTA, but supported). */
  onClick?: () => void;
  /** ARIA label for the underlying anchor. */
  ariaLabel?: string;
};

export default function MagneticLink({
  href,
  children,
  className,
  strength = 0.18,
  onClick,
  ariaLabel
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 220, damping: 22, mass: 0.6 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY, display: 'inline-block' }}
    >
      <Link
        href={href}
        className={className}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    </motion.span>
  );
}
