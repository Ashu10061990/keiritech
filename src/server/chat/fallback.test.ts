import { describe, expect, it } from "vitest";

import { FALLBACK_MESSAGE, FAQS, GREETING, KEYWORD_GROUPS } from "./knowledge";
import { matchScripted } from "./fallback";

/**
 * Parity tests for the ported chatbot. The source of truth is the legacy
 * `KB` object in `BYA& Keiri/keiri-new/keiritech-firebase/public/assets/keiri.js`.
 * These assert behaviour, not just presence — a reworded answer or a reordered
 * keyword group changes what visitors are told, so both are pinned.
 */

describe("knowledge base", () => {
  it("has the 6 legacy FAQ entries, each with a question and an answer", () => {
    expect(FAQS).toHaveLength(6);
    for (const faq of FAQS) {
      expect(faq.q.length).toBeGreaterThan(0);
      expect(faq.a.length).toBeGreaterThan(0);
    }
  });

  it("keeps the FAQ order — the widget renders the first four as chips", () => {
    expect(FAQS.map((f) => f.q)).toEqual([
      "What does Keiri Tech do?",
      "Can you automate GST filing?",
      "How does the monthly close work?",
      "Is my data secure?",
      "How is Keiri priced?",
      "How do I book a demo?",
    ]);
  });

  it("has the 12 legacy keyword groups", () => {
    expect(KEYWORD_GROUPS).toHaveLength(12);
  });

  it("has a greeting and a fallback message", () => {
    expect(GREETING).toContain("Keiri");
    expect(FALLBACK_MESSAGE).toContain("business@keiritech.com");
  });
});

describe("matchScripted", () => {
  it("returns the exact FAQ answer when the input is a verbatim question", () => {
    expect(matchScripted("How is Keiri priced?")).toBe(FAQS[4]!.a);
  });

  it("matches the exact question case-insensitively", () => {
    expect(matchScripted("IS MY DATA SECURE?")).toBe(FAQS[3]!.a);
  });

  it.each([
    ["gst", 1],
    ["gstr-2b", 1],
    ["itc", 1],
    ["reconcil", 2],
    ["month-end", 2],
    ["encrypt", 3],
    ["offline", 3],
    ["how much", 4],
    ["book", 5],
    ["who are you", 0],
  ] as const)(
    "routes %s to the FAQ[%i] answer",
    (input, faqIndex) => {
      expect(matchScripted(input)).toBe(FAQS[faqIndex]!.a);
    },
  );

  it.each([
    ["tds", "TDS workflows"],
    ["income tax", "notice tracking"],
    ["forecast", "FP&A"],
    ["cash flow", "FP&A"],
    ["cash-flow", "FP&A"],
    ["dunning", "three-way matching"],
    ["sox", "audit trail"],
    ["tally", "prebuilt connectors"],
    ["controller", "segregation"],
  ])("routes %s to a bespoke answer mentioning %s", (input, fragment) => {
    expect(matchScripted(input).toLowerCase()).toContain(fragment.toLowerCase());
  });

  it("returns the fallback message for an unmatched input", () => {
    expect(matchScripted("do you sell umbrellas")).toBe(FALLBACK_MESSAGE);
  });

  it("preserves group order — an input hitting two groups gets the earlier one", () => {
    // "bank reconciliation pricing" hits the close group (index 1) and the
    // pricing group (index 3). The legacy matcher takes the first hit.
    expect(matchScripted("bank reconciliation pricing")).toBe(FAQS[2]!.a);
  });

  it("is not confused by casing or surrounding prose", () => {
    expect(matchScripted("Hi, can you help with our GSTR filing?")).toBe(
      FAQS[1]!.a,
    );
  });
});
