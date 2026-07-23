"use client";

import { useState } from "react";

import { CONTACT_EMAIL } from "@/lib/contact";

/**
 * Contact form (spec D14).
 *
 * The legacy site assembled a `mailto:` URL in the browser and stored nothing.
 * That is the parity baseline and is retained here as the fallback path: if the
 * endpoint is unreachable or returns 5xx, the form opens the visitor's mail
 * client with the same subject and body the legacy site built. The visitor is
 * never left with an unsendable message.
 */

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "fallback" }
  | { kind: "error"; message: string };

interface Fields {
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
}

const EMPTY: Fields = {
  name: "",
  email: "",
  company: "",
  phone: "",
  message: "",
};

/** The legacy mailto: construction, ported from contact.html. */
export function buildMailtoUrl(fields: Fields): string {
  const subject = `Website enquiry — ${fields.name}`;
  const body = [
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
    fields.company ? `Company: ${fields.company}` : "",
    fields.phone ? `Phone: ${fields.phone}` : "",
    "",
    fields.message,
  ]
    .filter(Boolean)
    .join("\n");

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

export function ContactForm() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const set = (key: keyof Fields) => (value: string) =>
    setFields((current) => ({ ...current, [key]: value }));

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ kind: "sending" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...fields, company_website: honeypot }),
      });

      if (response.ok) {
        setStatus({ kind: "sent" });
        setFields(EMPTY);
        return;
      }

      if (response.status === 400 || response.status === 429) {
        const body = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        setStatus({
          kind: "error",
          message: body.error ?? "Please check your details and try again.",
        });
        return;
      }

      // 5xx — the endpoint is down. Fall back to the legacy mailto: path
      // rather than losing what the visitor typed.
      window.location.href = buildMailtoUrl(fields);
      setStatus({ kind: "fallback" });
    } catch (cause) {
      // Network failure — same fallback.
      console.warn("[contact] endpoint unreachable, falling back to mailto", cause);
      window.location.href = buildMailtoUrl(fields);
      setStatus({ kind: "fallback" });
    }
  }

  const sending = status.kind === "sending";

  return (
    <form
      className="cform grid gap-4"
      onSubmit={handleSubmit}
      // Without JS the browser posts here. The endpoint accepts form encoding
      // as well as JSON, so the no-JS path still reaches a human.
      action="/api/contact"
      method="post"
      noValidate
    >
      <Field
        id="name"
        label="Your name"
        value={fields.name}
        onChange={set("name")}
        required
        autoComplete="name"
      />
      <Field
        id="email"
        label="Work email"
        type="email"
        value={fields.email}
        onChange={set("email")}
        required
        autoComplete="email"
      />
      <Field
        id="company"
        label="Company"
        value={fields.company}
        onChange={set("company")}
        autoComplete="organization"
      />
      <Field
        id="phone"
        label="Phone"
        type="tel"
        value={fields.phone}
        onChange={set("phone")}
        autoComplete="tel"
      />

      <div className="grid gap-2">
        <label htmlFor="message" className="text-sm font-medium text-navy">
          What would you like to automate?
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          value={fields.message}
          onChange={(event) => set("message")(event.target.value)}
          className="rounded-lg border border-line bg-paper-card px-3 py-2 text-ink outline-none focus:border-gold"
        />
      </div>

      {/* Honeypot. Hidden from humans and assistive tech; bots fill it. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company_website">Company website</label>
        <input
          id="company_website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="btn btn-gold rounded-lg bg-gold px-5 py-3 font-medium text-navy-deep disabled:opacity-60"
      >
        {sending ? "Sending…" : "Send message"}
      </button>

      <p role="status" aria-live="polite" className="min-h-6 text-sm">
        {status.kind === "sent" && (
          <span className="text-navy-soft">
            Thanks — we&apos;ve got your message and will reply shortly.
          </span>
        )}
        {status.kind === "fallback" && (
          <span className="text-muted">
            We couldn&apos;t reach our server, so we&apos;ve opened your email
            client instead. If nothing happened, write to{" "}
            <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
            .
          </span>
        )}
        {status.kind === "error" && (
          <span className="text-muted">{status.message}</span>
        )}
      </p>
    </form>
  );
}

interface FieldProps {
  id: keyof Fields & string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  required = false,
  autoComplete,
}: FieldProps) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium text-navy">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-line bg-paper-card px-3 py-2 text-ink outline-none focus:border-gold"
      />
    </div>
  );
}
