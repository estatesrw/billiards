import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price_cents: number;
  image_url: string | null;
  quantity: number;
};

type Ctx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (i: Omit<CartItem, "quantity">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (b: boolean) => void;
};

const CartCtx = createContext<Ctx | null>(null);
const KEY = "btrader.cart.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* ignore */ }
  }, [items]);

  const value = useMemo<Ctx>(() => ({
    items,
    count: items.reduce((s, i) => s + i.quantity, 0),
    subtotal: items.reduce((s, i) => s + i.quantity * i.price_cents, 0),
    add: (i, qty = 1) => setItems((cur) => {
      const ex = cur.find((c) => c.id === i.id);
      if (ex) return cur.map((c) => c.id === i.id ? { ...c, quantity: c.quantity + qty } : c);
      return [...cur, { ...i, quantity: qty }];
    }),
    remove: (id) => setItems((cur) => cur.filter((c) => c.id !== id)),
    setQty: (id, qty) => setItems((cur) => qty <= 0 ? cur.filter((c) => c.id !== id) : cur.map((c) => c.id === id ? { ...c, quantity: qty } : c)),
    clear: () => setItems([]),
    open,
    setOpen,
  }), [items, open]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart must be inside CartProvider");
  return c;
}