import type { Game, GameVersion, License, TemplateId } from "../domain/types.ts";

/**
 * Community gallery fixtures. Every game runs one of the five original sample games in
 * public/games/, so the player and downloads work end to end without a backend.
 * Creator names are generated nicknames, as the plan requires for under-18 accounts.
 */

interface Seed {
  id: string;
  title: string;
  description: string;
  template: TemplateId;
  tags: string[];
  owner: [id: string, name: string];
  likes: number;
  weeklyLikes: number;
  plays: number;
  staffPick?: boolean;
  allowDownload?: boolean;
  license?: License;
  /** Days before FIXTURE_NOW the game was published. */
  ageDays: number;
  prompt: string;
}

/** Fixed clock for fixtures so builds are deterministic. */
export const FIXTURE_NOW = Date.parse("2026-11-17T12:00:00Z");

const SEEDS: Seed[] = [
  {
    id: "neon-rooftops",
    title: "Neon Rooftops",
    description: "Leap across a sleeping city and collect light shards before sunrise.",
    template: "runner",
    tags: ["runner", "city", "night"],
    owner: ["u-pixelotter", "PixelOtter42"],
    likes: 412,
    weeklyLikes: 58,
    plays: 6120,
    staffPick: true,
    allowDownload: true,
    license: "cc-by-4.0",
    ageDays: 12,
    prompt: "A rooftop runner at night where you collect glowing shards",
  },
  {
    id: "comet-skipper",
    title: "Comet Skipper",
    description: "Hop between comets and dodge space dust in an endless sky.",
    template: "runner",
    tags: ["runner", "space"],
    owner: ["u-quietfox", "QuietFox17"],
    likes: 233,
    weeklyLikes: 71,
    plays: 3904,
    ageDays: 3,
    prompt: "Endless runner jumping between comets in space",
  },
  {
    id: "garden-grid",
    title: "Garden Grid",
    description: "Slide seed tiles into rows so the garden blooms in time.",
    template: "puzzle",
    tags: ["puzzle", "relaxing", "nature"],
    owner: ["u-mossbyte", "MossByte09"],
    likes: 388,
    weeklyLikes: 22,
    plays: 5011,
    staffPick: true,
    allowDownload: true,
    license: "cc-by-nc-4.0",
    ageDays: 26,
    prompt: "Calm sliding puzzle about growing a garden",
  },
  {
    id: "tide-tiles",
    title: "Tide Tiles",
    description: "Match shells before the tide comes in and washes the board.",
    template: "puzzle",
    tags: ["puzzle", "ocean"],
    owner: ["u-lumenkite", "LumenKite31"],
    likes: 141,
    weeklyLikes: 39,
    plays: 1876,
    ageDays: 2,
    prompt: "Matching puzzle with shells and a rising tide timer",
  },
  {
    id: "orbit-sweep",
    title: "Orbit Sweep",
    description: "Clear the asteroid belt with a ship that can only turn left.",
    template: "shooter",
    tags: ["shooter", "space", "arcade"],
    owner: ["u-voltwren", "VoltWren55"],
    likes: 509,
    weeklyLikes: 64,
    plays: 7340,
    staffPick: true,
    ageDays: 18,
    prompt: "Arcade space shooter where the ship only turns left",
  },
  {
    id: "paper-planes",
    title: "Paper Planes",
    description: "Fold, fly and pop balloons over a windy schoolyard.",
    template: "shooter",
    tags: ["shooter", "cute", "school"],
    owner: ["u-cloudpine", "CloudPine08"],
    likes: 96,
    weeklyLikes: 30,
    plays: 1290,
    allowDownload: true,
    license: "cc0-1.0",
    ageDays: 1,
    prompt: "Paper plane that pops balloons, cute style",
  },
  {
    id: "byte-bakery",
    title: "Byte Bakery",
    description: "Tap to bake cookies, then buy ovens before the timer runs out.",
    template: "clicker",
    tags: ["clicker", "food", "idle"],
    owner: ["u-sunnyglitch", "SunnyGlitch77"],
    likes: 274,
    weeklyLikes: 45,
    plays: 4488,
    allowDownload: true,
    license: "cc-by-4.0",
    ageDays: 9,
    prompt: "Cookie bakery clicker with oven upgrades and a timer",
  },
  {
    id: "volt-farm",
    title: "Volt Farm",
    description: "Charge batteries with every tap and power the whole valley.",
    template: "clicker",
    tags: ["clicker", "energy"],
    owner: ["u-pixelotter", "PixelOtter42"],
    likes: 87,
    weeklyLikes: 12,
    plays: 980,
    ageDays: 15,
    prompt: "Clicker where you charge batteries to light up a valley",
  },
  {
    id: "lumen-caves",
    title: "Lumen Caves",
    description: "Find the exit of a glowing cave that changes every run.",
    template: "maze",
    tags: ["maze", "explore", "caves"],
    owner: ["u-echoatlas", "EchoAtlas12"],
    likes: 356,
    weeklyLikes: 49,
    plays: 5502,
    staffPick: true,
    allowDownload: true,
    license: "cc-by-4.0",
    ageDays: 21,
    prompt: "Procedural glowing cave maze with a timer",
  },
  {
    id: "hedge-sprint",
    title: "Hedge Sprint",
    description: "Race through a hedge maze and grab every key on the way out.",
    template: "maze",
    tags: ["maze", "race"],
    owner: ["u-quietfox", "QuietFox17"],
    likes: 164,
    weeklyLikes: 53,
    plays: 2207,
    ageDays: 4,
    prompt: "Hedge maze race collecting keys",
  },
  {
    id: "pixel-pond",
    title: "Pixel Pond",
    description: "Guide a frog across lily pads that sink when you wait too long.",
    template: "runner",
    tags: ["runner", "nature", "cute"],
    owner: ["u-mossbyte", "MossByte09"],
    likes: 59,
    weeklyLikes: 19,
    plays: 702,
    ageDays: 6,
    prompt: "Frog hopping across sinking lily pads",
  },
  {
    id: "signal-stack",
    title: "Signal Stack",
    description: "Stack radio towers to catch signals from passing satellites.",
    template: "puzzle",
    tags: ["puzzle", "space"],
    owner: ["u-voltwren", "VoltWren55"],
    likes: 121,
    weeklyLikes: 8,
    plays: 1544,
    ageDays: 33,
    prompt: "Stacking puzzle with radio towers and satellites",
  },
];

const ago = (days: number) => new Date(FIXTURE_NOW - days * 86_400_000).toISOString();

export const GAMES: Game[] = SEEDS.map((s) => ({
  id: s.id,
  ownerId: s.owner[0],
  ownerName: s.owner[1],
  title: s.title,
  description: s.description,
  tags: s.tags,
  template: s.template,
  status: "published",
  visibility: "public",
  allowDownload: s.allowDownload ?? false,
  license: s.license ?? "all-rights-reserved",
  currentVersionId: `${s.id}-v1`,
  likeCount: s.likes,
  weeklyLikeCount: s.weeklyLikes,
  playCount: s.plays,
  reportCount: 0,
  staffPick: s.staffPick ?? false,
  createdAt: ago(s.ageDays + 1),
  publishedAt: ago(s.ageDays),
}));

/** Rough size of each sample game file, used for the version metadata. */
const TEMPLATE_BYTES: Record<TemplateId, number> = {
  runner: 18_000,
  puzzle: 16_000,
  shooter: 19_000,
  clicker: 15_000,
  maze: 17_000,
};

export const VERSIONS: GameVersion[] = SEEDS.map((s) => ({
  id: `${s.id}-v1`,
  gameId: s.id,
  prompt: s.prompt,
  htmlPath: `/games/${s.template}.html`,
  sizeBytes: TEMPLATE_BYTES[s.template],
  model: "mock-generator",
  tokensIn: 0,
  tokensOut: 0,
  errorLog: [],
  createdAt: ago(s.ageDays + 1),
}));
