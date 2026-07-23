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
  title: "Security & trust",
  description:
    "Encryption in transit and at rest, role-based access with segregation of duties, a tamper-evident audit trail, and offline-capable tools for sensitive data.",
  path: "/security",
});

/**
 * ⛔ Copy verbatim from the legacy `security.html`.
 *
 * ⚠️ The claims on this page are deliberately careful — note "Pursuing formal
 * certifications as we scale", not a claim of holding any. Do not upgrade this
 * language. Asserting SOC 2 or ISO where none exists is a misrepresentation to
 * enterprise buyers, and this is the page their security team reads.
 */

const PILLARS = [
  {
    icon: "lock" as const,
    title: "Encryption everywhere",
    body: "Data is encrypted in transit and at rest. Sensitive credentials are stored securely and never exposed in the interface.",
  },
  {
    icon: "users" as const,
    title: "Access control & SOD",
    body: "Role-based permissions with maker-checker separation, so the right people see and approve the right things.",
  },
  {
    icon: "doc" as const,
    title: "Complete audit trail",
    body: "Every action is logged with owner and timestamp in a tamper-evident record that exports cleanly for auditors.",
  },
  {
    icon: "shield" as const,
    title: "Offline-capable tools",
    body: "Where data is most sensitive, Keiri runs standalone — so your financials never leave your environment.",
  },
  {
    icon: "eye" as const,
    title: "You decide what connects",
    body: "Connections are opt-in per source. Nothing syncs to the cloud unless you choose to enable it.",
  },
  {
    icon: "grid" as const,
    title: "Data ownership",
    body: "Your data is yours. We don't sell it, and we don't use it to train models for anyone else.",
  },
];

const COMMITMENTS = [
  ["Encryption", "Encrypted in transit and at rest across the platform."],
  [
    "Access",
    "Role-based access, segregation of duties, least-privilege defaults.",
  ],
  ["Audit", "Immutable, exportable audit trail on every action."],
  ["Residency", "Offline and on-environment options for sensitive workloads."],
  ["Privacy", "Your data is never sold or used to train third-party models."],
  ["Continuity", "Backups and recovery procedures to protect against data loss."],
] as const;

export default function SecurityPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Platform", path: "/platform" },
          { name: "Security & trust", path: "/security" },
        ])}
      />

      <section className="page-hero">
        <div className="glow" />
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link> / <Link href="/platform">Platform</Link> /
            Security &amp; trust
          </div>
          <h1>Your financial data, protected by design.</h1>
          <p className="lede">
            Trust is the whole job in finance. Keiri is built with encryption,
            strict access control, complete audit trails and offline options —
            so your numbers stay safe and yours.
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
        <CardGrid cards={PILLARS} />
      </Section>

      <Section variant="alt">
        <SectionHead eyebrow="Our commitments" title="How we handle your data" />
        {/* Wrapped so a wide table scrolls inside its own box on a phone
            instead of widening the page. */}
        <Reveal className="ktable-scroll">
          <table className="ktable">
            <thead>
              <tr>
                <th>Area</th>
                <th>Our approach</th>
              </tr>
            </thead>
            <tbody>
              {COMMITMENTS.map(([area, approach]) => (
                <tr key={area}>
                  <td>{area}</td>
                  <td>{approach}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
        <p style={{ marginTop: 22, color: "var(--muted)", fontSize: 14 }}>
          Pursuing formal certifications as we scale. For current documentation
          or a security questionnaire, write to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--gold-deep)" }}>
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </Section>

      <CtaStrip
        title="Have a security question?"
        body="We're happy to walk your team through how Keiri protects your data, or complete a security questionnaire."
      />
    </>
  );
}
