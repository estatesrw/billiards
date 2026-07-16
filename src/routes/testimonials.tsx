import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { PageShell, PageHeader } from "@/components/PageShell";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Reviews — B Trader Elite Billiards" },
      { name: "description", content: "What our clients say — hotels, bars, clubs and private owners across Rwanda." },
    ],
  }),
  component: Testimonials,
});

const REVIEWS = [
  { q: "The most professional installation team I've worked with. The table is a work of art.", n: "Jean Bosco", r: "Owner, Amber Bar", stars: 5 },
  { q: "From sourcing to setup, seamless. Our members compliment the room every week.", n: "Aline U.", r: "Manager, Meridian Club", stars: 5 },
  { q: "Delivered on time, on budget — and refelted our old table like new.", n: "Patrick M.", r: "Kigali Grand Hotel", stars: 5 },
  { q: "The quality of the cloth work is on another level. Rolls perfectly true.", n: "David K.", r: "Private client", stars: 5 },
  { q: "They moved a 12-ft snooker table three floors up without a scratch.", n: "Serena K.", r: "Serena Lounge", stars: 5 },
  { q: "Best after-sales service in Rwanda. Response in under an hour every time.", n: "Innocent H.", r: "Green Hills Academy", stars: 5 },
];

function Testimonials() {
  return (
    <PageShell>
      <PageHeader eyebrow="Reviews" title="Voices from the room." sub="A few words from clients who trusted us with their spaces." />
      <section className="container-lux py-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.map((r) => (
          <figure key={r.n} className="border hairline p-8 bg-[oklch(0.08_0_0)]">
            <div className="flex gap-1 text-gold">
              {Array.from({ length: r.stars }).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <blockquote className="mt-6 font-display text-2xl leading-snug">"{r.q}"</blockquote>
            <figcaption className="mt-8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gold-gradient grid place-items-center text-[var(--ink)] font-display text-lg">
                {r.n.charAt(0)}
              </div>
              <div className="text-sm">
                <div>{r.n}</div>
                <div className="text-muted-foreground">{r.r}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </section>
    </PageShell>
  );
}