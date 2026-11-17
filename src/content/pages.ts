import { POLICY } from "@/lib/domain/policy";

import type { Faq } from "./types";

/** Copy for /about, /faq and /contact. */
export const about = {
  label: "About",
  title: "Everyone has a game idea",
  lead: "PlayerMode turns a sentence into a playable HTML5 game, so anyone can go from idea to play in about a minute.",
  mission: {
    label: "Why we built it",
    title: "Game portals let you play. We let you make —",
    muted: "and then play with everyone else.",
    body: [
      "Free web game portals already have millions of games. What they don't have is the game you thought of on the bus this morning. PlayerMode starts there: describe it, play it, change it, share it.",
      "Every game begins from a tested template, so it actually works. Every game runs in a locked-down player, so it's safe to try. And every day there's a new challenge that everyone plays, because games are better together.",
    ],
  },
  principles: [
    { title: "Safe by default", text: "Games are untrusted code until proven otherwise. They run sandboxed, can't reach the internet, and are checked before they're published." },
    { title: "Kids first", text: "No accounts or personal data for under-13s, child-safe ads, and generated nicknames for teens." },
    { title: "Original, not copied", text: "Genres and mechanics are fair game. Other people's characters, names and levels aren't, so we swap them for originals." },
    { title: "Honest picks", text: "Recommendations come from a real game database, never invented, with free and paid labels and affiliate links disclosed." },
  ],
};

export const faq = {
  label: "FAQ",
  title: "Questions, answered",
  lead: "How builds work, how we keep games safe, and what's free.",
  groups: [
    {
      title: "Making games",
      items: [
        { id: "how", question: "How does the game maker work?", answer: "Pick a starter template (runner, puzzle, shooter, clicker or maze) or type freely, describe your game, and the AI writes a single HTML file. It starts in the player in about a minute." },
        { id: "limit", question: "How many games can I make?", answer: `Free accounts get ${POLICY.dailyBuilds.free} builds a day and Plus gets ${POLICY.dailyBuilds.plus}. Failed builds never count, and limits reset at 00:00 UTC.` },
        { id: "fix", question: "My game is broken. What now?", answer: `Press Fix it: we send the game's error messages back to the AI for a repair pass. The first ${POLICY.freeRepairsPerBuild} fixes per build are free.` },
        { id: "own", question: "Who owns the games I make?", answer: "You own what you contribute, and you choose a licence when you publish. Copyright in purely AI-generated code is uncertain, so we don't promise exclusive rights in the generated code." },
        { id: "download", question: "Can I download my game?", answer: "Yes. Download it as one HTML file that works offline, or as an itch.io-ready zip with a licence and upload notes." },
      ] satisfies Faq[],
    },
    {
      title: "Safety and privacy",
      items: [
        { id: "kids", question: "Can kids use PlayerMode?", answer: "Yes. Players under 13 can play the daily challenge and the gallery without an account, and we don't collect personal data from them." },
        { id: "safe", question: "How do you keep AI-written games safe?", answer: "Every game runs in a sandboxed frame on a separate origin with no network access. Prompts, titles and game text are checked first, and players can report any game." },
        { id: "copy", question: "Can I make a game with my favourite characters?", answer: "We can't use other people's characters or names, so we swap them for original look-alikes and tell you what changed." },
      ] satisfies Faq[],
    },
    {
      title: "Daily challenge and picks",
      items: [
        { id: "daily", question: "When does the daily challenge change?", answer: "Every day at 00:00 UTC. Finish it to keep your streak going." },
        { id: "prizes", question: "Are there prizes?", answer: "No. Scores from browser games can be faked, so the leaderboard is for fun. Scores outside a game's normal range are rejected." },
        { id: "picks", question: "Where do game picks come from?", answer: "From a real game database. The AI turns your request into filters and explains each result using only that game's own details. Some store links are affiliate links." },
      ] satisfies Faq[],
    },
  ],
};

export const contactPage = {
  label: "Contact",
  title: "Talk to the team",
  lead: "Feedback, a bug, a partnership or a press question. A person reads every message.",
  topics: [
    { value: "feedback", label: "Feedback or an idea" },
    { value: "bug", label: "Something isn't working" },
    { value: "copyright", label: "Copyright or a takedown" },
    { value: "business", label: "Partnerships or press" },
  ],
  asideTitle: "Other ways to reach us",
  aside: [
    { label: "Parents and teachers", href: "/parents#contact" },
    { label: "Report a game", href: "/gallery" },
    { label: "Copyright notices", href: "/legal/dmca" },
  ],
};
