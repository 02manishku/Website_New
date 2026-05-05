/**
 * Shared schema.org structured-data builders for the Magppie site.
 *
 * Every block here is JSON-LD, designed to be passed into `<JsonLd />` in
 * the corresponding page's JSX. Keeping them in one place means:
 *  - the Organization @id is identical across every page (Google merges
 *    entities by @id, so collisions silently break knowledge-panel
 *    attribution),
 *  - any future address / phone / award update happens in exactly one
 *    place,
 *  - per-page schema files stay tiny and readable.
 *
 * Convention: anything that needs a real value before launch is marked
 * with `TODO:` so a project-wide grep surfaces them all.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://magppie.com';

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

// ── Organization ──────────────────────────────────────────────────────────
// Cited via @id from every Product, LocalBusiness, Article and Breadcrumb
// schema below, so Google understands they all belong to the same brand.
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'Magppie',
  legalName: 'Magppie Silverstone Pvt. Ltd.',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logos/magppie-black.png`,
    width: 1267,
    height: 655
  },
  foundingDate: '2018',
  // TODO: confirm founder name with the team and replace.
  founders: [{ '@type': 'Person', name: 'Magppie founding team' }],
  description:
    "Magppie is the world's first Wellness Kitchen brand, fully built in patented Silverstone™ antibacterial sintered stone.",
  slogan: 'For People and Planet',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '352, Sultanpur, MG Road',
    addressLocality: 'New Delhi',
    addressRegion: 'Delhi',
    postalCode: '110030',
    addressCountry: 'IN'
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+91-999-924-8801',
      email: 'info@mymagppie.com',
      contactType: 'sales',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi']
    }
  ],
  sameAs: [
    'https://www.instagram.com/magppieliving',
    'https://www.linkedin.com/company/magppie',
    'https://www.youtube.com/@magppie',
    'https://www.pinterest.com/magppie',
    'https://www.facebook.com/magppie'
  ],
  award: [
    'KBIS 2026 Most Unexpected Innovation, Orlando',
    'Red Dot Best of the Best 2010',
    'iF International Design Award 2010',
    'EDIDA India Best Kitchen 2013'
  ]
};

// ── WebSite + sitelinks search ────────────────────────────────────────────
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE_URL,
  name: 'Magppie',
  description:
    "The world's first Wellness Kitchen brand. Luxury modular kitchens, wardrobes and vanities, fully built in patented Silverstone™.",
  publisher: { '@id': ORG_ID },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/search?q={search_term_string}`
    },
    'query-input': 'required name=search_term_string'
  },
  inLanguage: 'en-IN'
};

// ── LocalBusiness (Delhi HQ + showroom) ──────────────────────────────────
// One block per physical showroom. The brief calls for Delhi, Mumbai,
// Bangalore, Hyderabad — only Delhi is filled in here because it's the HQ
// and we have hard data for it. Replicate the shape for additional cities
// once we have street + geo for each.
export const localBusinessDelhiSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'HomeGoodsStore', 'FurnitureStore'],
  '@id': `${SITE_URL}/#localbusiness-delhi`,
  name: 'Magppie Wellness Kitchen Showroom, Delhi',
  image: `${SITE_URL}/images/showroom-delhi.jpg`,
  url: SITE_URL,
  telephone: '+91-999-924-8801',
  email: 'info@mymagppie.com',
  priceRange: '₹₹₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '352, Sultanpur, MG Road',
    addressLocality: 'New Delhi',
    addressRegion: 'Delhi',
    postalCode: '110030',
    addressCountry: 'IN'
  },
  // TODO: replace with real lat / lng for the Sultanpur showroom.
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 28.4974,
    longitude: 77.1610
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ],
      opens: '10:00',
      closes: '19:00'
    }
  ],
  areaServed: [
    { '@type': 'City', name: 'New Delhi' },
    { '@type': 'City', name: 'Gurugram' },
    { '@type': 'City', name: 'Noida' },
    { '@type': 'City', name: 'Mumbai' },
    { '@type': 'City', name: 'Bangalore' },
    { '@type': 'City', name: 'Hyderabad' },
    { '@type': 'City', name: 'Pune' },
    { '@type': 'City', name: 'Chennai' }
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Magppie Collections',
    itemListElement: [
      {
        '@type': 'OfferCatalog',
        name: 'Wellness Kitchens',
        url: `${SITE_URL}/kitchens`
      },
      {
        '@type': 'OfferCatalog',
        name: 'Wellness Wardrobes',
        url: `${SITE_URL}/wardrobes`
      },
      {
        '@type': 'OfferCatalog',
        name: 'Wellness Vanities',
        url: `${SITE_URL}/vanities`
      }
    ]
  },
  paymentAccepted: ['Cash', 'Credit Card', 'Bank Transfer'],
  currenciesAccepted: 'INR'
};

// ── Product schemas (one per collection) ─────────────────────────────────
const sharedCollectionExtras = {
  brand: { '@id': ORG_ID },
  manufacturer: { '@id': ORG_ID },
  material: 'Silverstone™ patented antibacterial sintered stone',
  audience: {
    '@type': 'Audience',
    audienceType: 'Luxury homeowners, India'
  },
  warranty: {
    '@type': 'WarrantyPromise',
    durationOfWarranty: {
      '@type': 'QuantitativeValue',
      value: 25,
      unitCode: 'ANN'
    },
    warrantyScope:
      'Full product warranty against defects, material degradation, and structural failure'
  }
};

export const wellnessKitchenSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': `${SITE_URL}/kitchens#product`,
  name: 'Magppie Wellness Kitchen',
  description:
    'Luxury modular kitchen fully built in patented Silverstone™ antibacterial sintered stone. Zero formaldehyde, fire-rated, termite-proof, 25-year guarantee.',
  image: [
    `${SITE_URL}/images/kitchens/best-kitchen.webp`,
    `${SITE_URL}/images/kitchens/kitchen-marble-island.webp`,
    `${SITE_URL}/images/kitchens/kitchen-black-finish.webp`
  ],
  category: 'Modular Kitchen',
  ...sharedCollectionExtras,
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'INR',
    lowPrice: '1500000',
    highPrice: '15000000',
    offerCount: '23',
    availability: 'https://schema.org/InStock',
    seller: { '@id': ORG_ID }
  },
  award: 'KBIS 2026 Most Unexpected Innovation',
  hasCertification: [
    { '@type': 'Certification', name: 'Antibacterial certified, ASTM E-2180' },
    { '@type': 'Certification', name: 'Zero Formaldehyde' },
    { '@type': 'Certification', name: 'Fire Rated' }
  ]
};

export const wellnessWardrobeSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': `${SITE_URL}/wardrobes#product`,
  name: 'Magppie Wellness Wardrobe',
  description:
    'Premium wardrobe and walk-in closet system built in patented Silverstone™. Antibacterial, termite-proof, water-resistant, and guaranteed for 25 years.',
  image: [
    `${SITE_URL}/images/wardrobes/concept-1.webp`
  ],
  category: 'Wardrobe',
  ...sharedCollectionExtras,
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'INR',
    lowPrice: '800000',
    highPrice: '8000000',
    offerCount: '12',
    availability: 'https://schema.org/InStock',
    seller: { '@id': ORG_ID }
  },
  hasCertification: [
    { '@type': 'Certification', name: 'Antibacterial certified, ASTM E-2180' },
    { '@type': 'Certification', name: 'Zero Formaldehyde' }
  ]
};

export const wellnessVanitySchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': `${SITE_URL}/vanities#product`,
  name: 'Magppie Wellness Vanity',
  description:
    'Luxury bathroom vanity in patented Silverstone™. Waterproof, scratch-resistant, antibacterial. Eight finishes from Onyx Gold to Flurry Black, 25-year guarantee.',
  image: [
    `${SITE_URL}/images/vanities/01.webp`,
    `${SITE_URL}/images/vanities/onyx-gold-overmount.webp`
  ],
  category: 'Bathroom Vanity',
  ...sharedCollectionExtras,
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'INR',
    lowPrice: '450000',
    highPrice: '4500000',
    offerCount: '8',
    availability: 'https://schema.org/InStock',
    seller: { '@id': ORG_ID }
  },
  hasCertification: [
    { '@type': 'Certification', name: 'Antibacterial certified, ASTM E-2180' },
    { '@type': 'Certification', name: 'Waterproof, BS EN 12390 tested' }
  ]
};

// ── FAQPage (homepage + materials page) ──────────────────────────────────
export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a Magppie Wellness Kitchen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A Magppie Wellness Kitchen is a luxury modular kitchen built entirely in patented Silverstone™ antibacterial sintered stone. It contains no wood, no formaldehyde, and is certified antibacterial, fire-rated, water-proof, and termite-proof.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is Silverstone™?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Silverstone™ is Magppie's patented sintered stone, infused with silver at the molecular level for permanent antibacterial protection. It is non-porous, scratch-proof, stain-proof, water-proof, and fire-rated."
      }
    },
    {
      '@type': 'Question',
      name: 'What is the price of a Magppie modular kitchen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Magppie Wellness Kitchens start from approximately ₹15 lakh and scale based on size, finishes, and accessories. Custom proposals are prepared after a consultation at any Magppie showroom.'
      }
    },
    {
      '@type': 'Question',
      name: 'Where is Magppie based?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Magppie is headquartered in New Delhi, India. Showrooms operate across major Indian cities, with installations in Delhi, Mumbai, Bangalore, Hyderabad, Pune, Chennai, and the Gulf region.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is the Magppie warranty?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Every Magppie Wellness Kitchen, Wardrobe, and Vanity comes with a 25-year unconditional guarantee, plus 25 complimentary services across the lifetime of the product.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is Silverstone™ safe for food preparation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Silverstone™ is non-porous, antibacterial, zero-formaldehyde, and food-safe. It does not absorb water, does not harbor bacteria, and does not off-gas.'
      }
    },
    {
      '@type': 'Question',
      name: 'How is Magppie different from imported European kitchens?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Magppie is the world's only kitchen brand built entirely in patented antibacterial sintered stone. European brands typically use engineered wood, MDF, or laminate cores. Magppie uses zero wood and zero formaldehyde."
      }
    },
    {
      '@type': 'Question',
      name: 'How long does a Magppie installation take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Standard project lead time is 8 to 12 weeks from final design sign-off to installation, depending on size and finish selection.'
      }
    }
  ]
};

// ── BreadcrumbList builder ───────────────────────────────────────────────
// Helper, not a static block. Each interior page calls this with its own
// path so the BreadcrumbList reflects the current crumb trail.
export function breadcrumbSchema(
  trail: Array<{ name: string; path: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path}`
    }))
  };
}

// ── VideoObject (Stacy McCarthy testimonial on the homepage) ─────────────
export const stacyTestimonialVideoSchema = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'Stacy McCarthy on Magppie Wellness Kitchens',
  description:
    'Certified Master Kitchen and Bath Designer Stacy McCarthy on her experience working with Magppie.',
  thumbnailUrl: `${SITE_URL}/images/Partners/Stacy_Mc_Carthy.webp`,
  uploadDate: '2026-02-17',
  duration: 'PT1M30S',
  contentUrl: `${SITE_URL}/videos/stacy.mp4`,
  embedUrl: `${SITE_URL}/videos/stacy.webm`,
  publisher: { '@id': ORG_ID }
};

// ── ImageObject (KBIS hero, called from the homepage) ────────────────────
export const kbisHeroImageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ImageObject',
  contentUrl: `${SITE_URL}/images/news/kbis/hero.webp`,
  description:
    'Magppie accepting the Most Unexpected Innovation Award at KBIS 2026, Orlando.',
  creditText: 'Magppie',
  copyrightNotice: '© 2026 Magppie Silverstone Pvt. Ltd.',
  license: `${SITE_URL}/legal`,
  acquireLicensePage: `${SITE_URL}/contact`
};
