import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticlePage } from "@/components/ArticlePage";
import { getArticle, getArticles } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

const COLLECTION = "blog" as const;

/** Static params, so every article is prerendered at build time. */
export function generateStaticParams() {
  return getArticles(COLLECTION).map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(COLLECTION, slug);
  if (!article) return {};

  return pageMetadata({
    title: article.title,
    description: article.description,
    path: `/blog/${slug}`,
    type: "article",
    publishedTime: article.publishedAt,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(COLLECTION, slug);
  if (!article) notFound();
  return <ArticlePage article={article} />;
}
