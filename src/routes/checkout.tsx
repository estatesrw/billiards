import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { useCart } from "@/lib/cart";
import { supabase } from "@/integrations/supabase/client";
import { fetchSettings, renderTemplate, waLink, DEFAULT_TEMPLATE } from "@/lib/settings";
import { toast } from "sonner";
import { fallbackProduct as fallbackImg } from "@/lib/images";
import { money } from "@/lib/money";
import { orderCartOnWhatsApp } from "@/lib/wa-order";
import { money } from "@/lib/money";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — B Trader Elite Billiards" }] }),
  component: Checkout,
});

function Checkout() {
  const { items, subtotal, clear } = useCart();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", address: "", city: "Kigali", notes: "" });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setForm((f) => ({ ...f, email: data.user!.email ?? "" }));
    });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return toast.error("Your cart is empty.");
    // Open a placeholder tab synchronously so popup blockers allow it after await.
    const waWindow = window.open("about:blank", "_blank");
    setBusy(true);
    try {
      const settings = await fetchSettings();
      const { data: u } = await supabase.auth.getUser();
      const { data: order, error } = await supabase.from("orders").insert({
        ...form,
        user_id: u.user?.id ?? null,
        subtotal_cents: subtotal,
        currency: "RWF",
        channel: "whatsapp",
        status: "pending",
      }).select("id").single();
      if (error) throw error;
      const { error: iErr } = await supabase.from("order_items").insert(
        items.map((i) => ({
          order_id: order.id,
          product_id: i.id,
          name: i.name,
          unit_price_cents: i.price_cents,
          quantity: i.quantity,
        }))
      );
      if (iErr) throw iErr;

      const lines = items.map((i) => `• ${i.name} × ${i.quantity} — ${money(i.price_cents * i.quantity)}`).join("\n");
      const msg = renderTemplate(settings.order_message_template || DEFAULT_TEMPLATE, {
        order_id: order.id.slice(0, 8),
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        items: lines,
        subtotal: money(subtotal),
        notes: form.notes || "—",
      });
      const wa = waLink(settings.whatsapp_number, msg);
      clear();
      toast.success("Order sent. Continuing to WhatsApp…");
      if (waWindow) waWindow.location.href = wa;
      else window.location.href = wa;
    } catch (err) {
      if (waWindow) waWindow.close();
      toast.error(err instanceof Error ? err.message : "Could not place order.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell>
      <PageHeader eyebrow="Checkout" title="Complete your order" sub="We confirm every order on WhatsApp and arrange delivery across Rwanda." />
      <section className="container-lux pb-24 grid gap-12 lg:grid-cols-[1fr_400px]">
        <form onSubmit={submit} className="space-y-4 border hairline rounded-3xl bg-card p-8">
          <div className="font-display text-2xl">Delivery details</div>
          {[
            ["full_name", "Full name", "text"],
            ["email", "Email", "email"],
            ["phone", "Phone", "tel"],
            ["address", "Address", "text"],
            ["city", "City", "text"],
          ].map(([k, l, t]) => (
            <label key={k} className="block">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{l}</span>
              <input
                required
                type={t}
                value={form[k as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                className="mt-1 w-full border hairline bg-background px-4 py-3 rounded-xl outline-none focus:border-[var(--gold)]"
              />
            </label>
          ))}
          <label className="block">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Notes (optional)</span>
            <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="mt-1 w-full border hairline bg-background px-4 py-3 rounded-xl outline-none focus:border-[var(--gold)]" />
          </label>
          <button disabled={busy || items.length === 0} type="submit" className="w-full px-6 py-4 pill bg-[var(--ink)] text-[var(--ivory)] text-sm hover:bg-gold-gradient hover:text-[var(--ink)] disabled:opacity-60">
            {busy ? "Placing order…" : "Place order & message on WhatsApp"}
          </button>
          <p className="text-xs text-muted-foreground text-center">Payment on delivery or via bank transfer / mobile money — confirmed on WhatsApp.</p>
        </form>

        <aside className="border hairline rounded-3xl bg-cream-soft p-6 h-fit">
          <div className="font-display text-xl">Your order</div>
          {items.length === 0 ? (
            <div className="mt-6 text-sm text-muted-foreground">Your cart is empty. <Link to="/shop" className="text-gold underline">Browse the collection</Link></div>
          ) : (
            <>
              <div className="mt-4 space-y-3">
                {items.map((i) => (
                  <div key={i.id} className="flex gap-3 items-center">
                    <img src={i.image_url || fallbackImg} alt="" className="w-12 h-12 rounded-lg object-cover bg-secondary" />
                    <div className="flex-1 min-w-0 text-sm">
                      <div className="truncate">{i.name}</div>
                      <div className="text-xs text-muted-foreground">× {i.quantity}</div>
                    </div>
                    <div className="text-sm">{money(i.price_cents * i.quantity)}</div>
                  </div>
                ))}
              </div>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd>{money(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd>Free</dd>
                </div>
              </dl>
              <div className="mt-5 pt-5 border-t hairline flex justify-between items-center">
                <span className="font-display text-lg">Total</span>
                <span className="font-display text-2xl">{money(subtotal)}</span>
              </div>
              <button
                type="button"
                onClick={() => orderCartOnWhatsApp(items, subtotal)}
                className="mt-6 w-full px-6 py-4 rounded-full border border-[#25D366] text-[#128C42] text-sm font-medium hover:bg-[#25D366]/10 transition-colors"
              >
                Order on WhatsApp
              </button>
              <p className="mt-2 text-[11px] text-muted-foreground text-center">Prefer chatting? Send this cart to us directly.</p>
            </>
          )}
        </aside>
      </section>
    </PageShell>
  );
}