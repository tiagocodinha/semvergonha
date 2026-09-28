-- ============================================================
-- Prova de consentimento
--
-- A lista de interesse assenta em consentimento (art. 6.º/1/a do
-- RGPD). O art. 7.º/1 obriga o responsavel a conseguir DEMONSTRAR
-- que o consentimento foi dado — nao basta ter uma caixa no site.
--
-- Guardamos por isso a frase exata que a pessoa aceitou, na lingua
-- em que lhe foi mostrada. Com o created_at, fica registado o que
-- foi consentido e quando.
-- ============================================================

alter table public.nye_waitlist
  add column if not exists consent_text text;

comment on column public.nye_waitlist.consent_text is
  'Frase de consentimento exata aceite pela pessoa, tal como lhe foi apresentada. Prova do art. 7.º/1 do RGPD.';


-- A lista de trabalho mostra o consentimento e a data em que foi dado
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
  consent_text                                      as consentiu_com,
  count(*) over (partition by email)                as inscricoes_deste_email,
  row_number() over (partition by email order by created_at) as n_da_pessoa
from public.nye_waitlist
order by created_at asc;

alter view public.nye_waitlist_lista set (security_invoker = on);
revoke all on public.nye_waitlist_lista from anon, authenticated;
