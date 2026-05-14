'use client';

import { motion, AnimatePresence } from 'motion/react';

// Visual affordance for a stalled <video>. Designed to be brand-
// consistent and invisible unless autoplay actually failed — never
// shown when a video is already playing or decoding. Mounts inside
// a position: relative video container; absolutely centred.
//
// Behaviour parallels Apple's marketing-page video fallback and
// Lusion's "play to begin" interaction:
//   - Bone-coloured capsule with a small play triangle + kicker
//     label ("PLAY"). Same typographic system as every other
//     kicker label site-wide (uppercase, tracked).
//   - Springs in over 380 ms when stalled flips true.
//   - Springs out (no flicker) the moment the video starts.
//   - 44 x 44 minimum hit target (iOS HIG).
//   - Focus-visible ring + aria-label for keyboard / screen-reader
//     users.

type Variant = 'light' | 'dark';

export default function VideoPlayHint({
  stalled,
  onTap,
  variant = 'light',
  label = 'Play'
}: {
  /** Pass useVideoStallWatchdog().stalled here. */
  stalled: boolean;
  /** Pass useVideoStallWatchdog().playNow here (or any sync .play()
   *  call). Must run synchronously inside the click handler so the
   *  user-gesture privilege carries through to iOS WebKit. */
  onTap: () => void;
  /** light = bone capsule + ink text (use over dark/ink videos).
   *  dark  = ink capsule + bone text (use over light/cream stills). */
  variant?: Variant;
  /** Optional override for the capsule label. Defaults to "Play". */
  label?: string;
}) {
  const capsuleClasses =
    variant === 'light'
      ? 'bg-bone/95 text-ink'
      : 'bg-ink/90 text-bone';

  return (
    <AnimatePresence>
      {stalled && (
        <motion.button
          key="play-hint"
          type="button"
          onClick={onTap}
          aria-label="Play video"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-20 m-auto w-fit h-fit min-h-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-bone/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink/40 rounded-full"
        >
          <span
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-md shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] ${capsuleClasses}`}
          >
            <svg
              width="11"
              height="13"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <polygon points="6 4 20 12 6 20" />
            </svg>
            <span className="kicker">{label}</span>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
