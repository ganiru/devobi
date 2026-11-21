#!/usr/bin/env node
/**
 * scripts/n8n.mjs - read n8n workflows through the public REST API (/api/v1).
 *
 * Credentials, in order of precedence:
 *   1. .env.local  -> N8N_BASE_URL, N8N_API_KEY
 *   2. ~/.agents/mcp.json -> mcpServers.n8n.env.N8N_API_URL / N8N_API_KEY
 *      (same key the n8n MCP server uses, so no second key to manage)
 *
 * Usage:
 *   node scripts/n8n.mjs                 # list workflows, then show "Lead Reactivation Engine - SELLERS"
 *   node scripts/n8n.mjs list            # list only
 *   node scripts/n8n.mjs get <name|id>   # show one workflow (name match is case-insensitive)
 *   node scripts/n8n.mjs get <name|id> --json   # raw JSON to stdout
 *
 * The API key is never printed.
 */

import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_TARGET = "Lead Reactivation Engine - SELLERS";

function parseEnvFile(path) {
  const out = {};
  if (!existsSync(path)) return out;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[m[1]] = v;
  }
  return out;
}

function resolveCredentials() {
  const env = parseEnvFile(join(ROOT, ".env.local"));
  let base = env.N8N_BASE_URL || env.N8N_API_URL || "";
  let key = env.N8N_API_KEY || "";
  let source = ".env.local";

  if (!base || !key) {
    try {
      const mcp = JSON.parse(readFileSync(join(homedir(), ".agents", "mcp.json"), "utf8"));
      const n8n = mcp?.mcpServers?.n8n?.env ?? {};
      base = base || n8n.N8N_API_URL || n8n.N8N_BASE_URL || "";
      key = key || n8n.N8N_API_KEY || "";
      if (base && key) source = "~/.agents/mcp.json";
    } catch {
      /* no fallback config available */
    }
  }

  if (!base || !key) {
    console.error("Missing credentials: set N8N_BASE_URL and N8N_API_KEY in .env.local");
    process.exit(1);
  }
  return { base: base.replace(/\/+$/, ""), key, source };
}

async function api(path, creds) {
  const res = await fetch(`${creds.base}/api/v1${path}`, {
    headers: { "X-N8N-API-KEY": creds.key, Accept: "application/json" },
  });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) {
    const hint =
      res.status === 401 ? " (key rejected - regenerate in n8n Settings > n8n API)" : "";
    console.error(`n8n API ${res.status} ${res.statusText} for ${path}${hint}`);
    console.error(typeof body === "string" ? body.slice(0, 2000) : JSON.stringify(body, null, 2));
    process.exit(1);
  }
  return body;
}

function shortDate(iso) {
  if (!iso) return "-";
  return String(iso).slice(0, 16).replace("T", " ");
}

function printList(workflows) {
  if (!workflows.length) {
    console.log("No workflows returned.");
    return;
  }
  const idWidth = Math.max(4, ...workflows.map((w) => String(w.id).length));
  console.log(`${workflows.length} workflow(s)\n`);
  console.log(
    "ID".padEnd(idWidth) + "  ACTIVE  UPDATED".padEnd(20) + "  NAME"
  );
  for (const w of workflows) {
    const active = w.active ? "yes" : "no";
    console.log(
      String(w.id).padEnd(idWidth) +
        "  " +
        active.padEnd(6) +
        "  " +
        String(shortDate(w.updatedAt)).padEnd(16) +
        "  " +
        (w.name ?? "(unnamed)")
    );
  }
}

function printDetail(wf) {
  console.log(`\n=== ${wf.name} ===`);
  console.log(`id        ${wf.id}`);
  console.log(`active    ${wf.active ? "yes" : "no"}`);
  console.log(`updated   ${shortDate(wf.updatedAt)}  (created ${shortDate(wf.createdAt)})`);
  console.log(`tags      ${(wf.tags ?? []).map((t) => t.name ?? t).join(", ") || "-"}`);
  console.log(`versionId ${wf.versionId ?? "-"}`);

  const nodes = wf.nodes ?? [];
  console.log(`\nnodes (${nodes.length}):`);
  for (const n of nodes) {
    const params = n.parameters ?? {};
    const bits = [];
    if (params.path) bits.push(`path=${params.path}`);
    if (params.httpMethod) bits.push(`method=${params.httpMethod}`);
    if (params.rule?.interval) bits.push(`every ${JSON.stringify(params.rule.interval)}`);
    if (params.respondWith) bits.push(`respondWith=${params.respondWith}`);
    if (params.authentication) bits.push(`auth=${params.authentication}`);
    if (params.resource && params.operation)
      bits.push(`${params.resource}.${params.operation}`);
    console.log(
      `  - ${n.name}  [${n.type}]${bits.length ? "  " + bits.join(" ") : ""}` +
        (n.disabled ? "  (disabled)" : "")
    );
  }

  const conns = wf.connections ?? {};
  const edges = [];
  for (const [from, outputs] of Object.entries(conns)) {
    for (const main of outputs.main ?? []) {
      for (const target of main ?? []) {
        if (target?.node) edges.push(`${from} -> ${target.node}`);
      }
    }
  }
  console.log(`\nconnections (${edges.length}):`);
  for (const e of edges) console.log(`  ${e}`);
}

// Dispatched inside a function so successful runs can `return` (and let Node flush
// stdout) instead of calling process.exit(), which truncates large --json output.
async function main() {
const args = process.argv.slice(2);
const jsonOut = args.includes("--json");
const [action = "all", targetArg] = args.filter((a) => !a.startsWith("--"));
const creds = resolveCredentials();

if (action === "all" || action === "list") {
  const res = await api("/workflows?limit=250", creds);
  const workflows = res?.data ?? (Array.isArray(res) ? res : []);
  console.log(`source: ${creds.source}  ->  ${creds.base}\n`);
  printList(workflows);

  if (action === "list") return;

  const wanted = targetArg || DEFAULT_TARGET;
  const hit = workflows.find(
    (w) => String(w.id) === wanted || (w.name ?? "").toLowerCase() === wanted.toLowerCase()
  );
  if (!hit) {
    console.error(`\nNo workflow named "${wanted}".`);
    process.exit(1);
  }
  const wf = await api(`/workflows/${hit.id}`, creds);
  if (jsonOut) console.log(JSON.stringify(wf, null, 2));
  else printDetail(wf);
  return;
}

if (action === "get") {
  const wanted = targetArg || DEFAULT_TARGET;
  let id = wanted;
  if (!/^[A-Za-z0-9]{10,}$/.test(wanted)) {
    const workflows = (await api("/workflows?limit=250", creds))?.data ?? [];
    const hit = workflows.find((w) => (w.name ?? "").toLowerCase() === wanted.toLowerCase());
    if (!hit) {
      console.error(`No workflow named "${wanted}". Run "node scripts/n8n.mjs list".`);
      process.exit(1);
    }
    id = hit.id;
  }
  const wf = await api(`/workflows/${id}`, creds);
  if (jsonOut) console.log(JSON.stringify(wf, null, 2));
  else printDetail(wf);
  return;
}

console.error(`Unknown action "${action}". Use: list | get <name|id>`);
process.exit(1);
}

await main();
