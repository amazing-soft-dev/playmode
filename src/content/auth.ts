/** Copy for /login and the age gate (plan section 12). */
export const login = {
  label: "Sign in",
  title: "Sign in to start building",
  lead: "Anyone can play. You need an account to make games, save your streak and appear on the leaderboard.",
  emailLabel: "Email",
  nameLabel: "Display name",
  nameHint: "Shown on your games. Players under 18 get a generated nickname instead.",
  yearLabel: "Year of birth",
  countryLabel: "Country",
  termsLabel: "I agree to the Terms and have read the Privacy policy.",
  submit: "Continue",
  mockNote: "Development build: sign-in is simulated in this browser. No email is sent and nothing leaves your device.",
  refused: {
    "under-13": {
      title: "You can still play!",
      text: "Accounts are for players 13 and older. You can play today's challenge and every game in the gallery without one, and nothing about you is stored.",
    },
    "eea-under-16": {
      title: "Accounts in your country start at 16",
      text: "Privacy law in your country requires players to be 16 to create an account. You can still play the daily challenge and the gallery without one.",
    },
    "invalid-year": {
      title: "Check your year of birth",
      text: "That year doesn't look right. Pick the year you were born.",
    },
  },
} as const;

/** Countries offered in the sign-in form; anything else is "Other". */
export const COUNTRIES: { code: string; name: string }[] = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "VN", name: "Vietnam" },
  { code: "MX", name: "Mexico" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "NL", name: "Netherlands" },
  { code: "PL", name: "Poland" },
  { code: "SE", name: "Sweden" },
  { code: "IE", name: "Ireland" },
  { code: "ZZ", name: "Other" },
];
