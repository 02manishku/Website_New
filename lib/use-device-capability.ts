'use client';

import { useEffect, useState } from 'react';

// Returns the device's heavy-video budget. Used by video components to
// decide whether to mount a <video> element at all or fall back to a
// static poster <Image>. Low-RAM phones (≤4 GB), low-core devices,
// slow networks, save-data mode, and prefers-reduced-motion users all
// get the poster — full stop. The cinematic experience is for devices
// that can carry it without crashing.
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
    const reduced =
      typeof matchMedia !== 'undefined' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches;

    setCap({
      canPlayHeavyVideo: !(
        mem <= 4 ||
        cores <= 4 ||
        slow ||
        saveData ||
        reduced
      )
    });
  }, []);

  return cap;
}
