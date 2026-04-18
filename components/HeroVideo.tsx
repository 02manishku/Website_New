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
    <section className="relative h-[100dvh] min-h-[640px] w-full overflow-hidden bg-ink">
      {/* Hero video — clean source, full bleed */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/images/hero.jpg"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/brecciaa.webm" type="video/webm" />
        <source src="/videos/brecciaa.mp4" type="video/mp4" />
      </video>

      {/* Soft top + bottom darkening for type legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/45 via-transparent to-ink/65 pointer-events-none" />

      {/* Bottom-left title block — tucked into the corner so the video stays the hero */}
      <div className="absolute bottom-16 lg:bottom-20 left-6 lg:left-10 z-10 max-w-[640px]">
        <div className="kicker text-bone/85 mb-4 lg:mb-5 fade-up">
          Introducing the World&rsquo;s First Wellness Kitchen
        </div>
        <h1 className="font-display text-bone leading-[0.95] text-[8vw] md:text-[5.5vw] lg:text-[4.4vw] fade-up delay-1 drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)]">
          The World needs<br />
          a new <em className="not-italic font-light italic">Kitchen.</em>
        </h1>
        <div className="mt-6 lg:mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 fade-up delay-2">
          <Link href="/kitchens" className="kicker text-bone hover-underline">
            Wellness Kitchen →
          </Link>
          <Link href="/wardrobes" className="kicker text-bone hover-underline">
            Wellness Wardrobe →
          </Link>
          <Link href="/vanities" className="kicker text-bone hover-underline">
            Wellness Vanity →
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
