import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Globe, User, LogOut, ShoppingBag, Heart } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/lib/cart";

const links = [
  { to: "/", key: "nav.home" as const },
  { to: "/shop", key: "nav.shop" as const },
  { to: "/services", key: "nav.services" as const },
  { to: "/projects", key: "nav.projects" as const },
  { to: "/gallery", key: "nav.gallery" as const },
  { to: "/about", key: "nav.about" as const },
  { to: "/contact", key: "nav.contact" as const },
];

export function Nav() {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  const { count, setOpen: setCartOpen } = useCart();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  return (
    <header className="sticky top-4 z-40 px-4">
      <div className="max-w-6xl mx-auto bg-background/85 backdrop-blur-xl pill shadow-pill border hairline flex items-center justify-between pl-5 pr-2 py-2">
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <span className="inline-block w-9 h-9 pill bg-[var(--ink)] text-[var(--ivory)] grid place-items-center font-display text-sm">B</span>
          <span className="hidden sm:block font-display text-sm tracking-wide leading-tight">
            <span className="block">B Trader</span>
            <span className="block text-[9px] uppercase tracking-[0.25em] text-gold">Elite Billiards</span>
          </span>
        </Link>

        <nav className="hidden xl:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-xs px-3 py-2 pill text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              activeProps={{ className: "text-foreground bg-secondary" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCartOpen(true)}
            className="relative w-9 h-9 grid place-items-center pill hover:bg-secondary"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gold-gradient text-[var(--ink)] text-[10px] font-semibold grid place-items-center">
                {count}
              </span>
            )}
          </button>
          <button
            onClick={() => setLang(lang === "en" ? "rw" : "en")}
            className="hidden md:flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground px-2"
            aria-label="Toggle language"
          >
            <Globe className="w-3.5 h-3.5" />
            {lang.toUpperCase()}
          </button>
          <a
            href={SITE.waLink()}
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-2 text-xs px-4 py-2.5 pill bg-[var(--ink)] text-[var(--ivory)] hover:bg-gold-gradient hover:text-[var(--ink)] transition-all"
          >
            {t("cta.whatsapp")}
          </a>
          {email ? (
            <div className="hidden md:flex items-center gap-1">
              <Link to="/account" className="text-xs px-3 py-2 pill hover:bg-secondary flex items-center gap-1.5" title="Account">
                <User className="w-3.5 h-3.5" /> Account
              </Link>
              <Link to="/account" hash="wishlist" className="w-9 h-9 grid place-items-center pill hover:bg-secondary text-muted-foreground" title="Wishlist">
                <Heart className="w-4 h-4" />
              </Link>
              <button onClick={signOut} title="Sign out" className="w-9 h-9 grid place-items-center pill hover:bg-secondary text-muted-foreground">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="hidden md:inline-flex text-xs px-3 py-2 pill hover:bg-secondary items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Sign in
            </Link>
          )}
          <button
            className="xl:hidden text-foreground w-10 h-10 grid place-items-center pill hover:bg-secondary"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="xl:hidden mt-2 max-w-6xl mx-auto bg-background border hairline rounded-3xl shadow-pill p-4">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-sm px-4 py-3 pill hover:bg-secondary"
                activeProps={{ className: "bg-secondary text-foreground" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {t(l.key)}
              </Link>
            ))}
            {email ? (
              <>
                <Link to="/account" onClick={() => setOpen(false)} className="text-sm px-4 py-3 pill hover:bg-secondary">Account</Link>
                <button onClick={() => { setOpen(false); signOut(); }} className="text-sm px-4 py-3 pill hover:bg-secondary text-left">Sign out</button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)} className="text-sm px-4 py-3 pill hover:bg-secondary">Sign in</Link>
            )}
            <button
              onClick={() => setLang(lang === "en" ? "rw" : "en")}
              className="text-xs uppercase tracking-widest text-gold text-left px-4 py-3 mt-2 border-t hairline"
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