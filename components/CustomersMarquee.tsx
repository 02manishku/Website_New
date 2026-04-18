'use client';

const CUSTOMERS = [
  'Ranbir Kapoor',
  'M S Dhoni',
  'Anant Ambani',
  'Sunil Bharti Mittal',
  'Shilpa Shetty',
  'Nagarjuna',
  'Chiranjeevi',
  'Nitin Gadkari',
  'Kamal Nath',
  'Natasha Poonawalla',
  'Ritesh Malik',
  'Sarah Sham — Essajees Atelier'
];

const PARTNERS = [
  'Karim Rashid · USA',
  'Stefan Diez · Germany',
  'Cory Grosser · USA',
  'Rémi Bouhaniche · France'
];

export default function CustomersMarquee() {
  const row = [...CUSTOMERS, ...CUSTOMERS];
  const rowB = [...PARTNERS, ...PARTNERS, ...PARTNERS];
  return (
    <div className="space-y-8 overflow-hidden">
      <div className="overflow-hidden">
        <div className="flex marquee-track whitespace-nowrap">
          {row.map((n, i) => (
            <span
              key={i}
              className="font-display text-3xl md:text-5xl text-bone/90 px-8"
            >
              {n} <span className="text-bone/30 mx-4">·</span>
            </span>
          ))}
        </div>
      </div>
      <div className="overflow-hidden">
        <div
          className="flex marquee-track whitespace-nowrap"
          style={{ animationDirection: 'reverse', animationDuration: '60s' }}
        >
          {rowB.map((n, i) => (
            <span
              key={i}
              className="kicker text-bone/60 px-8"
            >
              {n} <span className="text-bone/20 mx-4">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
