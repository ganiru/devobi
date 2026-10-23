/**
 * Node module-customisation hook for the prerender step.
 *
 * Two responsibilities:
 *  1. `.css` imports become a no-op (Node cannot parse CSS).
 *  2. `.txt` imports behave like Vite's `?raw` — the file contents are
 *     returned as the default export (used for the single system prompt).
 *
 * The `medspa/` and `plumber/` sub-apps import their stylesheets at module
 * scope, and the main app imports `prompts/system-prompt.txt?raw`. Node cannot
 * parse either natively, so during prerendering every `.css` specifier is
 * redirected to the stub below, and every `.txt` specifier is loaded eagerly
 * as plain text.
 *
 * Styles still reach the browser normally — Vite extracts them into the built
 * CSS bundle that index.html links to.
 */

import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const STUB = 'data:text/javascript,export default {}';

export async function resolve(specifier, context, nextResolve) {
  if (/\.txt(\?.*)?$/.test(specifier)) {
    // Drop the ?raw query — the browser build keeps it, but the file URL
    // must be plain for readFileSync to hit the right path.
    const clean = specifier.replace(/\?.*$/, '');
    const base = context.parentURL || pathToFileURL(process.cwd() + '/').href;
    const resolved = new URL(clean, base).href;
    return { url: resolved, shortCircuit: true, format: 'module' };
  }
  if (/\.css(\?.*)?$/.test(specifier)) {
    return { url: STUB, shortCircuit: true, format: 'module' };
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (/\.txt$/.test(url)) {
    return { format: 'module', shortCircuit: true, source: `export default ${JSON.stringify(readFileSync(new URL(url), 'utf-8'))};` };
  }
  if (url === STUB) {
    return { format: 'module', shortCircuit: true, source: 'export default {};' };
  }
  return nextLoad(url, context);
}