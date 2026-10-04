/**
 * Resolves which JSON-LD blocks belong on a given route.
 *
 * Centralising this keeps `server.ts` and the prerender script consistent, and
 * makes it obvious which pages carry which schema.
 */

import { FAQ_SCHEMA, PLUMBER_SCHEMA, buildGraph } from './schema';

/**
 * Returns the JSON-LD graph for a path as a SINGLE object.
 *
 * Returns one object (not an array) because Google's Rich Results Test rejects
 * an array payload inside a single `application/ld+json` script tag.
 *
 * The @graph is emitted per page so that every page referencing `#organization`
 * and `#website` has those entities declared in the same document.
 */
export function getJsonLdForPath(pathname: string): object {
  const normalised =
    pathname.length > 1 && pathname.endsWith('/') ? pathname.replace(/\/+$/, '') : pathname;

  const extra: object[] = [];

  // The FAQ schema must mirror the visible FAQ section on the landing page.
  // Keep these two in sync — see FAQ_ITEMS in components/LandingPage.tsx.
  if (normalised === '/') {
    extra.push(FAQ_SCHEMA);
  }

  if (normalised === '/for-plumbers') {
    extra.push(PLUMBER_SCHEMA);
  }

  return buildGraph(extra);
}