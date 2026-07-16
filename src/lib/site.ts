export const SITE = {
  name: "B Trader Elite Billiards",
  short: "B Trader Elite",
  whatsapp: "250794506387",
  whatsappDisplay: "+250 794 506 387",
  phone: "+250 794 506 387",
  email: "billiards@gmail.com",
  address: "Norrsken House, KN 78 St, Kigali, Rwanda",
  mapsEmbed:
    "https://www.google.com/maps?q=Norrsken%20House%20Kigali&output=embed",
  waLink: (msg?: string) =>
    `https://wa.me/250794506387${msg ? `?text=${encodeURIComponent(msg)}` : ""}`,
};