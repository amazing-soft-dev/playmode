import type { GalleryTab } from "@/lib/repos/types";

/** Copy for the community gallery (plan section 05, feature 5). */
export const gallery = {
  label: "Gallery",
  title: "Games made by players",
  lead: "Play anything without an account. Signed-in players can like a game once, and every game has a report button.",
  tabs: [
    { id: "new", label: "New" },
    { id: "top-week", label: "Most liked this week" },
    { id: "staff-picks", label: "Staff picks" },
  ] satisfies { id: GalleryTab; label: string }[],
  weeklyNote: "Weekly likes reset every Monday at 00:00 UTC.",
  allTags: "All",
  empty: "No games match yet. Make the first one!",
  likes: (n: number) => `${n.toLocaleString("en-US")} likes`,
  plays: (n: number) => `${n.toLocaleString("en-US")} plays`,
} as const;
