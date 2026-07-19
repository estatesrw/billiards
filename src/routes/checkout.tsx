import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { useCart } from "@/lib/cart";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site";
import { toast } from "sonner";
import { fallbackProduct as fallbackImg } from "@/lib/images";

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
      const { data: u } = await supabase.auth.getUser();
      const { data: order, error } = await supabase.from("orders").insert({
        ...form,
        user_id: u.user?.id ?? null,
        subtotal_cents: subtotal,
        currency: "USD",
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

      const lines = items.map((i) => `• ${i.name} × ${i.quantity} — $${((i.price_cents * i.quantity) / 100).toLocaleString()}`).join("\n");
      const msg = `New order request #${order.id.slice(0, 8)}\n\nName: ${form.full_name}\nPhone: ${form.phone}\nAddress: ${form.address}, ${form.city}\n\n${lines}\n\nSubtotal: $${(subtotal / 100).toLocaleString()}\n\nNotes: ${form.notes || "—"}`;
      const wa = SITE.waLink(msg);
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

        <aside className="border hairline rounded-3xl bg-card p-6 h-fit">
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
                    <div className="text-sm">${((i.price_cents * i.quantity) / 100).toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t hairline flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Subtotal</span>
                <span className="font-display text-2xl">${(subtotal / 100).toLocaleString()}</span>
              </div>
            </>
          )}
        </aside>
      </section>
    </PageShell>
  );
}