import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Package, ShieldCheck, Trash2 } from "lucide-react";
import { fallbackProduct as fallbackImg } from "@/lib/images";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({ meta: [{ title: "Account — B Trader Elite Billiards" }] }),
  component: Account,
});

type Order = {
  id: string;
  created_at: string;
  status: string;
  subtotal_cents: number;
  currency: string;
  order_items: { name: string; quantity: number; unit_price_cents: number }[];
};

function Account() {
  const [tab, setTab] = useState<"orders" | "wishlist">("orders");
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      setEmail(data.user.email ?? "");
      const { data: rows } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id).eq("role", "admin");
      setIsAdmin((rows?.length ?? 0) > 0);
    });
    if (window.location.hash === "#wishlist") setTab("wishlist");
  }, []);

  const { data: orders = [], refetch: refetchOrders } = useQuery<Order[]>({
    queryKey: ["orders", "mine"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, created_at, status, subtotal_cents, currency, order_items(name, quantity, unit_price_cents)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Order[];
    },
  });

  const { data: wish = [], refetch: refetchWish } = useQuery({
    queryKey: ["wishlist", "mine"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wishlist")
        .select("id, product:products(id, slug, name, price_cents, image_url)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as { id: string; product: { id: string; slug: string; name: string; price_cents: number; image_url: string | null } | null }[];
    },
  });

  async function removeWish(id: string) {
    await supabase.from("wishlist").delete().eq("id", id);
    refetchWish();
  }

  return (
    <PageShell>
      <PageHeader eyebrow="Account" title="Welcome back" sub={email} />
      <section className="container-lux pb-24">
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setTab("orders")} className={`px-5 py-3 pill text-xs uppercase tracking-widest flex items-center gap-2 ${tab === "orders" ? "bg-[var(--ink)] text-[var(--ivory)]" : "border hairline hover:bg-secondary"}`}>
            <Package className="w-3 h-3" /> Orders
          </button>
          <button onClick={() => setTab("wishlist")} className={`px-5 py-3 pill text-xs uppercase tracking-widest flex items-center gap-2 ${tab === "wishlist" ? "bg-[var(--ink)] text-[var(--ivory)]" : "border hairline hover:bg-secondary"}`}>
            <Heart className="w-3 h-3" /> Wishlist
          </button>
          {isAdmin && (
            <Link to="/admin" className="ml-auto px-5 py-3 pill text-xs uppercase tracking-widest border border-[var(--gold)] text-gold hover:bg-gold-gradient hover:text-[var(--ink)] flex items-center gap-2">
              <ShieldCheck className="w-3 h-3" /> Admin
            </Link>
          )}
        </div>

        <div className="mt-8">
          {tab === "orders" ? (
            orders.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">No orders yet. <Link to="/shop" className="text-gold underline">Start shopping</Link></div>
            ) : (
              <div className="grid gap-4">
                {orders.map((o) => (
                  <div key={o.id} className="border hairline rounded-2xl bg-card p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-display text-lg">Order #{o.id.slice(0, 8)}</div>
                        <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] uppercase tracking-widest px-3 py-1 pill bg-secondary inline-block">{o.status}</div>
                        <div className="mt-1 font-display text-2xl">${(o.subtotal_cents / 100).toLocaleString()}</div>
                      </div>
                    </div>
                    <ul className="mt-4 text-sm text-muted-foreground space-y-1">
                      {o.order_items.map((it, i) => (
                        <li key={i}>{it.name} × {it.quantity} — ${((it.unit_price_cents * it.quantity) / 100).toLocaleString()}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )
          ) : wish.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">Your wishlist is empty.</div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {wish.map((w) => w.product && (
                <div key={w.id} className="flex items-center gap-4 border hairline rounded-2xl bg-card p-3">
                  <img src={w.product.image_url || fallbackImg} alt="" className="w-16 h-16 rounded-xl object-cover bg-secondary" />
                  <div className="flex-1 min-w-0">
                    <Link to="/shop/$slug" params={{ slug: w.product.slug }} className="font-display truncate hover:text-gold">{w.product.name}</Link>
                    <div className="text-xs text-muted-foreground">${(w.product.price_cents / 100).toLocaleString()}</div>
                  </div>
                  <button onClick={() => removeWish(w.id)} className="w-9 h-9 grid place-items-center pill hover:bg-destructive hover:text-[var(--ivory)]"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}