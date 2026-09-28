-- ============================================================
-- Correcao de seguranca da vista merch_orders_a_preparar
--
-- Corre este ficheiro se ja criaste a tabela com a versao anterior
-- de 20260927120000_merch_orders.sql (onde a vista ficava com o aviso
-- "Security Definer view" e o badge UNRESTRICTED no dashboard).
--
-- Se ainda nao criaste nada, ignora: a correcao ja esta incluida no
-- ficheiro 20260927120000.
-- ============================================================

alter view public.merch_orders_a_preparar set (security_invoker = on);

revoke all on public.merch_orders_a_preparar from anon, authenticated;
revoke all on public.merch_orders              from anon, authenticated;

comment on view public.merch_orders_a_preparar is
  'Encomendas pagas por preparar. security_invoker + sem grants a anon/authenticated.';
