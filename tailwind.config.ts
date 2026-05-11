import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  // Gate Tailwind `hover:*` utilities behind `@media (hover: hover)`.
  // Without this, iOS Safari fires :hover on tap and the style sticks
  // until you tap elsewhere — looks like a bug ("why is this button
  // permanently in the hover state?"). With it on, hover styles only
  // apply on devices that actually have a hover pointer (mouse,
  // trackpad). Touch users get only :active / :focus feedback.
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      colors: {
        sand: '#D6CFBE',
        sandlight: '#E5DFD0',
        sanddark: '#B8B0A0',
        ink: '#1B1B1B',
        smoke: '#5C5A55',
        bone: '#F4F1EA'
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif']
      },
      letterSpacing: {
        widest2: '0.25em'
      }
    }
  },
  plugins: []
};
export default config;
