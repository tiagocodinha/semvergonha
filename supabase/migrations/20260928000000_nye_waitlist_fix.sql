-- ============================================================
-- Acerta a nye_waitlist com a versao "+12" da funcao.
--
-- Se criaste a tabela antes da opcao "+12" (mais de 12 pessoas),
-- falta-lhe a coluna party_size_more e a funcao nye-waitlist falha
-- a gravar com "db_error".
--
-- Correr este ficheiro e seguro em qualquer estado: nao apaga dados
-- e nao faz nada se ja estiver tudo certo.
-- ============================================================

-- 1 · A coluna que faltava
alter table public.nye_waitlist
  add column if not exists party_size_more boolean not null default false;

-- 2 · O limite passou de 1..20 para 1..12 ("+12" fica como 12 + flag)
alter table public.nye_waitlist
  drop constraint if exists nye_waitlist_party_size_check;

alter table public.nye_waitlist
  add constraint nye_waitlist_party_size_check
  check (party_size between 1 and 12);

-- 3 · Vistas atualizadas
create or replace view public.nye_waitlist_lista as
select
  created_at                                        as inscrito_em,
  first_name || ' ' || last_name                    as nome,
  phone_e164                                        as telemovel,
  email,
  birth_date                                        as nascimento,
  date_part('year', age(birth_date))::int           as idade,
  case when party_size_more then '+12'
       else party_size::text end                    as pessoas
from public.nye_waitlist
order by created_at asc;

create or replace view public.nye_waitlist_resumo as
select
  count(*)                                as inscricoes,
  coalesce(sum(party_size), 0)            as pessoas_minimo,
  count(*) filter (where party_size_more) as grupos_acima_de_12,
  min(created_at)                         as primeira,
  max(created_at)                         as ultima
from public.nye_waitlist;

-- 4 · Reaplicar a protecao das vistas (o create or replace perde-a)
alter view public.nye_waitlist_lista  set (security_invoker = on);
alter view public.nye_waitlist_resumo set (security_invoker = on);

revoke all on public.nye_waitlist_lista  from anon, authenticated;
revoke all on public.nye_waitlist_resumo from anon, authenticated;
revoke all on public.nye_waitlist        from anon, authenticated;
