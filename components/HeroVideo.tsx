'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { useVideoLazyPlay } from '@/lib/use-video-lazy-play';
import { useDeviceCapability } from '@/lib/use-device-capability';

// Hero title parts. Split into individual words so each one can do
// the curtain-reveal animation (translateY from 110% inside an
// overflow:hidden mask). `italic` flags "Stone." which renders in
// italic light weight per the brand voice.
type Part = { w: string; italic?: boolean };
const LINE_1: Part[] = [
  { w: 'The' },
  { w: 'World' },
  { w: 'Needs' },
  { w: 'Wellness.' }
];
const LINE_2: Part[] = [
  { w: 'Built' },
  { w: 'in' },
  { w: 'Stone.', italic: true }
];

// Easing + timing shared by every word. 0.85s duration is long
// enough for the reveal to read as deliberate, short enough that
// users on a 6s page-paint budget still finish the title before
// scrolling. The ease-out-quint curve [0.22,1,0.36,1] gives the
// silky exponential settle that reads as "premium".
const EASE = [0.22, 1, 0.36, 1] as const;
const DURATION = 0.85;
const STAGGER = 0.06;
// Kicker fade-up starts at ~0s; let the title cascade catch up
// after the user's eye has registered the line above it.
const INITIAL_DELAY = 0.4;

export default function HeroVideo() {
  const lazyPlayRef = useVideoLazyPlay();
  const { canPlayHeavyVideo } = useDeviceCapability();

  // Hold a state-backed reference to the underlying <video> element
  // so the LPM watchdog effect below can attach a `playing` listener
  // when (and only when) the element mounts. State (not useRef)
  // because we want the effect to re-run on attach.
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const captureVideo = useCallback(
    (v: HTMLVideoElement | null) => {
      setVideoEl(v);
      lazyPlayRef(v);
    },
    [lazyPlayRef]
  );

  // iOS Low Power Mode + some private-browsing modes block <video
  // autoplay> entirely even when muted + playsInline are set. The
  // gesture primer (components/VideoAutoplayPrimer) starts the hero
  // the moment the user scrolls or taps anywhere, but until that
  // gesture lands the user sees a static poster — confusing if
  // they're not expecting motion. So we watch for "video still
  // paused 2.5 s after mount" → flip the bouncing scroll chevron
  // into a labelled CTA ("Tap to begin") that makes the interaction
  // explicit. The label vanishes the moment any video plays.
  const [autoplayStalled, setAutoplayStalled] = useState(false);
  useEffect(() => {
    if (!videoEl) return;
    const onPlaying = () => setAutoplayStalled(false);
    videoEl.addEventListener('playing', onPlaying);
    const t = setTimeout(() => {
      if (videoEl.paused) setAutoplayStalled(true);
    }, 2500);
    return () => {
      clearTimeout(t);
      videoEl.removeEventListener('playing', onPlaying);
    };
  }, [videoEl]);

  // Scroll cue tap-handler. Scrolling itself is the gesture iOS
  // requires to authorise .play() — so a tap on the chevron both
  // moves the user to the section below AND wakes the hero video
  // (via VideoAutoplayPrimer's scroll listener). Also fires .play()
  // directly on the hero so the priming happens synchronously
  // inside the click handler regardless of how fast the scroll
  // animation runs.
  const handleScrollCue = () => {
    if (videoEl && videoEl.paused) {
      const p = videoEl.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    }
    const vh = window.innerHeight || document.documentElement.clientHeight;
    window.scrollTo({ top: vh, behavior: 'smooth' });
  };

  return (
    <section className="relative h-[100dvh] min-h-[560px] lg:min-h-[640px] w-full overflow-hidden bg-ink">
      {/* Low-end / save-data / slow-network / reduced-motion users skip
          the video entirely and see the brand hero image. Same
          composition, zero decoder cost. The text overlay still
          renders on top. */}
      {canPlayHeavyVideo ? (
        <video
          ref={captureVideo}
          autoPlay
          playsInline
          muted
          loop
          preload="metadata"
          poster="/posters/brecciaa.webp"
          disablePictureInPicture
          disableRemotePlayback
          controls={false}
          aria-hidden="true"
          // title is read by Google Video search crawlers and surfaces
          // in the browser tooltip — primary keyword target for video
          // SERP results. aria-hidden keeps it out of the screen-reader
          // tree (the underlying section is decorative).
          title="Magppie Silverstone wellness kitchen | Luxury modular kitchen India"
          data-file-name="hero-wellness-kitchen-silverstone-magppie.mp4"
          className="absolute inset-0 w-full h-full object-cover"
        >
          {/* MP4 sources before WebM \xe2\x80\x94 iOS reads first matching source
              and never falls back. Mobile (<=768px) gets a smaller
              re-encoded variant. */}
          <source
            src="/videos/brecciaa-mobile.mp4"
            type="video/mp4"
            media="(max-width: 768px)"
          />
          <source src="/videos/brecciaa.mp4" type="video/mp4" />
          <source src="/videos/brecciaa.webm" type="video/webm" />
        </video>
      ) : (
        // Same /posters/brecciaa.webp the video would have started on \xe2\x80\x94
        // capable + incapable devices see the exact same frame.
        <Image
          src="/posters/brecciaa.webp"
          alt="Magppie Silverstone wellness kitchen with stone countertops and hanging plants | Luxury modular kitchen India"
          fill
          priority
          sizes="100vw"
          data-file-name="hero-wellness-kitchen-silverstone-plants-magppie.webp"
          className="object-cover"
        />
      )}

      {/* Stronger darkening on the left where the copy sits, for legibility on bright scenes */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/30 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-transparent to-ink/70 pointer-events-none" />

      {/* Bottom-left title block - tucked into the corner so the video stays the hero.
          NOTE on font sizing: the previous `md:text-[3.8vw]` regressed to ~29px at
          768px (smaller than the sm-breakpoint 40px). Switched to explicit Tailwind
          steps for sm/md so the headline never shrinks as the viewport grows;
          fluid vw scaling kicks in only at lg. */}
      <div className="absolute bottom-24 lg:bottom-20 left-6 lg:left-10 right-6 lg:right-auto z-10 max-w-[560px]">
        <div className="kicker text-bone/90 mb-3 lg:mb-4 fade-up">
          Introducing the World&rsquo;s First Wellness Kitchen
        </div>
        {/* Curtain-reveal title. Each word lives inside an
            overflow:hidden mask span and slides up from y:110%
            (fully below the mask) to y:0 (natural position),
            staggered word-by-word. The aria-label on the h1
            preserves screen-reader semantics — assistive tech reads
            the full phrase, never the individual word spans. */}
        <h1
          className="font-display font-light text-bone leading-[1.05] text-[2rem] sm:text-[2.5rem] md:text-5xl lg:text-[2.9vw] [text-shadow:0_2px_18px_rgba(0,0,0,0.55)]"
          aria-label="The World Needs Wellness. Built in Stone."
        >
          <span aria-hidden="true" className="block">
            {LINE_1.map((part, i, arr) => (
              <span
                key={i}
                className="inline-block overflow-hidden align-bottom pb-[0.06em]"
              >
                <motion.span
                  className="inline-block"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: DURATION,
                    delay: INITIAL_DELAY + i * STAGGER,
                    ease: EASE
                  }}
                >
                  {part.w}
                  {i < arr.length - 1 ? ' ' : ''}
                </motion.span>
              </span>
            ))}
          </span>
          <span aria-hidden="true" className="block">
            {LINE_2.map((part, i, arr) => (
              <span
                key={i}
                className="inline-block overflow-hidden align-bottom pb-[0.06em]"
              >
                <motion.span
                  className={`inline-block ${part.italic ? 'italic' : ''}`}
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: DURATION,
                    delay:
                      INITIAL_DELAY + (LINE_1.length + i) * STAGGER,
                    ease: EASE
                  }}
                >
                  {part.w}
                  {i < arr.length - 1 ? ' ' : ''}
                </motion.span>
              </span>
            ))}
          </span>
        </h1>
        <div className="mt-5 lg:mt-8 flex flex-wrap items-center gap-x-5 md:gap-x-8 gap-y-3 lg:gap-y-3 fade-up delay-2">
          <Link href="/kitchens" className="tap-link text-sm text-bone hover-underline">
            Wellness Kitchens →
          </Link>
          <Link href="/wardrobes" className="tap-link text-sm text-bone hover-underline">
            Wellness Wardrobes →
          </Link>
          <Link href="/vanities" className="tap-link text-sm text-bone hover-underline">
            Wellness Vanities →
          </Link>
        </div>
      </div>

      {/* Scroll cue — now a real <button> rather than a decorative div.
          Tapping it scrolls one viewport AND fires .play() on the hero
          synchronously inside the click handler. That click is a user
          gesture, which is what iOS Low Power Mode requires to permit
          .play(). So the chevron does double-duty: visual scroll
          affordance + autoplay primer.
          When autoplay has stalled past the 2.5s watchdog (LPM /
          reduced-motion override / strict autoplay policy), we surface
          a small "Tap to begin" caption above the chevron — vanishes
          the instant the video plays. */}
      <button
        type="button"
        onClick={handleScrollCue}
        aria-label={
          autoplayStalled
            ? 'Tap to begin the hero video and scroll to the next section'
            : 'Scroll to the next section'
        }
        className="absolute bottom-safe left-1/2 -translate-x-1/2 z-10 fade-up delay-3 text-bone/70 flex flex-col items-center gap-3 min-h-[44px] min-w-[44px] px-4 py-2 -mx-4 -my-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-bone/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink/30 rounded-sm"
      >
        {autoplayStalled && (
          <span className="kicker text-bone/85 [text-shadow:0_1px_8px_rgba(0,0,0,0.55)] fade-up">
            Tap to begin
          </span>
        )}
        <span
          className={autoplayStalled ? '' : 'animate-bounce-slow'}
          aria-hidden="true"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
    </section>
  );
}
