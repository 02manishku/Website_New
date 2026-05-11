'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useVideoLazyPlay } from '@/lib/use-video-lazy-play';
import { useDeviceCapability } from '@/lib/use-device-capability';

export default function HeroVideo() {
  const videoRef = useVideoLazyPlay();
  const { canPlayHeavyVideo } = useDeviceCapability();

  return (
    <section className="relative h-[100dvh] min-h-[560px] lg:min-h-[640px] w-full overflow-hidden bg-ink">
      {/* Low-end / save-data / slow-network / reduced-motion users skip
          the video entirely and see the brand hero image. Same
          composition, zero decoder cost. The text overlay still
          renders on top. */}
      {canPlayHeavyVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          loop
          preload="none"
          poster="/posters/brecciaa.webp"
          disablePictureInPicture
          disableRemotePlayback
          controls={false}
          aria-hidden="true"
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
          alt=""
          fill
          priority
          sizes="100vw"
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
        <h1 className="font-display font-light text-bone leading-[1.05] text-[2rem] sm:text-[2.5rem] md:text-5xl lg:text-[2.9vw] fade-up delay-1 [text-shadow:0_2px_18px_rgba(0,0,0,0.55)]">
          The World Needs Wellness.<br />
          Built in <em className="not-italic font-light italic">Stone.</em>
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

      {/* Scroll cue, a single down chevron with a slow bounce so it reads as
          an invitation to scroll without needing a label. `bottom-safe`
          floats it above the iOS home indicator on notched phones. */}
      <div className="absolute bottom-safe left-1/2 -translate-x-1/2 z-10 fade-up delay-3 text-bone/70 animate-bounce-slow">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  );
}
