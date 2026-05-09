'use client';

import { useState } from 'react';

// Extracted from Footer so the newsletter signup can run as a client
// component (real fetch + status states) while the rest of the
// footer stays server-rendered.
//
// Posts to /api/newsletter. Submits a hidden `website` honeypot so
// scripted bots filling every input get filtered server-side.

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function FooterNewsletterForm() {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(''); // honeypot, must stay empty
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');
    setMessage(null);

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

      setStatus('success');
      setEmail('');
      setMessage('Thanks. Check your inbox for the next dispatch.');
    } catch (err) {
      setStatus('error');
      setMessage(
        err instanceof Error ? err.message : 'Something went wrong.'
      );
    }
  }

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="flex items-center gap-x-3 border-b border-bone/30 pb-2 mb-6"
      >
        {/* Honeypot — visually hidden, kept out of the tab order, marked
            aria-hidden so screen readers skip it. Real users never see
            or fill this field. */}
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
        {/* `text-base` (16px) on the input, anything smaller triggers
            iOS Safari's auto-zoom on focus, which on a luxury site
            feels like a bug. min-h-11 keeps the touch target at
            44px without altering the visual baseline. */}
        <input
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          enterKeyHint="send"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          aria-label="Email address"
          disabled={status === 'sending' || status === 'success'}
          className="flex-1 min-w-0 bg-transparent placeholder-bone/40 text-base focus:outline-none py-2 min-h-11 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === 'sending' || status === 'success' || !agreed}
          className="text-sm font-medium text-bone hover:text-sand transition-colors py-2 px-1 shrink-0 min-h-11 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'sending' ? 'Sending…' : 'Submit →'}
        </button>
      </form>

      <label className="flex items-start gap-2 text-xs text-bone/50">
        <input
          type="checkbox"
          className="mt-1 accent-sand"
          required
          aria-required="true"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        <span>I have read and accept the privacy policy.</span>
      </label>

      {message && (
        <div
          role={status === 'error' ? 'alert' : 'status'}
          aria-live={status === 'error' ? 'assertive' : 'polite'}
          className={`mt-4 text-xs leading-relaxed ${
            status === 'error' ? 'text-sand' : 'text-bone/65'
          }`}
        >
          {message}
        </div>
      )}
    </>
  );
}
