import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { formatINR, getProduct } from "@/data/products";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag — Solmare" },
      { name: "description", content: "Review the jewellery in your Solmare shopping bag." },
      { property: "og:title", content: "Your Bag — Solmare" },
      { property: "og:description", content: "Review the jewellery in your shopping bag." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { lines, setQty, remove, clear } = useCart();
  const items = lines.map((l) => ({ ...l, p: getProduct(l.slug) })).filter((x) => x.p);
  const subtotal = items.reduce((s, x) => s + x.p!.price * x.qty, 0);
  const savings = items.reduce((s, x) => s + (x.p!.mrp - x.p!.price) * x.qty, 0);

  if (!items.length)
    return (
      <div className="mx-auto max-w-xl px-4 py-32 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-gold" />
        <h1 className="mt-6 text-4xl">Your bag is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">Let's find something you'll treasure.</p>
        <Link to="/jewellery" className="btn-navy mt-8">Start shopping</Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
      <h1 className="mb-10 text-4xl md:text-5xl">Your Bag</h1>
      <div className="grid gap-10 lg:grid-cols-3">
        <ul className="divide-y border-y lg:col-span-2">
          {items.map(({ p, qty }) => (
            <li key={p!.slug} className="flex gap-4 py-6 sm:gap-6">
              <Link to="/product/$slug" params={{ slug: p!.slug }} className="h-24 w-24 shrink-0 bg-secondary sm:h-32 sm:w-32">
                <img src={p!.images[0]} alt={p!.name} className="h-full w-full object-contain p-3" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-3">
                  <div>
                    <Link to="/product/$slug" params={{ slug: p!.slug }} className="font-display text-xl hover:text-gold">{p!.name}</Link>
                    <p className="text-xs text-muted-foreground">{p!.metal}</p>
                  </div>
                  <p className="font-semibold">{formatINR(p!.price * qty)}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <div className="flex items-center border">
                    <button aria-label="Decrease" className="px-2 py-2" onClick={() => setQty(p!.slug, qty - 1)}><Minus className="h-3 w-3" /></button>
                    <span className="w-8 text-center text-sm">{qty}</span>
                    <button aria-label="Increase" className="px-2 py-2" onClick={() => setQty(p!.slug, qty + 1)}><Plus className="h-3 w-3" /></button>
                  </div>
                  <button onClick={() => remove(p!.slug)} className="flex items-center gap-1 text-xs uppercase tracking-widest text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" />Remove</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <aside className="h-fit bg-secondary p-8">
          <h2 className="text-2xl">Order summary</h2>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatINR(subtotal)}</dd></div>
            {savings > 0 && <div className="flex justify-between text-mauve"><dt>You save</dt><dd>{formatINR(savings)}</dd></div>}
            <div className="flex justify-between"><dt>Shipping</dt><dd>Free</dd></div>
            <div className="flex justify-between border-t pt-4 text-lg font-semibold"><dt>Total</dt><dd>{formatINR(subtotal)}</dd></div>
          </dl>
          <button className="btn-gold mt-8 w-full" onClick={() => { clear(); toast.success("Order placed! Thank you for choosing Solmare."); }}>Checkout</button>
          <p className="mt-3 text-center text-xs text-muted-foreground">Insured delivery in 5–7 days</p>
        </aside>
      </div>
    </div>
  );
}
