import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";
import { toast } from "sonner";
import { PasswordInput } from "@/components/PasswordInput";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — B Trader Elite Billiards" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [state, setState] = useState<"checking" | "ready" | "invalid">("checking");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // The recovery link signs the user in automatically (type=recovery in the
    // URL hash). A valid session means the link is fresh and we can show the form.
    supabase.auth.getUser().then(({ data }) => {
      setState(data.user ? "ready" : "invalid");
    });
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pw !== pw2) {
      toast.error("Passwords don't match.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated. You're signed in.");
    navigate({ to: "/" });
  }

  return (
    <PageShell>
      <section className="container-lux py-24 md:py-32">
        <div className="max-w-md mx-auto border hairline bg-card rounded-3xl p-10 shadow-pill">
          <div className="text-xs uppercase tracking-[0.35em] text-gold">Password reset</div>
          <h1 className="mt-3 font-display text-4xl">
            {state === "invalid" ? "Link expired." : "Set a new password."}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {state === "invalid"
              ? "This reset link is invalid or has expired. Request a new one from the sign-in page."
              : "Choose a new password for your account. At least 6 characters."}
          </p>

          {state === "checking" ? (
            <p className="mt-8 text-sm text-muted-foreground">Checking your link...</p>
          ) : state === "invalid" ? (
            <div className="mt-8">
              <Link
                to="/auth"
                className="inline-block px-6 py-4 pill bg-[var(--ink)] text-[var(--ivory)] text-sm hover:bg-gold-gradient hover:text-[var(--ink)] transition-all"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <label className="block">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">New password</span>
                <PasswordInput
                  required
                  minLength={6}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  className="mt-1 w-full border hairline bg-background px-4 py-3 rounded-xl outline-none focus:border-[var(--gold)]"
                  placeholder="At least 6 characters"
                />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Confirm password</span>
                <PasswordInput
                  required
                  minLength={6}
                  value={pw2}
                  onChange={(e) => setPw2(e.target.value)}
                  className="mt-1 w-full border hairline bg-background px-4 py-3 rounded-xl outline-none focus:border-[var(--gold)]"
                  placeholder="Repeat the password"
                />
              </label>
              <button
                type="submit"
                disabled={busy}
                className="w-full mt-2 px-6 py-4 pill bg-[var(--ink)] text-[var(--ivory)] text-sm hover:bg-gold-gradient hover:text-[var(--ink)] transition-all disabled:opacity-60"
              >
                {busy ? "Saving..." : "Update password"}
              </button>
            </form>
          )}

          <div className="mt-4 text-center text-xs">
            <Link to="/" className="text-muted-foreground hover:text-foreground">← Back to home</Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
