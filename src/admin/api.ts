import type { Content } from '../data/catalog';

// As rotas /api/* são atendidas pelo servidor local (scripts/painel-local.ts) durante o `pnpm dev`.
const pedir = async (url: string, init?: RequestInit) => {
  let resposta: Response;
  try {
    resposta = await fetch(url, init);
  } catch {
    throw new Error('Sem conexão com o servidor. Verifique se o site está rodando.');
  }
  const corpo = await resposta.json().catch(() => undefined);
  if (resposta.status === 404) throw new Error('Este endereço ainda não salva alterações. Por enquanto, use o painel com o site rodando no computador (pnpm dev).');
  if (!resposta.ok) throw new Error(corpo?.erro ?? `Erro ${resposta.status} ao falar com o servidor.`);
  return corpo;
};

export const loadContent = (): Promise<Content> => pedir('/api/conteudo', { cache: 'no-store' });

export const saveContent = (content: Content) => pedir('/api/conteudo', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(content),
});

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
  const { src } = await pedir(`/api/fotos?nome=${encodeURIComponent(name)}`, { method: 'POST', headers: { 'Content-Type': 'application/octet-stream' }, body: corpo });
  return src;
};
