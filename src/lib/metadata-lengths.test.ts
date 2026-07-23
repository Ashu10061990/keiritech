import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { AUDIENCES } from "@/content/audiences";
import { SOLUTIONS } from "@/content/solutions";

import { DESCRIPTION_MAX, TITLE_MAX } from "./seo";

/**
 * Title and description length gates, checked against the ACTUAL strings the
 * pages ship.
 *
 * The first version of this only asserted that `DESCRIPTION_MAX === 155` and
 * that two hardcoded example titles were short enough — which is not a gate at
 * all. It passed while eight live pages shipped descriptions over the limit,
 * found only by fetching every page and measuring. This version reads the real
 * sources.
 *
 * Over-length descriptions are not cosmetic: Google truncates them mid-sentence
 * in the result snippet, which is the first thing a prospect reads.
 */

const APP_DIR = path.join(process.cwd(), "src", "app");

/** Every `description: "..."` passed to pageMetadata, plus the root layout's. */
function collectPageDescriptions(): Array<{ file: string; text: string }> {
  const found: Array<{ file: string; text: string }> = [];

  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (entry.name !== "page.tsx" && entry.name !== "layout.tsx") continue;

      const source = fs.readFileSync(full, "utf8");
      // `description:` followed by a double-quoted string, allowing the
      // prettier-wrapped `description:\n  "..."` form.
      const pattern = /description:\s*\n?\s*"((?:[^"\\]|\\.)*)"/g;
      for (const match of source.matchAll(pattern)) {
        found.push({
          file: path.relative(process.cwd(), full),
          // Unescape the few sequences that appear in these strings.
          text: match[1]!.replace(/\\"/g, '"').replace(/\\\\/g, "\\"),
        });
      }
    }
  };

  walk(APP_DIR);
  return found;
}

describe("page descriptions fit the search snippet", () => {
  const descriptions = collectPageDescriptions();

  it("finds descriptions to check (guards against a silently empty sweep)", () => {
    // If the regex or the directory layout changes, this test could pass by
    // checking nothing at all. That is the failure mode it exists to prevent.
    expect(descriptions.length).toBeGreaterThanOrEqual(12);
  });

  it.each(descriptions.map((d) => [d.file, d.text] as const))(
    "%s is within the limit",
    (_file, text) => {
      expect(text.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
    },
  );
});

describe("content-driven page metadata", () => {
  const entries = [
    ...SOLUTIONS.map((s) => ({
      slug: s.slug,
      title: s.metaTitle,
      description: s.metaDescription,
    })),
    ...AUDIENCES.map((a) => ({
      slug: a.slug,
      title: a.metaTitle,
      description: a.metaDescription,
    })),
  ];

  it.each(entries.map((e) => [e.slug, e.title, e.description] as const))(
    "%s title and description are within limits",
    (_slug, title, description) => {
      expect(title.length).toBeLessThanOrEqual(TITLE_MAX);
      expect(description.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
    },
  );

  it("has no duplicate titles or descriptions", () => {
    expect(new Set(entries.map((e) => e.title)).size).toBe(entries.length);
    expect(new Set(entries.map((e) => e.description)).size).toBe(entries.length);
  });
});
