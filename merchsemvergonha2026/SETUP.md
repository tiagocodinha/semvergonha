# Merch — guia de configuração

Página em **`/merchsemvergonha2026/`** — caminho não óbvio de propósito.
Invisível em quatro camadas: `noindex, nofollow, noarchive, nosnippet,
noimageindex`, zero Open Graph (não gera pré-visualização em WhatsApp ou redes),
fora do `sitemap.xml`, e sem um único link a apontar para lá em qualquer outra
página do site.

O `robots.txt` fica intacto de propósito: um `Disallow: /merchsemvergonha2026/`
**publicaria** o caminho, já que o robots.txt é lido por qualquer pessoa.

Backend no projeto Supabase `vwhjxgbmyvqslgojmdbt`, dedicado ao merch
(separado do que serve o `/review/`).

A página já está toda a funcionar — escolher artigo, cor, tamanho, quantidade,
validação, totais, PT/EN. Falta só o **pagamento**: até as funções dos passos
2 a 5 estarem publicadas, o botão de pagar dá erro de rede.

---

## Ficheiros

| Ficheiro | O que é |
|---|---|
| `merch/index.html` | a página |
| `merch/merch.css` | estilos só desta página |
| `merch/merch.js` | catálogo de **exibição**, i18n PT/EN, checkout |
| `supabase/migrations/20260927120000_merch_orders.sql` | tabela `merch_orders` |
| `supabase/functions/_shared/catalog.ts` | catálogo do **servidor** (preços reais) |
| `supabase/functions/merch-order/index.ts` | cria a encomenda + a order na Paybyrd |
| `supabase/functions/merch-webhook/index.ts` | recebe o pagamento, grava e envia emails |

> **Os dois catálogos têm de dizer o mesmo.** O do browser é só para mostrar;
> o preço cobrado é sempre recalculado em `_shared/catalog.ts`. Se mexeres num,
> mexe no outro.

---

## Passo 1 · Conta Paybyrd e chaves

1. Entra em [backoffice.paybyrd.com/developer-keys](https://backoffice.paybyrd.com/developer-keys).
2. Copia a chave de **teste**. Guarda a de produção para depois.

A Paybyrd usa **o mesmo URL** (`https://gateway.paybyrd.com`) para teste e para
produção — é a chave que decide o modo. Trocar de teste para produção é trocar
uma variável de ambiente, mais nada.

## Passo 2 · Base de dados

No projeto Supabase, SQL Editor, cola o conteúdo de
`supabase/migrations/20260927120000_merch_orders.sql` e corre.

Ou, com a CLI:

```bash
npx supabase@latest link --project-ref vwhjxgbmyvqslgojmdbt
npx supabase@latest db push
```

Fica com RLS ligado e **zero policies** — ninguém acede à tabela a não ser as
Edge Functions (que usam a `service_role`). A vista `merch_orders_a_preparar`
dá-te a lista do que está pago e falta preparar.

## Passo 3 · Segredos das funções

```bash
npx supabase@latest secrets set PAYBYRD_API_KEY="a-tua-chave-de-teste" --project-ref vwhjxgbmyvqslgojmdbt
npx supabase@latest secrets set PAYBYRD_WEBHOOK_SECRET="$(openssl rand -hex 24)" --project-ref vwhjxgbmyvqslgojmdbt
npx supabase@latest secrets set SITE_URL="https://semvergonharestaurant.com" --project-ref vwhjxgbmyvqslgojmdbt
```

Guarda o valor de `PAYBYRD_WEBHOOK_SECRET` — é preciso no passo 5.
`SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` são injetadas automaticamente.

Emails (opcional, mas é o que te avisa das encomendas):

```bash
npx supabase@latest secrets set RESEND_API_KEY="re_..." --project-ref vwhjxgbmyvqslgojmdbt
npx supabase@latest secrets set MERCH_EMAIL_FROM="Sem Vergonha <merch@semvergonharestaurant.com>" --project-ref vwhjxgbmyvqslgojmdbt
npx supabase@latest secrets set MERCH_EMAIL_TO="hey@semvergonharestaurant.com" --project-ref vwhjxgbmyvqslgojmdbt
```

Sem `RESEND_API_KEY` tudo o resto funciona; só não saem emails (fica registado
no log da função). O domínio tem de estar verificado no [Resend](https://resend.com).

## Passo 4 · Publicar as funções

```bash
npx supabase@latest functions deploy merch-order --project-ref vwhjxgbmyvqslgojmdbt
```

```bash
npx supabase@latest functions deploy merch-webhook --project-ref vwhjxgbmyvqslgojmdbt
```

O `verify_jwt = false` das duas funções já está no `supabase/config.toml`, por
isso não é preciso passar `--no-verify-jwt`. É necessário porque quem chama não
tem sessão Supabase: a página pública e a Paybyrd. A proteção é outra — lista de
origens permitidas em `_shared/cors.ts`, validação integral no servidor, e
segredo partilhado no webhook.

O frontend já aponta para aqui — `CONFIG.API` em `merch/merch.js` está em:

```js
API: 'https://vwhjxgbmyvqslgojmdbt.supabase.co/functions/v1/merch-order',
```

É o único sítio do frontend que depende do backend. Enquanto as funções não
estiverem publicadas, o botão de pagar dá erro de rede — é esperado.

## Passo 5 · Webhook na Paybyrd

No backoffice da Paybyrd, em Webhooks:

- **URL**: `https://vwhjxgbmyvqslgojmdbt.supabase.co/functions/v1/merch-webhook`
- **Autenticação**: API Key → header `x-api-key` → o valor de `PAYBYRD_WEBHOOK_SECRET`
- **Eventos**: `order.paid`, `order.canceled`, `order.expired`, `order.refunded`

A função não acredita no corpo do webhook: com o `orderId` vai perguntar à
Paybyrd (`GET /api/v2/orders/{orderId}`) qual é o estado real e só depois grava.
Se não conseguir confirmar devolve 500 e a Paybyrd repete (até 50 tentativas,
de minuto a minuto). Os emails saem uma vez só, mesmo com eventos repetidos.

## Passo 6 · Testar

Com a chave de **teste**, compra uma t-shirt em `/merchsemvergonha2026/` e usa:

| Cartão | Resultado |
|---|---|
| `5555341244441115` | aprovado, sem 3DS |
| `4235647728025682` | aprovado, com 3DS |
| `4000000000000119` | recusado |

Qualquer outro número dá recusado.

Depois de pagar, a Paybyrd devolve-te a `/merchsemvergonha2026/?ref=SVM-...`, a página pergunta
o estado à função e mostra confirmado, pendente ou falhado. Confirma que:

- há uma linha em `merch_orders` com `status = 'paid'` e `paid_at` preenchido;
- chegaram os dois emails (restaurante e cliente);
- o `total_cents` é o que esperavas.

Testa também o Multibanco: fica em `pending` e só passa a `paid` quando a
referência for liquidada — a página já trata desse caso ("Quase lá").

## Passo 7 · Produção

```bash
npx supabase@latest secrets set PAYBYRD_API_KEY="chave-de-producao" --project-ref vwhjxgbmyvqslgojmdbt
```

E no backoffice da Paybyrd aponta o webhook de produção para o mesmo URL.
Não é preciso mexer no site.

---

## O dia-a-dia

### Mudar preços, cores ou tamanhos

`merch/merch.js` (bloco `CONFIG`, no topo) **e**
`supabase/functions/_shared/catalog.ts`. Depois:

```bash
npx supabase@latest functions deploy merch-order --project-ref vwhjxgbmyvqslgojmdbt
```

### Esgotar um tamanho

Em ambos os ficheiros, no produto: `soldOut: ['S', 'XXL']`. Aparece riscado e
o servidor recusa (`409 sold_out`) mesmo que alguém force.

### Limites por encomenda

O cliente pode juntar vários tamanhos e várias cores na mesma encomenda
(ex. 1 M areia + 2 S castanho + 1 L preto — um só pagamento, uns só portes).
Os tetos estão em dois sítios, e têm de coincidir:

| | `merch.js` | `_shared/catalog.ts` |
|---|---|---|
| máximo por cor+tamanho | `maxPerSize: 5` | `MAX_PER_SIZE = 5` |
| máximo de peças na encomenda | `maxItems: 10` | `MAX_ITEMS = 10` |

Cada encomenda guarda as linhas em `merch_orders.items` (jsonb), com
`items_count` (nº de peças) e `items_summary` (texto para emails e listagens).

### Pôr as fotos reais

Coloca as imagens em `assets/merch/` e no `CONFIG` de `merch.js` troca
`image: null` por `image: '/assets/merch/tee-classica.jpg'`. Proporção 4:5
(ex. 1200×1500). Enquanto for `null` aparece um placeholder desenhado.

### Ver as encomendas

```sql
select * from public.merch_orders_a_preparar;
```

### Marcar como entregue

Não há campo para isso ainda — se quiseres, acrescenta-se um `fulfilled_at`
e um painel simples.

---

## Quando quiseres lançar a página

1. Renomear a pasta `merchsemvergonha2026/` para `merch/` e trocar os caminhos
   em `index.html` (`/merchsemvergonha2026/merch.css`, `.../merch.js`, os dois
   links "MERCH" e o "Voltar à loja"). Depois, nos segredos da Supabase:
   `supabase secrets set SHOP_PATH="/merch/"` — é isso que define o URL de
   regresso depois do pagamento.
2. Tirar o `noindex` do `<head>` e pôr `index, follow`.
3. Acrescentar as tags Open Graph (o lugar está marcado no `<head>`).
4. Juntar `/merch/` ao `sitemap.xml`.
5. Acrescentar o link "MERCH" à nav e ao menu mobile de `index.html`,
   `food-drinks/index.html` e `contactos/index.html`.
6. Acrescentar `merch.*` ao `js/i18n.js` **ou** deixar como está — a página
   traz o seu próprio dicionário e não depende do i18n do site.
7. Tirar `merchsemvergonha2026/SETUP.md` do `.vercelignore` e corrigir para
   `merch/SETUP.md`.

Nada disto foi feito: a página não é referida em lugar nenhum.

---

## Notas de segurança

- A chave da Paybyrd nunca chega ao browser. Vive nos segredos da Supabase.
- O browser envia IDs e quantidade; **nunca** preços. O total é calculado no
  servidor a partir de `_shared/catalog.ts`.
- A encomenda é gravada *antes* de falar com a Paybyrd, para não haver
  pagamentos sem registo do nosso lado.
- A confirmação de pagamento vem do webhook + consulta à Paybyrd, nunca do
  redirect (que o cliente pode forjar). O redirect só serve para mostrar o ecrã.
- A tabela tem RLS sem policies: só as funções lhe acedem.
- A página não carrega GTM nem cookies de tracking, por isso não precisa de
  banner de consentimento. Se acrescentares analytics, precisa.
