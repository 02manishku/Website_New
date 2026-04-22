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
    <section className="relative h-[100dvh] min-h-[560px] lg:min-h-[640px] w-full overflow-hidden bg-ink">
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

      <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/30 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-transparent to-ink/70 pointer-events-none" />

      {/* Bottom-left vignette to mask any brand watermark on source videos */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 320px 180px at 0% 100%, rgba(0,0,0,0.55), transparent 70%)'
        }}
      />

      <div className="absolute inset-0 flex items-end z-10">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10 pb-8 lg:pb-12 w-full">
          <div className="max-w-[640px]">
            <div className="kicker text-bone/90 mb-4 fade-up">{kicker}</div>
            <h1 className="font-display text-bone leading-[1.05] text-[2.25rem] sm:text-[2.75rem] md:text-[4.2vw] lg:text-[3.1vw] fade-up [text-shadow:0_2px_18px_rgba(0,0,0,0.55)]">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-4 lg:mt-6 max-w-[520px] text-bone/95 text-[0.88rem] sm:text-[0.95rem] lg:text-[0.92rem] leading-[1.55] lg:leading-[1.6] fade-up delay-1 [text-shadow:0_1px_10px_rgba(0,0,0,0.6)]">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
