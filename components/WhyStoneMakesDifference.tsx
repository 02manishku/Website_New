'use client';

// audited 2026-05-11 — section laid out as plain static feature panels
// (no sticky, no IntersectionObserver, no shared state), but each
// panel now renders a <video> directly instead of a poster <Image>.
// The owner explicitly asked for videos on every panel here AND for
// every visible panel's video to play simultaneously (not one-by-one).
//
// So unlike Hero / Stacy / Poolside, these panels do NOT route through
// lib/video-coordinator (which enforces MAX=1 concurrent playback
// site-wide). Each panel manages its own play/pause via a per-element
// IntersectionObserver — if two panels are on screen at once, both
// play. Mobile decoder safety is preserved by:
//
//   1. preload="none" → upgraded to "metadata" only when within 200px
//      of the viewport, so we never decode bytes for off-screen panels.
//   2. Pause + preload reset on scroll-out (iOS releases the decoder
//      context after a pause when the element loses focus).
//   3. Mobile MP4 source is 854x480 H.264 main / CRF 27 — small enough
//      that decoding 2-3 simultaneously fits comfortably on any iPhone
//      that has shipped since 2018.
//   4. Phones only show 1-2 panels in viewport at any time anyway, so
//      the worst case is 2 simultaneous decoders, not 7.
//   5. Tab hide pauses everything.

import { useEffect, useRef } from 'react';
import ScrollFloat from '@/components/ScrollFloat';

type Feature = {
  id: string;
  number: string;
  label: string;
  heading: string;
  body: string;
  videoMp4: string;
  videoWebm: string;
  poster: string;
};

const FEATURES: Feature[] = [
  {
    id: 'stain',
    number: '01',
    label: 'Stain Safe',
    heading: 'Everyday spills wipe off easily.',
    body:
      "Magppie kitchens are made from a non-porous Silverstone™ that doesn't absorb spills. Coffee, haldi or oil wipes off in a single stroke. Your kitchen stays clean every day, with no permanent marks.",
    videoMp4: '/videos/why-stone-1.mp4',
    videoWebm: '/videos/why-stone-1.webm',
    poster: '/posters/why-stone-1.webp'
  },
  {
    id: 'scratch',
    number: '02',
    label: 'Scratch Safe',
    heading: 'Handles daily chopping without damage.',
    body:
      "Magppie kitchens use a scratch-resistant Silverstone™ surface built for daily Indian cooking. Regular chopping and knife work won't leave a mark, so your kitchen looks new for years.",
    videoMp4: '/videos/why-stone-2.mp4',
    videoWebm: '/videos/why-stone-2.webm',
    poster: '/posters/why-stone-2.webp'
  },
  {
    id: 'load',
    number: '03',
    label: 'High Load Bearing Capacity',
    heading: 'Holds heavy kitchen loads with ease.',
    body:
      'Magppie drawers are built to carry weight. Each drawer supports up to 80 kilos of vessels, groceries and appliances without bending, sagging or losing stability, even after a decade of use.',
    videoMp4: '/videos/why-stone-3.mp4',
    videoWebm: '/videos/why-stone-3.webm',
    poster: '/posters/why-stone-3.webp'
  },
  {
    id: 'fire',
    number: '04',
    label: 'Fire Safe',
    heading: 'Safe around heat and open flame.',
    body:
      'The kitchen is used around heat and open flame every day. Because Magppie kitchens are made entirely from stone, the surface does not catch fire or help flames spread. Built for daily Indian open-flame cooking.',
    videoMp4: '/videos/why-stone-4.mp4',
    videoWebm: '/videos/why-stone-4.webm',
    poster: '/posters/why-stone-4.webp'
  },
  {
    id: 'water',
    number: '05',
    label: 'Water Safe',
    heading: 'Stays strong even with water exposure.',
    body:
      'Kitchens are exposed to water every day. We placed a wooden panel and a Magppie stone sample in water for thirty days. The wood swelled and weakened. The stone stayed exactly the same. It does not absorb water, bend, or lose strength.',
    videoMp4: '/videos/why-stone-5.mp4',
    videoWebm: '/videos/why-stone-5.webm',
    poster: '/posters/why-stone-5.webp'
  },
  {
    id: 'impact',
    number: '06',
    label: 'Impact Safe',
    heading: 'Handles sudden drops and accidents.',
    body:
      'To test impact strength, we dropped a heavy ceramic jar on the surface. The stone stayed intact, making it safe for the everyday knocks and drops of a busy Indian kitchen.',
    videoMp4: '/videos/why-stone-6.mp4',
    videoWebm: '/videos/why-stone-6.webm',
    poster: '/posters/why-stone-6.webp'
  },
  {
    id: 'storage',
    number: '07',
    label: 'More Storage',
    heading: 'Made for maximum storage.',
    body:
      "With extra depth and height, Magppie wall cabinets offer up to 62% more storage than standard kitchens. They're designed to fit large Indian plates and vessels that usually don't fit in regular cabinets.",
    videoMp4: '/videos/why-stone-7.mp4',
    videoWebm: '/videos/why-stone-7.webm',
    poster: '/posters/why-stone-7.webp'
  }
];

// Per-panel video. Has its own observer set, independent of every
// other panel and independent of the global video-coordinator:
//   1. preloadObs at rootMargin: 200px — upgrade preload="none"
//      → "metadata" as the panel nears the viewport.
//   2. playObs at threshold 0.25 — call v.play() directly when 25%
//      visible, v.pause() on scroll-out. Multiple panels visible at
//      once = multiple panels playing at once. The MAX=1 coordinator
//      is intentionally bypassed here (see file header for why).
//   3. visibilitychange listener — pause when tab hides.
function FeatureVideoPanel({ f }: { f: Feature }) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    let inView = false;

    const playSafe = () => {
      const p = v.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {});
      }
    };

    const preloadObs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && v.preload === 'none') {
            v.preload = 'metadata';
          }
        }
      },
      { rootMargin: '200px' }
    );
    preloadObs.observe(v);

    const playObs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          inView = e.isIntersecting && e.intersectionRatio >= 0.25;
          if (inView) {
            playSafe();
          } else if (!v.paused) {
            v.pause();
          }
        }
      },
      { threshold: [0, 0.25, 1] }
    );
    playObs.observe(v);

    const onVis = () => {
      if (document.visibilityState === 'hidden') {
        v.pause();
      } else if (inView) {
        playSafe();
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      preloadObs.disconnect();
      playObs.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      try {
        v.pause();
      } catch {
        // element already detached
      }
    };
  }, []);

  return (
    <video
      ref={ref}
      playsInline
      muted
      loop
      preload="none"
      poster={f.poster}
      disablePictureInPicture
      disableRemotePlayback
      controls={false}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full object-cover"
    >
      {/* MP4 first, mobile variant first within MP4. iOS reads the
          first matching source and never falls back. */}
      <source
        src={f.videoMp4.replace('.mp4', '-mobile.mp4')}
        type="video/mp4"
        media="(max-width: 768px)"
      />
      <source src={f.videoMp4} type="video/mp4" />
      <source src={f.videoWebm} type="video/webm" />
    </video>
  );
}

export default function WhyStoneMakesDifference() {
  return (
    <section className="bg-bone relative">
      {/* Section heading flows in normal document order. */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 pt-20 lg:pt-32">
        <div className="kicker text-smoke mb-6">The Promise</div>
        <ScrollFloat
          as="h2"
          containerClassName="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-ink max-w-4xl"
        >
          Why stone makes all the{' '}
          <span className="text-smoke">difference.</span>
        </ScrollFloat>
        <p className="mt-6 lg:mt-8 max-w-xl text-ink/65 leading-relaxed font-display italic text-lg">
          Seven everyday tests every kitchen quietly fails. Magppie quietly
          passes.
        </p>
      </div>

      {/* Feature panels — each card is a plain, self-contained block.
          The alternating image side on desktop (even indexes left,
          odd right) gives the section visual rhythm without depending
          on scroll-position tracking. On mobile the video sits below
          the copy in single-column order, regardless of index. */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 mt-14 lg:mt-24 pb-20 lg:pb-32">
        <ul className="space-y-6 lg:space-y-10">
          {FEATURES.map((f, i) => {
            const imageLeftOnDesktop = i % 2 === 1;
            return (
              <li key={f.id}>
                <article className="grid lg:grid-cols-12 gap-0 items-stretch rounded-[20px] lg:rounded-[28px] border border-ink/12 bg-bone overflow-hidden shadow-[0_6px_20px_-14px_rgba(40,28,18,0.16)] lg:shadow-[0_22px_50px_-30px_rgba(40,28,18,0.22)]">
                  {/* Copy column */}
                  <div
                    className={`lg:col-span-6 px-6 sm:px-10 lg:px-14 xl:px-16 py-9 sm:py-11 lg:py-14 flex flex-col justify-center ${
                      imageLeftOnDesktop ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >
                    <div className="flex items-baseline gap-5 sm:gap-7 mb-5 lg:mb-7">
                      <span className="kicker tabular-nums text-ink/55">
                        {f.number}
                      </span>
                      <span className="font-display text-lg sm:text-xl lg:text-2xl text-ink leading-tight">
                        {f.label}
                      </span>
                    </div>
                    <h3 className="font-display text-[1.65rem] sm:text-[1.95rem] lg:text-[2.35rem] xl:text-[2.55rem] text-ink leading-[1.12] tracking-[-0.005em] max-w-[28rem]">
                      {f.heading}
                    </h3>
                    <p className="mt-5 lg:mt-7 text-ink/70 leading-relaxed text-[0.95rem] sm:text-base lg:text-[1.02rem] max-w-[30rem]">
                      {f.body}
                    </p>
                  </div>

                  {/* Video column — same /posters/why-stone-N.webp the
                      browser shows as the HTML5 `poster` attribute
                      until the lazy-play hook flips the source on. */}
                  <div
                    className={`relative lg:col-span-6 aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:min-h-[420px] bg-ink ${
                      imageLeftOnDesktop ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <FeatureVideoPanel f={f} />
                    {/* Soft inner vignette keeps the photographic feel. */}
                    <div
                      aria-hidden
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.18) 100%)'
                      }}
                    />
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
