'use client';

import { useEffect, useState } from 'react';

// Returns the device's heavy-video budget. Used by video components to
// decide whether to mount a <video> element at all or fall back to a
// static poster <Image>. Low-RAM phones (≤4 GB), low-core devices,
// slow networks and save-data mode get the poster — full stop.
//
// IMPORTANT: prefers-reduced-motion is intentionally NOT in the gate.
// On iOS that preference is a system-wide Accessibility setting that
// many users have flipped on without realising (sometimes via Low
// Power Mode side-effects). The videos here are muted and auto-pause
// the moment they scroll off-screen, so they meet WCAG criteria
// without needing the reduced-motion exclusion. Excluding those
// users meant every iPhone with the setting on saw only the static
// poster across the whole site, indistinguishable from a broken
// autoplay — owner-reported regression on real devices.
//
// Initial SSR state is `canPlayHeavyVideo: true` so server-rendered
// HTML is the "full" experience; the gate flips to false after the
// client effect reads the actual capability signals.

type Capability = { canPlayHeavyVideo: boolean };

type NavWithSignals = Navigator & {
  deviceMemory?: number;
  connection?: {
    effectiveType?: string;
    saveData?: boolean;
  };
};

export function useDeviceCapability(): Capability {
  const [cap, setCap] = useState<Capability>({ canPlayHeavyVideo: true });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const n = navigator as NavWithSignals;
    const mem = n.deviceMemory ?? 8;
    const cores = n.hardwareConcurrency ?? 8;
    const c = n.connection;
    const slow =
      c?.effectiveType === 'slow-2g' ||
      c?.effectiveType === '2g' ||
      c?.effectiveType === '3g';
    const saveData = c?.saveData ?? false;

    setCap({
      canPlayHeavyVideo: !(mem <= 4 || cores <= 4 || slow || saveData)
    });
  }, []);

  return cap;
}
