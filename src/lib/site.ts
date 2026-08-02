export const SITE = {
  name: "B Trader Elite Billiards",
  short: "B Trader Elite",
  whatsapp: "250793735430",
  whatsappDisplay: "+250 793 735 430",
  phone: "+250 793 735 430",
  email: "billiards@gmail.com",
  address: "KN 2 St, Kigali, Rwanda",
  facebook: "https://www.facebook.com/share/1918oKHG2J/?mibextid=wwXIfr",
  mapsEmbed: "https://www.google.com/maps?q=KN%202%20St%20Kigali%20Rwanda&output=embed",
  waLink: (msg?: string) =>
    `https://wa.me/250793735430${msg ? `?text=${encodeURIComponent(msg)}` : ""}`,
};
