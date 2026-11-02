import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Heart, LogOut, Package, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/account")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "My profile — Solmare" },
      { name: "description", content: "Manage your Solmare profile, orders and wishlist." },
      { property: "og:title", content: "My profile — Solmare" },
      { property: "og:description", content: "Your Solmare fine jewellery account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [p, setP] = useState({ full_name: "", phone: "", city: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { navigate({ to: "/auth", replace: true }); return; }
      setEmail(data.user.email ?? ""); setUid(data.user.id);
      const { data: row } = await supabase.from("profiles").select("full_name, phone, city").eq("id", data.user.id).maybeSingle();
      if (row) setP({ full_name: row.full_name ?? "", phone: row.phone ?? "", city: row.city ?? "" });
    });
  }, [navigate]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!uid) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({ id: uid, ...p, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("Profile saved");
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (!uid) return <div className="min-h-[60vh]" />;
  const input = "w-full rounded-full border border-border bg-card px-5 py-3 text-sm focus:border-gold focus:outline-none";

  return (
    <section className="mx-auto max-w-5xl px-4 py-14 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">My account</p>
          <h1 className="mt-2 text-4xl">Hello, {p.full_name || "there"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{email}</p>
        </div>
        <button onClick={signOut} className="btn-outline"><LogOut className="h-4 w-4" /> Sign out</button>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Package, t: "My orders", d: "No orders yet", to: "/jewellery" as const },
          { icon: Heart, t: "Wishlist", d: "0 saved designs", to: "/jewellery" as const },
          { icon: ShoppingBag, t: "My bag", d: "View your bag", to: "/cart" as const },
        ].map(({ icon: I, t, d, to }) => (
          <Link key={t} to={to} className="rounded-2xl border border-border bg-card p-6 hover:border-gold">
            <I className="h-5 w-5 text-gold" />
            <p className="mt-3 font-display text-xl">{t}</p>
            <p className="text-sm text-muted-foreground">{d}</p>
          </Link>
        ))}
      </div>

      <form onSubmit={save} className="mt-10 rounded-2xl border border-border bg-card p-6 md:p-8">
        <h2 className="text-2xl">Profile details</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <input placeholder="Full name" value={p.full_name} onChange={(e) => setP({ ...p, full_name: e.target.value })} className={input} />
          <input placeholder="Phone" value={p.phone} onChange={(e) => setP({ ...p, phone: e.target.value })} className={input} />
          <input placeholder="City" value={p.city} onChange={(e) => setP({ ...p, city: e.target.value })} className={input} />
        </div>
        <button disabled={saving} className="btn-gold mt-6">{saving ? "Saving…" : "Save profile"}</button>
      </form>
    </section>
  );
}
