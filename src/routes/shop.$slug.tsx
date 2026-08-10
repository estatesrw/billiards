import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { SITE } from "@/lib/site";
import { toast } from "sonner";
import { Heart, ShoppingBag, Star, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { fallbackProduct as fallbackImg } from "@/lib/images";
import { money } from "@/lib/money";
import { seo, ldJson, breadcrumbLd, titleCase, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/shop/$slug")({
  loader: async ({ params }) => {
    const { data } = await supabase
      .from("products")
      .select("name, description, image_url, price_cents, currency, rating, stock")
      .eq("slug", params.slug)
      .eq("is_published", true)
      .maybeSingle();
    return { product: data };
  },
  head: ({ params, loaderData }) => {
    const p = loaderData?.product;
    const name = p?.name ?? titleCase(params.slug);
    const desc =
      p?.description?.slice(0, 155) ??
      `${name} — premium billiards equipment for sale in Kigali, Rwanda. Delivery, installation and 2-year warranty from B Trader Elite Billiards.`;
    return {
      ...seo({
        title: `${name} — Price in Rwanda | B Trader Elite Billiards`,
        description: desc,
        path: `/shop/${params.slug}`,
        type: "product",
        image: p?.image_url ?? undefined,
        keywords: `${name} Rwanda, ${name} price Kigali, buy ${name} Rwanda, billiards Kigali`,
      }),
      scripts: [
        ldJson({
          "@context": "https://schema.org",
          "@type": "Product",
          name,
          description: desc,
          image: p?.image_url ? [p.image_url] : undefined,
          brand: { "@type": "Brand", name: "B Trader Elite Billiards" },
          offers: {
            "@type": "Offer",
            price: ((p?.price_cents ?? 0) / 100).toFixed(0),
            priceCurrency: p?.currency ?? "RWF",
            availability:
              (p?.stock ?? 0) > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/PreOrder",
            url: `${SITE_URL}/shop/${params.slug}`,
          },
        }),
        ldJson(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
            { name, path: `/shop/${params.slug}` },
          ]),
        ),
      ],
    };
  },
  component: ProductDetail,
  errorComponent: ({ error, reset }) => (
    <PageShell><div className="container-lux py-24 text-center"><p className="text-muted-foreground">{error.message}</p><button onClick={reset} className="mt-4 text-gold underline">Retry</button></div></PageShell>
  ),
  notFoundComponent: () => (
    <PageShell><div className="container-lux py-24 text-center"><h1 className="font-display text-3xl">Product not found</h1><Link to="/shop" className="mt-4 inline-block text-gold underline">Back to shop</Link></div></PageShell>
  ),
});

function ProductDetail() {
  const { slug } = Route.useParams();
  const [qty, setQty] = useState(1);
  const { add, setOpen } = useCart();
  const { ids: wishIds, toggle: toggleWish } = useWishlist();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name, slug)")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data;
    },
  });

  if (isLoading) return <PageShell><div className="container-lux py-24 text-center text-muted-foreground">Loading…</div></PageShell>;
  if (!product) return null;

  const isWished = wishIds.has(product.id);

  return (
    <PageShell>
      <section className="container-lux py-16">
        <Link to="/shop" className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-muted-foreground hover:text-gold">
          <ChevronLeft className="w-3 h-3" /> Back to shop
        </Link>
        <div className="mt-8 grid gap-12 lg:grid-cols-2">
          <div className="rounded-3xl overflow-hidden bg-secondary aspect-square">
            <img src={product.image_url || fallbackImg} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div>
            {product.badge && <div className="inline-block text-[10px] uppercase tracking-widest px-3 py-1 pill bg-gold-gradient text-[var(--ink)]">{product.badge}</div>}
            <div className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
              {(product as { categories?: { name?: string } | null }).categories?.name ?? "Product"}
            </div>
            <h1 className="mt-2 font-display text-5xl leading-tight">{product.name}</h1>
            <div className="mt-3 flex items-center gap-2 text-xs text-gold">
              <Star className="w-3 h-3 fill-current" /> {Number(product.rating).toFixed(1)}
              <span className="text-muted-foreground">· {product.stock > 0 ? `${product.stock} in stock` : "Made to order"}</span>
            </div>
            <div className="mt-6 font-display text-4xl">{money(product.price_cents)}</div>
            {product.description && <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>}

            <div className="mt-8 flex items-center gap-3">
              <div className="flex items-center border hairline pill">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2">−</button>
                <span className="px-3 min-w-8 text-center">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2">+</button>
              </div>
              <button
                onClick={() => {
                  add({ id: product.id, slug: product.slug, name: product.name, price_cents: product.price_cents, image_url: product.image_url }, qty);
                  toast.success(`${product.name} added to cart`);
                  setOpen(true);
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 pill bg-[var(--ink)] text-[var(--ivory)] hover:bg-gold-gradient hover:text-[var(--ink)] transition-all"
              >
                <ShoppingBag className="w-4 h-4" /> Add to cart
              </button>
              <button
                onClick={() => toggleWish({ id: product.id, slug: product.slug, name: product.name })}
                className={`w-12 h-12 grid place-items-center pill border transition-colors ${isWished ? "border-[var(--gold)] text-gold" : "hairline text-muted-foreground hover:text-gold hover:border-[var(--gold)]"}`}
              >
                <Heart className={`w-4 h-4 ${isWished ? "fill-current" : ""}`} />
              </button>
            </div>
            <a href={SITE.waLink(`Hi, I'd like to enquire about the ${product.name}.`)} target="_blank" rel="noreferrer" className="mt-4 inline-block text-xs uppercase tracking-widest text-gold hover:underline">
              Or enquire via WhatsApp →
            </a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}