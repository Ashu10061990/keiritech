import type { Metadata } from "next";

import { ContactForm } from "@/components/ContactForm";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to Keiri Tech about automating your finance back office. We'll automate one of your real workflows live in about 30 minutes.",
  alternates: { canonical: "/contact" },
};

/**
 * Scaffold-level page. Full copy migration from the legacy `contact.html` is
 * Task 8; the form itself is complete.
 */
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  // Set by the no-JS form post, which redirects here rather than rendering JSON.
  const { state } = await searchParams;

  return (
    <main className="mx-auto max-w-narrow px-6 py-20">
      <p className="text-sm uppercase tracking-widest text-gold">Contact</p>
      <h1 className="mt-3 text-3xl font-semibold text-navy">
        Book a demo, or just ask us something
      </h1>
      <p className="mt-4 text-muted">
        We&apos;ll automate one of your real workflows live in about 30 minutes.
        You can also write to{" "}
        <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>{" "}
        or call{" "}
        <a className="underline" href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}>
          {CONTACT_PHONE}
        </a>
        .
      </p>

      {state === "sent" && (
        <p className="mt-6 rounded-lg border border-line bg-paper-card p-4 text-navy-soft">
          Thanks — we&apos;ve got your message and will reply shortly.
        </p>
      )}
      {state === "invalid" && (
        <p className="mt-6 rounded-lg border border-line bg-paper-card p-4 text-muted">
          Something in the form didn&apos;t look right. Please check your name,
          email and message, then try again.
        </p>
      )}
      {state === "failed" && (
        <p className="mt-6 rounded-lg border border-line bg-paper-card p-4 text-muted">
          We couldn&apos;t send that. Please email{" "}
          <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>{" "}
          directly.
        </p>
      )}

      <div className="mt-10">
        <ContactForm />
      </div>
    </main>
  );
}
