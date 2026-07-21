import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ArrowUpRight, Star, Shield, Wrench, Truck, Trophy, Sparkles, Plus, Minus, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { useI18n } from "@/lib/i18n";
import { heroTable as heroImg, productPool, fallbackProduct } from "@/lib/images";
import { supabase } from "@/integrations/supabase/client";
import { useSettings, waLink } from "@/lib/settings";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { t } = useI18n();
  const { data: settings } = useSettings();

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

  const { data: homeProjects = [] } = useQuery({
    queryKey: ["home", "projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("home_projects")
        .select("id, name, category, image_url")
        .eq("is_published", true)
        .order("sort_order");
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
      {/* Promo banner */}
      {settings?.promo_enabled && settings.promo_text && (
        <div className="bg-gold-gradient text-[var(--ink)] overflow-hidden">
          <div className="container-lux py-2.5 flex items-center justify-center gap-3 text-xs md:text-sm font-medium text-center">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{settings.promo_text}</span>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative pt-16 md:pt-24 pb-12 overflow-hidden">
        <div className="container-lux relative z-10">
          <div className="max-w-5xl animate-lux-in">
            <div className="flex items-center gap-4">
              <span className="font-script text-gold text-4xl md:text-5xl -rotate-6 inline-block">hello,</span>
              <span className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">{t("hero.eyebrow")}</span>
            </div>
            <h1 className="mt-4 font-display text-[3rem] md:text-[7rem] leading-[0.95] tracking-tight">
              {t("hero.title.a")}<span className="text-gold">.</span>
              <br />
              <span className="text-muted-foreground">{t("hero.title.b")}</span>
            </h1>
            <div className="mt-10 grid md:grid-cols-[1fr_auto] gap-8 items-end">
              <p className="max-w-xl text-lg text-muted-foreground">{t("hero.sub")}</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/shop"
                  className="group inline-flex items-center gap-3 px-6 py-4 pill bg-[var(--ink)] text-[var(--ivory)] text-sm hover:bg-gold-gradient hover:text-[var(--ink)] transition-all"
                >
                  {t("cta.shop")}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-3 px-6 py-4 pill border hairline text-foreground hover:bg-secondary transition-all text-sm"
                >
                  {t("cta.contact")}
                </Link>
              </div>
            </div>
          </div>

          {/* Hero image plate */}
          <div className="mt-14 relative rounded-[2rem] overflow-hidden aspect-[16/8] shadow-luxe">
            <img
              src={heroImg}
              alt="Luxury billiards table in a dim-lit private lounge"
              width={1920}
              height={1280}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
            <div className="absolute left-6 bottom-6 md:left-10 md:bottom-10 text-[var(--ivory)]">
              <div className="text-[10px] uppercase tracking-[0.4em] text-gold">Signature</div>
              <div className="font-display text-2xl md:text-4xl mt-2">Regal Pro — 8ft slate</div>
            </div>
          </div>

          {/* Stat strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t hairline pt-10">
            {[
              { k: "12+", v: "Years of craft" },
              { k: "800+", v: "Tables installed" },
              { k: "48h", v: "Kigali delivery" },
              { k: "2 yr", v: "Warranty" },
            ].map((s) => (
              <div key={s.k}>
                <div className="font-display text-5xl">{s.k}</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.v}</div>
              </div>
            ))}
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

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                    <div className="font-display text-xl">{p.name}</div>
                    <div className="text-sm text-muted-foreground">${(p.price_cents / 100).toLocaleString()}</div>
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

      {/* Services overview */}
      <section className="py-24 md:py-32 bg-cream-soft border-y hairline">
        <div className="container-lux">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.4em] text-gold">02 — Services</div>
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
            <div className="text-xs uppercase tracking-[0.4em] text-gold">03 — Craft</div>
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

      {/* Featured Projects */}
      <section className="py-24 md:py-32 border-t hairline">
        <div className="container-lux">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
            <div>
              <div className="text-xs uppercase tracking-[0.4em] text-gold">04 — Projects</div>
              <h2 className="mt-4 font-display text-4xl md:text-6xl">{t("sec.projects")}</h2>
              <p className="mt-3 text-muted-foreground max-w-md">{t("sec.projects.sub")}</p>
            </div>
            <Link to="/projects" className="text-sm uppercase tracking-widest text-gold gold-underline inline-flex items-center gap-2">
              All projects <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {homeProjects.map((p) => (
              <article key={p.id} className="group relative overflow-hidden aspect-[4/5]">
                <img src={p.image_url} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  {p.category && <div className="text-[10px] uppercase tracking-[0.3em] text-gold">{p.category}</div>}
                  <div className="mt-2 font-display text-2xl">{p.name}</div>
                </div>
              </article>
            ))}
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
