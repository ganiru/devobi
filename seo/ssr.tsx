/**
 * Build-time server entry used by the prerenderer.
 *
 * Renders the REAL React tree to an HTML string so crawlers that do not execute
 * JavaScript (ChatGPT Search, Perplexity, Claude, Bing Copilot) receive the
 * actual page copy rather than an empty <div id="root">.
 *
 * This module must stay free of browser-only APIs at module scope.
 */

import React from 'react';
import { renderToString } from 'react-dom/server';
// react-router v7 removed the `react-router-dom/server` subpath; StaticRouter is
// re-exported from the package root.
import { StaticRouter } from 'react-router-dom';

import App from '../App';

/** Renders the full document body markup for a given path. */
export function renderBody(pathname: string): string {
  return renderToString(
    <React.StrictMode>
      <StaticRouter location={pathname}>
        <App />
      </StaticRouter>
    </React.StrictMode>,
  );
}