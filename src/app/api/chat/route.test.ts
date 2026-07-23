import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/** A stand-in for the SDK's MessageStream: `.on("text")` plus `.finalMessage()`. */
interface FakeTurn {
  text?: string;
  stopReason?: "end_turn" | "tool_use";
  toolInput?: unknown;
  toolName?: string;
  throws?: Error;
}

const turns: FakeTurn[] = [];
const streamCalls: unknown[] = [];

function nextTurn(): FakeTurn {
  return turns.shift() ?? { text: "…", stopReason: "end_turn" };
}

vi.mock("@anthropic-ai/sdk", () => {
  class FakeAnthropic {
    messages = {
      stream: (params: unknown) => {
        streamCalls.push(params);
        const turn = nextTurn();
        const listeners: Array<(delta: string) => void> = [];
        return {
          on(event: string, handler: (delta: string) => void) {
            if (event === "text") listeners.push(handler);
            return this;
          },
          async finalMessage() {
            if (turn.throws) throw turn.throws;
            if (turn.text) for (const l of listeners) l(turn.text);
            const content =
              turn.stopReason === "tool_use"
                ? [
                    {
                      type: "tool_use",
                      id: "toolu_1",
                      name: turn.toolName ?? "capture_lead",
                      input: turn.toolInput,
                    },
                  ]
                : [{ type: "text", text: turn.text ?? "" }];
            return { stop_reason: turn.stopReason ?? "end_turn", content };
          },
        };
      },
    };
  }
  return { default: FakeAnthropic };
});

vi.mock("@/server/mail", () => ({
  sendMail: vi.fn(async () => undefined),
  getContactAddress: () => "business@keiritech.com",
  MailError: class MailError extends Error {},
}));

import { sendMail } from "@/server/mail";
import { __resetRateLimitForTests } from "@/server/rate-limit";
import { FAQS } from "@/server/chat/knowledge";

const sendMailMock = vi.mocked(sendMail);

async function post(
  body: unknown,
  ip = "203.0.113.9",
): Promise<Response> {
  const { POST } = await import("./route");
  return POST(
    new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify(body),
    }),
  );
}

async function frames(res: Response): Promise<string> {
  return await res.text();
}

const ask = (content: string) => ({ messages: [{ role: "user", content }] });

beforeEach(() => {
  turns.length = 0;
  streamCalls.length = 0;
  sendMailMock.mockClear();
  sendMailMock.mockResolvedValue(undefined);
  __resetRateLimitForTests();
  vi.stubEnv("ANTHROPIC_API_KEY", "sk-ant-test");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("POST /api/chat — degraded paths never surface an error", () => {
  it("falls back to the scripted answer when no API key is configured", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    const res = await post(ask("can you automate gst filing?"));

    expect(res.status).toBe(200);
    const body = await frames(res);
    expect(body).toContain("GSTR-2B");
    expect(body).toContain("[DONE]");
    expect(streamCalls).toHaveLength(0);
  });

  it("falls back to the scripted answer when the upstream call throws", async () => {
    turns.push({ throws: new Error("529 overloaded") });
    const res = await post(ask("how much does it cost?"));

    expect(res.status).toBe(200);
    const body = await frames(res);
    expect(body).toContain(FAQS[4]!.a.slice(0, 40));
    expect(body).not.toContain("529");
  });

  it("does not append the scripted answer if text already reached the visitor", async () => {
    turns.push({ text: "Keiri reconciles ", stopReason: "tool_use", toolInput: {} });
    turns.push({ throws: new Error("connection reset") });
    const res = await post(ask("tell me about the close"));
    const body = await frames(res);

    expect(body).toContain("Keiri reconciles");
    expect(body).toContain("lost my train of thought");
    expect(body).not.toContain(FAQS[2]!.a);
  });
});

describe("POST /api/chat — lead capture", () => {
  const lead = {
    name: "Asha Menon",
    email: "asha@example.com",
    company: "Northwind",
    interest: "gst",
    summary: "Wants GSTR-2B reconciliation automated.",
  };

  it("emails the lead and emits lead_captured", async () => {
    turns.push({ stopReason: "tool_use", toolInput: lead });
    turns.push({ text: "The team will be in touch.", stopReason: "end_turn" });

    const body = await frames(await post(ask("we want a demo")));

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    const sent = sendMailMock.mock.calls[0]![0];
    expect(sent.to).toBe("business@keiritech.com");
    expect(sent.text).toContain("Asha Menon");
    expect(sent.text).toContain("asha@example.com");
    expect(body).toContain('"lead_captured"');
    expect(body).toContain("The team will be in touch.");
  });

  it("refuses a lead with no contact channel and asks the model for one", async () => {
    turns.push({
      stopReason: "tool_use",
      toolInput: { name: "Asha", interest: "gst", summary: "Interested." },
    });
    turns.push({ text: "Could I take an email?", stopReason: "end_turn" });

    const body = await frames(await post(ask("we want a demo")));

    expect(sendMailMock).not.toHaveBeenCalled();
    expect(body).not.toContain("lead_captured");
    expect(body).toContain("Could I take an email?");
  });

  it("refuses a lead whose email is malformed", async () => {
    turns.push({
      stopReason: "tool_use",
      toolInput: { ...lead, email: "not-an-email" },
    });
    turns.push({ text: "Sorry, could you repeat that?", stopReason: "end_turn" });

    await frames(await post(ask("demo please")));
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it("does not claim capture when the mail send fails", async () => {
    sendMailMock.mockRejectedValueOnce(new Error("resend down"));
    turns.push({ stopReason: "tool_use", toolInput: lead });
    turns.push({ text: "Noted.", stopReason: "end_turn" });

    const body = await frames(await post(ask("demo please")));
    expect(body).not.toContain("lead_captured");
  });

  it("rejects an unknown tool name rather than acting on it", async () => {
    turns.push({
      stopReason: "tool_use",
      toolName: "delete_everything",
      toolInput: {},
    });
    turns.push({ text: "Anyway…", stopReason: "end_turn" });

    await frames(await post(ask("hello")));
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it("stops after the tool-round cap instead of looping forever", async () => {
    for (let i = 0; i < 8; i += 1) {
      turns.push({ stopReason: "tool_use", toolInput: lead });
    }
    await frames(await post(ask("demo")));
    expect(streamCalls.length).toBeLessThanOrEqual(3);
  });
});

describe("POST /api/chat — request shape and abuse controls", () => {
  it("uses claude-opus-4-8 and sends the capture_lead tool", async () => {
    turns.push({ text: "Hello.", stopReason: "end_turn" });
    await frames(await post(ask("hi")));

    const params = streamCalls[0] as {
      model: string;
      max_tokens: number;
      tools: Array<{ name: string }>;
      system: string;
    };
    expect(params.model).toBe("claude-opus-4-8");
    expect(params.max_tokens).toBe(1024);
    expect(params.tools.map((t) => t.name)).toEqual(["capture_lead"]);
    expect(params.system).toContain("Never invent prices");
  });

  it("rejects a message beyond the character cap with 400", async () => {
    const res = await post(ask("x".repeat(2001)));
    expect(res.status).toBe(400);
    expect(streamCalls).toHaveLength(0);
  });

  it("rejects a transcript beyond the turn cap with 429", async () => {
    const messages = Array.from({ length: 13 }, () => ({
      role: "user" as const,
      content: "hello",
    }));
    const res = await post({ messages });
    expect(res.status).toBe(429);
    expect(streamCalls).toHaveLength(0);
  });

  it("rejects a non-JSON body with 400", async () => {
    const { POST } = await import("./route");
    const res = await POST(
      new Request("http://localhost/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{{{",
      }),
    );
    expect(res.status).toBe(400);
  });

  it("rate limits an IP after 30 requests", async () => {
    for (let i = 0; i < 30; i += 1) {
      turns.push({ text: "ok", stopReason: "end_turn" });
      expect((await post(ask("hi"))).status).toBe(200);
    }
    expect((await post(ask("hi"))).status).toBe(429);
  });

  it("streams as SSE with buffering disabled", async () => {
    turns.push({ text: "Hello.", stopReason: "end_turn" });
    const res = await post(ask("hi"));
    expect(res.headers.get("content-type")).toContain("text/event-stream");
    expect(res.headers.get("x-accel-buffering")).toBe("no");
  });
});
