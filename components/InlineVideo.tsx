'use client';

import Image from 'next/image';
import { useVideoLazyPlay } from '@/lib/use-video-lazy-play';
import { useDeviceCapability } from '@/lib/use-device-capability';

// Reusable client wrapper for inline <video> blocks living inside server
// pages (app/page.tsx, app/kitchens/page.tsx, etc.). Wraps the lazy-play
// hook + capability gate so server pages don't need to convert to
// client just to host a single decorative loop.
//
// Pass `videoMp4="/videos/foo.mp4"` and we expand the mobile variant
// (`foo-mobile.mp4`) + the webm sibling automatically.

export default function InlineVideo({
  videoMp4,
  poster,
  className,
  alt = '',
  loop = true,
  decorative = true
}: {
  /** Path to the desktop MP4 (e.g. "/videos/copper-infused-silver.mp4"). */
  videoMp4: string;
  /** Poster image path (preferably WebP). */
  poster: string;
  /** Tailwind classes applied to the <video> / fallback <Image>. */
  className?: string;
  /** Alt text for the fallback <Image>. Decorative videos pass alt="". */
  alt?: string;
  /** Whether to set the native `loop` attribute. */
  loop?: boolean;
  /** Decorative videos get `aria-hidden`; informational ones don't. */
  decorative?: boolean;
}) {
  const ref = useVideoLazyPlay();
  const { canPlayHeavyVideo } = useDeviceCapability();
  const base = videoMp4.replace(/\.mp4$/, '');

  if (!canPlayHeavyVideo) {
    return (
      <Image
        src={poster}
        alt={alt}
        fill
        sizes="100vw"
        className={`object-cover ${className ?? ''}`}
      />
    );
  }

  return (
    <video
      ref={ref}
      playsInline
      muted
      loop={loop}
      preload="none"
      poster={poster}
      disablePictureInPicture
      disableRemotePlayback
      controls={false}
      aria-hidden={decorative}
      className={className}
    >
      {/* MP4 first, mobile variant first within MP4. iOS reads the
          first matching source and never falls back. */}
      <source
        src={`${base}-mobile.mp4`}
        type="video/mp4"
        media="(max-width: 768px)"
      />
      <source src={`${base}.mp4`} type="video/mp4" />
      <source src={`${base}.webm`} type="video/webm" />
    </video>
  );
}
