import type { Content } from '../data/catalog';
import { asset } from '../data/photos';

// As rotas /api/* são atendidas pelo servidor local (scripts/painel-local.ts) durante o `pnpm dev`
// e pelas funções do Vercel (api/) no site publicado, que gravam no GitHub.
export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

const pedir = async (url: string, init?: RequestInit) => {
  let resposta: Response;
  try {
    resposta = await fetch(url, { credentials: 'same-origin', ...init });
  } catch {
    throw new ApiError('Sem conexão com o servidor. Verifique a internet e tente de novo.', 0);
  }
  const corpo = await resposta.json().catch(() => undefined);
  if (resposta.status === 404) throw new ApiError('Este endereço não salva alterações. Use o painel em jardimdeperfumes.vercel.app/adm.', 404);
  if (!resposta.ok) throw new ApiError(corpo?.erro ?? `Erro ${resposta.status} ao falar com o servidor.`, resposta.status);
  return corpo;
};

// `version` identifica o conteúdo carregado; o servidor recusa salvar (409) se ele mudou nesse meio-tempo.
export const loadContent = (): Promise<{ content: Content; version: string }> => pedir('/api/conteudo', { cache: 'no-store' });

export const login = (senha: string) => pedir('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ senha }) });
export const logout = () => pedir('/api/sair', { method: 'POST' });

// Fotos enviadas online só entram no site no próximo "Salvar alterações"; até lá, o painel mostra a cópia do próprio aparelho.
const pending = new Map<string, { path: string; sha: string }[]>();
const previews = new Map<string, string>();
export const photoUrl = (src: string) => previews.get(src) ?? asset(src);

export const saveContent = async (content: Content, version: string): Promise<string> => {
  const text = JSON.stringify(content);
  const used = [...pending].filter(([src]) => text.includes(JSON.stringify(src)));
  const corpo = await pedir('/api/conteudo', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, version, photos: used.flatMap(([, files]) => files) }),
  });
  for (const [src] of used) pending.delete(src);
  return corpo.version;
};

// Fotos de celular costumam ter vários megabytes: reduz para até 1600 px antes de enviar.
const reduzir = async (file: File) => {
  try {
    const bitmap = await createImageBitmap(file);
    const escala = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * escala);
    canvas.height = Math.round(bitmap.height * escala);
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    return await new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(), 'image/jpeg', 0.9));
  } catch {
    return file;
  }
};

export const uploadPhoto = async (file: File, name: string): Promise<string> => {
  const corpo = await reduzir(file);
  const { src, pending: files } = await pedir(`/api/fotos?nome=${encodeURIComponent(name)}`, { method: 'POST', headers: { 'Content-Type': 'application/octet-stream' }, body: corpo });
  if (files) {
    pending.set(src, files);
    previews.set(src, URL.createObjectURL(corpo));
  }
  return src;
};
