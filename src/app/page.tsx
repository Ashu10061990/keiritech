import Image from "next/image";
import Link from "next/link";

import { AskKeiriButton } from "@/components/chat/AskKeiriButton";
import {
  BigQuote,
  CardGrid,
  CtaStrip,
  Section,
  SectionHead,
  Steps,
} from "@/components/ui/sections";
import { FillBar, Ledger } from "@/components/ui/scroll";
import {
  faqJsonLd,
  JsonLd,
  localBusinessJsonLd,
  softwareApplicationJsonLd,
} from "@/lib/jsonld";

/**
 * Home. Six sections, ported from the legacy `index.html`:
 * hero · four-corners grid · how it works · why Keiri · principle quote · CTA.
 *
 * ⛔ All copy is verbatim.
 */

const CORNERS = [
  {
    href: "/payables-receivables",
    icon: "ledger" as const,
    title: "Payables & receivables",
    body: "Capture invoices, run three-way matching, route approvals and chase collections — without a spreadsheet in sight.",
  },
  {
    href: "/financial-close",
    icon: "checkbox" as const,
    title: "The monthly close",
    body: "Reconcile banks and ledgers, post recurring accruals and surface variances the moment they appear.",
  },
  {
    href: "/fpa",
    icon: "chart" as const,
    title: "Planning & forecasting",
    body: 'Roll actuals into living models, refresh forecasts automatically and answer "what changed?" in plain language.',
  },
  {
    href: "/tax-compliance",
    icon: "receipt" as const,
    title: "Tax & compliance",
    body: "GST, TDS and income-tax workflows that reconcile, compute and stay filing-ready against a calendar that never slips.",
  },
  {
    href: "/audit-controls",
    icon: "search" as const,
    title: "Audit & controls",
    body: "Audit trails on every action, segregation of duties and control testing — so audits stop being a scramble.",
  },
  {
    href: "/keiri-ai",
    icon: "bot" as const,
    title: "Meet Keiri AI",
    body: "The agent behind it all — it partners with your team and keeps you in command of every number.",
  },
];

const HOW_IT_WORKS = [
  {
    title: "Connect your systems",
    body: "Keiri links to your ERP, GL, GSTN and spreadsheets through prebuilt connectors — no rip-and-replace, no long IT project.",
  },
  {
    title: "Keiri learns your rules",
    body: "It maps your chart of accounts, approval matrix and filing calendar, so the automation reflects how your team actually works.",
  },
  {
    title: "The routine runs itself",
    body: "Reconciliations, matching, accruals and filings happen on schedule. Keiri flags only what needs a human decision.",
  },
  {
    title: "You stay in command",
    body: "Every action is logged with a full audit trail. Nothing posts without the controls and approvals you set.",
  },
];

const WHY = [
  {
    tag: "Domain-first",
    title: "Indian statute, built in",
    body: "Schedule III, GST law, the Income-tax Act, TDS sections — not a generic tool with a tax skin.",
  },
  {
    tag: "Exceptions, not everything",
    title: "Judgment where it matters",
    body: "Keiri does the routine work and escalates only what needs you. Your team's attention goes to the decisions.",
  },
  {
    tag: "Yours to control",
    title: "Your data stays yours",
    body: "Offline-capable where you need it, audit trails throughout, encryption end to end.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          localBusinessJsonLd(),
          softwareApplicationJsonLd(),
          faqJsonLd(),
        ]}
      />

      <section className="page-hero" style={{ padding: "150px 0 96px" }}>
        <div className="glow" />
        <div className="wrap hero-grid home-hero">
          <div>
            <div className="eyebrow">AI-driven financial operations</div>
            <h1 style={{ fontSize: "clamp(38px,5.2vw,66px)", marginTop: 14 }}>
              Give your finance team its{" "}
              <em style={{ fontStyle: "italic", color: "var(--gold-soft)" }}>
                hours
              </em>{" "}
              back.
            </h1>
            <p className="lede">
              Keiri Tech builds AI that runs the financial back office end to end
              — payables and receivables, the monthly close, forecasting and tax
              compliance — so your people stop reconciling and start deciding.
            </p>
            <div
              style={{
                marginTop: 32,
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              <Link href="/contact" className="btn btn-gold">
                Book a demo
              </Link>
              <AskKeiriButton className="btn btn-ghost">
                Talk to Keiri →
              </AskKeiriButton>
            </div>

            <div
              className="statband"
              style={{
                marginTop: 40,
                borderTop: "1px solid rgba(233,162,59,.2)",
                paddingTop: 22,
              }}
            >
              <div className="s">
                <b>70%</b>
                <small>less manual close work</small>
              </div>
              <div className="s">
                <b>3-day</b>
                <small>typical close, down from a week</small>
              </div>
              <div className="s">
                <b>24/7</b>
                <small>compliance watch</small>
              </div>
            </div>
          </div>

          <div className="home-art">
            <div className="home-art-glow" />
            <Image
              src="/keiri.png"
              alt="Keiri, the Keiri Tech AI assistant"
              width={430}
              height={560}
              priority
              className="home-art-img"
            />

            <div className="mock home-mock-a">
              <div className="mh" style={{ marginBottom: 10, paddingBottom: 8 }}>
                <span className="lbl">Close · June</span>
              </div>
              <div className="mrow ok">
                Bank recon<span className="v">412/412 ✓</span>
              </div>
              <div className="mrow ok">
                AP matched<span className="v">98% ✓</span>
              </div>
              <div className="mrow">
                Accruals<span className="v">running</span>
              </div>
              <FillBar width="82%" />
            </div>

            <div className="mock home-mock-b">
              <div className="mh" style={{ marginBottom: 10, paddingBottom: 8 }}>
                <span className="lbl">GST · GSTR-3B</span>
              </div>
              <div className="mrow ok">
                2B reconciled<span className="v">clean</span>
              </div>
              <div className="mrow ok">
                ITC eligible<span className="v">₹4.2L</span>
              </div>
              <div className="mrow">
                Filing<span className="v">ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Ledger />

      <Section>
        <SectionHead
          eyebrow="What we automate"
          title="Four corners of the back office, handled by AI."
        >
          <p>
            Each Keiri agent learns your chart of accounts, your approval rules
            and your filing calendar — then does the repetitive work while your
            team reviews exceptions, not everything.
          </p>
        </SectionHead>
        <CardGrid cards={CORNERS} />
      </Section>

      <Section variant="dark">
        <SectionHead
          eyebrow="How it works"
          title="Connect once. Review exceptions. Trust the numbers."
        />
        <Steps steps={HOW_IT_WORKS} />
      </Section>

      <Section>
        <SectionHead
          eyebrow="Why Keiri"
          title="Built by people who actually close the books."
        >
          <p>
            Keiri Tech comes out of a working CA practice, not a lab. We&apos;ve
            sat through the late-night reconciliations and the filing deadlines —
            so the automation is shaped by how finance really runs in India.
          </p>
        </SectionHead>
        <CardGrid cards={WHY} />
        <div style={{ marginTop: 30 }}>
          <Link href="/why-keiri" className="btn btn-outline-dark">
            Why teams choose Keiri →
          </Link>
        </div>
      </Section>

      <Section variant="alt">
        <BigQuote
          quote={
            '"A finance team shouldn\'t spend its month assembling numbers. It should spend it understanding them."'
          }
          attribution="— THE KEIRI TECH PRINCIPLE"
        />
      </Section>

      <CtaStrip />
    </>
  );
}
