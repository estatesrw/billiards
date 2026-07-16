import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { SITE } from "@/lib/site";

const links = [
  { to: "/", key: "nav.home" as const },
  { to: "/shop", key: "nav.shop" as const },
  { to: "/services", key: "nav.services" as const },
  { to: "/projects", key: "nav.projects" as const },
  { to: "/gallery", key: "nav.gallery" as const },
  { to: "/about", key: "nav.about" as const },
  { to: "/testimonials", key: "nav.testimonials" as const },
  { to: "/faq", key: "nav.faq" as const },
  { to: "/contact", key: "nav.contact" as const },
];

export function Nav() {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b hairline bg-background/80 backdrop-blur-md">
      <div className="container-lux flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="inline-block w-9 h-9 rounded-full border border-[var(--gold)] grid place-items-center text-gold font-display text-lg">
            B
          </span>
          <span className="font-display text-lg tracking-wide leading-tight">
            <span className="block">B Trader</span>
            <span className="block text-[10px] uppercase tracking-[0.3em] text-gold">Elite Billiards</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors gold-underline"
              activeProps={{ className: "text-gold" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === "en" ? "rw" : "en")}
            className="hidden md:flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-gold transition-colors"
            aria-label="Toggle language"
          >
            <Globe className="w-4 h-4" />
            {lang === "en" ? "EN / RW" : "RW / EN"}
          </button>
          <a
            href={SITE.waLink()}
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-block text-xs uppercase tracking-widest px-5 py-3 border border-[var(--gold)] text-gold hover:bg-gold-gradient hover:text-[var(--ink)] transition-all"
          >
            {t("cta.whatsapp")}
          </a>
          <button
            className="lg:hidden text-foreground"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t hairline bg-background">
          <div className="container-lux py-6 flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-widest text-muted-foreground hover:text-gold"
                activeProps={{ className: "text-gold" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {t(l.key)}
              </Link>
            ))}
            <button
              onClick={() => setLang(lang === "en" ? "rw" : "en")}
              className="text-xs uppercase tracking-widest text-gold text-left"
            >
              <Globe className="w-4 h-4 inline mr-2" />
              {lang === "en" ? "Switch to Kinyarwanda" : "Switch to English"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}