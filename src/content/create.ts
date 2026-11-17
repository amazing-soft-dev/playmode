import { POLICY } from "@/lib/domain/policy";

/** Copy for the game maker (/create), following plan section 05. */
export const create = {
  label: "Game maker",
  title: "Describe a game. We'll build it.",
  lead: "Pick a starter, say what you want, and play it in about a minute. Every game runs in a locked-down player and can be saved, published or downloaded.",
  templateLabel: "1. Pick a starting point",
  freeformLabel: "Free form",
  freeformText: "No template. Less reliable, more surprising.",
  promptLabel: "2. Describe the game",
  promptHint: `Up to ${POLICY.promptMaxChars} characters. Name the hero, the goal and what gets in the way.`,
  useExample: "Use an example",
  generate: "Generate game",
  generating: "Building your game…",
  signInToGenerate: "Sign in to generate",
  signedOutNote: "You can try the example games without an account. Sign in to build your own.",
  quota: (remaining: number, limit: number) => `${remaining} of ${limit} free builds left today`,
  limitReached: "You've used today's builds. They reset at 00:00 UTC, or upgrade for more.",
  failedNoCharge: "The build didn't finish, so it didn't use a build. Try again, or shorten the prompt.",
  franchiseNotice: "We swapped trademarked names for original stand-ins:",
  stages: [
    "Checking your prompt",
    "Loading the starter template",
    "Writing the game loop",
    "Drawing the art in code",
    "Running the safety scan",
  ],
  previewLabel: "Preview",
  emptyPreview: "Your game appears here.",
} as const;
