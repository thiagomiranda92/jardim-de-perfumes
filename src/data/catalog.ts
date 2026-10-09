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
// As categorias foram confirmadas. Produtos individuais aguardam cadastro real.
export const products: Product[] = [];
export interface Highlight { id: string; kind: 'Promoção' | 'Feira'; title: string; text: string; date?: string; location?: string }
export const highlights: Highlight[] = [];
