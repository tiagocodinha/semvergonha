-- ============================================================
-- Consentimento de marketing (opcional)
--
-- Checkbox separada do consentimento do evento. Quem marca
-- autoriza receber novidades, promoções e eventos futuros.
-- Guardamos a frase exata (RGPD art. 7.º/1) e o boolean.
-- ============================================================

alter table public.nye_waitlist
  add column if not exists marketing_consent boolean default false,
  add column if not exists marketing_text text;

comment on column public.nye_waitlist.marketing_consent is
  'true se a pessoa aceitou receber marketing genérico do Sem Vergonha.';

comment on column public.nye_waitlist.marketing_text is
  'Frase de consentimento de marketing exata aceite pela pessoa (RGPD art. 7.º/1). NULL se não aceitou.';
