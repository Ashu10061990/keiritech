import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://keiritech.com";

export const SITE_NAME = "Keiri Tech";

/**
 * Per-route metadata helper.
 *
 * Enforces the two limits search engines actually truncate at — 60 characters
 * of title, 155 of description — in a test rather than by hoping. See
 * `seo.test.ts`, which walks every route.
 */
export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

export interface PageSeo {
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly type?: "website" | "article";
  readonly publishedTime?: string;
}

export function pageMetadata(seo: PageSeo): Metadata {
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: seo.path },
    openGraph: {
      title: `${seo.title} | ${SITE_NAME}`,
      description: seo.description,
      url: `${SITE_URL}${seo.path}`,
      siteName: SITE_NAME,
      locale: "en_IN",
      type: seo.type ?? "website",
      ...(seo.publishedTime ? { publishedTime: seo.publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${seo.title} | ${SITE_NAME}`,
      description: seo.description,
    },
  };
}
