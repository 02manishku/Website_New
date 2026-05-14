'use client';

import { useCallback, useEffect, useState } from 'react';

// Stall watchdog for any <video> element. Detects "autoplay was
// blocked" (iOS Low Power Mode, strict autoplay policy, prefers-
// reduced-motion with autoplay overrides, etc.) and surfaces a
// `stalled` boolean that a UI hint component can subscribe to.
//
// Returns a tuple:
//
//   captureRef: callback ref to attach to the <video> element.
//               Combine with any other callback refs (e.g. the
//               useVideoLazyPlay one) by passing the element to
//               both inside a single wrapper callback.
//   stalled:    true once the video has been paused for `delayMs`
//               after mount. Resets to false the moment the
//               'playing' event fires.
//   playNow:    synchronous .play() call — call this from inside
//               a click/touch handler so the user-gesture privilege
//               authorises playback on iOS.
//
// Why state-backed (setVideoEl) instead of useRef: the watchdog
// effect needs to re-run when the element attaches, and useRef
// updates do NOT trigger effects. useState ensures the effect
// fires exactly when the element becomes available.

export function useVideoStallWatchdog(delayMs = 2500): {
  captureRef: (v: HTMLVideoElement | null) => void;
  stalled: boolean;
  playNow: () => void;
} {
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const [stalled, setStalled] = useState(false);

  const captureRef = useCallback((v: HTMLVideoElement | null) => {
    setVideoEl(v);
  }, []);

  useEffect(() => {
    if (!videoEl) return;
    // 'playing' fires once decoded frames are being committed to
    // the compositor — strongest signal that autoplay actually
    // succeeded. 'play' alone can fire from .play() resolution
    // before the first frame is rendered, leading to a brief
    // flash of the hint.
    const onPlaying = () => setStalled(false);
    videoEl.addEventListener('playing', onPlaying);

    const t = setTimeout(() => {
      if (videoEl.paused) setStalled(true);
    }, delayMs);

    return () => {
      clearTimeout(t);
      videoEl.removeEventListener('playing', onPlaying);
    };
  }, [videoEl, delayMs]);

  const playNow = useCallback(() => {
    if (!videoEl) return;
    const p = videoEl.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  }, [videoEl]);

  return { captureRef, stalled, playNow };
}
