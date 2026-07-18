import { Link } from "@tanstack/react-router";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { fallbackProduct as fallbackImg } from "@/lib/images";

export function CartDrawer() {
  const { items, open, setOpen, setQty, remove, subtotal, count } = useCart();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <aside className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-background border-l hairline flex flex-col">
        <div className="flex items-center justify-between p-5 border-b hairline">
          <div className="flex items-center gap-2 font-display text-lg">
            <ShoppingBag className="w-5 h-5" /> Your Cart ({count})
          </div>
          <button onClick={() => setOpen(false)} className="w-9 h-9 grid place-items-center pill hover:bg-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 && (
            <div className="text-center text-muted-foreground py-16">
              Your cart is empty.
              <div className="mt-4">
                <Link to="/shop" onClick={() => setOpen(false)} className="text-gold underline text-sm">Browse the collection →</Link>
              </div>
            </div>
          )}
          {items.map((i) => (
            <div key={i.id} className="flex gap-3 border hairline rounded-2xl p-3">
              <img src={i.image_url || fallbackImg} alt={i.name} className="w-20 h-20 object-cover rounded-xl bg-secondary" />
              <div className="flex-1 min-w-0">
                <div className="font-display truncate">{i.name}</div>
                <div className="text-xs text-muted-foreground">${(i.price_cents / 100).toLocaleString()}</div>
                <div className="mt-2 flex items-center gap-2">
                  <button onClick={() => setQty(i.id, i.quantity - 1)} className="w-7 h-7 grid place-items-center pill border hairline"><Minus className="w-3 h-3" /></button>
                  <span className="text-sm w-6 text-center">{i.quantity}</span>
                  <button onClick={() => setQty(i.id, i.quantity + 1)} className="w-7 h-7 grid place-items-center pill border hairline"><Plus className="w-3 h-3" /></button>
                  <button onClick={() => remove(i.id)} className="ml-auto w-7 h-7 grid place-items-center pill hover:bg-destructive hover:text-[var(--ivory)]"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="border-t hairline p-5 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground uppercase tracking-widest text-xs">Subtotal</span>
              <span className="font-display text-2xl">${(subtotal / 100).toLocaleString()}</span>
            </div>
            <Link to="/checkout" onClick={() => setOpen(false)} className="block text-center px-6 py-4 pill bg-[var(--ink)] text-[var(--ivory)] text-sm hover:bg-gold-gradient hover:text-[var(--ink)] transition-all">
              Checkout
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}