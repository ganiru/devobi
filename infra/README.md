# Hardening the n8n lead webhook

The flood was not a workflow bug. `/reactivate` posted the CSV **straight to the
public n8n webhook**, and the only credential was an `x-devobi-key` header that
`vite define` baked into the public JavaScript bundle. The webhook URL and its
"secret" are both in `dist/assets/*.js` of any deployed build, so bots (and
anyone who reads the bundle) could POST an empty body at any rate. n8n then ran
the workflow with no file, failed, and alerted on every attempt.

After this change there are four layers:

```
browser
  └─ POST /api/reactivate            (devobi.com server: Turnstile + file validation)
       └─ POST https://hooks.devobi.com/webhook/<rotated>   (Cloudflare Worker: rate limit + shared secret)
            └─ POST https://<n8n>/webhook/<rotated>         (header auth)
                 └─ Validate & Sanitise CSV → 400 silent | 202 accepted
                      └─ pipeline        (Telegram only for real failures, hourly summary otherwise)
```

Each layer holds a different secret, and none of them are in the browser.

---

## 1. Rotate the webhook and require header auth

1. In n8n, open the reactivation workflow.
2. Delete the old Webhook node (path `b6aeb04b-…`). Deleting it is what actually
   retires the old URL — an inactive workflow's production URL answers again the
   moment the workflow is reactivated.
3. Import `infra/n8n/reactivate-intake-guards.json`.
4. On **Lead CSV Webhook**, pick (or create) a **Header Auth** credential:
   - Name: `x-devobi-key`
   - Value: a new random string (32+ chars), e.g. `openssl rand -hex 32`
5. Replace `REPLACE_WITH_TELEGRAM_CHAT_ID` on both Telegram nodes and select
   your Telegram credential.
6. Connect your existing pipeline's first node after **Handoff to existing
   pipeline** (the sanitised CSV arrives as the `csv_file` binary field and the
   agent fields as JSON). If you would rather not adopt the whole workflow, copy
   these five nodes into your current workflow instead: `Validate & Sanitise
   CSV`, `Invalid input?`, `Record Rejected`, `Respond 400 (silent)`,
   `Record Accepted`, `Respond 202`.
7. Activate the workflow.

What the guards do:

| Input | Response | Telegram |
| --- | --- | --- |
| No file / not multipart / wrong MIME | 400 `missing_csv` / silent | none |
| Binary file renamed `.csv` (magic bytes) | 400 `binary_content` | none |
| > 2 MiB, > 5,000 rows, > 64 columns | 400 / 413 silent | none |
| Not valid UTF-8, no header, no data rows | 400 silent | none |
| Valid CSV | 202 accepted | none |
| Genuine pipeline failure | — | immediate, throttled to one per 15 min |
| Anything else that happened | — | one hourly summary |

Invalid attempts are counted per reason and reported in the hourly summary, so
you can still see the noise without being paged for it.

The summary counters use n8n workflow static data. That is fine for a single
instance; in queue mode with several workers each worker keeps its own counters.
If you move to queue mode, replace the counters with a Redis/Postgres write.

---

## 2. Put n8n behind Cloudflare

Pick one, not both:

**A. Cloudflare Tunnel (recommended — the origin has no public hostname).**

```bash
cloudflared tunnel create n8n
cloudflared tunnel route dns n8n n8n-internal.devobi.com
# config.yml
#   tunnel: n8n
#   ingress:
#     - hostname: n8n-internal.devobi.com
#       service: http://localhost:5678
#     - service: http_status:404
```

Then remove the public Railway domain for n8n, or leave it and treat
`n8n-internal.devobi.com` as the only path Cloudflare forwards.

**B. Proxied DNS in front of Railway.** Add `n8n.devobi.com` as a proxied CNAME
to the Railway hostname, then add a Cloudflare WAF rule that blocks direct
access to anything except `/webhook/`:

- Firewall rule: `(http.host eq "n8n.devobi.com" and not starts_with(http.request.uri.path, "/webhook/"))` → Block
- Rate limiting rule: `(http.host eq "n8n.devobi.com" and http.request.uri.path eq "/webhook/reactivate-2f9c41d7")`
  – requests: 10 per 1 minute, counting by IP
  – action: Block, mitigation timeout 60s

The WAF rule is the one that survives a Worker bug, so keep it even with option A
if the n8n hostname stays reachable.

---

## 3. Deploy the gateway Worker

```bash
cd infra/n8n-gateway
npx wrangler@latest secret put GATEWAY_TOKEN      # same value as N8N_WEBHOOK_SECRET on the site server
npx wrangler@latest secret put N8N_HEADER_VALUE   # same value as the n8n Header Auth credential
npx wrangler@latest deploy
```

Then in the Cloudflare dashboard add a custom domain for the Worker:
`hooks.devobi.com`. Point `N8N_ORIGIN` and `WEBHOOK_PATH` in `wrangler.jsonc` at
your n8n origin and the rotated path before deploying.

The Worker serves only that one path (404 for everything else), rejects non-POST
and non-multipart bodies, rate limits per IP with the Workers rate limiting
binding, and requires `x-devobi-key` to equal `GATEWAY_TOKEN` before it replaces
that header with n8n's `N8N_HEADER_VALUE` and forwards the request.

Rotating the path later means changing `WEBHOOK_PATH`, redeploying the Worker,
and updating `N8N_WEBHOOK_SECRET`'s URL — no site redeploy is needed for the
secret itself.

---

## 4. Turnstile and site server environment

Create a Turnstile widget in the Cloudflare dashboard (Managed mode, hostname
`devobi.com`). Then set:

**Runtime (Railway / server env):**

| Variable | Value |
| --- | --- |
| `N8N_REACTIVATE_WEBHOOK_URL` | `https://hooks.devobi.com/webhook/reactivate-2f9c41d7` |
| `N8N_WEBHOOK_SECRET` | the Worker's `GATEWAY_TOKEN` |
| `TURNSTILE_SECRET_KEY` | Turnstile secret key |

**Build-time (Vite, public by design):**

| Variable | Value |
| --- | --- |
| `TURNSTILE_SITE_KEY` | Turnstile sitekey |

`AUTH_HEADER` is no longer sent to the browser (it was removed from `vite
define`), but the current value shipped in public bundles and must be treated as
compromised — rotate it and the send-mail webhook's header auth with it.

The endpoint fails closed: with no `TURNSTILE_SECRET_KEY` it returns 503 rather
than accepting uploads, and with no n8n URL/secret it refuses to forward.

---

## 5. Verify

```bash
# bots get a 400 and nothing reaches n8n
curl -s -o /dev/null -w '%{http_code}\n' -X POST https://devobi.com/api/reactivate
curl -s -o /dev/null -w '%{http_code}\n' -X POST https://devobi.com/api/reactivate \
  -H 'content-type: application/json' -d '{}'

# the gateway refuses a caller without the shared secret
curl -s -o /dev/null -w '%{http_code}\n' -X POST \
  https://hooks.devobi.com/webhook/reactivate-2f9c41d7 -F 'csv_file=@leads.csv'

# and the old URL is gone
curl -s -o /dev/null -w '%{http_code}\n' -X POST \
  https://n8n-production-6955.up.railway.app/webhook/b6aeb04b-87ea-4711-a67e-e89e7ac5f293
```

Expected: `400`, `400`, `401`, and `404`.

A real upload through `/reactivate` should return `200` and produce exactly one
n8n execution.
