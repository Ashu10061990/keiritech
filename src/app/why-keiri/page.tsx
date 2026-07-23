import type { Metadata } from "next";
import Link from "next/link";

import { AskKeiriButton } from "@/components/chat/AskKeiriButton";
import { Reveal } from "@/components/ui/scroll";
import {
  BigQuote,
  CardGrid,
  CtaStrip,
  Section,
  SectionHead,
} from "@/components/ui/sections";
import { breadcrumbJsonLd, JsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Why Keiri",
  description:
    "Keiri Tech comes out of a working CA practice, not a lab — Indian statute is built in, and the human stays in command of every number.",
  path: "/why-keiri",
});

/** ⛔ Copy verbatim from the legacy `why-keiri.html`. */

const REASONS = [
  {
    icon: "receipt" as const,
    title: "Domain-first",
    body: "Indian statute is built in — Schedule III, GST law, the Income-tax Act, TDS sections. Keiri isn't a generic tool with a tax skin; it understands the rules your work runs on.",
  },
  {
    icon: "search" as const,
    title: "Exceptions, not everything",
    body: "Keiri does the routine work and escalates only what needs a human. Your team's judgment goes to the decisions, not the data entry.",
  },
  {
    icon: "shield" as const,
    title: "Yours to control",
    body: "Standalone and offline-capable where you need it, with audit trails throughout and encryption end to end. Your data stays your data.",
  },
];

const AI_STANCE = [
  {
    title: "Transparent",
    body: "Every action is logged and explainable in plain language. No black boxes posting to your ledger.",
  },
  {
    title: "Controlled",
    body: "Approvals, thresholds and segregation of duties gate everything Keiri does. Nothing slips past your rules.",
  },
  {
    title: "Accountable",
    body: "When Keiri flags an exception, a person decides. The judgment — and the responsibility — stays with you.",
  },
];

export default function WhyKeiriPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Why Keiri", path: "/why-keiri" },
        ])}
      />

      <section className="page-hero">
        <div className="glow" />
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link> / Why Keiri
          </div>
          <h1>Built by people who actually close the books.</h1>
          <p className="lede">
            Keiri Tech comes out of a working CA practice, not a lab. The
            automation is shaped by how finance really runs in India — the
            statutes, the deadlines, the late nights.
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
        <CardGrid cards={REASONS} />
      </Section>

      <Section variant="dark">
        <SectionHead
          eyebrow="Our approach to AI"
          title="An assistant, not an autopilot you can't see."
        >
          <p>
            The current wave of finance AI promises to &ldquo;do
            everything.&rdquo; We think that&apos;s the wrong promise. Keiri does
            the repetitive work, shows you what it did, and never posts outside
            the controls you set. You stay in command of the numbers.
          </p>
        </SectionHead>
        <Reveal className="grid-3" style={{ marginTop: 44 }}>
          {AI_STANCE.map((item) => (
            <div className="card card-on-dark" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </Reveal>
      </Section>

      <section className="sec alt">
        <div className="narrow">
          <BigQuote
            quote={
              '"A finance team shouldn\'t spend its month assembling numbers. It should spend it understanding them."'
            }
            attribution="— THE KEIRI TECH PRINCIPLE"
          />
        </div>
      </section>

      <CtaStrip />
    </>
  );
}
