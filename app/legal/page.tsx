import type { Metadata } from 'next';

// Pending legal review. Copy below is a structural placeholder so the
// "Legal" link in the Footer doesn't 404 until the lawyers turn around
// the real text.

export const metadata: Metadata = {
  title: { absolute: 'Legal | Magppie' },
  description:
    'Site ownership, intellectual property, warranty, and jurisdiction terms for the Magppie website.',
  alternates: {
    canonical: '/legal',
    languages: { 'en-IN': '/legal', 'x-default': '/legal' }
  },
  robots: { index: true, follow: true }
};

const LAST_UPDATED = 'May 2026';

export default function LegalPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 lg:py-32">
      <div className="mb-12 border-l-2 border-ink/30 pl-4 py-2 text-[11px] text-ink/60 uppercase tracking-[0.18em]">
        Pending legal review — placeholder copy
      </div>

      <h1 className="font-display text-4xl sm:text-5xl text-ink leading-tight mb-2">
        Legal
      </h1>
      <p className="text-sm text-smoke mb-16">Last updated: {LAST_UPDATED}</p>

      <div className="space-y-12">
        <section>
          <h2 className="font-display text-2xl text-ink mb-3">
            1. Site Ownership
          </h2>
          <p className="text-ink/75 leading-relaxed">
            This website is owned and operated by Magppie Silverstone Pvt.
            Ltd., a company incorporated under the laws of India and
            doing business as the Magppie Living brand of Wellness
            Kitchens, Wardrobes, and Vanities.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-3">
            2. Intellectual Property
          </h2>
          <p className="text-ink/75 leading-relaxed">
            All photography, brand marks, written copy, video, and other
            creative material on this website are the property of Magppie
            Silverstone Pvt. Ltd. or are used with permission. Reproduction,
            republication, or distribution of any material from this site,
            in any form, without prior written permission from Magppie is
            prohibited.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-3">3. No Warranty</h2>
          <p className="text-ink/75 leading-relaxed">
            The information on this site is provided on an &ldquo;as
            is&rdquo; basis. While we take reasonable care to keep
            content accurate, we make no warranties as to completeness or
            currency. Links to third-party sites are provided for
            convenience only and do not imply endorsement.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-3">4. Jurisdiction</h2>
          <p className="text-ink/75 leading-relaxed">
            Any dispute arising out of or in connection with this website
            or its content shall be subject to the exclusive jurisdiction
            of the competent courts in New Delhi, India.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-3">5. Contact</h2>
          <p className="text-ink/75 leading-relaxed">
            For all legal queries, please write to{' '}
            <a
              href="mailto:legal@magppie.com"
              className="underline underline-offset-4 hover:text-ink"
            >
              legal@magppie.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
