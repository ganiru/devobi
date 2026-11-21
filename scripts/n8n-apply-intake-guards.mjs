#!/usr/bin/env node
/**
 * scripts/n8n-apply-intake-guards.mjs
 *
 * Merges the intake guards from infra/n8n/reactivate-intake-guards.json into the
 * live "Lead Reactivation Engine - SELLERS" workflow:
 *
 *   Form submission webhook -> Validate & Sanitise CSV -> Invalid input?
 *      valid   -> Record Accepted -> Respond 202 -> If CSV file exists -> (existing pipeline)
 *      invalid -> Record Rejected -> Respond 400 (silent)          [no alert, execution ends]
 *   + hourly summary branch (Schedule -> counts -> Telegram only when there was activity)
 *
 * The Error Trigger branch of the guard workflow is NOT merged: this workflow already
 * routes failures to the "Devobi Error Handler" workflow (settings.errorWorkflow), and a
 * second Error Trigger here would only fire if that setting were repointed, which would
 * silently disable the existing handler.
 *
 * Usage:
 *   node scripts/n8n-apply-intake-guards.mjs           # dry run: print diff, write proposal
 *   node scripts/n8n-apply-intake-guards.mjs --apply   # save to n8n
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TARGET = "Lead Reactivation Engine - SELLERS";
const GUARDS_PATH = join(ROOT, "infra/n8n/reactivate-intake-guards.json");
const BACKUP_DIR = join(ROOT, ".n8n-backups");
const APPLY = process.argv.includes("--apply");

/* ---------- credentials ---------- */
function parseEnvFile(path) {
  const out = {};
  if (!existsSync(path)) return out;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    out[m[1]] = v;
  }
  return out;
}
function creds() {
  const env = parseEnvFile(join(ROOT, ".env.local"));
  let base = env.N8N_BASE_URL || env.N8N_API_URL || "";
  let key = env.N8N_API_KEY || "";
  if (!base || !key) {
    const mcp = JSON.parse(readFileSync(join(homedir(), ".agents", "mcp.json"), "utf8"));
    const n8n = mcp?.mcpServers?.n8n?.env ?? {};
    base = base || n8n.N8N_API_URL || "";
    key = key || n8n.N8N_API_KEY || "";
  }
  if (!base || !key) throw new Error("Missing N8N_BASE_URL / N8N_API_KEY");
  return { base: base.replace(/\/+$/, ""), key };
}
const CREDS = creds();

async function api(path, init = {}) {
  const res = await fetch(`${CREDS.base}/api/v1${path}`, {
    ...init,
    headers: {
      "X-N8N-API-KEY": CREDS.key,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  let body;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!res.ok) {
    const err = new Error(`n8n ${res.status} ${res.statusText} ${init.method ?? "GET"} ${path}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

/* ---------- build ---------- */
const SKIP_NODES = new Set([
  // guard workflow's own webhook: the live workflow already has one (path kept as-is)
  "Lead CSV Webhook",
  // placeholder that we replace with the real downstream node
  "Handoff to existing pipeline",
  // error branch: the live workflow already uses the "Devobi Error Handler" error workflow
  "Error Trigger",
  "Record Failure",
  "Alert immediately?",
  "Telegram: Failure Alert",
  "Failure logged",
]);
const LAYOUT = {
  "Validate & Sanitise CSV": [-784, 1944],
  "Invalid input?": [-616, 1944],
  "Record Accepted": [-448, 1864],
  "Respond 202": [-280, 1864],
  "Record Rejected": [-448, 2024],
  "Respond 400 (silent)": [-280, 2024],
  "Hourly Summary Trigger": [-784, 2184],
  "Build Hourly Summary": [-616, 2184],
  "Activity in the last hour?": [-448, 2184],
  "Telegram: Hourly Summary": [-280, 2104],
  "Reset Hourly Counters": [-112, 2104],
  "Nothing to report": [-280, 2264],
};

const list = (await api(`/workflows?limit=250`)).data;
const found = list.find((w) => (w.name ?? "").toLowerCase() === TARGET.toLowerCase());
if (!found) throw new Error(`Workflow not found: ${TARGET}`);
const live = await api(`/workflows/${found.id}`);
const guardWf = JSON.parse(readFileSync(GUARDS_PATH, "utf8"));

const liveTelegram = live.nodes.find((n) => n.type === "n8n-nodes-base.telegram");
if (!liveTelegram) throw new Error("Live workflow has no Telegram node to borrow credentials from");

const JS_SOURCE = join(ROOT, "infra/n8n/validate-sanitise-csv.js");
const guardJs = existsSync(JS_SOURCE) ? readFileSync(JS_SOURCE, "utf8") : null;

const guardNodes = guardWf.nodes
  .filter((n) => !SKIP_NODES.has(n.name))
  .map((n) => {
    const copy = JSON.parse(JSON.stringify(n));
    if (LAYOUT[n.name]) copy.position = LAYOUT[n.name];
    if (n.type === "n8n-nodes-base.telegram") {
      copy.parameters.chatId = liveTelegram.parameters.chatId;
      copy.credentials = liveTelegram.credentials;
    }
    // the plain .js file is the source of truth for the validator
    if (n.name === "Validate & Sanitise CSV" && guardJs) copy.parameters.jsCode = guardJs.trimStart();
    return copy;
  });
const guardByName = new Map(guardNodes.map((n) => [n.name, n]));
const added = guardNodes.filter((n) => !live.nodes.some((l) => l.name === n.name));

// idempotent: re-running syncs guard node parameters onto the nodes already there
const merged = JSON.parse(JSON.stringify(live));
merged.nodes = merged.nodes.map((node) => {
  const g = guardByName.get(node.name);
  if (!g) return node;
  const { id, position } = node;
  Object.assign(node, JSON.parse(JSON.stringify(g)));
  node.id = id;
  node.position = position;
  return node;
});
merged.nodes.push(...added);

const wh = merged.nodes.find((n) => n.type === "n8n-nodes-base.webhook");
wh.parameters.responseMode = "responseNode";

const edge = (node) => ({ node, type: "main", index: 0 });
merged.connections["Form submission webhook"].main[0] = [edge("Validate & Sanitise CSV")];
merged.connections["Validate & Sanitise CSV"] = { main: [[edge("Invalid input?")]] };
merged.connections["Invalid input?"] = { main: [[edge("Record Accepted")], [edge("Record Rejected")]] };
merged.connections["Record Accepted"] = { main: [[edge("Respond 202")]] };
merged.connections["Respond 202"] = { main: [[edge("If CSV file exists")]] };
merged.connections["Record Rejected"] = { main: [[edge("Respond 400 (silent)")]] };
merged.connections["Hourly Summary Trigger"] = { main: [[edge("Build Hourly Summary")]] };
merged.connections["Build Hourly Summary"] = { main: [[edge("Activity in the last hour?")]] };
merged.connections["Activity in the last hour?"] = {
  main: [[edge("Telegram: Hourly Summary")], [edge("Nothing to report")]],
};
merged.connections["Telegram: Hourly Summary"] = { main: [[edge("Reset Hourly Counters")]] };

/* ---------- structural validation ---------- */
const problems = [];
const names = merged.nodes.map((n) => n.name);
const ids = merged.nodes.map((n) => n.id);
if (new Set(names).size !== names.length) problems.push("duplicate node names");
if (new Set(ids).size !== ids.length) problems.push("duplicate node ids");
for (const [from, outs] of Object.entries(merged.connections)) {
  if (!names.includes(from)) problems.push(`connection source missing: ${from}`);
  for (const main of outs.main ?? []) {
    for (const t of main ?? []) if (!names.includes(t.node)) problems.push(`connection target missing: ${t.node}`);
  }
}
for (const n of merged.nodes) {
  if (!Array.isArray(n.position) || n.position.length !== 2) problems.push(`bad position: ${n.name}`);
  if (!n.id || !n.type || !n.name) problems.push(`bad node: ${n.name}`);
}
if (problems.length) {
  console.error("MERGED WORKFLOW INVALID:\n  " + [...new Set(problems)].join("\n  "));
  process.exit(1);
}

/* ---------- diff ---------- */
const before = new Map(live.nodes.map((n) => [n.name, n]));
const after = new Map(merged.nodes.map((n) => [n.name, n]));
const onlyBefore = [...before.keys()].filter((k) => !after.has(k));
const onlyAfter = [...after.keys()].filter((k) => !before.has(k));
const changed = [...after.keys()].filter(
  (k) => before.has(k) && JSON.stringify(before.get(k).parameters) !== JSON.stringify(after.get(k).parameters)
);
const brief = (value) => {
  if (typeof value === "string" && value.length > 120) {
    return `<string ${value.length} chars: ${JSON.stringify(value.slice(0, 40))}...>`;
  }
  const s = JSON.stringify(value);
  return s && s.length > 160 ? s.slice(0, 157) + "..." : s;
};

const edgesOf = (conns) => {
  const out = new Set();
  for (const [from, outs] of Object.entries(conns)) {
    for (const main of outs.main ?? []) for (const t of main ?? []) if (t?.node) out.add(`${from} -> ${t.node}`);
  }
  return out;
};
const eBefore = edgesOf(live.connections);
const eAfter = edgesOf(merged.connections);
const addedEdges = [...eAfter].filter((e) => !eBefore.has(e));
const removedEdges = [...eBefore].filter((e) => !eAfter.has(e));

console.log(`workflow  ${live.name}  (${live.id})`);
console.log(`version   ${live.versionId}`);
console.log(`nodes     ${live.nodes.length} -> ${merged.nodes.length}`);
console.log(`edges     ${eBefore.size} -> ${eAfter.size}\n`);

console.log(`+ ${onlyAfter.length} node(s) added:`);
for (const n of onlyAfter) console.log(`    + ${n}  [${after.get(n).type.replace("n8n-nodes-base.", "")}]`);
console.log(`- ${onlyBefore.length} node(s) removed${onlyBefore.length ? ":" : ""}`);
for (const n of onlyBefore) console.log(`    - ${n}`);
console.log(`~ ${changed.length} node(s) modified:`);
for (const n of changed) {
  const a = before.get(n).parameters;
  const b = after.get(n).parameters;
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) {
      console.log(`    ~ ${n}.${k}: ${brief(a[k])} -> ${brief(b[k])}`);
    }
  }
}
console.log(`\n+ ${addedEdges.length} connection(s) added:`);
for (const e of addedEdges) console.log(`    + ${e}`);
console.log(`- ${removedEdges.length} connection(s) removed:`);
for (const e of removedEdges) console.log(`    - ${e}`);

mkdirSync(BACKUP_DIR, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const proposalPath = join(BACKUP_DIR, `proposed-${stamp}.json`);
writeFileSync(proposalPath, JSON.stringify(merged, null, 2));
console.log(`\nproposal  ${proposalPath.replace(ROOT + "/", "")}`);

if (!APPLY) {
  console.log("\nDRY RUN - nothing saved. Re-run with --apply to save.");
  process.exit(0);
}

/* ---------- save ---------- */
const payload = {
  name: merged.name,
  nodes: merged.nodes,
  connections: merged.connections,
  settings: merged.settings,
  staticData: merged.staticData ?? null,
  pinData: merged.pinData ?? {},
};
let saved;
try {
  saved = await api(`/workflows/${live.id}`, { method: "PUT", body: JSON.stringify(payload) });
} catch (err) {
  if (err.status !== 400) throw err;
  console.log(`\nPUT rejected with pinData (${JSON.stringify(err.body)?.slice(0, 200)}), retrying without it`);
  delete payload.pinData;
  saved = await api(`/workflows/${live.id}`, { method: "PUT", body: JSON.stringify(payload) });
}

const check = await api(`/workflows/${live.id}`);
const problemsAfter = [];
if (check.nodes.length !== merged.nodes.length) problemsAfter.push(`node count ${check.nodes.length} != ${merged.nodes.length}`);
const whCheck = check.nodes.find((n) => n.type === "n8n-nodes-base.webhook");
if (whCheck?.parameters?.responseMode !== "responseNode") problemsAfter.push("webhook responseMode not saved");
const ifCheck = check.connections["Invalid input?"]?.main;
if (ifCheck?.[0]?.[0]?.node !== "Record Accepted") problemsAfter.push("valid branch not wired");
if (ifCheck?.[1]?.[0]?.node !== "Record Rejected") problemsAfter.push("invalid branch not wired");
if (check.connections["Form submission webhook"]?.main?.[0]?.[0]?.node !== "Validate & Sanitise CSV")
  problemsAfter.push("webhook not wired to validator");

console.log(`\nsaved     version ${saved.versionId}`);
console.log(`active    ${check.active ? "yes" : "no"}`);
console.log(`nodes     ${check.nodes.length}`);
console.log(problemsAfter.length ? `VERIFY FAILED:\n  ${problemsAfter.join("\n  ")}` : "verify    ok");
if (problemsAfter.length) process.exit(1);
