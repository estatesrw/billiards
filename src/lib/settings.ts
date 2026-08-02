import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  id: string;
  whatsapp_number: string;
  whatsapp_display: string;
  order_message_template: string;
  promo_text: string;
  promo_enabled: boolean;
};

export const DEFAULT_TEMPLATE =
  "New order request #{order_id}\n\nName: {full_name}\nPhone: {phone}\nAddress: {address}, {city}\n\n{items}\n\nSubtotal: {subtotal}\n\nNotes: {notes}";

export async function fetchSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", "main")
    .maybeSingle();
  if (error) throw error;
  return (
    (data as SiteSettings) ?? {
      id: "main",
      whatsapp_number: "250793735430",
      whatsapp_display: "+250 793 735 430",
      order_message_template: DEFAULT_TEMPLATE,
      promo_text: "",
      promo_enabled: true,
    }
  );
}

export function useSettings() {
  return useQuery({ queryKey: ["site_settings"], queryFn: fetchSettings, staleTime: 60_000 });
}

export function waLink(number: string, msg?: string) {
  const clean = number.replace(/[^\d]/g, "");
  return `https://wa.me/${clean}${msg ? `?text=${encodeURIComponent(msg)}` : ""}`;
}

export function renderTemplate(tpl: string, vars: Record<string, string | number>) {
  return tpl.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? String(vars[k]) : ""));
}