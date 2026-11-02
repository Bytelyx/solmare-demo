export function PageHero({ eyebrow, title, subtitle, image }: { eyebrow: string; title: string; subtitle?: string; image?: string }) {
  return (
    <section className="relative overflow-hidden bg-gradient-navy text-navy-foreground">
      {image && <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />}
      <div className="relative mx-auto max-w-7xl px-4 py-20 text-center md:px-8 md:py-28">
        <p className="eyebrow animate-rise">{eyebrow}</p>
        <h1 className="mt-4 animate-rise text-4xl md:text-6xl">{title}</h1>
        {subtitle && <p className="mx-auto mt-4 max-w-xl animate-rise text-sm text-navy-foreground/75 md:text-base">{subtitle}</p>}
      </div>
    </section>
  );
}
