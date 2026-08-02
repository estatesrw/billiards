import { fetchSettings, waLink } from "@/lib/settings";
import { money } from "@/lib/money";
import type { CartItem } from "@/lib/cart";

/** Build a WhatsApp order enquiry message from cart contents. */
export function buildCartMessage(items: CartItem[], subtotal: number) {
  const lines = items
    .map((i) => `• ${i.name} × ${i.quantity} — ${money(i.price_cents * i.quantity)}`)
    .join("\n");
  return `Hello B Trader Elite Billiards, I would like to order:\n\n${lines}\n\nTotal: ${money(subtotal)}`;
}

/** Opens WhatsApp with the cart contents. Call from a click handler. */
export async function orderCartOnWhatsApp(items: CartItem[], subtotal: number) {
  const win = window.open("about:blank", "_blank");
  const settings = await fetchSettings().catch(() => null);
  const href = waLink(settings?.whatsapp_number || "250793735430", buildCartMessage(items, subtotal));
  if (win) win.location.href = href;
  else window.location.href = href;
}
