/**
 * CATALOGO DO SERVIDOR — fonte de verdade dos precos.
 *
 * IMPORTANTE: tem de espelhar CONFIG em /merchsemvergonha2026/merch.js.
 * O browser envia apenas IDs (produto, cor, tamanho, quantidade);
 * o preco cobrado e SEMPRE calculado aqui. Nunca confiar no cliente.
 *
 * Valores em centimos para evitar erros de virgula flutuante.
 */

export type Product = {
  id: string;
  name: string;
  priceCents: number;
  colors: string[];
  sizes: string[];
  soldOut: string[];
};

export const PRODUCTS: Product[] = [
  {
    id: "tee-vergonha",
    name: "T-Shirt • A Vergonha é inimiga da Perfeição",
    priceCents: 2490,
    colors: ["branco", "castanho"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    soldOut: [],
  },
  {
    id: "tee-amigos",
    name: "T-Shirt • Amigos Amigos Vergonha à Parte",
    priceCents: 2790,
    colors: ["branco", "castanho"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    soldOut: [],
  },
];

export const SHIPPING = {
  /** Portes para Portugal Continental, em centimos. */
  feeCents: 450,
  /** Gratis a partir deste subtotal, em centimos. null = nunca gratis. */
  freeFromCents: 5000 as number | null,
};

/** Maximo por linha (cor+tamanho) e total de pecas por encomenda. */
export const MAX_PER_SIZE = 5;
export const MAX_ITEMS = 10;

export const CURRENCY = "EUR";

export function findProduct(id: unknown): Product | null {
  if (typeof id !== "string") return null;
  return PRODUCTS.find((p) => p.id === id) ?? null;
}

export function shippingCents(subtotalCents: number, delivery: string): number {
  if (delivery !== "shipping") return 0;
  if (SHIPPING.freeFromCents !== null && subtotalCents >= SHIPPING.freeFromCents) return 0;
  return SHIPPING.feeCents;
}
