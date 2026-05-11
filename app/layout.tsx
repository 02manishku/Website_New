import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsletterTeaser from '@/components/NewsletterTeaser';
import SmoothScroll from '@/components/SmoothScroll';
import ScrollTriggerRefresh from '@/components/ScrollTriggerRefresh';
import Preloader from '@/components/Preloader';
import PageTransition from '@/components/PageTransition';
import SafeBoundary from '@/components/SafeBoundary';
import JsonLd from '@/components/JsonLd';
import { organizationSchema, websiteSchema, SITE_URL } from '@/lib/seo';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

// The Seasons, display face for every headline, hero, manifesto block and
// editorial moment on the site. Three weights licensed: Light (300) for the
// biggest hero moments, Regular (400) as the default for headings and the
// long Manifesto block, Bold (700) reserved for emphasis. Body text + the
// header navigation continue to ride on Inter.
const display = localFont({
  src: [
    { path: './fonts/the-seasons/the-seasons-light.ttf',   weight: '300', style: 'normal' },
    { path: './fonts/the-seasons/the-seasons-regular.ttf', weight: '400', style: 'normal' },
    { path: './fonts/the-seasons/the-seasons-bold.ttf',    weight: '700', style: 'normal' }
  ],
  variable: '--font-display',
  display: 'swap'
});

// Viewport config, viewportFit: 'cover' lets the page extend under the iOS
// home indicator and notch, paired with env(safe-area-inset-*) padding in
// globals.css so nothing important hides behind hardware. themeColor matches
// the bone background so the iOS status bar tints to the brand on first paint.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#F4F1EA'
};

// Single source of truth for the indexing posture. Production = open
// season, anything else (preview, branch, dev) = blanket noindex so
// throwaway *.vercel.app hashes never compete with magppie.com in SERPs.
const isProduction = process.env.VERCEL_ENV === 'production';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || SITE_URL),
  title: {
    default:
      'Luxury Modular Kitchen in India | Magppie Wellness Kitchen | KBIS 2026 Winner',
    // Per-route titles get appended through this template, keeping brand
    // name reinforced in every SERP listing.
    template: '%s | Magppie'
  },
  description:
    "Magppie is the world's first Wellness Kitchen brand, built fully in patented Silverstone™ antibacterial sintered stone. India's most awarded luxury modular kitchen, wardrobe and vanity, with showrooms in Delhi, Mumbai, Bengaluru, Hyderabad, Mohali, Surat and Coimbatore. KBIS 2026 winner. 25-year guarantee.",
  applicationName: 'Magppie',
  // Keyword density tuned for the queries we actually want to win:
  // 1. Branded ("Magppie", "Wellness Kitchen", "Silverstone")
  // 2. Niche ("antibacterial kitchen", "sintered stone kitchen")
  // 3. Local long-tail (each India showroom city)
  // 4. Category head terms (kept short — head-term ranking comes from
  //    backlinks + content depth, not keyword stuffing)
  keywords: [
    // Branded
    'Magppie',
    'Magppie kitchen',
    'Magppie Wellness Kitchen',
    'Magppie modular kitchen',
    'Magppie Silverstone',
    'Magppie India',
    // Category
    'luxury modular kitchen India',
    'best modular kitchen brand India',
    'premium modular kitchen India',
    'modular kitchen designs',
    'luxury kitchen design India',
    'high end modular kitchen',
    'Italian modular kitchen India',
    'German modular kitchen India',
    // Material / niche
    'Silverstone kitchen',
    'sintered stone modular kitchen',
    'antibacterial kitchen surface',
    'antibacterial sintered stone',
    'patented kitchen India',
    'wellness kitchen brand',
    'zero formaldehyde kitchen',
    'termite proof kitchen',
    'stone kitchen India',
    // 2026 trends
    'quiet luxury kitchen design',
    'biophilic kitchen design',
    'smart modular kitchen India',
    // Locality
    'modular kitchen Delhi',
    'modular kitchen Sultanpur Delhi',
    'modular kitchen Kirti Nagar Delhi',
    'modular kitchen Gurugram',
    'modular kitchen Noida',
    'modular kitchen Mumbai',
    'modular kitchen Lower Parel Mumbai',
    'modular kitchen Bengaluru',
    'modular kitchen Indiranagar Bengaluru',
    'modular kitchen Hyderabad',
    'modular kitchen Jubilee Hills Hyderabad',
    'modular kitchen Mohali',
    'modular kitchen Surat',
    'modular kitchen Coimbatore',
    // Adjacent collections
    'luxury wardrobe India',
    'walk-in closet India',
    'stone bathroom vanity India',
    'luxury bathroom vanity India',
    // Awards / trust
    'KBIS 2026 winner',
    'Red Dot kitchen award',
    'iF Design kitchen award',
    'EDIDA India Best Kitchen'
  ],
  authors: [{ name: 'Magppie' }],
  creator: 'Magppie',
  publisher: 'Magppie Silverstone Pvt. Ltd.',
  // Phone numbers, addresses and emails appear in body copy on /contact;
  // we keep their semantic meaning explicit instead of letting iOS Safari
  // auto-link them in unexpected ways.
  formatDetection: { email: false, address: false, telephone: false },
  alternates: {
    canonical: '/',
    // hreflang signals to Google that the canonical content is for the
    // India-English audience. `x-default` is the global fallback. Add
    // more entries here when localised variants ship (en-AE, hi-IN, etc.).
    languages: {
      'en-IN': '/',
      'x-default': '/'
    }
  },
  robots: {
    index: isProduction,
    follow: isProduction,
    googleBot: {
      index: isProduction,
      follow: isProduction,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  // `verification` block is intentionally omitted until Search Console and
  // Bing Webmaster issue real tokens for magppie.com. Re-add as:
  //   verification: { google: '...', other: { 'msvalidate.01': '...' } }
  category: 'Home and Garden',
  classification: 'Modular Kitchen, Luxury Furniture, Sintered Stone Surfaces',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    alternateLocale: ['en_US', 'en_GB'],
    url: SITE_URL,
    siteName: 'Magppie',
    title:
      'Luxury Modular Kitchen in India | Magppie Wellness Kitchen | KBIS 2026 Winner',
    description:
      "Magppie crafts the world's first Wellness Kitchen in patented Silverstone™. India's most awarded luxury modular kitchen, wardrobe and vanity. Showrooms across India.",
    images: [
      {
        url: '/og/magppie-og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Magppie Wellness Kitchen, built in Silverstone™ sintered stone',
        type: 'image/jpeg'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@magppie',
    creator: '@magppie',
    title:
      'Luxury Modular Kitchen in India | Magppie Wellness Kitchen | KBIS 2026 Winner',
    description:
      "The world's first Wellness Kitchen, fully built in patented Silverstone™. KBIS 2026 winner. India.",
    images: ['/og/magppie-og-default.jpg']
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png'
  },
  // Generic referrer policy declared at metadata level; the strict header
  // version in next.config.js overrides for non-cross-origin same-site nav.
  referrer: 'strict-origin-when-cross-origin'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${display.variable}`}>
      <head>
        {/* Resource hints. Browser-only, search engines ignore these but
            users feel the difference, which feeds Core Web Vitals which
            feeds Google's "page experience" signal. */}
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link
          rel="preconnect"
          href="https://cdn.sanity.io"
          crossOrigin="anonymous"
        />
        {/* Geo meta tags help maps / local search agents; not a strong
            signal on their own but cheap to ship. */}
        <meta name="geo.region" content="IN-DL" />
        <meta name="geo.placename" content="New Delhi" />
        <meta name="geo.position" content="28.4974;77.1610" />
        <meta name="ICBM" content="28.4974, 77.1610" />
      </head>
      <body>
        {/* Site-wide structured data. Organization + WebSite + Brand live
            on every page so search engines can resolve any URL on the
            site to the same brand entity (matched via @id). Per-page
            schemas (Product, FAQPage, LocalBusiness, BreadcrumbList,
            Article) live inside their individual page files. */}
        <JsonLd data={[organizationSchema, websiteSchema]} />
        {/* Every component below sits behind a SafeBoundary so a single
            crashing widget can't take down the whole page. The
            top-level app/error.tsx is the last line of defence if a
            failure escapes the per-component boundaries. */}
        <SafeBoundary>
          <Preloader />
        </SafeBoundary>
        <SafeBoundary>
          <SmoothScroll />
        </SafeBoundary>
        <SafeBoundary>
          <ScrollTriggerRefresh />
        </SafeBoundary>
        <Header />
        <main>
          <SafeBoundary>
            <PageTransition>{children}</PageTransition>
          </SafeBoundary>
        </main>
        <Footer />
        <SafeBoundary>
          <NewsletterTeaser />
        </SafeBoundary>
        {/* Vercel Analytics + Speed Insights. Both auto-activate on
            Vercel deploy without any keys; no-ops in local dev. The
            Speed Insights bundle reports the four Core Web Vitals
            (LCP, INP, CLS, TTFB) plus FCP and FID, satisfying audit
            finding N-03 without a separate web-vitals reporter. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
