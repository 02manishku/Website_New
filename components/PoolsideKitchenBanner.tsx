'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ScrollFloat from '@/components/ScrollFloat';
import { useVideoLazyPlay } from '@/lib/use-video-lazy-play';
import { useDeviceCapability } from '@/lib/use-device-capability';

// The pool-area video has 5 seconds of intro lead-in (camera settling, blank
// frames) that we don't want shown on the homepage. Skip past it on first
// load AND on every loop, so the section opens directly into the kitchen
// reveal instead of starting on dead frames.
const LOOP_START = 5;

export default function PoolsideKitchenBanner() {
  const videoRef = useVideoLazyPlay();
  const { canPlayHeavyVideo } = useDeviceCapability();

  // Loop-point custom seek: native `loop` would restart at 0, defeating
  // the whole point. We listen for `loadedmetadata` to seek past the
  // intro on first load, and for `ended` to seek back on every loop.
  // Plays via the coordinator (useVideoLazyPlay) so the slot accounting
  // stays correct.
  useEffect(() => {
    if (!canPlayHeavyVideo) return;
    const v = videoRef.current;
    if (!v) return;

    const seekToStart = () => {
      try {
        v.currentTime = LOOP_START;
      } catch {
        // Some browsers throw if metadata isn't ready yet.
      }
    };
    const onLoadedMeta = () => {
      seekToStart();
    };
    const onEnded = () => {
      seekToStart();
      v.play().catch(() => {});
    };

    v.addEventListener('loadedmetadata', onLoadedMeta);
    v.addEventListener('ended', onEnded);

    // Already-loaded case (cached nav).
    if (v.readyState >= 1) seekToStart();

    return () => {
      v.removeEventListener('loadedmetadata', onLoadedMeta);
      v.removeEventListener('ended', onEnded);
    };
  }, [canPlayHeavyVideo, videoRef]);

  return (
    <section className="relative h-[65dvh] min-h-[420px] lg:h-[80dvh] overflow-hidden">
      {canPlayHeavyVideo ? (
        <video
          ref={videoRef}
          playsInline
          muted
          preload="none"
          poster="/images/02.webp"
          disablePictureInPicture
          disableRemotePlayback
          controls={false}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        >
          {/* MP4 first, mobile variant first within MP4. The `#t=5` hint
              tells the browser to start decoding from the 5s mark on
              its own when supported; the JS effect above is the
              reliable fallback. */}
          <source
            src="/videos/pool-area-1-mobile.mp4#t=5"
            type="video/mp4"
            media="(max-width: 768px)"
          />
          <source src="/videos/pool-area-1.mp4#t=5" type="video/mp4" />
          <source src="/videos/pool-area-1.webm#t=5" type="video/webm" />
        </video>
      ) : (
        <Image
          src="/images/02.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" />
      <div className="absolute inset-0 flex items-end">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10 pb-14 lg:pb-20 w-full">
          <div className="label text-bone/80 mb-4 lg:mb-6">Concept</div>
          <ScrollFloat
            as="h2"
            containerClassName="font-display md:whitespace-nowrap text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-bone leading-[1.02] lg:leading-none"
          >
            The Poolside Kitchen.
          </ScrollFloat>
          <Link
            href="/kitchens#poolside"
            className="inline-block mt-8 lg:mt-10 text-sm text-bone hover-underline"
          >
            Experience the concept →
          </Link>
        </div>
      </div>
    </section>
  );
}
