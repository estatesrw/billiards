// Central SEO helpers — keyword-focused titles, descriptions and structured data.
export const SITE_URL = "https://thebtrader.com";
export const BRAND = "B Trader Elite Billiards";
export const SOCIAL_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/RSj2y3Jo7VUkTCpNF6GccYGhJoH2/social-images/social-1784554805700-images_(15).webp";

type MetaEntry = Record<string, string>;

// Brand-name variations people type into Google. Appended to every page's keywords
// so brand searches ("B Trader", "btrader billiards") surface this site.
export const BRAND_KEYWORDS =
  "B Trader, BTrader, B-Trader, B Trader Rwanda, B Trader Kigali, B Trader Billiards, B Trader Elite, B Trader Elite Billiards, thebtrader, thebtrader.com, btrader billiards Rwanda";

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
  meta.push({
    name: "keywords",
    content: opts.keywords ? `${BRAND_KEYWORDS}, ${opts.keywords}` : BRAND_KEYWORDS,
  });
  meta.push({ name: "author", content: BRAND });
  meta.push({ name: "geo.region", content: "RW-01" });
  meta.push({ name: "geo.placename", content: "Kigali" });
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
  alternateName: ["B Trader", "BTrader", "B Trader Billiards", "B Trader Elite", "B Trader Rwanda"],
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

// Brand entity + site search, so Google can build a brand knowledge panel and sitelinks.
export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: BRAND,
  alternateName: ["B Trader", "BTrader", "B Trader Billiards", "B Trader Elite Billiards"],
  url: SITE_URL,
  logo: SOCIAL_IMAGE,
  telephone: "+250793735430",
  sameAs: ["https://www.facebook.com/share/1918oKHG2J/?mibextid=wwXIfr"],
};

export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: BRAND,
  alternateName: "B Trader",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/shop?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
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
