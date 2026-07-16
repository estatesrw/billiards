import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "rw";

type Dict = Record<string, { en: string; rw: string }>;

export const dict: Dict = {
  "nav.home": { en: "Home", rw: "Ahabanza" },
  "nav.about": { en: "About", rw: "Abo Turi Bo" },
  "nav.shop": { en: "Shop", rw: "Isoko" },
  "nav.services": { en: "Services", rw: "Serivisi" },
  "nav.gallery": { en: "Gallery", rw: "Amashusho" },
  "nav.projects": { en: "Projects", rw: "Imishinga" },
  "nav.testimonials": { en: "Reviews", rw: "Ibitekerezo" },
  "nav.faq": { en: "FAQ", rw: "Ibibazo" },
  "nav.contact": { en: "Contact", rw: "Twandikire" },
  "cta.shop": { en: "Shop Now", rw: "Gura Nonaha" },
  "cta.contact": { en: "Contact Us", rw: "Twandikire" },
  "cta.whatsapp": { en: "Chat on WhatsApp", rw: "Vugana natwe kuri WhatsApp" },
  "cta.book": { en: "Book Service", rw: "Saba Serivisi" },
  "cta.explore": { en: "Explore Collection", rw: "Reba Ibicuruzwa" },
  "hero.eyebrow": { en: "Rwanda's premier billiards house", rw: "Iwacu ni ho ubona meza y'imikino myiza" },
  "hero.title.a": { en: "Where every shot", rw: "Aho buri gukubita" },
  "hero.title.b": { en: "meets its match.", rw: "bihura n'ubuhanga." },
  "hero.sub": {
    en: "Tournament-grade pool, snooker and carom tables — hand-finished, expertly installed, and backed by service across Kigali.",
    rw: "Amameza y'imikino y'irushanwa — apfundikijwe n'ubuhanga, ashyirwaho n'inzobere, hamwe na serivisi mu Kigali.",
  },
  "promo": {
    en: "Limited season offer — Free installation & delivery within Kigali on all tables.",
    rw: "Igabanya rigufi — Iyinjizwa n'ubwikorezi ku buntu i Kigali kuri buri meza.",
  },
  "sec.featured": { en: "Featured Collection", rw: "Ibicuruzwa Bikomeye" },
  "sec.featured.sub": { en: "A curated selection from our showroom floor.", rw: "Ibicuruzwa byatoranyijwe mu iduka ryacu." },
  "sec.services": { en: "Our Services", rw: "Serivisi Zacu" },
  "sec.services.sub": { en: "From delivery to refelting — we take care of the table for its lifetime.", rw: "Kuva ku bwikorezi kugeza ku guhindura umwenda — turayoboka meza yawe iteka." },
  "sec.why": { en: "Why Choose Us", rw: "Impamvu Uduhitamo" },
  "sec.projects": { en: "Featured Projects", rw: "Imishinga Yacu" },
  "sec.projects.sub": { en: "Hotels, bars and clubs across Rwanda trust our craftsmanship.", rw: "Amahoteri, uduce n'amakawa mu Rwanda babigirira icyizere." },
  "sec.testimonials": { en: "What Clients Say", rw: "Icyo Abakiriya Bavuga" },
  "footer.rights": { en: "All rights reserved.", rw: "Uburenganzira bwose burihariwe." },
};

const I18nCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: keyof typeof dict) => string }>({
  lang: "en",
  setLang: () => {},
  t: (k) => dict[k]?.en ?? String(k),
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("bte-lang") : null;
    if (saved === "en" || saved === "rw") setLangState(saved);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") window.localStorage.setItem("bte-lang", l);
  }, []);

  const t = useCallback((k: keyof typeof dict) => dict[k]?.[lang] ?? String(k), [lang]);

  return <I18nCtx.Provider value={{ lang, setLang, t }}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  return useContext(I18nCtx);
}