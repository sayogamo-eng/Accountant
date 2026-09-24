/**
 * Yearly tax figures — the ONLY place these numbers are defined.
 *
 * At the start of each tax year: update the values below (and their sources), bump
 * `taxYear` and `updatedAt`, and rebuild. Every page, article, calculator and table
 * that shows these figures picks the new values up automatically.
 *
 * `verified: false` renders a visible "לאימות" marker next to the value on the site,
 * so an unconfirmed figure never looks final. Set it to true once the office has
 * checked the value against the official publication.
 */

export type Source = { label: string; url: string };

export const taxYear = 2026;
export const updatedAt = '2026-09-24';

/** Monthly income tax brackets for individuals (upper bound of each bracket, NIS). */
export const incomeTaxBrackets = {
  verified: false,
  source: [
    { label: 'Bizportal — מדרגות מס 2026', url: 'https://www.bizportal.co.il/guides/news/article/20038711' },
    { label: 'הכנסת — ניתוח ההצעה לריווח מדרגות המס משנת 2026', url: 'https://fs.knesset.gov.il/globaldocs/MMM/a4622f6b-9905-f111-a13e-005056aa7c52/2_a4622f6b-9905-f111-a13e-005056aa7c52_11_21431.pdf' },
  ] as Source[],
  monthly: [
    { upTo: 7_010, rate: 0.1 },
    { upTo: 10_060, rate: 0.14 },
    { upTo: 19_000, rate: 0.2 },
    { upTo: 25_100, rate: 0.31 },
    { upTo: 46_690, rate: 0.35 },
    { upTo: Infinity, rate: 0.47 },
  ],
};

/** Surtax (מס יסף) on annual income above the threshold. */
export const surtax = {
  verified: false,
  source: [{ label: 'Bizportal — מדרגות מס 2026', url: 'https://www.bizportal.co.il/guides/news/article/20038711' }] as Source[],
  annualThreshold: 721_560,
  rate: 0.03,
};

/** Value of one tax credit point (נקודת זיכוי). */
export const creditPoint = {
  verified: false,
  source: [{ label: 'Bizportal — נקודות זיכוי', url: 'https://www.bizportal.co.il/career/news/article/20035600' }] as Source[],
  monthly: 242,
  basePointsMan: 2.25,
  basePointsWoman: 2.75,
};

/** National Insurance + health tax for self-employed (עצמאים). */
export const nationalInsurance = {
  verified: false,
  source: [
    { label: 'ביטוח לאומי — שינוי בתשלום דמי ביטוח לשנת 2026', url: 'https://www.btl.gov.il/Insurance/HozrimBituah/Hozrim/_%D7%A9%D7%99%D7%A0%D7%95%D7%99_%D7%91%D7%AA%D7%A9%D7%9C%D7%95%D7%9D_%D7%93%D7%9E%D7%99_%D7%91%D7%99%D7%98%D7%95%D7%97_%D7%9C%D7%90%D7%95%D7%9E%D7%99_%D7%95%D7%93%D7%9E%D7%99_%D7%91%D7%99%D7%98%D7%95%D7%97_%D7%91%D7%A8%D7%99%D7%90%D7%95%D7%AA_%D7%9C%D7%A9%D7%A0%D7%AA_2026.pdf' },
    { label: 'Bizportal — ביטוח לאומי לעצמאי 2026', url: 'https://www.bizportal.co.il/guides/news/article/20039168' },
  ] as Source[],
  averageWage: 13_769,
  /** 60% of the average wage — income up to here is charged the reduced rate. */
  reducedThresholdMonthly: 7_703,
  maxInsurableMonthly: 51_910,
  selfEmployed: {
    reduced: { ni: 0.0447, health: 0.0323 },
    full: { ni: 0.1283, health: 0.0517 },
  },
};

export const vat = {
  verified: false,
  source: [{ label: 'רשות המסים — שיעור המע״מ', url: 'https://www.gov.il/he/departments/israel_tax_authority' }] as Source[],
  rate: 0.18,
};

/** Annual turnover ceiling for an exempt dealer (עוסק פטור). */
export const exemptDealer = {
  verified: false,
  source: [{ label: 'Bizportal — עוסק פטור 2026', url: 'https://www.bizportal.co.il/guides/news/article/20039167' }] as Source[],
  annualCeiling: 122_833,
};

/** Recurring filing deadlines shown on the deadlines calendar and in articles. */
export const deadlines = {
  verified: false,
  source: [{ label: 'רשות המסים', url: 'https://www.gov.il/he/departments/israel_tax_authority' }] as Source[],
  recurring: [
    { id: 'vat', title: 'דיווח ותשלום מע״מ', when: 'עד ה-15 בחודש שלאחר תקופת הדיווח (חודשי או דו-חודשי)', who: 'עוסק מורשה, חברה' },
    { id: 'advances', title: 'מקדמות מס הכנסה', when: 'עד ה-15 בחודש שלאחר תקופת הדיווח', who: 'עצמאים וחברות' },
    { id: 'withholding', title: 'דיווח ניכויים (שכר) — טופס 102', when: 'עד ה-15 בחודש שלאחר חודש השכר', who: 'מעסיקים' },
    { id: 'ni-self', title: 'מקדמות ביטוח לאומי לעצמאים', when: 'עד ה-15 בכל חודש', who: 'עצמאים' },
    { id: 'patur', title: 'הצהרה שנתית של עוסק פטור', when: 'עד 31 בינואר, על השנה שחלפה', who: 'עוסק פטור' },
    { id: 'annual', title: 'דוח שנתי למס הכנסה', when: 'עד סוף אפריל (דיווח מקוון — עד סוף מאי), בכפוף להארכות למייצגים', who: 'עצמאים, בעלי שליטה, חייבי דיווח' },
    { id: 'form126', title: 'דוח שנתי למעסיקים — טופס 126', when: 'עד סוף אפריל', who: 'מעסיקים' },
  ],
};

// ---------- Derived values (never type these by hand) ----------

export const annualBrackets = incomeTaxBrackets.monthly.map((b) => ({
  upTo: b.upTo === Infinity ? Infinity : b.upTo * 12,
  rate: b.rate,
}));
export const creditPointAnnual = creditPoint.monthly * 12;
export const topBracketRate = incomeTaxBrackets.monthly[incomeTaxBrackets.monthly.length - 1].rate;
export const niReducedRate = nationalInsurance.selfEmployed.reduced.ni + nationalInsurance.selfEmployed.reduced.health;
export const niFullRate = nationalInsurance.selfEmployed.full.ni + nationalInsurance.selfEmployed.full.health;

/** Plain, serialisable copy for the client-side calculator. */
export const calculatorData = {
  taxYear,
  brackets: annualBrackets.map((b) => ({ upTo: Number.isFinite(b.upTo) ? b.upTo : null, rate: b.rate })),
  surtax: { threshold: surtax.annualThreshold, rate: surtax.rate },
  creditPointAnnual,
  basePoints: { man: creditPoint.basePointsMan, woman: creditPoint.basePointsWoman },
  ni: {
    reducedThreshold: nationalInsurance.reducedThresholdMonthly * 12,
    max: nationalInsurance.maxInsurableMonthly * 12,
    reducedRate: niReducedRate,
    fullRate: niFullRate,
  },
};
