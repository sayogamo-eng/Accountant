/**
 * Cloudflare Pages Function: POST /api/lead
 *
 * Receives the contact form (JSON) and delivers every lead to up to three destinations,
 * so one failing service never loses a lead:
 *   1. Email via Resend        — env RESEND_API_KEY, LEAD_TO_EMAIL, LEAD_FROM_EMAIL
 *   2. Cloudflare KV storage   — KV binding named LEADS
 *   3. Webhook (Sheets / CRM)  — env LEAD_WEBHOOK_URL (e.g. a Google Apps Script or Make URL)
 *
 * Configure them in Cloudflare → Workers & Pages → the project → Settings.
 * Responds 200 when at least one destination accepted the lead, 502 otherwise
 * (the form then shows the visitor a phone/WhatsApp fallback).
 */

const MAX_BODY = 10_000;
const FIELDS = ['name', 'phone', 'businessType', 'topic', 'message', 'newsletter', 'utm', 'page', 'submittedAt'];

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function cleanLead(input) {
  const lead = {};
  for (const k of FIELDS) {
    if (input[k] != null) lead[k] = String(input[k]).slice(0, k === 'message' || k === 'utm' ? 2000 : 200).trim();
  }
  return lead;
}

export function validateLead(lead) {
  const errors = [];
  if (!lead.name) errors.push('name');
  if (!/^[0-9+\-\s]{9,15}$/.test(lead.phone ?? '')) errors.push('phone');
  return errors;
}

const LABELS = { name: 'שם', phone: 'טלפון', businessType: 'סוג העסק', topic: 'נושא', message: 'הודעה', newsletter: 'מאשר/ת דיוור', utm: 'מקור', page: 'עמוד', submittedAt: 'נשלח' };

async function sendEmail(env, lead) {
  if (!env.RESEND_API_KEY || !env.LEAD_TO_EMAIL || !env.LEAD_FROM_EMAIL) return null; // not configured
  const rows = Object.entries(lead).map(([k, v]) => `<tr><th align="right">${escapeHtml(LABELS[k] ?? k)}</th><td>${escapeHtml(v)}</td></tr>`).join('');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.LEAD_FROM_EMAIL,
      to: env.LEAD_TO_EMAIL.split(',').map((s) => s.trim()),
      subject: `פנייה חדשה מהאתר: ${lead.name}${lead.topic ? ` — ${lead.topic}` : ''}`,
      html: `<div dir="rtl"><table cellpadding="6">${rows}</table></div>`,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  return 'email';
}

async function storeKv(env, lead) {
  if (!env.LEADS) return null;
  await env.LEADS.put(`lead:${lead.submittedAt}:${crypto.randomUUID()}`, JSON.stringify(lead));
  return 'kv';
}

async function sendWebhook(env, lead) {
  if (!env.LEAD_WEBHOOK_URL) return null;
  const res = await fetch(env.LEAD_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) });
  if (!res.ok) throw new Error(`Webhook ${res.status}`);
  return 'webhook';
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('Origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) return json(403, { ok: false, error: 'origin' });

  const text = await request.text();
  if (text.length > MAX_BODY) return json(413, { ok: false, error: 'too_large' });
  let input;
  try { input = JSON.parse(text); } catch { return json(400, { ok: false, error: 'invalid_json' }); }
  if (input.website) return json(200, { ok: true }); // honeypot: pretend success

  const lead = cleanLead(input);
  lead.submittedAt = new Date().toISOString();
  const invalid = validateLead(lead);
  if (invalid.length) return json(422, { ok: false, error: 'invalid', fields: invalid });

  const results = await Promise.allSettled([sendEmail(env, lead), storeKv(env, lead), sendWebhook(env, lead)]);
  const delivered = results.filter((r) => r.status === 'fulfilled' && r.value).map((r) => r.value);
  results.filter((r) => r.status === 'rejected').forEach((r) => console.error('[lead] destination failed:', r.reason));

  if (!delivered.length) {
    console.error('[lead] NOT DELIVERED', JSON.stringify(lead));
    return json(502, { ok: false, error: 'not_delivered' });
  }
  return json(200, { ok: true, delivered });
}
