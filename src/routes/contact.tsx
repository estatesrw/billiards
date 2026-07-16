import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — B Trader Elite Billiards" },
      { name: "description", content: "Get in touch — WhatsApp, phone, email or visit our showroom in Kigali." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const msg = `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`;
    window.open(SITE.waLink(msg), "_blank");
    setSent(true);
  }

  return (
    <PageShell>
      <PageHeader eyebrow="Contact" title="Let's build your room." sub="We reply within the hour on WhatsApp during business hours." />

      <section className="container-lux py-16 grid gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          {[
            { icon: MessageCircle, label: "WhatsApp", val: SITE.whatsappDisplay, href: SITE.waLink() },
            { icon: Phone, label: "Phone", val: SITE.phone, href: `tel:${SITE.phone}` },
            { icon: Mail, label: "Email", val: SITE.email, href: `mailto:${SITE.email}` },
            { icon: MapPin, label: "Showroom", val: SITE.address },
          ].map((c) => {
            const Body = (
              <div className="border hairline p-6 flex items-start gap-4 hover:border-[var(--gold)]/50 transition-colors">
                <div className="w-12 h-12 border border-[var(--gold)] rounded-full grid place-items-center text-gold shrink-0">
                  <c.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-gold">{c.label}</div>
                  <div className="mt-1 font-display text-xl">{c.val}</div>
                </div>
              </div>
            );
            return c.href ? (
              <a key={c.label} href={c.href} target={c.label === "WhatsApp" ? "_blank" : undefined} rel="noreferrer" className="block">
                {Body}
              </a>
            ) : (
              <div key={c.label}>{Body}</div>
            );
          })}

          <div className="aspect-[4/3] overflow-hidden border hairline">
            <iframe
              title="Map"
              src={SITE.mapsEmbed}
              className="w-full h-full grayscale"
              loading="lazy"
            />
          </div>
        </div>

        <form onSubmit={submit} className="border hairline p-8 md:p-10 space-y-6 h-fit bg-[oklch(0.08_0_0)]">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-gold">Send a message</div>
            <h2 className="mt-3 font-display text-3xl">We'd love to hear from you.</h2>
          </div>
          {sent && (
            <div className="border border-[var(--gold)] text-gold p-4 text-sm">Opening WhatsApp with your message…</div>
          )}
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Name</span>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-2 w-full bg-transparent border-b hairline py-3 outline-none focus:border-[var(--gold)] transition-colors"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Email</span>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-2 w-full bg-transparent border-b hairline py-3 outline-none focus:border-[var(--gold)] transition-colors"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Message</span>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="mt-2 w-full bg-transparent border-b hairline py-3 outline-none focus:border-[var(--gold)] transition-colors resize-none"
            />
          </label>
          <button
            type="submit"
            className="w-full px-8 py-4 bg-gold-gradient text-[var(--ink)] uppercase text-xs tracking-[0.3em] font-medium"
          >
            Send via WhatsApp
          </button>
        </form>
      </section>
    </PageShell>
  );
}