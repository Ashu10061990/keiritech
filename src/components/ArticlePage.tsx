import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";

import { AskKeiriButton } from "@/components/chat/AskKeiriButton";
import { Reveal } from "@/components/ui/scroll";
import type { Article } from "@/lib/content";
import { articleJsonLd, breadcrumbJsonLd, JsonLd } from "@/lib/jsonld";

/**
 * Long-form article layout, shared by the blog and resources collections.
 * Uses the ported `.article` styles, so migrated posts look identical to the
 * legacy ones.
 */
export function ArticlePage({ article }: { article: Article }) {
  const basePath = article.collection === "blog" ? "/blog" : "/resources";
  const path = `${basePath}/${article.slug}`;
  const crumbLabel = article.collection === "blog" ? "Resources" : "Resources";

  return (
    <>
      <JsonLd
        data={[
          articleJsonLd({
            headline: article.title,
            description: article.description,
            path,
            datePublished: article.publishedAt,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: crumbLabel, path: "/resources" },
            { name: article.title, path },
          ]),
        ]}
      />

      <section className="page-hero">
        <div className="glow" />
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link> / <Link href="/resources">Resources</Link>{" "}
            / {article.kind}
          </div>
          <h1>{article.title}</h1>
          <p className="lede">{article.description}</p>
        </div>
      </section>

      <section className="sec">
        <Reveal className="article">
          <div className="meta">
            {article.kind} · {article.readingTime} · Keiri Tech
          </div>
          <MDXRemote source={article.body} />

          <div
            style={{
              marginTop: 40,
              paddingTop: 24,
              borderTop: "1px solid var(--line)",
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <Link href="/contact" className="btn btn-gold">
              See it on your data
            </Link>
            <AskKeiriButton className="btn btn-outline-dark">
              Ask Keiri
            </AskKeiriButton>
          </div>
        </Reveal>
      </section>
    </>
  );
}
