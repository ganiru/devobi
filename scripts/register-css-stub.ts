/**
 * Registers a no-op loader for `.css` imports so the component tree can be
 * rendered by Node during prerendering.
 *
 * Vite handles CSS in the browser build; on the server side the styles are
 * irrelevant to the HTML we emit (the built CSS file is linked separately), so
 * every stylesheet resolves to an empty module.
 */

import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register(new URL('./css-stub-loader.mjs', import.meta.url).href);