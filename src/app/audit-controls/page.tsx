import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SolutionPage } from "@/components/SolutionPage";
import { getSolution } from "@/content/solutions";
import { pageMetadata } from "@/lib/seo";

const SLUG = "audit-controls";
const data = getSolution(SLUG);

export const metadata: Metadata = data
  ? pageMetadata({
      title: data.metaTitle,
      description: data.metaDescription,
      path: `/${SLUG}`,
    })
  : {};

export default function Page() {
  if (!data) notFound();
  return <SolutionPage data={data} />;
}
