import { POLICY } from "./domain/policy.ts";

/**
 * Static scan for generated game HTML (plan section 10, step 5). Every game is untrusted code
 * written by an AI from a stranger's prompt, so anything that could reach the network, read
 * storage, navigate the page or run remote code is rejected before the file is saved,
 * published or downloaded. The sandboxed iframe and the game CSP are the second and third lines
 * of defence; this scan keeps bad files out of storage in the first place.
 */

export type ScanRule =
  | "size"
  | "not-html"
  | "external-url"
  | "network-api"
  | "storage-api"
  | "dynamic-code"
  | "navigation"
  | "embedding"
  | "forbidden-tag";

export interface ScanIssue {
  rule: ScanRule;
  message: string;
  /** Short excerpt around the match. */
  excerpt?: string;
}

export interface ScanResult {
  ok: boolean;
  sizeBytes: number;
  issues: ScanIssue[];
}

interface Check {
  rule: ScanRule;
  pattern: RegExp;
  message: string;
}

const CHECKS: Check[] = [
  // Any absolute or protocol-relative URL, including in comments: games must not reference the network.
  { rule: "external-url", pattern: /\b(?:https?|wss?|ftp):\/\//i, message: "Contains an external URL" },
  {
    rule: "external-url",
    pattern: /(?:src|href|action|data|poster)\s*=\s*["']?\s*\/\//i,
    message: "Contains a protocol-relative URL",
  },
  {
    rule: "external-url",
    pattern: /url\(\s*["']?\s*(?:https?:)?\/\//i,
    message: "Loads a CSS resource from another site",
  },
  { rule: "network-api", pattern: /\bfetch\s*\(/, message: "Uses fetch()" },
  { rule: "network-api", pattern: /\bXMLHttpRequest\b/, message: "Uses XMLHttpRequest" },
  { rule: "network-api", pattern: /\bWebSocket\b/, message: "Uses WebSocket" },
  { rule: "network-api", pattern: /\bEventSource\b/, message: "Uses EventSource" },
  { rule: "network-api", pattern: /\bsendBeacon\b/, message: "Uses navigator.sendBeacon" },
  { rule: "network-api", pattern: /\bRTCPeerConnection\b/, message: "Uses WebRTC" },
  { rule: "network-api", pattern: /\bimportScripts\b/, message: "Uses importScripts" },
  { rule: "storage-api", pattern: /\b(?:localStorage|sessionStorage|indexedDB)\b/, message: "Uses browser storage" },
  { rule: "storage-api", pattern: /\bdocument\s*\.\s*cookie\b/, message: "Reads or writes cookies" },
  { rule: "storage-api", pattern: /\bcaches\s*\.\s*open\b/, message: "Uses the Cache API" },
  { rule: "dynamic-code", pattern: /\beval\s*\(/, message: "Uses eval()" },
  { rule: "dynamic-code", pattern: /\bnew\s+Function\s*\(/, message: "Uses new Function()" },
  { rule: "dynamic-code", pattern: /\bimport\s*\(/, message: "Uses dynamic import()" },
  {
    rule: "dynamic-code",
    pattern: /\bset(?:Timeout|Interval)\s*\(\s*["'`]/,
    message: "Passes a string to setTimeout or setInterval",
  },
  { rule: "dynamic-code", pattern: /\bnew\s+(?:Shared)?Worker\s*\(/, message: "Starts a worker" },
  { rule: "navigation", pattern: /\b(?:top|parent|opener)\s*\.\s*location\b/, message: "Navigates the host page" },
  { rule: "navigation", pattern: /\bwindow\s*\.\s*open\s*\(/, message: "Opens a window" },
  { rule: "navigation", pattern: /\blocation\s*\.\s*(?:href|assign|replace)\b/, message: "Changes the location" },
  { rule: "navigation", pattern: /<meta[^>]+http-equiv\s*=\s*["']?refresh/i, message: "Uses a meta refresh" },
  { rule: "embedding", pattern: /<(?:iframe|frame|object|embed|portal)\b/i, message: "Embeds another document" },
  { rule: "forbidden-tag", pattern: /<script[^>]+\bsrc\s*=/i, message: "Loads an external script" },
  {
    rule: "forbidden-tag",
    pattern: /<link\b[^>]*\brel\s*=\s*["']?(?:stylesheet|preload|prefetch|modulepreload|import)/i,
    message: "Loads an external stylesheet or resource",
  },
  { rule: "forbidden-tag", pattern: /<base\b/i, message: "Sets a base URL" },
  { rule: "forbidden-tag", pattern: /<form\b/i, message: "Contains a form" },
];

const byteLength = (text: string) => new TextEncoder().encode(text).length;

function excerptAt(html: string, index: number): string {
  return html
    .slice(Math.max(0, index - 30), index + 50)
    .replace(/\s+/g, " ")
    .trim();
}

export function scanGameHtml(html: string, maxBytes: number = POLICY.gameMaxBytes): ScanResult {
  const sizeBytes = byteLength(html);
  const issues: ScanIssue[] = [];

  if (sizeBytes > maxBytes) {
    issues.push({
      rule: "size",
      message: `File is ${Math.ceil(sizeBytes / 1024)} KB; the limit is ${Math.floor(maxBytes / 1024)} KB`,
    });
  }
  if (!/<html[\s>]/i.test(html) || !/<\/html>/i.test(html)) {
    issues.push({ rule: "not-html", message: "Not a complete HTML document" });
  }

  for (const check of CHECKS) {
    const match = check.pattern.exec(html);
    if (match) issues.push({ rule: check.rule, message: check.message, excerpt: excerptAt(html, match.index) });
  }

  return { ok: issues.length === 0, sizeBytes, issues };
}

/**
 * Visible strings in a game (text nodes, plus string literals drawn with fillText), passed to the
 * moderation step after generation (plan section 11).
 */
export function extractVisibleText(html: string): string[] {
  const out = new Set<string>();
  const title = /<title>([^<]*)<\/title>/i.exec(html)?.[1]?.trim();
  if (title) out.add(title);

  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");
  for (const text of body.split(/<[^>]*>/)) {
    const clean = text.replace(/\s+/g, " ").trim();
    if (clean) out.add(clean);
  }

  for (const script of html.match(/<script[\s\S]*?<\/script>/gi) ?? []) {
    for (const m of script.matchAll(/\bfillText\s*\(\s*(["'`])((?:(?!\1).){1,120})\1/g)) {
      const literal = m[2]?.trim();
      if (literal && !literal.includes("${")) out.add(literal);
    }
  }
  return [...out];
}
