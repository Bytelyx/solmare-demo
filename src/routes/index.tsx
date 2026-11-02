import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Repeat,
  BadgeIndianRupee,
  Truck,
  Headset,
  Quote,
} from "lucide-react";
import hero from "@/assets/hero.jpg";
import heroVideo from "@/assets/hero-video.mp4";
import bridal from "@/assets/bridal.jpg";
import everyday from "@/assets/everyday.jpg";
import craft from "@/assets/craft.jpg";
import bannerBridal from "@/assets/banner-bridal.jpg";
import bannerSolitaire from "@/assets/banner-solitaire.jpg";
import bannerEveryday from "@/assets/banner-everyday.jpg";
import { categories, products, testimonials } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Solmare — Fine Gold & Diamond Jewellery" },
      {
        name: "description",
        content:
          "Discover rings, earrings, mangalsutras and solitaires in 18Kt & 22Kt hallmarked gold. Made for your moments.",
      },
      { property: "og:title", content: "Solmare — Fine Gold & Diamond Jewellery" },
      {
        property: "og:description",
        content: "Rings, earrings, mangalsutras and solitaires in hallmarked gold.",
      },
    ],
  }),
  component: Home,
});

const tabs = ["all", "rings", "earrings", "solitaires", "mangalsutras", "bangles"];
const banners = [
  {
    image: bannerBridal,
    alt: "The Bridal Trousseau — discover the collection",
    to: "/collections" as const,
    search: {},
  },
  {
    image: bannerSolitaire,
    alt: "The Solitaire Edit — certified diamonds",
    to: "/jewellery" as const,
    search: { category: "solitaires" },
  },
  {
    image: bannerEveryday,
    alt: "Everyday Gold — under ₹40,000",
    to: "/jewellery" as const,
    search: { metal: "gold" },
  },
  {
    image: bridal,
    alt: "Bridal gold jewellery collection",
    to: "/collections" as const,
    search: {},
  },
];

/*
 * Full-width coverflow slider.
 * The track is the banner list in normal order, repeated 3x, so the slide
 * peeking on the RIGHT is always the next banner and the one peeking on the
 * LEFT is always the previous one. Advancing raises the track index, which
 * slides the right banner into the centre — the strip only ever travels one
 * way, so the last banner hands over to the first without playing backward.
 */
function BannerSlider() {
  const n = banners.length;
  const track = Array.from({ length: n * 3 }, (_, k) => banners[k % n]!);
  const [k, setK] = useState(n); // centre banner 0 at start
  const [anim, setAnim] = useState(true);

  const next = () => setK((x) => x + 1);
  const prev = () => setK((x) => x - 1);

  // Auto-advance forward every 5s; resets after any manual move.
  useEffect(() => {
    const t = setInterval(() => setK((x) => x + 1), 5000);
    return () => clearInterval(t);
  }, [k]);

  // Re-centre the index window without a visible jump (same banner shows).
  useEffect(() => {
    if (k >= n && k < 2 * n) return;
    const t = setTimeout(() => {
      setAnim(false);
      setK((x) => x + (x < n ? n : -n));
    }, 720);
    return () => clearTimeout(t);
  }, [k, n]);

  useEffect(() => {
    if (anim) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setAnim(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [anim]);

  const active = ((k % n) + n) % n;

  const goTo = (j: number) => {
    const base = n + j;
    setK([base - n, base, base + n].reduce((a, b) => (Math.abs(b - k) < Math.abs(a - k) ? b : a)));
  };

  return (
    <div className="overflow-hidden [--peak:6vw] [--sw:88vw] md:[--peak:11vw] md:[--sw:78vw]">
      <div
        className="flex w-max"
        style={{
          transform: `translate3d(calc(var(--peak) - ${k} * var(--sw)), 0, 0)`,
          transition: anim ? "transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1)" : "none",
        }}
      >
        {track.map((b, idx) => {
          const on = idx === k;
          return (
            <div key={idx} className="w-[var(--sw)] shrink-0 px-1.5 md:px-3">
              <Link
                to={b.to}
                search={b.search}
                className={`block aspect-[16/9] overflow-hidden rounded-3xl shadow-soft transition duration-700 md:aspect-[21/8] ${
                  on ? "scale-100 opacity-100" : "scale-[0.93] opacity-45"
                }`}
              >
                <img
                  src={b.image}
                  alt={b.alt}
                  loading={idx === k ? "eager" : "lazy"}
                  className="h-full w-full object-cover"
                />
              </Link>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-5">
        <button
          aria-label="Previous banner"
          onClick={prev}
          className="grid h-10 w-10 place-items-center rounded-full border border-gold/50 bg-navy/60 text-gold backdrop-blur transition hover:bg-gold hover:text-navy"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2.5">
          {banners.map((_, j) => (
            <button
              key={j}
              aria-label={`Go to banner ${j + 1}`}
              onClick={() => goTo(j)}
              className={`h-2.5 rounded-full transition-all ${j === active ? "w-8 bg-gold" : "w-2.5 bg-gold/40 hover:bg-gold/70"}`}
            />
          ))}
        </div>
        <button
          aria-label="Next banner"
          onClick={next}
          className="grid h-10 w-10 place-items-center rounded-full border border-gold/50 bg-navy/60 text-gold backdrop-blur transition hover:bg-gold hover:text-navy"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

const promise = [
  {
    icon: ShieldCheck,
    t: "Certified Jewellery",
    d: "Trusted quality standards and purity certification.",
  },
  { icon: RotateCcw, t: "Easy Returns", d: "A simple, transparent 15-day return experience." },
  { icon: Repeat, t: "Lifetime Exchange", d: "Exchange your Solmare jewellery, any time." },
  {
    icon: BadgeIndianRupee,
    t: "Transparent Pricing",
    d: "Clear breakup of gold, stones and making.",
  },
  { icon: Truck, t: "Secure Delivery", d: "Insured, tamper-proof delivery to your door." },
  { icon: Headset, t: "Customer Care", d: "Jewellery experts on call, 7 days a week." },
];

function Home() {
  const [tab, setTab] = useState("all");
  const curated = products.filter((p) => tab === "all" || p.category === tab).slice(0, 8);

  return (
    <>
      {/* Hero: video background with full-width banner slider on top */}
      <section className="relative overflow-hidden bg-navy">
        <video
          src={heroVideo}
          poster={hero}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-background" />
        <div className="relative pb-12 pt-[32vh] md:pt-[40vh]">
          <BannerSlider />
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="mb-12 text-center">
          <p className="eyebrow">Find your piece</p>
          <h2 className="mt-3 text-4xl md:text-5xl">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/jewellery"
              search={{ category: c.slug }}
              className="group text-center"
            >
              <div className="mx-auto aspect-square w-full max-w-[120px] overflow-hidden rounded-full border border-border bg-secondary transition group-hover:border-gold group-hover:shadow-soft">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider group-hover:text-gold">
                {c.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Editorial split */}
      <section className="mx-auto grid max-w-7xl gap-4 px-4 md:grid-cols-5 md:px-8">
        <Link to="/collections" className="group relative overflow-hidden md:col-span-3">
          <img
            src={bridal}
            alt="Bridal gold jewellery on navy velvet"
            loading="lazy"
            width={1408}
            height={1008}
            className="h-full min-h-[380px] w-full object-cover transition duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />
          <div className="absolute bottom-0 p-8 text-navy-foreground md:p-10">
            <p className="eyebrow">Collection</p>
            <h3 className="mt-2 text-4xl md:text-5xl">The Bridal Trousseau</h3>
            <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]">
              Discover <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
        <Link
          to="/jewellery"
          search={{ category: "rings" }}
          className="group relative overflow-hidden md:col-span-2"
        >
          <img
            src={everyday}
            alt="Stacked gold rings and bracelet"
            loading="lazy"
            width={1200}
            height={1408}
            className="h-full min-h-[380px] w-full object-cover transition duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
          <div className="absolute bottom-0 p-8 text-navy-foreground">
            <p className="eyebrow">Under ₹40,000</p>
            <h3 className="mt-2 text-4xl">Everyday Gold</h3>
            <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]">
              Shop now <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </section>

      {/* Curated */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
        <div className="mb-10 flex flex-col items-center gap-6 text-center">
          <div>
            <p className="eyebrow">Iconic designs</p>
            <h2 className="mt-3 text-4xl md:text-5xl">Curated Fine Jewellery</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Everyday brilliance sculpted in 18Kt & 22Kt hallmarked gold.
            </p>
          </div>
          <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`shrink-0 rounded-full border px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] transition ${tab === t ? "border-gold bg-gold text-navy" : "border-border hover:border-gold"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {curated.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/jewellery" className="btn-navy">
            View all jewellery
          </Link>
        </div>
      </section>

      {/* Craft */}
      <section className="bg-secondary">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:grid-cols-2 md:px-8">
          <img
            src={craft}
            alt="Goldsmith setting a diamond"
            loading="lazy"
            width={1200}
            height={1408}
            className="aspect-[4/5] w-full object-cover shadow-soft"
          />
          <div>
            <p className="eyebrow">The atelier</p>
            <h2 className="mt-3 text-4xl md:text-5xl">
              Every piece passes through <em className="text-gold">forty hands.</em>
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              From the first sketch to the final polish, our master karigars shape each design by
              hand — setting every diamond under the loupe, checking every clasp twice.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6 border-t pt-8">
              {[
                ["25+", "Years of craft"],
                ["1.2L", "Happy customers"],
                ["100%", "Hallmarked"],
              ].map(([n, l]) => (
                <div key={l}>
                  <p className="font-display text-4xl text-gold">{n}</p>
                  <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                    {l}
                  </p>
                </div>
              ))}
            </div>
            <Link to="/about" className="btn-outline mt-10">
              Our story
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
        <div className="mb-12 text-center">
          <p className="eyebrow">Loved by you</p>
          <h2 className="mt-3 text-4xl md:text-5xl">Treasured for a lifetime</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col border bg-card p-8 transition hover:shadow-soft"
            >
              <Quote className="h-8 w-8 text-gold" />
              <blockquote className="mt-4 flex-1 font-display text-xl italic leading-snug">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-4 border-t pt-6">
                <img
                  src={t.image}
                  alt={t.name}
                  loading="lazy"
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">Loved: {t.loved}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Promise */}
      <section className="bg-gradient-navy text-navy-foreground">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <div className="mb-12 text-center">
            <p className="eyebrow">The Solmare difference</p>
            <h2 className="mt-3 text-4xl md:text-5xl">The Solmare Promise</h2>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
            {promise.map(({ icon: Icon, t, d }) => (
              <div key={t} className="text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-gold/50">
                  <Icon className="h-6 w-6 text-gold-soft" />
                </div>
                <h3 className="mt-4 text-lg">{t}</h3>
                <p className="mt-2 text-xs leading-relaxed text-navy-foreground/65">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
