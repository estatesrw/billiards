import { createFileRoute } from "@tanstack/react-router";
import { Wrench, Truck, Scissors, Sparkles, Hammer } from "lucide-react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — B Trader Elite Billiards" },
      { name: "description", content: "Billiards table installation, moving, repair, cloth replacement and maintenance in Rwanda." },
    ],
  }),
  component: Services,
});

const SERVICES = [
  { icon: Wrench, title: "Table Installation", body: "Certified assembly, slate leveling and professional setup for pool, snooker and carom tables." },
  { icon: Truck, title: "Table Moving", body: "Insured relocation across Rwanda, with full disassembly, transport and reinstallation." },
  { icon: Hammer, title: "Table Repair", body: "Cushion replacement, rail work, pocket repair and full structural restoration." },
  { icon: Scissors, title: "Cloth Replacement", body: "Simonis and Strachan championship cloth, expertly fitted for a true, fast roll." },
  { icon: Sparkles, title: "Maintenance", body: "Annual service plans covering brushing, re-leveling and cushion checks." },
];

function Services() {
  return (
    <PageShell>
      <PageHeader eyebrow="Services" title="From delivery to first break." sub="Every service performed in-house by trained specialists." />

      <section className="container-lux py-16 space-y-6">
        {SERVICES.map((s, i) => (
          <div key={s.title} className="border hairline p-8 md:p-12 grid gap-8 md:grid-cols-[auto_1fr_auto] items-center hover:border-[var(--gold)]/50 transition-colors">
            <div className="flex items-center gap-6">
              <div className="text-gold text-xs uppercase tracking-widest">0{i + 1}</div>
              <div className="w-14 h-14 border border-[var(--gold)] rounded-full grid place-items-center text-gold">
                <s.icon className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h2 className="font-display text-3xl md:text-4xl">{s.title}</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl">{s.body}</p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <a href={SITE.waLink(`I'd like to book: ${s.title}`)} target="_blank" rel="noreferrer" className="px-6 py-3 bg-gold-gradient text-[var(--ink)] uppercase text-xs tracking-[0.3em] text-center">Book Service</a>
              <a href={SITE.waLink(`Quick question about ${s.title}`)} target="_blank" rel="noreferrer" className="px-6 py-3 border border-[var(--gold)] text-gold uppercase text-xs tracking-[0.3em] text-center">WhatsApp</a>
            </div>
          </div>
        ))}
      </section>
    </PageShell>
  );
}