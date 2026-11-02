import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { categories } from "@/data/products";

export function SiteFooter() {
  const [done, setDone] = useState(false);
  return (
    <footer className="bg-gradient-navy text-navy-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-12 border-b border-navy-foreground/15 pb-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="font-display text-3xl tracking-[0.35em]">SOL<span className="text-gradient-gold">MARE</span></p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-foreground/70">
              Fine jewellery in 18Kt & 22Kt hallmarked gold — made for your moments, treasured for a lifetime.
            </p>
            <form className="mt-6 flex max-w-sm" onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
              <input required type="email" placeholder="Your email" aria-label="Email"
                className="w-full border border-navy-foreground/25 bg-transparent px-4 py-3 text-sm placeholder:text-navy-foreground/50 focus:border-gold focus:outline-none" />
              <button className="btn-gold !px-5">Join</button>
            </form>
            {done && <p className="mt-2 text-xs text-gold-soft">Thank you — you're on the list.</p>}
          </div>
          <div>
            <h4 className="eyebrow mb-5">Shop</h4>
            <ul className="space-y-3 text-sm text-navy-foreground/75">
              {categories.slice(0, 6).map((c) => (
                <li key={c.slug}><Link to="/jewellery" search={{ category: c.slug }} className="hover:text-gold-soft">{c.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="eyebrow mb-5">Solmare</h4>
            <ul className="space-y-3 text-sm text-navy-foreground/75">
              <li><Link to="/about" className="hover:text-gold-soft">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-gold-soft">Contact</Link></li>
              <li><Link to="/collections" className="hover:text-gold-soft">Collections</Link></li>
              <li><Link to="/contact" className="hover:text-gold-soft">Book an appointment</Link></li>
              <li><Link to="/cart" className="hover:text-gold-soft">Your bag</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="eyebrow mb-5">Visit</h4>
            <ul className="space-y-3 text-sm text-navy-foreground/75">
              <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-gold" />Linking Road, Bandra West, Mumbai</li>
              <li className="flex gap-2"><Phone className="h-4 w-4 text-gold" />+91 98765 43210</li>
              <li className="flex gap-2"><Mail className="h-4 w-4 text-gold" />care@solmare.in</li>
            </ul>
            <div className="mt-5 flex gap-4">
              <a href="#" aria-label="Instagram" className="hover:text-gold"><Instagram className="h-5 w-5" /></a>
              <a href="#" aria-label="Facebook" className="hover:text-gold"><Facebook className="h-5 w-5" /></a>
              <a href="#" aria-label="YouTube" className="hover:text-gold"><Youtube className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
        <p className="pt-8 text-center text-xs tracking-widest text-navy-foreground/50">© {new Date().getFullYear()} SOLMARE FINE JEWELLERY. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  );
}
