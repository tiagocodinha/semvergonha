-- ============================================================
-- Permitir inscrições repetidas da mesma pessoa
--
-- Antes: o email era UNICO e a funcao fazia upsert — duas inscricoes
-- com o mesmo email atualizavam a mesma linha, e perdia-se a segunda.
--
-- Agora: cada submissao é uma linha. A protecao contra duplo clique
-- passa a ser o submission_id — um identificador gerado no browser
-- por cada preenchimento do formulario. Se o mesmo pedido chegar duas
-- vezes (duplo clique, retry de rede), traz o mesmo submission_id e a
-- segunda é ignorada. Uma inscricao nova traz um id novo e cria linha.
-- ============================================================

-- 1 · O email deixa de ser único
drop index if exists public.nye_waitlist_email_key;

-- 2 · Identificador da submissão (é ele que impede o duplo clique).
--     As linhas que já existem recebem um id próprio pelo default.
alter table public.nye_waitlist
  add column if not exists submission_id uuid not null default gen_random_uuid();

create unique index if not exists nye_waitlist_submission_id_key
  on public.nye_waitlist (submission_id);

-- 3 · Índice para procurar pelas inscrições da mesma pessoa
create index if not exists nye_waitlist_email_idx
  on public.nye_waitlist (email);

comment on column public.nye_waitlist.submission_id is
  'Gerado no browser por cada preenchimento. Único: impede que o mesmo clique crie duas linhas.';


-- 4 · A lista passa a numerar as inscrições repetidas do mesmo email
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

alter view public.nye_waitlist_lista set (security_invoker = on);
revoke all on public.nye_waitlist_lista from anon, authenticated;
