import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/contact";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { FAQS } from "@/server/chat/knowledge";

/**
 * Structured data — spec D16.
 *
 * Three distinct jobs, often conflated:
 *   SEO   — help search engines understand and rank the page
 *   Geo   — say where this business operates and who it serves
 *   GEO   — make the page quotable by generative answer engines
 *
 * The FAQ markup reads from the same `FAQS` the chatbot uses, so the answers a
 * visitor gets from the bot and the answers Google and AI assistants quote can
 * never disagree.
 */

type JsonLd = Record<string, unknown>;

const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    legalName: "Keiri Tech Pvt Ltd",
    url: SITE_URL,
    logo: `${SITE_URL}/keiri.png`,
    description:
      "Keiri Tech builds AI that runs the financial back office end to end for Indian finance teams — payables and receivables, the monthly close, FP&A, and tax compliance.",
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Greater Noida",
      addressRegion: "Uttar Pradesh",
      addressCountry: "IN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: CONTACT_EMAIL,
        telephone: CONTACT_PHONE,
        areaServed: "IN",
        availableLanguage: ["en", "hi"],
      },
    ],
  };
}

/**
 * Geo markup. Distinct from the Organization block: this says where the
 * business physically is and which market it serves, which is what local and
 * India-scoped queries key on.
 *
 * ⚠️ `geo` coordinates are deliberately omitted until the office address is
 * confirmed — see OPEN-ITEMS.md. Publishing a guessed lat/long is worse than
 * publishing none.
 */
export function localBusinessJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#localbusiness`,
    name: SITE_NAME,
    url: SITE_URL,
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Greater Noida",
      addressRegion: "Uttar Pradesh",
      addressCountry: "IN",
    },
    areaServed: [
      { "@type": "Country", name: "India" },
      { "@type": "City", name: "Delhi" },
      { "@type": "City", name: "Bengaluru" },
      { "@type": "City", name: "Mumbai" },
      { "@type": "City", name: "Hyderabad" },
      { "@type": "City", name: "Pune" },
      { "@type": "City", name: "Chennai" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "09:30",
        closes: "18:30",
      },
    ],
    parentOrganization: { "@id": ORGANIZATION_ID },
  };
}

export function webSiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "en-IN",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function breadcrumbJsonLd(
  trail: ReadonlyArray<{ name: string; path: string }>,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
    })),
  };
}

/**
 * FAQ markup. Feed it a page's own Q&A; with no argument it emits the
 * chatbot's six, which is what the home and pricing pages use.
 */
export function faqJsonLd(
  entries: ReadonlyArray<{ q: string; a: string }> = FAQS,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.q,
      acceptedAnswer: { "@type": "Answer", text: entry.a },
    })),
  };
}

export function serviceJsonLd(service: {
  name: string;
  description: string;
  path: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: `${SITE_URL}${service.path}`,
    serviceType: "Financial process automation",
    provider: { "@id": ORGANIZATION_ID },
    areaServed: { "@type": "Country", name: "India" },
  };
}

export function softwareApplicationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Keiri",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: `${SITE_URL}/platform`,
    description:
      "AI agents that run payables and receivables, the monthly close, FP&A and tax compliance end to end, with a full audit trail.",
    publisher: { "@id": ORGANIZATION_ID },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      // Pricing is scoped per workflow, so there is no list price to publish.
      // Omitting `price` is correct; inventing one would be a false claim.
      availability: "https://schema.org/InStock",
    },
  };
}

export function articleJsonLd(article: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    url: `${SITE_URL}${article.path}`,
    datePublished: article.datePublished,
    inLanguage: "en-IN",
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/** Renders a JSON-LD block. Content is developer-authored, never user input. */
export function JsonLd({ data }: { data: JsonLd | JsonLd[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
