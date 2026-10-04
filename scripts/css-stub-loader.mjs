/**
 * Node module-customisation hook that makes `.css` imports a no-op.
 *
 * The `medspa/` and `plumber/` sub-apps import their stylesheets at module
 * scope. Node cannot parse CSS, so during prerendering every `.css` specifier
 * is redirected to this stub, which resolves to an empty module.
 *
 * Styles still reach the browser normally — Vite extracts them into the built
 * CSS bundle that index.html links to.
 */

const STUB = 'data:text/javascript,export default {}';

export async function resolve(specifier, context, nextResolve) {
  if (/\.css(\?.*)?$/.test(specifier)) {
    return { url: STUB, shortCircuit: true, format: 'module' };
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url === STUB) {
    return { format: 'module', shortCircuit: true, source: 'export default {};' };
  }
  return nextLoad(url, context);
}