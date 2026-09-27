-- ============================================================
-- Passagem de Ano — lista de interesse
--
-- Tabela propria, separada do merch. Sem policies de RLS:
-- so a service_role (a Edge Function nye-waitlist) escreve aqui.
--
-- Duplicados: cada submissao e uma linha, mesmo com o mesmo email —
-- a mesma pessoa pode inscrever-se mais do que uma vez e todas ficam
-- registadas. O que impede o duplo clique de criar duas linhas e o
-- submission_id, gerado no browser por cada preenchimento: se o mesmo
-- pedido chegar duas vezes, traz o mesmo id e a segunda e ignorada.
-- ============================================================

create table if not exists public.nye_waitlist (
  id                  uuid primary key default gen_random_uuid(),

  -- Identificador da submissao (idempotencia do clique)
  submission_id       uuid not null default gen_random_uuid(),

  first_name          text not null check (length(btrim(first_name)) between 2 and 60),
  last_name           text not null check (length(btrim(last_name))  between 2 and 60),

  phone_country_code  text not null check (phone_country_code ~ '^\+\d{1,4}$'),
  phone_number        text not null check (phone_number ~ '^\d{6,15}$'),
  phone_e164          text not null,                 -- +351912345678

  email               text not null check (position('@' in email) > 1),

  birth_date          date not null check (birth_date > date '1900-01-01'
                                       and birth_date <= current_date),

  -- 1 a 12. Quando a pessoa escolhe "+12", fica party_size = 12 com
  -- party_size_more = true (ou seja: mais de 12, numero a combinar).
  party_size          integer not null check (party_size between 1 and 12),
  party_size_more     boolean not null default false,

  -- data e hora da inscricao
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Unico o submission_id, nao o email: e ele que impede o duplo clique
-- sem impedir a mesma pessoa de se inscrever outra vez.
create unique index if not exists nye_waitlist_submission_id_key
  on public.nye_waitlist (submission_id);

-- O email repete-se a vontade; indexado so para procurar.
create index if not exists nye_waitlist_email_idx
  on public.nye_waitlist (email);

create index if not exists nye_waitlist_created_idx
  on public.nye_waitlist (created_at desc);

alter table public.nye_waitlist enable row level security;

comment on table public.nye_waitlist is
  'Lista de interesse da Passagem de Ano (/passagem-de-ano/). Escrita exclusiva da Edge Function nye-waitlist. Dados usados apenas para contacto sobre o evento.';


-- ------------------------------------------------------------
-- Vista de trabalho: a lista, pronta a ler
-- ------------------------------------------------------------
create or replace view public.nye_waitlist_lista as
select
  created_at                                        as inscrito_em,
  first_name || ' ' || last_name                    as nome,
  phone_e164                                        as telemovel,
  email,
  birth_date                                        as nascimento,
  date_part('year', age(birth_date))::int           as idade,
  case when party_size_more then '+12'
       else party_size::text end                    as pessoas,
  count(*) over (partition by email)                as inscricoes_deste_email,
  row_number() over (partition by email order by created_at) as n_da_pessoa
from public.nye_waitlist
order by created_at asc;

-- Uma vista nao tem RLS propria e, por defeito, corre com as permissoes do
-- DONO — contornando o RLS da tabela. Vivendo no schema `public`, seria
-- exposta pela API e legivel com a chave anon, que e publica.
alter view public.nye_waitlist_lista set (security_invoker = on);

revoke all on public.nye_waitlist_lista from anon, authenticated;
revoke all on public.nye_waitlist       from anon, authenticated;

comment on view public.nye_waitlist_lista is
  'Lista de interesse legivel. security_invoker + sem grants a anon/authenticated.';


-- ------------------------------------------------------------
-- Total de pessoas na lista, num relance
-- ------------------------------------------------------------
create or replace view public.nye_waitlist_resumo as
select
  count(*)                              as inscricoes,
  coalesce(sum(party_size), 0)          as pessoas_minimo,
  count(*) filter (where party_size_more) as grupos_acima_de_12,
  min(created_at)                       as primeira,
  max(created_at)                       as ultima
from public.nye_waitlist;

alter view public.nye_waitlist_resumo set (security_invoker = on);
revoke all on public.nye_waitlist_resumo from anon, authenticated;
