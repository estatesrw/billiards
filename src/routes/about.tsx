import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";
import { useI18n } from "@/lib/i18n";
import { gallery4 as gallery, productCues as cues } from "@/lib/images";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — B Trader Elite Billiards" },
      { name: "description", content: "The story, mission and craft behind Rwanda's premier billiards house." },
    ],
  }),
  component: About,
});

function About() {
  const { lang } = useI18n();
  return (
    <PageShell>
      <PageHeader
        eyebrow="Our story"
        title={lang === "rw" ? "Amateka ya B Trader Elite Billiards" : "The B Trader Elite Story"}
        sub={
          lang === "rw"
            ? "Ubuhanga, ubuziranenge n'urukundo rw'imikino ya biliyari."
            : "Craft, quality, and a lifelong love for the game."
        }
      />

      <section className="container-lux py-20 grid gap-16 md:grid-cols-2 items-start">
        <div className="prose-none space-y-6 text-muted-foreground leading-relaxed">
          <p className="text-foreground text-xl font-display">
            {lang === "rw"
              ? "B Trader Elite Billiards yatangiye mu Rwanda ifite intego yo kuzana amameza ya biliyari y'urwego rwo hejuru mu bahatuye."
              : "B Trader Elite Billiards was founded in Rwanda with a single ambition: to bring tournament-grade billiards to homes, hotels and clubs across the region."}
          </p>
          <p>
            {lang === "rw"
              ? "Mu myaka irenga icumi, twashyizeho amameza arenga 800, tuyaha inzobere zishyira mu mwanya wayo n'ubuhanga bukomeye, tumenya ko buri meza igomba kuba yuzuye ubuziranenge kuva ku bwikorezi kugera aho ikoreshwa."
              : "Over more than a decade we have installed 800+ tables — each set with the discipline of a specialist workshop, from delivery through final leveling."}
          </p>
          <p>
            {lang === "rw"
              ? "Ubutumwa bwacu: gutanga amameza ya biliyari n'ibindi biyifitanye isano by'ubuziranenge bukomeye, hamwe na serivisi zizewe, ku giciro cyiza."
              : "Our mission is simple: provide the highest-quality billiards tables and accessories, backed by professional service, at fair value."}
          </p>
          <p>
            {lang === "rw"
              ? "Iyo ushakisha meza ya pool, snooker cyangwa carom, ushobora kwiringira ko turi kumwe nawe kuva ku itoranywa kugeza ku isuku ya buri munsi."
              : "Whether you are choosing a pool, snooker or carom table, we walk with you from selection to first break — and every service call after."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <img src={gallery} alt="Table under gold light" loading="lazy" className="aspect-[3/4] object-cover w-full" />
          <img src={cues} alt="Elite cue set" loading="lazy" className="aspect-[3/4] object-cover w-full mt-12" />
        </div>
      </section>

      <section className="container-lux pb-24 grid gap-6 md:grid-cols-3">
        {[
          { k: "Mission", v: "Deliver tournament-grade billiards and lifetime service across Rwanda." },
          { k: "Values", v: "Craft, honesty and precision — with materials we would put in our own homes." },
          { k: "Promise", v: "Two-year warranty, transparent pricing and installers you can count on." },
        ].map((b) => (
          <div key={b.k} className="border hairline p-8">
            <div className="text-xs uppercase tracking-[0.4em] text-gold">{b.k}</div>
            <p className="mt-4 font-display text-2xl">{b.v}</p>
          </div>
        ))}
      </section>
    </PageShell>
  );
}