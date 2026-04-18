import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/PageHero';

export const metadata = {
  title: 'The Wellness Movement — Magppie',
  description:
    'Magppie is not just a brand; it is a wellness movement. Bringing deep impact through deep tech innovations.'
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        kicker="The Company"
        title="A Wellness Movement."
        image="/images/02.jpg"
        video="/videos/classical-ceiling.mp4"
        subtitle="For people and planet — bringing deep impact through deep tech."
      />

      {/* Manifesto */}
      <section className="bg-bone py-28 lg:py-40">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <div className="kicker text-smoke mb-6">Manifesto</div>
          <p className="font-display text-3xl md:text-5xl leading-tight text-ink">
            Every day, our planet becomes more toxic. Our food, water, air and
            our homes are filled with unseen threats. The spaces that should
            nurture us are working against us. Magppie is the answer — built
            to bring authentic, health-conscious solutions into every aspect
            of your home and daily life, helping you live longer and healthier.
          </p>
        </div>
      </section>

      {/* Promise pillars */}
      <section className="bg-sand py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="kicker text-smoke mb-4">The Magppie Promise</div>
          <h2 className="font-display text-4xl md:text-5xl text-ink">
            Three commitments. One movement.
          </h2>
          <div className="mt-16 grid md:grid-cols-3 gap-px bg-ink/10">
            {[
              { t: 'Wellness Built in Stone', c: 'World’s first kitchens and wardrobes fully built in our patented anti-bacterial stone — Silverstone™.' },
              { t: '25-Year Guarantee', c: 'A robust 25-year guarantee, a reflection of our commitment to your long-term satisfaction.' },
              { t: '25 Complimentary Services', c: 'One complimentary service every year for 25 years — to maintain the longevity of your investment.' }
            ].map((b) => (
              <div key={b.t} className="bg-bone p-10">
                <h3 className="font-display text-2xl text-ink mb-4">{b.t}</h3>
                <p className="text-sm text-ink/70 leading-relaxed">{b.c}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Save the planet */}
      <section className="bg-bone py-28 lg:py-40">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/Hailuo_Image_upscale-it-8k-quality-render-u_489889040277979143.jpg"
                alt="Save the planet"
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="kicker text-smoke mb-6">For the Planet</div>
            <h2 className="font-display text-4xl md:text-5xl text-ink leading-tight">
              No deforestation. No mining. No compromise.
            </h2>
            <p className="mt-6 text-ink/70 leading-relaxed">
              Compressed wood — MDF, particle board, plyboard — leads to
              deforestation. Natural granite and marble come from mining.
              Magppie Silverstone™ needs neither. By saying &lsquo;no&rsquo;
              to compressed wood and natural stones, we protect our planet
              from both wounds.
            </p>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="bg-sand py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="kicker text-smoke mb-4">Certifications</div>
          <h2 className="font-display text-4xl md:text-5xl text-ink leading-tight max-w-3xl">
            Independently certified by Shree Ram Testing Laboratories
            (ISO 14001:2015 & ISO 9001:2015).
          </h2>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-ink/10">
            {[
              { t: 'Anti-Bacterial', c: 'Tested per ASTM E-2180 — confirmed 100% bacteria-safe.' },
              { t: 'Water & Weather Proofing', c: 'Tested per BS EN 12390 — zero permeability under pressure.' },
              { t: 'Scratch / Stain / Heat / Impact', c: 'Class 1 across all resistance tests. Zero formaldehyde. Anti-termite.' },
              { t: 'Fire Rating', c: 'Class A flame spread index per ASTM E-84.' }
            ].map((b) => (
              <div key={b.t} className="bg-bone p-8">
                <div className="kicker text-smoke mb-3">Test Report</div>
                <h3 className="font-display text-2xl text-ink mb-3">{b.t}</h3>
                <p className="text-sm text-ink/60 leading-relaxed">{b.c}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Design Partners */}
      <section className="bg-ink text-bone py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="kicker text-bone/50 mb-4">Global Design Partners</div>
          <h2 className="font-display text-4xl md:text-6xl leading-tight max-w-4xl">
            We collaborate with the world&rsquo;s most quietly influential designers.
          </h2>
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { n: 'Karim Rashid',     l: 'USA' },
              { n: 'Stefan Diez',      l: 'Germany' },
              { n: 'Cory Grosser',     l: 'USA' },
              { n: 'Rémi Bouhaniche',  l: 'France' }
            ].map((p) => (
              <div key={p.n} className="border-t border-bone/20 pt-6">
                <div className="kicker text-bone/50 mb-2">{p.l}</div>
                <div className="font-display text-3xl text-bone">{p.n}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-sandlight py-28 text-center">
        <div className="mx-auto max-w-[1000px] px-6 lg:px-10">
          <h2 className="font-display text-4xl md:text-6xl text-ink leading-tight">
            Be a part of the Wellness Movement.
          </h2>
          <Link
            href="/contact"
            className="inline-block mt-10 px-10 py-4 border border-ink text-ink kicker hover:bg-ink hover:text-bone transition-colors"
          >
            Talk to Magppie
          </Link>
        </div>
      </section>
    </>
  );
}
