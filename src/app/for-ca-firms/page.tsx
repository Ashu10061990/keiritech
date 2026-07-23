import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AudiencePage } from "@/components/AudiencePage";
import { getAudience } from "@/content/audiences";
import { pageMetadata } from "@/lib/seo";

const SLUG = "for-ca-firms";
const data = getAudience(SLUG);

export const metadata: Metadata = data
  ? pageMetadata({
      title: data.metaTitle,
      description: data.metaDescription,
      path: `/${SLUG}`,
    })
  : {};

export default function Page() {
  if (!data) notFound();
  return <AudiencePage data={data} />;
}
