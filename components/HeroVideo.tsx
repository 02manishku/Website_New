'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
  }, []);

  return (
    <section className="relative h-[100dvh] min-h-[560px] lg:min-h-[640px] w-full overflow-hidden bg-ink">
      {/* Hero video - clean source, full bleed */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/images/hero.webp"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/brecciaa.webm" type="video/webm" />
        <source src="/videos/brecciaa.mp4" type="video/mp4" />
      </video>

      {/* Stronger darkening on the left where the copy sits, for legibility on bright scenes */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/30 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-transparent to-ink/70 pointer-events-none" />

      {/* Bottom-left title block - tucked into the corner so the video stays the hero */}
      <div className="absolute bottom-20 lg:bottom-20 left-6 lg:left-10 right-6 lg:right-auto z-10 max-w-[560px]">
        <div className="kicker text-bone/90 mb-3 lg:mb-4 fade-up">
          Introducing the World&rsquo;s First Wellness Kitchen
        </div>
        <h1 className="font-display text-bone leading-[1.05] text-[2rem] sm:text-[2.5rem] md:text-[3.8vw] lg:text-[2.9vw] fade-up delay-1 [text-shadow:0_2px_18px_rgba(0,0,0,0.55)]">
          The World Needs Wellness.<br />
          Built in <em className="not-italic font-light italic">Stone.</em>
        </h1>
        <div className="mt-5 lg:mt-8 flex flex-wrap items-center gap-x-4 md:gap-x-8 gap-y-2 lg:gap-y-3 fade-up delay-2">
          <Link href="/kitchens" className="kicker text-bone hover-underline">
            Wellness Kitchens →
          </Link>
          <Link href="/wardrobes" className="kicker text-bone hover-underline">
            Wellness Wardrobes →
          </Link>
          <Link href="/vanities" className="kicker text-bone hover-underline">
            Wellness Vanities →
          </Link>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 fade-up delay-3">
        <div className="kicker text-bone/70 flex items-center gap-3">
          <span>Scroll</span>
          <span className="block w-10 h-px bg-bone/60" />
        </div>
      </div>
    </section>
  );
}
