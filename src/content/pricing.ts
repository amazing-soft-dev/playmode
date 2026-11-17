import { POLICY } from "@/lib/domain/policy";

import type { Faq } from "./types";

/** Copy for /pricing (plan sections 02 and 12). */
export const pricing = {
  label: "Pricing",
  title: "Play free. Build more with Plus.",
  lead: "Playing, the daily challenge and game picks are free for everyone. Plus raises your daily builds and removes ads.",
  limitReached: `You've used today's ${POLICY.dailyBuilds.free} free builds. They come back at 00:00 UTC, or Plus gives you ${POLICY.dailyBuilds.plus} a day.`,
  perMonth: "/ month",
  current: "Your plan",
  freeCta: "Start free",
  plusCta: "Upgrade to Plus",
  teenTitle: "Ask a parent",
  teenText: "Plus is bought by an adult. Ask a parent or guardian to sign in with their own account and check out, then share the games you make together.",
  adultsOnly: "Plus is for adults. Payments are handled by Stripe; we never see card details.",
  mockCheckout: "Development build: checkout is simulated and no payment is taken.",
  priceNote: "Launch price. We'll set the final price after measuring the real cost of builds in beta.",
  faqs: [
    { id: "failed", question: "Does a failed build use up one of my builds?", answer: "No. Only builds that finish count. If a build times out, breaks or is blocked by our safety checks, it's free." },
    { id: "reset", question: "When do my free builds reset?", answer: "Every day at 00:00 UTC, the same moment the daily challenge changes." },
    { id: "fixes", question: "Do fixes count as builds?", answer: `The first ${POLICY.freeRepairsPerBuild} Fix it passes on each build are free. After that, a fix counts as a build.` },
    { id: "kids", question: "Can my child buy Plus?", answer: "No. Plus is adults only. Players under 13 play without an account, and teens need a parent to check out with their own account." },
    { id: "cancel", question: "Can I cancel any time?", answer: "Yes. Cancel from your account page; Plus stays active until the end of the period you paid for." },
  ] satisfies Faq[],
} as const;
