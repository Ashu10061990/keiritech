import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/server/mail", () => ({
  sendMail: vi.fn(async () => undefined),
  getContactAddress: () => "business@keiritech.com",
  MailError: class MailError extends Error {},
}));

import { sendMail } from "@/server/mail";
import { __resetRateLimitForTests } from "@/server/rate-limit";

const sendMailMock = vi.mocked(sendMail);

async function post(body: unknown, ip = "203.0.113.1") {
  const { POST } = await import("./route");
  return POST(
    new Request("http://localhost/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": ip,
      },
      body: JSON.stringify(body),
    }),
  );
}

const valid = {
  name: "Asha Menon",
  email: "asha@example.com",
  company: "Northwind Ltd",
  message: "We would like to see the GST reconciliation workflow.",
};

beforeEach(() => {
  sendMailMock.mockClear();
  sendMailMock.mockResolvedValue(undefined);
  __resetRateLimitForTests();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("POST /api/contact", () => {
  it("sends to business@keiritech.com and sets reply-to on a valid payload", async () => {
    const res = await post(valid);

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock.mock.calls[0]![0]).toMatchObject({
      to: "business@keiritech.com",
      replyTo: "asha@example.com",
    });
  });

  it("includes every submitted field in the mail body", async () => {
    await post(valid);
    const { text } = sendMailMock.mock.calls[0]![0];
    expect(text).toContain("Asha Menon");
    expect(text).toContain("asha@example.com");
    expect(text).toContain("Northwind Ltd");
    expect(text).toContain("GST reconciliation workflow");
  });

  it("rejects a missing email with 400 and sends nothing", async () => {
    const res = await post({ ...valid, email: undefined });
    expect(res.status).toBe(400);
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it("rejects a malformed email with 400", async () => {
    const res = await post({ ...valid, email: "not-an-email" });
    expect(res.status).toBe(400);
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it("rejects an empty message with 400", async () => {
    const res = await post({ ...valid, message: "   " });
    expect(res.status).toBe(400);
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it("rejects a message beyond the length cap with 400", async () => {
    const res = await post({ ...valid, message: "x".repeat(5001) });
    expect(res.status).toBe(400);
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it("accepts but discards a submission with the honeypot filled", async () => {
    // Reporting the rejection would tell a bot which field is the trap.
    const res = await post({ ...valid, company_website: "http://spam.example" });
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it("rate limits a single IP after 5 submissions", async () => {
    for (let i = 0; i < 5; i += 1) {
      expect((await post(valid)).status).toBe(200);
    }
    const blocked = await post(valid);
    expect(blocked.status).toBe(429);
    expect(sendMailMock).toHaveBeenCalledTimes(5);
  });

  it("rate limits per IP, not globally", async () => {
    for (let i = 0; i < 5; i += 1) await post(valid, "203.0.113.1");
    const other = await post(valid, "198.51.100.7");
    expect(other.status).toBe(200);
  });

  it("returns 502 when the mail transport fails, without leaking the cause", async () => {
    sendMailMock.mockRejectedValueOnce(new Error("resend: 401 invalid key"));
    const res = await post(valid);

    expect(res.status).toBe(502);
    const body = (await res.json()) as { error: string };
    expect(body.error).not.toContain("invalid key");
    expect(body.error).not.toContain("resend");
  });

  it("rejects a non-JSON body with 400", async () => {
    const { POST } = await import("./route");
    const res = await POST(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "not json at all",
      }),
    );
    expect(res.status).toBe(400);
    expect(sendMailMock).not.toHaveBeenCalled();
  });
});
