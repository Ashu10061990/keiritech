import type { Metadata } from "next";
import Link from "next/link";

import { AskKeiriButton } from "@/components/chat/AskKeiriButton";
import { Reveal } from "@/components/ui/scroll";
import {
  CardGrid,
  CtaStrip,
  Section,
  SectionHead,
} from "@/components/ui/sections";
import { CONTACT_EMAIL } from "@/lib/contact";
import { breadcrumbJsonLd, JsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Careers",
  description:
    "Help finance teams get their hours back. Open roles in engineering, finance automation, design and customer success — Greater Noida and remote.",
  path: "/careers",
});

/** ⛔ Copy and the four open roles verbatim from the legacy `careers.html`. */

const CULTURE = [
  {
    icon: "spark" as const,
    title: "Real impact",
    body: "Small team, big surface area. What you build ships and gets used by people who feel the difference immediately.",
  },
  {
    icon: "receipt" as const,
    title: "Domain depth",
    body: "Work at the intersection of Indian finance, statute and AI — a problem space with real substance, not just UI polish.",
  },
  {
    icon: "users" as const,
    title: "Flexible & remote-friendly",
    body: "Based in Greater Noida with remote-friendly roles. We care about output and craft, not seat time.",
  },
];

const ROLES = [
  {
    title: "Full-stack Engineer",
    meta: "Engineering · Greater Noida / Remote · Full-time",
  },
  {
    title: "Finance Automation Specialist (CA / CA-Inter)",
    meta: "Product · Greater Noida · Full-time",
  },
  { title: "Product Designer", meta: "Design · Remote · Full-time / Contract" },
  {
    title: "Customer Success — Finance",
    meta: "Success · Greater Noida / Remote · Full-time",
  },
];

export default function CareersPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Company", path: "/about" },
          { name: "Careers", path: "/careers" },
        ])}
      />

      <section className="page-hero">
        <div className="glow" />
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link> / <Link href="/about">Company</Link> /
            Careers
          </div>
          <h1>Help finance teams get their hours back.</h1>
          <p className="lede">
            We&rsquo;re a small team building automation that thousands of
            finance professionals will rely on. If that sounds like work worth
            doing, look below.
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
        <CardGrid cards={CULTURE} />
      </Section>

      <Section variant="alt">
        <SectionHead eyebrow="Open roles" title="Where we need help" />
        <div style={{ marginTop: 24 }}>
          {ROLES.map((role) => (
            <Reveal className="job" key={role.title}>
              <div>
                <h3>{role.title}</h3>
                <div className="jmeta">{role.meta}</div>
              </div>
              <Link href="/contact" className="btn btn-outline-dark">
                Apply
              </Link>
            </Reveal>
          ))}
        </div>
        <p style={{ marginTop: 26, color: "var(--muted)", fontSize: 15 }}>
          Don&apos;t see your role but think you&apos;d add something? Write to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--gold-deep)" }}>
            {CONTACT_EMAIL}
          </a>{" "}
          — we always read a good note.
        </p>
      </Section>

      <CtaStrip
        title="Like the problem?"
        body="Send us a line about what you'd want to work on and why. We read every message."
      />
    </>
  );
}
