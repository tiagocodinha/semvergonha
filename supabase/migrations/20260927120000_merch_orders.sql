-- ============================================================
-- Merch — encomendas de t-shirts
-- Sem policies de RLS: apenas a service_role (as Edge Functions)
-- consegue ler ou escrever. A pagina publica nunca toca na tabela.
--
-- Uma encomenda tem VARIAS linhas (cor × tamanho × quantidade),
-- guardadas em `items` (jsonb):
--   [{ "productId": "tee-classica", "productName": "T-Shirt Clássica",
--      "color": "areia", "size": "M", "qty": 1,
--      "unitCents": 2490, "lineCents": 2490 }, ...]
--
-- Se ja correste uma versao anterior deste ficheiro (com as colunas
-- product_id / color / size / qty), corre primeiro:
--   drop view if exists public.merch_orders_a_preparar;
--   drop table if exists public.merch_orders;
-- Nao ha encomendas a perder enquanto as funcoes nao estiverem no ar.
-- ============================================================

create table if not exists public.merch_orders (
  id                   uuid primary key default gen_random_uuid(),

  order_ref            text not null unique,          -- SVM-20260927-7K2P9X
  paybyrd_order_id     text,
  status               text not null default 'created',
    -- created | pending | paid | canceled | expired | refunded | failed

  currency             text not null default 'EUR',
  subtotal_cents       integer not null check (subtotal_cents >= 0),
  shipping_cents       integer not null default 0 check (shipping_cents >= 0),
  total_cents          integer not null check (total_cents >= 0),

  items                jsonb not null,
  items_count          integer not null check (items_count between 1 and 40),
  items_summary        text not null,

  delivery             text not null check (delivery in ('pickup', 'shipping')),

  customer_name        text not null,
  customer_email       text not null,
  customer_phone       text not null,
  customer_vat         text,

  address_line1        text,
  address_postal_code  text,
  address_city         text,
  address_country      text,

  notes                text,

  paid_at              timestamptz,
  notified_at          timestamptz,                    -- emails já enviados
  raw_paybyrd          jsonb,

  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),

  -- Envio obriga a morada completa
  constraint merch_orders_shipping_address_required check (
    delivery <> 'shipping'
    or (address_line1 is not null
        and address_postal_code is not null
        and address_city is not null)
  )
);

create index if not exists merch_orders_paybyrd_order_id_idx
  on public.merch_orders (paybyrd_order_id);

create index if not exists merch_orders_status_created_idx
  on public.merch_orders (status, created_at desc);

create index if not exists merch_orders_email_idx
  on public.merch_orders (customer_email);

alter table public.merch_orders enable row level security;

comment on table public.merch_orders is
  'Encomendas da loja de merch (/merchsemvergonha2026/). Escrita exclusiva das Edge Functions merch-order e merch-webhook.';


-- ------------------------------------------------------------
-- Vista de trabalho: o que falta preparar e entregar
-- ------------------------------------------------------------
create or replace view public.merch_orders_a_preparar as
select
  order_ref,
  created_at,
  paid_at,
  items_summary                                                    as artigos,
  items_count                                                      as pecas,
  (total_cents / 100.0)                                            as total_eur,
  case delivery when 'pickup' then 'Levantamento' else 'Envio' end as entrega,
  customer_name,
  customer_email,
  customer_phone,
  coalesce(address_line1 || ', ' || address_postal_code || ' ' || address_city, '—') as morada,
  notes
from public.merch_orders
where status = 'paid'
order by paid_at asc nulls last;

-- Uma vista nao tem RLS propria: por defeito corre com as permissoes do
-- DONO (postgres), contornando o RLS da merch_orders. Como vive no schema
-- `public`, e exposta pela API — com a chave anon, que e publica, dava para
-- ler todas as encomendas por aqui.
--
-- security_invoker faz a vista correr com as permissoes de QUEM a consulta,
-- passando o RLS da tabela a aplicar-se (Postgres 15+).
alter view public.merch_orders_a_preparar set (security_invoker = on);

-- E, por cima disso, tira o acesso aos dois papeis publicos da API.
-- Quem precisa de ler e a service_role (as Edge Functions, que ignoram RLS)
-- e tu no dashboard (papel postgres).
revoke all on public.merch_orders_a_preparar from anon, authenticated;
revoke all on public.merch_orders              from anon, authenticated;

comment on view public.merch_orders_a_preparar is
  'Encomendas pagas por preparar. security_invoker + sem grants a anon/authenticated.';
