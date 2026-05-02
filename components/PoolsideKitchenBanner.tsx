'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

// The pool-area video has 5 seconds of intro lead-in (camera settling, blank
// frames) that we don't want shown on the homepage. Skip past it on first
// load AND on every loop, so the section opens directly into the kitchen
// reveal instead of starting on dead frames.
const LOOP_START = 5;

export default function PoolsideKitchenBanner() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const seekToStart = () => {
      try {
        video.currentTime = LOOP_START;
      } catch {
        // Some browsers throw if metadata isn't ready yet, the loadedmetadata
        // listener below will retry once the duration is known.
      }
    };

    const handleLoadedMetadata = () => {
      seekToStart();
      video.play().catch(() => {});
    };

    // Native `loop` would restart at 0, defeating the whole point. Instead we
    // listen for `ended` and seek back to LOOP_START ourselves.
    const handleEnded = () => {
      seekToStart();
      video.play().catch(() => {});
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    // If metadata is already loaded by the time this effect runs (cached
    // navigation, fast connections), seek immediately so we don't show the
    // dead intro frames for even one tick.
    if (video.readyState >= 1) {
      seekToStart();
      video.play().catch(() => {});
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <section className="relative h-[65vh] min-h-[420px] lg:h-[80vh] overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="metadata"
        poster="/images/02.webp"
        className="absolute inset-0 w-full h-full object-cover"
      >
        {/* `#t=5` hint, lets the browser start decoding from the 5s mark on
            its own when supported, the JS above is the reliable fallback. */}
        <source src="/videos/pool-area-1.webm#t=5" type="video/webm" />
        <source src="/videos/pool-area-1.mp4#t=5" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" />
      <div className="absolute inset-0 flex items-end">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10 pb-14 lg:pb-20 w-full">
          <div className="label text-bone/80 mb-4 lg:mb-6">Concept</div>
          <h2 className="font-display md:whitespace-nowrap text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-bone leading-[1.02] lg:leading-none">
            The Poolside Kitchen.
          </h2>
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
