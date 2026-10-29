/**
 * Registry of the voice agents offered on /voicedemo.
 *
 * This is the single source of truth. It is consumed by:
 *   - components/VoiceDemo.tsx  -> the assistant picker + the Vapi widget
 *   - seo/routes.ts             -> one prerendered, noindex deep link per agent
 *
 * ADDING A NEW AGENT: append an entry below. It immediately gets a picker
 * option, a deep link at /voicedemo/<slug>, and a prerendered document — no
 * other file needs editing (give it an icon in VoiceDemo's ASSISTANT_ICONS map
 * if you want something other than the default).
 *
 * Must stay framework-agnostic (plain data, no React, no DOM APIs): it is
 * imported by the Vite prerender step and by Express, neither of which has a
 * browser.
 */

export interface VoiceAgent {
  /** Stable key for React state and icon lookup. */
  key: string;
  /**
   * Exact URL segment for the shareable deep link: /voicedemo/<slug>.
   * Prerendered verbatim at build time, so keep it URL-safe, lowercase, and
   * free of punctuation (no hyphens/spaces) — it is matched literally, and a
   * variant spelling would simply 404.
   */
  slug: string;
  /** Human-readable name shown in the picker and page copy. */
  label: string;
  /** Vapi assistant id. */
  assistantId: string;
}

export const VOICE_AGENTS: VoiceAgent[] = [
  {
    key: 'roofer',
    slug: 'roofer',
    label: 'Roofer',
    assistantId: '24e1a125-04d5-4119-99cd-0ae57d1b4bfa',
  },
  {
    key: 'plumber',
    slug: 'plumber',
    label: 'Plumber',
    assistantId: '66b958f3-ff8d-4e32-a19b-76f5c386c0dc',
  },
  {
    key: 'medspa',
    slug: 'medspa',
    label: 'Medspa',
    assistantId: 'fb299f76-4aee-4415-8bc2-60a4a8d93883',
  },
  {
    key: 'african-market',
    slug: 'africanmarket',
    label: 'African Market',
    assistantId: 'd55a320f-d9f3-46fb-b754-f0e18d5ed6fe',
  },
  {
    key: 'kidz-playon',
    slug: 'kidzplayon',
    label: 'Kidz Playon',
    assistantId: '37d4abc2-c384-4c83-920e-06cbf496481d',
  },
];

/** Agent shown on /voicedemo when no slug is in the URL. */
export const DEFAULT_VOICE_AGENT_KEY = VOICE_AGENTS[0].key;

export function getVoiceAgentByKey(key: string | undefined): VoiceAgent | undefined {
  if (!key) return undefined;
  return VOICE_AGENTS.find((agent) => agent.key === key);
}

/**
 * Resolves a /voicedemo/<slug> URL segment, or undefined when unrecognised.
 *
 * Matched literally against `slug`: the same string is prerendered as a file,
 * so anything looser would resolve in the SPA but 404 on a hard load.
 */
export function getVoiceAgentBySlug(slug: string | undefined): VoiceAgent | undefined {
  if (!slug) return undefined;
  return VOICE_AGENTS.find((agent) => agent.slug === slug);
}

/** Canonical deep-link path for an agent, e.g. /voicedemo/plumber. */
export function voiceDemoPath(agent: VoiceAgent): string {
  return `/voicedemo/${agent.slug}`;
}
