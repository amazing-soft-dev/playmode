import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { SkipLink } from "@/components/a11y/SkipLink";
import { ProductionAnalytics } from "@/components/analytics/ProductionAnalytics";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { HeaderActions } from "@/components/layout/HeaderActions";
import { MotionProvider } from "@/components/motion";

import { brand, seo } from "@/content/site";

import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(seo.siteUrl),
  title: { default: seo.title, template: seo.titleTemplate },
  description: seo.description,
  applicationName: brand.name,
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    siteName: brand.name,
    locale: seo.locale,
    title: seo.title,
    description: seo.description,
  },
  twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      {
        url: "/icons/dark/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icons/light/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icons/dark/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icons/light/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: [{ url: "/icons/light/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: brand.name,
      url: seo.siteUrl,
      description: seo.description,
    },
    {
      "@type": "Organization",
      name: brand.name,
      url: seo.siteUrl,
      logo: `${seo.siteUrl}/icons/light/android-chrome-512x512.png`,
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <script
          type="application/ld+json"
          // Structured data for search engines: the site and the organisation behind it.
          // "<" is escaped so no string in the data can close the script element early.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <SkipLink />
        <MotionProvider>
          <Header actions={<HeaderActions />} />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
        </MotionProvider>
        <ProductionAnalytics />
      </body>
    </html>
  );
}
