import type { SVGProps } from "react";

/**
 * The Keiri Tech icon set.
 *
 * ⛔ Every path here is copied verbatim from the inline SVGs in the legacy
 * pages. The set is hand-drawn — substituting lucide or any icon library
 * changes the visual identity, which is why the parity contract
 * (KEIRITECH-INVENTORY.md §7) calls this out explicitly.
 *
 * HTML attributes are converted to JSX (`stroke-width` → `strokeWidth`); path
 * data, viewBoxes, stroke widths and fill rules are untouched.
 */

type IconProps = SVGProps<SVGSVGElement>;

/** Shared props for the outline icons — 1.7 stroke, round caps and joins. */
const outline = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** The KeiriTech logo mark: rounded square, white bar, gold chevron, tick. */
export function KMark(props: IconProps) {
  return (
    <svg className="kmark" viewBox="0 0 40 40" fill="none" aria-hidden="true" {...props}>
      <rect x="2" y="3" width="34" height="34" rx="8" fill="#306339" />
      <rect x="11" y="11" width="4.6" height="19" rx="1" fill="#FFFFFF" />
      <path d="M16 20 L26 10 L29.5 12.5 L19.5 21 Z" fill="#E9A23B" />
      <path d="M16 20 L25.5 29.5 L22 31.5 L14.5 23 Z" fill="#FFFFFF" />
      <circle cx="26.5" cy="29" r="2.4" fill="none" stroke="#E9A23B" strokeWidth="1.6" />
      <path
        d="M30 8 H33 V11"
        stroke="#E9A23B"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function CaretIcon(props: IconProps) {
  return (
    <svg
      className="caret"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
      {...props}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} aria-hidden="true" {...props}>
      <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  );
}

/** Envelope — BookYourAccountant. */
export function MailIcon(props: IconProps) {
  return (
    <svg {...outline} aria-hidden="true" {...props}>
      <path d="M3 7h18v12H3z" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

/** Four squares — "All solutions" and "The platform". */
export function GridIcon(props: IconProps) {
  return (
    <svg {...outline} aria-hidden="true" {...props}>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

/** Ledger card — payables & receivables. */
export function LedgerIcon(props: IconProps) {
  return (
    <svg {...outline} aria-hidden="true" {...props}>
      <path d="M3 7h18v10H3z" />
      <path d="M3 11h18" />
    </svg>
  );
}

/** Checked box — the close, and the close playbook. */
export function CheckBoxIcon(props: IconProps) {
  return (
    <svg {...outline} aria-hidden="true" {...props}>
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

/** Line chart — FP&A. */
export function ChartIcon(props: IconProps) {
  return (
    <svg {...outline} aria-hidden="true" {...props}>
      <path d="M3 3v18h18" />
      <path d="M7 14l4-4 3 3 5-6" />
    </svg>
  );
}

/** Torn receipt — tax & compliance, and the GST article. */
export function ReceiptIcon(props: IconProps) {
  return (
    <svg {...outline} aria-hidden="true" {...props}>
      <path d="M9 7h6M9 11h6M9 15h4" />
      <path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z" />
    </svg>
  );
}

/** Magnifier — audit & controls. */
export function SearchIcon(props: IconProps) {
  return (
    <svg {...outline} aria-hidden="true" {...props}>
      <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" />
      <path d="M21 21l-5-5" />
    </svg>
  );
}

/** Robot — Keiri AI. */
export function BotIcon(props: IconProps) {
  return (
    <svg {...outline} aria-hidden="true" {...props}>
      <rect x="4" y="8" width="16" height="11" rx="2" />
      <path d="M12 8V4M9 13h.01M15 13h.01" />
    </svg>
  );
}

/** Plug — integrations. */
export function PlugIcon(props: IconProps) {
  return (
    <svg {...outline} aria-hidden="true" {...props}>
      <path d="M9 7V3M15 7V3M7 7h10v4a5 5 0 0 1-10 0z" />
      <path d="M12 16v5" />
    </svg>
  );
}

/** Shield with tick — security & trust. */
export function ShieldIcon(props: IconProps) {
  return (
    <svg {...outline} aria-hidden="true" {...props}>
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

/** Rupee — for CFOs. */
export function RupeeIcon(props: IconProps) {
  return (
    <svg {...outline} aria-hidden="true" {...props}>
      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

/** Bar chart — for controllers. */
export function BarsIcon(props: IconProps) {
  return (
    <svg {...outline} aria-hidden="true" {...props}>
      <path d="M3 3v18h18" />
      <rect x="7" y="12" width="3" height="6" />
      <rect x="12" y="8" width="3" height="10" />
      <rect x="17" y="5" width="3" height="13" />
    </svg>
  );
}

/** Building — for CA firms. */
export function BuildingIcon(props: IconProps) {
  return (
    <svg {...outline} aria-hidden="true" {...props}>
      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
    </svg>
  );
}

/** Document — all resources. */
export function DocIcon(props: IconProps) {
  return (
    <svg {...outline} aria-hidden="true" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

/** Sparkle — the AI-in-finance article. */
export function SparkIcon(props: IconProps) {
  return (
    <svg {...outline} aria-hidden="true" {...props}>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
    </svg>
  );
}

/** Speech bubble — the chat FAB. Stroked in navy against the gold button. */
export function ChatIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#142719"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

/** Paper plane — the chat send button. */
export function SendIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#F6F3EC"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" />
    </svg>
  );
}

/** Clock — "a faster, predictable close" (for-cfos). */
export function ClockIcon(props: IconProps) {
  return (
    <svg {...outline} aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

/** Workflow nodes — "one controlled workflow" (for-controllers). */
export function WorkflowIcon(props: IconProps) {
  return (
    <svg {...outline} aria-hidden="true" {...props}>
      <circle cx="5" cy="6" r="2" />
      <circle cx="19" cy="6" r="2" />
      <circle cx="12" cy="18" r="2" />
      <path d="M5 8v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8M12 14v-2" />
    </svg>
  );
}

/** People — "same team, more clients" (for-ca-firms). */
export function UsersIcon(props: IconProps) {
  return (
    <svg {...outline} aria-hidden="true" {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0M16 6a3 3 0 0 1 0 6M22 20a6 6 0 0 0-4-5.6" />
    </svg>
  );
}

/** Eye — "central oversight" (for-ca-firms). */
export function EyeIcon(props: IconProps) {
  return (
    <svg {...outline} aria-hidden="true" {...props}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/** Padlock — "Gated" (keiri-ai). */
export function LockIcon(props: IconProps) {
  return (
    <svg {...outline} aria-hidden="true" {...props}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

/**
 * Registry, so the nav manifest can name an icon as data rather than importing
 * a component into a data file.
 */
export const ICONS = {
  mail: MailIcon,
  grid: GridIcon,
  ledger: LedgerIcon,
  checkbox: CheckBoxIcon,
  chart: ChartIcon,
  receipt: ReceiptIcon,
  search: SearchIcon,
  bot: BotIcon,
  plug: PlugIcon,
  shield: ShieldIcon,
  rupee: RupeeIcon,
  bars: BarsIcon,
  building: BuildingIcon,
  doc: DocIcon,
  spark: SparkIcon,
  clock: ClockIcon,
  workflow: WorkflowIcon,
  users: UsersIcon,
  eye: EyeIcon,
  lock: LockIcon,
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({
  name,
  ...props
}: { name: IconName } & IconProps) {
  const Component = ICONS[name];
  return <Component {...props} />;
}
