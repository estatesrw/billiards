import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHeader } from "@/components/PageShell";
import { toast } from "sonner";
import { Trash2, Plus, Save, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — B Trader Elite Billiards" }] }),
  component: Admin,
});

type Category = { id: string; name: string; slug: string };
type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category_id: string | null;
  price_cents: number;
  currency: string;
  image_url: string | null;
  stock: number;
  rating: number;
  badge: string | null;
  is_published: boolean;
};

const EMPTY: Omit<Product, "id"> = {
  slug: "",
  name: "",
  description: "",
  category_id: null,
  price_cents: 0,
  currency: "USD",
  image_url: "",
  stock: 0,
  rating: 5,
  badge: "",
  is_published: true,
};

function Admin() {
  const qc = useQueryClient();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [draft, setDraft] = useState<Omit<Product, "id"> | Product>(EMPTY);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return setIsAdmin(false);
      const { data: rows } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin");
      setIsAdmin((rows?.length ?? 0) > 0);
    });
  }, []);

  const { data: cats = [] } = useQuery<Category[]>({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("id, name, slug").order("sort_order");
      if (error) throw error;
      return data as Category[];
    },
  });

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Product[];
    },
  });

  const upsert = useMutation({
    mutationFn: async (p: Omit<Product, "id"> | Product) => {
      const payload = { ...p, badge: p.badge || null, description: p.description || null, image_url: p.image_url || null };
      if ("id" in p && p.id) {
        const { error } = await supabase.from("products").update(payload).eq("id", p.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Saved.");
      setDraft(EMPTY);
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted.");
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function claimAdmin() {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { count } = await supabase
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if ((count ?? 0) > 0) {
      toast.error("An admin already exists. Ask them to promote you.");
      return;
    }
    const { error } = await supabase.from("user_roles").insert({ user_id: u.user.id, role: "admin" });
    if (error) toast.error(error.message);
    else {
      toast.success("You are now the admin.");
      setIsAdmin(true);
    }
  }

  if (isAdmin === null) {
    return <PageShell><div className="container-lux py-32 text-center text-muted-foreground">Checking access…</div></PageShell>;
  }
  if (!isAdmin) {
    return (
      <PageShell>
        <PageHeader eyebrow="Admin" title="Restricted area" sub="You need admin privileges to manage products." />
        <section className="container-lux pb-24 text-center">
          <button onClick={claimAdmin} className="inline-flex items-center gap-2 px-6 py-4 pill bg-[var(--ink)] text-[var(--ivory)] text-sm hover:bg-gold-gradient hover:text-[var(--ink)]">
            <ShieldCheck className="w-4 h-4" /> Claim admin (first user only)
          </button>
          <p className="mt-4 text-xs text-muted-foreground">Available only if no admin has been assigned yet.</p>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader eyebrow="Admin" title="Product manager" sub="Create, edit and remove shop items." />
      <section className="container-lux pb-24 grid gap-12 lg:grid-cols-[380px_1fr]">
        {/* Editor */}
        <div className="border hairline rounded-3xl bg-card p-6">
          <div className="font-display text-xl">
            {"id" in draft && draft.id ? "Edit product" : "New product"}
          </div>
          <form
            className="mt-4 space-y-3"
            onSubmit={(e) => { e.preventDefault(); upsert.mutate(draft); }}
          >
            <Field label="Name">
              <input required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={inp} />
            </Field>
            <Field label="Slug">
              <input required value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} className={inp} />
            </Field>
            <Field label="Category">
              <select value={draft.category_id ?? ""} onChange={(e) => setDraft({ ...draft, category_id: e.target.value || null })} className={inp}>
                <option value="">— none —</option>
                {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price (USD)">
                <input type="number" min={0} step="0.01" value={draft.price_cents / 100} onChange={(e) => setDraft({ ...draft, price_cents: Math.round(Number(e.target.value) * 100) })} className={inp} />
              </Field>
              <Field label="Stock">
                <input type="number" min={0} value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: Number(e.target.value) })} className={inp} />
              </Field>
            </div>
            <Field label="Image URL">
              <input value={draft.image_url ?? ""} onChange={(e) => setDraft({ ...draft, image_url: e.target.value })} className={inp} placeholder="https://..." />
            </Field>
            <Field label="Badge (optional)">
              <input value={draft.badge ?? ""} onChange={(e) => setDraft({ ...draft, badge: e.target.value })} className={inp} placeholder="New, Pro..." />
            </Field>
            <Field label="Description">
              <textarea rows={3} value={draft.description ?? ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className={inp} />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={draft.is_published} onChange={(e) => setDraft({ ...draft, is_published: e.target.checked })} />
              Published
            </label>
            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={upsert.isPending} className="inline-flex items-center gap-2 px-5 py-3 pill bg-[var(--ink)] text-[var(--ivory)] text-xs uppercase tracking-widest hover:bg-gold-gradient hover:text-[var(--ink)] disabled:opacity-60">
                <Save className="w-4 h-4" /> {"id" in draft && draft.id ? "Update" : "Create"}
              </button>
              {"id" in draft && draft.id && (
                <button type="button" onClick={() => setDraft(EMPTY)} className="px-5 py-3 pill border hairline text-xs uppercase tracking-widest hover:bg-secondary">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{products.length} products</div>
            <button onClick={() => setDraft(EMPTY)} className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold hover:underline">
              <Plus className="w-3 h-3" /> New
            </button>
          </div>
          {isLoading ? (
            <div className="text-muted-foreground">Loading...</div>
          ) : (
            <div className="grid gap-3">
              {products.map((p) => (
                <div key={p.id} className="flex items-center gap-4 border hairline rounded-2xl bg-card p-3">
                  <div className="w-16 h-16 rounded-xl bg-secondary overflow-hidden shrink-0">
                    {p.image_url && <img src={p.image_url} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-lg truncate">{p.name}</div>
                    <div className="text-xs text-muted-foreground">
                      ${(p.price_cents / 100).toLocaleString()} · stock {p.stock} · {p.is_published ? "live" : "draft"}
                    </div>
                  </div>
                  <button onClick={() => setDraft(p)} className="px-3 py-2 pill border hairline text-xs hover:bg-secondary">Edit</button>
                  <button onClick={() => { if (confirm("Delete this product?")) del.mutate(p.id); }} className="w-9 h-9 grid place-items-center pill border hairline hover:bg-destructive hover:text-[var(--ivory)] hover:border-transparent">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

const inp = "w-full border hairline bg-background px-3 py-2 rounded-xl outline-none text-sm focus:border-[var(--gold)]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}