export type Group = 'Ambientes' | 'Autocuidado' | 'Carro';
export interface Category { id: string; name: string; group: Group; short?: string }
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
  { id: 'difusores', name: 'Difusores', short: 'Difusor', group: 'Ambientes' },
  { id: 'home-spray', name: 'Home spray', group: 'Ambientes' },
  { id: 'agua-lencois', name: 'Água perfumada para lençóis', short: 'Água para lençóis', group: 'Ambientes' },
  { id: 'saches', name: 'Sachês perfumados', short: 'Sachês', group: 'Ambientes' },
  { id: 'escalda-pes-sal', name: 'Escalda-pés de sal', group: 'Autocuidado' },
  { id: 'escalda-pes-efervescente', name: 'Escalda-pés efervescentes', group: 'Autocuidado' },
  { id: 'sais-banho', name: 'Sais de banho', group: 'Autocuidado' },
  { id: 'sabonetes', name: 'Sabonetes decorados com decoupage', short: 'Sabonetes', group: 'Autocuidado' },
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

type ProdutoAromatico = 'difusor' | 'home-spray';
type FotoDeProduto = { src: string; alt: string };

const fotosDosAromas: Record<string, Record<ProdutoAromatico, FotoDeProduto>> = {
  'flor-de-figo': {
    difusor: {
      src: '/images/products/flor-de-figo-difusor.jpg',
      alt: 'Difusor Flor de Figo em frasco bordô decorado com pérolas.',
    },
    'home-spray': {
      src: '/images/products/flor-de-figo-home-spray.jpg',
      alt: 'Home spray Flor de Figo em frasco bordô decorado com pérolas.',
    },
  },
  'bons-fluidos': {
    difusor: {
      src: '/images/products/bons-fluidos-difusor.jpg',
      alt: 'Difusor Bons Fluidos em frasco rosé decorado com pérolas.',
    },
    'home-spray': {
      src: '/images/products/bons-fluidos-home-spray.jpg',
      alt: 'Home spray Bons Fluidos em frasco rosé decorado com pérolas.',
    },
  },
  'cha-verde': {
    difusor: {
      src: '/images/products/cha-verde-difusor.jpg',
      alt: 'Difusor Chá verde em frasco verde decorado com contas turquesa.',
    },
    'home-spray': {
      src: '/images/products/cha-verde-home-spray.jpg',
      alt: 'Home spray Chá verde em frasco verde decorado com contas turquesa.',
    },
  },
  'flor-de-cerejeira': {
    difusor: {
      src: '/images/products/flor-de-cerejeira-difusor.jpg',
      alt: 'Difusor Flor de Cerejeira em frasco rosado decorado com cristais.',
    },
    'home-spray': {
      src: '/images/products/flor-de-cerejeira-home-spray.jpg',
      alt: 'Home spray Flor de Cerejeira em frasco rosado decorado com cristais.',
    },
  },
  martan: {
    difusor: {
      src: '/images/products/martan-difusor.jpg',
      alt: 'Difusor Martan em frasco prateado decorado com pérolas.',
    },
    'home-spray': {
      src: '/images/products/martan-home-spray.jpg',
      alt: 'Home spray Martan em frasco prateado decorado com pérolas.',
    },
  },
  'quebra-nozes': {
    difusor: {
      src: '/images/products/quebra-nozes-difusor.jpg',
      alt: 'Difusor Quebra-Nozes em frasco âmbar decorado com pérolas.',
    },
    'home-spray': {
      src: '/images/products/quebra-nozes-home-spray.jpg',
      alt: 'Home spray Quebra-Nozes em frasco transparente decorado com pérolas.',
    },
  },
  girassol: {
    difusor: {
      src: '/images/products/girassol-difusor.jpg',
      alt: 'Frasco largo do aroma Girassol em tom âmbar, decorado com contas douradas.',
    },
    'home-spray': {
      src: '/images/products/girassol-home-spray.jpg',
      alt: 'Home spray Girassol em frasco âmbar decorado com pérolas.',
    },
  },
};

const aromasComFotos = (produto: ProdutoAromatico): Aroma[] => aromasDeAmbiente.map(aroma => ({
  ...aroma,
  images: fotosDosAromas[aroma.id] ? [fotosDosAromas[aroma.id][produto]] : [],
}));

export const products: Product[] = [
  {
    id: 'difusor',
    name: 'Difusor',
    categoryId: 'difusores',
    images: [],
    aromas: aromasComFotos('difusor'),
  },
  {
    id: 'home-spray',
    name: 'Home spray',
    categoryId: 'home-spray',
    images: [],
    aromas: aromasComFotos('home-spray'),
  },
];

// Ordem pensada para alternar as cores das fotografias na vitrine.
export const ordemDeDestaque = ['martan', 'cha-verde', 'flor-de-figo', 'flor-de-cerejeira', 'bons-fluidos', 'girassol', 'quebra-nozes'];
export const aromaNames = aromasDeAmbiente.map(aroma => aroma.name);

export interface Highlight { id: string; kind: 'Promoção' | 'Feira'; title: string; text: string; date?: string; location?: string }
export const highlights: Highlight[] = [];
