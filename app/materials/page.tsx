import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import JsonLd from '@/components/JsonLd';
import {
  faqSchema,
  brandSchema,
  howToDesignWellnessKitchenSchema,
  breadcrumbSchema
} from '@/lib/seo';

export const metadata: Metadata = {
  title: {
    absolute:
      'Silverstone™ Sintered Stone Finishes | 41 Stones for Modular Kitchens | Magppie'
  },
  description:
    'Inside Silverstone™, the world\'s only patented antibacterial sintered stone built for kitchens, wardrobes and vanities. Silver-infused. Zero formaldehyde, fire-rated, food-safe, scratch-resistant. 41 finishes across four textures and three thicknesses, in two price groups.',
  keywords: [
    'Silverstone',
    'Silverstone material',
    'sintered stone India',
    'sintered stone kitchen India',
    'antibacterial sintered stone',
    'antibacterial kitchen surface',
    'antibacterial countertop India',
    'silver infused stone',
    'nanotechnology stone',
    'nano silver kitchen',
    'kitchen countertop material India',
    'best kitchen countertop India',
    'porcelain countertop India',
    'large format sintered stone',
    'food safe countertop',
    'fire rated kitchen surface',
    'zero formaldehyde countertop',
    'zero VOC kitchen surface',
    'stone kitchen finishes',
    'Onyx Gold finish',
    'Flurry Black finish',
    'Persian Travertine finish',
    'Magppie Santorini finish'
  ],
  alternates: {
    canonical: '/materials',
    languages: { 'en-IN': '/materials', 'x-default': '/materials' }
  },
  openGraph: {
    title: 'Silverstone™ Sintered Stone Finishes | Magppie',
    description:
      'Silver-infused sintered stone, 41 finishes. Antibacterial, fire-rated, zero formaldehyde.',
    url: '/materials',
    images: [
      {
        url: '/og/materials-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Silverstone™ sintered stone finishes by Magppie'
      }
    ]
  },
  twitter: {
    title: 'Silverstone™ Sintered Stone Finishes | Magppie',
    description: 'Silver-infused, antibacterial, 41 finishes.',
    images: ['/og/materials-og.jpg']
  }
};

export default function MaterialsPage() {
  return (
    <>
      <JsonLd
        data={[
          brandSchema,
          faqSchema,
          howToDesignWellnessKitchenSchema,
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Materials', path: '/materials' }
          ])
        ]}
      />
      <PageHero
        kicker="Silverstone™"
        title="Materials."
        image="/images/01-copy.webp"
        video="/videos/Sunrise.mp4"
        subtitle="Silver infused inside the stone, by nano-technology. 100% bacteria-safe. Zero formaldehyde. Patented worldwide."
      />

      {/* Story */}
      <section className="bg-bone py-20 lg:py-40">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid lg:grid-cols-12 gap-6 lg:gap-10">
          <div className="lg:col-span-4">
            <div className="kicker text-smoke">The Silverstone™ Revolution</div>
          </div>
          <div className="lg:col-span-8">
            <h2 className="font-display text-3xl sm:text-4xl md:text-6xl leading-[1.05] text-ink">
              A revolutionary technical stone, developed through cutting-edge
              <em className="not-italic text-smoke"> nanotechnology.</em>
            </h2>
            <p className="mt-8 lg:mt-10 text-base lg:text-lg text-ink/70 max-w-2xl leading-relaxed">
              By harnessing the natural antibacterial power of pure silver, we
              infused it directly into the structure of our stone. The result
              is a certified, 100% bacteria-safe material, used across every
              cabinet, fascia, accessory, countertop and backsplash.
            </p>
          </div>
        </div>
      </section>

      {/* Spec strip */}
      <section className="bg-sand py-16 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { n: '41', l: 'Finishes' },
            { n: '4',  l: 'Textures' },
            { n: '3',  l: 'Sizes' },
            { n: '3',  l: 'Thicknesses' }
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-8xl text-ink leading-none">
                {s.n}
              </div>
              <div className="label text-smoke mt-3">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Group 1 */}
      <FinishGroup
        kicker="Price Group 1"
        title="Signature Marbles & Onyx"
        subtitle="23 finishes · 4 textures · 1200 × 2800 mm · 6/9/12 mm thicknesses"
        finishes={GROUP1}
      />

      {/* Group 2 */}
      <FinishGroup
        kicker="Price Group 2"
        title="Earth, Stone & Concrete"
        subtitle="18 finishes · 3 textures · 1200 × 2800 mm & 600 × 1200 mm · 6/9 mm thicknesses"
        finishes={GROUP2}
      />

      {/* Note */}
      <section className="bg-ink text-bone py-20 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 text-center">
          <h2 className="font-display text-2xl sm:text-3xl md:text-5xl leading-tight">
            Silverstone™ is a Magppie invention.<br />
            Patented by Magppie Silverstone Pvt. Ltd., worldwide.
          </h2>
        </div>
      </section>
    </>
  );
}

type Finish = { name: string; texture: string; image: string };

function FinishGroup({
  kicker,
  title,
  subtitle,
  finishes
}: {
  kicker: string;
  title: string;
  subtitle: string;
  finishes: Finish[];
}) {
  return (
    <section className="bg-bone py-20 lg:py-28">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10 mb-10 lg:mb-12">
        <div className="kicker text-smoke mb-4">{kicker}</div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink">{title}</h2>
        <p className="mt-4 text-sm text-smoke max-w-2xl">{subtitle}</p>
      </div>
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {finishes.map((f) => (
          <FinishTile key={f.image} finish={f} />
        ))}
        <ExploreMoreTile />
      </div>
    </section>
  );
}

function FinishTile({ finish }: { finish: Finish }) {
  return (
    <div className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-sandlight">
        <Image
          src={finish.image}
          alt={finish.name}
          fill
          quality={90}
          sizes="(min-width: 1024px) 16vw, (min-width: 768px) 25vw, 50vw"
          className="object-cover tile-img"
        />
      </div>
      <div className="mt-3">
        <div className="font-display text-base text-ink">{finish.name}</div>
      </div>
    </div>
  );
}

// Closing tile that signals "more finishes exist than what's displayed".
// Links to /contact so a visitor can request the rest by appointment.
function ExploreMoreTile() {
  return (
    <Link href="/contact" className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-ink flex items-center justify-center">
        <div className="text-center px-4">
          <div className="font-display text-2xl lg:text-3xl text-bone leading-tight">
            Explore<br />more
          </div>
          <div className="mt-4 text-[0.78rem] text-bone/55 group-hover:text-bone group-hover:translate-x-1 transition-all inline-block">
            Book a consultation →
          </div>
        </div>
      </div>
      <div className="mt-3">
        <div className="font-display text-base text-ink">More finishes</div>
        <div className="text-[0.78rem] text-smoke mt-1">By appointment</div>
      </div>
    </Link>
  );
}

// ─── Real Silverstone™ finishes, images supplied by the brand. ───────────
// Order preserved from the original brand catalogue (with duplicates and
// not-yet-photographed entries dropped). Missing finishes are signalled by
// the "Explore more" tile rendered at the end of each group.

const GROUP1: Finish[] = [
  { name: 'Magppie Art',                texture: 'Matt Texture',            image: '/images/finishes/group-1/magppie-art.webp' },
  { name: 'Magppie Palace',             texture: 'Sparkle High Gloss',      image: '/images/finishes/group-1/magppie-palace.webp' },
  { name: 'Magppie King',               texture: 'Sparkle High Gloss',      image: '/images/finishes/group-1/magppie-king.webp' },
  { name: 'Magppie Jewel',              texture: 'Sparkle High Gloss',      image: '/images/finishes/group-1/magppie-jewel.webp' },
  { name: 'Magppie Elegance',           texture: 'Super Matt / High Gloss', image: '/images/finishes/group-1/magppie-elegance.webp' },
  { name: 'Magppie Calm',               texture: 'Super Matt / High Gloss', image: '/images/finishes/group-1/magppie-calm.webp' },
  { name: 'Magppie D’este',             texture: 'High Gloss',              image: '/images/finishes/group-1/magppie-deste.webp' },
  { name: 'Magppie Romano',             texture: 'High Gloss',              image: '/images/finishes/group-1/magppie-romano.webp' },
  { name: 'Magppie Earth',              texture: 'High Gloss',              image: '/images/finishes/group-1/magppie-earth.webp' },
  { name: 'Magppie Onyx Gold',          texture: 'High Gloss',              image: '/images/finishes/group-1/magppie-onyx-gold.webp' },
  { name: 'Magppie Onyx Mystic',        texture: 'High Gloss',              image: '/images/finishes/group-1/magppie-onyx-mystic.webp' },
  { name: 'Magppie Onyx Black',         texture: 'High Gloss',              image: '/images/finishes/group-1/magppie-onyx-black.webp' },
  { name: 'Magppie Flurry',             texture: 'Super Matt / Matt',       image: '/images/finishes/group-1/magppie-flurry.webp' },
  { name: 'Magppie Santorini',          texture: 'Matt Texture',            image: '/images/finishes/group-1/magppie-santorini.webp' },
  { name: 'Magppie Persian Travertine', texture: 'Matt Texture',            image: '/images/finishes/group-1/magppie-persian-travertine.webp' },
  { name: 'Magppie Veilstone',          texture: 'High Gloss',              image: '/images/finishes/group-1/magppie-veilstone.webp' }
];

const GROUP2: Finish[] = [
  { name: 'Magppie Cosmic',      texture: 'Matt Texture', image: '/images/finishes/group-2/magppie-cosmic.webp' },
  { name: 'Magppie Earth Taupe', texture: 'Matt',         image: '/images/finishes/group-2/magppie-earth-taupe.webp' },
  { name: 'Magppie Earth Grey',  texture: 'Matt',         image: '/images/finishes/group-2/magppie-earth-grey.webp' },
  { name: 'Magppie Sahara',      texture: 'Matt',         image: '/images/finishes/group-2/magppie-sahara.webp' },
  { name: 'Magppie White Muse',  texture: 'Matt Texture', image: '/images/finishes/group-2/magppie-white-muse.webp' },
  { name: 'Magppie Beige Muse',  texture: 'Matt Texture', image: '/images/finishes/group-2/magppie-beige-muse.webp' },
  { name: 'Magppie Myra Sand',   texture: 'Matt',         image: '/images/finishes/group-2/magppie-myra-sand.webp' },
  { name: 'Magppie Neo Brown',   texture: 'Matt',         image: '/images/finishes/group-2/magppie-neo-brown.webp' },
  { name: 'Magppie Cream Stone', texture: 'Matt',         image: '/images/finishes/group-2/magppie-cream-stone.webp' },
  { name: 'Magppie Graphite',    texture: 'Matt',         image: '/images/finishes/group-2/magppie-graphite.webp' },
  { name: 'Magppie Dusk',        texture: 'Matt',         image: '/images/finishes/group-2/magppie-dusk.webp' },
  { name: 'Magppie Sage',        texture: 'Super Matt',   image: '/images/finishes/group-2/magppie-sage.webp' },
  { name: 'Magppie Amber',       texture: 'Super Matt',   image: '/images/finishes/group-2/magppie-amber.webp' },
  { name: 'Magppie Cloud Stone', texture: 'Super Matt',   image: '/images/finishes/group-2/magppie-cloud-stone.webp' }
];
