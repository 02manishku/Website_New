import PageHero from '@/components/PageHero';
import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'Contact | Magppie',
  description: 'Book a consultation, visit a Magppie experience centre, or write to us.'
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        kicker="Get in Touch"
        title="Talk to Magppie."
        image="/images/02.webp"
        subtitle="Book a private consultation or visit a Magppie experience centre."
      />

      <section className="bg-bone py-20 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5 space-y-10 lg:space-y-12">
            <div>
              <div className="kicker text-smoke mb-4">Headquarters</div>
              <p className="font-display text-xl sm:text-2xl text-ink leading-snug">
                Magppie Silverstone Pvt. Ltd.<br />
                352, Sultanpur, MG Road<br />
                New Delhi - 110030
              </p>
            </div>
            <div>
              <div className="kicker text-smoke mb-4">Direct</div>
              <p className="text-ink space-y-1">
                <a href="mailto:info@mymagppie.com" className="block hover-underline">
                  info@mymagppie.com
                </a>
                <a href="tel:+919999248801" className="block hover-underline">
                  +91 999 924 8801
                </a>
              </p>
            </div>
            <div>
              <div className="kicker text-smoke mb-4">Hours</div>
              <p className="text-ink/70 text-sm">
                Mon - Sat &nbsp;·&nbsp; 10:00 - 19:00 IST<br />
                By appointment.
              </p>
            </div>
          </div>

          <div id="book" className="lg:col-span-7 scroll-mt-24">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
