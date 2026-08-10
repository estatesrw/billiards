import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { projectHotel as hotel, projectBar as bar, projectClub as club, gallery4 as g4, productPool as pool, productSnooker as snooker } from "@/lib/images";
import { seo, ldJson, localBusinessLd, breadcrumbLd } from "@/lib/seo";

export const Route = createFileRoute("/projects")({
  head: () => ({
    ...seo({
      title: "Our Projects — Pool Table Installations in Kigali & Rwanda",
      description: "Completed billiards projects across Rwanda: hotels, bars, private clubs, schools and homes fitted with premium pool and snooker tables by B Trader Elite Billiards.",
      path: "/projects",
      keywords: "pool table projects Rwanda, hotel game room Kigali, billiards installation portfolio Rwanda",
    }),
  }),
  component: Projects,
});

type Project = { name: string; category: string; location: string; img: string };

const PROJECTS: Project[] = [
  { name: "Kigali Grand Hotel", category: "Hotels", location: "Kigali", img: hotel },
  { name: "Amber Speakeasy", category: "Bars", location: "Kimihurura", img: bar },
  { name: "Meridian Private Club", category: "Clubs", location: "Nyarutarama", img: club },
  { name: "The Nkusi Residence", category: "Homes", location: "Kibagabaga", img: pool },
  { name: "Green Hills Academy", category: "Schools", location: "Nyarutarama", img: snooker },
  { name: "Serena Lounge", category: "Hotels", location: "Kiyovu", img: g4 },
];

const CATS = ["All", "Hotels", "Bars", "Clubs", "Homes", "Schools"] as const;

function Projects() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const filtered = PROJECTS.filter((p) => cat === "All" || p.category === cat);

  return (
    <PageShell>
      <PageHeader eyebrow="Projects" title="Rooms we've built." sub="A selection of installations across Rwanda." />
      <section className="container-lux py-16">
        <div className="flex flex-wrap gap-2 justify-center">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-5 py-2 text-xs uppercase tracking-widest border transition-colors ${
                cat === c ? "border-[var(--gold)] bg-gold-gradient text-[var(--ink)]" : "hairline text-muted-foreground hover:text-gold hover:border-[var(--gold)]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <article key={p.name} className="group relative overflow-hidden aspect-[4/5]">
              <img src={p.img} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold">{p.category} — {p.location}</div>
                <h3 className="mt-2 font-display text-2xl">{p.name}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}