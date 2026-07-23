import type { Metadata } from "next";

import "@/styles/globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://keiritech.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Keiri Tech — AI that runs the financial back office end to end",
    template: "%s | Keiri Tech",
  },
  description:
    "Enterprise finance automation for CFOs, controllers and CA firms. " +
    "Payables and receivables, the monthly close, FP&A, tax and audit — run end to end.",
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <head>
        {/* Geo targeting — spec D16. India-first audience. */}
        <meta name="geo.region" content="IN" />
      </head>
      <body>{children}</body>
    </html>
  );
}
