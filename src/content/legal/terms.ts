import type { LegalSection } from "@/components/legal/LegalDoc";

export const terms = {
  updated: "November 17, 2026",
  intro:
    "These terms cover your use of PlayerMode, a site where you describe games, an AI writes them, and you can play, share and download them.",
  sections: [
    {
      heading: "Who can use PlayerMode",
      body: [
        "Anyone can play games on PlayerMode. You need an account to make games, and accounts are for people 13 and older (16 and older in the European Economic Area). Players under 18 need permission from a parent or guardian, and paid plans are for adults only.",
      ],
    },
    {
      heading: "Your account",
      body: [
        "Keep your sign-in details to yourself and tell us if you think someone else is using your account. We may suspend accounts that break these terms or put other players at risk.",
      ],
    },
    {
      heading: "Games you make",
      body: [
        "You own what you contribute, such as your prompts, titles and descriptions. Copyright in purely AI-generated code is uncertain, so we don't promise you exclusive rights in the generated game itself.",
        "When you publish a game, you give PlayerMode a worldwide, non-exclusive licence to host, display, run and promote it on the site and in our marketing. You choose a licence for other players (for example All rights reserved or a Creative Commons licence), shown on the game page and in downloads.",
      ],
    },
    {
      heading: "What's not allowed",
      body: [
        "Don't make or publish games that are unsuitable for players aged 8 and up, use other people's characters, names, logos, music or levels, harass anyone, or try to break the site or the game sandbox. Trademarked names in prompts are replaced with original stand-ins, and we may remove games that break these rules.",
      ],
    },
    {
      heading: "Builds and paid plans",
      body: [
        "Free accounts get a daily number of AI builds; failed builds don't count. Plus raises the limit and removes ads. Payments are handled by Stripe; you can cancel any time and keep Plus until the end of the paid period. Limits may change as we learn what builds cost.",
      ],
    },
    {
      heading: "Game recommendations and links",
      body: [
        "Game picks come from a third-party game database. Some store links are affiliate links, which means we may earn a commission if you buy. We don't control other sites.",
      ],
    },
    {
      heading: "Reports and takedowns",
      body: [
        "Every game has a Report button. Games with several reports are hidden until we review them. Copyright owners can use our DMCA process.",
      ],
    },
    {
      heading: "Disclaimers and liability",
      body: [
        "PlayerMode is provided as is. AI-generated games can contain mistakes. To the extent the law allows, we are not liable for indirect losses, and our total liability is limited to what you paid us in the last 12 months.",
      ],
    },
    {
      heading: "Changes",
      body: [
        "We'll post changes here and tell account holders about important ones. Continuing to use PlayerMode after a change means you accept the new terms.",
      ],
    },
  ] satisfies LegalSection[],
};
