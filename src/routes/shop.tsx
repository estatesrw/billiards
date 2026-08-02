import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, Search, ShoppingBag, Heart } from "lucide-react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { fallbackProduct as fallbackImg } from "@/lib/images";
import { money } from "@/lib/money";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — B Trader Elite Billiards" },
      { name: "description", content: "Browse premium pool tables, snooker tables, cues, balls, and billiards accessories." },
    ],
  }),
  component: Shop,
});

type DBCategory = { id: string; slug: string; name: string };
type DBProduct = {
  id: string;
  slug: string;
  name: string;
  category_id: string | null;
  price_cents: number;
  image_url: string | null;
  stock: number;
  rating: number;
  badge: string | null;
};

function Shop() {
  const [cat, setCat] = useState<string>("All");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"featured" | "asc" | "desc" | "rating">("featured");
  const { add, setOpen: setCartOpen } = useCart();
  const { ids: wishIds, toggle: toggleWish } = useWishlist();

  const { data: cats = [] } = useQuery<DBCategory[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("id, slug, name").order("sort_order");
      if (error) throw error;
      return data as DBCategory[];
    },
  });

  const { data: products = [], isLoading } = useQuery<DBProduct[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, slug, name, category_id, price_cents, image_url, stock, rating, badge")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as DBProduct[];
    },
  });

  const items = useMemo(() => {
    const activeCatId = cat === "All" ? null : cats.find((c) => c.slug === cat)?.id;
    let list = products.filter(
      (p) =>
        (activeCatId === undefined || activeCatId === null || p.category_id === activeCatId) &&
        p.name.toLowerCase().includes(q.toLowerCase()),
    );
    if (sort === "asc") list = [...list].sort((a, b) => a.price_cents - b.price_cents);
    if (sort === "desc") list = [...list].sort((a, b) => b.price_cents - a.price_cents);
    if (sort === "rating") list = [...list].sort((a, b) => Number(b.rating) - Number(a.rating));
    return list;
  }, [cat, q, sort, products, cats]);

  return (
    <PageShell>
      <PageHeader eyebrow="The Collection" title="Shop" sub="Everything for the game — tables, cues and accessories, hand-picked." />

      <section className="container-lux py-12">
        <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-center justify-between">
          <div className="flex items-center gap-3 border hairline px-4 py-3 flex-1 max-w-md">
            <Search className="w-4 h-4 text-gold" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="border hairline bg-background px-4 py-3 text-sm uppercase tracking-widest"
          >
            <option value="featured">Featured</option>
            <option value="asc">Price: low to high</option>
            <option value="desc">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {[{ slug: "All", name: "All" }, ...cats].map((c) => (
            <button
              key={c.slug}
              onClick={() => setCat(c.slug)}
              className={`shrink-0 px-4 py-2 pill text-xs uppercase tracking-widest border transition-colors ${
                cat === c.slug ? "border-[var(--gold)] text-[var(--ink)] bg-gold-gradient" : "hairline text-muted-foreground hover:text-gold hover:border-[var(--gold)]"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {isLoading && <div className="mt-12 text-center text-muted-foreground">Loading products…</div>}

        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => (
            <article key={p.id} className="group border hairline rounded-3xl overflow-hidden flex flex-col bg-card">
              <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
                <img src={p.image_url || fallbackImg} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                {p.badge && (
                  <div className="absolute top-3 left-3 text-[10px] uppercase tracking-widest px-3 py-1 pill bg-gold-gradient text-[var(--ink)]">
                    {p.badge}
                  </div>
                )}
              </div>
              <div className="p-3 md:p-5 flex-1 flex flex-col">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {cats.find((c) => c.id === p.category_id)?.name ?? "Product"}
                </div>
                <h3 className="mt-2 font-display text-base md:text-xl">{p.name}</h3>
                <div className="mt-2 flex items-center gap-2 text-xs text-gold">
                  <Star className="w-3 h-3 fill-current" /> {Number(p.rating).toFixed(1)}
                </div>
                <div className="mt-auto pt-4 md:pt-6 flex flex-wrap gap-2 items-center justify-between">
                  <div className="font-display text-lg md:text-2xl">{money(p.price_cents)}</div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleWish({ id: p.id, slug: p.slug, name: p.name })}
                      className={`w-9 h-9 grid place-items-center pill border transition-colors ${wishIds.has(p.id) ? "border-[var(--gold)] text-gold bg-gold-gradient/10" : "hairline text-muted-foreground hover:text-gold hover:border-[var(--gold)]"}`}
                      aria-label="Toggle wishlist"
                    >
                      <Heart className={`w-3.5 h-3.5 ${wishIds.has(p.id) ? "fill-current" : ""}`} />
                    </button>
                    <button
                      onClick={() => {
                        add({ id: p.id, slug: p.slug, name: p.name, price_cents: p.price_cents, image_url: p.image_url });
                        toast.success(`${p.name} added to cart`);
                        setCartOpen(true);
                      }}
                      className="text-[10px] uppercase tracking-widest px-3 py-2 pill bg-[var(--ink)] text-[var(--ivory)] hover:bg-gold-gradient hover:text-[var(--ink)] transition-all flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-3 h-3" /> Add
                    </button>
                  </div>
                </div>
                <Link to="/shop/$slug" params={{ slug: p.slug }} className="mt-3 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-gold">View details →</Link>
              </div>
            </article>
          ))}
        </div>

        {!isLoading && items.length === 0 && (
          <div className="mt-24 text-center text-muted-foreground">No products match your filters.</div>
        )}
      </section>
    </PageShell>
  );
}