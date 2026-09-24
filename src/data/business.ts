/**
 * Office details — the ONLY place these values are defined.
 * Every page, the footer, the contact page and the JSON-LD schema read from here.
 *
 * `demo: true` shows a visible "demo data" banner on every page, so sample values
 * can never go live unnoticed. Set it to false once the client's real details are in.
 */
export const business = {
  demo: true,

  name: 'כהן ושות׳ — רואי חשבון ויועצי מס',
  shortName: 'כהן ושות׳',
  legalName: 'כהן ושות׳ רואי חשבון',
  tagline: 'הנהלת חשבונות, דוחות ומס — בלי כאבי ראש',
  description:
    'משרד רואי חשבון ויועצי מס בתל אביב המלווה עצמאים, עסקים קטנים-בינוניים וסטארטאפים: הנהלת חשבונות, דוחות שנתיים, ייעוץ ותכנון מס, שכר ופתיחת תיק.',
  foundedYear: 2009,
  businessId: '000000000', // ח.פ. / ע.מ.

  phone: '03-000-0000',
  phoneIntl: '+97230000000',
  whatsapp: '972500000000', // digits only, international format
  email: 'office@example-cpa.co.il',

  address: {
    street: 'רחוב הדוגמה 1, קומה 5',
    city: 'תל אביב-יפו',
    postalCode: '6100000',
    country: 'IL',
    mapQuery: 'Tel Aviv-Yafo, Israel',
    geo: { lat: 32.0853, lng: 34.7818 },
  },
  areaServed: ['תל אביב', 'רמת גן', 'גבעתיים', 'הרצליה', 'חולון', 'עבודה מרחוק בכל הארץ'],

  hours: [
    { days: 'ראשון–חמישי', open: '08:30', close: '17:30', schema: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'] },
    { days: 'שישי ושבת', open: null, close: null, schema: [] },
  ],

  social: {
    facebook: 'https://www.facebook.com/',
    linkedin: 'https://www.linkedin.com/',
  },

  /** Links to external systems clients already use. Leave url empty to hide. */
  clientPortal: { label: 'פורטל לקוחות', url: '' },

  activeClients: 450,
  responseHours: 24,

  certifications: [
    'רואה חשבון מוסמך — מועצת רואי החשבון',
    'יועץ מס מוסמך',
    'חבר לשכת רואי החשבון בישראל',
  ],

  software: ['חשבשבת', 'iCount', 'Priority', 'חשבונית ירוקה', 'Rivhit'],

  privacy: {
    officer: 'רו״ח דנה כהן',
    email: 'privacy@example-cpa.co.il',
  },
  accessibility: {
    coordinator: 'יוסי לוי',
    phone: '03-000-0000',
    email: 'access@example-cpa.co.il',
    statementDate: '2026-09-24',
  },
} as const;

export const telHref = `tel:${business.phoneIntl}`;
export const mailHref = `mailto:${business.email}`;
export const whatsappHref = (text = 'שלום, אשמח לקבוע פגישת ייעוץ') =>
  `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(text)}`;
export const fullAddress = `${business.address.street}, ${business.address.city}`;
export const yearsActive = new Date().getFullYear() - business.foundedYear;

export const stats = [
  { value: `${yearsActive}+`, label: 'שנות ניסיון' },
  { value: `${business.activeClients}+`, label: 'לקוחות פעילים' },
  { value: `${business.responseHours} ש׳`, label: 'זמן מענה מרבי' },
];
