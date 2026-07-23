import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";

/**
 * GEO (generative engine optimisation) — spec D16.
 *
 * AI crawlers are explicitly ALLOWED. The site's goal is to be cited by answer
 * engines when someone asks about GST reconciliation or closing the books, so
 * the usual deny-by-omission posture would be self-defeating. This is a
 * deliberate commercial decision, not an oversight.
 *
 * `/api/` is disallowed everywhere: those routes are for the site's own widget
 * and form, and crawling them costs money on the chat endpoint.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "PerplexityBot",
  "Google-Extended",
  "CCBot",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: "/api/",
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
