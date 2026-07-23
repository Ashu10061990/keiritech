import Link from "next/link";

import { AskKeiriButton } from "@/components/chat/AskKeiriButton";
import { Icon } from "@/components/icons";
import { MockPanel, StatBand } from "@/components/SolutionPage";
import { Reveal } from "@/components/ui/scroll";
import {
  BigQuote,
  CtaStrip,
  Section,
  SectionHead,
} from "@/components/ui/sections";
import type { AudiencePageData } from "@/content/audiences";
import { breadcrumbJsonLd, JsonLd } from "@/lib/jsonld";

/** Renders an audience page from `src/content/audiences.ts`. */
export function AudiencePage({ data }: { data: AudiencePageData }) {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: data.crumb, path: `/${data.slug}` },
        ])}
      />

      <section className="page-hero">
        <div className="glow" />
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link> / Who it&rsquo;s for / {data.crumb}
          </div>
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
        <Reveal className="grid-2" style={{ alignItems: "center", gap: 54 }}>
          <div>
            <div className="eyebrow">What gets in the way</div>
            <h2
              style={{
                fontSize: 34,
                color: "var(--navy)",
                marginTop: 12,
              }}
            >
              The day-to-day, before Keiri
            </h2>
            <ul className="lead-list">
              {data.painPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <MockPanel mock={data.todayMock} />
        </Reveal>
      </Section>

      <Section variant="alt">
        <SectionHead eyebrow="With Keiri" title="What changes" />
        <Reveal className="grid-3" style={{ marginTop: 40 }}>
          {data.changes.map((change) => (
            <div className="card" key={change.title}>
              <Icon name={change.icon} className="ic" />
              <h3>{change.title}</h3>
              <p>{change.body}</p>
            </div>
          ))}
        </Reveal>
        <StatBand stats={data.stats} />
      </Section>

      <section className="sec">
        <div className="narrow">
          <BigQuote quote={data.quote} attribution={data.attribution} />
        </div>
      </section>

      <CtaStrip />
    </>
  );
}
