import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — B Trader Elite Billiards" },
      { name: "description", content: "Sign in or create an account to shop, save favourites and track orders." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Account created. You're signed in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
      }
      navigate({ to: "/" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell>
      <section className="container-lux py-24 md:py-32">
        <div className="max-w-md mx-auto border hairline bg-card rounded-3xl p-10 shadow-pill">
          <div className="text-xs uppercase tracking-[0.35em] text-gold">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </div>
          <h1 className="mt-3 font-display text-4xl">
            {mode === "signin" ? "Sign in." : "Join us."}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Access your orders, wishlist and saved projects."
              : "It takes a minute — no card required."}
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            {mode === "signup" && (
              <label className="block">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full border hairline bg-background px-4 py-3 rounded-xl outline-none focus:border-[var(--gold)]"
                  placeholder="Your name"
                />
              </label>
            )}
            <label className="block">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Email</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full border hairline bg-background px-4 py-3 rounded-xl outline-none focus:border-[var(--gold)]"
                placeholder="you@example.com"
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Password</span>
              <input
                required
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full border hairline bg-background px-4 py-3 rounded-xl outline-none focus:border-[var(--gold)]"
                placeholder="At least 6 characters"
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="w-full mt-2 px-6 py-4 pill bg-[var(--ink)] text-[var(--ivory)] text-sm hover:bg-gold-gradient hover:text-[var(--ink)] transition-all disabled:opacity-60"
            >
              {busy ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="mt-6 text-sm text-center text-muted-foreground">
            {mode === "signin" ? (
              <>
                No account?{" "}
                <button onClick={() => setMode("signup")} className="text-gold hover:underline">
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => setMode("signin")} className="text-gold hover:underline">
                  Sign in
                </button>
              </>
            )}
          </div>
          <div className="mt-4 text-center text-xs">
            <Link to="/" className="text-muted-foreground hover:text-foreground">← Back to home</Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}