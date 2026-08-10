import { createFileRoute } from "@tanstack/react-router";
import { Wrench, Truck, Scissors, Sparkles, Hammer, Shield, Trophy, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PageShell, PageHeader } from "@/components/PageShell";
import { SITE } from "@/lib/site";
import { supabase } from "@/integrations/supabase/client";
import { money } from "@/lib/money";
import { seo, ldJson, localBusinessLd, breadcrumbLd } from "@/lib/seo";

export const Route = createFileRoute("/services")({
  head: () => ({
    ...seo({
      title: "Pool Table Installation, Moving & Repair in Kigali, Rwanda",
      description: "Professional billiards services in Rwanda: pool table installation, moving and relocation, cloth (felt) replacement, cushion repair, levelling and maintenance by B Trader Elite technicians.",
      path: "/services",
      keywords: "pool table installation Kigali, pool table repair Rwanda, billiard table moving Kigali, pool table felt replacement Rwanda, snooker table maintenance",
    }),
    scripts: [ldJson(breadcrumbLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }]))],
  }),
  component: Services,
});

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench, Truck, Scissors, Sparkles, Hammer, Shield, Trophy, Star,
};

type Service = {
  id: string; title: string; description: string | null;
  price_cents: number; currency: string; image_url: string | null; icon: string | null;
};

function Services() {
  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("id,title,description,price_cents,currency,image_url,icon")
        .eq("is_published", true)
        .order("sort_order");
      if (error) throw error;
      return data as Service[];
    },
  });

  return (
    <PageShell>
      <PageHeader eyebrow="Services" title="From delivery to first break." sub="Every service performed in-house by trained specialists." />
      <section className="container-lux py-16">
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading services…</div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => {
              const Icon = ICONS[s.icon ?? ""] ?? Sparkles;
              return (
                <article key={s.id} className="group border hairline rounded-3xl overflow-hidden bg-background hover:border-[var(--gold)]/60 transition-colors flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                    {s.image_url && (
                      <img src={s.image_url} alt={`${s.title} — billiards service in Kigali, Rwanda`} loading="lazy" className="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-105" />
                    )}
                    <div className="absolute top-4 left-4 w-11 h-11 rounded-full bg-background/90 backdrop-blur border border-[var(--gold)] grid place-items-center text-gold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="absolute top-4 right-4 text-[10px] uppercase tracking-widest bg-[var(--ink)]/70 text-gold px-3 py-1 rounded-full">0{i + 1}</div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="font-display text-2xl">{s.title}</h2>
                    <p className="mt-3 text-sm text-muted-foreground flex-1">{s.description}</p>
                    {s.price_cents > 0 && (
                      <div className="mt-4 text-gold text-sm uppercase tracking-widest">From {money(s.price_cents)}</div>
                    )}
                    <div className="mt-6 flex gap-2">
                      <a href={SITE.waLink(`I'd like to book: ${s.title}`)} target="_blank" rel="noreferrer" className="flex-1 text-center px-4 py-3 pill bg-[var(--ink)] text-[var(--ivory)] uppercase text-[10px] tracking-[0.25em] hover:bg-gold-gradient hover:text-[var(--ink)]">Book</a>
                      <a href={SITE.waLink(`Quick question about ${s.title}`)} target="_blank" rel="noreferrer" className="flex-1 text-center px-4 py-3 pill border border-[var(--gold)] text-gold uppercase text-[10px] tracking-[0.25em]">Ask</a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </PageShell>
  );
}