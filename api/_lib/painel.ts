// Base das funções do painel online (/api/*) no Vercel.
// Cada "Salvar alterações" vira um commit no GitHub; o Vercel publica o site de novo a partir dele.
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

const repositorio = process.env.GITHUB_REPO ?? 'thiagomiranda92/jardim-de-perfumes';
const ramo = process.env.GITHUB_BRANCH ?? 'main';
export const arquivoDeConteudo = 'src/data/conteudo.json';
export const pastaDeFotos = 'public/images/products';

export const json = (corpo: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(corpo), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers } });

export const configuracaoFaltando = () => {
  const faltam = ['ADMIN_PASSWORD', 'GITHUB_TOKEN'].filter(nome => !process.env[nome]);
  return faltam.length ? json({ erro: `Painel ainda não configurado no Vercel: falta ${faltam.join(' e ')}.` }, 500) : undefined;
};

// Sessão: cookie assinado com validade de 30 dias. Trocar a senha encerra todas as sessões.
const cookie = 'jp_adm';
const duracao = 30 * 24 * 60 * 60;
const chave = () => createHash('sha256').update(`${process.env.ADMIN_PASSWORD}:${process.env.GITHUB_TOKEN}`).digest();
const assinar = (validade: string) => createHmac('sha256', chave()).update(validade).digest('hex');
const iguais = (a: string, b: string) => {
  const [x, y] = [a, b].map(texto => createHash('sha256').update(texto).digest());
  return timingSafeEqual(x, y);
};

export const senhaCorreta = (senha: string) => iguais(senha, process.env.ADMIN_PASSWORD ?? '');
export const cookieDeSessao = () => {
  const validade = String(Math.floor(Date.now() / 1000) + duracao);
  return `${cookie}=${validade}.${assinar(validade)}; Path=/api; Max-Age=${duracao}; HttpOnly; Secure; SameSite=Strict`;
};
export const cookieDeSaida = () => `${cookie}=; Path=/api; Max-Age=0; HttpOnly; Secure; SameSite=Strict`;
export const autorizado = (request: Request) => {
  const valor = request.headers.get('cookie')?.split(/;\s*/).find(item => item.startsWith(`${cookie}=`))?.slice(cookie.length + 1);
  const [validade, assinatura] = valor?.split('.') ?? [];
  return !!validade && !!assinatura && Number(validade) > Date.now() / 1000 && iguais(assinatura, assinar(validade));
};
export const naoAutorizado = () => json({ erro: 'Entre com a senha para continuar.' }, 401);

export async function github(caminho: string, init: RequestInit = {}) {
  const resposta = await fetch(`https://api.github.com/repos/${repositorio}${caminho}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  });
  if (!resposta.ok) {
    const erro = new Error(`GitHub respondeu ${resposta.status}: ${(await resposta.text()).slice(0, 300)}`) as Error & { status: number };
    erro.status = resposta.status;
    throw erro;
  }
  return resposta;
}

// A versão do conteúdo é o identificador (sha) do arquivo no Git: muda a cada salvamento.
export const versaoDe = (texto: string) => createHash('sha1').update(`blob ${Buffer.byteLength(texto)}\0`).update(texto).digest('hex');
export class ConteudoDesatualizado extends Error {}

export async function lerConteudo(ref = ramo) {
  const { sha, content } = await (await github(`/contents/${arquivoDeConteudo}?ref=${ref}`)).json();
  return { content: JSON.parse(Buffer.from(content, 'base64').toString('utf8')), version: sha as string };
}

// Grava o conteúdo e as fotos novas num único commit, para o Vercel publicar uma vez só.
// Recusa o envio se o conteúdo mudou desde que o painel foi aberto, para não apagar o que outra página salvou.
export async function gravar(conteudo: unknown, fotos: { path: string; sha: string }[], versao: string) {
  const texto = JSON.stringify(conteudo, null, 2) + '\n';
  for (let tentativa = 0; ; tentativa++) {
    const { object } = await (await github(`/git/ref/heads/${ramo}`)).json();
    if ((await lerConteudo(object.sha)).version !== versao) throw new ConteudoDesatualizado();
    const { tree } = await (await github(`/git/commits/${object.sha}`)).json();
    const arvore = await (await github('/git/trees', {
      method: 'POST',
      body: JSON.stringify({
        base_tree: tree.sha,
        tree: [
          { path: arquivoDeConteudo, mode: '100644', type: 'blob', content: texto },
          ...fotos.map(foto => ({ path: foto.path, mode: '100644', type: 'blob', sha: foto.sha })),
        ],
      }),
    })).json();
    const commit = await (await github('/git/commits', {
      method: 'POST',
      body: JSON.stringify({ message: 'conteudo: atualizado pelo painel de administração', tree: arvore.sha, parents: [object.sha] }),
    })).json();
    try {
      await github(`/git/refs/heads/${ramo}`, { method: 'PATCH', body: JSON.stringify({ sha: commit.sha }) });
      return versaoDe(texto);
    } catch (erro) {
      // Outro envio chegou antes: refaz o commit sobre a versão mais nova.
      if ((erro as { status?: number }).status !== 422 || tentativa >= 2) throw erro;
    }
  }
}

export const criarBlob = async (conteudo: Buffer) =>
  (await (await github('/git/blobs', { method: 'POST', body: JSON.stringify({ content: conteudo.toString('base64'), encoding: 'base64' }) })).json()).sha as string;

export const slug = (texto: string) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'foto';
