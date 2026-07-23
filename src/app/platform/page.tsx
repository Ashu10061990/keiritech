import type { Metadata } from "next";
import Link from "next/link";

import { AskKeiriButton } from "@/components/chat/AskKeiriButton";
import { MockPanel } from "@/components/SolutionPage";
import { Reveal } from "@/components/ui/scroll";
import { CtaStrip, Section, SectionHead } from "@/components/ui/sections";
import type { FeatureRowSpec } from "@/content/solutions";
import {
  breadcrumbJsonLd,
  JsonLd,
  softwareApplicationJsonLd,
} from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "The platform",
  description:
    "Keiri connects your ERP, GL, GSTN and bank data into one source of truth, automates the workflows on top of it, and keeps a complete audit trail.",
  path: "/platform",
});

/** ⛔ Copy verbatim from the legacy `platform.html`. */

const PILLARS: readonly FeatureRowSpec[] = [
  {
    num: "CONNECT",
    title: "A single source of truth",
    body: "Keiri unifies data from your ERP, general ledger, GSTN portal, bank statements and spreadsheets into one connected layer — so reconciliations start from agreement, not from chasing files over email.",
    points: [
      "Prebuilt connectors for common Indian GLs and Tally",
      "Bank and GSTN feeds pulled on a schedule",
      "Spreadsheet imports that map to your chart of accounts",
    ],
    mock: {
      label: "Connected sources",
      rows: [
        { label: "Tally Prime", value: "synced 2m ago", ok: true },
        { label: "HDFC current a/c", value: "412 txns", ok: true },
        { label: "GSTN · GSTR-2B", value: "imported", ok: true },
        { label: "Payroll sheet", value: "mapping" },
      ],
    },
  },
  {
    num: "AUTOMATE",
    title: "Workflows that run themselves",
    body: "Define a process once — three-way matching, an accrual schedule, a GST reconciliation — and Keiri runs it on time, every time, applying your rules and stopping only at the exceptions that need judgment.",
    points: [
      "Rule-based automation with thresholds and approvals",
      "Exception queues instead of full manual review",
      "Runs on your calendar across month, quarter and year-end",
    ],
    mock: {
      label: "Automation · 3-way match",
      rows: [
        { label: "Matched automatically", value: "1,204", ok: true },
        { label: "Needs review", value: "18" },
        { label: "Posted to GL", value: "1,186", ok: true },
      ],
      bar: "92%",
    },
  },
  {
    num: "CONTROL",
    title: "Visibility and a full audit trail",
    body: "Real-time dashboards show where the close stands, who owns what, and what's overdue. Every import, match, journal and approval is logged — so you walk into an audit with the record already built.",
    points: [
      "Role-based access and segregation of duties",
      "Immutable audit trail on every action",
      "Dashboards for status, ageing and risk",
    ],
    mock: {
      label: "Control dashboard",
      rows: [
        { label: "Controls passing", value: "26/26", ok: true },
        { label: "Approvals on file", value: "complete", ok: true },
        { label: "Open exceptions", value: "3" },
      ],
    },
  },
];

export default function PlatformPage() {
  return (
    <>
      <JsonLd
        data={[
          softwareApplicationJsonLd(),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Platform", path: "/platform" },
          ]),
        ]}
      />

      <section className="page-hero">
        <div className="glow" />
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link> / Platform
          </div>
          <h1>One platform for the whole financial back office.</h1>
          <p className="lede">
            Keiri connects your data, automates the work and keeps a complete
            record — so every number has a single, trustworthy source and every
            action has an owner.
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

      <Section>
        {PILLARS.map((pillar, index) => (
          <Reveal
            className={index % 2 === 1 ? "frow rev" : "frow"}
            key={pillar.num}
          >
            <div className="ftext">
              <div className="num">{pillar.num}</div>
              <h3>{pillar.title}</h3>
              <p>{pillar.body}</p>
              <ul>
                {pillar.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
            <MockPanel mock={pillar.mock} />
          </Reveal>
        ))}
      </Section>

      <Section variant="dark">
        <SectionHead
          eyebrow="The agent inside"
          title="Keiri AI does the work — you keep command."
          center
        >
          <p>
            Keiri isn&apos;t a black box. It executes the repetitive tasks,
            explains what it did in plain language, and never posts anything
            outside the controls you&apos;ve set.
          </p>
        </SectionHead>
        <div style={{ textAlign: "center", marginTop: 30 }}>
          <Link href="/keiri-ai" className="btn btn-gold">
            Meet Keiri AI
          </Link>
        </div>
      </Section>

      <CtaStrip />
    </>
  );
}
