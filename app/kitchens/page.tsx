import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import JsonLd from '@/components/JsonLd';
import { wellnessKitchenSchema, breadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: {
    absolute: 'Modular Kitchen Designs in Silverstone™ | Magppie India'
  },
  description:
    "Luxury modular kitchens in patented antibacterial Silverstone™. Zero formaldehyde, termite-proof, fire-rated. Trusted by India's most discerning homes. 25-year guarantee.",
  alternates: { canonical: '/kitchens' },
  openGraph: {
    title: 'Modular Kitchen Designs in Silverstone™ | Magppie India',
    description:
      'Luxury modular kitchens in patented antibacterial Silverstone™. Zero formaldehyde, termite-proof, fire-rated.',
    url: '/kitchens',
    images: [
      {
        url: '/og/kitchens-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Magppie Wellness Kitchen with skylights, built in Silverstone™'
      }
    ]
  },
  twitter: {
    title: 'Modular Kitchen Designs in Silverstone™ | Magppie India',
    description:
      "India's only kitchen built fully in patented antibacterial Silverstone™.",
    images: ['/og/kitchens-og.jpg']
  }
};

export default function KitchensPage() {
  return (
    <>
      <JsonLd
        data={[
          wellnessKitchenSchema,
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Wellness Kitchens', path: '/kitchens' }
          ])
        ]}
      />
      <PageHero
        kicker="Introducing the World’s First Wellness Kitchen"
        title="Kitchens built in stone. For a lifetime of wellness."
        video="/videos/main-kitchen.mp4"
        image="/images/hero.webp"
        subtitle="Conventional plywood kitchens silently leak cancer-causing formaldehyde, harbor termites and catch fire easily. Magppie changed that. Our kitchens are built entirely in Silverstone, our patented anti-bacterial, anti-termite, fire-safe medicated stone. Safer. Cleaner. Built to last. Guaranteed for 25 years."
      />

      {/* Intro statement */}
      <section id="wellness" className="bg-bone py-20 lg:py-40 scroll-mt-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid lg:grid-cols-12 gap-6 lg:gap-10">
          <div className="lg:col-span-4">
            <div className="kicker text-smoke">A New Definition of Luxury</div>
          </div>
          <div className="lg:col-span-8">
            <h2 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-[1.05] text-ink">
              The most advanced kitchen in the world. Also the
              <em className="not-italic text-smoke"> most stunning </em>
              to look at.
            </h2>
            <p className="mt-8 lg:mt-10 text-base lg:text-lg text-ink/70 max-w-2xl leading-relaxed">
              For the first time ever, every internal cabinet, door fascia,
              countertop, backsplash, accessory and even handle is made in
              stone: our patented anti-bacterial Silverstone™. No wood. No
              MDF. No formaldehyde. Just safe, hygienic, lifetime-luxury.
            </p>
          </div>
        </div>
      </section>

      {/* LAB-TESTED, LIFE-PROVEN */}
      <section className="bg-bone py-20 lg:py-32">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
          <div className="kicker text-smoke mb-6">Lab-tested, Life-proven</div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-ink max-w-4xl">
            Every claim,{' '}
            <span className="text-smoke">physically demonstrated.</span>
          </h2>
          <p className="mt-8 max-w-2xl text-ink/70 leading-relaxed">
            Scratch tests. Fire tests. 30-day water immersion. Load tests.
            Impact drops. Every promise Magppie makes is backed by evidence you
            can see and verify.
          </p>

          <div className="mt-12 lg:mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-px bg-ink/10">
            {[
              { n: '01', title: 'Stain safe', body: 'Coffee, haldi, oil - whatever you spill just wipes off. The stone doesn’t soak anything in, so nothing stays behind.' },
              { n: '02', title: 'Scratch safe', body: 'Chopping, cutting, dragging heavy pots - nothing leaves a mark. Your kitchen looks new for years.' },
              { n: '03', title: '80 kg load', body: 'Every drawer can carry 80 kg without bending or sagging. Safe for your heaviest vessels, groceries, and appliances.' },
              { n: '04', title: 'Fire safe', body: 'The stone doesn’t catch fire or spread flames. Safe for daily Indian open-flame cooking - tadka, roti, deep frying.' },
              { n: '05', title: 'Water safe', body: 'We kept it underwater for 30 days. Wood swelled and collapsed. The stone showed zero change.' },
              { n: '06', title: 'Impact safe', body: 'Drop a heavy ceramic jar on it - the stone stays intact. Built for the reality of a busy kitchen, not a showroom.' },
              { n: '07', title: 'Made for Indian vessels', body: 'We give 62% more space. Our cabinets are deeper and wider than standard ones, so large Indian plates, thalis, and vessels actually fit - something normal modular kitchens can’t handle.' },
            ].map((c) => (
              <div key={c.n} className="bg-bone p-6 lg:p-7 flex flex-col">
                <div className="font-display text-4xl text-ink/25 mb-4">
                  {c.n}
                </div>
                <h3 className="font-display text-xl text-ink leading-snug">
                  {c.title}
                </h3>
                <p className="mt-3 text-ink/70 leading-relaxed text-[0.82rem]">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE EVIDENCE - Wood vs Stone */}
      <section className="bg-sand py-20 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="kicker text-smoke mb-6">The Evidence</div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-ink max-w-4xl">
            Wood kitchen vs.{' '}
            <span className="text-smoke">Stone kitchen.</span>
          </h2>

          <div className="mt-12 lg:mt-16 border border-ink/10 overflow-hidden">
            {/* Header row - hidden on mobile, shown from lg */}
            <div className="hidden lg:grid grid-cols-3 text-[0.72rem] tracking-[0.22em] uppercase">
              <div className="bg-bone px-6 lg:px-8 py-5 text-ink/80 border-r border-ink/10">
                Feature
              </div>
              <div className="bg-bone px-6 lg:px-8 py-5 border-r border-ink/10">
                <span className="text-[#c2181f] font-semibold">Wood</span>
                <span className="text-ink/70"> Kitchens</span>
              </div>
              <div className="bg-ink px-6 lg:px-8 py-5 text-bone">
                Magppie Kitchens
              </div>
            </div>

            {[
              { feature: 'Formaldehyde emissions', wood: 'Released daily, WHO carcinogen', stone: 'Zero emissions. Pure air.' },
              { feature: 'Termite resistance', wood: 'Eaten silently from inside out', stone: 'Stone cannot be eaten. Ever.' },
              { feature: 'Mould & fungus', wood: 'Absorbs moisture, mould in 2–3 years', stone: 'Zero absorption. Zero mould.' },
              { feature: 'Antibacterial', wood: 'Bacteria thrives on porous wood', stone: 'Silver-nano kills bacteria permanently' },
              { feature: 'Fire safety', wood: 'Combustible, spreads flame', stone: 'Non-combustible. Fire-resistant.' },
              { feature: 'Longevity', wood: 'Degrades in 8 – 12 years', stone: '25-year unconditional guarantee' },
              { feature: 'Sustainability', wood: 'Tree felling + toxic laminates', stone: 'Zero trees. 100% eco.' },
            ].map((row) => (
              <div
                key={row.feature}
                className="block lg:grid lg:grid-cols-3 border-t border-ink/10 first:border-t-0 lg:first:border-t"
              >
                {/* Feature label */}
                <div className="bg-bone px-6 lg:px-8 py-4 lg:py-6 text-ink font-medium lg:border-r border-ink/10 text-sm lg:text-base border-b border-ink/10 lg:border-b-0">
                  {row.feature}
                </div>
                {/* Wood row */}
                <div className="bg-bone px-6 lg:px-8 py-5 lg:py-6 text-ink/55 lg:border-r border-ink/10 border-b border-ink/10 lg:border-b-0">
                  <span className="lg:hidden text-[0.78rem] text-[#c2181f] font-semibold block mb-2">
                    Wood Kitchen
                  </span>
                  {row.wood}
                </div>
                {/* Stone row */}
                <div className="bg-bone px-6 lg:px-8 py-5 lg:py-6 text-ink">
                  <span className="lg:hidden text-[0.78rem] text-ink font-semibold block mb-2">
                    Magppie Kitchen
                  </span>
                  {row.stone}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* A QUIET MOMENT - full-bleed banner */}
      <section className="relative w-full h-[48vh] min-h-[360px] max-h-[560px] overflow-hidden bg-ink">
        <Image
          src="/images/black-kitchen.webp"
          alt="Magppie kitchen in dark stone, a quiet moment"
          fill
          quality={95}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/25 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/60 pointer-events-none" />
        <div className="absolute bottom-10 lg:bottom-14 left-6 right-6 lg:right-auto lg:left-10 max-w-[720px]">
          <div className="label text-bone/90 mb-4 [text-shadow:0_1px_10px_rgba(0,0,0,0.7)]">
            A Quiet Moment
          </div>
          <h2 className="font-display text-bone text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05] [text-shadow:0_2px_18px_rgba(0,0,0,0.65)]">
            Built to outlast generations.
          </h2>
        </div>
      </section>

      {/* OUR PROMISE - 25 year guarantee */}
      <section className="relative bg-ink py-20 lg:py-32 overflow-hidden">
        {/* Giant 25 watermark */}
        <div
          aria-hidden
          className="pointer-events-none select-none absolute right-[-2vw] top-1/2 -translate-y-1/2 font-display text-bone/5 leading-none"
          style={{ fontSize: 'clamp(160px, 38vw, 560px)' }}
        >
          25
        </div>

        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid lg:grid-cols-2 gap-12 lg:gap-16 relative">
          <div>
            <div className="kicker text-bone/60 mb-6">Our Promise</div>
            <h2 className="font-display text-bone text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
              A 25-year{' '}
              <span className="text-bone/55">unconditional</span>{' '}
              guarantee.
            </h2>
            <p className="mt-6 lg:mt-8 max-w-xl text-bone/70 leading-relaxed">
              If anything ever happens to your Magppie kitchen, termites, water
              damage, discolouration, structural failure, it is entirely our
              responsibility. We make no excuses. We need no explanations from
              your side.
            </p>

            <ul className="mt-8 lg:mt-10 space-y-4 text-bone/85">
              {[
                '25-year unconditional stone guarantee, all damage covered',
                '25 complimentary annual home visits, deep clean & inspection',
                'The strongest commitment in the kitchen industry, globally',
              ].map((item) => (
                <li key={item} className="flex items-start gap-4">
                  <span className="mt-0.5 inline-flex w-5 h-5 shrink-0 items-center justify-center border border-bone/40 text-bone/80 text-[0.7rem]">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <div className="pb-6 lg:pb-8 border-b border-bone/15">
              <h3 className="font-display text-bone text-xl sm:text-2xl lg:text-3xl leading-snug">
                25 years, unconditional
              </h3>
              <p className="mt-3 lg:mt-4 text-bone/70 leading-relaxed max-w-xl">
                Termites, water damage, swelling, warping, colour change,
                everything covered. No exceptions. No exclusions. Our stone is
                our promise.
              </p>
            </div>
            <div>
              <h3 className="font-display text-bone text-xl sm:text-2xl lg:text-3xl leading-snug">
                Annual home visits, 25 years included
              </h3>
              <p className="mt-3 lg:mt-4 text-bone/70 leading-relaxed max-w-xl">
                Every year for 25 years, our team visits your home: they clean,
                they do alignment check, full inspection. Your kitchen always
                looks and feels brand new.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Concepts gallery - pulled straight from the catalog */}
      <section className="bg-bone pt-20 lg:pt-36 pb-24 lg:pb-32">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10 mb-10 lg:mb-12">
          <h2 className="font-display text-3xl md:text-4xl text-ink">
            Wellness Kitchen Concepts.
          </h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-2 px-2 lg:px-2">
          {CONCEPTS.map((c, i) => (
            <ConceptTile key={c.name} {...c} large={i === 0} />
          ))}
        </div>

        {/* Closing CTA, single Explore more link that opens the booking form */}
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10 mt-10 lg:mt-14">
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 font-display text-2xl sm:text-3xl text-ink group"
          >
            <span>Explore more</span>
            <span className="group-hover:translate-x-2 transition-transform inline-block">→</span>
          </Link>
        </div>
      </section>

      {/* Strong as rock */}
      <section className="bg-sand py-20 lg:py-40">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src="/images/kitchen-strong-as-rock.webp"
                alt="Magppie Wellness Kitchen, strong as rock"
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="kicker text-smoke mb-6">Strong as Rock</div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink leading-tight">
              A worry-free culinary experience for your family.
            </h2>
            <p className="mt-6 lg:mt-8 text-ink/70 leading-relaxed">
              Silverstone™ stands resilient against fire, water, heat,
              scratches and absorption. Even if a heavy pot or lid falls,
              the base stays strong. Built to last decades, not years.
            </p>
          </div>
        </div>
      </section>

      {/* Patented Lighting */}
      <section id="lighting" className="bg-ink text-bone py-20 lg:py-32 scroll-mt-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="kicker text-bone/50 mb-4">Patented Lighting</div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl leading-tight max-w-3xl">
            Five thoughtful layers of light. Patented by Magppie.
          </h2>
          <p className="mt-6 lg:mt-8 text-bone/60 max-w-2xl">
            Lighting can completely change the way a kitchen feels. We added
            not one, but five, layers, each engineered for a specific moment
            of the day.
          </p>

          <div className="mt-12 lg:mt-16 grid md:grid-cols-2 lg:grid-cols-5 gap-px bg-bone/10">
            {LIGHTING.map((l, idx) => (
              <div key={l.title} className="bg-ink p-6 sm:p-8">
                <div className="font-display text-2xl text-bone/30 mb-4">0{idx + 1}</div>
                <h3 className="font-display text-xl sm:text-2xl text-bone mb-3">{l.title}</h3>
                <p className="text-sm text-bone/60 leading-relaxed">{l.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Poolside Kitchen */}
      <section id="poolside" className="relative h-[70vh] min-h-[440px] lg:h-[85vh] overflow-hidden scroll-mt-20">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/images/02.webp"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/pool-area-1.webm" type="video/webm" />
          <source src="/videos/pool-area-1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 pb-16 lg:pb-24 w-full">
            <div className="label text-bone/80 mb-4 lg:mb-6">Concept</div>
            <h2 className="font-display md:whitespace-nowrap text-bone text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.02] lg:leading-none">
              The Poolside Kitchen.
            </h2>
            <p className="mt-5 lg:mt-6 text-bone/80 max-w-md">
              Engineered to live outside. Magppie Santorini, Persian
              Travertine and Sahara finishes resist sun, rain and time.
            </p>
          </div>
        </div>
      </section>

      {/* 23 Accessories */}
      <section id="accessories" className="bg-bone py-20 lg:py-32 scroll-mt-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="kicker text-smoke mb-4">23 Accessories</div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink leading-tight max-w-3xl">
            Designed to solve a real need. Made to make daily tasks easier.
          </h2>

          <div className="mt-12 lg:mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 lg:gap-x-10 gap-y-10 lg:gap-y-12">
            {ACCESSORIES.map((a, i) => (
              <div key={a.name}>
                <div className="font-display text-2xl text-smoke/40 mb-3">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="font-display text-xl text-ink mb-2">{a.name}</h3>
                <p className="text-sm text-ink/60 leading-relaxed">{a.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-sandlight py-20 lg:py-28">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 text-center">
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl text-ink leading-tight">
            Begin your Wellness Kitchen journey.
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

function ConceptTile({
  name,
  finish,
  image,
  large
}: {
  name: string;
  finish: string;
  image: string;
  large?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden ${large ? 'lg:col-span-2' : ''}`}>
      <div className={`relative ${large ? 'aspect-[21/9]' : 'aspect-[4/3]'}`}>
        <Image
          src={image}
          alt={`${name}, ${finish}`}
          fill
          sizes={large ? '100vw' : '(min-width: 1024px) 50vw, 100vw'}
          className="object-cover tile-img"
        />
      </div>
      <div className="absolute bottom-0 left-0 p-5 sm:p-6 lg:p-8 text-bone bg-gradient-to-t from-ink/70 to-transparent w-full">
        <div className="font-display text-xl sm:text-2xl lg:text-3xl">{finish}</div>
      </div>
    </div>
  );
}

const CONCEPTS = [
  { name: 'Magppie Santorini',   finish: 'Magppie Santorini',   image: '/images/hero.webp' },
  { name: 'Magppie Onyx Mystic', finish: 'Magppie Onyx Mystic', image: '/images/01-copy.webp' },
  { name: 'Magppie Onyx Black',  finish: 'Magppie Onyx Black',  image: '/images/black-kitchen.webp' }
];

const LIGHTING = [
  { title: 'Skirting Glow',     copy: 'Soft ambient warmth right near the floor, so the kitchen feels calm and welcoming.' },
  { title: 'Under-Countertop',  copy: 'Light spills under the countertop so everything inside the drawers is clearly visible.' },
  { title: 'Double-Effect',     copy: 'Patented bidirectional lights under wall cabinets, to backsplash and countertop at once.' },
  { title: 'Wall Cabinet Vertical', copy: 'Vertical strips inside wall cabinets so you can find what you need without searching.' },
  { title: 'Tall Cabinet Profile',  copy: 'Profile lights inside tall cabinets, so even items at the back are easy to find.' }
];

const ACCESSORIES = [
  { name: 'Detergent Pull-Out', copy: 'Heavy-duty pull-out for housekeeping items, kept exactly where they’re needed.' },
  { name: 'Cutlery Tray',       copy: 'Patented Magppie cutlery system: silent close, perfect division.' },
  { name: 'Chakla Belan Tray',  copy: 'Designed for Indian kitchens: rolling pin, board, tongs and 10 spice canisters in one.' },
  { name: 'Drawer Lid Divider', copy: 'Separates heavy pots and lids inside a drawer, with an impact-resistant Silverstone base.' },
  { name: 'Pulse Tray',         copy: 'Patented Silverstone tray with 24 canisters: daily pulses and snacks, perfectly arranged.' },
  { name: '28L / 60L Waste Bin',copy: 'Dual-bin under-counter waste systems engineered for Indian kitchen volumes.' },
  { name: 'Spice Canister',     copy: 'Silverstone tray with 25 canisters, for turmeric, cumin, cloves and more.' },
  { name: 'Onion-Potato Basket',copy: 'Stone base with ventilation grill: keeps vegetables fresh, prevents spoilage.' },
  { name: 'Le Mans Corner',     copy: 'A dignified solution for corner spaces: pulls out smoothly, reaches everything inside.' },
  { name: 'Tandem Pantry',      copy: 'Vertical pantry for cookies, dates, cereals and namkeens, plus side bottles.' },
  { name: 'SilverStone Floating Shelf', copy: 'Patented Silverstone shelves in 600/900/1200mm, always within reach.' },
  { name: 'Magic Kubos',        copy: 'A sleek metal coordinator for those impossible corner spaces.' }
];
