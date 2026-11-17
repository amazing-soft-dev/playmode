import { POLICY } from "@/lib/domain/policy";

/** Copy for /parents (plan sections 04, 11 and 12). Plain language for parents and teachers. */
export const parents = {
  label: "Parents and teachers",
  title: "How PlayerMode keeps kids safe",
  lead: "Kids are a big part of our audience, so we built the site to collect as little as possible and to keep every game locked down.",
  sections: [
    {
      id: "accounts",
      title: "No accounts for under-13s",
      points: [
        "Players under 13 can play the daily challenge and the gallery without an account.",
        "We ask for a year of birth only, in a neutral way, and remember the answer so a child can't simply try a different year.",
        `Accounts in the EEA start at ${POLICY.minAccountAgeEea}, as GDPR Article 8 requires.`,
        "Under-18 accounts show a generated nickname, never a chosen name, on games and leaderboards.",
      ],
    },
    {
      id: "data",
      title: "What we store",
      points: [
        "For players without an account: a random id in the browser so their streak works. No name, email or free text.",
        "For accounts: email, display name, year of birth (not the full date) and country.",
        "Inactive accounts and anonymous ids are deleted after a set period, listed in our privacy policy.",
        "No ad pixels or cross-site tracking anywhere on the site; analytics are cookie-light.",
      ],
    },
    {
      id: "ads",
      title: "Ads",
      points: [
        "Pages are marked for child treatment for under-13s and unknown ages, which turns off personalized ads and third-party ad vendors.",
        "Teens get teen treatment, which also turns off personalized ads.",
        "Plus subscribers see no ads. Plus is for adults only; a teen has to ask a parent to buy it.",
      ],
    },
    {
      id: "games",
      title: "How games are kept safe",
      points: [
        "Every game is written by AI from a player's prompt, so we treat it as untrusted code.",
        "Games run in a locked-down frame on a separate origin. They cannot read the site's cookies or storage, reach the internet, open windows or navigate the page.",
        "Prompts, titles and the text inside games are checked before anything is built or published, and trademarked characters are swapped for original ones.",
        `Every game has a Report button. ${POLICY.reportHideThreshold} reports hide a game until our team reviews it, within ${POLICY.reportReviewHours} hours.`,
      ],
    },
    {
      id: "help",
      title: "What you can do",
      points: [
        "Report any game from its page, with or without an account.",
        "Ask us to delete an account or any data linked to a child using the form below.",
        "Teachers: tell us how you'd use PlayerMode in class. An ad-free classroom mode is on our list.",
      ],
    },
  ],
  formTitle: "Contact the team",
  formLead: "Questions, a deletion request, or a game you're worried about. A person reads every message.",
} as const;
