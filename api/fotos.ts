import { randomBytes } from 'node:crypto';
import sharp from 'sharp';
import { autorizado, configuracaoFaltando, criarBlob, json, naoAutorizado, pastaDeFotos, slug } from './_lib/painel.js';

// Prepara as duas versões da foto no GitHub, sem commit; elas entram no commit do próximo "Salvar alterações".
export async function POST(request: Request) {
  const faltando = configuracaoFaltando();
  if (faltando) return faltando;
  if (!autorizado(request)) return naoAutorizado();
  const nome = new URL(request.url).searchParams.get('nome') ?? 'foto';
  const base = `${slug(nome)}-${randomBytes(3).toString('hex')}`;
  try {
    const imagem = sharp(Buffer.from(await request.arrayBuffer())).rotate();
    const [jpg, webp] = await Promise.all([
      imagem.clone().resize({ width: 1086, withoutEnlargement: true }).jpeg({ quality: 84, mozjpeg: true }).toBuffer(),
      imagem.clone().resize({ width: 640, withoutEnlargement: true }).webp({ quality: 74 }).toBuffer(),
    ]);
    const [shaJpg, shaWebp] = await Promise.all([criarBlob(jpg), criarBlob(webp)]);
    return json({
      src: `/images/products/${base}.jpg`,
      pending: [{ path: `${pastaDeFotos}/${base}.jpg`, sha: shaJpg }, { path: `${pastaDeFotos}/${base}-640.webp`, sha: shaWebp }],
    });
  } catch (erro) {
    return json({ erro: `Não foi possível processar a foto. ${erro}` }, 500);
  }
}
