import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-bone px-6">
      <div className="text-center max-w-xl">
        <div className="kicker text-smoke mb-6">404</div>
        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl text-ink leading-tight">
          This page is no longer here.
        </h1>
        <p className="mt-6 text-ink/60">
          The link may be old, or the page may have moved. Let us help you find your way.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center mt-10 px-8 sm:px-10 py-4 min-h-[48px] border border-ink text-ink kicker hover:bg-ink hover:text-bone transition-colors"
        >
          Return home
        </Link>
      </div>
    </section>
  );
}
