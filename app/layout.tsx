import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsletterTeaser from '@/components/NewsletterTeaser';
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
    default: 'Luxury Modular Kitchens in India | Magppie Wellness Kitchen',
    // Per-route titles get appended through this template, keeping brand
    // name reinforced in every SERP listing.
    template: '%s | Magppie'
  },
  description:
    "Magppie crafts the world's first Wellness Kitchen, fully built in patented Silverstone™ antibacterial sintered stone. Luxury modular kitchens, wardrobes and vanities for India. 25-year guarantee.",
  applicationName: 'Magppie',
  keywords: [
    'luxury modular kitchen India',
    'modular kitchen Delhi',
    'premium kitchen brand India',
    'Magppie Wellness Kitchen',
    'Silverstone kitchen',
    'antibacterial kitchen surface',
    'sintered stone kitchen',
    'luxury wardrobe India',
    'walk-in closet India',
    'stone bathroom vanity India',
    'KBIS 2026 winner'
  ],
  authors: [{ name: 'Magppie' }],
  creator: 'Magppie',
  publisher: 'Magppie Silverstone Pvt. Ltd.',
  // Phone numbers, addresses and emails appear in body copy on /contact;
  // we keep their semantic meaning explicit instead of letting iOS Safari
  // auto-link them in unexpected ways.
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: '/' },
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
  // TODO: paste real tokens once Search Console / Bing Webmaster
  // properties are verified for magppie.com.
  verification: {
    google: 'GOOGLE_SEARCH_CONSOLE_VERIFICATION_TOKEN',
    other: { 'msvalidate.01': 'BING_WEBMASTER_VERIFICATION_TOKEN' }
  },
  category: 'Home and Garden',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'Magppie',
    title: 'Luxury Modular Kitchens in India | Magppie Wellness Kitchen',
    description:
      "Magppie crafts the world's first Wellness Kitchen in patented Silverstone™. Luxury modular kitchens, wardrobes and vanities for India.",
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
    title: 'Luxury Modular Kitchens in India | Magppie Wellness Kitchen',
    description:
      "The world's first Wellness Kitchen, fully built in patented Silverstone™. KBIS 2026 winner.",
    images: ['/og/magppie-og-default.jpg']
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${display.variable}`}>
      <body>
        {/* Site-wide structured data. Organization + WebSite live on every
            page so search engines can resolve any URL on the site to the
            same brand entity (matched via @id). Per-page schemas
            (Product, FAQPage, BreadcrumbList, Article) live inside their
            individual page files. */}
        <JsonLd data={[organizationSchema, websiteSchema]} />
        <Header />
        <main>{children}</main>
        <Footer />
        <NewsletterTeaser />
      </body>
    </html>
  );
}
