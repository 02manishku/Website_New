'use client';

import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Debounced global ScrollTrigger.refresh() on resize +
// orientationchange. Without this, sticky / pinned ScrollTriggers
// keep using the layout they were created with — when the user
// rotates a phone or resizes a browser window, the pin points drift
// or get cut off and animations stop firing where they should.
//
// 150 ms debounce is the Studio Freight default — long enough that
// fast-fire resize events from the iOS address bar collapsing don't
// thrash the layout, short enough that the user doesn't feel a
// lag after an orientation flip.

export default function ScrollTriggerRefresh() {
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | null = null;
    const refresh = () => {
      if (t) clearTimeout(t);
      t = setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    window.addEventListener('resize', refresh);
    window.addEventListener('orientationchange', refresh);
    return () => {
      window.removeEventListener('resize', refresh);
      window.removeEventListener('orientationchange', refresh);
      if (t) clearTimeout(t);
    };
  }, []);
  return null;
}
