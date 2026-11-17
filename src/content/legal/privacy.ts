import type { LegalSection } from "@/components/legal/LegalDoc";

export const privacy = {
  updated: "November 17, 2026",
  intro:
    "We collect as little as we can. Kids are a big part of our audience, so the simplest rule applies: we collect no personal data from players under 13.",
  sections: [
    { heading: "Players without an account", body: ["If you play without an account (including every player under 13), we keep a random id in your browser so your daily streak works, and the year of birth you entered if you tried to sign up, so the age question is asked only once. Neither leaves your device in this version of the site. We don't ask for a name, email or any free text."] },
    { heading: "Account holders", body: ["For an account we store your email, display name (a generated nickname if you are under 18), year of birth (not your full birthday), country and plan. We also store the games, prompts and versions you save, your likes, reports and daily scores, and how many builds you used each day."] },
    { heading: "How we use data", body: ["To run the site: sign you in, build and host your games, keep the leaderboard and streaks, enforce daily limits, moderate content and prevent abuse. We don't sell personal data."] },
    { heading: "Service providers", body: ["We use hosting (Vercel), a database and file storage (Supabase), an AI model provider to write games, a moderation service, Stripe for payments, Resend for email, and a game database for recommendations. They process data only to provide their service to us."] },
    { heading: "Ads and analytics", body: ["Ad requests are marked for child treatment for under-13s and unknown ages, and teen treatment for 13 to 17, which turns off personalized ads. There are no ad pixels or cross-site trackers. Our analytics are cookie-light and do not build profiles of individual players."] },
    { heading: "Retention", body: ["We delete inactive accounts and their data after 24 months of inactivity, and anonymous ids after 12 months. You can ask us to delete your data at any time."] },
    { heading: "Your rights", body: ["You can see, correct, export or delete your data, and parents can ask us to delete anything linked to their child. Use the contact form and we'll respond within 30 days. If you are in the EEA or UK you can also complain to your data protection authority."] },
    { heading: "Contact", body: ["Questions about privacy go through our contact form or the parents page. We'll publish a postal address and a data protection contact before launch."] },
  ] satisfies LegalSection[],
};
