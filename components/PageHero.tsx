'use client';

import Image from 'next/image';
import { useVideoLazyPlay } from '@/lib/use-video-lazy-play';
import { useDeviceCapability } from '@/lib/use-device-capability';

export default function PageHero({
  kicker,
  title,
  image,
  imageAlt,
  videoTitle,
  video,
  subtitle
}: {
  kicker: string;
  title: string;
  image: string;
  /** SEO alt text for the hero image. Defaults to a brand-keyword
   *  composite derived from the page title; pass an explicit
   *  string for keyword-targeted copy on a per-page basis. */
  imageAlt?: string;
  /** SEO title attribute applied to the underlying <video> element.
   *  Surfaces in Google Video Search results + the browser tooltip
   *  on hover. Defaults to the same composite as imageAlt. */
  videoTitle?: string;
  video?: string;
  subtitle?: string;
}) {
  // Default SEO-friendly alt/title if the caller doesn't pass one.
  // Includes the page title verbatim + the brand + a primary keyword
  // anchor so even un-customised heroes carry a useful signal.
  const altText =
    imageAlt ||
    `${title} | Magppie luxury modular kitchen, wardrobe and vanity India`;
  const titleText = videoTitle || altText;
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
            preload="metadata"
            poster={image}
            disablePictureInPicture
            disableRemotePlayback
            controls={false}
            aria-hidden="true"
            title={titleText}
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
            // SEO-keyword-rich alt now. The hero image is the largest
            // crawlable image on every sub-page and is a high-value
            // signal for Google Image Search. Screen-reader users
            // still see the page <h1> immediately below; the alt
            // here repeats the heading verbatim only by default, and
            // call-sites can override with imageAlt for sharper
            // per-keyword targeting (kitchens / wardrobes / vanities
            // / about / contact / news).
            alt={altText}
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
