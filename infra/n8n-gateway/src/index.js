/**
 * n8n webhook gateway.
 *
 * The only public way to reach the lead webhook. It sits on a dedicated host
 * (for example hooks.devobi.com) and:
 *
 *   - serves exactly one path, so scanners walking /webhook/* find nothing
 *   - rejects everything that is not a POST of a multipart form
 *   - rate limits per client IP before reading the body
 *   - requires our shared secret, so knowing the URL is not enough
 *   - forwards with n8n's own header-auth value and never reflects it back
 *
 * The site server (`POST /api/reactivate`) is the only intended caller. It
 * holds GATEWAY_TOKEN; this Worker holds N8N_HEADER_VALUE. Rotating one does not
 * require redeploying the other.
 */

const DEFAULT_MAX_BODY_BYTES = 3 * 1024 * 1024; // CSV cap is 2 MiB + multipart overhead
const UPSTREAM_TIMEOUT_MS = 25000;

function json(status, body, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...headers,
    },
  });
}

/** Length-independent comparison, so a wrong token leaks no timing signal. */
function constantTimeEqual(a, b) {
  const left = new TextEncoder().encode(a);
  const right = new TextEncoder().encode(b);
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let i = 0; i < left.length; i += 1) difference |= left[i] ^ right[i];
  return difference === 0;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const allowedPath = env.WEBHOOK_PATH;

    // Nothing but the one live hook path exists on this host.
    if (!allowedPath || url.pathname !== allowedPath) {
      return json(404, { error: 'not_found' });
    }

    if (request.method !== 'POST') {
      return json(405, { error: 'method_not_allowed' }, { allow: 'POST' });
    }

    const maxBodyBytes = Number(env.MAX_BODY_BYTES) || DEFAULT_MAX_BODY_BYTES;
    const declaredLength = Number(request.headers.get('content-length') || 0);
    if (Number.isFinite(declaredLength) && declaredLength > maxBodyBytes) {
      return json(413, { error: 'too_large' });
    }

    const clientIp = request.headers.get('cf-connecting-ip') || 'unknown';

    // Per-IP, per-path bucket. Approximate by design (per Cloudflare location),
    // which is why the WAF rule in infra/README.md is layered on top.
    const { success } = await env.WEBHOOK_RATE_LIMITER.limit({ key: allowedPath + ':' + clientIp });
    if (!success) {
      return json(429, { error: 'rate_limited' }, { 'retry-after': '60' });
    }

    const presented = request.headers.get('x-devobi-key') || '';
    if (!env.GATEWAY_TOKEN || !constantTimeEqual(presented, env.GATEWAY_TOKEN)) {
      return json(401, { error: 'unauthorized' });
    }

    const contentType = request.headers.get('content-type') || '';
    if (!contentType.toLowerCase().startsWith('multipart/form-data')) {
      return json(415, { error: 'unsupported_media_type' });
    }

    if (!env.N8N_ORIGIN || !env.N8N_HEADER_VALUE) {
      return json(503, { error: 'gateway_not_configured' });
    }

    const upstreamUrl = new URL(allowedPath, env.N8N_ORIGIN);
    const upstreamHeaders = new Headers();
    upstreamHeaders.set('content-type', contentType);
    // Replace our caller secret with n8n's header-auth credential.
    upstreamHeaders.set('x-devobi-key', env.N8N_HEADER_VALUE);
    upstreamHeaders.set('x-forwarded-for', clientIp);

    const requestId = request.headers.get('x-request-id');
    if (requestId) upstreamHeaders.set('x-request-id', requestId.slice(0, 64));

    let upstream;
    try {
      upstream = await fetch(upstreamUrl.toString(), {
        method: 'POST',
        headers: upstreamHeaders,
        body: request.body,
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      });
    } catch (error) {
      console.error('n8n upstream request failed', {
        requestId,
        message: error instanceof Error ? error.message : String(error),
      });
      return json(502, { error: 'upstream_unreachable' });
    }

    const responseHeaders = new Headers({ 'cache-control': 'no-store' });
    const upstreamType = upstream.headers.get('content-type');
    if (upstreamType) responseHeaders.set('content-type', upstreamType);

    // Pass the status through: the site server maps 400/413/429/5xx itself.
    return new Response(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  },
};
