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
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IN"
      className={`${fraunces.variable} ${jakarta.variable} ${plexMono.variable}`}
    >
      <head>
        {/* Geo targeting — spec D16. India-first audience. */}
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="Greater Noida, India" />
        <script
          type="application/ld+json"
          // Static, developer-authored JSON-LD — no user input reaches this.
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
      </head>
      <body>
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
