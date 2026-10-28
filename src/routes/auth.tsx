import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";
import { toast } from "sonner";
import { PasswordInput } from "@/components/PasswordInput";

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
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  async function routeAfterAuth(userId: string) {
    const { data: rows } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin");
    navigate({ to: (rows?.length ?? 0) > 0 ? "/admin" : "/" });
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) routeAfterAuth(data.user.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Reset link sent — check your inbox (and spam folder).");
        setMode("signin");
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        if (data.session) {
          toast.success("Account created. You're signed in.");
          await routeAfterAuth(data.user!.id);
        } else {
          toast.success("Account created. Check your email to confirm your address, then sign in.");
          setMode("signin");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
        await routeAfterAuth(data.user.id);
      }
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
            {mode === "signin" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset password"}
          </div>
          <h1 className="mt-3 font-display text-4xl">
            {mode === "signin" ? "Sign in." : mode === "signup" ? "Join us." : "Forgot password?"}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Access your orders, wishlist and saved projects."
              : mode === "signup"
                ? "It takes a minute — no card required."
                : "Enter your email and we'll send you a link to set a new password."}
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
            {mode !== "forgot" && (
              <label className="block">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Password</span>
                <PasswordInput
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full border hairline bg-background px-4 py-3 rounded-xl outline-none focus:border-[var(--gold)]"
                  placeholder="At least 6 characters"
                />
              </label>
            )}
            <button
              type="submit"
              disabled={busy}
              className="w-full mt-2 px-6 py-4 pill bg-[var(--ink)] text-[var(--ivory)] text-sm hover:bg-gold-gradient hover:text-[var(--ink)] transition-all disabled:opacity-60"
            >
              {busy
                ? "Please wait..."
                : mode === "signin"
                  ? "Sign in"
                  : mode === "signup"
                    ? "Create account"
                    : "Send reset link"}
            </button>
          </form>

          {mode === "signin" && (
            <div className="mt-3 text-center text-sm">
              <button onClick={() => setMode("forgot")} className="text-gold hover:underline">
                Forgot password?
              </button>
            </div>
          )}

          <div className="mt-4 text-sm text-center text-muted-foreground">
            {mode === "signin" ? (
              <>
                No account?{" "}
                <button onClick={() => setMode("signup")} className="text-gold hover:underline">
                  Create one
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setMode("signin")} className="text-gold hover:underline">
                  ← Back to sign in
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
