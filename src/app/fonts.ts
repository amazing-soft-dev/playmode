import { Geist_Mono, Host_Grotesk, Syne } from "next/font/google";

/**
 * The template's three families, self-hosted at build time by next/font (no request to Google
 * at runtime):
 * - Syne 700 for the oversized PLAYERMODE wordmark and display parentheses;
 * - Host Grotesk for uppercase headings;
 * - Geist Mono (light) for body copy, labels, navigation and buttons.
 */
export const display = Syne({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-syne",
  display: "swap",
});

export const sans = Host_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-host-grotesk",
  display: "swap",
});

export const mono = Geist_Mono({
  subsets: ["latin"],
  // 100: 404 numeral; 300: labels; 400: body and small text; 500: nav, buttons and caps.
  weight: ["100", "300", "400", "500"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const fontVariables = `${display.variable} ${sans.variable} ${mono.variable}`;
