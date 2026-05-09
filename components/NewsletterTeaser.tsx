'use client';

import { useEffect, useRef, useState } from 'react';

// Persistence key. Stored in sessionStorage so the teaser comes back on a
// fresh visit but stays gone within the current session — a forever-dismiss
// would feel sticky on a luxury brand site, a per-page nag would feel cheap.
const STORAGE_KEY = 'magppie:newsletter-teaser-dismissed';

// First-paint delay so the teaser doesn't slam in at the same time as the
// hero video — feels intentional, not aggressive.
const REVEAL_DELAY_MS = 1000;

type Mode = 'collapsed' | 'expanded' | 'thanks';

export default function NewsletterTeaser() {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<Mode>('collapsed');
  const [email, setEmail] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(STORAGE_KEY) === '1') return;
    const t = setTimeout(() => setVisible(true), REVEAL_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  // When the user expands the form, focus the email input so they can type
  // straight away — one fewer click between intent and action.
  useEffect(() => {
    if (mode === 'expanded') emailRef.current?.focus();
  }, [mode]);

  function dismiss() {
    setVisible(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, '1');
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Endpoint TBD — until then, optimistic acknowledgement so the
    // experience feels finished. Replace with a real fetch call when the
    // newsletter API ships.
    setMode('thanks');
    window.setTimeout(dismiss, 2400);
  }

  if (!visible) return null;

  return (
    <div
      // print:hidden, no point shipping pixels to paper. The widget sits at
      // z-40, one below the header (z-50) so menu interactions always win.
      // pr-safe + pb-safe nudges it inward when iOS draws a home indicator
      // or rotates into landscape with a notch on the right edge.
      // `hidden md:block` keeps the teaser off phone-sized viewports (it
      // covers up the bottom CTAs in the hero copy block); it only appears
      // from tablets up where there's spare canvas in the corner.
      className="hidden md:block fixed bottom-4 right-4 lg:bottom-6 lg:right-6 z-40 print:hidden pr-safe pb-safe"
      role="complementary"
      aria-label="Newsletter signup"
    >
      {mode === 'collapsed' && (
        <div className="relative bg-bone border border-ink/10 shadow-[0_20px_45px_-20px_rgba(0,0,0,0.35)]">
          <button
            type="button"
            aria-label="Dismiss newsletter prompt"
            onClick={dismiss}
            className="absolute top-1.5 right-1.5 p-2 text-ink/60 hover:text-ink transition-colors"
          >
            <CloseIcon />
          </button>
          <button
            type="button"
            onClick={() => setMode('expanded')}
            aria-label="Open newsletter signup"
            className="flex items-center gap-4 lg:gap-5 pl-5 pr-10 py-4 lg:pl-6 lg:pr-12 lg:py-5 group"
          >
            <span className="kicker text-ink leading-[1.45] text-left whitespace-nowrap">
              Receive our newsletters
              <br />
              and stay in touch
            </span>
            <EnvelopeIcon className="text-ink shrink-0 transition-transform group-hover:scale-105" />
          </button>
        </div>
      )}

      {mode === 'expanded' && (
        <div className="relative bg-bone border border-ink/10 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.45)] w-[min(92vw,360px)] p-6 lg:p-7">
          <button
            type="button"
            aria-label="Close newsletter form"
            onClick={dismiss}
            className="absolute top-2.5 right-2.5 p-2 text-ink/60 hover:text-ink transition-colors"
          >
            <CloseIcon />
          </button>
          <div className="kicker text-ink mb-3">Receive our newsletter</div>
          <p className="text-sm text-ink/70 leading-relaxed mb-5">
            Magppie stories, new openings, and design notes. Quietly delivered.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              ref={emailRef}
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              enterKeyHint="send"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              aria-label="Email address"
              className="w-full bg-transparent border-b border-ink/30 focus:border-ink outline-none py-2 text-ink placeholder:text-ink/35 text-sm"
            />
            <button
              type="submit"
              className="kicker w-full bg-ink text-bone py-3 hover:bg-ink/85 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      )}

      {mode === 'thanks' && (
        <div className="relative bg-bone border border-ink/10 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.45)] w-[min(92vw,360px)] p-6 lg:p-7">
          <button
            type="button"
            aria-label="Close"
            onClick={dismiss}
            className="absolute top-2.5 right-2.5 p-2 text-ink/60 hover:text-ink transition-colors"
          >
            <CloseIcon />
          </button>
          <div className="kicker text-smoke mb-3">Thank you</div>
          <div className="font-display text-xl text-ink leading-tight">
            You&rsquo;re on the list.
          </div>
        </div>
      )}
    </div>
  );
}

function EnvelopeIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="2.5" y="5" width="19" height="14" />
      <polyline points="2.5 6 12 13 21.5 6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
