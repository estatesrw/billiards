// Central SEO helpers — keyword-focused titles, descriptions and structured data.
export const SITE_URL = "https://thebtrader.com";
export const BRAND = "B Trader Elite Billiards";
export const SOCIAL_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/RSj2y3Jo7VUkTCpNF6GccYGhJoH2/social-images/social-1784554805700-images_(15).webp";

type MetaEntry = Record<string, string>;

export function seo(opts: {
  title: string;
  description: string;
  path: string;
  keywords?: string;
  type?: string;
  image?: string;
}) {
  const url = `${SITE_URL}${opts.path}`;
  const image = opts.image ?? SOCIAL_IMAGE;
  const meta: MetaEntry[] = [
    { title: opts.title },
    { name: "description", content: opts.description },
    { property: "og:title", content: opts.title },
    { property: "og:description", content: opts.description },
    { property: "og:type", content: opts.type ?? "website" },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:site_name", content: BRAND },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: opts.title },
    { name: "twitter:description", content: opts.description },
    { name: "twitter:image", content: image },
    { name: "robots", content: "index, follow, max-image-preview:large" },
  ];
  if (opts.keywords) meta.push({ name: "keywords", content: opts.keywords });
  return {
    meta,
    links: [{ rel: "canonical", href: url }],
  };
}

export function ldJson(data: unknown) {
  return { type: "application/ld+json", children: JSON.stringify(data) };
}

export const localBusinessLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: BRAND,
  description:
    "Rwanda's leading billiards store — luxury pool tables, snooker tables, carom tables, cues, balls and accessories, with professional installation, moving, repair and maintenance in Kigali.",
  url: SITE_URL,
  image: SOCIAL_IMAGE,
  telephone: "+250793735430",
  priceRange: "RWF",
  currenciesAccepted: "RWF",
  address: {
    "@type": "PostalAddress",
    streetAddress: "KN 2 St",
    addressLocality: "Kigali",
    addressCountry: "RW",
  },
  areaServed: ["Kigali", "Rwanda", "East Africa"],
  sameAs: ["https://www.facebook.com/share/1918oKHG2J/?mibextid=wwXIfr"],
  openingHours: "Mo-Sa 08:00-19:00",
};

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

export function titleCase(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
