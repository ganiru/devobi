#!/usr/bin/env node
/**
 * scripts/n8n-throttle-error-handler.mjs
 *
 * Rate-limits the "Devobi Error Handler" workflow (4ik9h95ZN033jYUe) and makes
 * its alerts useful for troubleshooting:
 *
 *   Error Trigger -> Throttle Alerts -> Alert now?
 *        true  -> 📱 Telegram: AI email verify error  (alertText)
 *                 🚨 Alert: Error                     (alertHtml)
 *        false -> Alert suppressed (noOp)
 *
 * Throttle: same workflow+node+message alerts once per 15 minutes, max 5 distinct
 * alerts per hour (digits normalised, so changing IDs don't defeat the dedupe).
 *
 * Alert content: workflow name/id, failed node name/type, error message,
 * description, HTTP code, error level, execution id/mode/retryOf, timestamp,
 * execution link, the failed node's setting *names* (never values, which can
 * contain secrets), first lines of the stack, and how many alerts were suppressed.
 *
 * Usage:
 *   node scripts/n8n-throttle-error-handler.mjs           # dry run
 *   node scripts/n8n-throttle-error-handler.mjs --apply
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WF_ID = "4ik9h95ZN033jYUe";
const APPLY = process.argv.includes("--apply");
const BACKUP_DIR = join(ROOT, ".n8n-backups");

function credentials() {
  const out = {};
  const p = join(ROOT, ".env.local");
  if (existsSync(p)) {
    for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (m) out[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  }
  let base = out.N8N_BASE_URL || out.N8N_API_URL || "";
  let key = out.N8N_API_KEY || "";
  if (!base || !key) {
    const mcp = JSON.parse(readFileSync(join(homedir(), ".agents", "mcp.json"), "utf8"));
    const e = mcp?.mcpServers?.n8n?.env ?? {};
    base = base || e.N8N_API_URL || "";
    key = key || e.N8N_API_KEY || "";
  }
  if (!base || !key) throw new Error("Missing N8N_BASE_URL / N8N_API_KEY");
  return { base: base.replace(/\/+$/, ""), key };
}
const CREDS = credentials();
async function api(path, init = {}) {
  const res = await fetch(`${CREDS.base}/api/v1${path}`, {
    ...init,
    headers: { "X-N8N-API-KEY": CREDS.key, "Content-Type": "application/json", Accept: "application/json" },
  });
  const text = await res.text();
  let body;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!res.ok) throw Object.assign(new Error(`n8n ${res.status} ${init.method ?? "GET"} ${path}`), { status: res.status, body });
  return body;
}

const THROTTLE_BODY = `// Rate-limit error alerts and build a troubleshooting summary.
// A genuine failure loop must not be able to flood Telegram or email.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_HOUR = 5;

const data = $getWorkflowStaticData('global');
const now = Date.now();
const payload = ($input.first() && $input.first().json) || {};
const execution = payload.execution || {};
const error = execution.error || {};
const node = error.node || {};

const workflowName =
  (payload.workflow && payload.workflow.name) ||
  (execution.workflowData && execution.workflowData.name) ||
  'unknown workflow';
const workflowId = (payload.workflow && payload.workflow.id) || '';
const nodeName = node.name || execution.lastNodeExecuted || 'unknown node';
const nodeType = node.type || 'unknown type';
const message = String(error.message || error.description || 'no error message');

const key = [workflowName, nodeName, message.replace(/\\d+/g, '#')].join(' | ');

const seen = (data.alertSeen && typeof data.alertSeen === 'object') ? data.alertSeen : {};
for (const k of Object.keys(seen)) {
  if (!(now - Number(seen[k]) < WINDOW_MS)) delete seen[k];
}
const recent = (Array.isArray(data.alertTimes) ? data.alertTimes : []).filter(function (t) {
  return now - Number(t) < 60 * 60 * 1000;
});

const duplicate = !!seen[key];
const overBudget = recent.length >= MAX_PER_HOUR;
const shouldAlert = !duplicate && !overBudget;

if (shouldAlert) {
  seen[key] = now;
  recent.push(now);
  data.suppressedSinceLastAlert = 0;
} else {
  data.suppressedSinceLastAlert = (Number(data.suppressedSinceLastAlert) || 0) + 1;
  data.lastSuppressedAt = new Date(now).toISOString();
  data.lastSuppressedReason = overBudget ? 'hourly_cap' : 'duplicate_within_15m';
}
data.alertSeen = seen;
data.alertTimes = recent;
const suppressed = Number(data.suppressedSinceLastAlert) || 0;

function esc(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Setting *names* only: node parameter values can contain credentials.
let settingKeys = '';
try {
  settingKeys = Object.keys(node.parameters || {}).join(', ');
} catch (e) {
  settingKeys = '';
}

const stackLines = String(error.stack || '')
  .split('\\n')
  .slice(0, 6)
  .join('\\n')
  .trim();

const lines = [];
lines.push('n8n failure');
lines.push('Workflow: ' + workflowName + (workflowId ? ' (' + workflowId + ')' : ''));
lines.push('Failed node: ' + nodeName + ' [' + nodeType + ']');
lines.push('Error: ' + message);
if (error.description) lines.push('Description: ' + error.description);
if (error.httpCode) lines.push('HTTP code: ' + error.httpCode);
if (error.level) lines.push('Level: ' + error.level);
lines.push('Execution: ' + (execution.id || 'n/a') + ' (mode: ' + (execution.mode || 'n/a') + ')');
if (execution.retryOf) lines.push('Retry of: ' + execution.retryOf);
if (execution.lastNodeExecuted && execution.lastNodeExecuted !== nodeName) {
  lines.push('Last node executed: ' + execution.lastNodeExecuted);
}
lines.push('At: ' + new Date(now).toISOString());
if (execution.url) lines.push('Open: ' + execution.url);
if (settingKeys) lines.push('Node settings: ' + settingKeys);
if (stackLines) {
  lines.push('Stack:');
  lines.push(stackLines);
}
if (suppressed > 0) lines.push('Suppressed since last alert: ' + suppressed);

const html = lines
  .map(function (line, index) {
    const cls = index === 0 ? '<b>' + esc(line) + '</b>' : esc(line).replace(/\\n/g, '<br>');
    return '<p style="margin:0 0 4px 0">' + cls + '</p>';
  })
  .join('');

return [{
  json: Object.assign({}, payload, {
    shouldAlert: shouldAlert,
    alertKey: key,
    workflowName: workflowName,
    nodeName: nodeName,
    alertText: lines.join('\\n'),
    alertHtml: html,
    suppressedSinceLastAlert: suppressed,
    throttle: overBudget ? 'hourly_cap' : (duplicate ? 'duplicate_within_15m' : 'allowed')
  })
}];
`;

// Wrapped so a malformed/partial error payload still produces one generic alert
// instead of the workflow ending silently with no notification at all.
const THROTTLE_CODE =
  "try {\n" +
  THROTTLE_BODY +
  "\n} catch (err) {\n" +
  "  // Fail open with a minimal alert: a broken payload must not mean silence.\n" +
  "  const reason = String((err && err.message) || err || 'unknown error').slice(0, 200);\n" +
  "  const at = new Date().toISOString();\n" +
  "  const text = 'n8n failure\\nWorkflow: (unavailable - error payload unreadable)\\n' +\n" +
  "    'Error while building alert details: ' + reason + '\\n' +\n" +
  "    'At: ' + at + '\\n' +\n" +
  "    'Open the Devobi Error Handler execution in n8n to inspect the raw payload.';\n" +
  "  const html = '<p><b>n8n failure</b></p>' +\n" +
  "    '<p>Workflow: unavailable (error payload unreadable)</p>' +\n" +
  "    '<p>Error while building alert details: ' + reason.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</p>' +\n" +
  "    '<p>At: ' + at + '</p>';\n" +
  "  return [{ json: { shouldAlert: true, alertKey: 'throttle_fallback', workflowName: 'unknown workflow', nodeName: 'unknown node', alertText: text, alertHtml: html, throttle: 'fallback' } }];\n" +
  "}\n";

const live = await api(`/workflows/${WF_ID}`);
const trigger = live.nodes.find((n) => n.type === "n8n-nodes-base.errorTrigger");
const telegram = live.nodes.find((n) => n.type === "n8n-nodes-base.telegram");
const gmail = live.nodes.find((n) => n.type === "n8n-nodes-base.gmail");
if (!trigger || !telegram || !gmail) throw new Error("Unexpected error-handler shape");

const [tx, ty] = trigger.position;

const throttle = {
  parameters: { jsCode: THROTTLE_CODE },
  id: "e7a41c30-0001-4000-8000-000000000001",
  name: "Throttle Alerts",
  type: "n8n-nodes-base.code",
  typeVersion: 2,
  position: [tx + 220, ty],
  notes: "Suppresses duplicate errors for 15 minutes, caps alerts at 5 per hour, and builds the alert text.",
};
const gate = {
  parameters: {
    conditions: {
      options: { caseSensitive: true, leftValue: "", typeValidation: "strict", version: 2 },
      conditions: [
        {
          id: "e7a41c30-0001-4000-8000-000000000002-cond",
          leftValue: "={{ $json.shouldAlert }}",
          rightValue: true,
          operator: { type: "boolean", operation: "equals" },
        },
      ],
      combinator: "and",
    },
    options: {},
  },
  id: "e7a41c30-0001-4000-8000-000000000002",
  name: "Alert now?",
  type: "n8n-nodes-base.if",
  typeVersion: 2.2,
  position: [tx + 400, ty],
};
const suppressed = {
  parameters: {},
  id: "e7a41c30-0001-4000-8000-000000000003",
  name: "Alert suppressed",
  type: "n8n-nodes-base.noOp",
  typeVersion: 1,
  position: [tx + 580, ty + 180],
  notes: "Duplicate or over the hourly cap: recorded in static data, not sent.",
};

const alertNodes = [throttle, gate, suppressed];
const existing = new Set(live.nodes.map((n) => n.name));
const added = alertNodes.filter((n) => !existing.has(n.name));
const byName = new Map(alertNodes.map((n) => [n.name, n]));

const merged = JSON.parse(JSON.stringify(live));
merged.nodes = merged.nodes.map((node) => {
  const g = byName.get(node.name);
  if (!g) return node;
  const { id, position } = node;
  Object.assign(node, JSON.parse(JSON.stringify(g)));
  node.id = id;
  node.position = position;
  return node;
});
merged.nodes.push(...added);

// Both alert nodes now render the summary built by "Throttle Alerts".
const tg = merged.nodes.find((n) => n.type === "n8n-nodes-base.telegram");
const gm = merged.nodes.find((n) => n.type === "n8n-nodes-base.gmail");
const changes = [];
if (tg.parameters.text !== "={{ $json.alertText }}") {
  changes.push(`telegram.text: ${JSON.stringify(tg.parameters.text).slice(0, 80)}... -> {{ $json.alertText }}`);
  tg.parameters.text = "={{ $json.alertText }}";
}
const subject = "=🚨 n8n failure: {{ $json.workflowName }} / {{ $json.nodeName }}";
if (gm.parameters.subject !== subject) {
  changes.push(`gmail.subject -> ${subject}`);
  gm.parameters.subject = subject;
}
if (gm.parameters.message !== "={{ $json.alertHtml }}") {
  changes.push(`gmail.message: ${String(gm.parameters.message).slice(0, 60)}... -> {{ $json.alertHtml }}`);
  gm.parameters.message = "={{ $json.alertHtml }}";
}

const edge = (name) => ({ node: name, type: "main", index: 0 });
merged.connections[trigger.name] = { main: [[edge("Throttle Alerts")]] };
merged.connections["Throttle Alerts"] = { main: [[edge("Alert now?")]] };
merged.connections["Alert now?"] = { main: [[edge(tg.name), edge(gm.name)], [edge("Alert suppressed")]] };

const names = merged.nodes.map((n) => n.name);
const ids = merged.nodes.map((n) => n.id);
if (new Set(names).size !== names.length) throw new Error("duplicate node names");
if (new Set(ids).size !== ids.length) throw new Error("duplicate node ids");
for (const [from, outs] of Object.entries(merged.connections)) {
  if (!names.includes(from)) throw new Error(`connection source missing: ${from}`);
  for (const m of outs.main ?? []) for (const t of m ?? []) if (!names.includes(t.node)) throw new Error(`target missing: ${t.node}`);
}

const beforeEdges = new Set();
for (const [f, o] of Object.entries(live.connections)) for (const m of o.main ?? []) for (const t of m ?? []) if (t?.node) beforeEdges.add(`${f} -> ${t.node}`);
const afterEdges = new Set();
for (const [f, o] of Object.entries(merged.connections)) for (const m of o.main ?? []) for (const t of m ?? []) if (t?.node) afterEdges.add(`${f} -> ${t.node}`);

console.log(`${live.name} (${WF_ID})  version ${live.versionId}`);
console.log(`nodes ${live.nodes.length} -> ${merged.nodes.length}`);
for (const n of added) console.log(`+ ${n.name} [${n.type.replace("n8n-nodes-base.", "")}]`);
for (const e of afterEdges) if (!beforeEdges.has(e)) console.log(`+ ${e}`);
for (const e of beforeEdges) if (!afterEdges.has(e)) console.log(`- ${e}`);
for (const c of changes) console.log(`~ ${c}`);
if (!changes.length) console.log("~ alert node fields already wired");

mkdirSync(BACKUP_DIR, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
writeFileSync(join(BACKUP_DIR, `error-handler-before-${stamp}.json`), JSON.stringify(live, null, 2));

if (!APPLY) {
  console.log("\nDRY RUN - nothing saved. Re-run with --apply to save.");
  process.exit(0);
}

const saved = await api(`/workflows/${WF_ID}`, {
  method: "PUT",
  body: JSON.stringify({
    name: merged.name,
    nodes: merged.nodes,
    connections: merged.connections,
    settings: merged.settings,
    staticData: merged.staticData ?? null,
  }),
});

const check = await api(`/workflows/${WF_ID}`);
const problems = [];
if (check.connections[trigger.name]?.main?.[0]?.[0]?.node !== "Throttle Alerts") problems.push("error trigger not rewired");
if (check.connections["Alert now?"]?.main?.[1]?.[0]?.node !== "Alert suppressed") problems.push("false branch missing");
const chkTg = check.nodes.find((n) => n.type === "n8n-nodes-base.telegram");
const chkGm = check.nodes.find((n) => n.type === "n8n-nodes-base.gmail");
if (chkTg?.parameters?.text !== "={{ $json.alertText }}") problems.push("telegram text not updated");
if (chkGm?.parameters?.message !== "={{ $json.alertHtml }}") problems.push("gmail message not updated");
if (!check.nodes.find((n) => n.name === "Throttle Alerts")?.parameters?.jsCode?.includes("alertHtml")) problems.push("throttle code missing alertHtml");

console.log(`\nsaved   version ${saved.versionId}`);
console.log(`active  ${check.active ? "yes" : "no"}  nodes ${check.nodes.length}`);
console.log(problems.length ? `VERIFY FAILED: ${problems.join(", ")}` : "verify  ok");
if (problems.length) process.exit(1);
