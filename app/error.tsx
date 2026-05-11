'use client';

// Top-level Next.js error boundary. Catches any unhandled error that
// escapes a per-component SafeBoundary and lands at the page level.
// Minimal UI — no animation, no fonts to load, no third-party calls.
// Last line of defence; the only path from here is the Refresh button.

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface in production console so Vercel logs catch it.
    // eslint-disable-next-line no-console
    console.error('[page] uncaught error', error);
  }, [error]);

  return (
    <main className="min-h-[100dvh] flex items-center justify-center bg-bone px-6">
      <div className="text-center max-w-md">
        <div className="label text-smoke mb-6">Error</div>
        <h1 className="font-display text-3xl sm:text-4xl text-ink leading-tight">
          Something went wrong on this page.
        </h1>
        <p className="mt-6 text-ink/65 text-sm">
          Refresh to try again. If the problem keeps happening, please
          let us know at info@mymagppie.com.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center justify-center mt-10 px-8 sm:px-10 py-4 min-h-[48px] border border-ink text-ink text-sm font-medium tracking-wide uppercase hover:bg-ink hover:text-bone transition-colors"
        >
          Refresh
        </button>
      </div>
    </main>
  );
}
