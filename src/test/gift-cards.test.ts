import { describe, expect, it } from "vitest";
import { products, getProduct } from "@/data/products";

describe("Gift cards", () => {
  it("offers the four fixed denominations", () => {
    const cards = products.filter((p) => p.category === "gift-cards");
    expect(cards.map((c) => c.price).sort((a, b) => a - b)).toEqual([5000, 10000, 25000, 50000]);
  });

  it("resolves every gift card slug so the bag can find it", () => {
    for (const slug of ["gift-card-5000", "gift-card-10000", "gift-card-25000", "gift-card-50000"]) {
      expect(getProduct(slug)?.category).toBe("gift-cards");
    }
  });

  it("never shows a discount on a gift card", () => {
    for (const c of products.filter((p) => p.category === "gift-cards")) {
      expect(c.mrp).toBe(c.price);
    }
  });
});
