import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import JsonLd from '@/components/JsonLd';
import {
  allIndiaLocalBusinessSchemas,
  designConsultationServiceSchema,
  indiaShowroomsItemListSchema,
  breadcrumbSchema
} from '@/lib/seo';

export const metadata: Metadata = {
  title: {
    absolute:
      'Contact Magppie | Book a Modular Kitchen Consultation in India'
  },
  description:
    'Book a Magppie Wellness Kitchen consultation. Studios in Delhi (Sultanpur, Kirti Nagar), Mumbai (Lower Parel), Bengaluru (Indiranagar), Hyderabad (Jubilee Hills), Mohali, Surat, Coimbatore. Speak to design experts about your luxury modular kitchen, wardrobe or vanity.',
  keywords: [
    'Magppie contact',
    'Magppie showroom',
    'Magppie Delhi showroom',
    'Magppie Mumbai showroom',
    'Magppie Bengaluru showroom',
    'Magppie Hyderabad showroom',
    'Magppie Mohali',
    'Magppie Surat',
    'Magppie Coimbatore',
    'modular kitchen consultation India',
    'book modular kitchen designer',
    'Magppie phone number',
    'modular kitchen near me'
  ],
  alternates: {
    canonical: '/contact',
    languages: { 'en-IN': '/contact', 'x-default': '/contact' }
  },
  openGraph: {
    title: 'Contact Magppie | Book a Wellness Kitchen Consultation',
    description:
      'Visit a Magppie showroom or book a consultation. Available across India.',
    url: '/contact',
    images: [
      {
        url: '/og/contact-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact Magppie, book a Wellness Kitchen consultation'
      }
    ]
  },
  twitter: {
    title: 'Contact Magppie | Book a Wellness Kitchen Consultation',
    description: 'Book a consultation at a Magppie showroom.',
    images: ['/og/contact-og.jpg']
  }
};

export default function ContactPage() {
  return (
    <>
      {/* Contact carries every India LocalBusiness schema (9 total) since
          it's the page where users want phone + address per city. Google
          can resolve "magppie delhi phone", "magppie mumbai showroom",
          "magppie bengaluru contact" and any other city pairing
          directly off this page. Plus the Service schema (consultation),
          ItemList of all showrooms, and the breadcrumb. */}
      <JsonLd
        data={[
          ...allIndiaLocalBusinessSchemas,
          indiaShowroomsItemListSchema,
          designConsultationServiceSchema,
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' }
          ])
        ]}
      />
      {/* Hero removed by request, page jumps straight into HQ details + form.
          Top padding accounts for the fixed Header height (h-16 / lg:h-20).  */}
      <section className="bg-bone pt-32 lg:pt-44 pb-20 lg:pb-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <h1 className="font-display font-light text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-ink leading-[1.05] mb-12 lg:mb-20">
            Talk to Magppie.
          </h1>
        </div>
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5 space-y-10 lg:space-y-12">
            <div>
              <div className="label text-smoke mb-4">Headquarters</div>
              <p className="font-display text-xl sm:text-2xl text-ink leading-snug">
                Magppie Silverstone Pvt. Ltd.<br />
                352, Sultanpur, MG Road<br />
                New Delhi - 110030
              </p>
            </div>
            <div>
              <div className="label text-smoke mb-4">Direct</div>
              <p className="text-ink space-y-1">
                <a href="mailto:info@mymagppie.com" className="block hover-underline py-2 -my-2">
                  info@mymagppie.com
                </a>
                <a href="tel:+919999248801" className="block hover-underline py-2 -my-2">
                  +91 999 924 8801
                </a>
              </p>
            </div>
            <div>
              <div className="label text-smoke mb-4">Hours</div>
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
