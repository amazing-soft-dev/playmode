import { POLICY } from "./domain/policy.ts";

/**
 * First-pass prompt moderation (plan sections 11 and 13). Production also sends prompts to the
 * OpenAI Moderation endpoint before any model call; this local pass runs first, costs nothing,
 * and never uses up a build.
 *
 * 1. Franchise names are swapped for original stand-ins and the player is told why.
 * 2. A small blocklist refuses prompts that are clearly not for an 8+ audience.
 */

/** Trademarked franchises and characters mapped to original stand-ins. */
const FRANCHISES: [RegExp, string][] = [
  [/\b(super\s+)?mario\b/gi, "a jumping plumber-style hero (original design)"],
  [/\bluigi\b/gi, "a tall green-capped sidekick (original design)"],
  [/\bpok[eé]mon\b|\bpikachu\b/gi, "a pocket creature (original design)"],
  [/\bsonic\b/gi, "a speedy blue critter (original design)"],
  [/\bminecraft\b/gi, "a blocky building world (original design)"],
  [/\bfortnite\b/gi, "a colourful last-player-standing arena (original design)"],
  [/\bzelda\b|\blink from\b/gi, "a sword-and-shield adventurer (original design)"],
  [/\bpac-?man\b/gi, "a round dot-eating hero (original design)"],
  [/\btetris\b/gi, "falling-block puzzle (original design)"],
  [/\bangry\s+birds?\b/gi, "slingshot birds (original design)"],
  [/\bspider-?man\b|\bbatman\b|\bsuperman\b/gi, "a masked city hero (original design)"],
  [/\broblox\b/gi, "a blocky avatar playground (original design)"],
  [/\bamong\s+us\b/gi, "a spaceship crew mystery (original design)"],
  [/\bflappy\s+bird\b/gi, "a tap-to-flap bird (original design)"],
];

/** Terms that are never allowed in a prompt for an 8+ site. Kept short and unambiguous. */
const BLOCKLIST: RegExp[] = [
  /\b(porn|nude|naked|sex(y|ual)?|nsfw|hentai)\b/i,
  /\b(gore|dismember\w*|decapitat\w*|torture)\b/i,
  /\b(suicide|self[-\s]?harm)\b/i,
  /\b(nazi|swastika|kkk)\b/i,
  /\b(cocaine|heroin|meth)\b/i,
  /\b(school\s+shoot\w*|mass\s+shoot\w*)\b/i,
];

export type ModerationResult =
  | { ok: true; prompt: string; replacements: { from: string; to: string }[] }
  | { ok: false; reason: "empty" | "too-long" | "blocked"; message: string };

export function moderatePrompt(raw: string): ModerationResult {
  const text = raw.replace(/\s+/g, " ").trim();
  if (!text) return { ok: false, reason: "empty", message: "Describe your game first." };
  if (text.length > POLICY.promptMaxChars) {
    return { ok: false, reason: "too-long", message: `Keep it under ${POLICY.promptMaxChars} characters.` };
  }
  if (BLOCKLIST.some((re) => re.test(text))) {
    return {
      ok: false,
      reason: "blocked",
      message:
        "That idea isn't something we can build here. Games on PlayerMode need to suit players aged 8 and up. Try another idea; this didn't use a build.",
    };
  }
  const replacements: { from: string; to: string }[] = [];
  let prompt = text;
  for (const [pattern, standIn] of FRANCHISES) {
    prompt = prompt.replace(pattern, (match) => {
      replacements.push({ from: match, to: standIn });
      return standIn;
    });
  }
  return { ok: true, prompt, replacements };
}

/**
 * Moderation for gallery titles, descriptions and tags at publish time (plan section 11).
 * Franchise names are refused here rather than swapped, because the creator is naming the game.
 */
export function moderateText(text: string): { ok: true } | { ok: false; message: string } {
  if (BLOCKLIST.some((re) => re.test(text))) {
    return { ok: false, message: "Please remove words that aren't suitable for players aged 8 and up." };
  }
  if (FRANCHISES.some(([re]) => new RegExp(re.source, "i").test(text))) {
    return {
      ok: false,
      message: "Please don't use trademarked game or character names. Give your game an original name.",
    };
  }
  return { ok: true };
}
