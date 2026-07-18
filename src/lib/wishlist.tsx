import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const LOCAL_KEY = "btrader.wishlist.v1";

type WishItem = { id: string; slug: string; name: string };

function readLocal(): string[] {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]"); } catch { return []; }
}
function writeLocal(ids: string[]) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(ids)); } catch { /* ignore */ }
}

export function useWishlist() {
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    const uid = data.user?.id ?? null;
    setUserId(uid);
    if (uid) {
      const { data: rows } = await supabase.from("wishlist").select("product_id").eq("user_id", uid);
      setIds(new Set((rows ?? []).map((r) => r.product_id as string)));
    } else {
      setIds(new Set(readLocal()));
    }
  }, []);

  useEffect(() => {
    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => sub.subscription.unsubscribe();
  }, [load]);

  const toggle = useCallback(async (item: WishItem) => {
    const has = ids.has(item.id);
    if (userId) {
      if (has) {
        await supabase.from("wishlist").delete().eq("user_id", userId).eq("product_id", item.id);
      } else {
        await supabase.from("wishlist").insert({ user_id: userId, product_id: item.id });
      }
    } else {
      const next = new Set(ids);
      has ? next.delete(item.id) : next.add(item.id);
      writeLocal([...next]);
    }
    setIds((cur) => {
      const next = new Set(cur);
      has ? next.delete(item.id) : next.add(item.id);
      return next;
    });
    toast.success(has ? "Removed from wishlist" : "Added to wishlist");
  }, [ids, userId]);

  return { ids, toggle, reload: load };
}