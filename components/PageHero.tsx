import Image from 'next/image';

export default function PageHero({
  kicker,
  title,
  image,
  video,
  subtitle
}: {
  kicker: string;
  title: string;
  image: string;
  video?: string;
  subtitle?: string;
}) {
  return (
    <section className="relative h-[100dvh] min-h-[640px] w-full overflow-hidden bg-ink">
      <div className="absolute inset-0 overflow-hidden">
        {video ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={image}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              transform: 'scale(1.20) translate(4%, -5%)',
              transformOrigin: 'center center'
            }}
          >
            <source src={video.replace(/\.mp4$/, '.webm')} type="video/webm" />
            <source src={video} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={image}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{
              transform: 'scale(1.06)',
              transformOrigin: 'center center'
            }}
          />
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-ink/45 via-transparent to-ink/70 pointer-events-none" />

      {/* Bottom-left vignette to mask any brand watermark on source videos */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 320px 180px at 0% 100%, rgba(0,0,0,0.55), transparent 70%)'
        }}
      />

      <div className="absolute inset-0 flex items-end z-10">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10 pb-24 w-full">
          <div className="kicker text-bone/85 mb-6 fade-up">{kicker}</div>
          <h1 className="font-display text-bone text-6xl md:text-7xl lg:text-8xl leading-none fade-up drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 text-bone/85 max-w-xl text-lg fade-up delay-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
