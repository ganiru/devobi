/**
 * Builds the <head> metadata block for a route.
 *
 * Deliberately plain string templating (no React/DOM) so the exact same code runs
 * in the Vite prerender step and inside the Express server. That guarantees the
 * prerendered HTML and the runtime-injected HTML never drift apart.
 */

import { absoluteUrl, getSeoForPath, isNoindexPath, SITE_URL, type SeoMeta } from './routes';

const DEFAULT_META: SeoMeta = {
  path: '/',
  title: 'Devobi — AI Lead Reactivation for Home Services',
  description:
    'Devobi reactivates dormant leads for roofers, HVAC pros, and solar installers — turning old CRM contacts into booked estimates automatically.',
};

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Strips tags/newlines so JSON-LD stays valid inside a <script> block. */
function safeJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export interface RenderHeadOptions {
  pathname: string;
  /**
   * The single JSON-LD graph object for this route, as returned by
   * `getJsonLdForPath`. Do NOT spread this into an array — Google's Rich
   * Results Test rejects an array payload.
   */
  graph?: object;
}

/**
 * Returns the full set of <title>/<meta>/<link>/JSON-LD tags for a route.
 * Unknown paths fall back to root metadata but are marked noindex so that
 * soft-404s can never be indexed.
 */
export function renderHead({ pathname, graph }: RenderHeadOptions): string {
  const known = getSeoForPath(pathname);
  const meta = known ?? { ...DEFAULT_META, path: pathname };
  const noindex = !known || isNoindexPath(pathname);

  const canonical = absoluteUrl(meta.path === '/' ? '/' : meta.path);
  const image = absoluteUrl(meta.image ?? '/images/og-default.png');
  const robots = noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large';
  const ogType = meta.ogType ?? 'website';

  const tags: string[] = [];

  tags.push(`<title>${escapeAttr(meta.title)}</title>`);
  tags.push(`<meta name="description" content="${escapeAttr(meta.description)}">`);
  tags.push(`<meta name="robots" content="${robots}">`);
  tags.push(`<link rel="canonical" href="${escapeAttr(canonical)}">`);

  // Open Graph
  tags.push(`<meta property="og:type" content="${ogType}">`);
  tags.push(`<meta property="og:site_name" content="Devobi">`);
  tags.push(`<meta property="og:locale" content="en_US">`);
  tags.push(`<meta property="og:url" content="${escapeAttr(canonical)}">`);
  tags.push(`<meta property="og:title" content="${escapeAttr(meta.title)}">`);
  tags.push(`<meta property="og:description" content="${escapeAttr(meta.description)}">`);
  tags.push(`<meta property="og:image" content="${escapeAttr(image)}">`);
  tags.push(`<meta property="og:image:width" content="1200">`);
  tags.push(`<meta property="og:image:height" content="630">`);
  tags.push(`<meta property="og:image:alt" content="Devobi — AI lead reactivation for home services">`);

  // Twitter
  tags.push(`<meta name="twitter:card" content="summary_large_image">`);
  tags.push(`<meta name="twitter:site" content="@devobi">`);
  tags.push(`<meta name="twitter:url" content="${escapeAttr(canonical)}">`);
  tags.push(`<meta name="twitter:title" content="${escapeAttr(meta.title)}">`);
  tags.push(`<meta name="twitter:description" content="${escapeAttr(meta.description)}">`);
  tags.push(`<meta name="twitter:image" content="${escapeAttr(image)}">`);

  // Structured data — exactly ONE script tag containing ONE JSON object.
  // (An array payload here parses fine but is rejected by rich-results tools.)
  if (graph) {
    tags.push(`<script type="application/ld+json">${safeJson(graph)}</script>`);
  }

  return tags.join('\n    ');
}

export { SITE_URL };