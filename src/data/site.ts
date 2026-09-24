/**
 * Search-engine indexing switch — the ONLY place it is set.
 *
 * false: every page gets <meta name="robots" content="noindex, nofollow">, every response
 *        gets an `X-Robots-Tag: noindex, nofollow` header (dist/_headers), and robots.txt
 *        does not advertise the sitemap. Use this until the site is on its real domain.
 * true:  normal indexing. Flip this at launch, together with SITE_URL.
 *
 * robots.txt deliberately does NOT "Disallow: /" while blocked: crawlers must be able to
 * fetch the pages to see the noindex, otherwise URLs can still appear in results.
 */
export const allowIndexing = false;

/**
 * Google Analytics 4 measurement ID (public by design — it appears in every page's code).
 * Loaded only after the visitor accepts cookies. PUBLIC_GA_ID in the environment overrides it.
 * Empty string = no analytics.
 */
export const gaMeasurementId = 'G-ETZ5NLZJ5S';
