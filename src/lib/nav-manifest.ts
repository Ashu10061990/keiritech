import type { IconName } from "@/components/icons";

/**
 * The navigation manifest — one source of truth for the mega-menu, the mobile
 * menu, the footer and the generated sitemap. The legacy site hand-maintained
 * all four separately in 24 copies of the same markup, which is why its
 * `sitemap.xml` had already drifted.
 *
 * ⛔ Every `description` string is production copy from the legacy dropdowns
 * (KEIRITECH-INVENTORY.md §3) and is reproduced verbatim.
 */

export interface NavItem {
  readonly href: string;
  readonly title: string;
  readonly description: string;
  readonly icon: IconName;
  readonly external?: boolean;
}

export interface NavGroup {
  readonly label: string;
  /** A direct link (Pricing, Company) has an href and no items. */
  readonly href?: string;
  readonly items?: readonly NavItem[];
}

export const NAV_GROUPS: readonly NavGroup[] = [
  {
    label: "Solutions",
    items: [
      {
        href: "https://bookyouraccountant.com",
        title: "BookYourAccountant ↗",
        description: "On-demand verified CAs, booked by the day",
        icon: "mail",
        external: true,
      },
      {
        href: "/solutions",
        title: "All solutions",
        description: "The full picture of what Keiri automates",
        icon: "grid",
      },
      {
        href: "/payables-receivables",
        title: "Payables & receivables",
        description: "Invoice capture, matching, approvals, collections",
        icon: "ledger",
      },
      {
        href: "/financial-close",
        title: "The close",
        description: "Reconciliations, accruals, variance, consolidation",
        icon: "checkbox",
      },
      {
        href: "/fpa",
        title: "FP&A",
        description: "Rolling forecasts, cash-flow, board MIS",
        icon: "chart",
      },
      {
        href: "/tax-compliance",
        title: "Tax & compliance",
        description: "GST, TDS, income-tax, notice tracking",
        icon: "receipt",
      },
      {
        href: "/audit-controls",
        title: "Audit & controls",
        description: "Audit trails, SOD, control testing",
        icon: "search",
      },
    ],
  },
  {
    label: "Platform",
    items: [
      {
        href: "/platform",
        title: "The platform",
        description: "How the pieces fit together",
        icon: "grid",
      },
      {
        href: "/keiri-ai",
        title: "Keiri AI",
        description: "The agent that does the work",
        icon: "bot",
      },
      {
        href: "/integrations",
        title: "Integrations",
        description: "ERPs, GLs, GSTN, spreadsheets",
        icon: "plug",
      },
      {
        href: "/security",
        title: "Security & trust",
        description: "Encryption, access control, audit",
        icon: "shield",
      },
    ],
  },
  {
    label: "Who it's for",
    items: [
      {
        href: "/for-cfos",
        title: "For CFOs",
        description: "Live numbers, faster close, less risk",
        icon: "rupee",
      },
      {
        href: "/for-controllers",
        title: "For controllers",
        description: "Less manual recon, always audit-ready",
        icon: "bars",
      },
      {
        href: "/for-ca-firms",
        title: "For CA firms",
        description: "More clients, same headcount",
        icon: "building",
      },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  {
    label: "Resources",
    items: [
      {
        href: "/resources",
        title: "All resources",
        description: "Guides, articles and playbooks",
        icon: "doc",
      },
      {
        href: "/resources/three-day-close-playbook",
        title: "The 3-day close playbook",
        description: "A practical guide",
        icon: "checkbox",
      },
      {
        href: "/blog/ai-in-the-finance-function",
        title: "AI in the finance function",
        description: "Article",
        icon: "spark",
      },
      {
        href: "/blog/automating-gst-reconciliation",
        title: "Automating GST reconciliation",
        description: "Article",
        icon: "receipt",
      },
    ],
  },
  { label: "Company", href: "/about" },
] as const;

/**
 * The mobile menu's own grouping, which differs from the desktop mega-menu:
 * the legacy site collapsed Pricing / Resources / About / Careers / Book a demo
 * into a single "More" section. Reproduced rather than derived.
 */
export const MOBILE_SECTIONS: ReadonlyArray<{
  readonly label: string;
  readonly links: ReadonlyArray<{ href: string; label: string; external?: boolean }>;
}> = [
  {
    label: "Solutions",
    links: [
      { href: "https://bookyouraccountant.com", label: "BookYourAccountant ↗", external: true },
      { href: "/solutions", label: "All solutions" },
      { href: "/payables-receivables", label: "Payables & receivables" },
      { href: "/financial-close", label: "The close" },
      { href: "/fpa", label: "FP&A" },
      { href: "/tax-compliance", label: "Tax & compliance" },
      { href: "/audit-controls", label: "Audit & controls" },
    ],
  },
  {
    label: "Platform",
    links: [
      { href: "/platform", label: "The platform" },
      { href: "/keiri-ai", label: "Keiri AI" },
      { href: "/integrations", label: "Integrations" },
      { href: "/security", label: "Security & trust" },
    ],
  },
  {
    label: "Who it's for",
    links: [
      { href: "/for-cfos", label: "For CFOs" },
      { href: "/for-controllers", label: "For controllers" },
      { href: "/for-ca-firms", label: "For CA firms" },
    ],
  },
  {
    label: "More",
    links: [
      { href: "/pricing", label: "Pricing" },
      { href: "/resources", label: "Resources" },
      { href: "/about", label: "About" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Book a demo" },
    ],
  },
] as const;

/** Footer columns, from KEIRITECH-INVENTORY.md §8. */
export const FOOTER_COLUMNS: ReadonlyArray<{
  readonly heading: string;
  readonly links: ReadonlyArray<{ href: string; label: string; external?: boolean }>;
}> = [
  {
    heading: "Solutions",
    links: [
      { href: "https://bookyouraccountant.com", label: "BookYourAccountant ↗", external: true },
      { href: "/payables-receivables", label: "Payables & receivables" },
      { href: "/financial-close", label: "The close" },
      { href: "/fpa", label: "FP&A" },
      { href: "/tax-compliance", label: "Tax & compliance" },
      { href: "/audit-controls", label: "Audit & controls" },
    ],
  },
  {
    heading: "Platform",
    links: [
      { href: "/platform", label: "Overview" },
      { href: "/keiri-ai", label: "Keiri AI" },
      { href: "/integrations", label: "Integrations" },
      { href: "/security", label: "Security & trust" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/careers", label: "Careers" },
      { href: "/resources", label: "Resources" },
      { href: "/contact", label: "Contact" },
      { href: "mailto:business@keiritech.com", label: "business@keiritech.com", external: true },
    ],
  },
] as const;

/**
 * Every indexable internal route. `sitemap.ts` reads this, so a page that is
 * reachable in the nav cannot be missing from the sitemap.
 *
 * `/contact` and `/glossary` are not in the mega-menu but are indexable, so
 * they are listed explicitly.
 */
export const ALL_ROUTES: readonly string[] = [
  "/",
  ...NAV_GROUPS.flatMap((group) =>
    group.href
      ? [group.href]
      : (group.items ?? [])
          .filter((item) => !item.external)
          .map((item) => item.href),
  ),
  "/careers",
  "/contact",
  "/why-keiri",
  "/glossary",
];
