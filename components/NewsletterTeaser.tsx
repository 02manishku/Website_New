'use client';

import { useEffect, useRef, useState } from 'react';
import FocusLock from 'react-focus-lock';

// Persistence key. Stored in sessionStorage so the teaser comes back on a
// fresh visit but stays gone within the current session — a forever-dismiss
// would feel sticky on a luxury brand site, a per-page nag would feel cheap.
const STORAGE_KEY = 'magppie:newsletter-teaser-dismissed';

// First-paint delay so the teaser doesn't slam in at the same time as the
// hero video — feels intentional, not aggressive.
const REVEAL_DELAY_MS = 1000;

type Mode = 'collapsed' | 'expanded' | 'sending' | 'thanks' | 'error';

export default function NewsletterTeaser() {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<Mode>('collapsed');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
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

  // Esc dismisses the popup whenever it's not in the collapsed state.
  // Standard dialog-pattern expectation; combined with FocusLock below
  // this satisfies WCAG 2.1 SC 2.1.2 (No Keyboard Trap) and the
  // role=\"dialog\" semantics announced to screen readers.
  useEffect(() => {
    if (mode === 'collapsed') return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') dismiss();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mode]);

  function dismiss() {
    setVisible(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, '1');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === 'sending') return;

    setMode('sending');
    setErrorMsg(null);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website })
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Subscription failed.');
      }

      setMode('thanks');
      // Auto-dismiss the popup after the user has had time to read the
      // confirmation. Same beat as the original placebo behaviour.
      window.setTimeout(dismiss, 2400);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Something went wrong.'
      );
      setMode('error');
    }
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

      {(mode === 'expanded' || mode === 'sending' || mode === 'error') && (
        <FocusLock returnFocus>
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Subscribe to Magppie updates"
          className="relative bg-bone border border-ink/10 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.45)] w-[min(92vw,360px)] p-6 lg:p-7"
        >
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
            {/* Honeypot — hidden from the visible page, kept out of the
                tab order, ignored by screen readers. Bots that fill
                every input get filtered server-side. */}
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '-9999px',
                width: 1,
                height: 1,
                opacity: 0,
                pointerEvents: 'none'
              }}
            />
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
              disabled={mode === 'sending'}
              // text-base (16px) NOT text-sm — anything smaller triggers
              // iOS Safari's auto-zoom on focus, which on a fixed-
              // position popup looks broken.
              className="w-full bg-transparent border-b border-ink/30 focus:border-ink outline-none py-2 text-ink placeholder:text-ink/35 text-base disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={mode === 'sending'}
              className="kicker w-full bg-ink text-bone py-3 hover:bg-ink/85 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {mode === 'sending' ? 'Subscribing…' : 'Subscribe'}
            </button>
            {mode === 'error' && errorMsg && (
              <div
                role="alert"
                className="text-xs text-ink/85 border-l-2 border-ink py-2 pl-3 bg-ink/5"
              >
                {errorMsg}
              </div>
            )}
          </form>
        </div>
        </FocusLock>
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
