import type { TemplateId } from "../domain/types.ts";

/**
 * The five starter templates (plan section 05). Each is an original single-file game in
 * public/games/<id>.html that the AI starts from instead of a blank page. Score ranges match the
 * `playermode:game` header on line 1 of each file and feed the daily challenge range check.
 */
export interface TemplateInfo {
  id: TemplateId;
  /** Name of the sample game built from the template. */
  sampleTitle: string;
  genre: string;
  summary: string;
  controls: string;
  scoreMin: number;
  scoreMax: number;
  aspect: "video" | "portrait";
  /** Example prompt shown in the maker for this template. */
  examplePrompt: string;
}

export const TEMPLATES: TemplateInfo[] = [
  {
    id: "runner",
    sampleTitle: "Neon Dash",
    genre: "Runner",
    summary: "Jump and double-jump over obstacles while the speed keeps rising.",
    controls: "Space or tap to jump, again in the air to double jump",
    scoreMin: 0,
    scoreMax: 100_000,
    aspect: "video",
    examplePrompt: "A fox running across autumn rooftops, collecting acorns and dodging chimneys",
  },
  {
    id: "puzzle",
    sampleTitle: "Grid Shift",
    genre: "Puzzle",
    summary: "Slide rows and columns to line up four or more tiles before the timer ends.",
    controls: "Arrows and Space, or drag a tile",
    scoreMin: 0,
    scoreMax: 50_000,
    aspect: "video",
    examplePrompt: "A calm puzzle where you slide planets into lines to light up constellations",
  },
  {
    id: "shooter",
    sampleTitle: "Star Sweep",
    genre: "Shooter",
    summary: "Steer an auto-firing ship through waves of shapes with three shields.",
    controls: "Arrows or drag to move",
    scoreMin: 0,
    scoreMax: 250_000,
    aspect: "portrait",
    examplePrompt: "A paper airplane popping colourful balloons over a windy beach",
  },
  {
    id: "clicker",
    sampleTitle: "Byte Tapper",
    genre: "Clicker",
    summary: "Tap the core, buy upgrades and mine as many bytes as you can in 45 seconds.",
    controls: "Space or tap; 1, 2, 3 to buy upgrades",
    scoreMin: 0,
    scoreMax: 1_000_000,
    aspect: "video",
    examplePrompt: "A lemonade stand clicker where you buy juicers and hire friends",
  },
  {
    id: "maze",
    sampleTitle: "Lumen Maze",
    genre: "Maze",
    summary: "Glide through a new random maze each level and collect orbs for extra time.",
    controls: "Arrows or swipe",
    scoreMin: 0,
    scoreMax: 30_000,
    aspect: "video",
    examplePrompt: "Find the way out of a glowing crystal cave before your lantern runs out",
  },
];

export function templateInfo(id: TemplateId): TemplateInfo {
  const info = TEMPLATES.find((t) => t.id === id);
  if (!info) throw new Error(`Unknown template ${id}`);
  return info;
}
