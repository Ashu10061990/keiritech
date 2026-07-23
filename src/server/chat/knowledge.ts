/**
 * Keiri Tech chatbot knowledge base.
 *
 * Ported verbatim from the `KB` object in
 * `BYA& Keiri/keiri-new/keiritech-firebase/public/assets/keiri.js`.
 *
 * ⛔ Every string here is production copy that was written deliberately. Do not
 * reword, summarise or "improve" it — the retention policy in
 * KEIRITECH-INVENTORY.md applies. Changing an answer changes what a prospect is
 * told about pricing, security and compliance.
 *
 * This module has two consumers:
 *   1. `prompt.ts`  — grounding material for Claude (spec D15)
 *   2. `fallback.ts` — the literal scripted matcher, used when the Anthropic API
 *      is unavailable, so the widget can never regress below legacy behaviour
 *
 * It is also the source for the `FAQPage` JSON-LD in Task 10 — one knowledge
 * base, three consumers, no drift.
 */

export interface Faq {
  readonly q: string;
  readonly a: string;
}

export interface KeywordGroup {
  /** Lowercase substrings. A hit on any one selects this group's answer. */
  readonly keywords: readonly string[];
  readonly answer: string;
  /** Short label used for lead `interest` classification and analytics. */
  readonly topic: string;
}

export const FAQS: readonly Faq[] = [
  {
    q: "What does Keiri Tech do?",
    a: "We build AI that runs the financial back office end to end — payables and receivables, the monthly close, forecasting, and tax compliance. The routine work runs itself; your team reviews only the exceptions.",
  },
  {
    q: "Can you automate GST filing?",
    a: "Yes. Our tax workflows reconcile GSTR-2B against your books, compute eligible ITC, build GSTR-1 with full table coverage including amendments, and export GSTN-schema JSON that's ready to file. It works offline too.",
  },
  {
    q: "How does the monthly close work?",
    a: "Keiri reconciles banks and ledgers, posts recurring accruals, and flags variances as they appear. Most teams move from a week-long close to landing it around day three — with a full audit trail.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. We use encryption in transit and at rest, role-based access with segregation of duties, and a complete audit trail on every action. Several tools are offline-capable, so your financials never leave your environment unless you choose.",
  },
  {
    q: "How is Keiri priced?",
    a: "Pricing is scoped to the workflows you automate and your team size, not per seat. The quickest path is a short demo where we map it to your real process — write to business@keiritech.com.",
  },
  {
    q: "How do I book a demo?",
    a: "Email business@keiritech.com or use any 'Book a demo' button on the site. We'll automate one of your real workflows live in about 30 minutes.",
  },
] as const;

export const GREETING =
  "Hi, I'm Keiri \u{1F44B} I help finance teams automate the work they'd rather not do by hand. What would you like to know?";

export const FALLBACK_MESSAGE =
  "I can speak to financial automation — payables & receivables, the close, FP&A, tax & compliance — plus security, pricing and the Keiri platform. Try a suggestion below, or email business@keiritech.com.";

/**
 * ⚠️ ORDER IS LOAD-BEARING. The legacy matcher returns the first group with a
 * keyword hit, so an input like "bank reconciliation pricing" resolves to the
 * close answer, not the pricing answer. Reordering this array silently changes
 * the answers visitors receive.
 */
export const KEYWORD_GROUPS: readonly KeywordGroup[] = [
  {
    topic: "gst",
    keywords: ["gst", "gstr", "2b", "itc", "filing", "return"],
    answer: FAQS[1]!.a,
  },
  {
    topic: "close",
    keywords: ["close", "reconcil", "accrual", "month-end", "ledger", "bank"],
    answer: FAQS[2]!.a,
  },
  {
    topic: "security",
    keywords: [
      "data",
      "safe",
      "secure",
      "security",
      "privacy",
      "encrypt",
      "offline",
      "soc",
    ],
    answer: FAQS[3]!.a,
  },
  {
    topic: "pricing",
    keywords: ["price", "cost", "pricing", "fee", "charge", "how much", "plan"],
    answer: FAQS[4]!.a,
  },
  {
    topic: "demo",
    keywords: ["demo", "book", "call", "trial", "start", "contact", "talk"],
    answer: FAQS[5]!.a,
  },
  {
    topic: "company",
    keywords: [
      "what do you do",
      "what is keiri",
      "about",
      "who are you",
      "services",
    ],
    answer: FAQS[0]!.a,
  },
  {
    topic: "tds",
    keywords: ["tds", "income tax"],
    answer:
      "On tax, Keiri handles GST and TDS workflows on the current section structure, plus income-tax notice tracking — reconciling, computing and staying filing-ready against your calendar.",
  },
  {
    topic: "fpa",
    keywords: [
      "fp&a",
      "forecast",
      "planning",
      "budget",
      "cash flow",
      "cash-flow",
      "mis",
    ],
    answer:
      "For FP&A, Keiri rolls actuals into living models, refreshes forecasts automatically, and answers 'what changed?' in plain language — including board MIS and cash-flow.",
  },
  {
    topic: "ap_ar",
    keywords: [
      "ap",
      "ar",
      "payable",
      "receivable",
      "invoice",
      "collection",
      "dunning",
    ],
    answer:
      "For payables and receivables, Keiri captures invoices, runs three-way matching, routes approvals and chases collections — your team handles only the exceptions.",
  },
  {
    topic: "audit",
    keywords: ["audit", "control", "sox", "ifc"],
    answer:
      "Keiri keeps an audit trail on every action, supports segregation of duties and control testing, and surfaces exceptions for review — so audits stop being a scramble.",
  },
  {
    topic: "integrations",
    keywords: ["integrat", "erp", "tally", "api", "connect"],
    answer:
      "Keiri connects to your ERP and tools — Tally, common GLs, GSTN, spreadsheets and more — via prebuilt connectors and APIs. Want the integrations list?",
  },
  {
    topic: "audience",
    keywords: ["cfo", "controller", "ca firm", "firm"],
    answer:
      "Keiri fits CFOs (live numbers, faster close), controllers (less manual recon, audit-ready), and CA firms (run more clients with the same team). Which are you?",
  },
] as const;

/** Re-exported so prompt-building has one import. Source: `@/lib/contact`. */
export { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/contact";
