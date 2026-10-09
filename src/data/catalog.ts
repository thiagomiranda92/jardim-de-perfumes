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

export const products: Product[] = [
  {
    id: 'difusor',
    name: 'Difusor',
    categoryId: 'difusores',
    images: [],
    aromas: aromasDeAmbiente.map(aroma => ({ ...aroma, images: [...aroma.images] })),
  },
  {
    id: 'home-spray',
    name: 'Home spray',
    categoryId: 'home-spray',
    images: [],
    aromas: aromasDeAmbiente.map(aroma => ({ ...aroma, images: [...aroma.images] })),
  },
];
export interface Highlight { id: string; kind: 'Promoção' | 'Feira'; title: string; text: string; date?: string; location?: string }
export const highlights: Highlight[] = [];
