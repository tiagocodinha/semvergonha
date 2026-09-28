/**
 * merch-webhook — Supabase Edge Function
 *
 * Recebe os eventos da Paybyrd (order.paid, order.canceled, ...),
 * CONFIRMA o estado real na API da Paybyrd (nunca confia no corpo do
 * webhook), atualiza a tabela e envia os emails de confirmacao.
 *
 * Variaveis de ambiente:
 *   PAYBYRD_API_KEY          chave da Paybyrd
 *   PAYBYRD_WEBHOOK_SECRET   valor que configuras na Paybyrd como x-api-key
 *   RESEND_API_KEY           (opcional) para enviar emails
 *   MERCH_EMAIL_FROM         ex. "Sem Vergonha <merch@semvergonharestaurant.com>"
 *   MERCH_EMAIL_TO           ex. "hey@semvergonharestaurant.com"
 *
 * Deploy:
 *   supabase functions deploy merch-webhook --no-verify-jwt
 */

import { createClient } from "npm:@supabase/supabase-js@2";

const PAYBYRD_ORDERS = "https://gateway.paybyrd.com/api/v2/orders";

type OrderItem = {
  productName: string;
  color: string;
  size: string;
  qty: number;
  lineCents: number;
};

type OrderRow = {
  order_ref: string;
  status: string;
  items: OrderItem[];
  items_count: number;
  items_summary: string;
  delivery: string;
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_vat: string | null;
  address_line1: string | null;
  address_postal_code: string | null;
  address_city: string | null;
  notes: string | null;
  notified_at: string | null;
};

function db() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );
}

function eur(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!
  );
}

/** Comparacao em tempo constante, para o segredo do webhook. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// ─────────────────────────── Emails ───────────────────────────

async function sendEmail(to: string, subject: string, html: string) {
  const key = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("MERCH_EMAIL_FROM");
  if (!key || !from) {
    console.log("email_skipped_no_config", { to, subject });
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    console.error("email_failed", res.status, (await res.text()).slice(0, 500));
  }
}

function shellHtml(title: string, inner: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f6ede4;padding:32px 16px;font-family:Helvetica,Arial,sans-serif;color:#3d3330">
  <div style="max-width:560px;margin:0 auto;background:#fffaf6;border:1px solid rgba(117,92,85,.14);border-radius:16px;padding:32px">
    <h1 style="margin:0 0 20px;font-size:22px;color:#3d3330">${esc(title)}</h1>
    ${inner}
    <p style="margin:28px 0 0;padding-top:20px;border-top:1px solid rgba(117,92,85,.14);font-size:12px;color:#a89890">
      Sem Vergonha · Av. da República 6, 2450-104 Nazaré · 936 437 156
    </p>
  </div></body></html>`;
}

function orderTable(o: OrderRow): string {
  const row = (k: string, v: string) =>
    `<tr><td style="padding:7px 0;font-size:13px;color:#7a6b63">${esc(k)}</td>
         <td style="padding:7px 0;font-size:13px;text-align:right;color:#3d3330"><strong>${esc(v)}</strong></td></tr>`;

  const entrega = o.delivery === "shipping"
    ? `Envio — ${o.address_line1}, ${o.address_postal_code} ${o.address_city}`
    : "Levantamento no restaurante";

  const itemRows = (o.items ?? [])
    .map((l) =>
      row(`${l.productName} · ${l.color} · ${l.size} × ${l.qty}`, eur(l.lineCents))
    )
    .join("");

  return `<table style="width:100%;border-collapse:collapse">
    ${row("Referência", o.order_ref)}
    ${itemRows}
    ${row("Subtotal", eur(o.subtotal_cents))}
    ${row("Portes", o.shipping_cents ? eur(o.shipping_cents) : "Grátis")}
    ${row("Total pago", eur(o.total_cents))}
    ${row("Entrega", entrega)}
    ${o.customer_vat ? row("NIF", o.customer_vat) : ""}
    ${o.notes ? row("Notas", o.notes) : ""}
  </table>`;
}

async function notifyPaid(o: OrderRow) {
  const to = Deno.env.get("MERCH_EMAIL_TO") ?? "hey@semvergonharestaurant.com";

  await sendEmail(
    to,
    `Nova encomenda de merch — ${o.order_ref}`,
    shellHtml("Nova encomenda paga", `
      <p style="margin:0 0 20px;font-size:14px;line-height:1.7;color:#7a6b63">
        ${esc(o.customer_name)} · ${esc(o.customer_email)} · ${esc(o.customer_phone)}
      </p>
      ${orderTable(o)}`),
  );

  const seguimento = o.delivery === "shipping"
    ? "Vamos preparar a tua encomenda e enviá-la para a morada que indicaste. Normalmente chega em 3 a 5 dias úteis."
    : "Assim que estiver pronta avisamos-te por email para vires levantar ao restaurante, na Av. da República 6, Nazaré.";

  await sendEmail(
    o.customer_email,
    `Encomenda confirmada — ${o.order_ref}`,
    shellHtml("Obrigado! Está confirmado.", `
      <p style="margin:0 0 20px;font-size:14px;line-height:1.7;color:#7a6b63">
        Olá ${esc(o.customer_name.split(" ")[0])}, recebemos o teu pagamento. ${esc(seguimento)}
      </p>
      ${orderTable(o)}`),
  );
}

// ────────────────────────── Handler ──────────────────────────

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("method_not_allowed", { status: 405 });
  }

  // 1 · Autenticacao do webhook
  const expected = Deno.env.get("PAYBYRD_WEBHOOK_SECRET") ?? "";
  const received = req.headers.get("x-api-key") ?? "";
  if (!expected || !safeEqual(received, expected)) {
    console.warn("webhook_unauthorized");
    return new Response("unauthorized", { status: 401 });
  }

  let event: Record<string, unknown>;
  try {
    event = await req.json();
  } catch {
    return new Response("bad_json", { status: 400 });
  }

  // A Paybyrd varia o envelope entre eventos; aceitamos as formas conhecidas.
  const data = (event.data ?? event.order ?? event) as Record<string, unknown>;
  const orderId = String(data.orderId ?? data.id ?? "");
  const orderRef = String(data.orderRef ?? "");

  if (!orderId && !orderRef) {
    console.error("webhook_no_order_id", JSON.stringify(event).slice(0, 600));
    // 200 para a Paybyrd nao ficar a repetir um evento que nunca vamos processar.
    return new Response("ignored", { status: 200 });
  }

  // 2 · Confirma o estado real na Paybyrd (nunca confiar no corpo recebido)
  let status = "";
  let confirmed: Record<string, unknown> | null = null;

  if (orderId) {
    try {
      const res = await fetch(`${PAYBYRD_ORDERS}/${encodeURIComponent(orderId)}`, {
        headers: { "x-api-key": Deno.env.get("PAYBYRD_API_KEY") ?? "" },
      });
      if (res.ok) {
        confirmed = await res.json();
        status = String(confirmed?.status ?? "");
      } else {
        console.error("paybyrd_query_failed", res.status);
      }
    } catch (err) {
      console.error("paybyrd_query_unreachable", err);
    }
  }

  // Sem confirmacao devolvemos 500 para a Paybyrd repetir mais tarde.
  if (!status) return new Response("retry_later", { status: 500 });

  // 3 · Atualiza a encomenda
  const client = db();
  const match = orderRef
    ? { column: "order_ref", value: orderRef }
    : { column: "paybyrd_order_id", value: orderId };

  const patch: Record<string, unknown> = {
    status,
    raw_paybyrd: confirmed,
    updated_at: new Date().toISOString(),
  };
  if (orderId) patch.paybyrd_order_id = orderId;
  if (status === "paid") patch.paid_at = new Date().toISOString();

  const { data: rows, error } = await client
    .from("merch_orders")
    .update(patch)
    .eq(match.column, match.value)
    .select("*");

  if (error) {
    console.error("db_update", error);
    return new Response("db_error", { status: 500 });
  }
  if (!rows || rows.length === 0) {
    console.warn("order_not_found", match);
    return new Response("ignored", { status: 200 });
  }

  const order = rows[0] as OrderRow;

  // 4 · Emails — uma vez so, mesmo que a Paybyrd repita o evento.
  //     Reclamamos o envio com um UPDATE condicional antes de enviar:
  //     se duas entregas chegarem ao mesmo tempo, so uma fica com a linha.
  if (status === "paid") {
    const { data: claimed } = await client
      .from("merch_orders")
      .update({ notified_at: new Date().toISOString() })
      .eq("order_ref", order.order_ref)
      .is("notified_at", null)
      .select("order_ref");

    if (claimed && claimed.length > 0) {
      await notifyPaid(order);
    }
  }

  return new Response("ok", { status: 200 });
});
