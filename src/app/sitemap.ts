import type { MetadataRoute } from "next";

import { getAllArticles } from "@/lib/content";
import { ALL_ROUTES } from "@/lib/nav-manifest";
import { SITE_URL } from "@/lib/seo";

/**
 * Generated from the nav manifest and the content directory.
 *
 * The legacy `sitemap.xml` was hand-written and had already drifted from
 * reality — a page reachable in the nav could be missing from it. Deriving it
 * means that cannot happen: `sitemap.test.ts` asserts every route in the
 * manifest appears here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ALL_ROUTES.map((route) => ({
    url: `${SITE_URL}${route === "/" ? "" : route}`,
    changeFrequency: "monthly" as const,
    priority: route === "/" ? 1 : 0.7,
  }));

  const articles = getAllArticles().map((article) => ({
    url: `${SITE_URL}/${article.collection}/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...pages, ...articles];
}
