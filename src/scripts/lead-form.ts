/**
 * Lead form: validates, attaches first-touch UTM data, posts JSON to PUBLIC_FORM_ENDPOINT
 * and redirects to /thank-you. Failures are shown to the visitor (with phone/WhatsApp
 * fallback) and logged — a lead never disappears silently.
 */
const UTM_KEY = 'lead.utm';

function captureUtm() {
  try {
    const params = new URLSearchParams(location.search);
    const utm: Record<string, string> = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'].forEach((k) => {
      const v = params.get(k);
      if (v) utm[k] = v;
    });
    if (Object.keys(utm).length) sessionStorage.setItem(UTM_KEY, JSON.stringify(utm));
    else if (!sessionStorage.getItem(UTM_KEY) && document.referrer && !document.referrer.startsWith(location.origin)) {
      sessionStorage.setItem(UTM_KEY, JSON.stringify({ referrer: document.referrer }));
    }
  } catch { /* storage blocked */ }
}

function readUtm() {
  try { return sessionStorage.getItem(UTM_KEY) ?? ''; } catch { return ''; }
}

function showError(field: HTMLInputElement, show: boolean) {
  field.setAttribute('aria-invalid', String(show));
  const err = document.getElementById(field.getAttribute('aria-describedby') ?? '');
  if (err) err.hidden = !show;
}

export function initLeadForms() {
  captureUtm();
  document.querySelectorAll<HTMLFormElement>('form.lead-form').forEach((form) => {
    if (form.dataset.ready) return;
    form.dataset.ready = '1';
    const status = form.querySelector<HTMLElement>('.form-status')!;
    const button = form.querySelector<HTMLButtonElement>('button[type=submit]')!;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.hidden = true;
      const required = Array.from(form.querySelectorAll<HTMLInputElement>('input[required]'));
      let firstInvalid: HTMLInputElement | null = null;
      required.forEach((f) => {
        const bad = !f.value.trim() || !f.checkValidity();
        showError(f, bad);
        if (bad && !firstInvalid) firstInvalid = f;
      });
      if (firstInvalid) { (firstInvalid as HTMLInputElement).focus(); return; }

      const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
      if (data.website) return; // honeypot
      delete data.website;
      data.utm = readUtm();
      data.page = location.pathname;
      data.submittedAt = new Date().toISOString();

      const endpoint = form.dataset.endpoint;
      button.disabled = true;
      try {
        if (!endpoint) throw new Error('PUBLIC_FORM_ENDPOINT is not configured');
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`Form endpoint responded ${res.status}`);
        location.href = form.dataset.success || '/thank-you';
      } catch (err) {
        console.error('[lead-form] submit failed', err);
        const w = window as any;
        if (typeof w.gtag === 'function') w.gtag('event', 'form_error', { page_path: location.pathname });
        status.className = 'form-status is-error';
        status.innerHTML = 'הפנייה לא נשלחה בגלל תקלה טכנית. אפשר לנסות שוב, או לפנות אלינו ישירות <a href="/contact#direct">בטלפון או ב-WhatsApp</a>.';
        status.hidden = false;
        button.disabled = false;
      }
    });
  });
}
