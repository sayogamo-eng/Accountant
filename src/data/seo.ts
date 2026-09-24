/**
 * Keyword map: one primary keyword and one search intent per indexable URL.
 * `{city}` is replaced with business.address.searchName.
 *
 * scripts/check-seo.mjs runs after every build and fails when:
 *  - an indexable page is missing from this map (or the map lists a page that doesn't exist)
 *  - two URLs share a primary keyword (they would compete for the same search)
 *  - a page's <title> doesn't contain its primary keyword
 *  - two pages share a <title> or meta description
 *
 * Research notes, competitors and long-tail queries: docs/seo-research.md
 * This file has no imports on purpose, so the check script can load it directly.
 */

export type Intent = 'local-commercial' | 'commercial' | 'informational' | 'navigational' | 'transactional';

export type KeywordEntry = {
  primary: string;
  intent: Intent;
  secondary?: string[];
};

export const keywordMap: Record<string, KeywordEntry> = {
  '/': { primary: 'רואה חשבון ב{city}', intent: 'local-commercial', secondary: ['משרד רואי חשבון ב{city}', 'יועץ מס ב{city}'] },
  '/about': { primary: 'אודות המשרד', intent: 'navigational' },
  '/services': { primary: 'שירותי ראיית חשבון', intent: 'commercial', secondary: ['שירותי ייעוץ מס'] },
  '/services/bookkeeping': { primary: 'הנהלת חשבונות לעצמאים', intent: 'commercial', secondary: ['הנהלת חשבונות לעוסק מורשה', 'הנהלת חשבונות לעוסק פטור', 'הנהלת חשבונות לחברה בע״מ'] },
  '/services/annual-reports': { primary: 'דוח שנתי למס הכנסה', intent: 'commercial', secondary: ['הגשת דוח שנתי', 'דוחות כספיים לחברה', 'הצהרת הון'] },
  '/services/tax-consulting': { primary: 'ייעוץ מס', intent: 'commercial', secondary: ['תכנון מס', 'יועץ מס לחברות', 'משיכת דיבידנד', 'מיסוי אופציות'] },
  '/services/business-advisory': { primary: 'ליווי עסקי', intent: 'commercial', secondary: ['ייעוץ עסקי', 'תזרים מזומנים', 'תוכנית עסקית'] },
  '/services/payroll': { primary: 'הנהלת שכר', intent: 'commercial', secondary: ['הפקת תלושי שכר', 'חשב שכר'] },
  '/services/open-business': { primary: 'פתיחת תיק עצמאי', intent: 'transactional', secondary: ['פתיחת עוסק פטור', 'פתיחת עוסק מורשה', 'פתיחת חברה בע״מ'] },
  '/services/audit': { primary: 'ביקורת דוחות כספיים', intent: 'commercial', secondary: ['ביקורת עמותות', 'רואה חשבון מבקר'] },
  '/industries': { primary: 'רואה חשבון לפי סוג עסק', intent: 'commercial' },
  '/industries/freelancers': { primary: 'רואה חשבון לעצמאים', intent: 'local-commercial', secondary: ['רואה חשבון לפרילנסרים', 'רואה חשבון לעצמאים ב{city}'] },
  '/industries/tech-startups': { primary: 'רואה חשבון להייטק', intent: 'commercial', secondary: ['רואה חשבון לסטארטאפים', 'מיסוי אופציות 102'] },
  '/industries/ecommerce': { primary: 'רואה חשבון למסחר אלקטרוני', intent: 'commercial', secondary: ['רואה חשבון לחנות אונליין'] },
  '/industries/real-estate': { primary: 'רואה חשבון לנדל״ן', intent: 'commercial', secondary: ['מס שבח', 'מיסוי דמי שכירות'] },
  '/industries/small-business': { primary: 'רואה חשבון לעסקים קטנים', intent: 'commercial', secondary: ['רואה חשבון לעסק משפחתי'] },
  '/pricing': { primary: 'כמה עולה רואה חשבון', intent: 'commercial', secondary: ['מחירון רואה חשבון', 'מחיר הנהלת חשבונות'] },
  '/team': { primary: 'הצוות', intent: 'navigational' },
  '/testimonials': { primary: 'המלצות לקוחות', intent: 'navigational' },
  '/articles': { primary: 'עדכוני מס', intent: 'informational' },
  '/articles/income-tax-brackets': { primary: 'מדרגות מס הכנסה', intent: 'informational', secondary: ['נקודת זיכוי', 'מס יסף'] },
  '/articles/exempt-vs-licensed-dealer': { primary: 'ההבדל בין עוסק פטור לעוסק מורשה', intent: 'informational', secondary: ['תקרת עוסק פטור', 'עוסק פטור או מורשה'] },
  '/articles/how-to-open-self-employed-file': { primary: 'איך פותחים תיק עצמאי', intent: 'informational', secondary: ['מה צריך כדי לפתוח תיק עצמאי'] },
  '/articles/national-insurance-self-employed': { primary: 'ביטוח לאומי לעצמאים', intent: 'informational', secondary: ['דמי ביטוח לאומי לעצמאי', 'מקדמות ביטוח לאומי'] },
  '/resources': { primary: 'כלים ומשאבים', intent: 'navigational' },
  '/resources/tax-calculator': { primary: 'מחשבון מס הכנסה', intent: 'transactional', secondary: ['מחשבון ביטוח לאומי לעצמאים'] },
  '/resources/deadlines': { primary: 'מועדי הגשה', intent: 'informational', secondary: ['מועד הגשת דוח שנתי', 'מועד דיווח מע״מ'] },
  '/resources/self-employed-guide': { primary: 'המדריך לעצמאי', intent: 'transactional', secondary: ['מדריך לעצמאי PDF', 'מדריך לפתיחת עסק'] },
  '/resources/annual-report-checklist': { primary: 'מסמכים לדוח השנתי', intent: 'informational', secondary: ['אילו מסמכים צריך לדוח שנתי'] },
  '/faq': { primary: 'שאלות נפוצות', intent: 'informational' },
  '/contact': { primary: 'פגישת ייעוץ', intent: 'transactional', secondary: ['צור קשר'] },
  '/privacy': { primary: 'מדיניות פרטיות', intent: 'navigational' },
  '/accessibility': { primary: 'הצהרת נגישות', intent: 'navigational' },
  '/terms': { primary: 'תנאי שימוש', intent: 'navigational' },
};
