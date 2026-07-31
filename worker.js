/**
 * Ruleta Lucciano's — Proxy de OCR con IA (Cloudflare Worker)
 * -----------------------------------------------------------
 * La API key vive ACÁ como secreto (env.GEMINI_API_KEY), nunca en el cliente.
 * El navegador manda la foto en base64; el Worker le pega a Gemini y devuelve
 * { "users": ["usuario1","usuario2"] } (la parte de ANTES del @).
 *
 * PASOS PARA DEPLOYARLO:
 * 1) Cloudflare Dashboard -> Workers & Pages -> Create -> Worker. Pegá este archivo.
 * 2) Settings -> Variables and Secrets -> Add -> tipo "Secret":
 *       Nombre: GEMINI_API_KEY   Valor: tu clave de Google AI Studio
 * 3) Deploy. Copiá la URL (algo tipo https://ruleta-ocr.tucuenta.workers.dev)
 * 4) Pegá esa URL en la constante OCR_ENDPOINT del index.html.
 * 5) (Recomendado) en ALLOWED_ORIGINS dejá SOLO tu dominio de GitHub Pages,
 *    así nadie más puede usar tu proxy y quemarte la cuota.
 */

// Dominios autorizados a llamar este Worker. Restringir evita que te usen la cuota.
const ALLOWED_ORIGINS = [
  'https://juanluccianos.github.io',
  'http://localhost',
  'http://127.0.0.1'
];

// Modelo de Gemini con visión. 'gemini-2.0-flash' es rápido y barato.
// Alternativas: 'gemini-1.5-flash', 'gemini-1.5-pro' (más caro/preciso).
const MODEL = 'gemini-2.0-flash';

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = pickOrigin(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: cors(allowed) });
    }
    if (request.method !== 'POST') {
      return json({ error: 'Método no permitido' }, 405, allowed);
    }
    if (origin && !allowed) {
      return json({ error: 'Origen no autorizado' }, 403, '');
    }

    try {
      const { imageBase64, mimeType } = await request.json();
      if (!imageBase64) return json({ error: 'Falta la imagen' }, 400, allowed);
      if (!env.GEMINI_API_KEY) return json({ error: 'Falta GEMINI_API_KEY en el Worker' }, 500, allowed);

      const prompt =
        'La imagen es una planilla con direcciones de email. ' +
        'Extraé TODAS las direcciones de email visibles. ' +
        'Devolvé EXCLUSIVAMENTE un JSON con esta forma exacta: {"users": ["usuario1","usuario2"]}. ' +
        'Cada elemento es la parte que va ANTES del @ de cada email, en minúsculas, tal cual está escrita. ' +
        'No incluyas encabezados, fechas, números, totales, ni nada que no sea un email. ' +
        'Sin duplicados. Sin explicaciones ni markdown, solo el JSON.';

      const body = {
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mimeType || 'image/jpeg', data: imageBase64 } }
          ]
        }],
        generationConfig: { temperature: 0, response_mime_type: 'application/json' }
      };

      const url = 'https://generativelanguage.googleapis.com/v1beta/models/' +
        MODEL + ':generateContent?key=' + env.GEMINI_API_KEY;

      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await resp.json();
      if (!resp.ok) {
        const msg = (data && data.error && data.error.message) || 'Error de Gemini';
        return json({ error: msg }, 502, allowed);
      }

      let text = '';
      try { text = data.candidates[0].content.parts[0].text || ''; } catch (e) { text = ''; }

      // Parseo robusto: primero como JSON; si falla, regex sobre el texto.
      let users = [];
      try {
        const parsed = JSON.parse(text);
        users = Array.isArray(parsed) ? parsed : (parsed.users || []);
      } catch (e) {
        const emails = text.match(/[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+/g) || [];
        users = emails.map(function (x) { return x.split('@')[0]; });
      }

      // Normalizar + sacar duplicados.
      const seen = {}, out = [];
      users.forEach(function (u) {
        u = String(u).trim().toLowerCase();
        if (u.indexOf('@') !== -1) u = u.split('@')[0];
        u = u.replace(/^[._\-]+|[._\-]+$/g, '');
        if (u && !seen[u]) { seen[u] = 1; out.push(u); }
      });

      return json({ users: out }, 200, allowed);
    } catch (e) {
      return json({ error: (e && e.message) ? e.message : String(e) }, 500, allowed);
    }
  }
};

function pickOrigin(origin) {
  for (let i = 0; i < ALLOWED_ORIGINS.length; i++) {
    if (origin === ALLOWED_ORIGINS[i] || origin.indexOf(ALLOWED_ORIGINS[i]) === 0) return origin;
  }
  return '';
}
function cors(origin) {
  return {
    'Access-Control-Allow-Origin': origin || 'null',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin'
  };
}
function json(obj, status, origin) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: Object.assign({ 'Content-Type': 'application/json' }, cors(origin))
  });
}
