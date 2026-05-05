import type { MetadataRoute } from 'next';

// Web App Manifest. Android Chrome reads this on "Add to Home Screen", so
// the brand colors + name + icons here drive what the install tile looks
// like. Theme + background match `globals.css` body so the splash screen
// blends seamlessly into first paint.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Magppie Wellness Kitchen',
    short_name: 'Magppie',
    description:
      "The world's first Wellness Kitchen brand. Luxury modular kitchens, wardrobes and vanities, fully built in patented Silverstone™.",
    start_url: '/',
    display: 'standalone',
    background_color: '#F4F1EA',
    theme_color: '#F4F1EA',
    icons: [
      // These three PNGs need to ship in /public/icons/. Until they exist
      // Android falls back to the favicon.ico. Replace with brand-mark
      // exports at the listed sizes.
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      {
        src: '/icons/icon-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ]
  };
}
