import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { seo, ldJson, localBusinessLd, breadcrumbLd } from "@/lib/seo";

export const Route = createFileRoute("/faq")({
  head: () => ({
    ...seo({
      title: "Billiards FAQ — Prices, Delivery, Warranty & Installation Rwanda",
      description: "Frequently asked questions about buying a pool or snooker table in Rwanda: prices in RWF, Kigali delivery, 2-year warranty, installation time, payment and maintenance.",
      path: "/faq",
      keywords: "pool table price Rwanda, billiards delivery Kigali, pool table warranty Rwanda",
    }),
  }),
  component: FAQ,
});

const SECTIONS = [
  {
    cat: "Prices",
    items: [
      { q: "How much does a pool table cost?", a: "Pool tables start at $3,200 for our Regal Pro line. Snooker tables begin at $4,600, and carom tables at $2,900. Custom builds are quoted individually." },
      { q: "Do you offer payment plans?", a: "Yes — for orders above $2,000 we offer flexible 3–6 month installments with a signed agreement." },
    ],
  },
  {
    cat: "Delivery",
    items: [
      { q: "Do you deliver across Rwanda?", a: "Yes. Delivery within Kigali is included on all tables. Nationwide delivery is quoted based on distance." },
      { q: "How long does delivery take?", a: "In-stock items ship within 48 hours in Kigali. Custom orders take 3–6 weeks depending on the finish." },
    ],
  },
  {
    cat: "Warranty",
    items: [
      { q: "What warranty do you offer?", a: "All tables carry a 2-year manufacturer warranty on frame and slate, and a 1-year warranty on cloth and cushions." },
      { q: "Are accessories covered?", a: "Cues carry a 6-month warranty against manufacturing defects." },
    ],
  },
  {
    cat: "Installation",
    items: [
      { q: "Do you install the table?", a: "Yes. Every table is professionally installed by our certified team, including precision leveling." },
      { q: "Can you move an existing table?", a: "Absolutely. We disassemble, transport and reinstall tables anywhere in Rwanda." },
    ],
  },
  {
    cat: "Payment methods",
    items: [
      { q: "What payment methods do you accept?", a: "MTN Mobile Money, Airtel Money, bank transfer, and cash on delivery for orders within Kigali." },
      { q: "Do you take card payments?", a: "Card payments will be available soon through our online checkout." },
    ],
  },
];

function FAQ() {
  const [open, setOpen] = useState<string | null>("Prices-0");
  return (
    <PageShell>
      <PageHeader eyebrow="Support" title="Frequently asked questions." sub="Everything you need to know before you order." />
      <section className="container-lux py-16 max-w-4xl mx-auto space-y-12">
        {SECTIONS.map((sec) => (
          <div key={sec.cat}>
            <div className="text-xs uppercase tracking-[0.4em] text-gold">{sec.cat}</div>
            <div className="mt-4 border-t hairline">
              {sec.items.map((it, i) => {
                const id = `${sec.cat}-${i}`;
                const isOpen = open === id;
                return (
                  <div key={id} className="border-b hairline">
                    <button
                      onClick={() => setOpen(isOpen ? null : id)}
                      className="w-full py-6 flex items-center justify-between text-left gap-6"
                    >
                      <span className="font-display text-xl md:text-2xl">{it.q}</span>
                      {isOpen ? <Minus className="w-5 h-5 text-gold shrink-0" /> : <Plus className="w-5 h-5 text-gold shrink-0" />}
                    </button>
                    {isOpen && <p className="pb-8 pr-12 text-muted-foreground animate-lux-in">{it.a}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </PageShell>
  );
}