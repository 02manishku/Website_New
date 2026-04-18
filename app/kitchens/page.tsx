import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/PageHero';

export const metadata = {
  title: 'Wellness Kitchen — Magppie',
  description:
    'Magppie Wellness Kitchens are fully built in patented anti-bacterial Silverstone™ — the world’s safest, strongest and most beautiful kitchens.'
};

export default function KitchensPage() {
  return (
    <>
      <PageHero
        kicker="01 — Wellness"
        title="Kitchens."
        video="/videos/TAJ.mp4"
        image="/images/hero.jpg"
        subtitle="Fully built in patented anti-bacterial Silverstone™. The world’s safest, strongest, and most beautiful kitchens."
      />

      {/* Intro statement */}
      <section id="wellness" className="bg-bone py-28 lg:py-40">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <div className="kicker text-smoke">A New Definition of Luxury</div>
          </div>
          <div className="lg:col-span-8">
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.05] text-ink">
              The most advanced kitchen in the world. Also the
              <em className="not-italic text-smoke"> most stunning </em>
              to look at.
            </h2>
            <p className="mt-10 text-lg text-ink/70 max-w-2xl leading-relaxed">
              For the first time ever, every internal cabinet, door fascia,
              countertop, backsplash, accessory and even handle is made in
              stone — our patented anti-bacterial Silverstone™. No wood. No
              MDF. No formaldehyde. Just safe, hygienic, lifetime-luxury.
            </p>
          </div>
        </div>
      </section>

      {/* Concepts gallery — pulled straight from the catalog */}
      <section className="bg-bone pb-32">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10 mb-12">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl md:text-4xl text-ink">
              Wellness Kitchen Concepts.
            </h2>
            <Link href="/materials" className="kicker hover-underline">
              All finishes →
            </Link>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-2 px-2 lg:px-2">
          {CONCEPTS.map((c, i) => (
            <ConceptTile key={c.name} {...c} large={i === 0} />
          ))}
        </div>
      </section>

      {/* Strong as rock */}
      <section className="bg-sand py-28 lg:py-40">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src="/images/Hailuo_Image_re-render-it-8k-quality-render_489929208284426245.jpg"
                alt="Magppie Wellness Kitchen — strong as rock"
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="kicker text-smoke mb-6">Strong as Rock</div>
            <h2 className="font-display text-4xl md:text-5xl text-ink leading-tight">
              A worry-free culinary experience for your family.
            </h2>
            <p className="mt-8 text-ink/70 leading-relaxed">
              Silverstone™ stands resilient against fire, water, heat,
              scratches and absorption. Even if a heavy pot or lid falls,
              the base stays strong. Built to last decades, not years.
            </p>
          </div>
        </div>
      </section>

      {/* Patented Lighting */}
      <section id="lighting" className="bg-ink text-bone py-28 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="kicker text-bone/50 mb-4">Patented Lighting</div>
          <h2 className="font-display text-4xl md:text-6xl leading-tight max-w-3xl">
            Five thoughtful layers of light. Patented by Magppie.
          </h2>
          <p className="mt-8 text-bone/60 max-w-2xl">
            Lighting can completely change the way a kitchen feels. We added
            not one — but five — layers, each engineered for a specific moment
            of the day.
          </p>

          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-5 gap-px bg-bone/10">
            {LIGHTING.map((l, idx) => (
              <div key={l.title} className="bg-ink p-8">
                <div className="kicker text-bone/40 mb-4">0{idx + 1}</div>
                <h3 className="font-display text-2xl text-bone mb-3">{l.title}</h3>
                <p className="text-sm text-bone/60 leading-relaxed">{l.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outdoor Kitchen */}
      <section id="outdoor" className="relative h-[85vh] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/images/02.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/pool-area-1.webm" type="video/webm" />
          <source src="/videos/pool-area-1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 pb-24 w-full">
            <div className="kicker text-bone/80 mb-6">Concept</div>
            <h2 className="font-display text-bone text-5xl md:text-7xl lg:text-8xl leading-none">
              The Outdoor Kitchen.
            </h2>
            <p className="mt-6 text-bone/80 max-w-md">
              Engineered to live outside. Magppie Earth, Earth Grey and
              Terrazzo Grey finishes resist sun, rain and time.
            </p>
          </div>
        </div>
      </section>

      {/* 23 Accessories */}
      <section id="accessories" className="bg-bone py-28 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="kicker text-smoke mb-4">23 Accessories</div>
          <h2 className="font-display text-4xl md:text-5xl text-ink leading-tight max-w-3xl">
            Designed to solve a real need. Made to make daily tasks easier.
          </h2>

          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
            {ACCESSORIES.map((a, i) => (
              <div key={a.name}>
                <div className="kicker text-smoke mb-3">
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
      <section className="bg-sandlight py-28">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 text-center">
          <h2 className="font-display text-4xl md:text-6xl text-ink leading-tight">
            Begin your Wellness Kitchen journey.
          </h2>
          <Link
            href="/contact"
            className="inline-block mt-10 px-10 py-4 border border-ink text-ink kicker hover:bg-ink hover:text-bone transition-colors"
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
          alt={`${name} — ${finish}`}
          fill
          sizes={large ? '100vw' : '(min-width: 1024px) 50vw, 100vw'}
          className="object-cover tile-img"
        />
      </div>
      <div className="absolute bottom-0 left-0 p-6 lg:p-8 text-bone bg-gradient-to-t from-ink/70 to-transparent w-full">
        <div className="kicker text-bone/80">Stone finish</div>
        <div className="font-display text-2xl lg:text-3xl mt-1">{finish}</div>
        <div className="kicker text-bone/60 mt-1">{name}</div>
      </div>
    </div>
  );
}

const CONCEPTS = [
  { name: 'The Magppie Taj — High-rise wellness',     finish: 'Magppie Taj',              image: '/images/hero.jpg' },
  { name: 'Persian Travertine — Calm minimalism',     finish: 'Magppie Persian Travertine', image: '/images/01-copy.jpg' },
  { name: 'Magppie Flurry — A kitchen of presence',   finish: 'Magppie Flurry',           image: '/images/black-kitchen.jpg' },
  { name: 'Magppie Timeless — Soft modern luxury',    finish: 'Magppie Timeless',         image: '/images/00.jpg' },
  { name: 'Magppie Onyx Gold — Botanical wellness',   finish: 'Magppie Onyx Gold',        image: '/images/Hailuo_Image_re-render-it-make-it-ultra-hi_488062043326640136-copy.jpg' },
  { name: 'Classical Moulding — Regal collection',    finish: 'Regal',                    image: '/images/Change_the_double_height_windows_to_a_differnt_des_delpmaspu.jpg' }
];

const LIGHTING = [
  { title: 'Skirting Glow',     copy: 'Soft ambient warmth right near the floor — the kitchen feels calm and welcoming.' },
  { title: 'Under-Countertop',  copy: 'Light spills under the countertop so everything inside the drawers is clearly visible.' },
  { title: 'Double-Effect',     copy: 'Patented bidirectional lights under wall cabinets — to backsplash and countertop at once.' },
  { title: 'Wall Cabinet Vertical', copy: 'Vertical strips inside wall cabinets so you can find what you need without searching.' },
  { title: 'Tall Cabinet Profile',  copy: 'Profile lights inside tall cabinets — even items at the back are easy to find.' }
];

const ACCESSORIES = [
  { name: 'Detergent Pull-Out', copy: 'Heavy-duty pull-out for housekeeping items, kept exactly where they’re needed.' },
  { name: 'Cutlery Tray',       copy: 'Patented Magppie cutlery system — silent close, perfect division.' },
  { name: 'Chakla Belan Tray',  copy: 'Designed for Indian kitchens — rolling pin, board, tongs and 10 spice canisters in one.' },
  { name: 'Drawer Lid Divider', copy: 'Separates heavy pots and lids inside a drawer — impact-resistant Silverstone base.' },
  { name: 'Pulse Tray',         copy: 'Patented Silverstone tray with 24 canisters — daily pulses and snacks, perfectly arranged.' },
  { name: '28L / 60L Waste Bin',copy: 'Dual-bin under-counter waste systems engineered for Indian kitchen volumes.' },
  { name: 'Spice Canister',     copy: 'Silverstone tray with 25 canisters — for turmeric, cumin, cloves and more.' },
  { name: 'Onion-Potato Basket',copy: 'Stone base with ventilation grill — keeps vegetables fresh, prevents spoilage.' },
  { name: 'Le Mans Corner',     copy: 'A dignified solution for corner spaces — pulls out smoothly, reaches everything inside.' },
  { name: 'Tandem Pantry',      copy: 'Vertical pantry for cookies, dates, cereals and namkeens — plus side bottles.' },
  { name: 'SilverStone Floating Shelf', copy: 'Patented Silverstone shelves in 600/900/1200mm — always within reach.' },
  { name: 'Magic Kubos',        copy: 'A sleek metal coordinator for those impossible corner spaces.' }
];
