// Durante o `pnpm dev`, o painel /adm salva por aqui direto nos arquivos do projeto.
// No Vercel, as mesmas rotas são atendidas pelas funções em api/, com login, gravando no GitHub.
import { randomBytes } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import type { IncomingMessage, ServerResponse } from 'node:http';
import path from 'node:path';
import sharp from 'sharp';
import type { Plugin } from 'vite';

const raiz = path.resolve(import.meta.dirname, '..');
const arquivoDeConteudo = path.join(raiz, 'src', 'data', 'conteudo.json');
const pastaDeFotos = path.join(raiz, 'public', 'images', 'products');
const listas = ['categories', 'aromas', 'products', 'ordemDeDestaque', 'highlights', 'fairs'];

const lerCorpo = async (req: IncomingMessage) => {
  const partes: Buffer[] = [];
  for await (const parte of req) partes.push(parte as Buffer);
  return Buffer.concat(partes);
};
const responder = (res: ServerResponse, status: number, corpo: unknown) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(corpo));
};
const slug = (texto: string) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'foto';

export function painelLocal(): Plugin {
  return {
    name: 'painel-local',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url !== '/adm') return next();
        res.writeHead(302, { Location: '/adm/' }).end();
      });
      server.middlewares.use('/api/conteudo', async (req, res) => {
        try {
          if (req.method === 'GET') return responder(res, 200, JSON.parse(await readFile(arquivoDeConteudo, 'utf8')));
          if (req.method !== 'PUT') return responder(res, 405, { erro: 'Método não permitido.' });
          // As fotos já foram gravadas em public/ no envio; aqui só interessa o conteúdo.
          const { content: conteudo } = JSON.parse((await lerCorpo(req)).toString('utf8'));
          if (!listas.every(chave => Array.isArray(conteudo?.[chave]))) return responder(res, 400, { erro: 'Conteúdo incompleto.' });
          await writeFile(arquivoDeConteudo, JSON.stringify(conteudo, null, 2) + '\n');
          responder(res, 200, { ok: true });
        } catch (erro) {
          responder(res, 500, { erro: String(erro) });
        }
      });
      // Recebe a foto e grava as duas versões usadas pelo site: JPG de até 1086 px e WebP leve de 640 px.
      server.middlewares.use('/api/fotos', async (req, res) => {
        try {
          if (req.method !== 'POST') return responder(res, 405, { erro: 'Método não permitido.' });
          const nome = new URL(req.url ?? '', 'http://local').searchParams.get('nome') ?? 'foto';
          const base = `${slug(nome)}-${randomBytes(3).toString('hex')}`;
          const imagem = sharp(await lerCorpo(req)).rotate();
          await imagem.clone().resize({ width: 1086, withoutEnlargement: true }).jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(pastaDeFotos, `${base}.jpg`));
          await imagem.clone().resize({ width: 640, withoutEnlargement: true }).webp({ quality: 74 }).toFile(path.join(pastaDeFotos, `${base}-640.webp`));
          responder(res, 200, { src: `/images/products/${base}.jpg` });
        } catch (erro) {
          responder(res, 500, { erro: `Não foi possível processar a foto. ${erro}` });
        }
      });
    },
  };
}
