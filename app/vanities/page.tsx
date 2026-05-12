import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import ScrollFloat from '@/components/ScrollFloat';
import MotionSection from '@/components/MotionSection';
import JsonLd from '@/components/JsonLd';
import {
  wellnessVanitySchema,
  brandSchema,
  collectionPageSchema,
  breadcrumbSchema,
  SITE_URL
} from '@/lib/seo';

export const metadata: Metadata = {
  title: {
    absolute:
      'Luxury Bathroom Vanity in India | Stone Vanities in Silverstone™ | Magppie'
  },
  description:
    "Magppie Wellness Vanities, fully built in patented Silverstone™. Waterproof, scratch-resistant, antibacterial. Eight finishes from Onyx Gold to Flurry Black. Showrooms in Delhi, Mumbai, Bengaluru, Hyderabad, Mohali, Surat, Coimbatore. 25-year guarantee.",
  keywords: [
    'luxury bathroom vanity India',
    'stone bathroom vanity India',
    'modular bathroom vanity India',
    'best bathroom vanity brand India',
    'Silverstone vanity',
    'wellness vanity',
    'Magppie vanity',
    'antibacterial bathroom vanity',
    'waterproof vanity India',
    'bathroom vanity Delhi',
    'bathroom vanity Mumbai',
    'bathroom vanity Bengaluru',
    'bathroom vanity Hyderabad',
    'Onyx Gold vanity',
    'Flurry Black vanity',
    'sintered stone vanity'
  ],
  alternates: {
    canonical: '/vanities',
    languages: { 'en-IN': '/vanities', 'x-default': '/vanities' }
  },
  openGraph: {
    title: 'Luxury Bathroom Vanities in Stone | Magppie India',
    description:
      'Wellness Vanities in patented Silverstone™. Waterproof, antibacterial, 25-year guarantee.',
    url: '/vanities',
    images: [
      {
        url: '/og/vanities-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Magppie Wellness Vanity in Silverstone™ Onyx Gold'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luxury Bathroom Vanities in Stone | Magppie India',
    description: 'Eight Silverstone™ finishes, from Onyx Gold to Flurry Black.',
    images: ['/og/vanities-og.jpg']
  }
};

export default function VanitiesPage() {
  return (
    <>
      <JsonLd
        data={[
          collectionPageSchema({
            name: 'Luxury Bathroom Vanities in Silverstone™',
            description:
              'Magppie Wellness Vanities, fully built in patented Silverstone™.',
            path: '/vanities',
            productId: `${SITE_URL}/vanities#product`
          }),
          brandSchema,
          wellnessVanitySchema,
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Wellness Vanities', path: '/vanities' }
          ])
        ]}
      />
      <PageHero
        kicker="Introducing the World’s First Wellness Vanity"
        title="Vanities built in stone. For a lifetime of wellness."
        image="/images/vanities/onyx-gold-overmount-02.webp"
        subtitle="The vanity meets water every day. Conventional plywood swells, rots and grows mould inches from your toothbrush, skincare, your face. Magppie built it in stone. Water-proof. Bacteria-safe. Mould-immune. Guaranteed for 25 years."
      />

      {/* Intro */}
      <MotionSection id="wellness" className="bg-bone py-20 lg:py-40 scroll-mt-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid lg:grid-cols-12 gap-6 lg:gap-10">
          <div className="lg:col-span-4">
            <div className="kicker text-smoke">A Sanctuary in Stone</div>
          </div>
          <div className="lg:col-span-8">
            <ScrollFloat
              as="h2"
              containerClassName="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-[1.05] text-ink"
            >
              Where you begin and end the day
              <em className="not-italic text-smoke"> deserves </em>
              wellness too.
            </ScrollFloat>
            <p className="mt-8 lg:mt-10 text-base lg:text-lg text-ink/70 max-w-2xl leading-relaxed">
              The bathroom is the most water-and-humidity intense room in any
              home, the most welcoming surface for mold, bacteria and
              fungi. Magppie Wellness Vanities replace the standard wood,
              MDF and plywood entirely with patented Silverstone™: every
              cabinet, fascia, drawer and handle. The result is a vanity
              that is naturally bacteria-safe, water-proof for life, and
              quietly architectural.
            </p>
          </div>
        </div>
      </MotionSection>

      {/* Built in Stone feature */}
      <MotionSection className="bg-sand py-20 lg:py-40">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/vanities/onyx-gold-overmount.webp"
                alt="Magppie wellness vanity in Onyx Gold Silverstone with overmount basin | Luxury bathroom vanity India"
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="kicker text-smoke mb-6">Built in Stone</div>
            <ScrollFloat
              as="h2"
              containerClassName="font-display text-3xl sm:text-4xl md:text-5xl text-ink leading-tight"
            >
              Every cabinet, fascia and handle, in patented Silverstone™.
            </ScrollFloat>
            <p className="mt-6 lg:mt-8 text-ink/70 leading-relaxed">
              Where wood-based vanities swell, rot and grow mould after years
              of splashes and steam, a Magppie vanity is inert stone from the
              inside out. Water-proof for life, bacteria-safe, mould-immune.
              The cleanest surface in the cleanest room of your home.
            </p>
          </div>
        </div>
      </MotionSection>

      {/* Concepts grid */}
      <MotionSection className="bg-bone pt-20 lg:pt-32 pb-20 lg:pb-32">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10 mb-10 lg:mb-12">
          <ScrollFloat
            as="h2"
            containerClassName="font-display text-3xl md:text-4xl text-ink"
          >
            Wellness Vanity Concepts.
          </ScrollFloat>
        </div>
        <div className="grid lg:grid-cols-2 gap-2 px-2">
          {VANITIES.map((v) => (
            <div key={v.name} className="relative overflow-hidden">
              <div className="relative aspect-[4/3]">
                <Image
                  src={v.image}
                  alt={`Magppie wellness vanity ${v.name} in ${v.finish} Silverstone | Luxury bathroom vanity India`}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover tile-img"
                />
              </div>
              <div className="absolute bottom-0 left-0 p-5 sm:p-6 lg:p-8 text-bone bg-gradient-to-t from-ink/70 to-transparent w-full">
                <div className="font-display text-xl sm:text-2xl lg:text-3xl">
                  {v.finish}
                </div>
              </div>
            </div>
          ))}

          {/* Closing CTA tile, fills the otherwise-empty slot when the
              concept count is odd, and gives the row a clear next step. */}
          <Link
            href="/contact"
            className="group relative overflow-hidden block bg-ink"
          >
            <div className="relative aspect-[4/3] flex items-center justify-center">
              <div className="text-center px-6">
                <div className="font-display font-light text-4xl sm:text-5xl lg:text-6xl text-bone leading-[1.05]">
                  Explore more
                </div>
                <div className="mt-5 lg:mt-6 text-sm text-bone/60 group-hover:text-bone transition-colors inline-flex items-center gap-2">
                  <span>Book a consultation</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </MotionSection>

      {/* Made for water */}
      <MotionSection className="bg-sand py-20 lg:py-40">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/vanities/03.webp"
                alt="Magppie wellness vanity built for water, non-porous Silverstone | Waterproof luxury bathroom vanity India"
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="kicker text-smoke mb-6">Built for Water</div>
            <ScrollFloat
              as="h2"
              containerClassName="font-display text-3xl sm:text-4xl md:text-5xl text-ink leading-tight"
            >
              Mold-proof. Stain-proof. Steam-proof.
            </ScrollFloat>
            <p className="mt-6 lg:mt-8 text-ink/70 leading-relaxed">
              Silverstone™ is non-porous and naturally repels moisture. Where
              wood-based vanities swell, warp and grow mold within years, a
              Magppie vanity stays as sharp on day 9,000 as on day one. Backed
              by our 25-year guarantee and 25 complimentary services.
            </p>
          </div>
        </div>
      </MotionSection>

      {/* Five reasons */}
      <MotionSection className="bg-bone py-20 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="kicker text-smoke mb-4">Five Reasons</div>
          <ScrollFloat
            as="h2"
            containerClassName="font-display text-3xl sm:text-4xl md:text-5xl text-ink leading-tight max-w-3xl"
          >
            Why every Magppie vanity is, quietly, the most advanced in the room.
          </ScrollFloat>

          <div className="mt-12 lg:mt-16 grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-ink/10">
            {REASONS.map((r, i) => (
              <div key={r.title} className="bg-bone p-6 sm:p-8">
                <div className="font-display text-2xl text-smoke/40 mb-4">
                  0{i + 1}
                </div>
                <h3 className="font-display text-xl text-ink mb-3">{r.title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed">{r.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </MotionSection>

      {/* Finishes for vanities */}
      <MotionSection id="finishes" className="bg-sand py-20 lg:py-28 scroll-mt-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="kicker text-smoke mb-4">Vanity Finishes</div>
          <ScrollFloat
            as="h2"
            containerClassName="font-display text-3xl sm:text-4xl md:text-5xl text-ink leading-tight max-w-3xl"
          >
            A curated palette of Silverstone™ finishes for the bath.
          </ScrollFloat>
          <div className="mt-12 lg:mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {FINISHES.map((f) => (
              <div key={f.name} className="group">
                <div className="relative aspect-[3/4] overflow-hidden bg-sandlight">
                  <Image
                    src={f.image}
                    alt={`${f.name} Silverstone finish for Magppie wellness vanity | Luxury bathroom vanity India`}
                    fill
                    quality={90}
                    sizes="(min-width: 1024px) 16vw, (min-width: 768px) 25vw, 50vw"
                    className="object-cover tile-img"
                  />
                </div>
                <div className="mt-3">
                  <div className="font-display text-base text-ink">{f.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MotionSection>

      {/* CTA */}
      <MotionSection className="bg-sandlight py-20 lg:py-28">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 text-center">
          <ScrollFloat
            as="h2"
            containerClassName="font-display text-3xl sm:text-4xl md:text-6xl text-ink leading-tight"
          >
            Begin your Wellness Vanity journey.
          </ScrollFloat>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center mt-8 lg:mt-10 px-8 lg:px-10 py-4 min-h-[48px] border border-ink text-ink kicker hover:bg-ink hover:text-bone transition-colors"
          >
            Book a consultation
          </Link>
        </div>
      </MotionSection>
    </>
  );
}

const VANITIES = [
  {
    name: 'Onyx Gold: Master suite',
    finish: 'Magppie Onyx Gold (Overmount)',
    image: '/images/vanities/onyx-gold-overmount.webp'
  },
  {
    name: 'Onyx Gold: Undermount',
    finish: 'Magppie Onyx Gold (Undermount)',
    image: '/images/vanities/onyx-gold-undermount.webp'
  },
  {
    name: 'Onyx Mystic: Boudoir',
    finish: 'Magppie Onyx Mystic',
    image: '/images/vanities/onyx-mystic-overmount.webp'
  },
  {
    name: 'Taj: Monolithic',
    finish: 'Magppie Taj',
    image: '/images/vanities/taj-overmount.webp'
  },
  {
    name: 'Calcatta Perlato: Warm marble',
    finish: 'Magppie Calcatta Perlato',
    image: '/images/vanities/calcatta-perlato-overmount.webp'
  },
  {
    name: 'Flurry Black: Graphite bath',
    finish: 'Magppie Flurry Black',
    image: '/images/vanities/flurry-black-overmount-02.webp'
  },
  {
    name: 'Onyx Mystic: Guest powder',
    finish: 'Magppie Onyx Mystic',
    image: '/images/vanities/onyx-mystic-overmount-02.webp'
  }
];

const REASONS = [
  {
    title: 'Bacteria-Safe',
    copy: 'Silver-ion infused stone, naturally hostile to bacteria, mold and fungi. Tested and certified.'
  },
  {
    title: 'Water-Proof for Life',
    copy: 'Non-porous Silverstone™ does not swell, warp or stain, even with daily steam and splash.'
  },
  {
    title: 'Zero Formaldehyde',
    copy: 'No MDF, no plywood, no laminates, and no toxic emissions next to your skincare.'
  },
  {
    title: 'Architectural Detailing',
    copy: 'Cabinets, fascias, handles and side panels, all in matching stone. A monolithic, sculptural object.'
  },
  {
    title: '25 + 25 Promise',
    copy: 'A 25-year guarantee paired with 25 complimentary annual services. Quietly maintained for life.'
  }
];

// Curated 6, a tight selection of the full 41 Silverstone™ finishes that
// suit a vanity's intimate scale: warm onyxes, soft cream marbles, and
// quiet super-matt neutrals. Real photographs from the brand catalogue.
const FINISHES = [
  { name: 'Magppie Onyx Gold',          texture: 'High Gloss',   image: '/images/finishes/group-1/magppie-onyx-gold.webp' },
  { name: 'Magppie Onyx Mystic',        texture: 'High Gloss',   image: '/images/finishes/group-1/magppie-onyx-mystic.webp' },
  { name: 'Magppie Romano',             texture: 'High Gloss',   image: '/images/finishes/group-1/magppie-romano.webp' },
  { name: 'Magppie Persian Travertine', texture: 'Matt Texture', image: '/images/finishes/group-1/magppie-persian-travertine.webp' },
  { name: 'Magppie Calm',                texture: 'Super Matt',  image: '/images/finishes/group-1/magppie-calm.webp' },
  { name: 'Magppie Cloud Stone',         texture: 'Super Matt',  image: '/images/finishes/group-2/magppie-cloud-stone.webp' }
];
