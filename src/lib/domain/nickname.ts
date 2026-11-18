/**
 * Generated nicknames for under-18 accounts and leaderboard rows (plan sections 05 and 11). Built
 * only from friendly words, so a nickname can never spell out a real name or anything offensive.
 */
const ADJECTIVES = [
  "Pixel",
  "Quiet",
  "Moss",
  "Lumen",
  "Volt",
  "Cloud",
  "Sunny",
  "Echo",
  "Nova",
  "Tiny",
  "Retro",
  "Blue",
  "Swift",
  "Brave",
  "Cosmic",
  "Lucky",
  "Mellow",
  "Neon",
  "Turbo",
  "Velvet",
  "Amber",
  "Frost",
  "Golden",
  "Jolly",
];
const NOUNS = [
  "Otter",
  "Fox",
  "Byte",
  "Kite",
  "Wren",
  "Pine",
  "Glitch",
  "Atlas",
  "Badger",
  "Comet",
  "Heron",
  "Mango",
  "Panda",
  "Falcon",
  "Maple",
  "Rocket",
  "Pebble",
  "Lynx",
  "Koala",
  "Orbit",
  "Cactus",
  "Tiger",
  "Raven",
  "Sprout",
];

/** A nickname like "NovaBadger21". Pass a random source for deterministic output in tests. */
export function generateNickname(random: () => number = Math.random): string {
  const pick = <T>(list: readonly T[]) => list[Math.floor(random() * list.length)]!;
  const digits = String(Math.floor(random() * 90) + 10);
  return `${pick(ADJECTIVES)}${pick(NOUNS)}${digits}`;
}

/** True if a string has the shape of a generated nickname. */
export function isGeneratedNickname(name: string): boolean {
  return /^[A-Z][a-z]+[A-Z][a-z]+\d{2}$/.test(name);
}
