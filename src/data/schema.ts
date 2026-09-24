import { business, fullAddress } from './business';
import { services } from './services';

/** AccountingService (a LocalBusiness subtype) built entirely from business.ts. */
export function organizationSchema(site: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AccountingService',
    '@id': new URL('/#organization', site).href,
    name: business.name,
    legalName: business.legalName,
    description: business.description,
    url: site.href,
    logo: new URL('/icon-512.png', site).href,
    image: new URL('/og-default.png', site).href,
    telephone: business.phoneIntl,
    email: business.email,
    foundingDate: String(business.foundedYear),
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: business.address.geo.lat, longitude: business.address.geo.lng },
    areaServed: business.areaServed,
    openingHoursSpecification: business.hours
      .filter((h) => h.open)
      .map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.schema, opens: h.open, closes: h.close })),
    sameAs: Object.values(business.social),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'שירותים',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.title, url: new URL(`/services/${s.slug}`, site).href },
      })),
    },
  };
}

export const orgRef = (site: URL) => ({ '@id': new URL('/#organization', site).href, name: business.name, address: fullAddress });
