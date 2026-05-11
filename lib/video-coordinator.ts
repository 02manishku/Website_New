'use client';

// Global concurrent-playback coordinator. iOS Safari's renderer process
// allocates a hardware decoder context per playing <video>; the ceiling
// is small (~1-4 depending on device class). Past it, the renderer
// thrashes, hits OOM, and the OS kills the tab.
//
// `MAX = 1` is brutal but correct for mobile: only one video plays
// site-wide at any moment. When a new card / hero / testimonial wants
// to play, the previously-playing video is paused first.
//
// Module-scope Set persists across navigations within a tab — same
// pattern as the lead-route rate limiter. Fine for organic traffic;
// reset on full page reload.

const playing = new Set<HTMLVideoElement>();
const MAX = 1;

export function requestPlay(v: HTMLVideoElement): Promise<void> {
  if (!playing.has(v) && playing.size >= MAX) {
    for (const other of playing) {
      other.pause();
      playing.delete(other);
      break;
    }
  }
  playing.add(v);
  const p = v.play();
  return p && typeof p.catch === 'function'
    ? p.catch(() => {
        playing.delete(v);
      })
    : Promise.resolve();
}

export function releasePlay(v: HTMLVideoElement) {
  playing.delete(v);
}
