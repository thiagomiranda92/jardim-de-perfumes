import { asset } from './photos';
import conteudo from './conteudo.json';

// Todo o conteúdo editável fica em conteudo.json, que o painel de administração (/adm) altera.
export type Group = 'Ambientes' | 'Autocuidado' | 'Carro';
export const groups: Group[] = ['Ambientes', 'Autocuidado', 'Carro'];
export interface Photo { src: string; alt: string }
// `sizes`: tamanhos padrão da categoria, oferecidos como opções no cadastro do produto. Sem eles, o tamanho é digitado livremente.
export interface Category { id: string; name: string; group: Group; short?: string; sizes?: string[] }
export interface Aroma { id: string; name: string; images: Photo[]; description?: string; price?: number; available?: boolean }
// Tamanho à venda de um produto, com foto e preço próprios. Sem foto ou preço, valem os do produto.
export interface Variant { size: string; images: Photo[]; price?: number; available?: boolean }
export interface Product {
  id: string;
  name: string;
  categoryId: string;
  description?: string; // Somente descrição aprovada pela proprietária.
  images: Photo[];
  price?: number; // Valor real em reais, nunca um preço demonstrativo.
  fragrance?: string;
  size?: string;
  variations?: string[];
  variants?: Variant[];
  aromas?: Aroma[];
  available?: boolean;
  featured?: boolean;
}

// Promoções, kits e presentes exibidos no carrossel. Cadastre somente informações confirmadas.
export type HighlightKind = 'Promoção' | 'Kit' | 'Presente';
export const highlightKinds: HighlightKind[] = ['Promoção', 'Kit', 'Presente'];
export interface Highlight { id: string; kind: HighlightKind; title: string; text: string; price?: number; validity?: string; image?: Photo }

// Feiras exibidas no calendário. `date` usa o formato AAAA-MM-DD; o local gera o link para o mapa.
export interface FairEvent { id: string; date: string; title: string; time?: string; location: string; address?: string; note?: string }

// Formato de conteudo.json: nos produtos, cada aroma guarda só o identificador, e o nome vem da lista `aromas`.
export type StoredAroma = Omit<Aroma, 'name'>;
export interface StoredProduct extends Omit<Product, 'aromas'> { aromas?: StoredAroma[] }
export interface Content {
  categories: Category[];
  aromas: { id: string; name: string }[];
  products: StoredProduct[];
  ordemDeDestaque: string[];
  highlights: Highlight[];
  fairs: FairEvent[];
}

const dados = conteudo as Content;
const comCaminho = (foto: Photo): Photo => ({ ...foto, src: asset(foto.src) });

export const categories = dados.categories;
export const aromaList = dados.aromas;
export const products: Product[] = dados.products.map(produto => ({
  ...produto,
  images: produto.images.map(comCaminho),
  variants: produto.variants?.map(variante => ({ ...variante, images: variante.images.map(comCaminho) })),
  aromas: produto.aromas?.flatMap(aroma => {
    const name = aromaList.find(item => item.id === aroma.id)?.name;
    return name ? [{ ...aroma, name, images: aroma.images.map(comCaminho) }] : [];
  }),
}));

export const availableVariants = (product: Product) => product.variants?.filter(variant => variant.available !== false) ?? [];
// Capa do produto: a própria foto ou, sem ela, a do primeiro tamanho que tiver foto.
export const coverPhoto = (product: Product): Photo | undefined => product.images[0] ?? availableVariants(product).find(variant => variant.images.length)?.images[0];

// Ordem pensada para alternar as cores das fotografias na vitrine.
export const ordemDeDestaque = dados.ordemDeDestaque;
// Todos os produtos disponíveis em um aroma, para a tela aberta pela faixa de aromas.
// Produtos sem lista de aromas entram quando o campo de aroma (`fragrance`) tem o nome do aroma.
const normalizar = (texto = '') => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
export const productsWithAroma = (aromaId: string) => {
  const name = aromaList.find(item => item.id === aromaId)?.name ?? '';
  return products.flatMap(product => {
    const category = categories.find(item => item.id === product.categoryId);
    if (!category || product.available === false) return [];
    const aroma = product.aromas?.length
      ? product.aromas.find(item => item.id === aromaId && item.available !== false)
      : name && normalizar(product.fragrance) === normalizar(name) ? { id: aromaId, name, images: product.images } : undefined;
    return aroma ? [{ product, aroma, category }] : [];
  });
};

export const highlights: Highlight[] = dados.highlights.map(destaque => destaque.image ? { ...destaque, image: comCaminho(destaque.image) } : destaque);
export const fairs = dados.fairs;
