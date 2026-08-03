import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ArrowUpRight, Star, Shield, Wrench, Truck, Trophy, Sparkles, Plus, Minus, ShoppingBag } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { useI18n } from "@/lib/i18n";
import { productPool, fallbackProduct } from "@/lib/images";
import { supabase } from "@/integrations/supabase/client";
import { useSettings, waLink } from "@/lib/settings";
import { money } from "@/lib/money";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { t } = useI18n();
  const { data: settings } = useSettings();

  const { data: heroSlides = [] } = useQuery({
    queryKey: ["home", "hero_slides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hero_slides")
        .select("id, image_url, label, link_url")
        .eq("is_published", true)
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: featured = [] } = useQuery({
    queryKey: ["home", "featured_products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, slug, name, price_cents, image_url, badge")
        .eq("is_published", true)
        .eq("is_featured", true)
        .order("created_at")
        .limit(8);
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: allProducts = [] } = useQuery({
    queryKey: ["home", "all_products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, slug, name, price_cents, image_url, badge, rating")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["home", "testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("id, quote, author_name, author_role")
        .eq("is_published", true)
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: faqs = [] } = useQuery({
    queryKey: ["home", "faqs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faqs")
        .select("id, category, question, answer")
        .eq("is_published", true)
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  const faqGroups = faqs.reduce<Record<string, typeof faqs>>((acc, f) => {
    (acc[f.category] ||= []).push(f);
    return acc;
  }, {});
  const waHref = waLink(settings?.whatsapp_number || "250794506387", "Hello, I would like a quote for a billiards table.");

  return (
    <PageShell>
      {/* Hero — green/black, carousel first */}
      <section className="relative overflow-hidden bg-[#0B3B26] text-[#F3F6F2]">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(120% 90% at 50% 0%, rgba(24,110,68,0.55) 0%, rgba(11,59,38,0) 55%), linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.85) 100%)" }}
        />
        <div className="container-lux relative z-10 pt-14 md:pt-20 pb-16 md:pb-24">
          {/* Carousel first */}
          <HeroFanCarousel slides={heroSlides} />

          <div className="mt-12 md:mt-14 text-center animate-lux-in">
            <h1 className="font-display text-[2.75rem] md:text-[6rem] leading-[0.95] tracking-tight">
              Play in style<span className="text-[#7CE0A6]">.</span>
            </h1>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-3 px-7 py-4 pill bg-black text-[#F3F6F2] text-sm hover:bg-[#7CE0A6] hover:text-black transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-7 py-4 pill border border-[#F3F6F2]/30 text-[#F3F6F2] hover:bg-[#F3F6F2] hover:text-black transition-all text-sm"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-24 md:py-32">
        <div className="container-lux">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
            <div>
              <div className="text-xs uppercase tracking-[0.4em] text-gold">01 — Collection</div>
              <h2 className="mt-4 font-display text-4xl md:text-6xl">{t("sec.featured")}</h2>
              <p className="mt-3 text-muted-foreground max-w-md">{t("sec.featured.sub")}</p>
            </div>
            <Link to="/shop" className="text-sm uppercase tracking-widest text-gold gold-underline inline-flex items-center gap-2">
              {t("cta.explore")} <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {featured.map((p) => (
              <Link key={p.id} to="/shop/$slug" params={{ slug: p.slug }} className="group block">
                <div className="relative overflow-hidden aspect-[4/5] bg-secondary">
                  <img src={p.image_url || fallbackProduct} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
                  {p.badge && (
                    <div className="absolute top-4 right-4 text-[10px] uppercase tracking-widest bg-[var(--ink)]/60 text-gold px-3 py-1 border border-[var(--gold)]/40">
                      {p.badge}
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <div className="font-display text-base md:text-xl">{p.name}</div>
                    <div className="text-sm text-muted-foreground">{money(p.price_cents)}</div>
                  </div>
                  <div className="flex items-center gap-1 text-gold text-xs">
                    <Star className="w-3 h-3 fill-current" /> 4.9
                  </div>
                </div>
              </Link>
            ))}
            {featured.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-12">No featured products yet.</div>
            )}
          </div>
        </div>
      </section>

      {/* All products */}
      <section className="pb-24 md:pb-32">
        <div className="container-lux">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
            <div>
              <div className="text-xs uppercase tracking-[0.4em] text-gold">02 — All products</div>
              <h2 className="mt-4 font-display text-4xl md:text-6xl">Shop everything.</h2>
              <p className="mt-3 text-muted-foreground max-w-md">Tables, cues, accessories and games — the full catalogue.</p>
            </div>
            <Link to="/shop" className="text-sm uppercase tracking-widest text-gold gold-underline inline-flex items-center gap-2">
              Open shop <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {allProducts.map((p) => (
              <Link key={p.id} to="/shop/$slug" params={{ slug: p.slug }} className="group block border hairline rounded-3xl overflow-hidden bg-card">
                <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
                  <img src={p.image_url || fallbackProduct} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  {p.badge && (
                    <div className="absolute top-3 left-3 text-[10px] uppercase tracking-widest px-3 py-1 pill bg-gold-gradient text-[var(--ink)]">{p.badge}</div>
                  )}
                </div>
                <div className="p-3 md:p-5">
                  <div className="font-display text-base md:text-xl">{p.name}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">{money(p.price_cents)}</div>
                    <div className="flex items-center gap-1 text-gold text-xs">
                      <Star className="w-3 h-3 fill-current" /> {Number(p.rating).toFixed(1)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {allProducts.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-12">No products yet.</div>
            )}
          </div>
        </div>
      </section>

      {/* Services overview */}
      <section className="py-24 md:py-32 bg-cream-soft border-y hairline">
        <div className="container-lux">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.4em] text-gold">03 — Services</div>
            <h2 className="mt-4 font-display text-4xl md:text-6xl">{t("sec.services")}</h2>
            <p className="mt-3 text-muted-foreground">{t("sec.services.sub")}</p>
          </div>

          <div className="mt-14 grid gap-px bg-[var(--border)] border hairline md:grid-cols-3">
            {[
              { icon: Wrench, title: "Installation", body: "Certified assembly, precision leveling, and slate alignment for tournament play." },
              { icon: Truck, title: "Delivery & Moving", body: "Insured transport and relocation across Rwanda with white-glove handling." },
              { icon: Shield, title: "Refelting", body: "Championship-grade Simonis and Strachan cloth, expertly stretched." },
              { icon: Trophy, title: "Maintenance", body: "Annual service plans keeping cushions, pockets and cloth in peak form." },
              { icon: Sparkles, title: "Repair", body: "Cushion replacement, rail work and full table restoration." },
              { icon: Star, title: "Custom Builds", body: "Bespoke finishes, brass inlays and cloth colors for signature spaces." },
            ].map((s) => (
              <div key={s.title} className="bg-background p-8 group hover:bg-cream-soft transition-colors">
                <s.icon className="w-8 h-8 text-gold" />
                <h3 className="mt-6 font-display text-2xl">{s.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{s.body}</p>
                <Link to="/services" className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold gold-underline">
                  Learn more <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-24 md:py-32">
        <div className="container-lux grid gap-16 lg:grid-cols-2 items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.4em] text-gold">04 — Craft</div>
            <h2 className="mt-4 font-display text-4xl md:text-6xl">{t("sec.why")}</h2>
            <p className="mt-6 text-muted-foreground text-lg">
              For over a decade, B Trader Elite Billiards has shaped Rwanda's finest game rooms — pairing world-class equipment with the discipline of a true installation studio.
            </p>
            <ul className="mt-10 space-y-6">
              {[
                ["Tournament-grade materials.", "Slate beds, Simonis cloth, Aramith balls — never substitutes."],
                ["Certified installation team.", "Every table leveled to under 0.02° on a professional bubble."],
                ["Lifetime service commitment.", "Two-year warranty, and a service network across Kigali and beyond."],
              ].map(([h, b]) => (
                <li key={h} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full border border-[var(--gold)] grid place-items-center text-gold text-xs shrink-0">✦</div>
                  <div>
                    <div className="font-display text-xl">{h}</div>
                    <div className="text-sm text-muted-foreground">{b}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/5]">
            <img src={productPool} alt="Luxury pool table detail" loading="lazy" className="w-full h-full object-cover" />
            <div className="absolute -bottom-8 -left-8 bg-background border hairline p-8 max-w-xs hidden md:block shadow-luxe">
              <div className="text-gold font-display text-5xl">4.9<span className="text-xl">/5</span></div>
              <div className="mt-2 text-sm text-muted-foreground">Average client rating across 200+ installations.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials preview */}
      <section className="py-24 md:py-32 bg-cream-soft border-y hairline">
        <div className="container-lux">
          <div className="text-xs uppercase tracking-[0.4em] text-gold text-center">05 — Voices</div>
          <h2 className="mt-4 font-display text-4xl md:text-6xl text-center">{t("sec.testimonials")}</h2>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <figure key={r.id} className="border hairline p-8 bg-background">
                <div className="flex gap-1 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <blockquote className="mt-6 font-display text-xl leading-snug">"{r.quote}"</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 text-sm">
                  <div className="w-10 h-10 rounded-full bg-gold-gradient grid place-items-center text-[var(--ink)] font-display">{r.author_name.charAt(0)}</div>
                  <div>
                    <div className="text-foreground">{r.author_name}</div>
                    <div className="text-muted-foreground">{r.author_role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection groups={faqGroups} />

      {/* CTA banner */}
      <section className="py-24">
        <div className="container-lux">
          <div className="relative overflow-hidden border hairline p-12 md:p-20 text-center">
            <div className="absolute inset-0 bg-gold-gradient opacity-10" />
            <div className="relative">
              <div className="text-xs uppercase tracking-[0.4em] text-gold">Ready when you are</div>
              <h2 className="mt-4 font-display text-4xl md:text-6xl max-w-3xl mx-auto">
                Design the room your guests won't forget.
              </h2>
              <div className="mt-10 flex flex-wrap gap-4 justify-center">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-4 bg-gold-gradient text-[var(--ink)] uppercase text-xs tracking-[0.3em]"
                >
                  {t("cta.whatsapp")}
                </a>
                <Link to="/contact" className="px-8 py-4 border border-[var(--gold)] text-gold uppercase text-xs tracking-[0.3em]">
                  {t("cta.contact")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function FAQSection({ groups }: { groups: Record<string, { id: string; category: string; question: string; answer: string }[]> }) {
  const [open, setOpen] = useState<string | null>("Prices-0");
  const cats = Object.keys(groups);
  return (
    <section className="py-24 md:py-32">
      <div className="container-lux max-w-4xl">
        <div className="text-xs uppercase tracking-[0.4em] text-gold text-center">06 — Support</div>
        <h2 className="mt-4 font-display text-4xl md:text-6xl text-center">Frequently asked questions.</h2>
        <div className="mt-14 space-y-10">
          {cats.map((cat) => (
            <div key={cat}>
              <div className="text-xs uppercase tracking-[0.4em] text-gold">{cat}</div>
              <div className="mt-3 border-t hairline">
                {groups[cat].map((it, i) => {
                  const id = `${cat}-${i}`;
                  const isOpen = open === id;
                  return (
                    <div key={id} className="border-b hairline">
                      <button onClick={() => setOpen(isOpen ? null : id)} className="w-full py-5 flex items-center justify-between text-left gap-6">
                        <span className="font-display text-lg md:text-xl">{it.question}</span>
                        {isOpen ? <Minus className="w-5 h-5 text-gold shrink-0" /> : <Plus className="w-5 h-5 text-gold shrink-0" />}
                      </button>
                      {isOpen && <p className="pb-6 pr-8 text-muted-foreground text-sm whitespace-pre-line">{it.answer}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {cats.length === 0 && <div className="text-center text-muted-foreground">No FAQs yet.</div>}
        </div>
      </div>
    </section>
  );
}

type HeroSlide = { id: string; image_url: string; label: string; link_url: string | null };

function HeroFanCarousel({ slides }: { slides: HeroSlide[] }) {
  const [offset, setOffset] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  useEffect(() => {
    if (count < 2 || paused) return;
    const id = setInterval(() => setOffset((v) => v + 1), 3200);
    return () => clearInterval(id);
  }, [count, paused]);

  if (count === 0) return null;

  const active = ((offset % count) + count) % count;
  const shift = (d: number) => setOffset((v) => v + d);

  // shortest signed distance from active index, wrapping around
  const relOf = (i: number) => {
    let rel = i - active;
    if (rel > count / 2) rel -= count;
    if (rel < -count / 2) rel += count;
    return rel;
  };

  return (
    <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div
        className="relative mx-auto w-full"
        style={{ height: "clamp(330px, 40vw, 560px)", perspective: "1400px" }}
      >
        {slides.map((slide, i) => {
          const rel = relOf(i);
          const abs = Math.abs(rel);
          const hidden = abs > 3;
          const isCenter = rel === 0;
          const inner = (
            <>
              <img
                src={slide.image_url}
                alt={slide.label}
                loading={isCenter ? "eager" : "lazy"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-4 whitespace-nowrap px-4 py-1.5 pill bg-black/85 text-[#F3F6F2] text-[10px] md:text-xs uppercase tracking-widest">
                {slide.label}
              </div>
            </>
          );
          return (
            <motion.div
              key={slide.id}
              className="absolute top-1/2 left-1/2 rounded-[1.75rem] overflow-hidden shadow-luxe bg-black ring-1 ring-black/20"
              style={{
                width: "clamp(200px, 26vw, 380px)",
                height: "clamp(260px, 32vw, 460px)",
                x: "-50%",
                y: "-50%",
                cursor: slide.link_url ? "pointer" : "default",
              }}
              onClick={() => {
                if (!isCenter) return setOffset(offset + rel);
                if (slide.link_url) window.location.href = slide.link_url;
              }}
              drag={isCenter ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) shift(1);
                else if (info.offset.x > 60) shift(-1);
              }}
              animate={{
                translateX: `${rel * 26}%`,
                translateY: abs * abs * 7,
                rotate: rel * 7,
                scale: 1 - abs * 0.05,
                opacity: hidden ? 0 : 1,
                zIndex: 100 - abs,
                filter: isCenter ? "brightness(1)" : "brightness(0.82)",
              }}
              transition={{ type: "spring", stiffness: 90, damping: 18, mass: 0.9 }}
              whileHover={isCenter ? { scale: 1.04 } : undefined}
            >
              {inner}
            </motion.div>
          );
        })}
      </div>
      {count > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => shift(-1)}
            aria-label="Previous"
            className="w-10 h-10 grid place-items-center pill border border-[#F3F6F2]/30 text-[#F3F6F2] hover:bg-[#F3F6F2] hover:text-black transition"
          >
            ←
          </motion.button>
          <div className="flex items-center gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setOffset(offset + relOf(i))}
                aria-label={`Go to ${s.label}`}
                className="py-2"
              >
                <motion.span
                  className="block h-1.5 rounded-full"
                  animate={{
                    width: i === active ? 24 : 6,
                    backgroundColor: i === active ? "#7CE0A6" : "rgba(243,246,242,0.4)",
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                />
              </button>
            ))}
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => shift(1)}
            aria-label="Next"
            className="w-10 h-10 grid place-items-center pill border border-[#F3F6F2]/30 text-[#F3F6F2] hover:bg-[#F3F6F2] hover:text-black transition"
          >
            →
          </motion.button>
        </div>
      )}
    </div>
  );
}
