'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function StacyTestimonial() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Play when the section is in view, pause when it leaves.
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const io = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting) {
          // Try unmuted first. Browsers may block it if there's been no user
          // interaction yet; fall back to muted autoplay so the video still runs.
          video.muted = false;
          try {
            await video.play();
            setMuted(false);
            setPlaying(true);
          } catch {
            video.muted = true;
            setMuted(true);
            try {
              await video.play();
              setPlaying(true);
            } catch {
              setPlaying(false);
            }
          }
        } else {
          video.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.45 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    const next = !v.muted;
    v.muted = next;
    setMuted(next);
    if (v.paused) v.play().catch(() => {});
  }

  return (
    <section
      ref={sectionRef}
      className="bg-sand py-20 lg:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="kicker text-smoke mb-8 lg:mb-14">From a Global Peer</div>
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Text - below video on mobile, left of video on desktop */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <blockquote className="font-display italic text-ink/90 text-xl sm:text-2xl md:text-3xl lg:text-[2.35rem] leading-[1.35]">
              &ldquo;Working with Magppie was a revelation. The craftsmanship,
              the materials philosophy, the depth of thinking about how a
              kitchen should actually function for health, it&rsquo;s unlike
              anything I&rsquo;ve encountered in my 20-year career as a kitchen
              designer.&rdquo;
            </blockquote>
            <div className="mt-8 lg:mt-10 flex items-center gap-4 lg:gap-5">
              <div className="relative w-14 h-14 lg:w-16 lg:h-16 rounded-full overflow-hidden bg-smoke/20 shrink-0">
                <Image
                  src="/images/Partners/Stacy_Mc_Carthy.webp"
                  alt="Stacy McCarthy"
                  fill
                  sizes="64px"
                  quality={85}
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-display text-ink text-base sm:text-lg lg:text-xl leading-tight">
                  Stacy McCarthy
                </div>
                <div className="kicker text-smoke mt-1 text-[0.58rem] sm:text-[0.62rem]">
                  Certified Master Kitchen &amp; Bath Designer · Florida, USA
                </div>
              </div>
            </div>
          </div>

          {/* Video - above text on mobile, right on desktop */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative aspect-video overflow-hidden bg-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)]">
              <video
                ref={videoRef}
                playsInline
                loop
                preload="metadata"
                poster="/images/Partners/Stacy_Mc_Carthy.webp"
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src="/videos/stacy.webm" type="video/webm" />
                <source src="/videos/stacy.mp4" type="video/mp4" />
              </video>

              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? 'Unmute video' : 'Mute video'}
                aria-pressed={!muted}
                className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 bg-ink/70 hover:bg-ink/90 backdrop-blur text-bone px-4 py-2 text-[0.62rem] tracking-[0.22em] uppercase font-medium transition-colors"
              >
                {muted ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <line x1="23" y1="9" x2="17" y2="15" />
                      <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                    Unmute
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    </svg>
                    Mute
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
