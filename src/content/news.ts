import type { PhotoSlot } from "./media";

export interface Post {
  slug: string;
  title: string;
  date: string;
  category: "Devlog" | "Product" | "Safety";
  excerpt: string;
  photo: PhotoSlot;
  body: string[];
}

/** Devlog posts. Each post owns one photo slot, so no cover repeats elsewhere on the site. */
export const posts: Post[] = [
  {
    slug: "five-starter-templates",
    title: "Why every game starts from a template",
    date: "2026-11-17",
    category: "Devlog",
    excerpt: "Blank pages make broken games. Five tested starters make the AI's job far easier, and the results far more fun.",
    photo: "newsTemplates",
    body: [
      "Early tests were humbling: asked to write a whole game from nothing, the AI often produced something that looked right and played wrong. Missing restart buttons, enemies that never spawned, controls that only worked on a keyboard.",
      "So every build now starts from one of five original templates: a runner, a sliding puzzle, a shooter, a clicker and a maze. Each one already has a title screen, keyboard and touch controls, a score, game over and restart. The AI's job is to change the theme, the rules and the art, not to reinvent the game loop.",
      "Templates also keep games small and safe. They are single HTML files with no external requests, so they pass our safety scan before they ever reach the player.",
    ],
  },
  {
    slug: "daily-challenge-launch",
    title: "One game, everyone, every day",
    date: "2026-11-14",
    category: "Product",
    excerpt: "The daily challenge resets at 00:00 UTC. Finish it to keep your streak and climb the top 100.",
    photo: "newsDaily",
    body: [
      "Some of the best habits in games are tiny: one puzzle a day, the same for everyone. The daily challenge brings that to PlayerMode.",
      "Each day has a theme and a game built from one of our templates. The team reviews it ahead of time, and if nothing new is approved, a game from our approved backlog takes its place, so there is always something to play.",
      "Streaks count consecutive days with a finished game. The leaderboard shows the top 100, with generated nicknames for players under 18. There are no prizes: scores from browser games can be faked, so the board is just for fun.",
    ],
  },
  {
    slug: "how-we-keep-games-safe",
    title: "How we keep AI-written games safe",
    date: "2026-11-10",
    category: "Safety",
    excerpt: "Every game is untrusted code. Here's the stack of checks between a prompt and the player.",
    photo: "newsSafety",
    body: [
      "A game on PlayerMode is written by an AI from a stranger's prompt. We treat it as untrusted code from start to finish.",
      "First, the prompt is checked: unsuitable ideas are refused without using a build, and trademarked characters are swapped for original stand-ins. Then the generated file is scanned. Anything that could reach the internet, read storage, run remote code or navigate the page is rejected before it's saved.",
      "Finally, games run in a sandboxed frame on a separate origin with a strict content security policy. A game can report its score and its errors to the page, and nothing else. Every game also has a Report button, and three reports hide it until we review it.",
    ],
  },
  {
    slug: "gallery-opens",
    title: "The gallery is open",
    date: "2026-11-06",
    category: "Product",
    excerpt: "Publish what you make, like your favourites, and find something new every week.",
    photo: "newsGallery",
    body: [
      "Games you make can now be published to the gallery with a title, a short description, tags and a licence of your choice.",
      "The gallery has three views: New, Most liked this week (which resets every Monday at 00:00 UTC) and Staff picks. Anyone can play without an account, and signed-in players can like each game once.",
      "There are no comments yet. We'd rather keep moderation manageable and the gallery friendly while it grows.",
    ],
  },
];

export function postBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export const news = {
  label: "News",
  title: "Devlog and updates",
  lead: "What we're building, why, and what changed.",
};
