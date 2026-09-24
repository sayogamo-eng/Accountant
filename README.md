# אתר תדמית לרואה חשבון / יועץ מס — Astro

תבנית אתר מקיף (חבילת "אתר מקיף למשרד בינוני") לרואה חשבון או יועץ מס, בנויה ב-Astro 7 כאתר סטטי, בעברית וב-RTL מלא.
האתר מוכן להצגה ללקוח כהדגמה, וכל הנתונים הספציפיים ללקוח מרוכזים בכמה קבצים בודדים.

## הרצה

```bash
npm install
npm run dev        # סביבת פיתוח: http://localhost:4321
npm run build      # בדיקת "מקור אמת אחד" + בנייה ל-dist/ + בדיקת SEO
npm run preview    # תצוגה של הבנייה
npm run check      # בדיקת טיפוסים
npm run checklist  # יצירת קובץ JSON לצ'קליסט (אחרי build)
```

## מקור אמת אחד לכל נתון

| מה | איפה |
|----|------|
| פרטי המשרד: שם, טלפון, מייל, כתובת, שעות, הסמכות, רכז נגישות | `src/data/business.ts` |
| מדרגות מס, נקודת זיכוי, מס יסף, ביטוח לאומי, מע״מ, תקרת עוסק פטור, מועדי הגשה | `src/data/tax.ts` |
| מחירי "החל מ-" | `src/data/pricing.ts` |
| שירותים, תחומי התמחות, צוות, המלצות, שאלות נפוצות, תפריטים | `src/data/*.ts` |

המאמרים (`src/content/articles/*.mdx`) מייבאים את הנתונים מהקבצים האלה ולא מקלידים מספרים.
`scripts/check-single-source.mjs` רץ לפני כל build ונכשל אם אחד מנתוני המס, המחירים או פרטי הקשר הוקלד ידנית מחוץ ל-`src/data/`.

**עדכון שנתי (תחילת שנת מס):** מעדכנים את `src/data/tax.ts` (ערכים, מקורות, `taxYear`, `updatedAt`) ובונים מחדש. כל העמודים, המאמרים, המחשבון והטבלאות מתעדכנים יחד.

### נתונים שלא אומתו

לכל קבוצת נתונים ב-`tax.ts` יש `verified`. כל עוד הוא `false`, מופיע ליד הנתון באתר תג "לאימות". נתוני 2026 נלקחו ממקורות משניים (המקורות מוצגים בעמודים) וצריך לאמת אותם מול רשות המסים וביטוח לאומי לפני העלייה לאוויר.

### מצב הדגמה

`business.demo: true` מציג באנר "אתר הדגמה" בכל העמודים. מכבים אותו רק אחרי שכל פרטי הלקוח האמיתיים הוזנו. תמונות צוות ומשרד מוצגות כמקום ריק מסומן עד שמגיעות תמונות אמיתיות (לא סטוק).

## חסימת אינדוקס (עד שיש דומיין)

`src/data/site.ts` → `allowIndexing = false` מוסיף `noindex` לכל העמודים, כותרת `X-Robots-Tag: noindex` לכל תשובה (ב-`dist/_headers`), ומסיר את ה-sitemap מ-robots.txt. בעלייה לדומיין האמיתי: משנים ל-`true` ומגדירים `SITE_URL`.

## SEO

- מפת מילים (מילה ראשית ו-Intent לכל עמוד): `src/data/seo.ts`.
- `scripts/check-seo.mjs` רץ אחרי כל build ונכשל אם: עמוד חסר במפה, שני עמודים חולקים מילה ראשית, ה-Title לא מכיל את המילה הראשית, או ש-Title או meta description כפולים.
- מחקר מתחרים, קבוצות נושא, Long-tail והתנגדויות: `docs/seo-research.md`.

## טופס הפניות (Cloudflare)

`functions/api/lead.js` מקבל את הטופס ב-`/api/lead` ומעביר כל פנייה לכל היעדים שהוגדרו. הפנייה נחשבת כנשלחה אם לפחות יעד אחד קיבל אותה:

1. **מייל** (Resend): משתני סביבה `RESEND_API_KEY`, `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL`
2. **שמירה ב-Cloudflare KV**: חיבור (binding) בשם `LEADS`
3. **Webhook** (Google Sheets / Make / CRM): משתנה `LEAD_WEBHOOK_URL`

מגדירים ב-Cloudflare → Workers & Pages → הפרויקט → Settings. אם אף יעד לא מוגדר או שכולם נכשלו, הגולש רואה הודעה עם טלפון ו-WhatsApp.

## המדריך לעצמאי (PDF)

- עמוד המקור: `src/pages/guides/self-employed-guide-print.astro`. כל הנתונים נלקחים מ-`src/data/`.
- יצירת ה-PDF מחדש: `npm run guide:pdf` (דורש Chromium של Playwright).
- `scripts/check-guide.mjs` מכשיל את ה-build אם תוכן המדריך השתנה (למשל נתון מס חדש) וה-PDF לא נוצר מחדש.
- עמוד ההורדה: `/resources/self-employed-guide`. אחרי השארת פרטים הגולש מועבר ל-`/guide-download`.

## משתני סביבה

ראו `.env.example`:

- `SITE_URL` — הדומיין הסופי (canonical, sitemap, Open Graph)
- `PUBLIC_FORM_ENDPOINT` — לא חובה. ברירת המחדל היא `/api/lead` (הפונקציה ב-Cloudflare). משנים רק אם רוצים לשלוח לשירות חיצוני.
- `PUBLIC_GA_ID` — מזהה GA4. נטען רק אחרי הסכמת הגולש בבאנר העוגיות.

## מבנה העמודים

בית · אודות · שירותים + 7 עמודי שירות · תחומי התמחות + 5 עמודי ענף · מחירים · צוות · המלצות · עדכוני מס (4 מאמרים) · כלים (מחשבון מס, לוח מועדים, צ׳קליסט לדוח שנתי) · שאלות נפוצות · צור קשר · תודה · פרטיות · נגישות · תנאי שימוש · 404.

SEO: כותרות ו-meta ייחודיים, canonical, Open Graph, sitemap, robots.txt, ו-Schema מסוג `AccountingService`, `Service`, `Article`, `FAQPage` ו-`BreadcrumbList`.

## צ׳קליסט הבנייה

`checklist/accountant-site-checklist.json` הוא קובץ ייבוא ל-Master Website Build Checklist (גרסה 3.0): כפתור "ייבוא" במסך הפרויקטים.

- `checklist/stages.json` — הסעיפים שחולצו מהצ׳קליסט.
- `checklist/progress.mjs` — מה סומן כבוצע או כלא רלוונטי, לפי הטקסט המדויק של כל סעיף.
- `npm run build && npm run checklist` — יוצר את הקובץ מחדש. הסקריפט נכשל אם טקסט של סעיף לא תואם.

## אירוח

`public/_headers` מגדיר כותרות אבטחה ו-cache בפורמט של Netlify / Cloudflare Pages. באירוח אחר צריך להגדיר את אותן כותרות.
