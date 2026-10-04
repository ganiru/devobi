# SEO & AEO Architecture

How this site stays crawlable, indexable, and legible to AI answer engines.

## The problem this solves

This is a React SPA. Historically the served HTML was just:

```html
<div id="root"></div>
```

Google renders JavaScript, so it could index the site — but **most AI answer
engines do not execute JS**. ChatGPT Search, Perplexity, Claude, Bing Copilot
and Google AI Overviews would receive an empty page. Three further bugs made it
worse: `robots.txt`/`sitemap.xml` were never served, every route declared the
homepage canonical, and every unknown URL returned HTTP 200 with the homepage.

## How it works now

```
vite build
  └─ dist/                      client bundle + public/ (robots, sitemap, llms.txt, images)
  └─ closeBundle
       └─ scripts/prerender.ts  (spawned by the devobi-prerender plugin)
            ├─ reads dist/index.html as a shell
            ├─ seo/head.ts        -> per-route <title>, description, canonical, OG, Twitter
            ├─ seo/jsonld.ts      -> per-route JSON-LD @graph
            ├─ seo/ssr.tsx        -> renders the real React tree to HTML
            └─ writes dist/<route>/index.html  + dist/404.html

server.ts (production)
  ├─ helmet                    real CSP + security headers
  ├─ compression               gzip/brotli
  ├─ express.static           assets, no directory redirects
  ├─ sendRoute                 prerendered file per route; 404 for anything else
  └─ 404 handler               honest 404, never a soft-404
```

### Key files

| File | Purpose |
|---|---|
| `seo/routes.ts` | **Single source of truth.** Every route's path, title, description, image, robots policy, sitemap priority. Edit here, not in `index.html`. |
| `seo/schema.ts` | `Organization`, `WebSite`, `Service`, `Offer`, `FAQPage` schema. |
| `seo/head.ts` | Renders head tags for a path. Plain string templating so build and runtime share it. |
| `seo/jsonld.ts` | Chooses which schema blocks a route gets. Returns one object, never an array. |
| `seo/ssr.tsx` | Build-time React render (`StaticRouter` + `renderToString`). |
| `seo/prerender.ts` | Cleans the shell and writes one HTML file per route. |
| `scripts/prerender.ts` | CLI wrapper for the above. `npm run prerender`. |
| `scripts/css-stub-loader.mjs` | Lets Node import `.css` during SSR. |

## Rules for contributors

1. **Never hardcode SEO tags in `index.html`.** They are generated per route.
   A single hardcoded `<title>`/`<link rel="canonical">` previously de-indexed
   every route on the site.
2. **To add a page**, add a `SeoMeta` entry to `SEO_ROUTES` in `seo/routes.ts`,
   then add a `<Route>` in `App.tsx`, then rebuild. The prerenderer will pick it
   up automatically.
3. **Keep FAQ schema and FAQ content in sync.** Google penalises structured
   data that does not match visible content. The Q&A in `seo/schema.ts`
   (`FAQ_SCHEMA`) must match `FAQ_ITEMS` in `components/LandingPage.tsx`. There
   is a check for this in the verification steps below.
4. **Static files belong in `public/`.** Vite only copies `public/` into `dist/`.
   A `robots.txt` at the project root is silently dropped, and the SPA fallback
   then serves it as HTML — which can make Google stop crawling the site.
5. **Utility/funnel routes** go in `NOINDEX_ROUTES` (or omit them from the
   sitemap) so thin duplicates do not compete with the landing pages.
6. **CSP is a response header, not a `<meta>` tag.** Change it in `server.ts`.
   A `<meta http-equiv="Content-Security-Policy">` is ignored by browsers.

## Verifying after a change

```bash
npm run build
npm run start          # then, on another shell:
curl -sI localhost:3001/robots.txt          # expect: text/plain, not text/html
curl -s -o /dev/null -w '%{http_code}\n' localhost:3001/nope   # expect: 404
curl -s localhost:3001/ | grep -c '<details' # expect: 6 (FAQ present in HTML, no JS)
```

FAQ schema/content parity check:

```bash
node -e "
const fs=require('fs');
const html=fs.readFileSync('dist/index.html','utf8');
const g=JSON.parse([...html.matchAll(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/g)][0][1]);
const faq=g['@graph'].find(x=>x['@type']==='FAQPage');
const text=html.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ');
const bad=faq.mainEntity.filter(q=>!text.includes(q.name)||!text.includes(q.acceptedAnswer.text));
console.log(bad.length?('MISMATCH: '+bad.map(q=>q.name).join(', ')):'all '+faq.mainEntity.length+' FAQ entries match');
"
```

## Not yet done (optional follow-ups)

- Bundle is ~630 kB (186 kB gzipped) because `@google/genai` and the two demo
  sub-apps are in the main chunk. Route-level `React.lazy` would improve LCP.
- The `plumber/` and `medspa/` demo apps are prerendered as well but are not in
  the sitemap; give them their own metadata if they should rank.
- No `BreadcrumbList` schema; not needed at this site depth.

## Open Graph image

`public/images/og-default.png` is 1200x630, matching the `og:image:width/height`
tags in `seo/head.ts`. Regenerate it with:

```bash
./scripts/og/generate.sh          # or: CHROME=/path/to/chrome ./scripts/og/generate.sh
```

The template and its source image live in `scripts/og/` — **not** `public/` — so
they are never published as part of the site.