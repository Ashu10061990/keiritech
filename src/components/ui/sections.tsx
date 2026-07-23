import Link from "next/link";

import { Icon, type IconName } from "@/components/icons";
import { Reveal } from "@/components/ui/scroll";

/**
 * The section shapes the legacy pages repeat: interior hero, section head,
 * card grid, feature row, steps, CTA strip. Extracted so 22 pages share one
 * implementation instead of 22 copies of the same markup — which is how the
 * legacy site's pages drifted apart.
 *
 * Class names are the ported legacy ones; these components are structure, not
 * new styling.
 */

/** Interior page hero. The home page has its own bespoke hero. */
export function PageHero({
  crumb,
  title,
  lede,
  children,
}: {
  crumb?: React.ReactNode;
  title: string;
  lede?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="page-hero">
      <div className="glow" />
      <div className="wrap">
        {crumb && <div className="crumb">{crumb}</div>}
        <h1>{title}</h1>
        {lede && <p className="lede">{lede}</p>}
        {children}
      </div>
    </section>
  );
}

export function Section({
  variant,
  small,
  children,
}: {
  variant?: "alt" | "dark";
  small?: boolean;
  children: React.ReactNode;
}) {
  const className = ["sec", small ? "sec-sm" : "", variant ?? ""]
    .filter(Boolean)
    .join(" ");
  return (
    <section className={className}>
      <div className="wrap">{children}</div>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  children,
  center,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <Reveal className={center ? "sec-head center" : "sec-head"}>
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      {/* Question-form headings and an answer-first paragraph are the GEO
          structure (spec D16) — they make the page quotable by answer
          engines. The copy itself is the legacy copy. */}
      <h2>{title}</h2>
      {children}
    </Reveal>
  );
}

export interface CardSpec {
  readonly href?: string;
  readonly icon?: IconName;
  readonly tag?: string;
  readonly title: string;
  readonly body: string;
  readonly linkLabel?: string;
}

export function CardGrid({
  cards,
  columns = 3,
}: {
  cards: readonly CardSpec[];
  columns?: 2 | 3 | 4;
}) {
  return (
    <Reveal className={`grid-${columns}`} style={{ marginTop: 46 }}>
      {cards.map((card) => {
        const inner = (
          <>
            {card.icon && <Icon name={card.icon} className="ic" />}
            {card.tag && <span className="tag">{card.tag}</span>}
            <h3>{card.title}</h3>
            <p>{card.body}</p>
            {card.href && (
              <span className="card-link">{card.linkLabel ?? "Explore →"}</span>
            )}
          </>
        );

        return card.href ? (
          <Link href={card.href} className="card" key={card.title}>
            {inner}
          </Link>
        ) : (
          <div className="card" key={card.title}>
            {inner}
          </div>
        );
      })}
    </Reveal>
  );
}

export interface StepSpec {
  readonly title: string;
  readonly body: string;
}

export function Steps({ steps }: { steps: readonly StepSpec[] }) {
  return (
    <Reveal className="steps" style={{ marginTop: 30 }}>
      {steps.map((step, index) => (
        <div
          className="step"
          key={step.title}
          style={index === steps.length - 1 ? { borderBottom: "none" } : undefined}
        >
          <span className="sn" />
          <div>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </div>
        </div>
      ))}
    </Reveal>
  );
}

export function FeatureRow({
  num,
  title,
  body,
  points,
  reverse,
  aside,
}: {
  num: string;
  title: string;
  body: string;
  points?: readonly string[];
  reverse?: boolean;
  aside?: React.ReactNode;
}) {
  return (
    <Reveal className={reverse ? "frow rev" : "frow"}>
      <div className="ftext">
        <div className="num">{num}</div>
        <h3>{title}</h3>
        <p>{body}</p>
        {points && (
          <ul>
            {points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        )}
      </div>
      <div>{aside}</div>
    </Reveal>
  );
}

export function CtaStrip({
  title = "See Keiri run a close.",
  body = "Book a 30-minute demo and we'll automate one of your real workflows live — AP matching, a GST reconciliation, or a close checklist.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <Section>
      <Reveal className="cta-strip">
        <div>
          <h2>{title}</h2>
          <p>{body}</p>
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <Link href="/contact" className="btn btn-gold">
            Book a demo
          </Link>
        </div>
      </Reveal>
    </Section>
  );
}

export function Faq({
  items,
}: {
  items: ReadonlyArray<{ q: string; a: string }>;
}) {
  return (
    <div className="faq" style={{ marginTop: 30 }}>
      {items.map((item) => (
        <details key={item.q}>
          <summary>{item.q}</summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}

export function BigQuote({
  quote,
  attribution,
}: {
  quote: string;
  attribution: string;
}) {
  return (
    <Reveal className="bigquote">
      <p>{quote}</p>
      <small>{attribution}</small>
    </Reveal>
  );
}
