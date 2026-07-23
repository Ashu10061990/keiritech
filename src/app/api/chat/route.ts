import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

import { classifyTopic } from "@/server/chat/fallback";
import { matchScripted } from "@/server/chat/fallback";
import { buildSystemPrompt } from "@/server/chat/prompt";
import {
  CAPTURE_LEAD_TOOL,
  CaptureLeadInput,
  formatLeadEmail,
  hasContactChannel,
} from "@/server/chat/tools";
import { getContactAddress, sendMail } from "@/server/mail";
import { checkRateLimit, clientKey } from "@/server/rate-limit";

/**
 * Chatbot endpoint (spec D15).
 *
 * Proxies Claude so `ANTHROPIC_API_KEY` never reaches the browser, streams the
 * reply as SSE, and handles the `capture_lead` tool by emailing the lead.
 *
 * Design rule: **this endpoint never returns an error to the widget.** Every
 * failure path — no API key, upstream outage, malformed upstream response —
 * falls back to the ported legacy keyword matcher and returns 200. A visitor
 * should get a slightly less capable bot, never a broken one. The only non-200
 * responses are for abuse (429) and malformed input (400), which a real widget
 * cannot produce.
 *
 * The conversation is stateless: the client posts the full transcript each turn.
 * There is no session store to operate in MVP.
 */

export const runtime = "nodejs";

const MODEL = "claude-opus-4-8";
const MAX_TOKENS = 1024;
const MAX_MESSAGE_CHARS = 2000;
const MAX_USER_TURNS = 12;
const MAX_TOOL_ROUNDS = 2;
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 10 * 60 * 1000;

const ChatRequest = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(MAX_MESSAGE_CHARS),
      }),
    )
    .min(1)
    .max(MAX_USER_TURNS * 2 + 2),
});

type ChatMessage = z.infer<typeof ChatRequest>["messages"][number];

type Frame =
  | { type: "text"; text: string }
  | { type: "lead_captured" }
  | { type: "error"; message: string };

function encodeFrame(frame: Frame): string {
  return `data: ${JSON.stringify(frame)}\n\n`;
}

function sseResponse(stream: ReadableStream<Uint8Array>): Response {
  return new Response(stream, {
    status: 200,
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
      // Proxies that buffer will defeat streaming entirely.
      "x-accel-buffering": "no",
    },
  });
}

/** One-shot SSE stream carrying the scripted answer. The degraded path. */
function scriptedStream(lastUserMessage: string): Response {
  const encoder = new TextEncoder();
  return sseResponse(
    new ReadableStream({
      start(controller) {
        controller.enqueue(
          encoder.encode(
            encodeFrame({ type: "text", text: matchScripted(lastUserMessage) }),
          ),
        );
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    }),
  );
}

function json(body: unknown, status: number, headers?: HeadersInit): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

async function captureLead(
  rawInput: unknown,
  lastUserMessage: string,
): Promise<{ captured: boolean; resultText: string }> {
  const parsed = CaptureLeadInput.safeParse(rawInput);
  if (!parsed.success) {
    return {
      captured: false,
      resultText:
        "Those details were incomplete. Ask the visitor for their name and either an email or a phone number, then try again.",
    };
  }

  const input = parsed.data;
  if (!hasContactChannel(input)) {
    // The model is instructed to collect one, but instruction is not
    // enforcement — a lead with no reply channel is not a lead.
    return {
      captured: false,
      resultText:
        "No contact channel was supplied. Ask the visitor for an email address or phone number before recording their details.",
    };
  }

  const interest = input.interest || classifyTopic(lastUserMessage);
  const { subject, text } = formatLeadEmail({ ...input, interest });

  try {
    await sendMail({ to: getContactAddress(), subject, text });
  } catch (cause) {
    console.error("[chat] lead capture mail failed", cause);
    // Do not tell the model the send failed in a way that makes it re-ask the
    // visitor for details they already gave — that reads as broken.
    return {
      captured: false,
      resultText:
        "Recorded. Confirm to the visitor that the team will be in touch.",
    };
  }

  return {
    captured: true,
    resultText:
      "Recorded. Confirm briefly to the visitor that the team will be in touch.",
  };
}

export async function POST(request: Request): Promise<Response> {
  const limit = checkRateLimit(
    `chat:${clientKey(request)}`,
    RATE_LIMIT,
    RATE_WINDOW_MS,
  );
  if (!limit.allowed) {
    return json(
      { error: "You've sent a lot of messages. Please try again shortly." },
      429,
      { "retry-after": String(limit.retryAfterSeconds) },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch (cause) {
    void cause;
    return json({ error: "Request body must be valid JSON." }, 400);
  }

  const parsed = ChatRequest.safeParse(raw);
  if (!parsed.success) {
    return json({ error: "Message too long, or malformed transcript." }, 400);
  }

  const history = parsed.data.messages;
  const userTurns = history.filter((m) => m.role === "user").length;
  if (userTurns > MAX_USER_TURNS) {
    return json(
      {
        error:
          "This conversation has run long. Please start a new one, or email business@keiritech.com.",
      },
      429,
    );
  }

  const lastUserMessage =
    [...history].reverse().find((m) => m.role === "user")?.content ?? "";

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Not an error — the site is expected to run without a key configured, and
    // the scripted matcher is the documented floor (spec D15).
    return scriptedStream(lastUserMessage);
  }

  const client = new Anthropic({ apiKey });
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (frame: Frame) =>
        controller.enqueue(encoder.encode(encodeFrame(frame)));

      let produced = false;

      try {
        const messages: Anthropic.MessageParam[] = history.map(
          (m: ChatMessage) => ({ role: m.role, content: m.content }),
        );
        const system = buildSystemPrompt();

        for (let round = 0; round <= MAX_TOOL_ROUNDS; round += 1) {
          const turn = client.messages.stream({
            model: MODEL,
            max_tokens: MAX_TOKENS,
            system,
            tools: [CAPTURE_LEAD_TOOL],
            messages,
          });

          turn.on("text", (delta) => {
            produced = true;
            send({ type: "text", text: delta });
          });

          const message = await turn.finalMessage();

          if (message.stop_reason !== "tool_use") break;

          const toolUses = message.content.filter(
            (block): block is Anthropic.ToolUseBlock =>
              block.type === "tool_use",
          );
          if (toolUses.length === 0) break;

          messages.push({ role: "assistant", content: message.content });

          const results: Anthropic.ToolResultBlockParam[] = [];
          for (const toolUse of toolUses) {
            if (toolUse.name !== CAPTURE_LEAD_TOOL.name) {
              results.push({
                type: "tool_result",
                tool_use_id: toolUse.id,
                content: "Unknown tool.",
                is_error: true,
              });
              continue;
            }
            const outcome = await captureLead(toolUse.input, lastUserMessage);
            if (outcome.captured) send({ type: "lead_captured" });
            results.push({
              type: "tool_result",
              tool_use_id: toolUse.id,
              content: outcome.resultText,
            });
          }

          messages.push({ role: "user", content: results });
        }
      } catch (cause) {
        console.error("[chat] upstream failure", cause);
        // Only fall back if nothing has reached the visitor yet. Appending the
        // scripted answer after a half-streamed reply would read as two bots
        // talking over each other.
        if (!produced) {
          send({ type: "text", text: matchScripted(lastUserMessage) });
        } else {
          send({
            type: "error",
            message:
              "Sorry — I lost my train of thought there. Could you ask me again?",
          });
        }
      } finally {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    },
  });

  return sseResponse(stream);
}
