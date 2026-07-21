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
  is_featured: boolean;
};

type Service = {
  id: string; title: string; description: string | null;
  price_cents: number; currency: string; image_url: string | null;
  icon: string | null; sort_order: number; is_published: boolean;
};
type GalleryItem = {
  id: string; image_url: string; caption: string | null;
  span: string | null; sort_order: number; is_published: boolean;
};
type Order = {
  id: string; full_name: string; phone: string; city: string | null;
  subtotal_cents: number; status: string; created_at: string;
};

type SiteSettings = {
  id: string;
  whatsapp_number: string;
  whatsapp_display: string;
  order_message_template: string;
  promo_text: string;
  promo_enabled: boolean;
};
type Testimonial = {
  id: string; quote: string; author_name: string; author_role: string | null;
  sort_order: number; is_published: boolean;
};
type Faq = {
  id: string; category: string; question: string; answer: string;
  sort_order: number; is_published: boolean;
};
type HomeProject = {
  id: string; name: string; category: string | null; image_url: string;
  sort_order: number; is_published: boolean;
};
type HeroSlide = {
  id: string; image_url: string; label: string; link_url: string | null;
  sort_order: number; is_published: boolean;
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
  is_featured: false,
};

const EMPTY_TESTI: Omit<Testimonial, "id"> = { quote: "", author_name: "", author_role: "", sort_order: 0, is_published: true };
const EMPTY_FAQ: Omit<Faq, "id"> = { category: "General", question: "", answer: "", sort_order: 0, is_published: true };
const EMPTY_HPROJ: Omit<HomeProject, "id"> = { name: "", category: "", image_url: "", sort_order: 0, is_published: true };
const EMPTY_HERO: Omit<HeroSlide, "id"> = { image_url: "", label: "", link_url: "/shop", sort_order: 0, is_published: true };

const EMPTY_SERVICE: Omit<Service, "id"> = {
  title: "", description: "", price_cents: 0, currency: "USD",
  image_url: "", icon: "Sparkles", sort_order: 0, is_published: true,
};
const EMPTY_GALLERY: Omit<GalleryItem, "id"> = {
  image_url: "", caption: "", span: "", sort_order: 0, is_published: true,
};

type Tab = "products" | "services" | "gallery" | "orders" | "home" | "hero" | "settings";

function Admin() {
  const qc = useQueryClient();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("products");
  const [draft, setDraft] = useState<Omit<Product, "id"> | Product>(EMPTY);
  const [svcDraft, setSvcDraft] = useState<Omit<Service, "id"> | Service>(EMPTY_SERVICE);
  const [galDraft, setGalDraft] = useState<Omit<GalleryItem, "id"> | GalleryItem>(EMPTY_GALLERY);
  const [testiDraft, setTestiDraft] = useState<Omit<Testimonial, "id"> | Testimonial>(EMPTY_TESTI);
  const [faqDraft, setFaqDraft] = useState<Omit<Faq, "id"> | Faq>(EMPTY_FAQ);
  const [hprojDraft, setHprojDraft] = useState<Omit<HomeProject, "id"> | HomeProject>(EMPTY_HPROJ);
  const [heroDraft, setHeroDraft] = useState<Omit<HeroSlide, "id"> | HeroSlide>(EMPTY_HERO);
  const [settingsDraft, setSettingsDraft] = useState<SiteSettings | null>(null);

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

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["admin", "services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("sort_order");
      if (error) throw error;
      return data as Service[];
    },
  });

  const { data: gallery = [] } = useQuery<GalleryItem[]>({
    queryKey: ["admin", "gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery_items").select("*").order("sort_order");
      if (error) throw error;
      return data as GalleryItem[];
    },
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, full_name, phone, city, subtotal_cents, status, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Order[];
    },
  });

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ["admin", "testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase.from("testimonials").select("*").order("sort_order");
      if (error) throw error;
      return data as Testimonial[];
    },
  });
  const { data: faqs = [] } = useQuery<Faq[]>({
    queryKey: ["admin", "faqs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("faqs").select("*").order("sort_order");
      if (error) throw error;
      return data as Faq[];
    },
  });
  const { data: hprojects = [] } = useQuery<HomeProject[]>({
    queryKey: ["admin", "home_projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("home_projects").select("*").order("sort_order");
      if (error) throw error;
      return data as HomeProject[];
    },
  });
  const { data: heroSlides = [] } = useQuery<HeroSlide[]>({
    queryKey: ["admin", "hero_slides"],
    queryFn: async () => {
      const { data, error } = await supabase.from("hero_slides").select("*").order("sort_order");
      if (error) throw error;
      return data as HeroSlide[];
    },
  });
  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ["admin", "site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").eq("id", "main").maybeSingle();
      if (error) throw error;
      return data as SiteSettings;
    },
  });

  useEffect(() => { if (settings && !settingsDraft) setSettingsDraft(settings); }, [settings, settingsDraft]);

  const invalidate = (key: string) => {
    qc.invalidateQueries({ queryKey: ["admin", key] });
    qc.invalidateQueries({ queryKey: ["home", key] });
  };
  const upsertTesti = useMutation({
    mutationFn: async (t: Omit<Testimonial, "id"> | Testimonial) => {
      const payload = { ...t, author_role: t.author_role || null };
      if ("id" in t && t.id) { const { error } = await supabase.from("testimonials").update(payload).eq("id", t.id); if (error) throw error; }
      else { const { error } = await supabase.from("testimonials").insert(payload); if (error) throw error; }
    },
    onSuccess: () => { toast.success("Saved."); setTestiDraft(EMPTY_TESTI); invalidate("testimonials"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const delTesti = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("testimonials").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Deleted."); invalidate("testimonials"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const upsertFaq = useMutation({
    mutationFn: async (f: Omit<Faq, "id"> | Faq) => {
      if ("id" in f && f.id) { const { error } = await supabase.from("faqs").update(f).eq("id", f.id); if (error) throw error; }
      else { const { error } = await supabase.from("faqs").insert(f); if (error) throw error; }
    },
    onSuccess: () => { toast.success("Saved."); setFaqDraft(EMPTY_FAQ); invalidate("faqs"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const delFaq = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("faqs").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Deleted."); invalidate("faqs"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const upsertHproj = useMutation({
    mutationFn: async (p: Omit<HomeProject, "id"> | HomeProject) => {
      const payload = { ...p, category: p.category || null };
      if ("id" in p && p.id) { const { error } = await supabase.from("home_projects").update(payload).eq("id", p.id); if (error) throw error; }
      else { const { error } = await supabase.from("home_projects").insert(payload); if (error) throw error; }
    },
    onSuccess: () => { toast.success("Saved."); setHprojDraft(EMPTY_HPROJ); invalidate("projects"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const delHproj = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("home_projects").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Deleted."); invalidate("projects"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const upsertHero = useMutation({
    mutationFn: async (h: Omit<HeroSlide, "id"> | HeroSlide) => {
      const payload = { ...h, link_url: h.link_url || null };
      if ("id" in h && h.id) { const { error } = await supabase.from("hero_slides").update(payload).eq("id", h.id); if (error) throw error; }
      else { const { error } = await supabase.from("hero_slides").insert(payload); if (error) throw error; }
    },
    onSuccess: () => { toast.success("Saved."); setHeroDraft(EMPTY_HERO); invalidate("hero_slides"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const delHero = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("hero_slides").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Deleted."); invalidate("hero_slides"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const saveSettings = useMutation({
    mutationFn: async (s: SiteSettings) => {
      const { error } = await supabase.from("site_settings").update({
        whatsapp_number: s.whatsapp_number,
        whatsapp_display: s.whatsapp_display,
        order_message_template: s.order_message_template,
        promo_text: s.promo_text,
        promo_enabled: s.promo_enabled,
      }).eq("id", "main");
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Settings saved."); qc.invalidateQueries({ queryKey: ["admin", "site_settings"] }); qc.invalidateQueries({ queryKey: ["site_settings"] }); },
    onError: (e: Error) => toast.error(e.message),
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

  const upsertSvc = useMutation({
    mutationFn: async (s: Omit<Service, "id"> | Service) => {
      const payload = { ...s, description: s.description || null, image_url: s.image_url || null, icon: s.icon || null };
      if ("id" in s && s.id) {
        const { error } = await supabase.from("services").update(payload).eq("id", s.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("services").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { toast.success("Service saved."); setSvcDraft(EMPTY_SERVICE); qc.invalidateQueries({ queryKey: ["admin", "services"] }); qc.invalidateQueries({ queryKey: ["services"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const delSvc = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("services").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Deleted."); qc.invalidateQueries({ queryKey: ["admin", "services"] }); qc.invalidateQueries({ queryKey: ["services"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const upsertGal = useMutation({
    mutationFn: async (g: Omit<GalleryItem, "id"> | GalleryItem) => {
      const payload = { ...g, caption: g.caption || null, span: g.span || null };
      if ("id" in g && g.id) {
        const { error } = await supabase.from("gallery_items").update(payload).eq("id", g.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("gallery_items").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { toast.success("Gallery item saved."); setGalDraft(EMPTY_GALLERY); qc.invalidateQueries({ queryKey: ["admin", "gallery"] }); qc.invalidateQueries({ queryKey: ["gallery"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const delGal = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("gallery_items").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Deleted."); qc.invalidateQueries({ queryKey: ["admin", "gallery"] }); qc.invalidateQueries({ queryKey: ["gallery"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const setOrderStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Order updated."); qc.invalidateQueries({ queryKey: ["admin", "orders"] }); },
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
      <PageHeader eyebrow="Admin" title="Content manager" sub="Manage products, services, gallery and orders." />
      <section className="container-lux pb-6">
        <div className="flex flex-wrap gap-2">
          {(["products","services","gallery","hero","home","orders","settings"] as Tab[]).map((k) => (
            <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 pill text-xs uppercase tracking-widest ${tab===k?"bg-[var(--ink)] text-[var(--ivory)]":"border hairline hover:bg-secondary"}`}>{k}</button>
          ))}
        </div>
      </section>

      {tab === "products" && (
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
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={draft.is_featured} onChange={(e) => setDraft({ ...draft, is_featured: e.target.checked })} />
              Featured on home
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
      )}

      {tab === "services" && (
        <section className="container-lux pb-24 grid gap-12 lg:grid-cols-[380px_1fr]">
          <div className="border hairline rounded-3xl bg-card p-6">
            <div className="font-display text-xl">{"id" in svcDraft && svcDraft.id ? "Edit service" : "New service"}</div>
            <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); upsertSvc.mutate(svcDraft); }}>
              <Field label="Title"><input required value={svcDraft.title} onChange={(e) => setSvcDraft({ ...svcDraft, title: e.target.value })} className={inp} /></Field>
              <Field label="Description"><textarea rows={3} value={svcDraft.description ?? ""} onChange={(e) => setSvcDraft({ ...svcDraft, description: e.target.value })} className={inp} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Price (USD)"><input type="number" min={0} step="0.01" value={svcDraft.price_cents / 100} onChange={(e) => setSvcDraft({ ...svcDraft, price_cents: Math.round(Number(e.target.value) * 100) })} className={inp} /></Field>
                <Field label="Sort order"><input type="number" value={svcDraft.sort_order} onChange={(e) => setSvcDraft({ ...svcDraft, sort_order: Number(e.target.value) })} className={inp} /></Field>
              </div>
              <Field label="Image URL"><input value={svcDraft.image_url ?? ""} onChange={(e) => setSvcDraft({ ...svcDraft, image_url: e.target.value })} className={inp} placeholder="https://..." /></Field>
              <Field label="Icon (Wrench, Truck, Scissors, Sparkles, Hammer, Shield, Trophy, Star)"><input value={svcDraft.icon ?? ""} onChange={(e) => setSvcDraft({ ...svcDraft, icon: e.target.value })} className={inp} /></Field>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={svcDraft.is_published} onChange={(e) => setSvcDraft({ ...svcDraft, is_published: e.target.checked })} /> Published</label>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={upsertSvc.isPending} className="inline-flex items-center gap-2 px-5 py-3 pill bg-[var(--ink)] text-[var(--ivory)] text-xs uppercase tracking-widest hover:bg-gold-gradient hover:text-[var(--ink)] disabled:opacity-60"><Save className="w-4 h-4" /> {"id" in svcDraft && svcDraft.id ? "Update" : "Create"}</button>
                {"id" in svcDraft && svcDraft.id && <button type="button" onClick={() => setSvcDraft(EMPTY_SERVICE)} className="px-5 py-3 pill border hairline text-xs uppercase tracking-widest hover:bg-secondary">Cancel</button>}
              </div>
            </form>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{services.length} services</div>
              <button onClick={() => setSvcDraft(EMPTY_SERVICE)} className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold hover:underline"><Plus className="w-3 h-3" /> New</button>
            </div>
            <div className="grid gap-3">
              {services.map((s) => (
                <div key={s.id} className="flex items-center gap-4 border hairline rounded-2xl bg-card p-3">
                  <div className="w-16 h-16 rounded-xl bg-secondary overflow-hidden shrink-0">
                    {s.image_url && <img src={s.image_url} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-lg truncate">{s.title}</div>
                    <div className="text-xs text-muted-foreground">${(s.price_cents / 100).toLocaleString()} · order {s.sort_order} · {s.is_published ? "live" : "hidden"}</div>
                  </div>
                  <button onClick={() => setSvcDraft(s)} className="px-3 py-2 pill border hairline text-xs hover:bg-secondary">Edit</button>
                  <button onClick={() => { if (confirm("Delete this service?")) delSvc.mutate(s.id); }} className="w-9 h-9 grid place-items-center pill border hairline hover:bg-destructive hover:text-[var(--ivory)] hover:border-transparent"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {tab === "gallery" && (
        <section className="container-lux pb-24 grid gap-12 lg:grid-cols-[380px_1fr]">
          <div className="border hairline rounded-3xl bg-card p-6">
            <div className="font-display text-xl">{"id" in galDraft && galDraft.id ? "Edit item" : "New gallery item"}</div>
            <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); upsertGal.mutate(galDraft); }}>
              <Field label="Image URL"><input required value={galDraft.image_url} onChange={(e) => setGalDraft({ ...galDraft, image_url: e.target.value })} className={inp} placeholder="https://..." /></Field>
              <Field label="Caption"><input value={galDraft.caption ?? ""} onChange={(e) => setGalDraft({ ...galDraft, caption: e.target.value })} className={inp} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Grid span"><input value={galDraft.span ?? ""} onChange={(e) => setGalDraft({ ...galDraft, span: e.target.value })} className={inp} placeholder="row-span-2 or col-span-2" /></Field>
                <Field label="Sort order"><input type="number" value={galDraft.sort_order} onChange={(e) => setGalDraft({ ...galDraft, sort_order: Number(e.target.value) })} className={inp} /></Field>
              </div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={galDraft.is_published} onChange={(e) => setGalDraft({ ...galDraft, is_published: e.target.checked })} /> Published</label>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={upsertGal.isPending} className="inline-flex items-center gap-2 px-5 py-3 pill bg-[var(--ink)] text-[var(--ivory)] text-xs uppercase tracking-widest hover:bg-gold-gradient hover:text-[var(--ink)] disabled:opacity-60"><Save className="w-4 h-4" /> {"id" in galDraft && galDraft.id ? "Update" : "Create"}</button>
                {"id" in galDraft && galDraft.id && <button type="button" onClick={() => setGalDraft(EMPTY_GALLERY)} className="px-5 py-3 pill border hairline text-xs uppercase tracking-widest hover:bg-secondary">Cancel</button>}
              </div>
            </form>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{gallery.length} items</div>
              <button onClick={() => setGalDraft(EMPTY_GALLERY)} className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold hover:underline"><Plus className="w-3 h-3" /> New</button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {gallery.map((g) => (
                <div key={g.id} className="border hairline rounded-2xl bg-card p-3">
                  <div className="aspect-video rounded-xl bg-secondary overflow-hidden">
                    {g.image_url && <img src={g.image_url} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="mt-2 text-sm truncate">{g.caption || "(no caption)"}</div>
                  <div className="text-xs text-muted-foreground">order {g.sort_order} · {g.is_published ? "live" : "hidden"}</div>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => setGalDraft(g)} className="flex-1 px-3 py-2 pill border hairline text-xs hover:bg-secondary">Edit</button>
                    <button onClick={() => { if (confirm("Delete this item?")) delGal.mutate(g.id); }} className="w-9 h-9 grid place-items-center pill border hairline hover:bg-destructive hover:text-[var(--ivory)] hover:border-transparent"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {tab === "orders" && (
        <section className="container-lux pb-24">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">{orders.length} orders</div>
          <div className="grid gap-3">
            {orders.map((o) => (
              <div key={o.id} className="flex flex-wrap items-center gap-4 border hairline rounded-2xl bg-card p-4">
                <div className="flex-1 min-w-[220px]">
                  <div className="font-display text-lg">{o.full_name || "—"}</div>
                  <div className="text-xs text-muted-foreground">{o.phone} · {o.city} · {new Date(o.created_at).toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">#{o.id.slice(0, 8)}</div>
                </div>
                <div className="font-display text-xl">${(o.subtotal_cents / 100).toLocaleString()}</div>
                <select value={o.status} onChange={(e) => setOrderStatus.mutate({ id: o.id, status: e.target.value })} className={inp + " w-auto"}>
                  {["pending","confirmed","paid","shipped","delivered","cancelled"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            ))}
            {orders.length === 0 && <div className="text-muted-foreground">No orders yet.</div>}
          </div>
        </section>
      )}

      {tab === "home" && (
        <section className="container-lux pb-24 space-y-16">
          {/* Testimonials */}
          <div className="grid gap-12 lg:grid-cols-[380px_1fr]">
            <div className="border hairline rounded-3xl bg-card p-6">
              <div className="font-display text-xl">{"id" in testiDraft && testiDraft.id ? "Edit testimonial" : "New testimonial"}</div>
              <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); upsertTesti.mutate(testiDraft); }}>
                <Field label="Quote"><textarea required rows={4} value={testiDraft.quote} onChange={(e) => setTestiDraft({ ...testiDraft, quote: e.target.value })} className={inp} /></Field>
                <Field label="Author name"><input required value={testiDraft.author_name} onChange={(e) => setTestiDraft({ ...testiDraft, author_name: e.target.value })} className={inp} /></Field>
                <Field label="Author role"><input value={testiDraft.author_role ?? ""} onChange={(e) => setTestiDraft({ ...testiDraft, author_role: e.target.value })} className={inp} /></Field>
                <Field label="Sort order"><input type="number" value={testiDraft.sort_order} onChange={(e) => setTestiDraft({ ...testiDraft, sort_order: Number(e.target.value) })} className={inp} /></Field>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={testiDraft.is_published} onChange={(e) => setTestiDraft({ ...testiDraft, is_published: e.target.checked })} /> Published</label>
                <div className="flex gap-2 pt-2">
                  <button type="submit" disabled={upsertTesti.isPending} className="inline-flex items-center gap-2 px-5 py-3 pill bg-[var(--ink)] text-[var(--ivory)] text-xs uppercase tracking-widest hover:bg-gold-gradient hover:text-[var(--ink)] disabled:opacity-60"><Save className="w-4 h-4" /> {"id" in testiDraft && testiDraft.id ? "Update" : "Create"}</button>
                  {"id" in testiDraft && testiDraft.id && <button type="button" onClick={() => setTestiDraft(EMPTY_TESTI)} className="px-5 py-3 pill border hairline text-xs uppercase tracking-widest hover:bg-secondary">Cancel</button>}
                </div>
              </form>
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Testimonials · {testimonials.length}</div>
                <button onClick={() => setTestiDraft(EMPTY_TESTI)} className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold hover:underline"><Plus className="w-3 h-3" /> New</button>
              </div>
              <div className="grid gap-3">
                {testimonials.map((t) => (
                  <div key={t.id} className="flex items-start gap-4 border hairline rounded-2xl bg-card p-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm line-clamp-2">"{t.quote}"</div>
                      <div className="text-xs text-muted-foreground">{t.author_name} · {t.author_role || "—"} · order {t.sort_order} · {t.is_published ? "live" : "hidden"}</div>
                    </div>
                    <button onClick={() => setTestiDraft(t)} className="px-3 py-2 pill border hairline text-xs hover:bg-secondary">Edit</button>
                    <button onClick={() => { if (confirm("Delete?")) delTesti.mutate(t.id); }} className="w-9 h-9 grid place-items-center pill border hairline hover:bg-destructive hover:text-[var(--ivory)] hover:border-transparent"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="grid gap-12 lg:grid-cols-[380px_1fr]">
            <div className="border hairline rounded-3xl bg-card p-6">
              <div className="font-display text-xl">{"id" in faqDraft && faqDraft.id ? "Edit FAQ" : "New FAQ"}</div>
              <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); upsertFaq.mutate(faqDraft); }}>
                <Field label="Category"><input required value={faqDraft.category} onChange={(e) => setFaqDraft({ ...faqDraft, category: e.target.value })} className={inp} placeholder="Prices, Delivery..." /></Field>
                <Field label="Question"><input required value={faqDraft.question} onChange={(e) => setFaqDraft({ ...faqDraft, question: e.target.value })} className={inp} /></Field>
                <Field label="Answer"><textarea required rows={4} value={faqDraft.answer} onChange={(e) => setFaqDraft({ ...faqDraft, answer: e.target.value })} className={inp} /></Field>
                <Field label="Sort order"><input type="number" value={faqDraft.sort_order} onChange={(e) => setFaqDraft({ ...faqDraft, sort_order: Number(e.target.value) })} className={inp} /></Field>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={faqDraft.is_published} onChange={(e) => setFaqDraft({ ...faqDraft, is_published: e.target.checked })} /> Published</label>
                <div className="flex gap-2 pt-2">
                  <button type="submit" disabled={upsertFaq.isPending} className="inline-flex items-center gap-2 px-5 py-3 pill bg-[var(--ink)] text-[var(--ivory)] text-xs uppercase tracking-widest hover:bg-gold-gradient hover:text-[var(--ink)] disabled:opacity-60"><Save className="w-4 h-4" /> {"id" in faqDraft && faqDraft.id ? "Update" : "Create"}</button>
                  {"id" in faqDraft && faqDraft.id && <button type="button" onClick={() => setFaqDraft(EMPTY_FAQ)} className="px-5 py-3 pill border hairline text-xs uppercase tracking-widest hover:bg-secondary">Cancel</button>}
                </div>
              </form>
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">FAQs · {faqs.length}</div>
                <button onClick={() => setFaqDraft(EMPTY_FAQ)} className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold hover:underline"><Plus className="w-3 h-3" /> New</button>
              </div>
              <div className="grid gap-3">
                {faqs.map((f) => (
                  <div key={f.id} className="flex items-start gap-4 border hairline rounded-2xl bg-card p-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] uppercase tracking-widest text-gold">{f.category}</div>
                      <div className="text-sm font-display truncate">{f.question}</div>
                      <div className="text-xs text-muted-foreground">order {f.sort_order} · {f.is_published ? "live" : "hidden"}</div>
                    </div>
                    <button onClick={() => setFaqDraft(f)} className="px-3 py-2 pill border hairline text-xs hover:bg-secondary">Edit</button>
                    <button onClick={() => { if (confirm("Delete?")) delFaq.mutate(f.id); }} className="w-9 h-9 grid place-items-center pill border hairline hover:bg-destructive hover:text-[var(--ivory)] hover:border-transparent"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Home projects */}
          <div className="grid gap-12 lg:grid-cols-[380px_1fr]">
            <div className="border hairline rounded-3xl bg-card p-6">
              <div className="font-display text-xl">{"id" in hprojDraft && hprojDraft.id ? "Edit featured project" : "New featured project"}</div>
              <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); upsertHproj.mutate(hprojDraft); }}>
                <Field label="Name"><input required value={hprojDraft.name} onChange={(e) => setHprojDraft({ ...hprojDraft, name: e.target.value })} className={inp} /></Field>
                <Field label="Category"><input value={hprojDraft.category ?? ""} onChange={(e) => setHprojDraft({ ...hprojDraft, category: e.target.value })} className={inp} placeholder="Hotel, Bar, Club..." /></Field>
                <Field label="Image URL"><input required value={hprojDraft.image_url} onChange={(e) => setHprojDraft({ ...hprojDraft, image_url: e.target.value })} className={inp} placeholder="https://..." /></Field>
                <Field label="Sort order"><input type="number" value={hprojDraft.sort_order} onChange={(e) => setHprojDraft({ ...hprojDraft, sort_order: Number(e.target.value) })} className={inp} /></Field>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hprojDraft.is_published} onChange={(e) => setHprojDraft({ ...hprojDraft, is_published: e.target.checked })} /> Published</label>
                <div className="flex gap-2 pt-2">
                  <button type="submit" disabled={upsertHproj.isPending} className="inline-flex items-center gap-2 px-5 py-3 pill bg-[var(--ink)] text-[var(--ivory)] text-xs uppercase tracking-widest hover:bg-gold-gradient hover:text-[var(--ink)] disabled:opacity-60"><Save className="w-4 h-4" /> {"id" in hprojDraft && hprojDraft.id ? "Update" : "Create"}</button>
                  {"id" in hprojDraft && hprojDraft.id && <button type="button" onClick={() => setHprojDraft(EMPTY_HPROJ)} className="px-5 py-3 pill border hairline text-xs uppercase tracking-widest hover:bg-secondary">Cancel</button>}
                </div>
              </form>
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Featured projects · {hprojects.length}</div>
                <button onClick={() => setHprojDraft(EMPTY_HPROJ)} className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold hover:underline"><Plus className="w-3 h-3" /> New</button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {hprojects.map((p) => (
                  <div key={p.id} className="border hairline rounded-2xl bg-card p-3">
                    <div className="aspect-video rounded-xl bg-secondary overflow-hidden">
                      {p.image_url && <img src={p.image_url} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="mt-2 font-display text-lg truncate">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.category || "—"} · order {p.sort_order} · {p.is_published ? "live" : "hidden"}</div>
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => setHprojDraft(p)} className="flex-1 px-3 py-2 pill border hairline text-xs hover:bg-secondary">Edit</button>
                      <button onClick={() => { if (confirm("Delete?")) delHproj.mutate(p.id); }} className="w-9 h-9 grid place-items-center pill border hairline hover:bg-destructive hover:text-[var(--ivory)] hover:border-transparent"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {tab === "hero" && (
        <section className="container-lux pb-24 grid gap-12 lg:grid-cols-[380px_1fr]">
          <div className="border hairline rounded-3xl bg-card p-6">
            <div className="font-display text-xl">{"id" in heroDraft && heroDraft.id ? "Edit hero slide" : "New hero slide"}</div>
            <p className="mt-1 text-xs text-muted-foreground">Cards shown in the fanned carousel at the top of the home page.</p>
            <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); upsertHero.mutate(heroDraft); }}>
              <Field label="Image URL"><input required value={heroDraft.image_url} onChange={(e) => setHeroDraft({ ...heroDraft, image_url: e.target.value })} className={inp} placeholder="https://..." /></Field>
              <Field label="Label (shown on card)"><input required value={heroDraft.label} onChange={(e) => setHeroDraft({ ...heroDraft, label: e.target.value })} className={inp} placeholder="Luxury Pool Tables" /></Field>
              <Field label="Link (optional)"><input value={heroDraft.link_url ?? ""} onChange={(e) => setHeroDraft({ ...heroDraft, link_url: e.target.value })} className={inp} placeholder="/shop" /></Field>
              <Field label="Sort order"><input type="number" value={heroDraft.sort_order} onChange={(e) => setHeroDraft({ ...heroDraft, sort_order: Number(e.target.value) })} className={inp} /></Field>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={heroDraft.is_published} onChange={(e) => setHeroDraft({ ...heroDraft, is_published: e.target.checked })} /> Published (visible in carousel)</label>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={upsertHero.isPending} className="inline-flex items-center gap-2 px-5 py-3 pill bg-[var(--ink)] text-[var(--ivory)] text-xs uppercase tracking-widest hover:bg-gold-gradient hover:text-[var(--ink)] disabled:opacity-60"><Save className="w-4 h-4" /> {"id" in heroDraft && heroDraft.id ? "Update" : "Create"}</button>
                {"id" in heroDraft && heroDraft.id && <button type="button" onClick={() => setHeroDraft(EMPTY_HERO)} className="px-5 py-3 pill border hairline text-xs uppercase tracking-widest hover:bg-secondary">Cancel</button>}
              </div>
            </form>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Hero slides · {heroSlides.length}</div>
              <button onClick={() => setHeroDraft(EMPTY_HERO)} className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold hover:underline"><Plus className="w-3 h-3" /> New</button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {heroSlides.map((h) => (
                <div key={h.id} className="border hairline rounded-2xl bg-card p-3">
                  <div className="aspect-[3/4] rounded-xl bg-secondary overflow-hidden">
                    {h.image_url && <img src={h.image_url} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="mt-2 font-display text-lg truncate">{h.label}</div>
                  <div className="text-xs text-muted-foreground truncate">{h.link_url || "no link"} · order {h.sort_order} · {h.is_published ? "live" : "hidden"}</div>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => setHeroDraft(h)} className="flex-1 px-3 py-2 pill border hairline text-xs hover:bg-secondary">Edit</button>
                    <button onClick={() => { if (confirm("Delete?")) delHero.mutate(h.id); }} className="w-9 h-9 grid place-items-center pill border hairline hover:bg-destructive hover:text-[var(--ivory)] hover:border-transparent"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {tab === "settings" && settingsDraft && (
        <section className="container-lux pb-24 max-w-3xl">
          <form onSubmit={(e) => { e.preventDefault(); saveSettings.mutate(settingsDraft); }} className="border hairline rounded-3xl bg-card p-8 space-y-4">
            <div className="font-display text-2xl">WhatsApp & site settings</div>
            <p className="text-sm text-muted-foreground">The number below is used for the checkout WhatsApp handoff and the floating chat button. Message templates support these placeholders: <code className="text-gold">{"{order_id} {full_name} {email} {phone} {address} {city} {items} {subtotal} {notes}"}</code></p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="WhatsApp number (digits only, with country code)">
                <input required value={settingsDraft.whatsapp_number} onChange={(e) => setSettingsDraft({ ...settingsDraft, whatsapp_number: e.target.value })} className={inp} placeholder="250794506387" />
              </Field>
              <Field label="Display number (shown on site)">
                <input required value={settingsDraft.whatsapp_display} onChange={(e) => setSettingsDraft({ ...settingsDraft, whatsapp_display: e.target.value })} className={inp} placeholder="+250 794 506 387" />
              </Field>
            </div>
            <Field label="Order message template">
              <textarea rows={10} value={settingsDraft.order_message_template} onChange={(e) => setSettingsDraft({ ...settingsDraft, order_message_template: e.target.value })} className={inp + " font-mono text-xs"} />
            </Field>
            <div className="border-t hairline pt-4 space-y-3">
              <div className="font-display text-lg">Promo banner</div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settingsDraft.promo_enabled} onChange={(e) => setSettingsDraft({ ...settingsDraft, promo_enabled: e.target.checked })} /> Show promo banner on home page</label>
              <Field label="Promo text"><input value={settingsDraft.promo_text} onChange={(e) => setSettingsDraft({ ...settingsDraft, promo_text: e.target.value })} className={inp} /></Field>
            </div>
            <button type="submit" disabled={saveSettings.isPending} className="inline-flex items-center gap-2 px-6 py-3 pill bg-[var(--ink)] text-[var(--ivory)] text-xs uppercase tracking-widest hover:bg-gold-gradient hover:text-[var(--ink)] disabled:opacity-60"><Save className="w-4 h-4" /> Save settings</button>
          </form>
        </section>
      )}
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