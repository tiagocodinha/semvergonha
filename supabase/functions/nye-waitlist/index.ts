/**
 * nye-waitlist — Supabase Edge Function
 *
 *   POST /nye-waitlist   grava uma inscricao na lista de interesse
 *                        da Passagem de Ano  ->  { ok: true }
 *
 * Duplicados: upsert por email. Dois envios do mesmo email — duplo
 * clique, retry de rede, ou a pessoa a inscrever-se outra vez —
 * atualizam a mesma linha. O created_at fica na primeira inscricao,
 * porque nao vai no payload do upsert.
 *
 * Injetadas automaticamente pela Supabase:
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 * Deploy (verify_jwt = false vem do config.toml):
 *   npx supabase@latest functions deploy nye-waitlist --project-ref <ref>
 */

import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders, json } from "../_shared/cors.ts";

/**
 * Indicativos telefonicos existentes (E.164).
 * Corresponde a lista de paises em passagem-de-ano/pda.js — aqui so
 * precisamos dos numeros, nao dos nomes.
 */
const PHONE_CODES = new Set(
  (
   "1,7,20,27,30,31,32,33,34,36,39,40,41,43," +
   "44,45,46,47,48,49,51,52,53,54,55,56,57,58," +
   "60,61,62,63,64,65,66,81,82,84,86,90,91,92," +
   "93,94,95,98,211,212,213,216,218,220,221,222,223,224," +
   "225,226,227,228,229,230,231,232,233,234,235,236,237,238," +
   "239,240,241,242,243,244,245,248,249,250,251,252,253,254," +
   "255,256,257,258,260,261,262,263,264,265,266,267,268,269," +
   "291,297,298,299,350,351,352,353,354,355,356,357,358,359," +
   "370,371,372,373,374,375,376,377,378,379,380,381,382,383," +
   "385,386,387,389,420,421,423,501,502,503,504,505,506,507," +
   "509,590,591,592,593,594,595,596,597,598,599,670,673,674," +
   "675,676,677,678,679,680,682,685,686,687,688,689,691,692," +
   "850,852,853,855,856,880,886,960,961,962,963,964,965,966," +
   "967,968,970,971,972,973,974,975,976,977,992,993,994,995," +
   "996,998,1242,1246,1264,1268,1284,1345,1441,1473,1649,1664,1671,1758," +
   "1767,1784,1787,1809,1868,1869,1876"
  ).split(",").map((n) => "+" + n),
);

const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
/** Letras (com acentos), espacos, hifens e apostrofos. */
const RE_NAME = /^[\p{L}][\p{L}\s'’-]*$/u;
const RE_DATE = /^\d{4}-\d{2}-\d{2}$/;
const RE_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : "";
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405, origin);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "bad_json" }, 400, origin);
  }

  // ── Nomes ───────────────────────────────────────────────────
  const firstName = str(body.firstName, 60);
  const lastName = str(body.lastName, 60);

  if (firstName.length < 2 || !RE_NAME.test(firstName)) {
    return json({ error: "bad_first_name" }, 400, origin);
  }
  if (lastName.length < 2 || !RE_NAME.test(lastName)) {
    return json({ error: "bad_last_name" }, 400, origin);
  }

  // ── Telemovel ───────────────────────────────────────────────
  const phoneCode = str(body.phoneCode, 6);
  if (!PHONE_CODES.has(phoneCode)) {
    return json({ error: "bad_phone_code" }, 400, origin);
  }

  const phoneNumber = str(body.phoneNumber, 24).replace(/\D/g, "");
  if (phoneNumber.length < 6 || phoneNumber.length > 15) {
    return json({ error: "bad_phone" }, 400, origin);
  }

  // ── Email ───────────────────────────────────────────────────
  const email = str(body.email, 160).toLowerCase();
  if (!RE_EMAIL.test(email)) {
    return json({ error: "bad_email" }, 400, origin);
  }

  // ── Data de nascimento ──────────────────────────────────────
  const birthDate = str(body.birthDate, 10);
  if (!RE_DATE.test(birthDate)) {
    return json({ error: "bad_birth_date" }, 400, origin);
  }
  const bd = new Date(`${birthDate}T00:00:00Z`);
  if (
    Number.isNaN(bd.getTime()) ||
    bd.getTime() > Date.now() ||
    bd.getUTCFullYear() < 1900 ||
    // A data tem de sobreviver ao round-trip (rejeita 2026-02-31)
    bd.toISOString().slice(0, 10) !== birthDate
  ) {
    return json({ error: "bad_birth_date" }, 400, origin);
  }

  // ── Numero de pessoas (1..12, ou "+12" = mais de 12) ────────
  const partySize = Number(body.partySize);
  if (!Number.isInteger(partySize) || partySize < 1 || partySize > 12) {
    return json({ error: "bad_party_size" }, 400, origin);
  }
  const partySizeMore = body.partySizeMore === true;
  if (partySizeMore && partySize !== 12) {
    return json({ error: "bad_party_size" }, 400, origin);
  }

  // ── Consentimento ───────────────────────────────────────────
  // A lista assenta em consentimento (art. 6.º/1/a). Sem ele nao ha
  // fundamento para tratar os dados, por isso recusamos. Guardamos a
  // frase exata que foi aceite — e isso que o demonstra (art. 7.º/1).
  if (body.consent !== true) {
    return json({ error: "consent_required" }, 400, origin);
  }
  const consentText = str(body.consentText, 400);
  if (consentText.length < 20) {
    return json({ error: "bad_consent_text" }, 400, origin);
  }

  // ── Identificador da submissao ──────────────────────────────
  // Gerado no browser por cada preenchimento do formulario. E o que
  // impede o duplo clique de criar duas linhas — e nao o email, que
  // pode repetir-se a vontade entre inscricoes diferentes.
  const submissionId = str(body.submissionId, 36).toLowerCase();
  if (!RE_UUID.test(submissionId)) {
    return json({ error: "bad_submission_id" }, 400, origin);
  }

  // ── Gravar ──────────────────────────────────────────────────
  const db = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  // ignoreDuplicates: se o mesmo submission_id chegar outra vez (duplo
  // clique, retry de rede), nao faz nada e devolve sucesso na mesma.
  const { error } = await db
    .from("nye_waitlist")
    .upsert({
      submission_id: submissionId,
      first_name: firstName,
      last_name: lastName,
      phone_country_code: phoneCode,
      phone_number: phoneNumber,
      phone_e164: `${phoneCode}${phoneNumber}`,
      email,
      birth_date: birthDate,
      party_size: partySize,
      party_size_more: partySizeMore,
      consent_text: consentText,
      updated_at: new Date().toISOString(),
    }, { onConflict: "submission_id", ignoreDuplicates: true });

  if (error) {
    console.error("nye_insert_failed", error);
    return json({ error: "db_error" }, 500, origin);
  }

  return json({ ok: true }, 200, origin);
});
