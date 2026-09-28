/**
 * Origens autorizadas a chamar as funcoes (merch e passagem de ano).
 * Qualquer outra recebe o dominio de producao no cabecalho, o que faz
 * o browser bloquear o pedido — e o que se quer.
 */
const ALLOWED = [
  "https://semvergonharestaurant.com",
  "https://www.semvergonharestaurant.com",

  // Desenvolvimento local
  "http://127.0.0.1:5500",   // Live Server do VS Code
  "http://localhost:5500",
  "http://localhost:3456",
  "http://localhost:3000",
];

export function corsHeaders(origin: string | null): Record<string, string> {
  const allow = origin && ALLOWED.includes(origin) ? origin : ALLOWED[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Vary": "Origin",
  };
}

export function json(
  body: unknown,
  status: number,
  origin: string | null,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  });
}
