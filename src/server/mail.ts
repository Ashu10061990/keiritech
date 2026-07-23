import { Resend } from "resend";

/**
 * The single mail transport. Both the contact form and chatbot lead capture go
 * through here, so there is one place that knows the destination address and one
 * place to change when the provider changes.
 *
 * Server-only. `RESEND_API_KEY` must never be exposed via a `NEXT_PUBLIC_*`
 * variable.
 */

export class MailError extends Error {
  override readonly name = "MailError";

  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
  }
}

export interface MailPayload {
  readonly subject: string;
  readonly text: string;
  /** Overrides the default recipient. Defaults to `CONTACT_TO_EMAIL`. */
  readonly to?: string;
  /** Set so a reply from the inbox goes straight back to the visitor. */
  readonly replyTo?: string;
}

let client: Resend | undefined;

function getClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new MailError("RESEND_API_KEY is not configured");
  }
  client ??= new Resend(apiKey);
  return client;
}

export function getContactAddress(): string {
  return process.env.CONTACT_TO_EMAIL ?? "business@keiritech.com";
}

export async function sendMail(payload: MailPayload): Promise<void> {
  const to = payload.to ?? getContactAddress();
  const from = process.env.CONTACT_FROM_EMAIL ?? "website@keiritech.com";

  const { error } = await getClient().emails.send({
    from,
    to,
    subject: payload.subject,
    text: payload.text,
    ...(payload.replyTo ? { replyTo: payload.replyTo } : {}),
  });

  // Resend reports failures in the response body rather than throwing, so an
  // unchecked call here would silently drop mail while reporting success.
  if (error) {
    throw new MailError(`Mail provider rejected the message: ${error.message}`, {
      cause: error,
    });
  }
}
