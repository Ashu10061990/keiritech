import type Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

import { KEYWORD_GROUPS } from "./knowledge";

/**
 * The chatbot's one tool. Claude calls it once it has the visitor's name plus at
 * least one contact channel; the handler emails the lead to
 * business@keiritech.com through the same transport as the contact form.
 *
 * Kept to a single tool deliberately — the widget's job is to answer questions
 * and capture a lead, and every extra tool is another thing that can be called
 * at the wrong moment.
 */

/** Interest values, derived from the knowledge base so the two cannot drift. */
export const INTEREST_VALUES = [
  ...KEYWORD_GROUPS.map((group) => group.topic),
  "other",
] as const;

export const CaptureLeadInput = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254).optional(),
  phone: z.string().trim().min(4).max(40).optional(),
  company: z.string().trim().max(160).optional(),
  interest: z.string().trim().max(40),
  summary: z.string().trim().min(1).max(1000),
});

export type CaptureLeadInput = z.infer<typeof CaptureLeadInput>;

/**
 * A lead with no way to reach the visitor is not a lead. Claude is instructed to
 * collect one, but the model is not the enforcement point — this is.
 */
export function hasContactChannel(input: CaptureLeadInput): boolean {
  return Boolean(input.email ?? input.phone);
}

/**
 * Typed as `Anthropic.Tool` rather than `as const`: the SDK's `input_schema`
 * expects mutable `required` / `enum` arrays, so `as const` compiles here but
 * fails at the `client.messages.stream({ tools })` call site.
 */
export const CAPTURE_LEAD_TOOL: Anthropic.Tool = {
  name: "capture_lead",
  description:
    "Record a website visitor's contact details so the Keiri Tech team can follow up. " +
    "Call this exactly once per conversation, and only after the visitor has given " +
    "their name and at least one of email or phone. Never call it with details you " +
    "inferred or invented — only what the visitor actually typed.",
  input_schema: {
    type: "object" as const,
    properties: {
      name: { type: "string", description: "The visitor's name, as they gave it" },
      email: { type: "string", description: "Email address, if the visitor gave one" },
      phone: { type: "string", description: "Phone number, if the visitor gave one" },
      company: { type: "string", description: "Company name, if mentioned" },
      interest: {
        type: "string",
        enum: [...INTEREST_VALUES],
        description: "The workflow or topic the visitor asked about",
      },
      summary: {
        type: "string",
        description:
          "One sentence on what the visitor needs, in your own words, for the team's follow-up",
      },
    },
    required: ["name", "interest", "summary"],
    additionalProperties: false,
  },
};

export function formatLeadEmail(input: CaptureLeadInput): {
  subject: string;
  text: string;
} {
  const lines = [
    `Name:     ${input.name}`,
    input.email ? `Email:    ${input.email}` : undefined,
    input.phone ? `Phone:    ${input.phone}` : undefined,
    input.company ? `Company:  ${input.company}` : undefined,
    `Interest: ${input.interest}`,
    "",
    input.summary,
    "",
    "— captured by the Keiri chatbot on keiritech.com",
  ].filter((line): line is string => line !== undefined);

  return {
    subject: `Chatbot lead — ${input.name}${input.company ? ` (${input.company})` : ""}`,
    text: lines.join("\n"),
  };
}
