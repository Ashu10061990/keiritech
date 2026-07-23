import type { Metadata } from "next";
import Link from "next/link";

import { AskKeiriButton } from "@/components/chat/AskKeiriButton";
import { MockPanel } from "@/components/SolutionPage";
import { Reveal } from "@/components/ui/scroll";
import { CtaStrip, Section, SectionHead } from "@/components/ui/sections";
import { breadcrumbJsonLd, JsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Integrations",
  description:
    "Keiri connects to Tally, Zoho Books, SAP, NetSuite, the GSTN portal, TRACES, bank feeds and spreadsheets through prebuilt connectors and an open API.",
  path: "/integrations",
});

/** ⛔ Copy and connector names verbatim from the legacy `integrations.html`. */

const GROUPS = [
  {
    eyebrow: "Accounting & ERP",
    heading: "Your books, connected",
    variant: undefined,
    badges: [
      "Tally Prime",
      "Tally ERP 9",
      "Zoho Books",
      "QuickBooks",
      "Busy",
      "Marg",
      "SAP Business One",
      "Microsoft Dynamics",
      "Oracle NetSuite",
      "Sage",
    ],
  },
  {
    eyebrow: "Compliance & government",
    heading: "Statutory sources",
    variant: "alt" as const,
    badges: [
      "GSTN portal",
      "GSTR-2A / 2B",
      "e-Invoice (IRP)",
      "e-Way Bill",
      "TRACES (TDS)",
      "Income-tax portal",
    ],
  },
  {
    eyebrow: "Banking & data",
    heading: "Statements, files and more",
    variant: undefined,
    badges: [
      "Bank statement feeds",
      "CSV / Excel import",
      "Google Sheets",
      "Email capture",
      "Cloud storage",
      "REST API",
      "Webhooks",
    ],
  },
];

export default function IntegrationsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Platform", path: "/platform" },
          { name: "Integrations", path: "/integrations" },
        ])}
      />

      <section className="page-hero">
        <div className="glow" />
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link> / <Link href="/platform">Platform</Link> /
            Integrations
          </div>
          <h1>Connects to the systems you already run.</h1>
          <p className="lede">
            Keiri links to your ERP, ledgers, the GSTN portal, banks and
            spreadsheets through prebuilt connectors and open APIs — no
            rip-and-replace.
          </p>
          <div
            style={{ marginTop: 30, display: "flex", gap: 14, flexWrap: "wrap" }}
          >
            <Link href="/contact" className="btn btn-gold">
              Book a demo
            </Link>
            <AskKeiriButton className="btn btn-ghost">
              Ask Keiri →
            </AskKeiriButton>
          </div>
        </div>
      </section>

      {GROUPS.map((group) => (
        <Section variant={group.variant} key={group.heading}>
          <SectionHead eyebrow={group.eyebrow} title={group.heading} />
          <Reveal className="trust-strip" style={{ marginTop: 24 }}>
            {group.badges.map((badge) => (
              <div className="badge" key={badge}>
                {badge}
              </div>
            ))}
          </Reveal>
        </Section>
      ))}

      <Section variant="dark">
        <Reveal className="grid-2" style={{ alignItems: "center", gap: 54 }}>
          <div>
            <div className="eyebrow">Open by design</div>
            <h2>If it has an API, Keiri can reach it.</h2>
            <p>
              Beyond the prebuilt connectors, Keiri&apos;s open API and webhooks
              let your team or ours wire up anything else in your stack.
              Don&apos;t see a system you rely on? Tell us — connectors are added
              based on what customers need.
            </p>
            <div style={{ marginTop: 24 }}>
              <Link href="/contact" className="btn btn-gold">
                Ask about a connector
              </Link>
            </div>
          </div>
          <MockPanel
            mock={{
              label: "Integration health",
              rows: [
                { label: "Tally Prime", value: "synced", ok: true },
                { label: "GSTN", value: "connected", ok: true },
                { label: "Bank feed", value: "live", ok: true },
                { label: "API", value: "2 apps", ok: true },
              ],
            }}
          />
        </Reveal>
      </Section>

      <CtaStrip />
    </>
  );
}
