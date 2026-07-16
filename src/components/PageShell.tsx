import type { ReactNode } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { WhatsAppFab } from "./WhatsAppFab";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}

export function PageHeader({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <section className="border-b hairline">
      <div className="container-lux py-24 md:py-32 text-center animate-lux-in">
        {eyebrow && (
          <div className="text-xs uppercase tracking-[0.4em] text-gold">{eyebrow}</div>
        )}
        <h1 className="mt-6 font-display text-5xl md:text-7xl leading-[0.95]">{title}</h1>
        {sub && <p className="mt-6 max-w-2xl mx-auto text-muted-foreground text-lg">{sub}</p>}
      </div>
    </section>
  );
}