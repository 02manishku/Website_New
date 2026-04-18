'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
    // Wire to a real backend (Resend / Brevo / EmailJS / API route) when available.
  }

  if (sent) {
    return (
      <div className="border hairline p-12 text-center">
        <div className="kicker text-smoke mb-4">Thank you</div>
        <h3 className="font-display text-3xl text-ink leading-tight">
          We&rsquo;ve received your message.<br />
          A Magppie advisor will be in touch within one business day.
        </h3>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <Field label="First name" name="first" required />
        <Field label="Last name" name="last" required />
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <Field label="Email" name="email" type="email" required />
        <Field label="Phone" name="phone" type="tel" />
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <Field label="City" name="city" />
        <SelectField
          label="Interested in"
          name="interest"
          options={['Wellness Kitchen', 'Wellness Wardrobe', 'Both', 'Trade / Architect', 'Press']}
        />
      </div>
      <Field label="Tell us about your project" name="message" textarea />

      <label className="flex items-start gap-3 text-xs text-ink/60">
        <input type="checkbox" required className="mt-1 accent-ink" />
        <span>
          I have read and accept the privacy policy. I consent to be contacted
          by Magppie about my enquiry.
        </span>
      </label>

      <button
        type="submit"
        className="px-10 py-4 bg-ink text-bone kicker hover:bg-smoke transition-colors"
      >
        Send enquiry →
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required,
  textarea
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="kicker text-smoke mb-2 block">
        {label}{required && <span className="text-ink"> *</span>}
      </span>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          rows={5}
          className="w-full bg-transparent border-b hairline focus:border-ink outline-none py-2 text-ink"
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          className="w-full bg-transparent border-b hairline focus:border-ink outline-none py-2 text-ink"
        />
      )}
    </label>
  );
}

function SelectField({
  label,
  name,
  options
}: {
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="kicker text-smoke mb-2 block">{label}</span>
      <select
        name={name}
        className="w-full bg-transparent border-b hairline focus:border-ink outline-none py-2 text-ink"
        defaultValue=""
      >
        <option value="" disabled>Select…</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}
