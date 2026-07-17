import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";
import { SITE } from "@/lib/site";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-32 border-t hairline bg-cream-soft">
      <div className="container-lux py-20 grid gap-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-3xl">B Trader Elite Billiards</div>
          <p className="mt-4 text-muted-foreground max-w-md">
            Rwanda's trusted supplier of tournament-grade pool, snooker and carom tables — plus expert installation, maintenance and refelting.
          </p>
          <div className="mt-6 flex gap-4">
            <a href="#" className="w-10 h-10 grid place-items-center border hairline rounded-full hover:border-[var(--gold)] hover:text-gold transition-colors"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="w-10 h-10 grid place-items-center border hairline rounded-full hover:border-[var(--gold)] hover:text-gold transition-colors"><Facebook className="w-4 h-4" /></a>
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-gold">Explore</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/shop" className="hover:text-gold">{t("nav.shop")}</Link></li>
            <li><Link to="/services" className="hover:text-gold">{t("nav.services")}</Link></li>
            <li><Link to="/projects" className="hover:text-gold">{t("nav.projects")}</Link></li>
            <li><Link to="/gallery" className="hover:text-gold">{t("nav.gallery")}</Link></li>
            <li><Link to="/about" className="hover:text-gold">{t("nav.about")}</Link></li>
            <li><Link to="/faq" className="hover:text-gold">{t("nav.faq")}</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-gold">Contact</div>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2 items-start"><MapPin className="w-4 h-4 mt-0.5 text-gold" /> {SITE.address}</li>
            <li className="flex gap-2 items-center"><Phone className="w-4 h-4 text-gold" /> <a href={`tel:${SITE.phone}`} className="hover:text-foreground">{SITE.phone}</a></li>
            <li className="flex gap-2 items-center"><Mail className="w-4 h-4 text-gold" /> <a href={`mailto:${SITE.email}`} className="hover:text-foreground">{SITE.email}</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t hairline">
        <div className="container-lux py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>© 2026 B Trader Elite Billiards. {t("footer.rights")}</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold">Privacy Policy</a>
            <a href="#" className="hover:text-gold">Terms & Conditions</a>
            <a href="#" className="hover:text-gold">Warranty</a>
            <a href="#" className="hover:text-gold">Returns</a>
          </div>
        </div>
      </div>
    </footer>
  );
}