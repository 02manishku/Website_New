import Image from 'next/image';
import PageHero from '@/components/PageHero';

export const metadata = {
  title: 'Silverstone™ Materials — Magppie',
  description:
    '41 stone finishes across 4 textures and 3 thicknesses. The patented anti-bacterial Silverstone™ — silver infused inside the stone by nano-technology.'
};

export default function MaterialsPage() {
  return (
    <>
      <PageHero
        kicker="Silverstone™"
        title="Materials."
        image="/images/01-copy.jpg"
        video="/videos/Sunrise.mp4"
        subtitle="Silver infused inside the stone, by nano-technology. 100% bacteria-safe. Zero formaldehyde. Patented worldwide."
      />

      {/* Story */}
      <section className="bg-bone py-28 lg:py-40">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <div className="kicker text-smoke">The Silverstone™ Revolution</div>
          </div>
          <div className="lg:col-span-8">
            <h2 className="font-display text-4xl md:text-6xl leading-[1.05] text-ink">
              A revolutionary technical stone — developed through cutting-edge
              <em className="not-italic text-smoke"> nanotechnology.</em>
            </h2>
            <p className="mt-10 text-lg text-ink/70 max-w-2xl leading-relaxed">
              By harnessing the natural antibacterial power of pure silver, we
              infused it directly into the structure of our stone. The result
              is a certified, 100% bacteria-safe material — used across every
              cabinet, fascia, accessory, countertop and backsplash.
            </p>
          </div>
        </div>
      </section>

      {/* Spec strip */}
      <section className="bg-sand py-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { n: '41', l: 'Finishes' },
            { n: '4',  l: 'Textures' },
            { n: '3',  l: 'Sizes' },
            { n: '3',  l: 'Thicknesses' }
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-6xl lg:text-8xl text-ink leading-none">
                {s.n}
              </div>
              <div className="kicker text-smoke mt-3">{s.l}</div>
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
      <section className="bg-ink text-bone py-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 text-center">
          <h2 className="font-display text-3xl md:text-5xl leading-tight">
            Silverstone™ is a Magppie invention.<br />
            Patented by Magppie Silverstone Pvt. Ltd. — worldwide.
          </h2>
        </div>
      </section>
    </>
  );
}

function FinishGroup({
  kicker,
  title,
  subtitle,
  finishes
}: {
  kicker: string;
  title: string;
  subtitle: string;
  finishes: { code: string; name: string; texture: string; tone: string }[];
}) {
  return (
    <section className="bg-bone py-28">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10 mb-12">
        <div className="kicker text-smoke mb-4">{kicker}</div>
        <h2 className="font-display text-4xl md:text-5xl text-ink">{title}</h2>
        <p className="mt-4 text-sm text-smoke max-w-2xl">{subtitle}</p>
      </div>
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {finishes.map((f) => (
          <div key={f.code} className="group cursor-pointer">
            <div
              className="relative aspect-[3/4] overflow-hidden"
              style={{ background: f.tone }}
            >
              {/* Stylized swatch — replaceable with real PNG when available */}
              <div className="absolute inset-0 mix-blend-overlay opacity-60"
                   style={{
                     backgroundImage:
                       'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.6), transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(0,0,0,0.25), transparent 60%)'
                   }}
              />
              <div className="absolute inset-0 opacity-30"
                   style={{
                     backgroundImage:
                       'repeating-linear-gradient(115deg, rgba(0,0,0,0.06) 0 2px, transparent 2px 14px)'
                   }}
              />
              <div className="absolute top-3 left-3 kicker text-ink/80 bg-bone/80 px-2 py-1">
                {f.code}
              </div>
            </div>
            <div className="mt-3">
              <div className="font-display text-base text-ink">{f.name}</div>
              <div className="kicker text-smoke text-[10px] mt-1">{f.texture}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const GROUP1 = [
  { code: 'F01', name: 'Magppie Art',                texture: 'Matt Texture',           tone: '#C7B79A' },
  { code: 'F02', name: 'Magppie Palace',             texture: 'Sparkle High Gloss',     tone: '#E5DFD2' },
  { code: 'F03', name: 'Magppie KING',               texture: 'Sparkle High Gloss',     tone: '#D9D2C2' },
  { code: 'F04', name: 'Magppie Jewel',              texture: 'Sparkle High Gloss',     tone: '#D8D6CF' },
  { code: 'F05', name: 'Magppie Elegance',           texture: 'Super Matt / High Gloss',tone: '#C9C8C2' },
  { code: 'F06', name: 'Magppie Calm',               texture: 'Super Matt / High Gloss',tone: '#E2E5E2' },
  { code: 'F07', name: 'Magppie D’este',             texture: 'High Gloss',             tone: '#C9C0AF' },
  { code: 'F08', name: 'Magppie Romano',             texture: 'High Gloss',             tone: '#D8C9AC' },
  { code: 'F09', name: 'Magppie Earth',              texture: 'High Gloss',             tone: '#B6A48E' },
  { code: 'F10', name: 'Magppie Onyx Gold',          texture: 'High Gloss',             tone: '#D8C29A' },
  { code: 'F11', name: 'Magppie Onyx Mystic',        texture: 'High Gloss',             tone: '#E2D8C8' },
  { code: 'F12', name: 'Magppie Taj',                texture: 'High Gloss',             tone: '#B89B7A' },
  { code: 'F13', name: 'Magppie Forest',             texture: 'Super Matt / High Gloss',tone: '#3F4A38' },
  { code: 'F14', name: 'Magppie Onyx Gold',          texture: 'High Gloss',             tone: '#D6BC85' },
  { code: 'F15', name: 'Magppie Onyx Mystic',        texture: 'High Gloss',             tone: '#EFE6D8' },
  { code: 'F16', name: 'Magppie Taj',                texture: 'High Gloss',             tone: '#C8A87C' },
  { code: 'F17', name: 'Magppie Forest',             texture: 'Super Matt / High Gloss',tone: '#2E3F2E' },
  { code: 'F18', name: 'Magppie Onyx Black',         texture: 'High Gloss',             tone: '#2A2520' },
  { code: 'F19', name: 'Magppie Flurry',             texture: 'Super Matt / Matt',      tone: '#3B3530' },
  { code: 'F20', name: 'Magppie Santorini',          texture: 'Matt Texture',           tone: '#D9C9A8' },
  { code: 'F21', name: 'Magppie Gulnaar',            texture: 'Matt Texture',           tone: '#BFA088' },
  { code: 'F22', name: 'Magppie Persian Travertine', texture: 'Matt Texture',           tone: '#D6C5A6' },
  { code: 'F23', name: 'Magppie Veilstone',          texture: 'High Gloss',             tone: '#E5E0D6' }
];

const GROUP2 = [
  { code: 'F01', name: 'Magppie Cosmic',     texture: 'Matt Texture', tone: '#D8CDB6' },
  { code: 'F02', name: 'Magppie Earth Taupe',texture: 'Matt',         tone: '#B59C7E' },
  { code: 'F03', name: 'Magppie Earth Grey', texture: 'Matt',         tone: '#A09C92' },
  { code: 'F04', name: 'Magppie Sahara',     texture: 'Matt',         tone: '#C8AC92' },
  { code: 'F05', name: 'Magppie White Muse', texture: 'Matt Texture', tone: '#CDC8BB' },
  { code: 'F06', name: 'Magppie Beige Muse', texture: 'Matt Texture', tone: '#E8DCC2' },
  { code: 'F07', name: 'Magppie Myra Sand',  texture: 'Matt',         tone: '#A28D75' },
  { code: 'F08', name: 'Magppie Neo Brown',  texture: 'Matt',         tone: '#9C7E66' },
  { code: 'F09', name: 'Magppie Cream Stone',texture: 'Matt',         tone: '#D8CFB6' },
  { code: 'F10', name: 'Magppie Graphite',   texture: 'Matt',         tone: '#7C7B78' },
  { code: 'F11', name: 'Magppie Dusk',       texture: 'Matt',         tone: '#3E3A36' },
  { code: 'F12', name: 'Magppie Sage',       texture: 'Super Matt',   tone: '#A39C8A' },
  { code: 'F13', name: 'Magppie Amber',      texture: 'Super Matt',   tone: '#D8C2A6' },
  { code: 'F14', name: 'Magppie Cloud Stone',texture: 'Super Matt',   tone: '#EAE5D6' },
  { code: 'F15', name: 'Magppie Breeze',     texture: 'Super Matt',   tone: '#D8CFB8' },
  { code: 'F16', name: 'Magppie Galaxy',     texture: 'Super Matt',   tone: '#C8AE82' },
  { code: 'F17', name: 'Magppie Vanilla',    texture: 'Super Matt',   tone: '#E8DEC8' },
  { code: 'F18', name: 'Magppie Terrazo Grey',texture: 'Matt',        tone: '#9C9282' }
];
