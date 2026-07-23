import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { z } from "zod";

/**
 * File-backed article loader.
 *
 * The legacy site had exactly two articles, and the inventory names the reason:
 * publishing meant hand-editing a 141-line HTML file. Articles now live as MDX
 * in `content/`, so adding one is a Markdown file and nothing else.
 */

const CONTENT_ROOT = path.join(process.cwd(), "content");

export const Frontmatter = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  kind: z.enum(["Guide", "Article"]),
  readingTime: z.string().min(1),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
});

export type Frontmatter = z.infer<typeof Frontmatter>;

export interface Article extends Frontmatter {
  readonly slug: string;
  readonly collection: "blog" | "resources";
  readonly body: string;
}

function readCollection(collection: "blog" | "resources"): Article[] {
  const dir = path.join(CONTENT_ROOT, collection);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      const parsed = Frontmatter.safeParse(data);

      // Fail the build rather than shipping an article with a missing title or
      // a malformed date — a silently half-rendered post is worse than none.
      if (!parsed.success) {
        throw new Error(
          `Invalid frontmatter in content/${collection}/${file}: ${parsed.error.issues
            .map((issue) => `${issue.path.join(".")} ${issue.message}`)
            .join("; ")}`,
        );
      }

      return {
        ...parsed.data,
        slug: file.replace(/\.mdx$/, ""),
        collection,
        body: content,
      };
    })
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getArticles(collection: "blog" | "resources"): Article[] {
  return readCollection(collection);
}

export function getArticle(
  collection: "blog" | "resources",
  slug: string,
): Article | undefined {
  return readCollection(collection).find((article) => article.slug === slug);
}

export function getAllArticles(): Article[] {
  return [...readCollection("blog"), ...readCollection("resources")];
}
