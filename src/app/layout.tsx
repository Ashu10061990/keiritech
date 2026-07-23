import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";

import { Footer } from "@/components/Footer";
import { ChatProvider } from "@/components/chat/chat-context";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { Header } from "@/components/nav/Header";
import { organizationJsonLd, webSiteJsonLd } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/seo";

import "@/styles/globals.css";

/**
 * The three legacy typefaces, self-hosted via next/font rather than the
 * render-blocking Google Fonts <link> the legacy pages used. `display: swap`
 * and preloading keep them off the critical path.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["opsz"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Keiri Tech — Financial process automation, run by AI",
    template: "%s | Keiri Tech",
  },
  description:
    "Keiri Tech builds AI that automates the financial back office — payables & receivables, the close, FP&A and tax compliance — for finance teams that want their hours back.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Keiri Tech",
    locale: "en_IN",
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  // Geo targeting (spec D16). These go through the Metadata API rather than a
  // hand-written <head>; see the note on the layout below.
  other: {
    "geo.region": "IN",
    "geo.placename": "Greater Noida, India",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IN"
      className={`${fraunces.variable} ${jakarta.variable} ${plexMono.variable}`}
    >
      {/*
        ⚠️ No hand-written <head> element here.

        A manual <head> in an App Router root layout produces malformed HTML:
        the browser hoists the head content into <body>, hydration fails, and
        every interactive element on the site goes dead — while every route
        still returns 200 and the markup still looks right in a screenshot.
        That is exactly what happened, and only clicking the chat button caught
        it.

        Metadata goes through the `metadata` export; JSON-LD renders in the
        body, which is the documented Next pattern and works fine for crawlers.
      */}
      <body>
        {/* Static, developer-authored JSON-LD — no user input reaches this. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteJsonLd()),
          }}
        />
        <ChatProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <ChatWidget />
        </ChatProvider>
      </body>
    </html>
  );
}
