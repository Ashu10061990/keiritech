import { z } from "zod";

import { getContactAddress, sendMail } from "@/server/mail";
import { checkRateLimit, clientKey } from "@/server/rate-limit";

/**
 * Contact form endpoint (spec D14).
 *
 * The legacy site assembled a `mailto:` URL in the browser and stored nothing.
 * That behaviour is retained in the client as the no-JS / endpoint-down
 * fallback; this is the primary path.
 *
 * Nothing is persisted — in MVP the email is the record.
 */

export const runtime = "nodejs";

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

export const ContactPayload = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("A valid email is required").max(254),
  company: z.string().trim().max(160).optional(),
  phone: z.string().trim().max(40).optional(),
  message: z.string().trim().min(1, "Message is required").max(5000),
  /**
   * Honeypot. Rendered off-screen and aria-hidden, so a human never fills it.
   * A filled value means a bot: accept silently rather than reporting the
   * rejection, which would tell the bot which field is the trap.
   *
   * ⚠️ This must parse permissively. Constraining it here (e.g. `.max(0)`)
   * makes a filled honeypot fail validation and return a 400 naming the field —
   * which hands a bot the answer. The check belongs after parsing.
   */
  company_website: z.string().max(200).optional(),
});

export type ContactPayload = z.infer<typeof ContactPayload>;

function json(body: unknown, status: number, headers?: HeadersInit): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

export async function POST(request: Request): Promise<Response> {
  const limit = checkRateLimit(
    `contact:${clientKey(request)}`,
    RATE_LIMIT,
    RATE_WINDOW_MS,
  );
  if (!limit.allowed) {
    return json({ error: "Too many messages. Please try again shortly." }, 429, {
      "retry-after": String(limit.retryAfterSeconds),
    });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch (cause) {
    // Malformed body — the client is broken or hostile. Nothing to log usefully.
    void cause;
    return json({ error: "Request body must be valid JSON." }, 400);
  }

  const parsed = ContactPayload.safeParse(raw);
  if (!parsed.success) {
    // Return field names only. Echoing submitted values back would make this
    // endpoint a reflector.
    return json(
      {
        error: "Please check the highlighted fields.",
        fields: parsed.error.issues.map((issue) => issue.path.join(".")),
      },
      400,
    );
  }

  const data = parsed.data;

  if (data.company_website) {
    return json({ ok: true }, 200);
  }

  const lines = [
    `Name:    ${data.name}`,
    `Email:   ${data.email}`,
    data.company ? `Company: ${data.company}` : undefined,
    data.phone ? `Phone:   ${data.phone}` : undefined,
    "",
    data.message,
    "",
    "— sent from the keiritech.com contact form",
  ].filter((line): line is string => line !== undefined);

  try {
    await sendMail({
      to: getContactAddress(),
      replyTo: data.email,
      subject: `Website enquiry — ${data.name}`,
      text: lines.join("\n"),
    });
  } catch (cause) {
    // Never surface the provider's message: it can carry key fragments and
    // account detail. Log it server-side, return something generic.
    console.error("[contact] mail send failed", cause);
    return json(
      {
        error:
          "We could not send your message. Please email business@keiritech.com directly.",
      },
      502,
    );
  }

  return json({ ok: true }, 200);
}
