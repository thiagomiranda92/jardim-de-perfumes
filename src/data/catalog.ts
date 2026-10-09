export type Group = 'Ambientes' | 'Autocuidado' | 'Carro';
export interface Category { id: string; name: string; group: Group }
export interface Aroma { id: string; name: string; images: { src: string; alt: string }[]; description?: string; price?: number; available?: boolean }
export interface Product {
  id: string;
  name: string;
  categoryId: string;
  description?: string; // Somente descrição aprovada pela proprietária.
  images: { src: string; alt: string }[];
  price?: number; // Valor real em reais, nunca um preço demonstrativo.
  fragrance?: string;
  size?: string;
  variations?: string[];
  aromas?: Aroma[];
  available?: boolean;
  featured?: boolean;
}
export const categories: Category[] = [
  { id: 'difusores', name: 'Difusores', group: 'Ambientes' },
  { id: 'home-spray', name: 'Home spray', group: 'Ambientes' },
  { id: 'agua-lencois', name: 'Água perfumada para lençóis', group: 'Ambientes' },
  { id: 'saches', name: 'Sachês perfumados', group: 'Ambientes' },
  { id: 'escalda-pes-sal', name: 'Escalda-pés de sal', group: 'Autocuidado' },
  { id: 'escalda-pes-efervescente', name: 'Escalda-pés efervescentes', group: 'Autocuidado' },
  { id: 'sais-banho', name: 'Sais de banho', group: 'Autocuidado' },
  { id: 'sabonetes', name: 'Sabonetes decorados com decoupage', group: 'Autocuidado' },
  { id: 'aromatizadores-carro', name: 'Aromatizadores de carro', group: 'Carro' },
];
const aromasDeAmbiente: Aroma[] = [
  { id: 'lavanda', name: 'Lavanda', images: [] },
  { id: 'acqua', name: 'Acqua', images: [] },
  { id: 'cha-branco', name: 'Chá branco', images: [] },
  { id: 'cha-verde', name: 'Chá verde', images: [] },
  { id: 'rosa-branca', name: 'Rosa branca', images: [] },
  { id: 'cereja-avela', name: 'Cereja e Avelã', images: [] },
  { id: 'girassol', name: 'Girassol', images: [] },
  { id: 'capim-limao', name: 'Capim-limão', images: [] },
  { id: 'baboo', name: 'Baboo', images: [] },
  { id: 'brisa-do-mar', name: 'Brisa do mar', images: [] },
  { id: 'flor-de-cerejeira', name: 'Flor de Cerejeira', images: [] },
  { id: 'martan', name: 'Martan', images: [] },
  { id: 'especiaria-dourada', name: 'Especiaria dourada', images: [] },
  { id: 'doce-encanto', name: 'Doce encanto', images: [] },
  { id: 'vanilla-lemon', name: 'Vanilla lemon', images: [] },
  { id: 'aconchego', name: 'Aconchego', images: [] },
  { id: 'bons-fluidos', name: 'Bons Fluidos', images: [] },
  { id: 'flor-de-figo', name: 'Flor de figo', images: [] },
  { id: 'pistache', name: 'Pistache', images: [] },
  { id: 'primavera', name: 'Primavera', images: [] },
  { id: 'quebra-nozes', name: 'Quebra-Nozes', images: [] },
];

const fotosDosAromas: Record<string, { src: string; alt: string }> = {
  'flor-de-figo': {
    src: '/images/products/flor-de-figo-produtos.webp',
    alt: 'Difusor Flor de Figo à esquerda e home spray Flor de Figo à direita, em frascos bordô decorados com pérolas.',
  },
  'bons-fluidos': {
    src: '/images/products/bons-fluidos-produtos.webp',
    alt: 'Home spray Bons Fluidos à esquerda e difusor Bons Fluidos à direita, em frascos rosé decorados com pérolas.',
  },
  'cha-verde': {
    src: '/images/products/cha-verde-produtos.webp',
    alt: 'Difusor Chá verde à esquerda e home spray Chá verde à direita, em frascos verdes decorados.',
  },
  'flor-de-cerejeira': {
    src: '/images/products/flor-de-cerejeira-produtos.webp',
    alt: 'Difusor Flor de Cerejeira à esquerda e home spray Flor de Cerejeira à direita, em frascos rosados decorados.',
  },
  martan: {
    src: '/images/products/martan-produtos.webp',
    alt: 'Difusor Martan à esquerda e home spray Martan à direita, em frascos prateados decorados com pérolas.',
  },
  'quebra-nozes': {
    src: '/images/products/quebra-nozes-produtos.webp',
    alt: 'Difusor Quebra-Nozes à esquerda e home spray Quebra-Nozes à direita, em frascos decorados com pérolas.',
  },
  girassol: {
    src: '/images/products/girassol-produtos.webp',
    alt: 'Dois home sprays Girassol em frascos âmbar decorados com pérolas.',
  },
};

const aromasComFotos = (): Aroma[] => aromasDeAmbiente.map(aroma => ({
  ...aroma,
  images: fotosDosAromas[aroma.id] ? [fotosDosAromas[aroma.id]] : [],
}));

export const products: Product[] = [
  {
    id: 'difusor',
    name: 'Difusor',
    categoryId: 'difusores',
    images: [],
    aromas: aromasComFotos(),
  },
  {
    id: 'home-spray',
    name: 'Home spray',
    categoryId: 'home-spray',
    images: [],
    aromas: aromasComFotos(),
  },
];
export interface Highlight { id: string; kind: 'Promoção' | 'Feira'; title: string; text: string; date?: string; location?: string }
export const highlights: Highlight[] = [];
