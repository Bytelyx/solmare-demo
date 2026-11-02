import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or register — Solmare" },
      { name: "description", content: "Sign in or create your Solmare account to view your profile, orders and wishlist." },
      { property: "og:title", content: "Sign in or register — Solmare" },
      { property: "og:description", content: "Access your Solmare fine jewellery account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [f, setF] = useState({ name: "", phone: "", email: "", password: "" });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) navigate({ to: "/account", replace: true }); });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email: f.email, password: f.password });
      setBusy(false);
      if (error) { toast.error(error.message); return; }
      navigate({ to: "/account", replace: true });
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: f.email, password: f.password,
        options: { emailRedirectTo: window.location.origin + "/account", data: { full_name: f.name, phone: f.phone } },
      });
      setBusy(false);
      if (error) { toast.error(error.message); return; }
      if (data.session) navigate({ to: "/account", replace: true });
      else setSent(true);
    }
  }

  const input = "w-full rounded-full border border-border bg-card px-5 py-3 text-sm focus:border-gold focus:outline-none";

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <p className="eyebrow text-center">My account</p>
      <h1 className="mt-2 text-center text-4xl">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
      <div className="mt-8 grid grid-cols-2 rounded-full border border-border p-1 text-xs uppercase tracking-widest">
        {(["login", "register"] as const).map((m) => (
          <button key={m} type="button" onClick={() => { setMode(m); setSent(false); }}
            className={`rounded-full py-2.5 ${mode === m ? "bg-gold text-navy" : "text-muted-foreground"}`}>
            {m === "login" ? "Login" : "Register"}
          </button>
        ))}
      </div>
      {sent ? (
        <p className="mt-8 rounded-2xl border border-gold/40 p-6 text-center text-sm">
          Almost there — check <strong>{f.email}</strong> and click the confirmation link to activate your account.
        </p>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-4">
          {mode === "register" && (
            <>
              <input required placeholder="Full name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={input} />
              <input placeholder="Phone (optional)" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className={input} />
            </>
          )}
          <input required type="email" placeholder="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} className={input} />
          <input required type="password" minLength={6} placeholder="Password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} className={input} />
          <button disabled={busy} className="btn-gold w-full">{busy ? "Please wait…" : mode === "login" ? "Login" : "Register"}</button>
        </form>
      )}
    </section>
  );
}
