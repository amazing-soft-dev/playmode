import type { LegalSection } from "@/components/legal/LegalDoc";

export const dmca = {
  updated: "November 17, 2026",
  intro:
    "PlayerMode respects copyright. If you believe a game on the site infringes your rights, send us a notice and we'll act quickly.",
  sections: [
    {
      heading: "What to include in a notice",
      body: [
        "Your contact details; the work you believe is infringed; the PlayerMode page or game link; a statement that you believe in good faith the use is not authorised; a statement, under penalty of perjury, that the notice is accurate and that you are the owner or authorised to act for them; and your physical or electronic signature.",
      ],
    },
    {
      heading: "How to send it",
      body: [
        "Use the contact form and choose the copyright topic, or the Report button on the game page for a quick flag. We will register a designated agent with the US Copyright Office before launch and list the agent's details here.",
      ],
    },
    {
      heading: "What happens next",
      body: [
        "We remove or disable the game, tell the creator, and keep a record of the notice. Creators can send a counter-notice if they believe the removal was a mistake. We close the accounts of repeat infringers.",
      ],
    },
  ] satisfies LegalSection[],
};
