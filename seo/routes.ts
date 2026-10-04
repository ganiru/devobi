/**
 * Single source of truth for SEO metadata.
 *
 * Used by:
 *  - `seo/prerender.ts`  -> static head tags injected into each prerendered HTML file
 *  - `server.ts`          -> per-request head injection for non-prerendered routes
 *  - `scripts/generate-sitemap.ts` -> sitemap.xml
 *
 * Keeping this framework-agnostic (plain data, no React) means it can be imported
 * from the Vite config, the Express server, and build scripts without pulling in
 * the component tree.
 */

export const SITE_URL = 'https://devobi.com';

export interface SeoMeta {
  /** URL path. Must start with '/' and have no trailing slash (except the root). */
  path: string;
  title: string;
  description: string;
  /** Absolute or root-relative image path used for og:image / twitter:image. */
  image?: string;
  /** 'website' for marketing pages, 'article' for long-form content. */
  ogType?: 'website' | 'article';
  /** Hide thin/duplicate utility routes from search engines. */
  noindex?: boolean;
  /** Extra JSON-LD blocks appended to the page's structured data graph. */
  jsonLd?: object[];
  /** sitemap <lastmod> (ISO date, YYYY-MM-DD). */
  lastmod?: string;
  changefreq?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority?: number;
}

/**
 * Routes that should be indexed and appear in sitemap.xml.
 * `noindex: true` routes are intentionally excluded from the sitemap.
 */
export const SEO_ROUTES: SeoMeta[] = [
  {
    path: '/',
    title: 'Devobi — AI Lead Reactivation for Roofers, HVAC & Solar',
    description:
      'Devobi reactivates the dormant leads already in your CRM. Our AI writes personalized follow-ups to old quotes and cold inquiries and books estimates onto your calendar — no new ad spend.',
    image: '/images/og-default.png',
    priority: 1.0,
    changefreq: 'weekly',
    lastmod: '2026-10-03',
  },
  {
    path: '/for-plumbers',
    title: 'AI Lead Reactivation for Plumbers | Devobi',
    description:
      'Reactivate old plumbing leads and booked-but-lost jobs. Devobi sends personalized text and email follow-ups to your dormant CRM contacts and books service calls on your calendar automatically.',
    image: '/images/og-default.png',
    priority: 0.9,
    changefreq: 'weekly',
    lastmod: '2026-10-03',
  },
  {
    path: '/free-pilot',
    title: 'Free 14-Day Lead Reactivation Pilot | Devobi',
    description:
      'Hand us your 500 coldest leads. Get at least 3 qualified responses in 14 days or pay nothing. No contracts, no setup fees, and you keep every lead we reactivate.',
    image: '/images/og-default.png',
    priority: 0.8,
    changefreq: 'monthly',
    lastmod: '2026-10-03',
  },
  {
    path: '/privacy',
    title: 'Privacy Policy | Devobi',
    description:
      'How Devobi LLC collects, uses, and protects personal information submitted through this website, including form data, analytics, and SMS consent.',
    image: '/images/og-default.png',
    priority: 0.2,
    changefreq: 'yearly',
    lastmod: '2026-10-03',
  },
];

/**
 * Utility / funnel routes. These are rendered for real users converting through
 * funnels, but they are thin duplicates of the landing page, so we keep them out
 * of the index and out of the sitemap.
 */
export const NOINDEX_ROUTES = [
  '/workflow-audit',
  '/demo-lead-form',
  '/founding',
  '/opt-in',
  '/sendmail',
  '/reactivate',
  '/demovideo',
];

const metaByPath = new Map<string, SeoMeta>(SEO_ROUTES.map(r => [r.path, r]));

export function getSeoForPath(pathname: string): SeoMeta | undefined {
  // Normalise: strip trailing slash (except root) so /privacy/ === /privacy
  const normalised =
    pathname.length > 1 && pathname.endsWith('/') ? pathname.replace(/\/+$/, '') : pathname;
  return metaByPath.get(normalised);
}

export function isNoindexPath(pathname: string): boolean {
  const normalised =
    pathname.length > 1 && pathname.endsWith('/') ? pathname.replace(/\/+$/, '') : pathname;
  return NOINDEX_ROUTES.includes(normalised);
}

/** Absolute URL helper — canonical and og:url must always be absolute. */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

/** Primary routes for llms.txt — ordered by importance. */
export const LLM_ROUTES = SEO_ROUTES.filter(r => r.priority !== undefined && r.priority >= 0.8);