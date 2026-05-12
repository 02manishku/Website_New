'use client';

import { useEffect } from 'react';

// User-gesture autoplay primer for iOS Safari (and any other mobile
// browser that quietly denies HTMLMediaElement.play() outside a
// gesture context).
//
// PERFORMANCE-CRITICAL: this file is in the scroll hot path. The
// previous version called getBoundingClientRect() on every <video>
// inside the scroll handler — even throttled to 200ms that pattern
// caused the audited 60fps blocker on iPhone Safari, because every
// fire forced a synchronous layout reflow over N elements.
//
// The current implementation has ZERO layout reads inside the scroll
// handler. An IntersectionObserver maintains a live Set of currently-
// in-view videos; the gesture handler just iterates that Set, no
// getBoundingClientRect / offsetHeight / innerHeight calls anywhere.
//
// Behaviour identity preserved:
//
//   - On every gesture (touchstart / touchend / scroll / click /
//     keydown / pointerdown), throttled to 200ms, the primer calls
//     .play() synchronously on every paused in-view video so iOS
//     authorises playback under the gesture privilege.
//   - .play() is wrapped in a canplay-event retry for the readyState=0
//     case (video data not yet buffered).
//   - A MutationObserver picks up dynamically-added <video> elements
//     (e.g. WoodVsStone's active-stage remount) so they get observed
//     too — rAF-debounced so a burst of DOM mutations only triggers
//     one re-scan.

const THROTTLE_MS = 200;

export default function VideoAutoplayPrimer() {
  useEffect(() => {
    // Live Set of currently in-view <video> elements, maintained
    // exclusively by the IntersectionObserver below. The gesture
    // handler iterates this Set — never reads layout.
    const inView = new Set<HTMLVideoElement>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) inView.add(v);
          else inView.delete(v);
        }
      },
      { threshold: 0.01 }
    );

    const observeAll = () => {
      document.querySelectorAll('video').forEach((v) => io.observe(v));
    };
    observeAll();

    // Pick up new <video> elements that mount after the initial scan
    // (WoodVsStone remounts the active stage's video on activeIdx
    // change, etc). rAF debounce keeps us from re-scanning the DOM
    // on every minor mutation; one re-scan per frame is plenty.
    let moPending = false;
    const mo = new MutationObserver(() => {
      if (moPending) return;
      moPending = true;
      requestAnimationFrame(() => {
        moPending = false;
        observeAll();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    let lastFire = 0;
    const tryPlayVisible = () => {
      const now = performance.now();
      if (now - lastFire < THROTTLE_MS) return;
      lastFire = now;
      // Zero layout reads. Pure iteration over the cached Set.
      inView.forEach((v) => {
        if (!v.paused) return;
        try {
          if (v.readyState === 0) v.load();
          const p = v.play();
          if (p && typeof p.catch === 'function') {
            p.catch(() => {
              const retry = () => {
                v.removeEventListener('canplay', retry);
                const p2 = v.play();
                if (p2 && typeof p2.catch === 'function') {
                  p2.catch(() => {});
                }
              };
              v.addEventListener('canplay', retry, { once: true });
            });
          }
        } catch {
          // Element might be detached mid-event.
        }
      });
    };

    document.addEventListener('touchstart', tryPlayVisible, { passive: true });
    document.addEventListener('touchend', tryPlayVisible, { passive: true });
    document.addEventListener('scroll', tryPlayVisible, { passive: true });
    document.addEventListener('click', tryPlayVisible);
    document.addEventListener('keydown', tryPlayVisible);
    document.addEventListener('pointerdown', tryPlayVisible);

    // Initial fire — desktop / modern Android often permit autoplay
    // without any gesture. iOS needs the first scroll/touch to land
    // before this becomes effective.
    tryPlayVisible();

    return () => {
      io.disconnect();
      mo.disconnect();
      document.removeEventListener('touchstart', tryPlayVisible);
      document.removeEventListener('touchend', tryPlayVisible);
      document.removeEventListener('scroll', tryPlayVisible);
      document.removeEventListener('click', tryPlayVisible);
      document.removeEventListener('keydown', tryPlayVisible);
      document.removeEventListener('pointerdown', tryPlayVisible);
    };
  }, []);

  return null;
}
