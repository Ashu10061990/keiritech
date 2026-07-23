import Link from "next/link";

import { AskKeiriButton } from "@/components/chat/AskKeiriButton";
import { FillBar, Reveal } from "@/components/ui/scroll";
import { CtaStrip, Faq, Section, SectionHead } from "@/components/ui/sections";
import type { Mock, SolutionPageData, Stat } from "@/content/solutions";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  JsonLd,
  serviceJsonLd,
} from "@/lib/jsonld";

/**
 * Renders a solution page from `src/content/solutions.ts`.
 *
 * The five legacy solution pages are structurally identical — hero, problem +
 * stats, four alternating feature rows with mock panels, FAQ, CTA — so they
 * share this one implementation.
 */

/**
 * "On the roadmap — Coming 2026".
 *
 * ⚠️ Load-bearing. This badge is the only thing on these pages that tells a
 * visitor the capability is not yet available. Removing it turns a roadmap
 * page into a claim of availability, which is a commercial misstatement, not
 * a styling choice.
 */
export function RoadmapBadge() {
  return <span className="roadmap-badge">On the roadmap — Coming 2026</span>;
}

export function StatBand({ stats }: { stats: readonly Stat[] }) {
  return (
    <Reveal className="statband" style={{ marginTop: 40 }}>
      {stats.map((stat) => (
        <div className="s" key={stat.label}>
          <b>{stat.value}</b>
          <small>{stat.label}</small>
        </div>
      ))}
    </Reveal>
  );
}

export function MockPanel({ mock }: { mock: Mock }) {
  return (
    <div className="mock">
      <div className="mh">
        <span className="lbl">{mock.label}</span>
      </div>
      {mock.rows.map((row) => (
        <div className={row.ok ? "mrow ok" : "mrow"} key={row.label}>
          {row.label}
          <span className="v">{row.value}</span>
        </div>
      ))}
      {mock.bar && <FillBar width={mock.bar} />}
    </div>
  );
}

export function SolutionPage({ data }: { data: SolutionPageData }) {
  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd({
            name: data.metaTitle,
            description: data.metaDescription,
            path: `/${data.slug}`,
          }),
          faqJsonLd(data.faqs),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Solutions", path: "/solutions" },
            { name: data.crumb, path: `/${data.slug}` },
          ]),
        ]}
      />

      <section className="page-hero">
        <div className="glow" />
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link> / <Link href="/solutions">Solutions</Link>{" "}
            / {data.crumb}
          </div>
          {data.roadmap && <RoadmapBadge />}
          <h1>{data.title}</h1>
          <p className="lede">{data.lede}</p>
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
        <SectionHead eyebrow="The problem" title={data.problemHeading}>
          <p>{data.problemBody}</p>
        </SectionHead>
        <StatBand stats={data.stats} />
      </Section>

      <Section variant="alt">
        {data.features.map((feature, index) => (
          <Reveal
            className={index % 2 === 1 ? "frow rev" : "frow"}
            key={feature.num}
          >
            <div className="ftext">
              <div className="num">{feature.num}</div>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
              <ul>
                {feature.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
            <MockPanel mock={feature.mock} />
          </Reveal>
        ))}
      </Section>

      <section className="sec">
        <div className="narrow">
          <SectionHead eyebrow="Questions" title="Good to know" />
          <Faq items={data.faqs} />
        </div>
      </section>

      <CtaStrip />
    </>
  );
}
