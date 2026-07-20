import { useSettings, waLink } from "@/lib/settings";
import { SITE } from "@/lib/site";

export function WhatsAppFab() {
  const { data: s } = useSettings();
  const number = s?.whatsapp_number || SITE.whatsapp;
  const href = waLink(number, `Hello ${SITE.name}, I would like to know more.`);
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 pl-4 pr-5 py-3 rounded-full bg-[#25D366] text-white shadow-luxe hover:scale-105 transition-transform"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.52 3.48A11.94 11.94 0 0 0 12.05 0C5.5 0 .2 5.3.2 11.86c0 2.09.55 4.13 1.6 5.93L0 24l6.36-1.67a11.85 11.85 0 0 0 5.69 1.45h.01c6.55 0 11.86-5.3 11.86-11.86 0-3.17-1.23-6.14-3.4-8.44ZM12.06 21.6h-.01a9.7 9.7 0 0 1-4.95-1.36l-.36-.21-3.77.99 1-3.67-.23-.38a9.7 9.7 0 0 1-1.48-5.11c0-5.37 4.37-9.74 9.75-9.74 2.6 0 5.05 1.01 6.89 2.86a9.66 9.66 0 0 1 2.85 6.89c0 5.37-4.37 9.73-9.74 9.73Zm5.34-7.28c-.29-.15-1.73-.86-2-.96-.27-.1-.47-.15-.66.15-.2.29-.76.96-.93 1.16-.17.2-.34.22-.63.07-.29-.15-1.24-.46-2.36-1.47-.87-.78-1.46-1.74-1.63-2.03-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.19-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.66-1.59-.9-2.18-.24-.58-.48-.5-.66-.51l-.56-.01c-.19 0-.51.07-.78.36-.27.29-1.02 1-1.02 2.43 0 1.43 1.05 2.82 1.19 3.02.15.2 2.06 3.15 5 4.42.7.3 1.24.48 1.66.61.7.22 1.34.19 1.84.12.56-.08 1.73-.71 1.97-1.39.24-.68.24-1.26.17-1.39-.07-.13-.27-.2-.56-.34Z" />
      </svg>
      <span className="text-sm font-medium hidden sm:inline">Chat with us</span>
    </a>
  );
}