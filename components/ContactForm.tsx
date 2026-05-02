'use client';

import { useState } from 'react';

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

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
    // Wire to a real backend (Resend / Brevo / EmailJS / API route) when available.
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
      <Field label="Full Name" name="name" required />

      <div className="grid sm:grid-cols-2 gap-6">
        <Field label="Contact No" name="phone" type="tel" required />
        <Field label="Email" name="email" type="email" required />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <StateField required />
        <Field label="City" name="city" required />
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

      <button
        type="submit"
        className="w-full sm:w-auto inline-flex items-center justify-center px-8 lg:px-10 py-4 min-h-[48px] bg-ink text-bone kicker hover:bg-smoke transition-colors"
      >
        Send enquiry →
      </button>
    </form>
  );
}

// ── Fields ────────────────────────────────────────────────────────────────

function Field({
  label,
  name,
  type = 'text',
  required
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
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
