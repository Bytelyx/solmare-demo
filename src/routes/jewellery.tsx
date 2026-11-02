import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { categories, getCategory, products, audienceOf, materialsOf, styleOf, occasionsOf } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { PageHero } from "@/components/PageHero";
import everyday from "@/assets/everyday.jpg";

type S = {
  category?: string | undefined;
  q?: string | undefined;
  shopFor?: string | undefined;
  metal?: string | undefined;
  occasion?: string | undefined;
  price?: string | undefined;
  style?: string | undefined;
};

const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);

export const Route = createFileRoute("/jewellery")({
  validateSearch: (s: Record<string, unknown>): S => ({
    category: str(s["category"]),
    q: str(s["q"]),
    shopFor: str(s["shopFor"]),
    metal: str(s["metal"]),
    occasion: str(s["occasion"]),
    price: str(s["price"]),
    style: str(s["style"]),
  }),
  head: () => ({
    meta: [
      { title: "Shop Jewellery — Solmare" },
      { name: "description", content: "Browse Solmare rings, earrings, bangles, mangalsutras, solitaires and gold coins." },
      { property: "og:title", content: "Shop Jewellery — Solmare" },
      { property: "og:description", content: "Browse fine gold and diamond jewellery by category." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { category, q, shopFor = "all", metal = "all", occasion = "all", price = "all", style = "all" } = Route.useSearch();
  const navigate = useNavigate({ from: "/jewellery" });
  const set = (patch: Partial<S>) => navigate({ search: (prev) => ({ ...prev, ...patch }) });
  const cat = category ? getCategory(category) : undefined;

  const list = useMemo(() => {
    const pr = PRICES.find((x) => x.value === price);
    const term = (q ?? "").toLowerCase();
    return products.filter((p) =>
      p.category !== "gift-cards" &&
      (!category || p.category === category) &&
      (p.name + " " + p.metal).toLowerCase().includes(term) &&
      (shopFor === "all" || audienceOf(p) === shopFor || (shopFor.startsWith("kid") && audienceOf(p) === "kids-unisex")) &&
      (metal === "all" || materialsOf(p).includes(metal)) &&
      (occasion === "all" || occasionsOf(p).includes(occasion)) &&
      (style === "all" || styleOf(p) === style || (style === "yellow-white" && ["yellow", "white"].includes(styleOf(p)))) &&
      (!pr || (p.price >= pr.min && p.price < pr.max)));
  }, [category, q, shopFor, metal, occasion, price, style]);

  const clear = () => set({ shopFor: undefined, metal: undefined, occasion: undefined, price: undefined, style: undefined });

  return (
    <>
      <PageHero eyebrow="The Jewellery" title={cat?.name ?? "All Jewellery"} subtitle="Hallmarked gold. Certified diamonds. Designed to be worn, every day." image={everyday} />
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link to="/jewellery" search={(prev) => ({ ...prev, category: undefined })}
            className={`shrink-0 border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] ${!category ? "border-navy bg-navy text-navy-foreground" : "hover:border-gold"}`}>All</Link>
          {categories.map((c) => (
            <Link key={c.slug} to="/jewellery" search={(prev) => ({ ...prev, category: c.slug })}
              className={`flex shrink-0 items-center gap-2 border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] ${category === c.slug ? "border-navy bg-navy text-navy-foreground" : "hover:border-gold"}`}>
              <img src={c.image} alt="" className="h-6 w-6 rounded-full object-cover" />{c.name}
            </Link>
          ))}
        </div>

        <div className="mb-10 border-y py-5">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            <Filter label="Shop for" value={shopFor} onChange={(v) => set({ shopFor: v === "all" ? undefined : v })} options={SHOP_FOR} />
            <Filter label="Metals" value={metal} onChange={(v) => set({ metal: v === "all" ? undefined : v })} options={METALS} />
            <Filter label="Occasion" value={occasion} onChange={(v) => set({ occasion: v === "all" ? undefined : v })} options={OCCASION_OPTS} />
            <Filter label="Price" value={price} onChange={(v) => set({ price: v === "all" ? undefined : v })} options={PRICES} />
            <Filter label="Style" value={style} onChange={(v) => set({ style: v === "all" ? undefined : v })} options={STYLES} />
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <p>{list.length} {list.length === 1 ? "design" : "designs"}{cat ? ` in ${cat.name}` : ""}</p>
            <button onClick={clear} className="text-xs font-bold uppercase tracking-[0.15em] text-gold hover:underline">Clear filters</button>
          </div>
        </div>

        {list.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {list.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        ) : (
          <div className="py-24 text-center">
            <h2 className="text-3xl">New designs arriving soon</h2>
            <p className="mt-2 text-sm text-muted-foreground">Our karigars are crafting this collection. Explore everything else meanwhile.</p>
            <Link to="/jewellery" search={{}} className="btn-navy mt-6">View all jewellery</Link>
          </div>
        )}
      </div>
    </>
  );
}

type Opt = { value: string; label: string };
const SHOP_FOR: Opt[] = [
  { value: "all", label: "All" }, { value: "adult-unisex", label: "Adult – Unisex" }, { value: "men", label: "Men" },
  { value: "women", label: "Women" }, { value: "kids-unisex", label: "Kids – Unisex" }, { value: "kid-boys", label: "Kid – Boys" }, { value: "kid-girls", label: "Kid – Girls" },
];
const METALS: Opt[] = [
  { value: "all", label: "All" }, { value: "gold", label: "Gold" }, { value: "silver", label: "Silver" },
  { value: "platinum", label: "Platinum" }, { value: "diamond", label: "Diamond" }, { value: "brass", label: "Brass" },
];
const OCCASION_OPTS: Opt[] = [
  { value: "all", label: "All" },
  { value: "wedding", label: "Wedding" }, { value: "engagement", label: "Engagement" },
  { value: "anniversary", label: "Anniversary" }, { value: "birthday", label: "Birthday" },
  { value: "graduation", label: "Graduation" }, { value: "casual-wear", label: "Casual Wear" },
  { value: "party-wear", label: "Party Wear" }, { value: "festive", label: "Festive" },
  { value: "gifting", label: "Gifting" },
];
const PRICES: (Opt & { min: number; max: number })[] = [
  { value: "all", label: "All", min: 0, max: Infinity },
  { value: "0-10k", label: "₹0 – ₹10,000", min: 0, max: 10000 },
  { value: "10-20k", label: "₹10,000 – ₹20,000", min: 10000, max: 20000 },
  { value: "20-30k", label: "₹20,000 – ₹30,000", min: 20000, max: 30000 },
  { value: "30-50k", label: "₹30,000 – ₹50,000", min: 30000, max: 50000 },
  { value: "50-75k", label: "₹50,000 – ₹75,000", min: 50000, max: 75000 },
  { value: "75k-1l", label: "₹75,000 – ₹1,00,000", min: 75000, max: 100000 },
  { value: "1l+", label: "₹1,00,000 & above", min: 100000, max: Infinity },
];
const STYLES: Opt[] = [
  { value: "all", label: "All" }, { value: "pink", label: "Pink" }, { value: "rose-gold", label: "Rose Gold" },
  { value: "white", label: "White" }, { value: "yellow", label: "Yellow" }, { value: "yellow-white", label: "Yellow-White" },
];

function Filter({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: Opt[] }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className={`h-11 rounded-full border bg-card px-4 text-sm outline-none focus:border-gold ${value !== "all" ? "border-gold" : ""}`}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
