/**
 * Prices — the ONLY place they are defined. Shown on service pages, the pricing
 * page and the home page. All prices are "starting from", per month or one-off,
 * and include VAT (consumer-facing prices must be shown as the full price).
 */
export const pricingNote = 'המחירים כוללים מע״מ ומהווים נקודת פתיחה. הצעת מחיר סופית נקבעת לפי היקף הפעילות.';

export const prices = {
  bookkeepingPatur: { amount: 250, unit: 'לחודש', label: 'עוסק פטור' },
  bookkeepingMurshe: { amount: 550, unit: 'לחודש', label: 'עוסק מורשה' },
  bookkeepingCompany: { amount: 1_200, unit: 'לחודש', label: 'חברה בע״מ' },
  annualReportPrivate: { amount: 900, unit: 'לדוח', label: 'דוח שנתי ליחיד' },
  annualReportBusiness: { amount: 2_500, unit: 'לדוח', label: 'דוחות כספיים לחברה' },
  taxConsultation: { amount: 600, unit: 'לפגישה', label: 'פגישת ייעוץ מס' },
  payroll: { amount: 60, unit: 'לעובד לחודש', label: 'הפקת שכר' },
  openFile: { amount: 0, unit: 'חד-פעמי', label: 'פתיחת תיק ללקוח שוטף' },
  businessAdvisory: { amount: 1_500, unit: 'לחודש', label: 'ליווי עסקי שוטף' },
  audit: { amount: 6_000, unit: 'לשנה', label: 'ביקורת דוחות' },
} as const;

export type PriceKey = keyof typeof prices;
