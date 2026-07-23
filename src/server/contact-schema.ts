import { z } from "zod";

/**
 * Lives outside `app/api/contact/route.ts` because Next only permits route
 * handlers and a fixed set of config fields to be exported from a route file —
 * exporting the schema from there fails the build (and only the build: tests and
 * `tsc --noEmit` both pass).
 *
 * The client form imports this too, so the same rules validate on both sides.
 */
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
