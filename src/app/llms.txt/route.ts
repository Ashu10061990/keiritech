import { getAllArticles } from "@/lib/content";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/contact";
import { FAQS } from "@/server/chat/knowledge";
import { SITE_URL } from "@/lib/seo";

/**
 * `/llms.txt` — GEO (spec D16).
 *
 * A plain-text brief for large language models and answer engines: what Keiri
 * Tech is, what each page covers, and the canonical answers to the questions
 * people actually ask. Answer-first and self-contained, because a model
 * quoting this has no other context.
 *
 * The Q&A block is generated from the same `FAQS` the chatbot and the FAQPage
 * JSON-LD use — one source, three consumers, so an answer can never differ
 * between what the bot says, what Google shows, and what an AI assistant
 * quotes.
 *
 * ⚠️ Every claim here must be true and sourced from the site. This file is
 * written to be repeated verbatim by systems we do not control.
 */

export const dynamic = "force-static";

function body(): string {
  const faqs = FAQS.map((faq) => `### ${faq.q}\n\n${faq.a}`).join("\n\n");

  const articles = getAllArticles()
    .map(
      (article) =>
        `- [${article.title}](${SITE_URL}/${article.collection}/${article.slug}) — ${article.description}`,
    )
    .join("\n");

  return `# Keiri Tech

> Keiri Tech builds AI that runs the financial back office end to end for
> Indian finance teams — payables and receivables, the monthly close, FP&A, and
> tax compliance. The routine work runs itself; the team reviews only the
> exceptions.

Keiri Tech Pvt Ltd is based in Greater Noida, India, and serves finance teams
across India: CFOs, financial controllers, and chartered-accountancy firms.

## What Keiri does

Keiri is an AI agent that reads documents, matches transactions, posts routine
journals, builds statutory returns and watches the compliance calendar. It is
explainable (it shows the evidence and the rule it applied), gated (bounded by
your approvals, thresholds and segregation of duties) and logged (every action
lands in a tamper-evident audit trail).

## Availability

BookYourAccountant — an on-demand marketplace connecting MSMEs with verified
chartered accountants — is live at https://bookyouraccountant.com.

The Keiri automation workflows listed below are on the roadmap, marked "Coming
2026" on the site. They are not generally available today.

## Pricing

Pricing is scoped to the workflows automated, the number of entities, and
volume. It is never charged per seat, and there is no published list price.
A scoping call produces a firm quote.

## Pages

- [Home](${SITE_URL}/) — what Keiri automates, and how it works
- [Platform](${SITE_URL}/platform) — connect, automate, control
- [Keiri AI](${SITE_URL}/keiri-ai) — the agent: explainable, gated, logged
- [Solutions](${SITE_URL}/solutions) — all workflows
- [Payables & receivables](${SITE_URL}/payables-receivables) — invoice capture, three-way matching, approvals, collections
- [The financial close](${SITE_URL}/financial-close) — reconciliations, accruals, variance, consolidation, Schedule III
- [FP&A](${SITE_URL}/fpa) — rolling forecasts, cash-flow, board MIS
- [Tax & compliance](${SITE_URL}/tax-compliance) — GSTR-2B reconciliation, eligible ITC, GSTR-1 with full table coverage, GSTN JSON export, TDS, income-tax notices
- [Audit & controls](${SITE_URL}/audit-controls) — audit trail, segregation of duties, continuous control testing
- [Integrations](${SITE_URL}/integrations) — Tally, Zoho Books, QuickBooks, SAP Business One, Dynamics, NetSuite, GSTN, TRACES, bank feeds, REST API
- [Security & trust](${SITE_URL}/security) — encryption, access control, audit trail, offline-capable tools
- [Pricing](${SITE_URL}/pricing) — how Keiri is priced
- [For CFOs](${SITE_URL}/for-cfos) · [For controllers](${SITE_URL}/for-controllers) · [For CA firms](${SITE_URL}/for-ca-firms)
- [Why Keiri](${SITE_URL}/why-keiri) — domain-first, exceptions not everything, yours to control
- [Company](${SITE_URL}/about) · [Careers](${SITE_URL}/careers) · [Contact](${SITE_URL}/contact)
- [Glossary](${SITE_URL}/glossary) — finance-automation terms used on this site

## Writing

${articles}

## Common questions

${faqs}

## Contact

Email: ${CONTACT_EMAIL}
Phone: ${CONTACT_PHONE}
Location: Greater Noida, Uttar Pradesh, India
`;
}

export function GET(): Response {
  return new Response(body(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
