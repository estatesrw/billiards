import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import p1 from "@/assets/project-hotel.jpg";
import p2 from "@/assets/project-bar.jpg";
import p3 from "@/assets/project-club.jpg";
import prod1 from "@/assets/product-pool.jpg";
import prod2 from "@/assets/product-snooker.jpg";
import prod3 from "@/assets/product-carom.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — B Trader Elite Billiards" },
      { name: "description", content: "A visual showcase of installations, craftsmanship and premium billiards rooms." },
    ],
  }),
  component: Gallery,
});

const IMAGES = [
  { src: g1, span: "row-span-2" },
  { src: p1, span: "" },
  { src: prod1, span: "" },
  { src: g4, span: "col-span-2" },
  { src: p2, span: "row-span-2" },
  { src: g2, span: "" },
  { src: prod2, span: "" },
  { src: g3, span: "" },
  { src: p3, span: "col-span-2" },
  { src: prod3, span: "" },
];

function Gallery() {
  return (
    <PageShell>
      <PageHeader eyebrow="Gallery" title="Rooms worth returning to." sub="Craftsmanship in installations, cloth work and finished tables." />
      <section className="container-lux py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[220px]">
          {IMAGES.map((im, i) => (
            <div key={i} className={`relative overflow-hidden group ${im.span}`}>
              <img src={im.src} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}