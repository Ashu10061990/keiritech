import { describe, expect, it } from "vitest";

import { getAllArticles } from "./content";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  localBusinessJsonLd,
  organizationJsonLd,
  serviceJsonLd,
  softwareApplicationJsonLd,
  webSiteJsonLd,
} from "./jsonld";
import { ALL_ROUTES } from "./nav-manifest";
import { DESCRIPTION_MAX, pageMetadata, TITLE_MAX } from "./seo";

/**
 * SEO / geo / GEO regression gates.
 *
 * These exist because the legacy site's `sitemap.xml` was hand-written and had
 * already drifted from the pages that existed. A generated sitemap only helps
 * if something asserts it stays in step.
 */

describe("route manifest", () => {
  it("has no duplicate routes", () => {
    expect(new Set(ALL_ROUTES).size).toBe(ALL_ROUTES.length);
  });

  it("lists only internal, root-relative paths", () => {
    for (const route of ALL_ROUTES) {
      expect(route.startsWith("/")).toBe(true);
      expect(route).not.toContain("http");
    }
  });

  it("includes every page a visitor can reach from the nav", () => {
    for (const route of [
      "/",
      "/solutions",
      "/platform",
      "/keiri-ai",
      "/pricing",
      "/integrations",
      "/security",
      "/about",
      "/careers",
      "/contact",
      "/resources",
      "/why-keiri",
      "/glossary",
      "/payables-receivables",
      "/financial-close",
      "/fpa",
      "/tax-compliance",
      "/audit-controls",
      "/for-cfos",
      "/for-controllers",
      "/for-ca-firms",
    ]) {
      expect(ALL_ROUTES).toContain(route);
    }
  });
});

describe("pageMetadata", () => {
  it("sets a canonical, OG and Twitter block", () => {
    const meta = pageMetadata({
      title: "Pricing",
      description: "How Keiri is priced.",
      path: "/pricing",
    });
    expect(meta.alternates?.canonical).toBe("/pricing");
    expect(meta.openGraph?.locale).toBe("en_IN");
    expect(meta.twitter).toBeDefined();
  });
});

describe("page titles and descriptions stay within what search engines show", () => {
  it.each([
    ["Payables & receivables automation", 60],
    ["The financial close, automated", 60],
  ])("%s is within %i characters", (title, max) => {
    expect(title.length).toBeLessThanOrEqual(max);
  });

  it("the limits are the documented ones", () => {
    expect(TITLE_MAX).toBe(60);
    expect(DESCRIPTION_MAX).toBe(155);
  });
});

describe("JSON-LD", () => {
  it("Organization carries name, url, logo and a contact point", () => {
    const org = organizationJsonLd() as Record<string, unknown>;
    expect(org["@type"]).toBe("Organization");
    expect(org["name"]).toBe("Keiri Tech");
    expect(org["email"]).toBe("business@keiritech.com");
    expect(Array.isArray(org["contactPoint"])).toBe(true);
  });

  it("geo markup names India and omits invented coordinates", () => {
    const local = localBusinessJsonLd() as Record<string, unknown>;
    expect(local["@type"]).toBe("ProfessionalService");
    expect(JSON.stringify(local["areaServed"])).toContain("India");
    // Publishing a guessed lat/long is worse than publishing none — the office
    // address is still outstanding. See OPEN-ITEMS.md.
    expect(local["geo"]).toBeUndefined();
  });

  it("WebSite declares en-IN", () => {
    expect((webSiteJsonLd() as Record<string, unknown>)["inLanguage"]).toBe(
      "en-IN",
    );
  });

  it("FAQPage emits a Question/Answer pair per entry", () => {
    const faq = faqJsonLd([{ q: "Is it secure?", a: "Yes." }]) as {
      mainEntity: Array<Record<string, unknown>>;
    };
    expect(faq.mainEntity).toHaveLength(1);
    expect(faq.mainEntity[0]!["@type"]).toBe("Question");
    expect(faq.mainEntity[0]!["acceptedAnswer"]).toMatchObject({
      "@type": "Answer",
      text: "Yes.",
    });
  });

  it("Breadcrumb positions are 1-indexed and in order", () => {
    const crumbs = breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Pricing", path: "/pricing" },
    ]) as { itemListElement: Array<{ position: number; name: string }> };
    expect(crumbs.itemListElement.map((c) => c.position)).toEqual([1, 2]);
  });

  it("SoftwareApplication publishes no price — pricing is scoped, not listed", () => {
    const app = softwareApplicationJsonLd() as {
      offers: Record<string, unknown>;
    };
    expect(app.offers["priceCurrency"]).toBe("INR");
    expect(app.offers["price"]).toBeUndefined();
  });

  it("Service and Article carry absolute URLs", () => {
    const service = serviceJsonLd({
      name: "Tax",
      description: "GST.",
      path: "/tax-compliance",
    }) as Record<string, string>;
    expect(service["url"]).toMatch(/^https?:\/\/.+\/tax-compliance$/);

    const article = articleJsonLd({
      headline: "A",
      description: "B",
      path: "/blog/a",
      datePublished: "2026-01-01",
    }) as Record<string, string>;
    expect(article["url"]).toMatch(/^https?:\/\/.+\/blog\/a$/);
  });
});

describe("content collection", () => {
  it("loads every article with valid frontmatter", () => {
    const articles = getAllArticles();
    expect(articles.length).toBeGreaterThanOrEqual(3);
    for (const article of articles) {
      expect(article.title.length).toBeGreaterThan(0);
      expect(article.description.length).toBeGreaterThan(0);
      expect(article.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(article.body.length).toBeGreaterThan(200);
    }
  });

  it("carries the three migrated legacy articles", () => {
    const slugs = getAllArticles().map((a) => a.slug);
    expect(slugs).toContain("three-day-close-playbook");
    expect(slugs).toContain("ai-in-the-finance-function");
    expect(slugs).toContain("automating-gst-reconciliation");
  });
});
