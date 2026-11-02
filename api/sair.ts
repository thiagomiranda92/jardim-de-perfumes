import { cookieDeSaida, json } from './_lib/painel.js';

export function POST() {
  return json({ ok: true }, 200, { 'Set-Cookie': cookieDeSaida() });
}
