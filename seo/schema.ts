/**
 * JSON-LD structured data for Devobi.
 *
 * Kept separate from `routes.ts` so schema can be composed per-route.
 * These blocks are injected server-side / at build time, NOT rendered by React,
 * which means they are visible to crawlers even on client-only routes.
 */

import { SITE_URL } from './routes';

export const ORGANIZATION_SCHEMA = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Devobi LLC',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/images/og-default.png`,
  },
  image: `${SITE_URL}/images/og-default.png`,
  description:
    'AI lead reactivation for home service contractors. Devobi reactivates dormant CRM leads into booked estimates.',
  email: 'info@devobi.com',
  founder: {
    '@type': 'Person',
    name: 'Obinna Ezeilo',
    jobTitle: 'Founder',
  },
  areaServed: {
    '@type': 'Country',
    name: 'United States',
  },
  knowsAbout: [
    'Lead reactivation',
    'Home services automation',
    'CRM integration',
    'AI sales follow-up',
  ],
} as const;

export const WEBSITE_SCHEMA = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'Devobi',
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'en-US',
} as const;

/**
 * The FAQ answers below are rendered as visible on-page content on the landing
 * page. Google's structured-data policy requires the JSON-LD to match content a
 * user can actually see — do not add FAQ entries here unless the same Q&A is
 * rendered in `components/LandingPage.tsx`.
 */
export const FAQ_SCHEMA = {
  '@type': 'FAQPage',
  '@id': `${SITE_URL}/#faq`,
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is lead reactivation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Lead reactivation is contacting old, unresponsive leads who previously requested a quote or estimate but never converted. These contacts are already in your CRM, already know your business, and cost nothing to reach — unlike buying new leads.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does Devobi reactivate dormant leads?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We export your dormant leads, use AI to write a personalized follow-up to each one referencing their original quote or inquiry, verify and sort the replies we get back, and book qualified jobs directly onto your calendar.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which CRM platforms does Devobi work with?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Devobi integrates with ServiceTitan, Housecall Pro, Jobber, FieldEdge, Service Fusion, HubSpot, and Salesforce, among others. We work with your existing CRM, so there is nothing to migrate.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Devobi cost anything to get started?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The first 14 days are a free pilot. Hand us your 500 coldest leads and if you do not get at least 3 qualified responses, you pay nothing. There are no contracts and no setup fees.',
      },
    },
    {
      '@type': 'Question',
      name: 'Who owns the leads that Devobi reactivates?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You keep every lead we reactivate. The contacts already belong to your business and remain in your CRM.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which trades does Devobi work with?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Devobi serves home service contractors, with dedicated playbooks for roofers, HVAC companies, solar installers, and plumbers.',
      },
    },
  ],
} as const;

export const SERVICES_SCHEMA = {
  '@type': 'ItemList',
  '@id': `${SITE_URL}/#services`,
  name: 'Devobi lead reactivation workflow',
  itemListElement: [
    {
      '@type': 'Service',
      position: 1,
      name: 'AI Lead Reactivation',
      serviceType: 'AI Lead Reactivation',
      description:
        'AI writes personalized follow-ups to dormant leads in your CRM and books qualified estimates onto your calendar.',
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: { '@type': 'Country', name: 'United States' },
    },
    {
      '@type': 'Service',
      position: 2,
      name: 'Home Services CRM Automation',
      serviceType: 'CRM Integration',
      description:
        'Connects to ServiceTitan, Housecall Pro, Jobber, FieldEdge, Service Fusion, HubSpot, and Salesforce so nothing has to be migrated.',
      provider: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'Service',
      position: 3,
      name: 'AI Lead Follow-Up & Qualification',
      serviceType: 'Lead Follow-Up',
      description:
        'AI-written outbound messages that read and sort inbound replies so you know instantly which old leads are worth calling back.',
      provider: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'Service',
      position: 4,
      name: 'Appointment Booking Automation',
      serviceType: 'Scheduling',
      description:
        'Qualified replies are converted into booked estimates directly on your calendar with no manual back-and-forth.',
      provider: { '@id': `${SITE_URL}/#organization` },
    },
  ],
} as const;

/** Free 14-day pilot offer, surfaced for commercial-query rich results. */
export const OFFER_SCHEMA = {
  '@type': 'Offer',
  '@id': `${SITE_URL}/#free-pilot-offer`,
  name: 'Free 14-Day Lead Reactivation Pilot',
  description:
    'Hand us your 500 coldest leads. Get at least 3 qualified responses in 14 days or pay nothing. No contracts, no setup fees.',
  price: '0',
  priceCurrency: 'USD',
  availability: 'https://schema.org/LimitedAvailability',
  eligibleRegion: { '@type': 'Country', name: 'United States' },
  seller: { '@id': `${SITE_URL}/#organization` },
} as const;

export const PLUMBER_SCHEMA = {
  '@type': 'Service',
  '@id': `${SITE_URL}/for-plumbers#service`,
  name: 'AI Lead Reactivation for Plumbers',
  serviceType: 'Plumbing Lead Reactivation',
  description:
    'Reactivate old plumbing leads and booked-but-lost service calls. Personalized SMS and email follow-ups convert dormant CRM contacts into booked jobs on your calendar.',
  provider: { '@id': `${SITE_URL}/#organization` },
  areaServed: { '@type': 'Country', name: 'United States' },
} as const;

/** Wraps the whole graph so entities can reference each other via @id. */
export function buildGraph(extra: object[] = []) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      ORGANIZATION_SCHEMA,
      WEBSITE_SCHEMA,
      SERVICES_SCHEMA,
      OFFER_SCHEMA,
      ...extra,
    ],
  };
}