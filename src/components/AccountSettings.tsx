import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PasswordInput } from "@/components/PasswordInput";

const field = "mt-1 w-full border hairline bg-background px-4 py-3 rounded-xl outline-none focus:border-[var(--gold)]";
const btn = "mt-4 px-6 py-3 pill bg-[var(--ink)] text-[var(--ivory)] text-sm hover:bg-gold-gradient hover:text-[var(--ink)] transition-all disabled:opacity-60";

export function AccountSettings({ currentEmail }: { currentEmail: string }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState<"email" | "pw" | null>(null);

  async function changeEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy("email");
    const { error } = await supabase.auth.updateUser({ email }, { emailRedirectTo: `${window.location.origin}/account` });
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success("Check your inbox to confirm the new email address.");
    setEmail("");
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pw !== pw2) return toast.error("Passwords don't match.");
    setBusy("pw");
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success("Password updated.");
    setPw(""); setPw2("");
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form onSubmit={changeEmail} className="border hairline rounded-2xl bg-card p-6">
        <h3 className="font-display text-xl">Change email</h3>
        <p className="text-xs text-muted-foreground mt-1">Current: {currentEmail}</p>
        <label className="block mt-4">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">New email</span>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
        </label>
        <button disabled={busy !== null} className={btn}>{busy === "email" ? "Saving..." : "Update email"}</button>
      </form>
      <form onSubmit={changePassword} className="border hairline rounded-2xl bg-card p-6">
        <h3 className="font-display text-xl">Change password</h3>
        <label className="block mt-4">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">New password</span>
          <PasswordInput required minLength={6} value={pw} onChange={(e) => setPw(e.target.value)} className={field} />
        </label>
        <label className="block mt-3">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Confirm password</span>
          <PasswordInput required minLength={6} value={pw2} onChange={(e) => setPw2(e.target.value)} className={field} />
        </label>
        <button disabled={busy !== null} className={btn}>{busy === "pw" ? "Saving..." : "Update password"}</button>
      </form>
    </div>
  );
}
