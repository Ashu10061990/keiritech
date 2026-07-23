import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AskKeiriButton } from "@/components/chat/AskKeiriButton";
import { Icon, type IconName } from "@/components/icons";
import { RoadmapBadge } from "@/components/SolutionPage";
import { Reveal } from "@/components/ui/scroll";
import { CtaStrip, Section, SectionHead } from "@/components/ui/sections";
import { breadcrumbJsonLd, JsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Keiri AI",
  description:
    "Keiri is the agent at the centre of the platform: explainable, gated by your controls, and logged on every action — it does the work, you keep command.",
  path: "/keiri-ai",
});

/** ⛔ Copy verbatim from the legacy `keiri-ai.html`. */

const GUARANTEES: ReadonlyArray<{
  icon: IconName;
  title: string;
  body: string;
}> = [
  {
    icon: "eye",
    title: "Explainable",
    body: "Ask Keiri why it matched or posted something and it shows the evidence and the rule it applied.",
  },
  {
    icon: "lock",
    title: "Gated",
    body: "Thresholds, approvals and segregation of duties bound what Keiri can do without sign-off.",
  },
  {
    icon: "doc",
    title: "Logged",
    body: "Every Keiri action is in the audit trail, so there's always a clear record of what happened and why.",
  },
];

export default function KeiriAiPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Platform", path: "/platform" },
          { name: "Keiri AI", path: "/keiri-ai" },
        ])}
      />

      <section className="page-hero">
        <div className="glow" />
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link> / <Link href="/platform">Platform</Link> /
            Keiri AI
          </div>
          <RoadmapBadge />
          <h1>Meet Keiri — the agent that does the work.</h1>
          <p className="lede">
            Keiri is the AI at the centre of the platform. It executes the
            repetitive tasks, explains what it did, and keeps you in command of
            every number.
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
        <Reveal className="grid-2" style={{ alignItems: "center", gap: 54 }}>
          <div>
            <div className="eyebrow">What Keiri does</div>
            <h2
              style={{
                fontSize: 34,
                color: "var(--navy)",
                margin: "12px 0 16px",
              }}
            >
              A teammate for the repetitive work
            </h2>
            <p style={{ color: "var(--muted)", fontSize: 17 }}>
              Think of Keiri as the colleague who never tires of
              reconciliations. It reads documents, matches transactions, posts
              routine journals, builds returns and watches the calendar — then
              hands you a tidy list of what actually needs a decision.
            </p>
            <ul className="lead-list">
              <li>
                Reads and extracts data from invoices, statements and returns
              </li>
              <li>Matches, computes and posts within the rules you set</li>
              <li>Explains every action in plain language</li>
              <li>Escalates exceptions for a human to decide</li>
            </ul>
          </div>

          <div className="keiri-portrait">
            <div className="keiri-portrait-glow" />
            <Image
              src="/keiri.png"
              alt="Keiri"
              width={340}
              height={440}
              className="keiri-portrait-img"
            />
          </div>
        </Reveal>
      </Section>

      <Section variant="dark">
        <SectionHead
          eyebrow="In your control"
          title="Powerful, but never unsupervised."
          center
        >
          <p>
            Keiri is designed around a simple rule: the AI does the work, and
            the human stays accountable. Here&apos;s how that&apos;s enforced.
          </p>
        </SectionHead>
        <Reveal className="grid-3" style={{ marginTop: 44 }}>
          {GUARANTEES.map((item) => (
            <div className="card card-on-dark" key={item.title}>
              <Icon name={item.icon} className="ic" />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </Reveal>
      </Section>

      <Section>
        <SectionHead eyebrow="Talk to Keiri" title="Ask in plain language.">
          <p>
            Keiri answers questions about your numbers and your workflows the
            way you&apos;d ask a colleague — &ldquo;what changed in power cost
            this month?&rdquo;, &ldquo;which invoices are stuck?&rdquo;,
            &ldquo;are we ready to file 3B?&rdquo;
          </p>
        </SectionHead>
        <div style={{ marginTop: 28 }}>
          <AskKeiriButton className="btn btn-dark">
            Try the assistant →
          </AskKeiriButton>
        </div>
      </Section>

      <CtaStrip />
    </>
  );
}
