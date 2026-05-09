import type { Metadata } from 'next';

// Pending legal review. Copy below is a structural placeholder so the
// privacy reference in ContactForm + Footer + NewsletterTeaser doesn't
// 404 while the lawyers turn around the real text.

export const metadata: Metadata = {
  title: { absolute: 'Privacy Policy | Magppie' },
  description:
    'How Magppie Silverstone Pvt. Ltd. collects, uses, and protects the personal information you share through the website and contact forms.',
  alternates: {
    canonical: '/privacy',
    languages: { 'en-IN': '/privacy', 'x-default': '/privacy' }
  },
  robots: { index: true, follow: true }
};

const LAST_UPDATED = 'May 2026';

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 lg:py-32">
      {/* Banner — explicit placeholder marker so anyone reviewing the
          page knows the copy hasn't yet been signed off. Removed once
          the lawyers return final text. */}
      <div className="mb-12 border-l-2 border-ink/30 pl-4 py-2 text-[11px] text-ink/60 uppercase tracking-[0.18em]">
        Pending legal review — placeholder copy
      </div>

      <h1 className="font-display text-4xl sm:text-5xl text-ink leading-tight mb-2">
        Privacy Policy
      </h1>
      <p className="text-sm text-smoke mb-16">Last updated: {LAST_UPDATED}</p>

      <div className="space-y-12">
        <section>
          <h2 className="font-display text-2xl text-ink mb-3">
            1. Information We Collect
          </h2>
          <p className="text-ink/75 leading-relaxed">
            When you submit the consultation enquiry form, we collect your
            full name, contact phone number, email address, the state and
            city you live in, an indicative project budget, and your
            preferred timeline. When you subscribe to the Magppie
            newsletter, we collect only your email address.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-3">
            2. How We Use Your Information
          </h2>
          <p className="text-ink/75 leading-relaxed mb-3">
            Consultation enquiries are routed to Magppie&rsquo;s customer
            relationship system (Zoho CRM) so a designer can call you back
            within one business day. Newsletter signups are stored with our
            email service provider (Resend) for the sole purpose of
            sending you Magppie stories, new openings, and design notes.
          </p>
          <p className="text-ink/75 leading-relaxed">
            We do not sell, rent, or share your personal information with
            third parties for their marketing.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-3">
            3. Cookies and Analytics
          </h2>
          <p className="text-ink/75 leading-relaxed">
            We use Vercel Analytics for privacy-respecting visitor
            measurement (no personally identifiable cookies, no
            cross-site tracking) and Sentry for technical error
            monitoring (it captures error stack traces, not user
            content). The site does not run advertising trackers.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-3">
            4. Your Rights
          </h2>
          <p className="text-ink/75 leading-relaxed">
            You can request access to, correction of, or deletion of any
            personal information we hold about you by writing to{' '}
            <a
              href="mailto:privacy@magppie.com"
              className="underline underline-offset-4 hover:text-ink"
            >
              privacy@magppie.com
            </a>
            . We respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-3">5. Contact</h2>
          <p className="text-ink/75 leading-relaxed">
            Magppie Silverstone Pvt. Ltd.
            <br />
            Registered office: <span className="text-ink/45">[pending]</span>
            <br />
            <a
              href="mailto:privacy@magppie.com"
              className="underline underline-offset-4 hover:text-ink"
            >
              privacy@magppie.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
