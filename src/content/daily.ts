/** Copy for the daily challenge page (plan section 05, feature 4). */
export const daily = {
  label: "Daily challenge",
  title: "One game. Everyone. Today.",
  lead: "A new mini-game every day at 00:00 UTC. Finish it to keep your streak and climb the top 100.",
  themeLabel: "Today's theme",
  nextLabel: "Next challenge in",
  streakLabel: "Your streak",
  bestLabel: "Best",
  days: (n: number) => `${n} ${n === 1 ? "day" : "days"}`,
  leaderboardLabel: "Leaderboard",
  leaderboardTitle: "Top 100 today",
  you: "You",
  guest: "Guest player",
  submitted: (score: number) => `Score ${score.toLocaleString("en-US")} saved. Come back tomorrow to keep your streak.`,
  signInPrompt: "Sign in to put your name on the leaderboard and keep your streak on every device.",
  anonymousNote: "Playing without an account: your streak is kept in this browser only, and no name is shown.",
  rules: [
    "The challenge is the same for everyone and changes at 00:00 UTC.",
    "A finished game counts toward your streak. Miss a day and it starts again.",
    "Scores outside the game's normal range are rejected. There are no prizes, because scores from browser games can be faked.",
  ],
} as const;
