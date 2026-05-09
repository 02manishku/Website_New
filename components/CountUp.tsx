'use client';

// audited 2026-05-09 — H-01: trigger.kill() in cleanup; once: true keeps
// it from re-firing; prefers-reduced-motion bypass; tween targets a
// plain object (not the DOM), DOM updates are textContent only.

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type CountUpProps = {
  to: number;
  // Animation length in seconds.
  duration?: number;
  // Locale separator for thousands. Defaults to en-IN ("Indian comma"
  // style: 28,000 not 28000). Pass 'en-US' for US-style.
  locale?: string;
  // Suffix appended after the number (e.g. "+", "%"). Rendered outside
  // the animated digits so it doesn't tween.
  suffix?: string;
  className?: string;
  suffixClassName?: string;
};

/**
 * Number counter that tweens from 0 to `to` when scrolled into view,
 * then locks. Delights on a single beat — used here for the "28,000+
 * private clients" stat which lands harder when the digits actually
 * count up than as a static number.
 *
 * Plays once. Rewinding the scroll won't replay it.
 *
 * prefers-reduced-motion users see the final number immediately.
 */
export default function CountUp({
  to,
  duration = 2.0,
  locale = 'en-IN',
  suffix = '',
  className = '',
  suffixClassName = ''
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || played) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReduced) {
      el.textContent = to.toLocaleString(locale);
      setPlayed(true);
      return;
    }

    // The tween target is a plain object; we update the DOM textContent
    // on each frame via onUpdate. Cheaper than driving 5 digit elements
    // with separate transforms.
    const obj = { value: 0 };

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top bottom-=80',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          value: to,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = Math.floor(obj.value).toLocaleString(locale);
          },
          onComplete: () => {
            // Final pass with the exact target value, in case rounding
            // ever leaves us a hair short.
            el.textContent = to.toLocaleString(locale);
            setPlayed(true);
          }
        });
      }
    });

    return () => {
      trigger.kill();
    };
  }, [to, duration, locale, played]);

  return (
    <>
      <span ref={ref} className={className}>
        0
      </span>
      {suffix && <span className={suffixClassName}>{suffix}</span>}
    </>
  );
}
