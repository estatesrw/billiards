import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell, PageHeader } from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { seo, ldJson, localBusinessLd, breadcrumbLd } from "@/lib/seo";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    ...seo({
      title: "Billiards Gallery — Pool Table Installations in Rwanda",
      description: "Photo gallery of B Trader Elite Billiards work in Rwanda: luxury pool table installations, snooker rooms, hotel and lounge game rooms in Kigali.",
      path: "/gallery",
      keywords: "billiards gallery Rwanda, pool room design Kigali, pool table photos Rwanda",
    }),
  }),
  component: Gallery,
});

type Item = { id: string; image_url: string; caption: string | null; span: string | null };

function Gallery() {
  const { data: items = [], isLoading } = useQuery<Item[]>({
    queryKey: ["gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("id,image_url,caption,span")
        .eq("is_published", true)
        .order("sort_order");
      if (error) throw error;
      return data as Item[];
    },
  });
  return (
    <PageShell>
      <PageHeader eyebrow="Gallery" title="Rooms worth returning to." sub="Craftsmanship in installations, cloth work and finished tables." />
      <section className="container-lux py-16">
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading gallery…</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[220px]">
            {items.map((im) => (
              <div key={im.id} className={`relative overflow-hidden group ${im.span ?? ""}`}>
                <img src={im.image_url} alt={im.caption ?? ""} loading="lazy" className="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                {im.caption && <div className="absolute bottom-3 left-3 right-3 text-[10px] uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition-opacity">{im.caption}</div>}
              </div>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}