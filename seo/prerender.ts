/**
 * Pre-renders every indexable route to a static HTML file inside dist/.
 *
 * WHY THIS EXISTS
 * ---------------
 * The site is a client-rendered React SPA. Google executes JavaScript and will
 * index it, but most AI answer engines (ChatGPT Search, Perplexity, Claude,
 * Bing Copilot) do NOT reliably execute JS — they would otherwise receive an
 * empty <div id="root"></div>.
 *
 * Emitting real HTML per route means crawlers and answer engines receive the
 * actual copy, plus correct per-route <title>/description/canonical and JSON-LD.
 *
 * RUN
 * ---
 * Called automatically at the end of `vite build` via the vite.config.ts plugin.
 */

import fs from 'node:fs/promises';
import path from 'node:path';

import { renderHead } from './head';
import { getJsonLdForPath } from './jsonld';
import { SEO_ROUTES, NOINDEX_ROUTES, absoluteUrl } from './routes';

/**
 * Strips the tags that are rebuilt per-route so we never ship duplicates:
 *  - the hardcoded <title>/description/canonical/og/twitter block
 *  - the <meta http-equiv="Content-Security-Policy"> (a <meta> CSP does nothing;
 *    real CSP headers are set by server.ts — see SECURITY_HEADERS there)
 *  - the esm.sh importmap (app is bundled; nothing is resolved from a CDN at runtime)
 */
function cleanTemplate(html: string): string {
  let out = html;

  // Remove the whole <head> SEO block that Vite copies from index.html.
  out = out.replace(/<title>[\s\S]*?<\/title>\s*/gi, '');
  out = out.replace(/<meta\s+name="description"[^>]*>\s*/gi, '');
  out = out.replace(/<meta\s+name="keywords"[^>]*>\s*/gi, '');
  out = out.replace(/<meta\s+name="author"[^>]*>\s*/gi, '');
  out = out.replace(/<meta\s+name="robots"[^>]*>\s*/gi, '');
  out = out.replace(/<link\s+rel="canonical"[^>]*>\s*/gi, '');
  out = out.replace(/<meta\s+property="og:[^"]*"[^>]*>\s*/gi, '');
  out = out.replace(/<meta\s+(?:name|property)="twitter:[^"]*"[^>]*>\s*/gi, '');
  out = out.replace(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi, '');

  // Meta CSP is non-functional and misleading — real headers live in server.ts.
  out = out.replace(/<meta\s+http-equiv="Content-Security-Policy"[\s\S]*?>\s*/gi, '');

  // No longer needed: React etc. are bundled, not fetched from a CDN.
  out = out.replace(/<script\s+type="importmap">[\s\S]*?<\/script>\s*/gi, '');

  return out;
}

/** Renders the per-route <head> block and splices it into <head>. */
function injectHead(template: string, pathname: string): string {
  const tags = renderHead({ pathname, graph: getJsonLdForPath(pathname) });
  return template.replace('</head>', `    ${tags}\n</head>`);
}

/** Injects a crawl hint for AI answer engines at the top of <body>. */
function injectBotHints(template: string, pathname: string): string {
  const canonical = absoluteUrl(pathname === '/' ? '/' : pathname);
  return template.replace(
    '<body>',
    `<body>\n    <script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${canonical}#webpage`,
      url: canonical,
      name: pathname,
      isPartOf: { '@id': 'https://devobi.com/#website' },
      about: { '@id': 'https://devobi.com/#organization' },
    }).replace(/</g, '\\u003c')}</script>`,
  );
}

function fileNameFor(pathname: string): { file: string; dir: string } {
  if (pathname === '/') {
    return { file: 'index.html', dir: '.' };
  }
  const clean = pathname.replace(/^\//, '').replace(/\/+$/, '');
  return { file: path.join(clean, 'index.html'), dir: clean };
}

export async function prerender(outDir: string): Promise<string[]> {
  const templatePath = path.join(outDir, 'index.html');
  const rawTemplate = await fs.readFile(templatePath, 'utf8');
  const template = cleanTemplate(rawTemplate);

  // Loaded lazily: this pulls in React + the whole component tree.
  const { renderBody } = await import('./ssr.js');

  const written: string[] = [];

  /** Builds the full document for a path: shell + SSR body + route head. */
  const build = (pathname: string, withBody: boolean): string => {
    let html = injectHead(template, pathname);
    html = injectBotHints(html, pathname);
    if (withBody) {
      const markup = renderBody(pathname);
      html = html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
    }
    return html;
  };

  const write = async (file: string, contents: string) => {
    const dest = path.join(outDir, file);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, contents, 'utf8');
    written.push(file);
  };

  // 1) Indexable routes get a fully rendered document (real copy in the HTML).
  for (const route of SEO_ROUTES) {
    const { file } = fileNameFor(route.path);
    await write(file, build(route.path, true));
  }

  // 2) noindex funnel routes are rendered too, but carry noindex,nofollow.
  for (const route of NOINDEX_ROUTES) {
    const { file } = fileNameFor(route);
    await write(file, build(route, true));
  }

  // 3) A real 404 document. Rendered with the not-found path so it is
  //    noindex and self-canonical.
  await write('404.html', build('/404', true));

  return written;
}