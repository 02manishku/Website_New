'use client';

// audited 2026-05-09 — H-01: per-card IntersectionObservers
// disconnected in cleanup; no GSAP / ScrollTrigger; no animated layout
// properties (only border-color + box-shadow swap on active card,
// which is a paint not a layout cost).

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import ScrollFloat from '@/components/ScrollFloat';
import { useVideoLazyPlay } from '@/lib/use-video-lazy-play';
import { useDeviceCapability } from '@/lib/use-device-capability';

// ─────────────────────────────────────────────────────────────────────────
// Stacking-cards accordion. Each feature is a self-contained rounded
// card. As the user scrolls, the <article> itself sticks at an
// incrementing top offset, with later cards z-indexed above earlier
// ones — so the next card slides up over the previous one's body,
// leaving only the previous card's header strip visible. The result:
// all seven headers permanently visible at the top of the viewport,
// with the active card's body+video filling the rest.
//
// Why the article (not its header) is sticky: a sticky element is
// constrained to its containing block. If the header were sticky
// inside the article, it would un-pin the moment the article scrolled
// past — meaning earlier headers would disappear instead of stacking.
// Making the whole card sticky lets z-index handle occlusion, so all
// previous headers stay parked at the top.
//
// The first card's sticky top is offset by the page Header's height
// (h-16 lg:h-20 → 64/80px). Without this offset, the card 01 strip
// pins at viewport y=0 and gets visually swallowed by the fixed page
// header — only cards 02+ would appear stacked.
// ─────────────────────────────────────────────────────────────────────────

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
    poster: '/images/why-stone/why-stone-1.webp'
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
    poster: '/images/why-stone/why-stone-2.webp'
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
    poster: '/images/why-stone/why-stone-3.webp'
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
    poster: '/images/why-stone/why-stone-4.webp'
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
    poster: '/images/why-stone/why-stone-5.webp'
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
    poster: '/images/why-stone/why-stone-6.webp'
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
    poster: '/images/why-stone/why-stone-7.webp'
  }
];

// Page Header is `fixed top-0 ... h-16 lg:h-20` — 64px on phones,
// 80px on lg+. Stacked card headers must clear it or card 01 hides
// behind it.
const PAGE_HEADER_DESKTOP = 80;
const PAGE_HEADER_MOBILE = 64;

// Per-card header strip height when stacked. Compact enough that
// seven of them plus the page header leave breathing room for the
// active card body in a typical viewport, but tall enough that the
// label (e.g. "High Load Bearing Capacity") is comfortable to read.
const HEADER_H_DESKTOP = 60;
const HEADER_H_MOBILE = 52;

// Bone-coloured gap between adjacent stacked rounded headers — small
// enough to read as a deck, large enough that the rounded corners
// register as separate cards.
const STACK_GAP = 4;

// Breathing space between the page header bottom and the first
// stacked card.
const STACK_TOP_PAD_DESKTOP = 12;
const STACK_TOP_PAD_MOBILE = 10;

// Gate the <video> element behind a desktop check. On phones / small
// tablets we render the poster image only — no <video> at all, no
// hardware decoder context allocated, no GPU video plane. This is the
// fix for the iOS Safari renderer crash + reload that older + low-RAM
// iPhones (iOS 12 era through current) hit when scrolling into this
// section: 7 sticky stacking contexts plus even one active video plus
// the rest of the page's video assets pushes total decoder/GPU pressure
// past what the renderer process can hold, and iOS WatchDog kills it.
// On desktop where memory headroom is huge, we keep the active-video
// experience.
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = () => setIsDesktop(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isDesktop;
}

export default function WhyStoneMakesDifference() {
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const isDesktop = useIsDesktop();
  const { canPlayHeavyVideo } = useDeviceCapability();
  // Single shared ref: only ONE card ever mounts a <video> (the active
  // one on desktop). The lazy-play hook handles its play/pause via
  // the global coordinator (MAX=1 concurrent video site-wide), no
  // per-card video-ref book-keeping needed.
  const activeVideoRef = useVideoLazyPlay(0.25);

  // Per-card IntersectionObserver. The rootMargin defines the "active
  // band" — vertical 30%–50% of viewport. As each card scrolls through
  // that band, the observer flips it to active, swapping border /
  // shadow emphasis and remounting the video into the active card.
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIdx(i);
        },
        {
          rootMargin: '-30% 0px -50% 0px',
          threshold: 0
        }
      );
      observer.observe(card);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Click a stacked header to jump to that card. Computes the target
  // scroll position so the card's natural top lands just below the
  // current stack — the IntersectionObserver then flips activeIdx
  // automatically as the card crosses the active band.
  const jumpTo = (i: number) => {
    const card = cardRefs.current[i];
    if (!card) return;
    const isDesktop = window.innerWidth >= 1024;
    const headerH = isDesktop ? HEADER_H_DESKTOP : HEADER_H_MOBILE;
    const pageH = isDesktop ? PAGE_HEADER_DESKTOP : PAGE_HEADER_MOBILE;
    const topPad = isDesktop ? STACK_TOP_PAD_DESKTOP : STACK_TOP_PAD_MOBILE;
    const stackOffset = pageH + topPad + i * (headerH + STACK_GAP) + 24;
    const targetY =
      card.getBoundingClientRect().top + window.scrollY - stackOffset;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  return (
    <section className="bg-bone relative">
      {/* Section heading flows above the stack in normal layout. */}
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

      {/* Stacking cards. The container has no overflow rule so each
          <article>'s position: sticky is honoured by the page's own
          scroll container. Wider max-width than the heading band so
          the cards read as long, deliberate rectangles — close to
          the viewport edges with just enough margin to breathe. */}
      <div className="relative mt-12 lg:mt-20 mx-auto max-w-[1760px] px-3 sm:px-5 lg:px-8">
        {FEATURES.map((f, i) => {
          const isActive = i === activeIdx;
          return (
            <article
              key={f.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={`sticky bg-bone rounded-[20px] lg:rounded-[28px] border overflow-hidden transition-[border-color,box-shadow,background-color] duration-700 ease-out ${
                isActive
                  ? 'border-ink/35 shadow-[0_50px_100px_-40px_rgba(40,28,18,0.32),0_18px_44px_-22px_rgba(40,28,18,0.18)]'
                  : 'border-ink/12 shadow-[0_4px_18px_-12px_rgba(40,28,18,0.10)]'
              }`}
              style={{
                top: `var(--why-stone-top-${i})`,
                zIndex: 10 + i,
                // Per-card minHeight that adapts to the card's
                // sticky position. The deeper a card sits in the
                // stack, the less viewport space it has below the
                // accumulated headers — so its height clamps down
                // to fit. The last card (deepest stack) gets
                // exactly the remaining space, so its rounded
                // bottom corner lands at the viewport bottom
                // instead of overflowing below it.
                minHeight: `min(64dvh, calc(100dvh - var(--why-stone-top-${i}) - 8px))`
              }}
            >
              {/* Header strip — always visible. Clickable so each
                  stacked header acts as a navigation handle: tap "03"
                  while reading card 06 and the page scrolls back up
                  to card 03. Active state is signalled by colour and
                  weight only — no decorative rules or markers. */}
              <button
                type="button"
                onClick={() => jumpTo(i)}
                aria-label={`Jump to ${f.label}`}
                className={`w-full flex items-center px-6 lg:px-10 text-left group cursor-pointer transition-colors duration-500 ${
                  isActive ? 'bg-ink/[0.025]' : 'bg-transparent hover:bg-ink/[0.015]'
                }`}
                style={{ height: 'var(--why-stone-header-h)' }}
              >
                <span
                  className={`kicker tabular-nums transition-colors duration-500 ${
                    isActive ? 'text-ink' : 'text-ink/45'
                  }`}
                >
                  {f.number}
                </span>
                <span
                  className={`font-display ml-6 sm:ml-8 text-base sm:text-lg lg:text-xl transition-colors duration-500 ${
                    isActive
                      ? 'text-ink'
                      : 'text-ink/55 group-hover:text-ink/85'
                  }`}
                >
                  {f.label}
                </span>
              </button>

              {/* Body — heading + body on the left, video on the right.
                  When the card is collapsed (next card stacked above),
                  this body is hidden behind the next card; only the
                  header strip stays visible. */}
              <div
                className="grid lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center px-6 sm:px-10 lg:px-14 xl:px-20"
                style={{
                  paddingTop: 'clamp(1.25rem, 3vh, 2.25rem)',
                  paddingBottom: 'clamp(1.25rem, 3vh, 2.25rem)',
                  // Body fills the rest of the card after the header.
                  minHeight: `calc(min(64dvh, calc(100dvh - var(--why-stone-top-${i}) - 8px)) - var(--why-stone-header-h))`
                }}
              >
                <div className="lg:col-span-5 flex flex-col justify-center">
                  <h3 className="font-display text-[1.65rem] sm:text-[1.9rem] lg:text-[2.4rem] xl:text-[2.7rem] text-ink leading-[1.12] max-w-[30rem] tracking-[-0.005em]">
                    {f.heading}
                  </h3>
                  <p className="mt-5 lg:mt-7 text-ink/70 leading-relaxed text-[0.95rem] sm:text-base lg:text-[1.02rem] max-w-[30rem]">
                    {f.body}
                  </p>
                </div>

                <div className="lg:col-span-7">
                  <div
                    className="relative w-full bg-ink overflow-hidden rounded-xl lg:rounded-2xl shadow-[0_24px_48px_-22px_rgba(40,28,18,0.45),0_60px_120px_-40px_rgba(40,28,18,0.22)]"
                    style={{
                      // Fixed-height container with object-cover means
                      // the video never overflows the body region, no
                      // matter how deep the card sits in the stack.
                      // Source video crops at top/bottom rather than
                      // pushing past the card's bottom rounded corner.
                      height: 'clamp(220px, 38vh, 360px)'
                    }}
                  >
                    {/* Mount <video> ONLY on desktop AND for the active
                        card. Every other case (any mobile size, any
                        inactive card on desktop) renders the static
                        poster as an <Image>. This is the iOS Safari
                        renderer-crash fix: no video element means no
                        decoder context allocated, no GPU video plane,
                        no chance of pushing the renderer past its
                        memory ceiling. First card's poster gets
                        priority so it preloads with the rest of the
                        above-the-fold assets. */}
                    {isDesktop && isActive && canPlayHeavyVideo ? (
                      <video
                        ref={activeVideoRef}
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
                        {/* MP4 first, mobile variant first within MP4.
                            iOS reads the first matching source and
                            never falls back. */}
                        <source
                          src={f.videoMp4.replace('.mp4', '-mobile.mp4')}
                          type="video/mp4"
                          media="(max-width: 768px)"
                        />
                        <source src={f.videoMp4} type="video/mp4" />
                        <source src={f.videoWebm} type="video/webm" />
                      </video>
                    ) : (
                      <Image
                        src={f.poster}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 58vw, 100vw"
                        className="object-cover"
                      />
                    )}

                    {/* Soft inner vignette for cinematic feel. */}
                    <div
                      aria-hidden
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.18) 100%)'
                      }}
                    />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Bottom spacer so the final card has room to stay active
          before the page continues. */}
      <div className="h-[28vh]" aria-hidden />

      {/* CSS variables for sticky offsets. Defining them here keeps the
          per-card top values centralised — adjust HEADER_H or
          STACK_GAP at the top of the file and every breakpoint
          updates. The page-header offset (PAGE_HEADER_*) is
          mandatory: without it, card 01's sticky top of 0 hides
          behind the fixed site Header at viewport top:0. */}
      <style>{`
        :root {
          --why-stone-header-h: ${HEADER_H_MOBILE}px;
          ${FEATURES.map(
            (_, i) =>
              `--why-stone-top-${i}: ${
                PAGE_HEADER_MOBILE +
                STACK_TOP_PAD_MOBILE +
                i * (HEADER_H_MOBILE + STACK_GAP)
              }px;`
          ).join('\n          ')}
        }
        @media (min-width: 1024px) {
          :root {
            --why-stone-header-h: ${HEADER_H_DESKTOP}px;
            ${FEATURES.map(
              (_, i) =>
                `--why-stone-top-${i}: ${
                  PAGE_HEADER_DESKTOP +
                  STACK_TOP_PAD_DESKTOP +
                  i * (HEADER_H_DESKTOP + STACK_GAP)
                }px;`
            ).join('\n            ')}
          }
        }
      `}</style>
    </section>
  );
}
