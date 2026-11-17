import type { NavGroup, NavLink } from "./types";

/** Header links (desktop). The rest live in the all-pages menu. */
export const primaryNav: NavLink[] = [
  { label: "Create", href: "/create", description: "Describe a game and play it a minute later" },
  { label: "Daily", href: "/daily", description: "One new challenge every day, with streaks and a leaderboard" },
  { label: "Gallery", href: "/gallery", description: "Games made by the community" },
  { label: "Picks", href: "/recommend", description: "AI game recommendations, free and paid" },
  { label: "Pricing", href: "/pricing", description: "Free and Plus plans" },
];

/** Every page, grouped, for the all-pages menu, the mobile menu and search. */
export const allPages: NavGroup[] = [
  {
    title: "Play and make",
    links: [
      { label: "Home", href: "/", description: "Start here" },
      ...primaryNav,
      { label: "Account", href: "/account", description: "Your games, usage and plan" },
      { label: "Sign in", href: "/login", description: "Sign in to build games" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "About", href: "/about", description: "Why PlayerMode exists and how it works" },
      { label: "News", href: "/news", description: "Devlog and product updates" },
      { label: "FAQ", href: "/faq", description: "Answers about builds, safety and plans" },
      { label: "Parents and teachers", href: "/parents", description: "How we handle kids, ads and data" },
      { label: "Contact", href: "/contact", description: "Talk to the team" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/legal/terms", description: "Terms of service" },
      { label: "Privacy", href: "/legal/privacy", description: "Privacy policy" },
      { label: "DMCA", href: "/legal/dmca", description: "Copyright takedown requests" },
      { label: "Media credits", href: "/legal/credits", description: "Photographers and videographers" },
    ],
  },
];

export const footerNav: NavGroup[] = [
  {
    title: "Product",
    links: [
      { label: "Game maker", href: "/create" },
      { label: "Daily challenge", href: "/daily" },
      { label: "Gallery", href: "/gallery" },
      { label: "Game picks", href: "/recommend" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "News", href: "/news" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Safety",
    links: [
      { label: "Parents and teachers", href: "/parents" },
      { label: "Terms", href: "/legal/terms" },
      { label: "Privacy", href: "/legal/privacy" },
      { label: "DMCA", href: "/legal/dmca" },
      { label: "Media credits", href: "/legal/credits" },
    ],
  },
];
