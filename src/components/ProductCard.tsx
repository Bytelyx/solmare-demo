import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { toast } from "sonner";
import { formatINR, getCategory, type Product } from "@/data/products";
import { useCart } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const off = Math.round((1 - product.price / product.mrp) * 100);
  const [a, b] = product.images;
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition hover:border-gold/40 hover:shadow-soft">
      <Link to="/product/$slug" params={{ slug: product.slug }} className="relative block aspect-square overflow-hidden bg-secondary">
        <img src={a} alt={product.name} loading="lazy" className={`absolute inset-0 h-full w-full object-contain p-6 transition duration-700 group-hover:scale-105 ${b ? "group-hover:opacity-0" : ""}`} />
        {b && <img src={b} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-contain p-6 opacity-0 transition duration-700 group-hover:opacity-100" />}
        <span className="absolute left-3 top-3 rounded-full bg-navy px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-navy-foreground">
          {product.badge ?? `Sale · -${off}%`}
        </span>
        <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-border bg-navy/80 text-foreground/80 transition hover:text-gold"><Heart className="h-4 w-4" /></span>
      </Link>
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <span className="text-[10px] uppercase tracking-[0.25em] text-gold">{getCategory(product.category)?.name}</span>
        <Link to="/product/$slug" params={{ slug: product.slug }} className="mt-2 font-display text-lg leading-tight hover:text-gold md:text-xl">{product.name}</Link>
        <span className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><Star className="h-3 w-3 fill-gold text-gold" />{product.rating}</span>
        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <span className="font-semibold">{formatINR(product.price)}</span>
          <span className="text-xs text-muted-foreground line-through">{formatINR(product.mrp)}</span>
        </div>
        <button
          onClick={() => { add(product.slug); toast.success(`${product.name} added to your bag`); }}
          className="mt-4 rounded-full border border-gold/50 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] transition hover:bg-gold hover:text-navy">
          Add to cart
        </button>
      </div>
    </div>
  );
}
