'use client';

import { useState } from 'react';
import Magnetic from '@/components/Magnetic';

// 28 Indian states, alphabetical.
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

// 8 Union Territories, listed at the end of the dropdown as a separate group.
const UNION_TERRITORIES = [
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

const BUDGET_TIERS = [
  'Between 11 To 15 Lakhs',
  'Between 16 To 25 Lakhs',
  'Between 25 To 30 Lakhs',
  'Above 30 Lakhs'
];

const TIMELINE = [
  'Within One Month',
  '1-3 Month',
  '3-6 Month',
  'After 6 Months'
];

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get('name') ?? '').trim(),
      // Route validates `^\d{10}$` after stripping non-digits, so any
      // input format ("9999999999", "+91 99999 99999", "(99) 999-9999")
      // is fine — the route normalises it.
      phone: String(formData.get('phone') ?? '').replace(/\D/g, ''),
      email: String(formData.get('email') ?? '').trim(),
      state: String(formData.get('state') ?? '').trim(),
      // Form's `city` lands in Zoho's City field via the route's
      // `location` parameter.
      location: String(formData.get('city') ?? '').trim(),
      budget: String(formData.get('budget') ?? '').trim(),
      timeline: String(formData.get('timeline') ?? '').trim(),
      // Honeypot — must be empty for a real visitor. Bots that
      // fill every input get filtered server-side.
      website: String(formData.get('website') ?? '')
    };

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          body.error || 'Submission failed. Please try again.'
        );
      }

      // Both fresh leads and `duplicate: true` responses are success
      // from the visitor's POV — they see the thank-you panel either
      // way. The route already preserves first-touch attribution
      // server-side.
      setSent(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      );
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="border hairline p-8 sm:p-12 text-center">
        <div className="label text-smoke mb-4">Thank you</div>
        <h3 className="font-display text-2xl sm:text-3xl text-ink leading-tight">
          We&rsquo;ve received your message.<br />
          A Magppie advisor will be in touch within one business day.
        </h3>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Honeypot — hidden from visible page, kept out of the tab order,
          ignored by screen readers. Real visitors leave this empty.
          Bots that fill every input get filtered server-side. */}
      <input
        type="text"
        name="website"
        defaultValue=""
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

      <Field
        label="Full Name"
        name="name"
        required
        autoComplete="name"
        enterKeyHint="next"
      />

      <div className="grid sm:grid-cols-2 gap-6">
        <Field
          label="Contact No"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          inputMode="numeric"
          pattern="\d{10}"
          enterKeyHint="next"
        />
        <Field
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          enterKeyHint="next"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <StateField required />
        <Field
          label="City"
          name="city"
          required
          autoComplete="address-level2"
          enterKeyHint="next"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <SelectField
          label="Estimated Budget"
          name="budget"
          required
          options={BUDGET_TIERS}
        />
        <SelectField
          label="How Soon Do You Require Kitchen?"
          name="timeline"
          options={TIMELINE}
        />
      </div>

      <label className="flex items-start gap-3 text-xs text-ink/60">
        <input type="checkbox" required className="mt-1 accent-ink" />
        <span>
          I have read and accept the privacy policy. I consent to be contacted
          by Magppie about my enquiry.
        </span>
      </label>

      {error && (
        <div
          role="alert"
          className="text-xs text-ink/85 border-l-2 border-ink py-2 pl-3 bg-ink/5"
        >
          {error}
        </div>
      )}

      <Magnetic className="block w-full sm:inline-block sm:w-auto" strength={0.3}>
        <button
          type="submit"
          disabled={submitting}
          className={`w-full sm:w-auto inline-flex items-center justify-center px-8 lg:px-10 py-4 min-h-[48px] bg-ink text-bone kicker transition-colors ${
            submitting
              ? 'opacity-60 cursor-not-allowed'
              : 'hover:bg-smoke'
          }`}
        >
          {submitting ? 'Sending…' : 'Send enquiry →'}
        </button>
      </Magnetic>
    </form>
  );
}

// ── Fields ────────────────────────────────────────────────────────────────

function Field({
  label,
  name,
  type = 'text',
  required,
  autoComplete,
  inputMode,
  pattern,
  enterKeyHint
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
  pattern?: string;
  enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
}) {
  return (
    <label className="block">
      <span className="label text-smoke mb-2 block">
        {label}
        {required && <span className="text-ink"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        pattern={pattern}
        enterKeyHint={enterKeyHint}
        className="w-full bg-transparent border-b hairline focus:border-ink outline-none py-2 text-ink text-base min-h-[44px]"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
  required
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="label text-smoke mb-2 block">
        {label}
        {required && <span className="text-ink"> *</span>}
      </span>
      <select
        name={name}
        required={required}
        className="w-full bg-transparent border-b hairline focus:border-ink outline-none py-2 text-ink text-base min-h-[44px]"
        defaultValue=""
      >
        <option value="" disabled>Select…</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

// State picker, 28 Indian states first (alphabetical), then the 8 Union
// Territories grouped at the end.
function StateField({ required }: { required?: boolean }) {
  return (
    <label className="block">
      <span className="label text-smoke mb-2 block">
        Select State
        {required && <span className="text-ink"> *</span>}
      </span>
      <select
        name="state"
        required={required}
        className="w-full bg-transparent border-b hairline focus:border-ink outline-none py-2 text-ink text-base min-h-[44px]"
        defaultValue=""
      >
        <option value="" disabled>Select…</option>
        <optgroup label="States">
          {INDIAN_STATES.map((s) => (
            <option key={'state-' + s}>{s}</option>
          ))}
        </optgroup>
        <optgroup label="Union Territories">
          {UNION_TERRITORIES.map((ut) => (
            <option key={'ut-' + ut}>{ut}</option>
          ))}
        </optgroup>
      </select>
    </label>
  );
}
