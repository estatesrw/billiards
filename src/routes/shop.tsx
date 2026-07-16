import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Star, Search } from "lucide-react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { SITE } from "@/lib/site";
import poolImg from "@/assets/product-pool.jpg";
import snookerImg from "@/assets/product-snooker.jpg";
import caromImg from "@/assets/product-carom.jpg";
import cuesImg from "@/assets/product-cues.jpg";
import ballsImg from "@/assets/gallery-1.jpg";
import lightImg from "@/assets/gallery-4.jpg";
import chalkImg from "@/assets/gallery-3.jpg";
import feltImg from "@/assets/gallery-2.jpg";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — B Trader Elite Billiards" },
      { name: "description", content: "Browse premium pool tables, snooker tables, cues, balls, and billiards accessories." },
    ],
  }),
  component: Shop,
});

const CATEGORIES = [
  "All", "Pool Tables", "Snooker Tables", "Carom Tables", "Cues", "Cue Cases", "Balls", "Chalk", "Triangle Racks", "Table Covers", "Lighting", "Spare Parts",
];

type Product = { id: string; name: string; category: string; price: number; rating: number; img: string; badge?: string };

const PRODUCTS: Product[] = [
  { id: "regal", name: "Regal Pro Pool Table 8ft", category: "Pool Tables", price: 3200, rating: 4.9, img: poolImg, badge: "Bestseller" },
  { id: "monarch", name: "Monarch Slate Pool 9ft", category: "Pool Tables", price: 4100, rating: 4.8, img: poolImg },
  { id: "windsor", name: "Windsor Snooker 12ft", category: "Snooker Tables", price: 5800, rating: 5.0, img: snookerImg, badge: "New" },
  { id: "oxford", name: "Oxford Snooker 10ft", category: "Snooker Tables", price: 4600, rating: 4.7, img: snookerImg },
  { id: "heritage", name: "Carom Heritage", category: "Carom Tables", price: 2900, rating: 4.8, img: caromImg },
  { id: "elite-cue", name: "Elite Cue Set + Case", category: "Cues", price: 220, rating: 4.9, img: cuesImg },
  { id: "leather-case", name: "Leather Cue Case", category: "Cue Cases", price: 140, rating: 4.6, img: cuesImg },
  { id: "aramith", name: "Aramith Premier Balls", category: "Balls", price: 190, rating: 5.0, img: ballsImg, badge: "Pro" },
  { id: "chalk", name: "Master Chalk (12-pack)", category: "Chalk", price: 18, rating: 4.7, img: chalkImg },
  { id: "rack", name: "Solid Wood Triangle Rack", category: "Triangle Racks", price: 45, rating: 4.5, img: chalkImg },
  { id: "cover", name: "Premium Table Cover", category: "Table Covers", price: 120, rating: 4.6, img: feltImg },
  { id: "light", name: "Brass Pendant Light 3-lamp", category: "Lighting", price: 480, rating: 4.9, img: lightImg, badge: "New" },
  { id: "cushion", name: "Cushion Rubber Set", category: "Spare Parts", price: 210, rating: 4.4, img: feltImg },
];

function Shop() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"featured" | "asc" | "desc" | "rating">("featured");

  const items = useMemo(() => {
    let list = PRODUCTS.filter((p) => (cat === "All" || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase()));
    if (sort === "asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [cat, q, sort]);

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
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`shrink-0 px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${
                cat === c ? "border-[var(--gold)] text-[var(--ink)] bg-gold-gradient" : "hairline text-muted-foreground hover:text-gold hover:border-[var(--gold)]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => (
            <article key={p.id} className="group border hairline flex flex-col">
              <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
                <img src={p.img} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                {p.badge && (
                  <div className="absolute top-3 left-3 text-[10px] uppercase tracking-widest px-3 py-1 bg-gold-gradient text-[var(--ink)]">
                    {p.badge}
                  </div>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{p.category}</div>
                <h3 className="mt-2 font-display text-xl">{p.name}</h3>
                <div className="mt-2 flex items-center gap-2 text-xs text-gold">
                  <Star className="w-3 h-3 fill-current" /> {p.rating.toFixed(1)}
                </div>
                <div className="mt-auto pt-6 flex items-center justify-between">
                  <div className="font-display text-2xl text-gold">${p.price.toLocaleString()}</div>
                  <a
                    href={SITE.waLink(`I'm interested in ${p.name}`)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] uppercase tracking-widest px-4 py-2 border border-[var(--gold)] text-gold hover:bg-gold-gradient hover:text-[var(--ink)] transition-all"
                  >
                    Enquire
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {items.length === 0 && (
          <div className="mt-24 text-center text-muted-foreground">No products match your filters.</div>
        )}
      </section>
    </PageShell>
  );
}