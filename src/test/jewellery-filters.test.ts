import { describe, expect, it } from "vitest";

import { products, occasionsOf, materialsOf, type Product } from "@/data/products";
import { Route } from "@/routes/jewellery";

const bySlug = (slug: string) => products.find((p) => p.slug === slug)!;

describe("Jewellery occasion tags", () => {
  it("tags the solitaire for wedding and engagement", () => {
    expect(occasionsOf(bySlug("the-solitaire-majestic-ring"))).toEqual(
      expect.arrayContaining(["wedding", "engagement"]),
    );
  });

  it("tags the gold coin for gifting and festive", () => {
    expect(occasionsOf(bySlug("lakshmi-ganesh-gold-coin-5g"))).toEqual(
      expect.arrayContaining(["gifting", "festive"]),
    );
  });

  it("falls back to the category tags for a product with no curated entry", () => {
    const kidRing: Product = { ...bySlug("the-humaira-slider-ring"), slug: "unknown-kid-ring", category: "kids" };
    expect(occasionsOf(kidRing)).toEqual(expect.arrayContaining(["birthday", "gifting"]));
  });
});

describe("Jewellery metals", () => {
  it("recognises platinum as a metal", () => {
    const platinum: Product = { ...bySlug("the-humaira-slider-ring"), metal: "Platinum" };
    expect(materialsOf(platinum)).toEqual(["platinum"]);
  });
});

describe("Jewellery filter search params", () => {
  const validate = Route.options.validateSearch as (s: Record<string, unknown>) => Record<string, string | undefined>;

  it("keeps the metal picked from the top navigation", () => {
    expect(validate({ metal: "gold" })).toMatchObject({ metal: "gold", occasion: undefined });
  });

  it("keeps the occasion picked from the filter bar", () => {
    expect(validate({ occasion: "wedding", category: "rings" })).toMatchObject({
      occasion: "wedding",
      category: "rings",
    });
  });

  it("drops blank values so the URL stays clean", () => {
    expect(validate({ metal: "", occasion: "" })).toMatchObject({ metal: undefined, occasion: undefined });
  });
});
