import type { Metadata } from "next";
import Link from "next/link";

import { AskKeiriButton } from "@/components/chat/AskKeiriButton";
import { Reveal } from "@/components/ui/scroll";
import { CtaStrip, Section, SectionHead } from "@/components/ui/sections";
import { breadcrumbJsonLd, faqJsonLd, JsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Finance automation glossary",
  description:
    "Plain-language definitions of the finance-automation and Indian compliance terms used across Keiri — GSTR-2B, ITC, three-way matching, SOD and more.",
  path: "/glossary",
});

/**
 * New page — GEO (spec D16), not a legacy migration.
 *
 * Definitional content is the single most-quoted page type for answer engines,
 * and it is a genuine user aid: the site uses terms like "three-way matching"
 * and "GSTR-2B" throughout without ever defining them.
 *
 * Each entry is answer-first and self-contained so it can be quoted on its own.
 * Definitions describe standard industry and Indian statutory concepts — no
 * Keiri capability is claimed here that isn't claimed elsewhere on the site.
 */

interface Term {
  readonly term: string;
  readonly definition: string;
}

const TERMS: readonly Term[] = [
  {
    term: "Three-way matching",
    definition:
      "A control that compares a supplier invoice against the purchase order and the goods receipt note before payment is approved. When all three agree within tolerance, the invoice can post automatically; when they disagree, the difference is an exception for a person to resolve.",
  },
  {
    term: "GSTR-2B",
    definition:
      "A static, auto-drafted input tax credit statement generated monthly for each GSTIN from suppliers' filings. Because it does not change once generated, it is the standard basis for reconciling purchases against what suppliers have actually reported.",
  },
  {
    term: "Input tax credit (ITC)",
    definition:
      "The GST a business has paid on its purchases that it can set off against the GST it collects on sales. ITC is only claimable when statutory conditions are met, which is why eligibility is computed rather than assumed.",
  },
  {
    term: "GSTR-1",
    definition:
      "The monthly or quarterly return reporting outward supplies. It has multiple tables covering different supply types, plus amendment tables for correcting earlier periods — which is why 'full table coverage' matters when a return is built automatically.",
  },
  {
    term: "TDS (tax deducted at source)",
    definition:
      "Tax withheld by the payer at the time of payment and deposited with the government on the payee's behalf. The rate depends on the nature of the payment, which is why computation is section-aware.",
  },
  {
    term: "Lower deduction certificate (LDC)",
    definition:
      "A certificate allowing tax to be deducted at a rate below the standard one for a specific payee. Applying it correctly requires tracking its validity period and threshold.",
  },
  {
    term: "The financial close",
    definition:
      "The recurring process of finalising a period's books: reconciling accounts, posting accruals and adjustments, explaining variances, and producing statements. Commonly a week or more when done manually.",
  },
  {
    term: "Accrual",
    definition:
      "An entry recognising income or expense in the period it relates to, rather than when cash moves. Recurring accruals are predictable by definition, which makes them a natural automation target.",
  },
  {
    term: "Flux (variance) analysis",
    definition:
      "Comparing actual results against a prior period or budget and explaining the movements that matter. The analytical work is the explanation; identifying which movements exceed a threshold is mechanical.",
  },
  {
    term: "Reconciliation",
    definition:
      "Confirming that two independent records of the same transactions agree — a bank statement against the ledger, for example. High-volume matching is mechanical; genuine discrepancies need judgment.",
  },
  {
    term: "Schedule III",
    definition:
      "The format prescribed under the Companies Act, 2013 for how Indian companies present their balance sheet and statement of profit and loss.",
  },
  {
    term: "Segregation of duties (SOD)",
    definition:
      "A control that keeps preparation, review and approval in different hands so no single person can complete a sensitive transaction alone. Often implemented as maker-checker separation.",
  },
  {
    term: "Maker-checker",
    definition:
      "A specific form of segregation of duties in which one person enters a transaction and a different person approves it before it takes effect.",
  },
  {
    term: "Audit trail",
    definition:
      "A record of every action taken in a system — what changed, who changed it, and when. It is tamper-evident when the record cannot be altered without detection.",
  },
  {
    term: "Consolidation",
    definition:
      "Combining the financial statements of a group of entities into one set, eliminating intercompany transactions so internal activity is not double-counted.",
  },
  {
    term: "Rolling forecast",
    definition:
      "A forecast that is re-based each period so it always looks the same distance ahead — typically twelve months — rather than counting down to a fixed year-end.",
  },
  {
    term: "Dunning",
    definition:
      "The process of systematically chasing overdue receivables, usually with escalating reminders based on how long an invoice has been outstanding.",
  },
  {
    term: "Ageing",
    definition:
      "A breakdown of outstanding receivables or payables by how long they have been unpaid — typically 0–30, 31–60, 61–90 days and beyond. It drives collections priority.",
  },
  {
    term: "e-Invoice (IRP)",
    definition:
      "Under Indian GST, the process of registering a B2B invoice with an Invoice Registration Portal, which returns a unique reference number and signed QR code.",
  },
  {
    term: "IFC / ICFR",
    definition:
      "Internal Financial Controls / Internal Control over Financial Reporting — the framework of controls over the preparation of financial statements, and the testing that evidences they operate.",
  },
];

export default function GlossaryPage() {
  return (
    <>
      <JsonLd
        data={[
          // Definitional Q&A is what answer engines quote, so it is marked up
          // as FAQ rather than left as plain prose.
          faqJsonLd(
            TERMS.map((entry) => ({
              q: `What is ${entry.term}?`,
              a: entry.definition,
            })),
          ),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Glossary", path: "/glossary" },
          ]),
        ]}
      />

      <section className="page-hero">
        <div className="glow" />
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link> / Glossary
          </div>
          <h1>Finance automation, in plain language.</h1>
          <p className="lede">
            The terms we use across this site, defined without jargon — from
            GSTR-2B and input tax credit to three-way matching and segregation
            of duties.
          </p>
        </div>
      </section>

      <Section>
        <SectionHead eyebrow="Glossary" title="Terms and definitions" />
        <div style={{ marginTop: 10 }}>
          {TERMS.map((entry) => (
            <Reveal className="glossary-entry" key={entry.term}>
              <h3 id={entry.term.toLowerCase().replace(/[^a-z0-9]+/g, "-")}>
                {entry.term}
              </h3>
              <p>{entry.definition}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section variant="alt">
        <SectionHead
          eyebrow="Still unclear?"
          title="Ask Keiri about any of these."
        >
          <p>
            The assistant can explain any of these terms in the context of your
            own workflow.
          </p>
        </SectionHead>
        <div style={{ marginTop: 24 }}>
          <AskKeiriButton className="btn btn-outline-dark">
            Ask Keiri a question
          </AskKeiriButton>
        </div>
      </Section>

      <CtaStrip />
    </>
  );
}
