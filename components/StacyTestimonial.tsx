'use client';

import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';
import { useVideoLazyPlay } from '@/lib/use-video-lazy-play';
import { useDeviceCapability } from '@/lib/use-device-capability';

export default function StacyTestimonial() {
  // Two refs: lazy-play callback ref wires the observers; local ref
  // gives the mute toggle access to the underlying element.
  const lazyPlayRef = useVideoLazyPlay(0.45);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const attachVideo = useCallback(
    (v: HTMLVideoElement | null) => {
      videoRef.current = v;
      lazyPlayRef(v);
    },
    [lazyPlayRef]
  );
  const { canPlayHeavyVideo } = useDeviceCapability();
  // Video starts muted (iOS autoplay policy). User tap toggles audio.
  // We mirror the muted state in React for the button's aria-pressed.
  const [muted, setMuted] = useState(true);

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    const next = !v.muted;
    v.muted = next;
    setMuted(next);
    if (v.paused) v.play().catch(() => {});
  }

  return (
    <section className="bg-sand py-20 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="kicker text-smoke mb-8 lg:mb-14">From a Global Peer</div>
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Text - below video on mobile, left of video on desktop */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <blockquote className="font-display font-light italic text-ink/85 text-lg sm:text-xl md:text-2xl lg:text-[1.85rem] leading-[1.5] tracking-[0.005em]">
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
                <div className="text-[0.72rem] sm:text-[0.78rem] text-smoke mt-1">
                  Certified Master Kitchen &amp; Bath Designer · Florida, USA
                </div>
              </div>
            </div>
          </div>

          {/* Video - above text on mobile, right on desktop. Low-end /
              save-data / slow-network devices get the still portrait
              instead of the video. The testimonial copy carries the
              substance; the video is enhancement. */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative aspect-video overflow-hidden bg-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)]">
              {canPlayHeavyVideo ? (
                <>
                  <video
                    ref={attachVideo}
                    autoPlay
                    playsInline
                    muted
                    loop
                    preload="none"
                    poster="/posters/stacy.webp"
                    disablePictureInPicture
                    disableRemotePlayback
                    controls={false}
                    className="absolute inset-0 w-full h-full object-cover"
                  >
                    <source
                      src="/videos/stacy-mobile.mp4"
                      type="video/mp4"
                      media="(max-width: 768px)"
                    />
                    <source src="/videos/stacy.mp4" type="video/mp4" />
                    <source src="/videos/stacy.webm" type="video/webm" />
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
                </>
              ) : (
                // Same /posters/stacy.webp the video would have started
                // on (the video's true first frame) \xe2\x80\x94 keeps visual
                // identity across capable + incapable devices. The small
                // portrait avatar next to the blockquote keeps the
                // recognisable face.
                <Image
                  src="/posters/stacy.webp"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
