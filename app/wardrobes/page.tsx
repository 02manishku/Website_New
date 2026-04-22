import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/PageHero';

export const metadata = {
  title: 'Wellness Wardrobe | Magppie',
  description:
    'For the first time ever: wardrobes whose every internal cabinet, door fascia and even handle is made in patented anti-bacterial Silverstone™.'
};

export default function WardrobesPage() {
  return (
    <>
      <PageHero
        kicker="Introducing the World’s First Wellness Wardrobe"
        title="Wardrobes built in stone. For a lifetime of wellness."
        image="/images/wardrobes/08.webp"
        subtitle="The wardrobe sits beside your bed. You breathe its air for a third of your life. Conventional plywood wardrobes silently leak formaldehyde, swell with monsoon moisture, and invite silverfish and termites into your clothes and heirlooms. Magppie built the wardrobe in stone. Safer to sleep beside. Kinder to what you store. Guaranteed for 25 years."
      />

      {/* The hidden danger */}
      <section id="wellness" className="bg-bone py-20 lg:py-40 scroll-mt-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid lg:grid-cols-12 gap-6 lg:gap-10">
          <div className="lg:col-span-4">
            <div className="kicker text-smoke">Why Wellness Matters</div>
          </div>
          <div className="lg:col-span-8">
            <h2 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-[1.05] text-ink">
              Most wardrobes silently leak formaldehyde. Yours
              <em className="not-italic text-smoke"> shouldn’t.</em>
            </h2>
            <p className="mt-8 lg:mt-10 text-base lg:text-lg text-ink/70 max-w-2xl leading-relaxed">
              Our clothes sit inside our wardrobes for weeks, breathing in
              formaldehyde emissions from compressed wood. We then bring those
              same clothes next to our skin. Skin has millions of pores. We
              unknowingly feed them with toxic emissions, every single day.
            </p>
            <p className="mt-6 text-base lg:text-lg text-ink/70 max-w-2xl leading-relaxed">
              Magppie reimagined the wardrobe in stone: completely free from
              toxins, chemicals and VOC emissions. Naturally resistant to
              mold and fungi. Ideal for sensitive skin, children and allergy
              sufferers.
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
                src="/images/wardrobes/03.webp"
                alt="Magppie Wellness Wardrobe, built entirely in Silverstone™"
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
              Where wood-based wardrobes swell, warp and leak formaldehyde
              into your clothes, a Magppie wardrobe is inert stone from the
              inside out. Bacteria-safe, termite-proof, moisture-stable for
              decades. Your clothes breathe what the stone breathes: nothing.
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

      {/* Wardrobe concepts */}
      <section className="bg-bone pt-20 lg:pt-32 pb-20 lg:pb-32">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10 mb-10 lg:mb-12">
          <h2 className="font-display text-3xl md:text-4xl text-ink">
            Wellness Wardrobe Concepts.
          </h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-2 px-2">
          {WARDROBES.map((w) => (
            <div key={w.name} className="relative overflow-hidden">
              <div className="relative aspect-[4/3]">
                <Image
                  src={w.image}
                  alt={`${w.name}, ${w.finish}`}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover tile-img"
                />
              </div>
              <div className="absolute bottom-0 left-0 p-5 sm:p-6 lg:p-8 text-bone bg-gradient-to-t from-ink/70 to-transparent w-full">
                <div className="kicker text-bone/80">Stone finish</div>
                <div className="font-display text-xl sm:text-2xl lg:text-3xl mt-1">{w.finish}</div>
                <div className="kicker text-bone/60 mt-1">{w.name}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Choose family's health */}
      <section className="bg-sand py-20 lg:py-40">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="kicker text-smoke mb-6">Choose Wellness</div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-7xl text-ink leading-[1.05] max-w-4xl">
            Choose family safety. Choose lifelong durability. Choose
            <em className="not-italic text-smoke"> luxurious aesthetics.</em>
          </h2>
          <div className="mt-12 lg:mt-16 grid md:grid-cols-3 gap-px bg-ink/10">
            {[
              { t: 'Built in Stone', c: 'Where wood-based wardrobes are cancer-prone, Magppie offers wardrobes fully built in patented anti-bacterial stone.' },
              { t: '25-Year Guarantee', c: 'A robust 25-year guarantee, a reflection of our commitment to your long-term satisfaction.' },
              { t: '75 Complimentary Services', c: 'Three complimentary services every year for 25 years, so we maintain the excellence of your investment.' }
            ].map((b) => (
              <div key={b.t} className="bg-bone p-6 sm:p-8 lg:p-10">
                <h3 className="font-display text-xl sm:text-2xl text-ink mb-4">{b.t}</h3>
                <p className="text-sm text-ink/70 leading-relaxed">{b.c}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13 accessories */}
      <section id="accessories" className="bg-bone py-20 lg:py-32 scroll-mt-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="kicker text-smoke mb-4">13 Accessories</div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink leading-tight max-w-3xl">
            Designed to save your time, reduce effort and give peace of mind.
          </h2>

          <div className="mt-12 lg:mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 lg:gap-x-10 gap-y-10 lg:gap-y-12">
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
      <section className="bg-sandlight py-20 lg:py-28">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 text-center">
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl text-ink leading-tight">
            Choose your family&rsquo;s health.
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

const WARDROBES = [
  { name: 'Suite: Master bedroom',     finish: 'Magppie Travertino',       image: '/images/wardrobes/concept-1.webp' },
  { name: 'Heritage: Library wardrobe',finish: 'Magppie Timeless',         image: '/images/wardrobes/concept-1-2.webp' },
  { name: 'Mystic: Boudoir',           finish: 'Magppie Onyx Mystic',      image: '/images/wardrobes/concept-2.webp' },
  { name: 'Sky: Penthouse closet',     finish: 'Magppie Onyx Gold',        image: '/images/wardrobes/concept-3.webp' },
  { name: 'Gallery: Walk-in',          finish: 'Magppie Classico Bianco',  image: '/images/wardrobes/11.webp' },
  { name: 'Atelier: Dressing room',    finish: 'Magppie Flurry Black',     image: '/images/wardrobes/10.webp' },
  { name: 'Vestibule: Hallway robe',   finish: 'Magppie Calcatta Perlato', image: '/images/wardrobes/05.webp' },
  { name: 'Guest: Quiet wardrobe',     finish: 'Magppie Romano',           image: '/images/wardrobes/07.webp' }
];

const ACCESSORIES = [
  { name: 'Shoe Drawer',          copy: 'Pull-out drawer that brings the back row forward, so every pair is easy to reach.' },
  { name: 'Trouser Pull-Out Rack',copy: 'Slim rack that brings the bottom section up: denims, trousers, perfectly hung.' },
  { name: 'Low-Depth Drawer',     copy: 'Ideal for documents, folders, card holders or iPads: flat items, organised.' },
  { name: 'Deep Storage Basket',  copy: 'For daily clothes: tees, denims, folded shirts. Easy in, easy out.' },
  { name: 'Jewellery Tray',       copy: 'Personalised drawer for rings, watches, wallets, sunglasses and small accessories.' },
  { name: 'Watch Winder',         copy: 'Compact winder that keeps automatic watches running, and fits any shelf.' },
  { name: 'Card Lock',            copy: 'Tap-to-open mechanism on the wardrobe shutter. No keys.' },
  { name: 'Biometric Lock',       copy: 'Fingerprint security: stores up to 5 fingerprints for family access.' },
  { name: 'Built-In Safe Box',    copy: 'Digital lock drawer for jewellery, watches and important documents.' },
  { name: 'Built-In Mirror',      copy: 'A mirror that flips out from inside the shutter, for the quick glance.' },
  { name: 'Tie Pull-Out',         copy: 'A dedicated rack for ties: wrinkle-free, organised, easy to reach.' },
  { name: 'Pull-Out Ironing Board', copy: 'Fits inside the wardrobe: pull out, iron, slide back. Saves space and time.' },
  { name: 'Suede Internal Accessory', copy: 'Suede-lined drawer for delicate items: sunglasses, jewellery, premium feel.' }
];
