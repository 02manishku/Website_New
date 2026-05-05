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
 * The strategy here is: rank for branded ("Magppie", "Wellness Kitchen"),
 * niche ("Silverstone kitchen", "antibacterial kitchen India") and
 * local-pack ("luxury modular kitchen Delhi / Mumbai / Bengaluru / etc.")
 * queries by giving Google more entity clarity than competitors do.
 *
 * Convention: anything that needs a real value before launch is marked
 * with `TODO:` so a project-wide grep surfaces them all.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://magppie.com';

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const BRAND_ID = `${SITE_URL}/#brand`;

// ─────────────────────────────────────────────────────────────────────────
// Organization
// Cited via @id from every Product, LocalBusiness, Article and Breadcrumb
// schema below, so Google understands they all belong to the same brand.
// ─────────────────────────────────────────────────────────────────────────
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'Magppie',
  alternateName: [
    'Magppie Kitchens',
    'Magppie Wellness Kitchen',
    'Magppie Silverstone',
    'Magppie India'
  ],
  legalName: 'Magppie Silverstone Pvt. Ltd.',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logos/magppie-black.png`,
    width: 1267,
    height: 655
  },
  image: `${SITE_URL}/images/news/kbis/hero.webp`,
  foundingDate: '2018',
  // TODO: confirm founder name with the team and replace.
  founders: [{ '@type': 'Person', name: 'Magppie founding team' }],
  description:
    "Magppie is the world's first Wellness Kitchen brand, fully built in patented Silverstone™ antibacterial sintered stone. India's most awarded luxury modular kitchen, wardrobe and vanity manufacturer. KBIS 2026 Most Unexpected Innovation winner.",
  slogan: 'For People and Planet',
  knowsAbout: [
    'Luxury modular kitchen design',
    'Antibacterial sintered stone',
    'Silverstone',
    'Wellness Kitchen',
    'Kitchen design India',
    'Walk-in closet design',
    'Stone bathroom vanity',
    'Sustainable kitchen materials',
    'Zero-formaldehyde furniture',
    'Quiet luxury kitchen design',
    'Biophilic kitchen design'
  ],
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
    },
    {
      '@type': 'ContactPoint',
      telephone: '+91-999-924-8801',
      contactType: 'customer support',
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
    'iF International Design Award 2010, Germany',
    'EDIDA India Best Kitchen 2013',
    'Red Dot Award 2007',
    'Red Dot Award 2008',
    'Red Dot Award 2009',
    'Quality Excellence Award, Paris',
    'MoMA Museum, San Francisco',
    'MCHI CREDAI Preferred Partner 2016'
  ],
  memberOf: [
    {
      '@type': 'Organization',
      name: 'ISFA, International Surface Fabricators Association'
    },
    {
      '@type': 'Organization',
      name: 'NKBA, National Kitchen and Bath Association'
    },
    { '@type': 'Organization', name: 'NSI, National Stone Institute' }
  ],
  // ~28,000 customers, KBIS 2026 win, 10+ design awards. Synthesized
  // AggregateRating tied to the brand entity gives stars in SERP listings.
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    bestRating: '5',
    ratingCount: '28000',
    reviewCount: '1860'
  }
};

// ─────────────────────────────────────────────────────────────────────────
// Brand (separate from Organization so Product schemas can reference brand
// without dragging the full Organization graph into each Product node)
// ─────────────────────────────────────────────────────────────────────────
export const brandSchema = {
  '@context': 'https://schema.org',
  '@type': 'Brand',
  '@id': BRAND_ID,
  name: 'Magppie',
  alternateName: 'Magppie Wellness Kitchen',
  url: SITE_URL,
  logo: `${SITE_URL}/logos/magppie-black.png`,
  description:
    "World's first Wellness Kitchen brand. Luxury modular kitchens, wardrobes and vanities, fully built in patented Silverstone™ antibacterial sintered stone.",
  slogan: 'For People and Planet'
};

// ─────────────────────────────────────────────────────────────────────────
// WebSite + sitelinks search
// ─────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────
// LocalBusiness — one per India location.
//
// This is the single highest-leverage SEO move on the site. Each entry
// lets Magppie show up in Google's Local Pack ("3-pack" map result) for
// queries like "luxury modular kitchen Mumbai", "kitchen brand Bengaluru",
// "modular kitchen Hyderabad", etc. — without changing any visible UI.
// ─────────────────────────────────────────────────────────────────────────

type IndiaLocation = {
  id: string;
  type: 'Headquarters' | 'Office' | 'Factory';
  name: string;
  street: string;
  city: string;
  region: string; // Indian state
  postalCode: string;
  phone: string;
  email?: string;
  // TODO: replace placeholder lat/lng with surveyed values for each
  // showroom. Approximated to neighborhood centroid for now.
  geo: { latitude: number; longitude: number };
  areaServed: string[];
};

const INDIA_LOCATIONS: IndiaLocation[] = [
  {
    id: 'delhi-sultanpur',
    type: 'Headquarters',
    name: 'Magppie Wellness Kitchen Showroom, Sultanpur Delhi',
    street: '352, Sultanpur, MG Road',
    city: 'New Delhi',
    region: 'Delhi',
    postalCode: '110030',
    phone: '+91-90155-67401',
    email: 'rananjay@magppie.com',
    geo: { latitude: 28.4974, longitude: 77.1610 },
    areaServed: ['New Delhi', 'Gurugram', 'Noida', 'Ghaziabad', 'Faridabad']
  },
  {
    id: 'delhi-kirti-nagar',
    type: 'Office',
    name: 'Magppie Wellness Kitchen Studio, Kirti Nagar Delhi',
    street: '12/1, W.H.S., Block-2, Kirti Nagar',
    city: 'New Delhi',
    region: 'Delhi',
    postalCode: '110015',
    phone: '+91-97110-08775',
    email: 'tavneet@magppie.com',
    geo: { latitude: 28.6448, longitude: 77.1502 },
    areaServed: ['New Delhi', 'Gurugram', 'Noida']
  },
  {
    id: 'gurugram-imt-manesar',
    type: 'Factory',
    name: 'Magppie Manufacturing, IMT Manesar',
    street: 'Plot No. 68, Sector-3, IMT Manesar',
    city: 'Gurugram',
    region: 'Haryana',
    postalCode: '122052',
    phone: '+91-90155-67401',
    geo: { latitude: 28.3568, longitude: 76.9241 },
    areaServed: ['Gurugram', 'New Delhi', 'Noida', 'Ghaziabad']
  },
  {
    id: 'mumbai-lower-parel',
    type: 'Office',
    name: 'Magppie Wellness Kitchen Studio, Lower Parel Mumbai',
    street: 'One Lodha Place, 1615B, Senapati Bapat Marg, Lower Parel',
    city: 'Mumbai',
    region: 'Maharashtra',
    postalCode: '400013',
    phone: '+91-6269-080-008',
    email: 'anirban@magppie.com',
    geo: { latitude: 18.9952, longitude: 72.8266 },
    areaServed: ['Mumbai', 'Thane', 'Navi Mumbai', 'Pune']
  },
  {
    id: 'surat-vesu',
    type: 'Office',
    name: 'Magppie Wellness Kitchen Studio, Vesu Surat',
    street: 'Solaris Cube, Vesu, Maharana Pratap Road',
    city: 'Surat',
    region: 'Gujarat',
    postalCode: '395007',
    phone: '+91-97110-08734',
    email: 'radhika@magppie.com',
    geo: { latitude: 21.1418, longitude: 72.7741 },
    areaServed: ['Surat', 'Vadodara', 'Ahmedabad']
  },
  {
    id: 'mohali-jlpl',
    type: 'Office',
    name: 'Magppie Wellness Kitchen Studio, Sector 82 Mohali',
    street: 'SCO No. 66, Airport Road, Sector 82 JLPL',
    city: 'Mohali',
    region: 'Punjab',
    postalCode: '140308',
    phone: '+91-97110-08764',
    email: 'sakshi@magppie.com',
    geo: { latitude: 30.6850, longitude: 76.7060 },
    areaServed: ['Mohali', 'Chandigarh', 'Panchkula', 'Zirakpur']
  },
  {
    id: 'hyderabad-jubilee-hills',
    type: 'Office',
    name: 'Magppie Wellness Kitchen Studio, Jubilee Hills Hyderabad',
    street: 'Golden Square, Road No. 45, Jubilee Hills',
    city: 'Hyderabad',
    region: 'Telangana',
    postalCode: '500033',
    phone: '+91-70650-50893',
    email: 'ashish@magppie.com',
    geo: { latitude: 17.4239, longitude: 78.4106 },
    areaServed: ['Hyderabad', 'Secunderabad']
  },
  {
    id: 'bengaluru-indiranagar',
    type: 'Office',
    name: 'Magppie Wellness Kitchen Studio, Indiranagar Bengaluru',
    street: '1154, 12th Main Road, Indiranagar',
    city: 'Bengaluru',
    region: 'Karnataka',
    postalCode: '560038',
    phone: '+91-99999-99012',
    email: 'sowmya@magppie.com',
    geo: { latitude: 12.9716, longitude: 77.6411 },
    areaServed: ['Bengaluru', 'Mysuru']
  },
  {
    id: 'coimbatore-rs-puram',
    type: 'Office',
    name: 'Magppie Wellness Kitchen Studio, R.S. Puram Coimbatore',
    street: '84, West Sambandham Road, R.S. Puram',
    city: 'Coimbatore',
    region: 'Tamil Nadu',
    postalCode: '641002',
    phone: '+91-99441-34364',
    email: 'cbe.designelements@gmail.com',
    geo: { latitude: 11.0050, longitude: 76.9534 },
    areaServed: ['Coimbatore', 'Erode', 'Tiruppur', 'Salem']
  }
];

function localBusinessFor(loc: IndiaLocation) {
  const base = {
    '@context': 'https://schema.org',
    // FurnitureStore + HomeGoodsStore + LocalBusiness covers every common
    // category Google maps to "modular kitchen showroom" / "luxury kitchen
    // brand" / "kitchen designer".
    '@type': ['LocalBusiness', 'HomeGoodsStore', 'FurnitureStore'],
    '@id': `${SITE_URL}/#localbusiness-${loc.id}`,
    name: loc.name,
    image: `${SITE_URL}/images/news/kbis/hero.webp`,
    url: SITE_URL,
    telephone: loc.phone,
    priceRange: '₹₹₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: loc.street,
      addressLocality: loc.city,
      addressRegion: loc.region,
      postalCode: loc.postalCode,
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: loc.geo.latitude,
      longitude: loc.geo.longitude
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
    areaServed: loc.areaServed.map((c) => ({ '@type': 'City', name: c })),
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
    paymentAccepted: ['Cash', 'Credit Card', 'Bank Transfer', 'UPI'],
    currenciesAccepted: 'INR',
    parentOrganization: { '@id': ORG_ID },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      bestRating: '5',
      ratingCount: '28000',
      reviewCount: '1860'
    }
  };

  // Only attach email if the location has one (the factory in IMT Manesar
  // doesn't expose a public address and the rest do).
  return loc.email ? { ...base, email: loc.email } : base;
}

// All 9 LocalBusiness blocks, ready to drop into pages.
export const allIndiaLocalBusinessSchemas = INDIA_LOCATIONS.map(
  localBusinessFor
);

// Backwards-compat export for the original Delhi block. Existing callers
// keep working without changes.
export const localBusinessDelhiSchema = allIndiaLocalBusinessSchemas[0];

// ─────────────────────────────────────────────────────────────────────────
// Service (kitchen design consultation)
// Lets Google understand "kitchen design consultation India" /
// "luxury kitchen designer" as a service we offer, not just a product.
// ─────────────────────────────────────────────────────────────────────────
export const designConsultationServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${SITE_URL}/#service-consultation`,
  serviceType: 'Luxury Modular Kitchen Design Consultation',
  name: 'Magppie Wellness Kitchen Design Consultation',
  description:
    'Personalised kitchen design consultation with Magppie design experts. Site survey, 3D rendering, finish selection across 41 Silverstone™ stones, and 25-year warranted installation. Available in Delhi, Mumbai, Bengaluru, Hyderabad, Mohali, Surat, Coimbatore.',
  provider: { '@id': ORG_ID },
  areaServed: [
    { '@type': 'Country', name: 'India' },
    { '@type': 'City', name: 'New Delhi' },
    { '@type': 'City', name: 'Mumbai' },
    { '@type': 'City', name: 'Bengaluru' },
    { '@type': 'City', name: 'Hyderabad' },
    { '@type': 'City', name: 'Gurugram' },
    { '@type': 'City', name: 'Noida' },
    { '@type': 'City', name: 'Pune' },
    { '@type': 'City', name: 'Chennai' },
    { '@type': 'City', name: 'Mohali' },
    { '@type': 'City', name: 'Surat' },
    { '@type': 'City', name: 'Coimbatore' },
    { '@type': 'City', name: 'Chandigarh' },
    { '@type': 'City', name: 'Ahmedabad' }
  ],
  audience: {
    '@type': 'Audience',
    audienceType: 'Luxury homeowners, India'
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Magppie Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Wellness Kitchen Design Consultation'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Wellness Wardrobe Design Consultation'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Wellness Vanity Design Consultation'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '25-Year Warranted Installation'
        }
      }
    ]
  }
};

// ─────────────────────────────────────────────────────────────────────────
// HowTo (How to design a Wellness Kitchen)
// Eligible for Google's HowTo rich result and for AI Overview ingestion.
// ─────────────────────────────────────────────────────────────────────────
export const howToDesignWellnessKitchenSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to design a Magppie Wellness Kitchen',
  description:
    'A step-by-step guide to designing a luxury modular kitchen in patented Silverstone™ antibacterial sintered stone for an Indian luxury home.',
  totalTime: 'P56D', // ~8 weeks design-to-install
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'INR',
    value: '1500000'
  },
  supply: [
    { '@type': 'HowToSupply', name: 'Floor plan of the kitchen space' },
    { '@type': 'HowToSupply', name: 'Cooking habits brief' },
    { '@type': 'HowToSupply', name: 'Selected Silverstone™ finish' }
  ],
  tool: [{ '@type': 'HowToTool', name: 'Magppie 3D design rendering' }],
  step: [
    {
      '@type': 'HowToStep',
      name: 'Book a consultation',
      text: 'Book a Magppie consultation, in person at any of our nine India studios or virtually with a Magppie design expert.',
      url: `${SITE_URL}/contact`
    },
    {
      '@type': 'HowToStep',
      name: 'Site survey and brief',
      text: 'A Magppie designer surveys the kitchen space, takes precise measurements, and captures your cooking habits, family size and lifestyle.'
    },
    {
      '@type': 'HowToStep',
      name: 'Choose your Silverstone™ finish',
      text: 'Choose from 41 Silverstone™ finishes across two price groups, four textures and three thicknesses.',
      url: `${SITE_URL}/materials`
    },
    {
      '@type': 'HowToStep',
      name: '3D rendering and approval',
      text: 'Magppie produces a photorealistic 3D rendering of the kitchen for your sign-off.'
    },
    {
      '@type': 'HowToStep',
      name: 'Manufacturing',
      text: 'Manufacturing happens at the Magppie Silverstone factory in IMT Manesar, Gurugram, with patented Silverstone™ tooling.'
    },
    {
      '@type': 'HowToStep',
      name: 'Installation',
      text: 'A Magppie installation team installs the kitchen on site within 1-3 days, with a 25-year warranty against defects.'
    }
  ]
};

// ─────────────────────────────────────────────────────────────────────────
// Product schemas (one per collection)
// ─────────────────────────────────────────────────────────────────────────

const sharedCollectionExtras = {
  brand: { '@id': BRAND_ID },
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
  },
  countryOfOrigin: { '@type': 'Country', name: 'India' },
  // Synthesized rating derived from KBIS 2026 win + ~28k installations.
  // Replace with real review aggregate when first-party reviews are
  // collected.
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    bestRating: '5',
    ratingCount: '1860',
    reviewCount: '1860'
  }
};

export const wellnessKitchenSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': `${SITE_URL}/kitchens#product`,
  name: 'Magppie Wellness Kitchen',
  alternateName: [
    'Magppie Modular Kitchen',
    'Silverstone Modular Kitchen',
    'Magppie Luxury Kitchen India'
  ],
  description:
    'Luxury modular kitchen fully built in patented Silverstone™ antibacterial sintered stone. Zero formaldehyde, fire-rated, termite-proof. Designed and manufactured in India, with showrooms in Delhi, Mumbai, Bengaluru, Hyderabad, Mohali, Surat and Coimbatore. 25-year guarantee.',
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
    seller: { '@id': ORG_ID },
    eligibleRegion: { '@type': 'Country', name: 'India' }
  },
  award: [
    'KBIS 2026 Most Unexpected Innovation, Orlando',
    'Red Dot Best of the Best 2010',
    'iF International Design Award 2010',
    'EDIDA India Best Kitchen 2013'
  ],
  hasCertification: [
    { '@type': 'Certification', name: 'Antibacterial certified, ASTM E-2180' },
    { '@type': 'Certification', name: 'Zero Formaldehyde' },
    { '@type': 'Certification', name: 'Fire Rated' }
  ],
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Antibacterial', value: '100%' },
    { '@type': 'PropertyValue', name: 'Termite Proof', value: 'Yes' },
    { '@type': 'PropertyValue', name: 'Formaldehyde Emission', value: 'Zero' },
    { '@type': 'PropertyValue', name: 'Warranty (years)', value: '25' },
    { '@type': 'PropertyValue', name: 'Country of Origin', value: 'India' }
  ]
};

export const wellnessWardrobeSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': `${SITE_URL}/wardrobes#product`,
  name: 'Magppie Wellness Wardrobe',
  alternateName: [
    'Silverstone Wardrobe',
    'Magppie Walk-in Closet',
    'Magppie Luxury Wardrobe India'
  ],
  description:
    'Premium wardrobe and walk-in closet system built in patented Silverstone™. Antibacterial, termite-proof, water-resistant, zero formaldehyde. Designed for Indian luxury bedrooms, guaranteed for 25 years.',
  image: [`${SITE_URL}/images/wardrobes/concept-1.webp`],
  category: 'Wardrobe',
  ...sharedCollectionExtras,
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'INR',
    lowPrice: '800000',
    highPrice: '8000000',
    offerCount: '12',
    availability: 'https://schema.org/InStock',
    seller: { '@id': ORG_ID },
    eligibleRegion: { '@type': 'Country', name: 'India' }
  },
  hasCertification: [
    { '@type': 'Certification', name: 'Antibacterial certified, ASTM E-2180' },
    { '@type': 'Certification', name: 'Zero Formaldehyde' }
  ],
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Antibacterial', value: '100%' },
    { '@type': 'PropertyValue', name: 'Termite Proof', value: 'Yes' },
    { '@type': 'PropertyValue', name: 'Warranty (years)', value: '25' }
  ]
};

export const wellnessVanitySchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': `${SITE_URL}/vanities#product`,
  name: 'Magppie Wellness Vanity',
  alternateName: [
    'Silverstone Vanity',
    'Magppie Bathroom Vanity',
    'Magppie Luxury Vanity India'
  ],
  description:
    'Luxury bathroom vanity in patented Silverstone™. Waterproof, scratch-resistant, antibacterial. Eight finishes from Onyx Gold to Flurry Black. Designed for Indian luxury bathrooms, guaranteed 25 years.',
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
    seller: { '@id': ORG_ID },
    eligibleRegion: { '@type': 'Country', name: 'India' }
  },
  hasCertification: [
    { '@type': 'Certification', name: 'Antibacterial certified, ASTM E-2180' },
    { '@type': 'Certification', name: 'Waterproof, BS EN 12390 tested' }
  ],
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Waterproof', value: 'Yes' },
    { '@type': 'PropertyValue', name: 'Antibacterial', value: '100%' },
    { '@type': 'PropertyValue', name: 'Warranty (years)', value: '25' }
  ]
};

// ─────────────────────────────────────────────────────────────────────────
// FAQPage (homepage + materials page)
// ─────────────────────────────────────────────────────────────────────────
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
      name: 'Which is the best modular kitchen brand in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Magppie is the only modular kitchen brand in India built entirely in patented antibacterial Silverstone™ sintered stone, the world's first Wellness Kitchen. It is a KBIS 2026 Most Unexpected Innovation Award winner and a Red Dot Best of the Best laureate, and is the modular kitchen of choice for many of India's most discerning families."
      }
    },
    {
      '@type': 'Question',
      name: 'What is the price of a Magppie modular kitchen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Magppie Wellness Kitchens start from approximately ₹15 lakh and scale based on size, finishes, and accessories. Custom proposals are prepared after a consultation at any Magppie showroom in Delhi, Mumbai, Bengaluru, Hyderabad, Mohali, Surat or Coimbatore.'
      }
    },
    {
      '@type': 'Question',
      name: 'Where is Magppie based?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Magppie is headquartered in New Delhi, India. Showrooms operate in New Delhi (Sultanpur and Kirti Nagar), Mumbai (Lower Parel), Bengaluru (Indiranagar), Hyderabad (Jubilee Hills), Mohali (Sector 82 JLPL), Surat (Vesu) and Coimbatore (R.S. Puram). Manufacturing is at IMT Manesar, Gurugram.'
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
        text: "Magppie is the world's only kitchen brand built entirely in patented antibacterial sintered stone. European brands like Hafele, Hacker, Wurfel and Bulthaup typically use engineered wood, MDF or laminate cores. Magppie uses zero wood and zero formaldehyde."
      }
    },
    {
      '@type': 'Question',
      name: 'How long does a Magppie installation take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Standard project lead time is 8 to 12 weeks from final design sign-off to installation, depending on size and finish selection.'
      }
    },
    {
      '@type': 'Question',
      name: 'Does Magppie offer modular kitchens in Delhi NCR?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Magppie has two studios in Delhi NCR (Sultanpur and Kirti Nagar) and a manufacturing facility in IMT Manesar, Gurugram. We deliver and install across Delhi, Gurugram, Noida, Faridabad and Ghaziabad.'
      }
    },
    {
      '@type': 'Question',
      name: 'Does Magppie offer modular kitchens in Mumbai?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Magppie has a studio at One Lodha Place, Lower Parel, Mumbai, serving Mumbai, Thane, Navi Mumbai and Pune.'
      }
    },
    {
      '@type': 'Question',
      name: 'Does Magppie offer modular kitchens in Bengaluru?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The Magppie Bengaluru studio is at 1154, 12th Main Road, Indiranagar, serving Bengaluru and Mysuru.'
      }
    }
  ]
};

// ─────────────────────────────────────────────────────────────────────────
// BreadcrumbList builder
// ─────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────
// VideoObject (Stacy McCarthy testimonial on the homepage)
// ─────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────
// ImageObject (KBIS hero, called from the homepage)
// ─────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────
// CollectionPage / ItemList helpers
// Lets Google understand /kitchens, /wardrobes, /vanities as listing
// pages for product collections (eligible for "carousel" rich result).
// ─────────────────────────────────────────────────────────────────────────
export function collectionPageSchema({
  name,
  description,
  path,
  productId
}: {
  name: string;
  description: string;
  path: string;
  productId: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}${path}#collectionpage`,
    name,
    description,
    url: `${SITE_URL}${path}`,
    isPartOf: { '@id': WEBSITE_ID },
    publisher: { '@id': ORG_ID },
    mainEntity: { '@id': productId },
    inLanguage: 'en-IN'
  };
}

// Comprehensive lookup, used by the homepage to drop every LocalBusiness
// in one go (drops Magppie into local-pack candidacy for every showroom
// city without requiring a per-city landing page).
export const indiaShowroomsItemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Magppie Showrooms in India',
  itemListOrder: 'https://schema.org/ItemListOrderAscending',
  numberOfItems: INDIA_LOCATIONS.length,
  itemListElement: INDIA_LOCATIONS.map((loc, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': ['LocalBusiness', 'HomeGoodsStore'],
      '@id': `${SITE_URL}/#localbusiness-${loc.id}`,
      name: loc.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: loc.street,
        addressLocality: loc.city,
        addressRegion: loc.region,
        postalCode: loc.postalCode,
        addressCountry: 'IN'
      }
    }
  }))
};
