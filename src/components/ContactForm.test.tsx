import { describe, expect, it } from "vitest";

import { buildMailtoUrl } from "./ContactForm";

/**
 * The mailto: fallback is the legacy site's entire contact mechanism
 * (KEIRITECH-INVENTORY.md §6). It is retained as the endpoint-down path, so it
 * has to keep working — a regression here means a visitor's message is lost
 * whenever the API is unreachable.
 */
describe("buildMailtoUrl", () => {
  const fields = {
    name: "Asha Menon",
    email: "asha@example.com",
    company: "Northwind Ltd",
    phone: "+91 98765 43210",
    message: "We need GSTR-2B reconciliation automated.",
  };

  it("addresses business@keiritech.com", () => {
    expect(buildMailtoUrl(fields)).toMatch(/^mailto:business@keiritech\.com\?/);
  });

  it("encodes the subject and every supplied field into the body", () => {
    const decoded = decodeURIComponent(buildMailtoUrl(fields));
    expect(decoded).toContain("Website enquiry — Asha Menon");
    expect(decoded).toContain("Name: Asha Menon");
    expect(decoded).toContain("Email: asha@example.com");
    expect(decoded).toContain("Company: Northwind Ltd");
    expect(decoded).toContain("Phone: +91 98765 43210");
    expect(decoded).toContain("GSTR-2B reconciliation");
  });

  it("omits optional fields that were left blank", () => {
    const decoded = decodeURIComponent(
      buildMailtoUrl({ ...fields, company: "", phone: "" }),
    );
    expect(decoded).not.toContain("Company:");
    expect(decoded).not.toContain("Phone:");
  });

  it("percent-encodes characters that would break the URL", () => {
    const url = buildMailtoUrl({
      ...fields,
      message: "Ampersand & hash # and a newline\nhere",
    });
    expect(url).not.toContain("&hash");
    expect(url).toContain("%26");
    expect(url).toContain("%23");
    expect(url).toContain("%0A");
  });
});
