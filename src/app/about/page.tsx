import type { Metadata } from "next";
import Link from "next/link";

import { AskKeiriButton } from "@/components/chat/AskKeiriButton";
import { Reveal } from "@/components/ui/scroll";
import { CtaStrip, Section, SectionHead } from "@/components/ui/sections";
import {
  breadcrumbJsonLd,
  JsonLd,
  localBusinessJsonLd,
} from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Company",
  description:
    "Keiri Tech grew out of a working chartered-accountancy practice. We built the tools we wished we had, then realized every finance team in India needed them.",
  path: "/about",
});

/** ⛔ Copy verbatim from the legacy `about.html`, including team bios. */

const TEAM = [
  {
    initials: "AV",
    name: "Ashutosh Verma",
    role: "Founder",
    bio: "Chartered Accountant and founder. Built the first Keiri tools inside a working practice before turning them into a product.",
  },
  {
    initials: "KV",
    name: "Komal Verma",
    role: "Finance & Controls",
    bio: "Finance controller focused on keeping Keiri’s automation aligned with statute, controls and real-world compliance.",
  },
  {
    initials: "KT",
    name: "The Keiri Team",
    role: "Product & Engineering",
    bio: "A small team of engineers and finance specialists building automation that finance professionals actually trust.",
  },
];

const VALUES = [
  {
    title: "Correctness first",
    body: 'In finance, "mostly right" isn\'t right. We build for accuracy and a record you can defend.',
  },
  {
    title: "Respect the user",
    body: "The professional stays in command. Keiri assists; it doesn't override judgment.",
  },
  {
    title: "Ship what works",
    body: "We'd rather solve one workflow completely than half-solve ten. Real relief beats a long feature list.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          localBusinessJsonLd(),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Company", path: "/about" },
          ]),
        ]}
      />

      <section className="page-hero">
        <div className="glow" />
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link> / Company
          </div>
          <h1>We started where the work is hard.</h1>
          <p className="lede">
            Keiri Tech grew out of a working chartered-accountancy practice. We
            built the tools we wished we had — then realized every finance team
            in India needed them.
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

      <section className="sec">
        <div className="narrow">
          <Reveal className="article" style={{ margin: 0 }}>
            <p>
              Keiri Tech began with a simple frustration: too much of skilled
              finance work is spent not on judgment, but on assembling numbers.
              Reconciling statements. Keying invoices. Rebuilding the same model
              every month. Chasing the same approvals. Filing the same returns
              against a calendar that never relents.
            </p>
            <p>
              We started building automation for our own practice — a GST
              reconciliation wizard here, a Schedule III tool there, a close
              checklist that actually tracked itself. The tools worked. The
              hours came back. And it became obvious that the problem
              wasn&apos;t ours alone.
            </p>
            <p>
              So we built Keiri: an AI assistant for the financial back office,
              grounded in Indian statute and shaped by how finance teams really
              work. Not a lab experiment, not a generic platform with a tax skin
              — a teammate for the work that has to get done, every month,
              correctly.
            </p>
            <blockquote>
              A finance team shouldn&apos;t spend its month assembling numbers.
              It should spend it understanding them.
            </blockquote>
            <p>
              That principle runs through everything we make. Keiri does the
              routine work and keeps you in command. The judgment stays with
              people. The hours go back to the work that&apos;s worth a
              person&apos;s time.
            </p>
          </Reveal>
        </div>
      </section>

      <Section variant="alt">
        <SectionHead
          eyebrow="The team"
          title="Built by accountants and engineers, together."
        />
        <Reveal className="team-grid">
          {TEAM.map((member) => (
            <div className="member" key={member.name}>
              <div className="av">{member.initials}</div>
              <h3>{member.name}</h3>
              <div className="role">{member.role}</div>
              <p>{member.bio}</p>
            </div>
          ))}
        </Reveal>
      </Section>

      <Section>
        <SectionHead
          eyebrow="Track record"
          title="We build for real practices, not slideware."
        />
        <Reveal className="grid-2" style={{ marginTop: 40 }}>
          <div className="card">
            <h3>GARP &amp; Associates — Assignment Tracker &amp; HRMS</h3>
            <p>
              We designed and deployed a production Assignment Tracker and HR
              Management System for GARP &amp; Associates, a
              chartered-accountancy firm. It runs staff attendance with monthly
              colour-coded reports, payroll access controls, standardised leave
              (CL/SL/EL/LWP), site-visit attendance, and an admin punch
              edit/delete flow with a full audit trail.
            </p>
            <p style={{ marginTop: 12 }}>
              It&apos;s the kind of system that taught us how accounting teams
              really operate — and that understanding is wired into everything
              Keiri builds.
            </p>
          </div>
          <div className="card">
            <h3>BookYourAccountant — on-demand marketplace</h3>
            <p>
              Our live marketplace connecting MSMEs with verified chartered
              accountants, booked by the day with proper GST invoices. Where
              Keiri automates the back office, BookYourAccountant puts a
              qualified professional on call.
            </p>
            <p style={{ marginTop: 12 }}>
              <a
                className="card-link"
                href="https://bookyouraccountant.com"
                rel="noopener"
              >
                Visit bookyouraccountant.com →
              </a>
            </p>
          </div>
        </Reveal>
      </Section>

      <Section variant="dark">
        <SectionHead eyebrow="What we value" title="How we work" />
        <Reveal className="grid-3" style={{ marginTop: 40 }}>
          {VALUES.map((value) => (
            <div className="card card-on-dark" key={value.title}>
              <h3>{value.title}</h3>
              <p>{value.body}</p>
            </div>
          ))}
        </Reveal>
      </Section>

      <CtaStrip
        title="Want to work with us?"
        body="Whether you're a finance team looking to automate or a builder who wants to join, we'd like to hear from you."
      />
    </>
  );
}
