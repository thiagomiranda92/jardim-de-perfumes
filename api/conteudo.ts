import { ConteudoDesatualizado, arquivoDeConteudo, autorizado, configuracaoFaltando, gravar, json, lerConteudo, naoAutorizado, pastaDeFotos } from './_lib/painel.js';

const listas = ['categories', 'aromas', 'products', 'ordemDeDestaque', 'highlights', 'fairs'];
const desatualizado = () => json({ erro: 'O site foi alterado depois que você abriu o painel, e salvar agora apagaria essas mudanças. Recarregue a página (F5) e refaça suas alterações.' }, 409);

export async function GET(request: Request) {
  const faltando = configuracaoFaltando();
  if (faltando) return faltando;
  if (!autorizado(request)) return naoAutorizado();
  try {
    return json(await lerConteudo());
  } catch (erro) {
    return json({ erro: `Não foi possível ler ${arquivoDeConteudo}. ${erro}` }, 502);
  }
}

export async function PUT(request: Request) {
  const faltando = configuracaoFaltando();
  if (faltando) return faltando;
  if (!autorizado(request)) return naoAutorizado();
  const { content, photos = [], version } = await request.json().catch(() => ({}));
  if (!listas.every(chave => Array.isArray(content?.[chave]))) return json({ erro: 'Conteúdo incompleto.' }, 400);
  // Páginas abertas antes desta versão do painel não enviam a versão: precisam ser recarregadas.
  if (typeof version !== 'string') return desatualizado();
  const fotos = Array.isArray(photos) ? photos.filter(foto =>
    typeof foto?.sha === 'string' && /^[0-9a-f]{40}$/.test(foto.sha) &&
    typeof foto?.path === 'string' && foto.path.startsWith(`${pastaDeFotos}/`) && /^[a-z0-9-]+(-640)?\.(jpg|webp)$/.test(foto.path.slice(pastaDeFotos.length + 1))) : [];
  try {
    return json({ ok: true, version: await gravar(content, fotos, version) });
  } catch (erro) {
    if (erro instanceof ConteudoDesatualizado) return desatualizado();
    return json({ erro: `Não foi possível salvar no GitHub. ${erro}` }, 502);
  }
}
