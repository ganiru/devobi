/**
 * Standalone prerender runner.
 *
 * Invoked by the `devobi-prerender` Vite plugin after the client bundle is
 * written (see vite.config.ts). Renders every indexable route to real HTML so
 * crawlers that do not execute JavaScript receive the actual page content.
 *
 * Usage: tsx scripts/prerender.ts [outDir]
 */

import path from 'node:path';

import '../scripts/register-css-stub.js';
import { prerender } from '../seo/prerender.js';

async function main() {
  const outDir = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.resolve(process.cwd(), 'dist');

  const written = await prerender(outDir);

  console.log(`\n  prerendered ${written.length} documents:`);
  for (const f of written) console.log(`    - ${path.relative(process.cwd(), path.join(outDir, f))}`);
}

main().catch((err) => {
  console.error('\n  prerender failed:', err);
  process.exit(1);
});