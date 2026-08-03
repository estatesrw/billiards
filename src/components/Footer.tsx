import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";
import { SITE } from "@/lib/site";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-32 relative overflow-hidden bg-[#0B3B26] text-[#F3F6F2]">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(120% 90% at 50% 0%, rgba(24,110,68,0.55) 0%, rgba(11,59,38,0) 55%), linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.85) 100%)" }}
      />
      <div className="relative z-10">
      <div className="container-lux py-20 grid gap-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-3xl">B Trader Elite Billiards</div>
          <p className="mt-4 text-[#F3F6F2]/70 max-w-md">
            Rwanda's trusted supplier of tournament-grade pool, snooker and carom tables — plus expert installation, maintenance and refelting.
          </p>
          <div className="mt-6 flex gap-4">
            <a href="#" className="w-10 h-10 grid place-items-center border border-[#F3F6F2]/25 rounded-full hover:border-[#7CE0A6] hover:text-[#7CE0A6] transition-colors"><Instagram className="w-4 h-4" /></a>
            <a href={SITE.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="w-10 h-10 grid place-items-center border border-[#F3F6F2]/25 rounded-full hover:border-[#7CE0A6] hover:text-[#7CE0A6] transition-colors"><Facebook className="w-4 h-4" /></a>
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-[#7CE0A6]">Explore</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/shop" className="hover:text-[#7CE0A6]">{t("nav.shop")}</Link></li>
            <li><Link to="/services" className="hover:text-[#7CE0A6]">{t("nav.services")}</Link></li>
            <li><Link to="/projects" className="hover:text-[#7CE0A6]">{t("nav.projects")}</Link></li>
            <li><Link to="/gallery" className="hover:text-[#7CE0A6]">{t("nav.gallery")}</Link></li>
            <li><Link to="/about" className="hover:text-[#7CE0A6]">{t("nav.about")}</Link></li>
            <li><Link to="/faq" className="hover:text-[#7CE0A6]">{t("nav.faq")}</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-[#7CE0A6]">Contact</div>
          <ul className="mt-4 space-y-3 text-sm text-[#F3F6F2]/70">
            <li className="flex gap-2 items-start"><MapPin className="w-4 h-4 mt-0.5 text-[#7CE0A6]" /> {SITE.address}</li>
            <li className="flex gap-2 items-center"><Phone className="w-4 h-4 text-[#7CE0A6]" /> <a href={`tel:${SITE.phone}`} className="hover:text-[#F3F6F2]">{SITE.phone}</a></li>
            <li className="flex gap-2 items-center"><Mail className="w-4 h-4 text-[#7CE0A6]" /> <a href={`mailto:${SITE.email}`} className="hover:text-[#F3F6F2]">{SITE.email}</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#F3F6F2]/15">
        <div className="container-lux py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#F3F6F2]/60">
          <div>© 2026 B Trader Elite Billiards. {t("footer.rights")}</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#7CE0A6]">Privacy Policy</a>
            <a href="#" className="hover:text-[#7CE0A6]">Terms & Conditions</a>
            <a href="#" className="hover:text-[#7CE0A6]">Warranty</a>
            <a href="#" className="hover:text-[#7CE0A6]">Returns</a>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
}