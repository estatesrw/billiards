import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Star, Shield, Wrench, Truck, Trophy, Sparkles } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { useI18n } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import heroImg from "@/assets/hero-table.jpg";
import productPool from "@/assets/product-pool.jpg";
import productSnooker from "@/assets/product-snooker.jpg";
import productCarom from "@/assets/product-carom.jpg";
import productCues from "@/assets/product-cues.jpg";
import projectHotel from "@/assets/project-hotel.jpg";
import projectBar from "@/assets/project-bar.jpg";
import projectClub from "@/assets/project-club.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { t } = useI18n();

  return (
    <PageShell>
      {/* Promo banner */}
      <div className="bg-gold-gradient text-[var(--ink)] overflow-hidden">
        <div className="container-lux py-2.5 flex items-center justify-center gap-3 text-xs md:text-sm font-medium text-center">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{t("promo")}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-end overflow-hidden">
        <img
          src={heroImg}
          alt="Luxury billiards table in a dim-lit private lounge"
          width={1920}
          height={1280}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_95%)]" />

        <div className="container-lux relative z-10 py-24 md:py-32">
          <div className="max-w-3xl animate-lux-in">
            <div className="text-xs uppercase tracking-[0.4em] text-gold">{t("hero.eyebrow")}</div>
            <h1 className="mt-6 font-display text-[3rem] md:text-[6rem] leading-[0.9]">
              {t("hero.title.a")}
              <br />
              <span className="italic text-gold">{t("hero.title.b")}</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground">{t("hero.sub")}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gold-gradient text-[var(--ink)] uppercase text-xs tracking-[0.3em] font-medium hover:shadow-[var(--shadow-gold)] transition-all"
              >
                {t("cta.shop")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 border border-[var(--gold)] text-gold uppercase text-xs tracking-[0.3em] hover:bg-[var(--gold)] hover:text-[var(--ink)] transition-all"
              >
                {t("cta.contact")}
              </Link>
            </div>
          </div>

          {/* Stat strip */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl border-t hairline pt-10">
            {[
              { k: "12+", v: "Years of craft" },
              { k: "800+", v: "Tables installed" },
              { k: "48h", v: "Kigali delivery" },
              { k: "2 yr", v: "Warranty" },
            ].map((s) => (
              <div key={s.k}>
                <div className="font-display text-4xl text-gold">{s.k}</div>
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
            {[
              { img: productPool, name: "Regal Pro Pool Table", price: "From $3,200" },
              { img: productSnooker, name: "Windsor Snooker 12ft", price: "From $5,800" },
              { img: productCarom, name: "Carom Heritage Table", price: "From $2,900" },
              { img: productCues, name: "Elite Cue Set + Case", price: "From $220" },
            ].map((p) => (
              <Link key={p.name} to="/shop" className="group block">
                <div className="relative overflow-hidden aspect-[4/5] bg-secondary">
                  <img src={p.img} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
                  <div className="absolute top-4 right-4 text-[10px] uppercase tracking-widest bg-[var(--ink)]/60 text-gold px-3 py-1 border border-[var(--gold)]/40">
                    New
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <div className="font-display text-xl">{p.name}</div>
                    <div className="text-sm text-muted-foreground">{p.price}</div>
                  </div>
                  <div className="flex items-center gap-1 text-gold text-xs">
                    <Star className="w-3 h-3 fill-current" /> 4.9
                  </div>
                </div>
              </Link>
            ))}
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
            {[
              { img: projectHotel, cat: "Hotel", name: "Kigali Grand Lounge" },
              { img: projectBar, cat: "Bar", name: "Amber Speakeasy" },
              { img: projectClub, cat: "Club", name: "Meridian Private Club" },
            ].map((p) => (
              <article key={p.name} className="group relative overflow-hidden aspect-[4/5]">
                <img src={p.img} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-gold">{p.cat}</div>
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

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              { q: "The most professional installation team I've worked with. The table is a work of art.", n: "Jean Bosco", r: "Owner, Amber Bar" },
              { q: "From sourcing to setup, seamless. Our members constantly compliment the room.", n: "Aline U.", r: "Manager, Meridian Club" },
              { q: "Delivered on time, on budget — and refelted our old table like new.", n: "Patrick M.", r: "Kigali Grand Hotel" },
            ].map((t) => (
              <figure key={t.n} className="border hairline p-8 bg-background">
                <div className="flex gap-1 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <blockquote className="mt-6 font-display text-2xl leading-snug">"{t.q}"</blockquote>
                <figcaption className="mt-6 text-sm">
                  <div className="text-foreground">{t.n}</div>
                  <div className="text-muted-foreground">{t.r}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

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
                  href={SITE.waLink("Hello, I would like a quote for a billiards table.")}
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
