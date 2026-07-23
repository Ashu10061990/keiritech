/**
 * The five solution pages, as data.
 *
 * ⛔ Every string is verbatim from the legacy HTML. The pages share one
 * structure (hero + problem/stats + four feature rows + FAQ + CTA), so they
 * share one renderer — see `SolutionPage`. Duplicating the markup five times
 * is how the legacy pages drifted apart.
 *
 * ⚠️ `roadmap: true` renders the "On the roadmap — Coming 2026" badge. This
 * was NOT recorded in KEIRITECH-INVENTORY.md and is easy to lose — it is the
 * only thing on these pages telling a visitor the product is not yet shipped.
 * Dropping it would turn a roadmap page into a false claim of availability.
 */

export interface MockRow {
  readonly label: string;
  readonly value: string;
  readonly ok?: boolean;
}

export interface Mock {
  readonly label: string;
  readonly rows: readonly MockRow[];
  readonly bar?: string;
}

export interface FeatureRowSpec {
  readonly num: string;
  readonly title: string;
  readonly body: string;
  readonly points: readonly string[];
  readonly mock: Mock;
}

export interface Stat {
  readonly value: string;
  readonly label: string;
}

export interface SolutionPageData {
  readonly slug: string;
  readonly crumb: string;
  readonly roadmap: boolean;
  readonly title: string;
  readonly lede: string;
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly problemHeading: string;
  readonly problemBody: string;
  readonly stats: readonly Stat[];
  readonly features: readonly FeatureRowSpec[];
  readonly faqs: ReadonlyArray<{ q: string; a: string }>;
}

export const SOLUTIONS: readonly SolutionPageData[] = [
  {
    slug: "payables-receivables",
    crumb: "Payables & Receivables",
    roadmap: true,
    title: "Payables and receivables that run on rails.",
    lede: "From invoice arrival to cash in the bank, Keiri captures, matches, routes and chases — so your team stops keying data and starts managing exceptions.",
    metaTitle: "Payables & receivables automation",
    metaDescription:
      "Keiri captures invoices, runs three-way matching, routes approvals and chases collections — so your team manages exceptions instead of keying data.",
    problemHeading: "The cost of doing it by hand",
    problemBody:
      "Manual AP and AR is slow, error-prone and hard to see into. Invoices get keyed twice, approvals stall in inboxes, and collections slip because no one's watching the ageing. Keiri removes the keystrokes and the waiting.",
    stats: [
      { value: "237", label: "invoices captured daily, sample team" },
      { value: "92%", label: "auto-matched without a human" },
      { value: "18 days", label: "faster average collection" },
    ],
    features: [
      {
        num: "01",
        title: "Capture every invoice automatically",
        body: "Keiri reads invoices from email and uploads, extracts the line items, and validates them against the PO and goods receipt — no manual data entry, no missed fields.",
        points: [
          "Email and upload capture",
          "Line-item extraction",
          "PO and GRN validation",
        ],
        mock: {
          label: "Invoice capture",
          rows: [
            { label: "Read & extracted", value: "237", ok: true },
            { label: "Fields to confirm", value: "4" },
          ],
          bar: "94%",
        },
      },
      {
        num: "02",
        title: "Three-way matching, instantly",
        body: "Purchase order, goods receipt and invoice are matched the moment an invoice lands. Clean matches post automatically; only genuine discrepancies reach a human.",
        points: [
          "Automatic match and post",
          "Tolerance thresholds you set",
          "Exception queue for mismatches",
        ],
        mock: {
          label: "3-way match",
          rows: [
            { label: "Matched", value: "1,204", ok: true },
            { label: "Discrepancies", value: "18" },
          ],
        },
      },
      {
        num: "03",
        title: "Approvals that don't stall",
        body: "Routing follows your approval matrix by amount, vendor and cost centre, with reminders so nothing sits. Approvers act in one click, from anywhere.",
        points: [
          "Rule-based routing",
          "Escalation and reminders",
          "One-click approve from mobile",
        ],
        mock: {
          label: "Approvals",
          rows: [
            { label: "Cleared today", value: "52", ok: true },
            { label: "Awaiting", value: "7" },
          ],
        },
      },
      {
        num: "04",
        title: "Collections on autopilot",
        body: "Keiri tracks receivable ageing and sends graduated reminders, so cash comes in without your team building a chase list every week.",
        points: [
          "Ageing-based reminders",
          "Customizable dunning tone",
          "Promise-to-pay tracking",
        ],
        mock: {
          label: "Receivables",
          rows: [
            { label: "0–30 days", value: "₹18.4L" },
            { label: "31–60 days", value: "₹6.1L" },
            { label: "Reminders sent", value: "auto", ok: true },
          ],
        },
      },
    ],
    faqs: [
      {
        q: "How accurate is the invoice capture?",
        a: "Keiri extracts structured fields and validates them against your PO and goods receipt, so the few items that need confirmation are flagged clearly rather than slipping through. Accuracy improves as it learns your common vendors.",
      },
      {
        q: "Can it handle multiple entities and GSTINs?",
        a: "Yes. Keiri supports multi-entity and multi-GSTIN setups, keeping the matching, approvals and records separate but reportable together.",
      },
      {
        q: "Does it post directly to our ERP?",
        a: "Clean matches can post automatically to your GL with the right coding, or sit in a review queue first — you choose the level of automation per workflow.",
      },
    ],
  },

  {
    slug: "financial-close",
    crumb: "The Financial Close",
    roadmap: true,
    title: "Close the books in days, not weeks.",
    lede: "Keiri reconciles, accrues and consolidates while you watch the close progress in real time — and flags the variances that actually need your attention.",
    metaTitle: "The financial close, automated",
    metaDescription:
      "Keiri reconciles banks and ledgers, posts recurring accruals, explains variances and consolidates entities — turning a week-long close into about three days.",
    problemHeading: "The close shouldn't eat the month",
    problemBody:
      "Spreadsheet-driven closes are slow and opaque: no one knows what's done, errors surface late, and the team burns evenings reconciling. Keiri standardizes the close and automates the repetitive parts.",
    stats: [
      { value: "3 days", label: "typical close, down from a week" },
      { value: "96%", label: "of recon lines matched automatically" },
      { value: "26", label: "controls checked every close" },
    ],
    features: [
      {
        num: "01",
        title: "Reconciliations that match themselves",
        body: "Keiri pulls bank, GL and sub-ledger data and matches transactions automatically, creating reconciling items and proposed journals where needed.",
        points: [
          "Automated bank and ledger recon",
          "Proposed adjusting journals",
          "Reconciling items tracked to close",
        ],
        mock: {
          label: "Reconciliation",
          rows: [
            { label: "Bank recon", value: "412/412", ok: true },
            { label: "Open items", value: "6" },
          ],
          bar: "96%",
        },
      },
      {
        num: "02",
        title: "Recurring accruals, posted on schedule",
        body: "Define an accrual once and Keiri posts it each period with the right calculation and supporting documentation — no rebuilding the schedule monthly.",
        points: [
          "Rule-based accrual posting",
          "Supporting docs attached",
          "Reversal handling",
        ],
        mock: {
          label: "Accruals · June",
          rows: [
            { label: "Posted", value: "14", ok: true },
            { label: "With support", value: "14", ok: true },
          ],
        },
      },
      {
        num: "03",
        title: "Variance analysis in plain language",
        body: "Keiri compares actuals to prior period and budget, surfaces the movements that matter, and explains them — so flux analysis takes minutes, not a morning.",
        points: [
          "Automatic flux analysis",
          "Threshold-based flags",
          "Plain-language commentary",
        ],
        mock: {
          label: "Flux analysis",
          rows: [
            { label: "Rent ↑", value: "+8% explained" },
            { label: "Power ↑", value: "flag" },
          ],
        },
      },
      {
        num: "04",
        title: "Consolidation and Schedule III",
        body: "Aggregate entities, handle intercompany eliminations, and produce Schedule III-ready statements with drill-down to the underlying detail.",
        points: [
          "Multi-entity consolidation",
          "Intercompany eliminations",
          "Schedule III output",
        ],
        mock: {
          label: "Consolidation",
          rows: [
            { label: "Entities", value: "5/5", ok: true },
            { label: "Eliminations", value: "done", ok: true },
            { label: "Schedule III", value: "ready" },
          ],
        },
      },
    ],
    faqs: [
      {
        q: "Will it work with how we already close?",
        a: "Yes. Keiri maps to your existing checklist and chart of accounts, then automates the repetitive tasks within it — you're not forced into a new process.",
      },
      {
        q: "How does the audit trail help at year-end?",
        a: "Every reconciliation, journal and approval is logged with timestamps and owners, so the evidence auditors ask for is already assembled.",
      },
      {
        q: "Can two people work the close together?",
        a: "Yes — role-based access lets preparers and reviewers work in parallel with clear ownership and sign-off at each step.",
      },
    ],
  },

  {
    slug: "fpa",
    crumb: "FP&A & Forecasting",
    roadmap: true,
    title: "Forecasts that stay alive between board meetings.",
    lede: "Keiri rolls your actuals into living models, refreshes the forecast automatically, and answers 'what changed?' in plain language — so planning keeps pace with the business.",
    metaTitle: "FP&A and forecasting",
    metaDescription:
      "Rolling 12-month forecasts that refresh from actuals automatically, direct cash-flow projection, and a board MIS pack assembled for review rather than built by hand.",
    problemHeading: "Models go stale the day you finish them",
    problemBody:
      "Static spreadsheets are out of date as soon as the next actuals land, and rebuilding them swallows the analyst's week. Keiri keeps the model current and the story clear.",
    stats: [
      { value: "12-month", label: "always-current rolling view" },
      { value: "Minutes", label: "to refresh, not days" },
      { value: "1 pack", label: "board MIS, assembled for you" },
    ],
    features: [
      {
        num: "01",
        title: "Actuals flow straight into the model",
        body: "As the close completes, Keiri pushes actuals into your forecast structure — no copy-paste, no broken links, no version confusion.",
        points: [
          "Auto-refresh from actuals",
          "Single source for the model",
          "Version history kept",
        ],
        mock: {
          label: "Forecast refresh",
          rows: [
            { label: "Actuals loaded", value: "to June", ok: true },
            { label: "Model updated", value: "auto", ok: true },
          ],
        },
      },
      {
        num: "02",
        title: "Rolling forecasts, not annual guesses",
        body: "Keiri extends and re-bases the forecast each period, so leadership always sees the next twelve months from where the business actually is.",
        points: [
          "Rolling 12-month view",
          "Driver-based assumptions",
          "Scenario comparison",
        ],
        mock: {
          label: "Rolling 12M",
          rows: [
            { label: "Revenue", value: "₹14.2 Cr" },
            { label: "EBITDA", value: "22.1%" },
          ],
          bar: "74%",
        },
      },
      {
        num: "03",
        title: "Cash-flow you can act on",
        body: "Project receipts and payments from real ageing and commitments, so you see runway and crunch points before they arrive.",
        points: [
          "Direct cash-flow projection",
          "Receivable and payable driven",
          "Runway and stress views",
        ],
        mock: {
          label: "Cash-flow",
          rows: [
            { label: "Runway", value: "9.4 months", ok: true },
            { label: "Tight week", value: "wk 32" },
          ],
        },
      },
      {
        num: "04",
        title: "Board MIS without the all-nighter",
        body: "Keiri assembles the management reporting pack — variance, KPIs, commentary — in your format, ready to review instead of build.",
        points: ["Auto-built MIS pack", "KPI dashboards", "Commentary drafted for review"],
        mock: {
          label: "Board pack",
          rows: [
            { label: "KPIs", value: "assembled", ok: true },
            { label: "Variance", value: "explained", ok: true },
            { label: "Commentary", value: "draft" },
          ],
        },
      },
    ],
    faqs: [
      {
        q: "Do we keep our existing model structure?",
        a: "Yes. Keiri works with your model's logic and layout rather than imposing a template — it automates the refresh and reporting around what you've already built.",
      },
      {
        q: "How are forecast assumptions controlled?",
        a: "Assumptions are driver-based and versioned, so changes are visible and you can compare scenarios side by side.",
      },
      {
        q: "Can it produce our board format?",
        a: "Keiri assembles the MIS pack in your format with KPIs, variance and draft commentary, leaving you to review and finalize rather than build from scratch.",
      },
    ],
  },

  {
    slug: "tax-compliance",
    crumb: "Tax & Compliance",
    roadmap: true,
    title: "Compliance that's always filing-ready.",
    lede: "Keiri reconciles GST, computes TDS, tracks income-tax matters and watches the calendar — so deadlines stop being a monthly scramble.",
    metaTitle: "GST, TDS and tax compliance",
    metaDescription:
      "GSTR-2B reconciliation, eligible ITC computation, GSTR-1 with full table coverage and GSTN-schema export, plus TDS, income-tax matters and a compliance calendar.",
    problemHeading: "Compliance is relentless — automate the routine",
    problemBody:
      "Returns, reconciliations and notices arrive on a clock that never stops. Keiri handles the repetitive computation and matching, keeping you ready to file and surfacing only what needs judgment.",
    stats: [
      { value: "Full", label: "GSTR-1 table coverage" },
      { value: "24/7", label: "compliance calendar watch" },
      { value: "0", label: "missed deadlines, by design" },
    ],
    features: [
      {
        num: "01",
        title: "GST reconciliation and filing",
        body: "Keiri reconciles GSTR-2B against your books, computes eligible ITC, and builds GSTR-1 with full table coverage including amendments — then exports GSTN-schema JSON ready to file.",
        points: [
          "2B vs books reconciliation",
          "Eligible ITC computation",
          "GSTR-1 full table coverage",
          "GSTN schema JSON export",
        ],
        mock: {
          label: "GSTR-3B",
          rows: [
            { label: "2B reconciled", value: "clean", ok: true },
            { label: "ITC eligible", value: "₹4.2L", ok: true },
            { label: "Filing", value: "ready" },
          ],
        },
      },
      {
        num: "02",
        title: "TDS, on the current structure",
        body: "Compute and reconcile TDS on the present section framework and payment codes, manage lower-deduction certificates, and keep returns aligned with the books.",
        points: ["Section-aware computation", "LDC management", "Return reconciliation"],
        mock: {
          label: "TDS",
          rows: [
            { label: "Computed", value: "₹1.8L", ok: true },
            { label: "LDC applied", value: "2", ok: true },
          ],
        },
      },
      {
        num: "03",
        title: "Income-tax matters tracked",
        body: "Keep notices, demands and lifecycle stages organized by entity, with reminders so nothing lapses and a clear history of every matter.",
        points: [
          "Notice and demand tracking",
          "Lifecycle stage view",
          "Deadline reminders",
        ],
        mock: {
          label: "Income-tax",
          rows: [
            { label: "Open notices", value: "3" },
            { label: "Next deadline", value: "12 days" },
          ],
        },
      },
      {
        num: "04",
        title: "A compliance calendar that never slips",
        body: "Every filing obligation is mapped to a date and an owner, with status at a glance — so the whole calendar is visible, not scattered across heads.",
        points: [
          "Obligation-to-date mapping",
          "Owner and status view",
          "Multi-entity, multi-GSTIN",
        ],
        mock: {
          label: "Calendar",
          rows: [
            { label: "On track", value: "14", ok: true },
            { label: "Due this week", value: "2" },
          ],
          bar: "88%",
        },
      },
    ],
    faqs: [
      {
        q: "Does it cover the latest GST tables and schema?",
        a: "Keiri builds GSTR-1 with full table coverage including amendments and exports to the current GSTN JSON schema. We keep the schema and forms current as they change.",
      },
      {
        q: "Is the tax workflow offline-capable?",
        a: "Several tax tools run standalone and offline, so sensitive data stays in your environment. You choose what connects to the cloud.",
      },
      {
        q: "Can it handle many GSTINs at once?",
        a: "Yes — multi-GSTIN and multi-entity are supported, with reconciliation, filing and the calendar kept separate but viewable together.",
      },
    ],
  },

  {
    slug: "audit-controls",
    crumb: "Audit & Controls",
    roadmap: true,
    title: "Continuous assurance, not an annual scramble.",
    lede: "Keiri logs every action, enforces segregation of duties, and tests controls as work happens — so the evidence auditors want is built as you go.",
    metaTitle: "Audit trails and controls",
    metaDescription:
      "A tamper-evident audit trail on every action, enforced segregation of duties, and continuous control testing — so audits become a review, not a document hunt.",
    problemHeading: "Controls shouldn't be a once-a-year panic",
    problemBody:
      "When controls live in people's heads and evidence is gathered at year-end, audits are stressful and risky. Keiri makes controls part of the daily workflow and keeps the evidence ready.",
    stats: [
      { value: "Every", label: "action logged" },
      { value: "26/26", label: "controls passing, sample close" },
      { value: "Year-round", label: "audit readiness" },
    ],
    features: [
      {
        num: "01",
        title: "An immutable audit trail",
        body: "Every import, match, journal and approval is recorded with who, what and when. The trail can't be quietly edited — so it stands up to scrutiny.",
        points: ["Action-level logging", "Tamper-evident record", "Exportable for auditors"],
        mock: {
          label: "Audit trail",
          rows: [
            { label: "Actions logged", value: "8,412", ok: true },
            { label: "Integrity", value: "verified", ok: true },
          ],
        },
      },
      {
        num: "02",
        title: "Segregation of duties, enforced",
        body: "Role-based permissions keep preparation, review and approval in different hands, with conflicts flagged rather than discovered later.",
        points: ["Role-based access", "Maker-checker separation", "Conflict detection"],
        mock: {
          label: "Segregation",
          rows: [
            { label: "Maker/checker", value: "enforced", ok: true },
            { label: "Conflicts", value: "0" },
          ],
        },
      },
      {
        num: "03",
        title: "Control testing as you work",
        body: "Keiri runs control checks continuously — threshold breaches, missing approvals, unusual entries — and surfaces issues while they're still cheap to fix.",
        points: [
          "Continuous control checks",
          "Exception alerts",
          "Issue tracking to resolution",
        ],
        mock: {
          label: "Control checks",
          rows: [
            { label: "Passing", value: "26/26", ok: true },
            { label: "Alerts open", value: "1" },
          ],
          bar: "98%",
        },
      },
      {
        num: "04",
        title: "Audit-ready, all year",
        body: "Because the evidence accumulates automatically, an audit becomes a review of an organized record rather than a hunt for documents.",
        points: [
          "Evidence assembled automatically",
          "Walkthrough support",
          "Faster, calmer audits",
        ],
        mock: {
          label: "Audit readiness",
          rows: [
            { label: "Evidence", value: "assembled", ok: true },
            { label: "Walkthroughs", value: "documented", ok: true },
          ],
        },
      },
    ],
    faqs: [
      {
        q: "Does this replace our auditors?",
        a: "No. Keiri makes the controls and evidence continuous and organized; your auditors still provide independent assurance — they just spend less time chasing documents.",
      },
      {
        q: "Can we map it to our control framework?",
        a: "Yes. Keiri's checks map to your control matrix (including IFC/ICFR-style frameworks), so testing aligns with how you already document controls.",
      },
      {
        q: "How is the audit trail protected?",
        a: "The trail is tamper-evident and access-controlled, recording every action with its owner and timestamp, and it exports cleanly for auditors.",
      },
    ],
  },
] as const;

export function getSolution(slug: string): SolutionPageData | undefined {
  return SOLUTIONS.find((solution) => solution.slug === slug);
}
