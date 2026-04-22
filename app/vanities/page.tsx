import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/PageHero';

export const metadata = {
  title: 'Wellness Vanity | Magppie',
  description:
    'Magppie Wellness Vanities, fully built in patented anti-bacterial Silverstone™. Safe, hygienic, mineral-luxe surfaces for the most intimate room of the home.'
};

export default function VanitiesPage() {
  return (
    <>
      <PageHero
        kicker="Introducing the World’s First Wellness Vanity"
        title="Vanities built in stone. For a lifetime of wellness."
        image="/images/vanities/onyx-gold-overmount-02.webp"
        subtitle="The vanity meets water every day. Conventional plywood swells, rots and grows mould inches from your toothbrush, skincare, your face. Magppie built it in stone. Water-proof. Bacteria-safe. Mould-immune. Guaranteed for 25 years."
      />

      {/* Intro */}
      <section id="wellness" className="bg-bone py-20 lg:py-40 scroll-mt-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid lg:grid-cols-12 gap-6 lg:gap-10">
          <div className="lg:col-span-4">
            <div className="kicker text-smoke">A Sanctuary in Stone</div>
          </div>
          <div className="lg:col-span-8">
            <h2 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-[1.05] text-ink">
              Where you begin and end the day
              <em className="not-italic text-smoke"> deserves </em>
              wellness too.
            </h2>
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
      </section>

      {/* Built in Stone feature */}
      <section className="bg-sand py-20 lg:py-40">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/vanities/onyx-gold-overmount.webp"
                alt="Magppie Wellness Vanity, built entirely in Silverstone™"
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="kicker text-smoke mb-6">Built in Stone</div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink leading-tight">
              Every cabinet, fascia and handle, in patented Silverstone™.
            </h2>
            <p className="mt-6 lg:mt-8 text-ink/70 leading-relaxed">
              Where wood-based vanities swell, rot and grow mould after years
              of splashes and steam, a Magppie vanity is inert stone from the
              inside out. Water-proof for life, bacteria-safe, mould-immune.
              The cleanest surface in the cleanest room of your home.
            </p>
            <Link
              href="/materials"
              className="inline-block mt-8 lg:mt-10 kicker hover-underline"
            >
              Explore Silverstone™ →
            </Link>
          </div>
        </div>
      </section>

      {/* Concepts grid */}
      <section className="bg-bone pt-20 lg:pt-32 pb-20 lg:pb-32">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10 mb-10 lg:mb-12">
          <h2 className="font-display text-3xl md:text-4xl text-ink">
            Wellness Vanity Concepts.
          </h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-2 px-2">
          {VANITIES.map((v) => (
            <div key={v.name} className="relative overflow-hidden">
              <div className="relative aspect-[4/3]">
                <Image
                  src={v.image}
                  alt={`${v.name}, ${v.finish}`}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover tile-img"
                />
              </div>
              <div className="absolute bottom-0 left-0 p-5 sm:p-6 lg:p-8 text-bone bg-gradient-to-t from-ink/70 to-transparent w-full">
                <div className="kicker text-bone/80">Stone finish</div>
                <div className="font-display text-xl sm:text-2xl lg:text-3xl mt-1">
                  {v.finish}
                </div>
                <div className="kicker text-bone/60 mt-1">{v.name}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Made for water */}
      <section className="bg-sand py-20 lg:py-40">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/vanities/03.webp"
                alt="Magppie Wellness Vanity, built for water"
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="kicker text-smoke mb-6">Built for Water</div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink leading-tight">
              Mold-proof. Stain-proof. Steam-proof.
            </h2>
            <p className="mt-6 lg:mt-8 text-ink/70 leading-relaxed">
              Silverstone™ is non-porous and naturally repels moisture. Where
              wood-based vanities swell, warp and grow mold within years, a
              Magppie vanity stays as sharp on day 9,000 as on day one. Backed
              by our 25-year guarantee and 25 complimentary services.
            </p>
            <Link
              href="/materials"
              className="inline-block mt-8 lg:mt-10 kicker hover-underline"
            >
              Explore Silverstone™ →
            </Link>
          </div>
        </div>
      </section>

      {/* Five reasons */}
      <section className="bg-bone py-20 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="kicker text-smoke mb-4">Five Reasons</div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink leading-tight max-w-3xl">
            Why every Magppie vanity is, quietly, the most advanced in the room.
          </h2>

          <div className="mt-12 lg:mt-16 grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-ink/10">
            {REASONS.map((r, i) => (
              <div key={r.title} className="bg-bone p-6 sm:p-8">
                <div className="kicker text-smoke mb-4">
                  0{i + 1}
                </div>
                <h3 className="font-display text-xl text-ink mb-3">{r.title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed">{r.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Finishes for vanities */}
      <section id="finishes" className="bg-sand py-20 lg:py-28 scroll-mt-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="kicker text-smoke mb-4">Vanity Finishes</div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink leading-tight max-w-3xl">
            A curated palette of Silverstone™ finishes for the bath.
          </h2>
          <div className="mt-12 lg:mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {FINISHES.map((f) => (
              <div key={f.name} className="group">
                <div
                  className="relative aspect-[3/4] overflow-hidden"
                  style={{ background: f.tone }}
                >
                  <div
                    className="absolute inset-0 mix-blend-overlay opacity-60"
                    style={{
                      backgroundImage:
                        'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.6), transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(0,0,0,0.25), transparent 60%)'
                    }}
                  />
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(115deg, rgba(0,0,0,0.06) 0 2px, transparent 2px 14px)'
                    }}
                  />
                </div>
                <div className="mt-3">
                  <div className="font-display text-base text-ink">{f.name}</div>
                  <div className="kicker text-smoke text-[10px] mt-1">{f.texture}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link href="/materials" className="kicker hover-underline">
              All 41 Silverstone™ finishes →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-sandlight py-20 lg:py-28">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 text-center">
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl text-ink leading-tight">
            Begin your Wellness Vanity journey.
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center mt-8 lg:mt-10 px-8 lg:px-10 py-4 min-h-[48px] border border-ink text-ink kicker hover:bg-ink hover:text-bone transition-colors"
          >
            Book a consultation
          </Link>
        </div>
      </section>
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
    name: 'Classico Bianco: Crisp minimal',
    finish: 'Magppie Classico Bianco (Overmount)',
    image: '/images/vanities/classico-bianco-overmount.webp'
  },
  {
    name: 'Classico Bianco: Undermount',
    finish: 'Magppie Classico Bianco (Undermount)',
    image: '/images/vanities/classico-bianco-undermount.webp'
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

const FINISHES = [
  { name: 'Magppie Onyx Gold',   texture: 'High Gloss', tone: '#D8C29A' },
  { name: 'Magppie Onyx Mystic', texture: 'High Gloss', tone: '#E2D8C8' },
  { name: 'Magppie Romano',      texture: 'High Gloss', tone: '#D8C9AC' },
  { name: 'Magppie Travertino',  texture: 'Matt Texture', tone: '#D6C5A6' },
  { name: 'Magppie Calm',        texture: 'Super Matt',  tone: '#E2E5E2' },
  { name: 'Magppie Cloud Stone', texture: 'Super Matt',  tone: '#EAE5D6' }
];
