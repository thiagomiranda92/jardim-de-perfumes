import { configuracaoFaltando, cookieDeSessao, json, senhaCorreta } from './_lib/painel.js';

export async function POST(request: Request) {
  const faltando = configuracaoFaltando();
  if (faltando) return faltando;
  const { senha } = await request.json().catch(() => ({ senha: '' }));
  if (typeof senha === 'string' && senhaCorreta(senha)) return json({ ok: true }, 200, { 'Set-Cookie': cookieDeSessao() });
  // Atraso para dificultar tentativas em sequência.
  await new Promise(resolve => setTimeout(resolve, 1200));
  return json({ erro: 'Senha incorreta.' }, 401);
}
