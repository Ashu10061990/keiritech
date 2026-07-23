import type { IconName } from "@/components/icons";
import type { Mock, Stat } from "@/content/solutions";

/**
 * The three audience pages, as data. ⛔ Copy verbatim from the legacy HTML.
 *
 * Structure: hero · "what gets in the way" (pain list + today mock) ·
 * "with Keiri" (3 cards + stats) · quote · CTA.
 *
 * Note the three "today" mock panels are identical across all three pages in
 * the legacy source — same numbers, only the label differs. Reproduced as-is
 * rather than "fixed": they are illustrative, and inventing per-audience
 * figures would be fabricating data.
 */

export interface AudiencePageData {
  readonly slug: string;
  readonly crumb: string;
  readonly title: string;
  readonly lede: string;
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly painPoints: readonly string[];
  readonly todayMock: Mock;
  readonly changes: ReadonlyArray<{
    readonly icon: IconName;
    readonly title: string;
    readonly body: string;
  }>;
  readonly stats: readonly Stat[];
  readonly quote: string;
  readonly attribution: string;
}

const TODAY_ROWS = [
  { label: "Manual hours/week", value: "28" },
  { label: "Close duration", value: "7 days" },
  { label: "Last-minute fixes", value: "frequent" },
] as const;

export const AUDIENCES: readonly AudiencePageData[] = [
  {
    slug: "for-cfos",
    crumb: "For CFOs",
    title: "Numbers you can trust, the moment you need them.",
    lede: "Stop waiting on the close to know where you stand. Keiri keeps the financials current, the controls tight, and the forecast alive — so you lead with facts, not lag.",
    metaTitle: "Keiri for CFOs",
    metaDescription:
      "Land the close around day three, keep a rolling forecast current, and replace fragile spreadsheets with enforced controls and a full audit trail.",
    painPoints: [
      "Decisions wait on a close that takes a week or more",
      "The forecast is stale by the time it reaches the board",
      "Risk hides in manual spreadsheets no one fully owns",
      "Compliance exposure is hard to see until something slips",
      "The team is stretched thin on data assembly, not analysis",
    ],
    todayMock: { label: "For CFOs · today", rows: TODAY_ROWS, bar: "40%" },
    changes: [
      {
        icon: "clock",
        title: "A faster, predictable close",
        body: "Land the close around day three with a real-time view of progress and blockers.",
      },
      {
        icon: "chart",
        title: "A forecast that stays current",
        body: "Actuals flow into a rolling model, so the board sees where the business actually is.",
      },
      {
        icon: "shield",
        title: "Less risk, more control",
        body: "Audit trails and enforced controls replace fragile spreadsheets and tribal knowledge.",
      },
    ],
    stats: [
      { value: "3 days", label: "to close" },
      { value: "Live", label: "rolling forecast" },
      { value: "Full", label: "control visibility" },
    ],
    quote:
      "\"I stopped asking 'are the numbers ready?' and started asking 'what do the numbers tell us?'\"",
    attribution: "— A CFO Keiri was built for",
  },

  {
    slug: "for-controllers",
    crumb: "For controllers",
    title: "Run a calm close, every month.",
    lede: "Keiri takes the reconciliations, accruals and chasing off your plate and keeps the evidence organized — so month-end stops being a sprint and audits stop being a scramble.",
    metaTitle: "Keiri for controllers",
    metaDescription:
      "Bank and ledger matching that runs itself, evidence that assembles as you work, and one controlled workflow with clear preparer and reviewer ownership.",
    painPoints: [
      "Reconciliations eat days of manual matching",
      "Approvals and documents are chased over email",
      "Errors surface late, after entries are posted",
      "Audit prep means hunting for evidence after the fact",
      "The same fire drill repeats every single month",
    ],
    todayMock: { label: "For controllers · today", rows: TODAY_ROWS, bar: "40%" },
    changes: [
      {
        icon: "checkbox",
        title: "Reconciliations that match themselves",
        body: "Bank and ledger matching runs automatically; you handle only true exceptions.",
      },
      {
        icon: "search",
        title: "Always audit-ready",
        body: "Evidence assembles as you work, so year-end is a review, not a hunt.",
      },
      {
        icon: "workflow",
        title: "One controlled workflow",
        body: "Preparers and reviewers work in parallel with clear ownership and sign-off.",
      },
    ],
    stats: [
      { value: "96%", label: "auto-matched recon lines" },
      { value: "Calm", label: "month-end" },
      { value: "Year-round", label: "audit readiness" },
    ],
    quote: '"The close used to own my month. Now I own the close."',
    attribution: "— A controller Keiri was built for",
  },

  {
    slug: "for-ca-firms",
    crumb: "For CA firms",
    title: "Serve more clients without adding headcount.",
    lede: "Keiri automates the repetitive compliance and bookkeeping work across your client base, so your team spends its time on advice and review — and the firm grows without burning out.",
    metaTitle: "Keiri for CA firms",
    metaDescription:
      "Automate GST and TDS reconciliation and filing across every client from one place, with one calendar and dashboard so nothing slips through.",
    painPoints: [
      "Compliance volume grows faster than the team can hire",
      "GST and TDS work is repetitive but unforgiving",
      "Quality varies with who happens to do the work",
      "Deadlines across many clients are hard to track centrally",
      "Skilled staff spend hours on data entry, not advisory",
    ],
    todayMock: { label: "For CA firms · today", rows: TODAY_ROWS, bar: "40%" },
    changes: [
      {
        icon: "receipt",
        title: "Compliance at scale",
        body: "Automate GST and TDS reconciliation and filing across every client from one place.",
      },
      {
        icon: "users",
        title: "Same team, more clients",
        body: "Free your staff from keystrokes so they handle more engagements, better.",
      },
      {
        icon: "eye",
        title: "Central oversight",
        body: "One calendar and dashboard across all clients — nothing slips through the cracks.",
      },
    ],
    stats: [
      { value: "More", label: "clients per staff member" },
      { value: "One", label: "calendar across clients" },
      { value: "Consistent", label: "quality, every file" },
    ],
    quote:
      '"We took on more clients this year than last, with the same team — and slept better doing it."',
    attribution: "— A CA firm Keiri was built for",
  },
] as const;

export function getAudience(slug: string): AudiencePageData | undefined {
  return AUDIENCES.find((audience) => audience.slug === slug);
}
