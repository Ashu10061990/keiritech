import type { Metadata } from "next";
import Link from "next/link";

import { AskKeiriButton } from "@/components/chat/AskKeiriButton";
import {
  CardGrid,
  CtaStrip,
  Section,
  SectionHead,
} from "@/components/ui/sections";
import { breadcrumbJsonLd, JsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Resources",
  description:
    "Practical writing on closing faster, automating GST reconciliation, and putting AI to work in finance — drawn from real practice, not theory.",
  path: "/resources",
});

/** ⛔ Copy verbatim from the legacy `resources.html`. */

const FEATURED = [
  {
    href: "/resources/three-day-close-playbook",
    tag: "Guide",
    title: "The 3-day close playbook",
    body: "A practical, step-by-step guide to compressing your month-end close from a week to three days.",
    linkLabel: "Read →",
  },
  {
    href: "/blog/ai-in-the-finance-function",
    tag: "Article",
    title: "AI in the finance function: assistant, not autopilot",
    body: "Where AI genuinely helps finance teams today — and where keeping a human in command still matters.",
    linkLabel: "Read →",
  },
  {
    href: "/blog/automating-gst-reconciliation",
    tag: "Article",
    title: "Automating GST reconciliation, the right way",
    body: "How to reconcile GSTR-2B against your books without creating new risk — and what to automate first.",
    linkLabel: "Read →",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
        ])}
      />

      <section className="page-hero">
        <div className="glow" />
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link> / Resources
          </div>
          <h1>Guides and ideas for a calmer finance function.</h1>
          <p className="lede">
            Practical writing on closing faster, automating compliance, and
            putting AI to work in finance — drawn from real practice, not theory.
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
        <SectionHead eyebrow="Featured" title="Start here" />
        <CardGrid cards={FEATURED} />
      </Section>

      <Section variant="alt">
        <SectionHead
          eyebrow="More to come"
          title="What we&rsquo;re writing about next"
        >
          <p>
            We publish when we have something genuinely useful to say. On the
            list: TDS under the current section structure, building a rolling
            forecast that survives contact with reality, and what
            audit-readiness looks like when controls are continuous.
          </p>
        </SectionHead>
        <div style={{ marginTop: 26 }}>
          <AskKeiriButton className="btn btn-outline-dark">
            Ask Keiri a question
          </AskKeiriButton>
        </div>
      </Section>

      <CtaStrip
        title="Prefer a live walkthrough?"
        body="Book a demo and we'll show these ideas working on your own data."
      />
    </>
  );
}
