'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';

type PageTransitionProps = {
  children: ReactNode;
};

/**
 * Route-level transition wrapper. Wraps the page content (children of
 * `<main>` in app/layout.tsx). On every route change Next.js re-renders
 * the children; AnimatePresence sees the keyed motion.div change and
 * crossfades between them.
 *
 * Why mode="popLayout" (not "wait")
 * -----------------------------------
 * `mode="wait"` runs exit → enter sequentially, which leaves a frame or
 * two with NO page rendered — the body's bg-bone shows through, reading
 * as a brief cream/white flash. Bad.
 *
 * `mode="popLayout"` removes the exiting child from layout flow but
 * keeps it visually in place (position: absolute) while the new child
 * mounts normally underneath. Both are visible simultaneously, which
 * means the transition is a true crossfade — no blank frames, no
 * background bleed.
 *
 * The Animation
 * -------------
 * Pure opacity + blur dissolve (no translation). Reads as
 * "atmospheric" — like a film cut through a soft transition rather than
 * one page sliding off and another sliding on. The blur compresses
 * during enter and expands during exit, giving the eye the sense the
 * content is briefly out-of-focus before resolving — a much more
 * cinematic feel than a hard fade.
 *
 * Timing
 * ------
 * 500ms with `[0.22, 1, 0.36, 1]` (out-quint) — silky exponential
 * settle. Long enough that the dissolve is felt, short enough that
 * navigation never feels slow.
 *
 * `initial={false}` means the very first page paint isn't animated
 * (the preloader handles that beat instead). Only subsequent
 * navigations animate.
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, filter: 'blur(8px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, filter: 'blur(8px)' }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
