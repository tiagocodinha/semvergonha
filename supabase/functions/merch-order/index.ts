/**
 * merch-order — Supabase Edge Function
 *
 *   POST  /merch-order          cria a encomenda + a order na Paybyrd
 *                               -> { orderRef, checkoutUrl }
 *   GET   /merch-order?ref=XXX  devolve o estado de uma encomenda
 *                               -> { status }
 *
 * Variaveis de ambiente (supabase secrets set ...):
 *   PAYBYRD_API_KEY   chave da Paybyrd (test ou live — e ela que decide o modo)
 *   SITE_URL          ex. https://semvergonharestaurant.com
 *
 * Injetadas automaticamente pela Supabase:
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 * Deploy sem JWT (a pagina e publica):
 *   supabase functions deploy merch-order --no-verify-jwt
 */

import { createClient } from "npm:@supabase/supabase-js@2";
import {
  CURRENCY,
  findProduct,
  MAX_ITEMS,
  MAX_PER_SIZE,
  shippingCents,
} from "../_shared/catalog.ts";
import { corsHeaders, json } from "../_shared/cors.ts";

const PAYBYRD_ORDERS = "https://gateway.paybyrd.com/api/v2/orders";

const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const RE_ZIP_PT = /^\d{4}-\d{3}$/;

function supabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );
}

/** Referencia legivel e nao adivinhavel: SVM-20260927-7K2P9X */
function makeOrderRef(): string {
  const d = new Date();
  const ymd = [
    d.getUTCFullYear(),
    String(d.getUTCMonth() + 1).padStart(2, "0"),
    String(d.getUTCDate()).padStart(2, "0"),
  ].join("");
  const alphabet = "ACDEFGHJKLMNPQRTUVWXY34679";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  const rand = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  return `SVM-${ymd}-${rand}`;
}

function str(v: unknown, max = 200): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function splitName(full: string): { firstName: string; lastName: string } {
  const parts = full.split(/\s+/).filter(Boolean);
  if (parts.length < 2) return { firstName: full || "Cliente", lastName: "-" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

/** Normaliza um telefone PT para { countryCode, number }. */
function splitPhone(raw: string): { code: number; number: string } {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("351") && digits.length > 9) {
    return { code: 351, number: digits.slice(3) };
  }
  return { code: 351, number: digits };
}

// ────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  // ── GET: estado de uma encomenda ──────────────────────────────
  if (req.method === "GET") {
    const ref = new URL(req.url).searchParams.get("ref") ?? "";
    if (!/^SVM-\d{8}-[A-Z0-9]{6}$/.test(ref)) {
      return json({ error: "bad_ref" }, 400, origin);
    }

    const { data, error } = await supabase()
      .from("merch_orders")
      .select("status")
      .eq("order_ref", ref)
      .maybeSingle();

    if (error) {
      console.error("db_select", error);
      return json({ error: "db_error" }, 500, origin);
    }
    if (!data) return json({ error: "not_found" }, 404, origin);

    return json({ status: data.status }, 200, origin);
  }

  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405, origin);
  }

  // ── POST: criar encomenda ─────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "bad_json" }, 400, origin);
  }

  // 1 · Linhas da encomenda (produto × cor × tamanho × quantidade)
  const rawItems = Array.isArray(body.items) ? body.items : null;
  if (!rawItems || rawItems.length === 0 || rawItems.length > 40) {
    return json({ error: "no_items" }, 400, origin);
  }

  type Line = {
    productId: string;
    productName: string;
    color: string;
    size: string;
    qty: number;
    unitCents: number;
    lineCents: number;
  };

  const items: Line[] = [];
  const seen = new Set<string>();
  let unitsTotal = 0;

  for (const raw of rawItems) {
    const it = (raw ?? {}) as Record<string, unknown>;

    const product = findProduct(it.productId);
    if (!product) return json({ error: "unknown_product" }, 400, origin);

    const color = str(it.color, 40);
    if (!product.colors.includes(color)) {
      return json({ error: "unknown_color" }, 400, origin);
    }

    const size = str(it.size, 8).toUpperCase();
    if (!product.sizes.includes(size)) {
      return json({ error: "unknown_size" }, 400, origin);
    }
    if (product.soldOut.includes(size)) {
      return json({ error: "sold_out" }, 409, origin);
    }

    const qty = Number(it.qty);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_PER_SIZE) {
      return json({ error: "bad_qty" }, 400, origin);
    }

    // Uma variante nao pode vir repetida em duas linhas.
    const dedupe = `${product.id}|${color}|${size}`;
    if (seen.has(dedupe)) return json({ error: "duplicate_item" }, 400, origin);
    seen.add(dedupe);

    unitsTotal += qty;
    items.push({
      productId: product.id,
      productName: product.name,
      color,
      size,
      qty,
      unitCents: product.priceCents,
      lineCents: product.priceCents * qty,
    });
  }

  if (unitsTotal > MAX_ITEMS) {
    return json({ error: "too_many_items" }, 400, origin);
  }

  const delivery = body.delivery === "shipping" ? "shipping" : "pickup";

  // 2 · Cliente
  const c = (body.customer ?? {}) as Record<string, unknown>;
  const name = str(c.name, 120);
  const email = str(c.email, 160);
  const phoneRaw = str(c.phone, 40);
  const vat = str(c.vat, 20);

  if (!name || !RE_EMAIL.test(email) || phoneRaw.replace(/\D/g, "").length < 9) {
    return json({ error: "bad_customer" }, 400, origin);
  }
  if (vat && !/^\d{9}$/.test(vat)) {
    return json({ error: "bad_vat" }, 400, origin);
  }

  // 3 · Morada (so para envio)
  let addr: { line1: string; postalCode: string; city: string } | null = null;
  if (delivery === "shipping") {
    const a = (body.address ?? {}) as Record<string, unknown>;
    const line1 = str(a.line1, 180);
    const postalCode = str(a.postalCode, 12);
    const city = str(a.city, 80);
    if (!line1 || !city || !RE_ZIP_PT.test(postalCode)) {
      return json({ error: "bad_address" }, 400, origin);
    }
    addr = { line1, postalCode, city };
  }

  const notes = str(body.notes, 200);
  const culture = body.locale === "en-GB" ? "en-GB" : "pt-PT";

  // 4 · Totais — calculados SO aqui
  const subtotal = items.reduce((sum, l) => sum + l.lineCents, 0);
  const shipping = shippingCents(subtotal, delivery);
  const total = subtotal + shipping;

  const itemsSummary = items
    .map((l) => `${l.productName} · ${l.color} · ${l.size} × ${l.qty}`)
    .join("; ");

  const orderRef = makeOrderRef();
  const siteUrl = (Deno.env.get("SITE_URL") ?? "https://semvergonharestaurant.com")
    .replace(/\/+$/, "");
  const shopPath = (Deno.env.get("SHOP_PATH") ?? "/merchsemvergonha2026/")
    .replace(/^\/?/, "/").replace(/\/?$/, "/");
  const redirectUrl = `${siteUrl}${shopPath}?ref=${orderRef}`;

  const db = supabase();

  // 5 · Grava a encomenda ANTES de falar com a Paybyrd, para que
  //     nenhum pagamento possa existir sem registo do nosso lado.
  const { error: insertError } = await db.from("merch_orders").insert({
    order_ref: orderRef,
    status: "created",
    currency: CURRENCY,
    subtotal_cents: subtotal,
    shipping_cents: shipping,
    total_cents: total,
    items,
    items_count: unitsTotal,
    items_summary: itemsSummary,
    delivery,
    customer_name: name,
    customer_email: email,
    customer_phone: phoneRaw,
    customer_vat: vat || null,
    address_line1: addr?.line1 ?? null,
    address_postal_code: addr?.postalCode ?? null,
    address_city: addr?.city ?? null,
    address_country: addr ? "PT" : null,
    notes: notes || null,
  });

  if (insertError) {
    console.error("db_insert", insertError);
    return json({ error: "db_error" }, 500, origin);
  }

  // 6 · Cria a order na Paybyrd
  const { firstName, lastName } = splitName(name);
  const phone = splitPhone(phoneRaw);

  const cart: Record<string, unknown>[] = items.map((l) => ({
    description: `${l.productName} · ${l.color} · ${l.size} × ${l.qty}`,
    amount: l.lineCents,
    type: "Product",
    categories: ["Merch"],
  }));
  if (shipping > 0) {
    // "Shipping" nao e um type valido na Paybyrd — so aceita
    // "Product" e "Physical". Os portes vao como linha normal.
    cart.push({ description: "Portes de envio", amount: shipping, type: "Product" });
  }

  const payload = {
    isoAmount: total,
    currency: CURRENCY,
    orderRef,
    shopper: {
      firstName,
      lastName,
      email,
      phoneCountryCode: phone.code,
      phoneNumber: phone.number,
      documentNumber: vat || undefined,
      shippingAddress: addr?.line1,
      shippingPostalCode: addr?.postalCode,
      shippingCity: addr?.city,
      shippingCountry: addr ? "PRT" : undefined,
    },
    // A documentacao da Paybyrd mostra ShoppingCart como lista, mas a
    // API rejeita-a: tem de ser um objeto com a lista dentro de "items".
    ShoppingCart: { items: cart },
    orderOptions: {
      redirectUrl,
      culture,
      checkoutVersion: 2,
      expiresIn: "01:00:00",
    },
    // Sem paymentOptions de proposito: assim a Paybyrd oferece os
    // metodos que a conta tiver ativos. Fixar a lista aqui fazia a
    // encomenda rebentar com "No payment methods are available"
    // sempre que a configuracao da conta nao batesse certo.
    metadata: {
      orderRef,
      delivery,
      items: itemsSummary,
      itemsCount: String(unitsTotal),
      notes: notes || "",
    },
  };

  let pbBody: Record<string, unknown>;
  try {
    const pbRes = await fetch(PAYBYRD_ORDERS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": Deno.env.get("PAYBYRD_API_KEY") ?? "",
      },
      body: JSON.stringify(payload),
    });

    const text = await pbRes.text();
    pbBody = text ? JSON.parse(text) : {};

    if (!pbRes.ok || !pbBody.checkoutUrl) {
      console.error("paybyrd_create_failed", pbRes.status, text.slice(0, 900));
      await db.from("merch_orders")
        .update({ status: "failed", raw_paybyrd: pbBody, updated_at: new Date().toISOString() })
        .eq("order_ref", orderRef);
      return json({ error: "paybyrd_error" }, 502, origin);
    }
  } catch (err) {
    console.error("paybyrd_unreachable", err);
    await db.from("merch_orders")
      .update({ status: "failed", updated_at: new Date().toISOString() })
      .eq("order_ref", orderRef);
    return json({ error: "paybyrd_unreachable" }, 502, origin);
  }

  await db.from("merch_orders")
    .update({
      paybyrd_order_id: String(pbBody.orderId ?? ""),
      status: "pending",
      raw_paybyrd: pbBody,
      updated_at: new Date().toISOString(),
    })
    .eq("order_ref", orderRef);

  return json({ orderRef, checkoutUrl: pbBody.checkoutUrl }, 200, origin);
});
