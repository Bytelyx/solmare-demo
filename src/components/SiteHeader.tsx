import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Camera, Heart, Menu, Mic, Search, ShoppingBag, User, X } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";

const cats = [
  { label: "All Jewellery", search: {} },
  { label: "Gold", search: { metal: "gold" } },
  { label: "Silver", search: { metal: "silver" } },
  { label: "Diamond", search: { metal: "diamond" } },
  { label: "Gemstones", search: { q: "gem" } },
  { label: "Gift Cards", to: "/gift-cards" },
] as const;

function SearchBar({ onDone }: { onDone?: () => void }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [listening, setListening] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const go = (value: string) => {
    navigate({ to: "/jewellery", search: value.trim() ? { q: value.trim() } : {} });
    onDone?.();
  };

  const mic = () => {
    const w = window as unknown as { SpeechRecognition?: new () => any; webkitSpeechRecognition?: new () => any };
    const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!SR) { toast.error("Voice search isn't supported in this browser"); return; }
    const r = new SR();
    r.lang = "en-IN";
    r.onresult = (e: any) => { const t = e.results[0][0].transcript as string; setQ(t); go(t); };
    r.onend = () => setListening(false);
    setListening(true);
    r.start();
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); go(q); }}
      className="flex h-11 w-full items-center gap-2 rounded-full border border-gold/40 bg-card px-4 transition focus-within:border-gold">
      <Search className="h-4 w-4 shrink-0 text-gold" />
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search rings, earrings, diamonds…"
        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { if (e.target.files?.[0]) { toast.success("Photo received — showing similar designs"); go(""); } e.target.value = ""; }} />
      <button type="button" aria-label="Search by photo" onClick={() => fileRef.current?.click()} className="text-foreground/70 hover:text-gold"><Camera className="h-4 w-4" /></button>
      <span className="h-5 w-px bg-border" />
      <button type="button" aria-label="Voice search" onClick={mic} className={listening ? "text-gold animate-pulse" : "text-foreground/70 hover:text-gold"}><Mic className="h-4 w-4" /></button>
    </form>
  );
}

function IconBadge({ n }: { n: number }) {
  return <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-navy">{n}</span>;
}

export function SiteHeader() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`sticky top-0 z-50 border-b transition-all ${scrolled ? "bg-navy/95 backdrop-blur shadow-soft" : "bg-navy"}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:h-20 md:gap-8 md:px-8">
        <button className="lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}><Menu className="h-6 w-6" /></button>
        <Link to="/" className="font-display text-2xl tracking-[0.3em] md:text-3xl">
          SOL<span className="text-gradient-gold">MARE</span>
        </Link>
        <div className="hidden flex-1 md:block"><div className="mx-auto max-w-xl"><SearchBar /></div></div>
        <div className="ml-auto flex items-center gap-5 md:ml-0">
          <button aria-label="Wishlist" className="relative hover:text-gold"><Heart className="h-5 w-5" /><IconBadge n={0} /></button>
          <Link to="/cart" aria-label="Bag" className="relative hover:text-gold"><ShoppingBag className="h-5 w-5" /><IconBadge n={count} /></Link>
          <Link to="/account" aria-label="My profile" className="grid h-9 w-9 place-items-center rounded-full border border-gold/50 hover:bg-gold hover:text-navy"><User className="h-4 w-4" /></Link>
        </div>
      </div>
      <div className="px-4 pb-3 md:hidden"><SearchBar /></div>
      <nav className="hidden border-t border-gold/15 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-10 px-8 py-3">
          {cats.map((c) =>
            "to" in c ? (
              <Link key={c.label} to={c.to} className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/80 hover:text-gold" activeProps={{ className: "text-gold" }}>
                {c.label}
              </Link>
            ) : (
              <Link key={c.label} to="/jewellery" search={c.search} activeOptions={{ includeSearch: true }}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/80 hover:text-gold" activeProps={{ className: "text-gold" }}>
                {c.label}
              </Link>
            ),
          )}
          <Link to="/collections" className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/80 hover:text-gold" activeProps={{ className: "text-gold" }}>Collections</Link>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-navy/70" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-[80%] max-w-xs overflow-y-auto bg-background p-6 animate-in slide-in-from-left">
            <div className="mb-8 flex items-center justify-between">
              <span className="font-display text-2xl tracking-[0.3em]">SOLMARE</span>
              <button aria-label="Close menu" onClick={() => setOpen(false)}><X className="h-6 w-6" /></button>
            </div>
            <nav className="flex flex-col gap-5">
              {cats.map((c) =>
                "to" in c ? (
                  <Link key={c.label} to={c.to} onClick={() => setOpen(false)} className="font-display text-2xl hover:text-gold">{c.label}</Link>
                ) : (
                  <Link key={c.label} to="/jewellery" search={c.search} onClick={() => setOpen(false)} className="font-display text-2xl hover:text-gold">{c.label}</Link>
                ),
              )}
              <Link to="/collections" onClick={() => setOpen(false)} className="font-display text-2xl hover:text-gold">Collections</Link>
              <div className="my-2 h-px bg-border" />
              <Link to="/about" onClick={() => setOpen(false)} className="text-sm uppercase tracking-widest hover:text-gold">Our Story</Link>
              <Link to="/contact" onClick={() => setOpen(false)} className="text-sm uppercase tracking-widest hover:text-gold">Store & Contact</Link>
            </nav>
          </aside>
        </div>
      )}
    </header>
  );
}
