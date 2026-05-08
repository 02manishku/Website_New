'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ─────────────────────────────────────────────────────────────────────────
// Stage data: three failure modes a wood kitchen suffers, paired with the
// Magppie counter. Two-line dramatic titles read as a magazine spread.
// ─────────────────────────────────────────────────────────────────────────

type Stage = {
  id: string;
  number: string;
  yearMark: number;
  // One-word topic shown in the kicker. Same brand voice as every
  // other kicker on the site (single tracked uppercase line).
  topic: string;
  titleA: string;
  titleB: string;
  body: string;
  captionWood: string;
  captionStone: string;
  videoWebm: string;
  videoMp4: string;
  poster: string;
};

const STAGES: Stage[] = [
  {
    id: 'termites',
    number: '01',
    yearMark: 7,
    topic: 'Termites',
    titleA: 'Wood feeds termites.',
    titleB: 'Stone starves them.',
    body:
      "Termites tunnel into wood from inside the panels and feed for years before you see a single sign. A wooden cabinet can hide a hollow shell behind a perfect-looking face. Silverstone™ offers no cellulose, no fibre, no food at all. Termites that arrive at a Magppie kitchen leave hungry.",
    captionWood: 'Wood. Year seven. Three cabinets already hollow.',
    captionStone: 'Magppie Silverstone™. Untouched.',
    videoWebm: '/videos/wood-vs-stone-termites.webm',
    videoMp4: '/videos/wood-vs-stone-termites.mp4',
    poster: '/images/wood-vs-stone/wood-vs-stone-termites.webp'
  },
  {
    id: 'fungus',
    number: '02',
    yearMark: 14,
    topic: 'Moisture',
    titleA: 'Wood drinks water.',
    titleB: 'Stone refuses every drop.',
    body:
      "Wood is hygroscopic — it pulls water straight out of the air. In monsoon it swells; in dark cabinets, mould blooms unseen for years. Silverstone™ is non-porous to the molecule. Water beads off and leaves. Nothing grows in a Magppie kitchen that wasn't placed there.",
    captionWood: 'Wood. Year fourteen. Mould in every cabinet.',
    captionStone: 'Magppie Silverstone™. Zero absorption.',
    videoWebm: '/videos/wood-vs-stone-fungus.webm',
    videoMp4: '/videos/wood-vs-stone-fungus.mp4',
    poster: '/images/wood-vs-stone/wood-vs-stone-fungus.webp'
  },
  {
    id: 'formaldehyde',
    number: '03',
    yearMark: 22,
    topic: 'Formaldehyde',
    titleA: 'Wood emits poison.',
    titleB: 'Stone emits nothing.',
    body:
      "Compressed wood panels off-gas formaldehyde for up to thirty years after the kitchen is installed. The WHO classifies it as a Class-1 carcinogen — the same category as asbestos and tobacco smoke. Silverstone™ is inert mineral — it cannot release what isn't inside it. The air your family breathes stays the air your family breathes.",
    captionWood: 'Wood. Year twenty-two. The air, still leaking.',
    captionStone: 'Magppie Silverstone™. Inert. Forever.',
    videoWebm: '/videos/wood-vs-stone-formaldehyde.webm',
    videoMp4: '/videos/wood-vs-stone-formaldehyde.mp4',
    poster: '/images/wood-vs-stone/wood-vs-stone-formaldehyde.webp'
  }
];

export default function WoodVsStone() {
  return (
    <section className="bg-sand">
      <Desktop />
      <Mobile />
    </section>
  );
}

// ─── DESKTOP ─────────────────────────────────────────────────────────────
// Single pinned viewport. Heading, video and typography all share one
// screen — no scroll-into-empty-space dead zone, no thin top hairline,
// no negative margin trickery. The user reads the heading once at the top,
// then scrolls and only the stage content (year, title, body, video)
// changes underneath while the heading stays put.
// ─────────────────────────────────────────────────────────────────────────

function Desktop() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [progress, setProgress] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    // Desktop scrollytelling only — bail on mobile so we don't burn an
    // idle ScrollTrigger update loop on phones (the desktop block is
    // hidden via `hidden lg:block` and would never fire correctly
    // anyway).
    if (!window.matchMedia('(min-width: 1024px)').matches) return;
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        setProgress(self.progress);
        const idx = Math.min(
          STAGES.length - 1,
          Math.floor(self.progress * STAGES.length)
        );
        setActiveIdx(idx);
      }
    });
    return () => trigger.kill();
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === activeIdx) v.play().catch(() => {});
      else v.pause();
    });
  }, [activeIdx]);

  const yearDisplay = (() => {
    const segment = 1 / STAGES.length;
    const localProgress = (progress - activeIdx * segment) / segment;
    const stage = STAGES[activeIdx];
    const prevYear = activeIdx === 0 ? 0 : STAGES[activeIdx - 1].yearMark;
    return Math.max(
      0,
      Math.round(
        prevYear + (stage.yearMark - prevYear) * Math.max(0, localProgress)
      )
    );
  })();

  const activeStage = STAGES[activeIdx];

  return (
    <div
      ref={sectionRef}
      className="hidden lg:block relative"
      style={{ height: '220vh' }}
    >
      <div className="sticky top-0 h-screen flex flex-col bg-sand overflow-hidden">
        {/* ── HEADING ROW — sits at top of the pinned viewport, stays
            put while the user scrolls through stages. */}
        <div className="pt-16 xl:pt-20">
          <div className="mx-auto max-w-[1500px] px-10 grid grid-cols-12 gap-12 items-end">
            <div className="col-span-7">
              <div className="kicker text-smoke mb-4">The Evidence</div>
              <h2 className="font-display text-3xl xl:text-4xl 2xl:text-5xl text-ink leading-[1.05]">
                Wood kitchen vs.{' '}
                <span className="text-smoke">Stone kitchen.</span>
              </h2>
            </div>
            <div className="col-span-5">
              <p className="font-display italic text-ink/55 text-base xl:text-lg leading-snug max-w-md">
                Twenty-five years on the same kitchen. Wood fails three ways.
                Stone refuses to. Scroll, watch.
              </p>
            </div>
          </div>
        </div>

        {/* ── STAGE BODY — video + typographic stack, vertically centred
            in the remaining viewport height. */}
        <div className="flex-1 flex items-center pb-8">
          <div className="mx-auto max-w-[1500px] px-10 w-full grid grid-cols-12 gap-12 items-start">
            {/* LEFT — video frame + italic captions below. */}
            <div className="col-span-7">
              {/* Two-layer warm shadow tuned for bg-sand: a sharp close
                  shadow + a soft far one, both with a brown undertone so
                  the rectangle reads as a layered card on cream rather
                  than a black box dropped on a coloured surface. */}
              <div className="relative aspect-[16/10] bg-ink overflow-hidden shadow-[0_18px_30px_-15px_rgba(40,28,18,0.35),0_50px_90px_-30px_rgba(40,28,18,0.22)]">
                {STAGES.map((s, i) => (
                  <video
                    key={s.id}
                    ref={(el) => {
                      videoRefs.current[i] = el;
                    }}
                    muted
                    loop
                    playsInline
                    preload={i === 0 ? 'auto' : 'metadata'}
                    poster={s.poster}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${
                      i === activeIdx ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <source src={s.videoWebm} type="video/webm" />
                    <source src={s.videoMp4} type="video/mp4" />
                  </video>
                ))}
                {/* Hairline split between wood / stone halves. */}
                <div
                  aria-hidden
                  className="absolute inset-y-0 left-1/2 w-px bg-bone/15 pointer-events-none"
                />
              </div>

              {/* Brand stamps below the video — fixed labels that don't
                  swap per stage. The narrative now lives entirely in the
                  right-column title + body, the captions just identify
                  which side is which. */}
              <div className="mt-5 grid grid-cols-2 gap-10">
                <div className="kicker text-ink/55">Wellness Kitchen</div>
                <div className="kicker text-ink/55 text-right">
                  Magppie Kitchen
                </div>
              </div>
            </div>

            {/* RIGHT — editorial typography stack. Same anatomy as every
                other section heading on the site: kicker, display title
                with italic second line, body paragraph. No ghost numeral,
                no progress fraction, no decorative rules. The video on
                the left does the visual work; this column does the words.
                Cross-fade between stages is opacity-only (no slide), so
                copy doesn't visibly "move" while reading. */}
            <div className="col-span-5">
              <div className="kicker text-smoke">
                {activeStage.topic} · Year {activeStage.yearMark}
              </div>

              <h3
                key={activeStage.id}
                className="mt-5 font-display text-3xl xl:text-4xl 2xl:text-5xl leading-[1.05] text-ink animate-titleSwap"
              >
                {activeStage.titleA}
                <br />
                <em className="not-italic italic text-smoke">
                  {activeStage.titleB}
                </em>
              </h3>

              <p
                key={activeStage.id + '-body'}
                className="mt-6 max-w-md text-ink/70 leading-relaxed text-[0.95rem] animate-bodySwap"
              >
                {activeStage.body}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MOBILE ──────────────────────────────────────────────────────────────

function Mobile() {
  // <article> is an HTMLElement, not HTMLDivElement — keep the ref array
  // type loose so the callback assignment compiles.
  const stageRefs = useRef<(HTMLElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    // Mobile fallback only — desktop hides this whole block via
    // `lg:hidden`, so don't spin up three IntersectionObservers that
    // can never trigger.
    if (!window.matchMedia('(max-width: 1023px)').matches) return;
    const observers: IntersectionObserver[] = [];
    stageRefs.current.forEach((stage, i) => {
      if (!stage) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          const v = videoRefs.current[i];
          if (!v) return;
          if (entry.isIntersecting) v.play().catch(() => {});
          else v.pause();
        },
        { threshold: 0.3 }
      );
      observer.observe(stage);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="lg:hidden">
      {/* Heading flows in normal layout on mobile (no pinning). */}
      <div className="mx-auto max-w-[1400px] px-6 pt-20">
        <div className="kicker text-smoke mb-4">The Evidence</div>
        <h2 className="font-display text-3xl sm:text-4xl text-ink leading-[1.05]">
          Wood kitchen vs.{' '}
          <span className="text-smoke">Stone kitchen.</span>
        </h2>
        <p className="mt-5 font-display italic text-ink/60 text-base leading-snug max-w-md">
          Twenty-five years on the same kitchen. Wood fails three ways.
          Stone refuses to.
        </p>
      </div>

      <div className="mt-12 pb-20">
        {STAGES.map((s, i) => (
          <article
            key={s.id}
            ref={(el) => {
              stageRefs.current[i] = el;
            }}
            className="mx-auto max-w-[1400px] px-6 mt-16 first:mt-0"
          >
            <div className="kicker text-smoke mb-4">
              {s.topic} · Year {s.yearMark}
            </div>

            <h3 className="font-display text-3xl sm:text-4xl text-ink leading-[1.05]">
              {s.titleA}
              <br />
              <em className="not-italic italic text-smoke">{s.titleB}</em>
            </h3>

            <div className="relative aspect-[16/10] bg-ink overflow-hidden mt-6 shadow-[0_15px_25px_-12px_rgba(40,28,18,0.3),0_40px_70px_-25px_rgba(40,28,18,0.18)]">
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                muted
                loop
                playsInline
                preload="metadata"
                poster={s.poster}
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src={s.videoWebm} type="video/webm" />
                <source src={s.videoMp4} type="video/mp4" />
              </video>
              <div
                aria-hidden
                className="absolute inset-y-0 left-1/2 w-px bg-bone/15"
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-6">
              <div className="kicker text-ink/55">Wellness Kitchen</div>
              <div className="kicker text-ink/55 text-right">
                Magppie Kitchen
              </div>
            </div>

            <p className="mt-5 text-ink/75 leading-relaxed text-base sm:text-[0.95rem]">
              {s.body}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
