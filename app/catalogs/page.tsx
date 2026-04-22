import PageHero from '@/components/PageHero';

export const metadata = {
  title: 'Catalogs | Magppie',
  description: 'Download the Magppie Wellness Kitchen catalog, finishes brochure, and more.'
};

const CATALOGS = [
  { name: 'Wellness Kitchen: Master Catalog', size: '32 MB · PDF', cover: 'Magppie Taj' },
  { name: 'Wellness Wardrobe: Concepts',       size: '18 MB · PDF', cover: 'Magppie Onyx Gold' },
  { name: 'Silverstone™ Finishes Brochure',     size: '24 MB · PDF', cover: '41 finishes' },
  { name: 'Outdoor Kitchen Concepts',           size: '12 MB · PDF', cover: 'Magppie Earth' }
];

export default function CatalogsPage() {
  return (
    <>
      <PageHero
        kicker="Library"
        title="Catalogs."
        image="/images/00.webp"
        subtitle="Download the Magppie catalogs: for your home, for your studio, for your archive."
      />

      <section className="bg-bone py-20 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid md:grid-cols-2 gap-2">
          {CATALOGS.map((c) => (
            <a
              key={c.name}
              href="#"
              className="group flex items-center justify-between gap-4 sm:gap-8 p-6 sm:p-8 lg:p-10 bg-sandlight border hairline hover:bg-sand transition-colors"
            >
              <div>
                <div className="kicker text-smoke mb-2">{c.cover}</div>
                <h3 className="font-display text-2xl sm:text-3xl text-ink leading-tight">{c.name}</h3>
                <div className="kicker text-smoke mt-3">{c.size}</div>
              </div>
              <div className="kicker text-ink whitespace-nowrap group-hover:translate-x-2 transition-transform shrink-0">
                Download →
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
