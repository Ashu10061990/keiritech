import type { Metadata } from "next";
import Link from "next/link";

import { AskKeiriButton } from "@/components/chat/AskKeiriButton";
import { Reveal } from "@/components/ui/scroll";
import { CtaStrip, Faq, Section, SectionHead } from "@/components/ui/sections";
import { breadcrumbJsonLd, faqJsonLd, JsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Pricing",
  description:
    "Keiri is priced to the workflows you automate and the size of your operation — never per seat. A short scoping call gets you a firm number.",
  path: "/pricing",
});

/** ⛔ Copy verbatim from the legacy `pricing.html`. */

interface Plan {
  readonly tag: string;
  readonly name: string;
  readonly price: string;
  readonly unit: string;
  readonly blurb: string;
  readonly features: readonly string[];
  readonly ctaLabel: string;
  readonly featured?: boolean;
}

const PLANS: readonly Plan[] = [
  {
    tag: "Start",
    name: "Single workflow",
    price: "Scoped",
    unit: " / per workflow",
    blurb: "Automate one painful workflow end to end.",
    features: [
      "One workflow (e.g. GST recon or AP matching)",
      "Core connectors",
      "Audit trail & controls",
      "Email support",
      "Onboarding assistance",
    ],
    ctaLabel: "Talk to us",
  },
  {
    tag: "Grow",
    name: "The back office",
    price: "Scoped",
    unit: " / per month",
    blurb: "The full set of solutions, working together.",
    features: [
      "AP/AR, close, FP&A, tax & controls",
      "All standard integrations",
      "Multi-entity & multi-GSTIN",
      "Keiri AI assistant",
      "Priority support & success manager",
    ],
    ctaLabel: "Book a demo",
    featured: true,
  },
  {
    tag: "Firm",
    name: "For CA firms",
    price: "Scoped",
    unit: " / by client volume",
    blurb: "Run compliance across many clients from one place.",
    features: [
      "Multi-client management",
      "Central compliance calendar",
      "Firm-wide dashboards",
      "Role-based team access",
      "Dedicated onboarding",
    ],
    ctaLabel: "Talk to us",
  },
];

const PRICING_FAQS = [
  {
    q: "Why isn't pricing listed as a fixed number?",
    a: "Because the right scope varies a lot — one workflow for a small team looks very different from the full back office across five entities. We scope it to what you actually need so you're not paying for shelfware, and give you a firm quote after a short call.",
  },
  {
    q: "Do you charge per user?",
    a: "No. Pricing is based on the workflows, entities and volume you automate — not how many people log in — so you can give the whole team access without a penalty.",
  },
  {
    q: "How long does onboarding take?",
    a: "A single workflow can be live in weeks, not months. We connect your systems, map your rules, and run alongside your existing process until you're confident.",
  },
  {
    q: "Is there a contract lock-in?",
    a: "We aim to earn the renewal, not trap it. We'll talk terms openly during scoping — including shorter initial commitments where it makes sense.",
  },
];

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={[
          faqJsonLd(PRICING_FAQS),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Pricing", path: "/pricing" },
          ]),
        ]}
      />

      <section className="page-hero">
        <div className="glow" />
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link> / Pricing
          </div>
          <h1>Priced to the work, not the seat.</h1>
          <p className="lede">
            Keiri is scoped to the workflows you automate and the size of your
            operation — so you pay for outcomes, not licences. The fastest way to
            a number is a short demo.
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
        <Reveal className="price-grid">
          {PLANS.map((plan) => (
            <div
              className={plan.featured ? "plan feat" : "plan"}
              key={plan.name}
            >
              <span className="ptag">{plan.tag}</span>
              <h3>{plan.name}</h3>
              <div className="pprice">
                {plan.price}
                <small>{plan.unit}</small>
              </div>
              <p style={{ color: "var(--muted)", fontSize: 14 }}>{plan.blurb}</p>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Link
                href="/contact"
                className={
                  plan.featured ? "btn btn-gold" : "btn btn-outline-dark"
                }
              >
                {plan.ctaLabel}
              </Link>
            </div>
          ))}
        </Reveal>

        <p
          className="center"
          style={{ marginTop: 30, color: "var(--muted)", fontSize: 14 }}
        >
          No per-seat charges. Pricing reflects scope, entities and volume —
          we&apos;ll give you a clear number after a short scoping call.
        </p>
      </Section>

      <section className="sec alt">
        <div className="narrow">
          <SectionHead eyebrow="Pricing questions" title="Common questions" />
          <Faq items={PRICING_FAQS} />
        </div>
      </section>

      <CtaStrip
        title="Want a real number?"
        body="Book a short scoping call and we'll map Keiri to your workflows and give you a clear quote."
      />
    </>
  );
}
