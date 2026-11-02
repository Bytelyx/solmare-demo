import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Check, Gift, Mail, ShoppingBag, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "@/components/PageHero";
import { formatINR } from "@/data/products";
import { useCart } from "@/lib/cart";
import gc1 from "@/assets/gift-card-1.jpg";
import gc2 from "@/assets/gift-card-2.jpg";
import gc3 from "@/assets/gift-card-3.jpg";
import gc4 from "@/assets/gift-card-4.jpg";

export const Route = createFileRoute("/gift-cards")({
  head: () => ({
    meta: [
      { title: "Gift Cards — Solmare" },
      { name: "description", content: "Solmare gift cards from ₹5,000 — delivered by email in minutes or in a keepsake box. Redeemable on all designs, online and in store." },
      { property: "og:title", content: "Gift Cards — Solmare" },
      { property: "og:description", content: "The gift of choice: hallmarked gold and certified diamonds, theirs to pick. From ₹5,000." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: GiftCards,
});

const CARDS = [
  { slug: "gift-card-5000", value: 5000, name: "The Mint", img: gc1, note: "A lovely start — perfect as a little something with the big gift." },
  { slug: "gift-card-10000", value: 10000, name: "The Radiant", img: gc2, note: "Covers a beautiful pair of studs or a fine gold chain." },
  { slug: "gift-card-25000", value: 25000, name: "The Heirloom", img: gc3, note: "Opens the door to diamond pendants and 22Kt pieces." },
  { slug: "gift-card-50000", value: 50000, name: "The Sovereign", img: gc4, note: "For the grandest gestures — solitaires and statement sets." },
];

const STEPS = [
  { title: "Pick the amount", copy: "Choose a card from ₹5,000 to ₹50,000 and add it to your bag — checkout stays exactly as simple as any other purchase." },
  { title: "We deliver it your way", copy: "An elegant e-gift lands in their inbox within minutes, or a keepsake card in a Solmare box reaches their doorstep in 5–7 days." },
  { title: "They choose their treasure", copy: "Valid for 12 months, redeemable on every design — online and at our store. The choice, the sparkle, all theirs." },
];

const FAQS = [
  { q: "How is the gift card delivered?", a: "Instantly by email for e-gifts, or in a beautifully packaged card and envelope at the shipping address you choose." },
  { q: "Where can it be used?", a: "On every design across the Solmare website and in our store — rings, bangles, mangalsutras, solitaires and gold coins." },
  { q: "Does it expire?", a: "Your card is valid for 12 months from the date of purchase, and any unused balance stays on the card until then." },
  { q: "Can I personalise it?", a: "Yes — add your message at checkout and we'll include it on the card, handwritten for boxed gifts." },
];

function GiftCards() {
  const { add } = useCart();
  return (
    <>
      <PageHero eyebrow="The gift of choice" title="Solmare Gift Cards" subtitle="When you know the person, but not the piece. Hallmarked gold and certified diamonds — theirs to choose." image={gc3} />

      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">From ₹5,000</p>
          <h2 className="mt-3 text-4xl md:text-5xl">Choose their sparkle</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            Every card arrives with the Solmare promise — BIS-hallmarked gold, certified diamonds and 15-day returns on whatever they pick.
          </p>
        </div>

        <div className="mt-14 grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c) => (
            <article key={c.slug} className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:border-gold/60 hover:shadow-soft">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={c.img} alt={`${c.name} gift card`} width={1024} height={1024} loading="lazy" className="h-full w-full object-cover transition duration-1000 group-hover:scale-105" />
              </div>
              <div className="flex flex-col gap-1 p-5">
                <p className="eyebrow">{c.name}</p>
                <p className="text-2xl font-semibold text-gold">{formatINR(c.value)}</p>
                <p className="mt-1 min-h-10 text-xs leading-relaxed text-muted-foreground">{c.note}</p>
                <button
                  className="btn-outline mt-3 w-full justify-center"
                  onClick={() => { add(c.slug); toast.success(`₹${c.value.toLocaleString("en-IN")} gift card added to your bag`); }}
                >
                  <ShoppingBag className="h-4 w-4" /> Add to bag
                </button>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">Need a different amount? <Link to="/contact" className="font-semibold text-gold hover:underline">Tell us the value</Link> and we'll craft a card for it.</p>
      </div>

      <section className="border-y bg-secondary/60 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-3 text-4xl">Three steps to a perfect gift</h2>
          </div>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="text-center">
                <span className="font-display text-6xl text-gradient-gold">0{i + 1}</span>
                <h3 className="mt-4 text-2xl">{s.title}</h3>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">{s.copy}</p>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-12 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.2em] text-foreground/70">
            <span className="flex items-center gap-2"><Check className="h-4 w-4 text-gold" />Valid 12 months</span>
            <span className="flex items-center gap-2"><Check className="h-4 w-4 text-gold" />Online &amp; in store</span>
            <span className="flex items-center gap-2"><Check className="h-4 w-4 text-gold" />Partial redemption allowed</span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:px-8 md:py-20 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl">
          <img src={gc1} alt="Solmare e-gift card artwork" width={1024} height={1024} loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-1000 hover:scale-105" />
          <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-xl bg-navy/85 px-5 py-4 backdrop-blur">
            <Mail className="h-5 w-5 shrink-0 text-gold" />
            <p className="text-xs leading-snug text-navy-foreground/90 md:text-sm">Last-minute? E-gifts land in the inbox within minutes of checkout.</p>
          </div>
        </div>
        <div>
          <p className="eyebrow"><Sparkles className="mr-2 inline h-4 w-4" />Made for the moment</p>
          <h2 className="mt-3 text-4xl md:text-5xl">Birthdays, weddings, just-because</h2>
          <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
            A Solmare card never guesses wrong. They take their time, try pieces at home or at our store, and choose something they'll wear for years.
          </p>
          <ul className="mt-8 space-y-4 text-sm">
            {FAQS.map((f) => (
              <li key={f.q} className="border-b pb-4">
                <p className="font-semibold">{f.q}</p>
                <p className="mt-1 text-muted-foreground">{f.a}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-navy py-16 text-navy-foreground md:py-20">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 text-center md:px-8">
          <Gift className="h-8 w-8 text-gold" />
          <h2 className="text-3xl md:text-5xl">Gifting for a team or a wedding party?</h2>
          <p className="max-w-xl text-sm text-navy-foreground/75 md:text-base">
            Bulk gift cards with custom values, personal messages and a dedicated concierge — for employees, bridesmaids and everyone who made the day.
          </p>
          <Link to="/contact" className="btn-gold"><Building2 className="h-4 w-4" /> Talk to our gifting desk</Link>
        </div>
      </section>
    </>
  );
}
