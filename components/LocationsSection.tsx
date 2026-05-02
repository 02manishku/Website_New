type LocationType = 'Headquarters' | 'Factory' | 'Office';
type Country = 'India' | 'United States';

type Location = {
  country: Country;
  countryCode: 'IN' | 'US';
  type: LocationType;
  city: string;
  region: string;
  address: string;
  phone?: string;
  email?: string;
};

const LOCATIONS: Location[] = [
  // ─── INDIA ────────────────────────────────────────────────
  {
    country: 'India',
    countryCode: 'IN',
    type: 'Headquarters',
    city: 'New Delhi',
    region: 'Sultanpur',
    address: '352, Sultanpur, MG Road, New Delhi 110030',
    phone: '+91 90155 67401',
    email: 'rananjay@magppie.com'
  },
  {
    country: 'India',
    countryCode: 'IN',
    type: 'Factory',
    city: 'Gurugram',
    region: 'IMT Manesar',
    address: 'Plot No. 68, Sector-3, IMT Manesar, Gurugram 122052, Haryana'
  },
  {
    country: 'India',
    countryCode: 'IN',
    type: 'Office',
    city: 'Delhi',
    region: 'Kirti Nagar',
    address: '12/1, W.H.S., Block-2, Kirti Nagar, New Delhi 110015',
    phone: '+91 97110 08775',
    email: 'tavneet@magppie.com'
  },
  {
    country: 'India',
    countryCode: 'IN',
    type: 'Office',
    city: 'Mumbai',
    region: 'Lower Parel',
    address: 'One Lodha Place, 1615B, Senapati Bapat Marg, Lower Parel 400013',
    phone: '+91 6269 080 008',
    email: 'anirban@magppie.com'
  },
  {
    country: 'India',
    countryCode: 'IN',
    type: 'Office',
    city: 'Surat',
    region: 'Vesu',
    address: 'Solaris Cube, Vesu, Maharana Pratap Road, Surat 395007',
    phone: '+91 97110 08734',
    email: 'radhika@magppie.com'
  },
  {
    country: 'India',
    countryCode: 'IN',
    type: 'Office',
    city: 'Mohali',
    region: 'Sector 82 JLPL',
    address: 'SCO No. 66, Airport Road, Sector 82 JLPL, Mohali 140308',
    phone: '+91 97110 08764',
    email: 'sakshi@magppie.com'
  },
  {
    country: 'India',
    countryCode: 'IN',
    type: 'Office',
    city: 'Hyderabad',
    region: 'Jubilee Hills',
    address: 'Golden Square, Road No. 45, Jubilee Hills, Telangana 500033',
    phone: '+91 70650 50893',
    email: 'ashish@magppie.com'
  },
  {
    country: 'India',
    countryCode: 'IN',
    type: 'Office',
    city: 'Bengaluru',
    region: 'Indiranagar',
    address: '1154, 12th Main Road, Indiranagar, Karnataka 560038',
    phone: '+91 99999 99012',
    email: 'sowmya@magppie.com'
  },
  {
    country: 'India',
    countryCode: 'IN',
    type: 'Office',
    city: 'Coimbatore',
    region: 'R.S. Puram',
    address: '84, West Sambandham Road, R.S. Puram, Coimbatore, Tamil Nadu 641002',
    phone: '+91 99441 34364',
    email: 'cbe.designelements@gmail.com'
  },

  // ─── UNITED STATES ────────────────────────────────────────
  {
    country: 'United States',
    countryCode: 'US',
    type: 'Headquarters',
    city: 'Gainesville',
    region: 'Florida',
    address: '802 NW 5th Avenue, Suite 100, Gainesville, Florida 32601',
    phone: '+1 352-213-6412',
    email: 'kish@magppie.com'
  },
  {
    country: 'United States',
    countryCode: 'US',
    type: 'Factory',
    city: 'Alachua',
    region: 'Florida',
    address: '13625 W SR 235, Alachua, Florida 32615',
    phone: '+1 352-359-4965',
    email: 'granitedecor@gmail.com'
  },
  {
    country: 'United States',
    countryCode: 'US',
    type: 'Office',
    city: 'Mansfield',
    region: 'Texas',
    address: '221, Regency Pkwy, Mansfield, Texas 76063',
    phone: '+1 313-505-2932',
    email: 'chaitanya@magppie.com'
  }
];

export default function LocationsSection() {
  const india = LOCATIONS.filter((l) => l.countryCode === 'IN');
  const usa = LOCATIONS.filter((l) => l.countryCode === 'US');

  return (
    <section className="bg-ink text-bone py-20 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        {/* Section opener, italic display, like a chapter heading in a monograph.
            No kicker. No spec strip. Just type. */}
        <h2 className="font-display font-light text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] text-bone leading-[1.05] max-w-3xl">
          Where to find us.
        </h2>
        <p className="mt-6 lg:mt-8 text-bone/55 max-w-xl">
          Twelve offices across India and the United States. By appointment.
        </p>

        <Directory country="United States" locations={usa} />
        <Directory country="India" locations={india} />
      </div>
    </section>
  );
}

function Directory({
  country,
  locations
}: {
  country: Country;
  locations: Location[];
}) {
  return (
    <div className="mt-20 lg:mt-28">
      {/* Country header, italic display + count. Heavier rule below it
          so the directory below feels like a chapter, not a card grid. */}
      <div className="flex items-baseline justify-between gap-6 border-b-2 border-bone pb-4 mb-1">
        <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl text-bone leading-none">
          {country}
        </h3>
        <span className="font-display italic text-base sm:text-lg text-bone/45">
          {locations.length} {locations.length === 1 ? 'location' : 'locations'}
        </span>
      </div>

      <ol className="contents">
        {locations.map((loc) => (
          <Row key={loc.country + loc.city + loc.region} loc={loc} />
        ))}
      </ol>
    </div>
  );
}

function Row({ loc }: { loc: Location }) {
  // Subtitle: for HQ/Factory we keep the type prefix because it's load-bearing.
  // For an office, the region alone reads more naturally.
  const subtitle =
    loc.type === 'Office' ? loc.region : `${loc.type} · ${loc.region}`;

  return (
    <li className="grid grid-cols-12 gap-x-4 lg:gap-x-10 gap-y-1 py-7 lg:py-9 border-t border-bone/15 list-none">
      {/* City */}
      <div className="col-span-12 lg:col-span-4">
        <h4 className="font-display text-2xl sm:text-3xl lg:text-[2.15rem] text-bone leading-tight">
          {loc.city}
        </h4>
        <div className="font-display italic text-base text-bone/55 mt-1">
          {subtitle}
        </div>
      </div>

      {/* Address */}
      <address className="col-span-12 lg:col-span-5 not-italic text-[0.95rem] text-bone/65 leading-relaxed self-start mt-2 lg:mt-2">
        {loc.address}
      </address>

      {/* Phone + email */}
      <div className="col-span-12 lg:col-span-3 lg:flex lg:flex-col lg:items-end self-start mt-1 lg:mt-2 space-y-1 text-[0.95rem]">
        {loc.phone && (
          <a
            href={`tel:${loc.phone.replace(/[^+\d]/g, '')}`}
            className="block text-bone/90 hover-underline w-fit py-1.5 -my-1.5"
          >
            {loc.phone}
          </a>
        )}
        {loc.email && (
          <a
            href={`mailto:${loc.email}`}
            className="block text-bone/50 hover-underline w-fit break-all py-1.5 -my-1.5"
          >
            {loc.email}
          </a>
        )}
      </div>
    </li>
  );
}
