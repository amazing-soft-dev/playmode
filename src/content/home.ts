import { POLICY } from "@/lib/domain/policy";

import type { Cta, Heading, Stat, Step } from "./types";

/**
 * Home page copy, section by section, in the order of the template's home page:
 * hero, wordmark banner, about, stats, templates, promos, trending, creators, call to action.
 */

export const hero = {
  title: "Describe a game. Play it a minute later.",
  lead: "PlayerMode turns a few words into a playable HTML5 game. Pick a starter, say what you want, and play it in your browser. No code, no installs.",
  promptLabel: "Describe your game",
  promptPlaceholder: "A fox running across autumn rooftops, collecting acorns…",
  promptCta: "Make it",
  secondary: { label: "Play today's challenge", href: "/daily" } satisfies Cta,
};

export const banner = {
  wordmark: "PLAYERMODE",
  tagline: "Make · Play · Share",
};

export const about: Heading & { body: string; cta: Cta } = {
  label: "About",
  title: "A game studio that fits in a text box —",
  muted: "you bring the idea, the AI writes the code, and everyone gets to play.",
  body: "Every game starts from a tested template, runs in a locked-down player, and can be saved, shared or downloaded as a single HTML file.",
  cta: { label: "How it works", href: "/about" },
};

export const stats: { heading: Heading; items: Stat[] } = {
  heading: {
    label: "By the numbers",
    title: "Small games, fast loops, a new reason to play every day.",
  },
  items: [
    { value: 5, label: "Starter templates", text: "Runner, puzzle, shooter, clicker and maze" },
    { value: 60, suffix: "s", label: "Idea to play", text: "From one sentence to a playable game" },
    { value: POLICY.dailyBuilds.free, label: "Free builds a day", text: "No card needed, failed builds never count" },
    { value: POLICY.leaderboardSize, label: "Leaderboard spots", text: "On every daily challenge" },
  ],
};

export const templatesSection: Heading & { cta: Cta } = {
  label: "Templates",
  title: "Pick a starting point.",
  muted: "The AI fills in a game loop that already works.",
  lead: "Templates make results far more reliable than a blank page. Each one is a complete, original game you can play right now.",
  cta: { label: "Open the maker", href: "/create" },
};

export const daily = {
  label: "Daily challenge",
  title: "One game. Everyone. Today.",
  text: "A new mini-game every day at 00:00 UTC. Finish it to keep your streak and climb the top 100.",
  cta: { label: "Play today's challenge", href: "/daily" } satisfies Cta,
  countdownLabel: "Next challenge in",
};

export const promos = [
  {
    id: "recommend",
    label: "Game picks",
    title: "Not sure what to play next?",
    text: "Tell us what you like and what you want to spend. We search a real game database, explain why each pick fits, and label free and paid games clearly.",
    cta: { label: "Get game picks", href: "/recommend" } satisfies Cta,
  },
  {
    id: "download",
    label: "Download",
    title: "Take your game anywhere.",
    text: "Download any game you make as one HTML file that opens offline, or as an itch.io-ready zip with a license and upload notes.",
    cta: { label: "Make a game", href: "/create" } satisfies Cta,
  },
];

export const howItWorks: { heading: Heading; steps: Step[] } = {
  heading: { label: "How it works", title: "Five steps, about a minute." },
  steps: [
    { title: "Pick", text: "Choose a runner, puzzle, shooter, clicker or maze starter, or type freely." },
    { title: "Describe", text: `Say what you want in up to ${POLICY.promptMaxChars} characters.` },
    { title: "Generate", text: "The AI writes one self-contained HTML file and it starts in the player." },
    { title: "Improve", text: "Ask for changes, or press Fix it to send errors back for a repair." },
    { title: "Share", text: "Save privately, publish to the gallery, or download the file." },
  ],
};

export const trending: Heading & { cta: Cta } = {
  label: "Gallery",
  title: "Fresh from the community",
  lead: "Games players published this week. Play any of them without an account.",
  cta: { label: "Browse the gallery", href: "/gallery" },
};

export const creators: Heading = {
  label: "Creators",
  title: "Made by players like you",
  lead: "Featured creators from this month's staff picks.",
};

export const finalCta: Heading & { primary: Cta; secondary: Cta } = {
  label: "Start now",
  title: "Ready to make your first game?",
  lead: `Sign in, describe your idea, and play it a minute later. Free accounts get ${POLICY.dailyBuilds.free} builds every day.`,
  primary: { label: "Start creating", href: "/create" },
  secondary: { label: "See plans", href: "/pricing" },
};
