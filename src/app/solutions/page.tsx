import type { Metadata } from "next";
import Link from "next/link";

import { AskKeiriButton } from "@/components/chat/AskKeiriButton";
import { Reveal } from "@/components/ui/scroll";
import {
  CardGrid,
  CtaStrip,
  Section,
  SectionHead,
} from "@/components/ui/sections";
import { breadcrumbJsonLd, JsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Solutions",
  description:
    "Each Keiri solution automates one back-office workflow end to end — payables and receivables, the close, FP&A, tax and compliance, audit and controls.",
  path: "/solutions",
});

/** ⛔ Copy verbatim from the legacy `solutions.html`. */

const WORKFLOWS = [
  {
    href: "/payables-receivables",
    icon: "ledger" as const,
    title: "Payables & receivables",
    body: "Invoice capture, three-way matching, approval routing and collections — the full procure-to-pay and order-to-cash cycle, automated.",
    linkLabel: "Explore solution →",
  },
  {
    href: "/financial-close",
    icon: "checkbox" as const,
    title: "The financial close",
    body: "Reconciliations, accruals, variance analysis and consolidation, with a real-time view of where the close stands.",
    linkLabel: "Explore solution →",
  },
  {
    href: "/fpa",
    icon: "chart" as const,
    title: "FP&A & forecasting",
    body: "Rolling forecasts, cash-flow projections and board MIS that refresh as actuals land — no rebuilding models each month.",
    linkLabel: "Explore solution →",
  },
  {
    href: "/tax-compliance",
    icon: "receipt" as const,
    title: "Tax & compliance",
    body: "GST, TDS and income-tax workflows that reconcile, compute and stay filing-ready against a calendar that never slips.",
    linkLabel: "Explore solution →",
  },
  {
    href: "/audit-controls",
    icon: "search" as const,
    title: "Audit & controls",
    body: "Audit trails, segregation of duties and control testing built into every workflow, so assurance is continuous.",
    linkLabel: "Explore solution →",
  },
  {
    href: "/platform",
    icon: "grid" as const,
    title: "The full platform",
    body: "See how the solutions share one source of truth, one set of controls and one audit trail.",
    linkLabel: "Explore platform →",
  },
];

const ROLES = [
  {
    href: "/for-cfos",
    icon: "rupee" as const,
    title: "For CFOs",
    body: "Live numbers, a faster close, and less risk sitting in spreadsheets.",
    linkLabel: "See the case →",
  },
  {
    href: "/for-controllers",
    icon: "bars" as const,
    title: "For controllers",
    body: "Less manual reconciliation, fewer fire drills, always audit-ready.",
    linkLabel: "See the case →",
  },
  {
    href: "/for-ca-firms",
    icon: "building" as const,
    title: "For CA firms",
    body: "Serve more clients with the same team, without dropping quality.",
    linkLabel: "See the case →",
  },
];

export default function SolutionsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
        ])}
      />

      <section className="page-hero">
        <div className="glow" />
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link> / Solutions
          </div>
          <h1>Automate the work your team dreads — one workflow at a time.</h1>
          <p className="lede">
            Start where the pain is sharpest. Each Keiri solution solves one
            back-office workflow end to end, and connects into the wider platform
            when you are ready.
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
        {/* BookYourAccountant is the group's one shipped product, so it gets a
            "Live product" badge — the counterpart to the roadmap badge on the
            solution pages. Both are load-bearing: together they tell a visitor
            what exists today and what does not. */}
        <Reveal>
          <a
            href="https://bookyouraccountant.com"
            rel="noopener"
            className="card bya-card"
          >
            <span className="live-badge">Live product</span>
            <h3 style={{ fontSize: "1.5rem" }}>BookYourAccountant</h3>
            <p>
              Our on-demand marketplace that connects MSMEs with verified
              chartered accountants — booked by the day, with proper GST invoices
              and no long-term lock-in. Where Keiri automates the back office,
              BookYourAccountant puts a qualified professional on call when you
              need one.
            </p>
            <span className="card-link">Visit bookyouraccountant.com →</span>
          </a>
        </Reveal>

        <CardGrid cards={WORKFLOWS} columns={2} />
      </Section>

      <Section variant="alt">
        <SectionHead eyebrow="By role" title="Different seats, same relief." />
        <CardGrid cards={ROLES} />
      </Section>

      <CtaStrip />
    </>
  );
}
