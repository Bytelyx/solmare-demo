import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CartLine = { slug: string; qty: number };
type Ctx = {
  lines: CartLine[];
  count: number;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const CartContext = createContext<Ctx | null>(null);
const KEY = "solmare-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const add = (slug: string, qty = 1) =>
    setLines((l) => {
      const f = l.find((x) => x.slug === slug);
      return f ? l.map((x) => (x.slug === slug ? { ...x, qty: x.qty + qty } : x)) : [...l, { slug, qty }];
    });
  const setQty = (slug: string, qty: number) =>
    setLines((l) => (qty <= 0 ? l.filter((x) => x.slug !== slug) : l.map((x) => (x.slug === slug ? { ...x, qty } : x))));
  const remove = (slug: string) => setLines((l) => l.filter((x) => x.slug !== slug));
  const clear = () => setLines([]);
  const count = lines.reduce((s, l) => s + l.qty, 0);

  return <CartContext.Provider value={{ lines, count, add, setQty, remove, clear }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
