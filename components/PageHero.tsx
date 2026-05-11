'use client';

import Image from 'next/image';
import { useVideoLazyPlay } from '@/lib/use-video-lazy-play';
import { useDeviceCapability } from '@/lib/use-device-capability';

export default function PageHero({
  kicker,
  title,
  image,
  video,
  subtitle
}: {
  kicker: string;
  title: string;
  image: string;
  video?: string;
  subtitle?: string;
}) {
  const videoRef = useVideoLazyPlay();
  const { canPlayHeavyVideo } = useDeviceCapability();

  // Derive mobile + webm paths from the desktop MP4 path. Callers pass
  // `video="/videos/foo.mp4"` and we expand to the family.
  const videoBase = video?.replace(/\.mp4$/, '');
  const showVideo = video && canPlayHeavyVideo;

  return (
    <section className="relative h-[100dvh] min-h-[560px] lg:min-h-[640px] w-full overflow-hidden bg-ink">
      <div className="absolute inset-0 overflow-hidden">
        {showVideo ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            loop
            preload="none"
            poster={image}
            disablePictureInPicture
            disableRemotePlayback
            controls={false}
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              transform: 'scale(1.20) translate(4%, -5%)',
              transformOrigin: 'center center'
            }}
          >
            {/* MP4 first, mobile variant first within MP4. iOS reads the
                first matching source and never falls back; WebM as a
                terminal fallback for Firefox / Chrome on desktop. */}
            <source
              src={`${videoBase}-mobile.mp4`}
              type="video/mp4"
              media="(max-width: 768px)"
            />
            <source src={`${videoBase}.mp4`} type="video/mp4" />
            <source src={`${videoBase}.webm`} type="video/webm" />
          </video>
        ) : (
          <Image
            src={image}
            // Decorative — the same `title` is rendered as the page <h1>
            // immediately below this hero, so a non-empty alt would
            // duplicate the announcement to screen readers.
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{
              transform: 'scale(1.06)',
              transformOrigin: 'center center'
            }}
          />
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/30 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-transparent to-ink/70 pointer-events-none" />

      {/* Bottom-left vignette to mask any brand watermark on source videos */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 320px 180px at 0% 100%, rgba(0,0,0,0.55), transparent 70%)'
        }}
      />

      <div className="absolute inset-0 flex items-end z-10">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10 pb-8 lg:pb-12 w-full">
          <div className="max-w-[640px]">
            <div className="kicker text-bone/90 mb-4 fade-up">{kicker}</div>
            {/* Same lesson as HeroVideo, the previous `md:text-[4.2vw]` shrank
                to ~32px at 768px, smaller than sm-breakpoint 44px. Fixed
                steps for sm/md, fluid vw only at lg. */}
            <h1 className="font-display font-light text-bone leading-[1.05] text-[2.25rem] sm:text-[2.75rem] md:text-[3.25rem] lg:text-[3.1vw] fade-up [text-shadow:0_2px_18px_rgba(0,0,0,0.55)]">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-4 lg:mt-6 max-w-[520px] text-bone/95 text-[0.88rem] sm:text-[0.95rem] lg:text-[0.92rem] leading-[1.55] lg:leading-[1.6] fade-up delay-1 [text-shadow:0_1px_10px_rgba(0,0,0,0.6)]">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
