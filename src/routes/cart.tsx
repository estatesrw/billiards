import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/money";
import { fallbackProduct as fallbackImg } from "@/lib/images";
import { orderCartOnWhatsApp } from "@/lib/wa-order";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — B Trader Elite Billiards" },
      { name: "description", content: "Review your billiards order and check out or send it straight to us on WhatsApp." },
      { property: "og:title", content: "Your Cart — B Trader Elite Billiards" },
      { property: "og:description", content: "Review your billiards order and check out or send it to us on WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove, clear, subtotal } = useCart();

  return (
    <PageShell>
      <section className="container-lux py-16 md:py-20">
        <h1 className="font-display text-4xl md:text-6xl">Your cart</h1>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_400px] items-start">
          <div>
            {items.length === 0 ? (
              <div className="border hairline rounded-2xl p-10 text-center text-muted-foreground">
                Your cart is empty. <Link to="/shop" className="text-gold underline">Browse the collection</Link>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {items.map((i) => (
                    <div key={i.id} className="border hairline rounded-2xl p-4 flex gap-4 items-start bg-card">
                      <img src={i.image_url || fallbackImg} alt={i.name} className="w-20 h-20 md:w-28 md:h-28 rounded-xl object-cover bg-secondary" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">B Trader Elite</div>
                        <Link to="/shop/$slug" params={{ slug: i.slug }} className="mt-1 block font-display text-lg md:text-xl truncate hover:text-gold">
                          {i.name}
                        </Link>
                        <div className="mt-1 text-sm text-muted-foreground">{money(i.price_cents)}</div>
                        <div className="mt-3 flex items-center gap-3">
                          <div className="inline-flex items-center gap-3 border hairline rounded-full px-3 py-1.5">
                            <button onClick={() => setQty(i.id, i.quantity - 1)} aria-label="Decrease" className="text-muted-foreground hover:text-foreground"><Minus className="w-3.5 h-3.5" /></button>
                            <span className="text-sm w-5 text-center">{i.quantity}</span>
                            <button onClick={() => setQty(i.id, i.quantity + 1)} aria-label="Increase" className="text-muted-foreground hover:text-foreground"><Plus className="w-3.5 h-3.5" /></button>
                          </div>
                          <button onClick={() => remove(i.id)} aria-label="Remove item" className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <div className="font-display text-lg md:text-2xl whitespace-nowrap">{money(i.price_cents * i.quantity)}</div>
                    </div>
                  ))}
                </div>
                <button onClick={clear} className="mt-5 text-sm text-muted-foreground hover:text-destructive">Clear cart</button>
              </>
            )}
          </div>

          <aside className="border hairline rounded-2xl bg-cream-soft p-6 md:p-7">
            <div className="font-display text-2xl">Order summary</div>
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
            <Link
              to="/checkout"
              className="mt-6 block text-center px-6 py-4 rounded-full bg-gold-gradient text-[var(--ink)] uppercase text-xs tracking-[0.3em] font-medium hover:opacity-90 transition-opacity"
            >
              Checkout
            </Link>
            <button
              onClick={() => orderCartOnWhatsApp(items, subtotal)}
              disabled={items.length === 0}
              className="mt-3 w-full px-6 py-4 rounded-full border border-[#25D366] text-[#128C42] text-sm font-medium hover:bg-[#25D366]/10 transition-colors disabled:opacity-50"
            >
              Order on WhatsApp
            </button>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
