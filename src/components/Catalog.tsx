import { useEffect, useRef } from 'react';
import { ArrowUpRight, Flower2, Plus, Search, X } from 'lucide-react';
import { categories, ordemDeDestaque, products, type Aroma, type Category, type Product } from '../data/catalog';
import { InstagramLink } from './InstagramLink';
import { PhotoPlaceholder } from './PhotoPlaceholder';
import type { Selection } from './ProductDetails';

interface Card { key: string; label: string; name: string; image?: { src: string; alt: string }; selection: Selection }

const normalize = (value: string) => value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const productsOf = (category: Category) => products.filter(p => p.categoryId === category.id && p.available !== false);
const aromasOf = (product: Product) => product.aromas?.filter(a => a.available !== false) ?? [];
const destaque = (aroma: Aroma) => {
  const index = ordemDeDestaque.indexOf(aroma.id);
  return index < 0 ? ordemDeDestaque.length : index;
};
const aromaCard = (category: Category, product: Product, aroma: Aroma): Card => ({
  key: `${product.id}-${aroma.id}`,
  label: product.name,
  name: aroma.name,
  image: aroma.images[0],
  selection: { category, product, aromaId: aroma.id },
});
const productCard = (category: Category, product: Product): Card => ({
  key: product.id,
  label: category.name,
  name: product.name,
  image: product.images[0],
  selection: { category, product },
});

function CatalogCard({ card, onOpen }: { card: Card; onOpen: (selection: Selection) => void }) {
  return <article>
    <button className="aroma-card" aria-haspopup="dialog" aria-label={`Ver ${card.label} ${card.name}`} onClick={() => onOpen(card.selection)}>
      <span className="aroma-photo">{card.image ? <img src={card.image.src} alt={card.image.alt} loading="lazy" width="1086" height="1448"/> : <PhotoPlaceholder/>}</span>
      <span className="aroma-caption"><span><small>{card.label}</small>{card.name}</span><ArrowUpRight size={20} strokeWidth={1.5} aria-hidden="true"/></span>
    </button>
  </article>;
}

interface CatalogProps {
  categoryId: string;
  onCategoryChange: (id: string) => void;
  query: string;
  onQueryChange: (value: string) => void;
  onOpen: (selection: Selection) => void;
  onAdd: (label: string) => void;
}

export function Catalog({ categoryId, onCategoryChange, query, onQueryChange: setQuery, onOpen, onAdd }: CatalogProps) {
  const switcher = useRef<HTMLDivElement>(null);
  // No celular os botões rolam na horizontal: mantém a categoria aberta visível, inclusive vinda das figurinhas.
  useEffect(() => {
    const row = switcher.current;
    const active = row?.querySelector<HTMLElement>('[aria-pressed=true]');
    if (row && active) row.scrollLeft = active.offsetLeft - (row.clientWidth - active.offsetWidth) / 2;
  }, [categoryId]);
  const category = categories.find(item => item.id === categoryId)!;
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  const searching = terms.length > 0;

  // Na categoria aberta, os aromas com fotografia viram cards e os demais ficam listados abaixo deles.
  const items = productsOf(category);
  const cards = items.flatMap(product => {
    const aromas = aromasOf(product);
    if (!aromas.length) return [productCard(category, product)];
    return aromas.filter(a => a.images.length).sort((a, b) => destaque(a) - destaque(b)).map(aroma => aromaCard(category, product, aroma));
  });
  const withoutPhoto = items.flatMap(product => aromasOf(product).filter(a => !a.images.length).map(aroma => ({ product, aroma })));

  // A busca percorre a vitrine inteira, ignorando a categoria aberta.
  const results: Card[] = !searching ? [] : categories.flatMap(item => {
    const base = [item.name, item.group];
    const matches = (...parts: (string | undefined)[]) => terms.every(term => normalize([...base, ...parts].join(' ')).includes(term));
    const found = productsOf(item).flatMap(product => {
      const aromas = aromasOf(product);
      const own = [product.name, product.description, product.fragrance];
      if (!aromas.length) return matches(...own) ? [productCard(item, product)] : [];
      return aromas.filter(aroma => matches(...own, aroma.name)).map(aroma => aromaCard(item, product, aroma));
    });
    if (productsOf(item).length || !matches()) return found;
    return [{ key: item.id, label: item.group, name: item.name, selection: { category: item } }];
  });

  return <section id="colecao" className="gallery shell">
    <div className="section-heading">
      <div>
        <p className="eyebrow" data-reveal>Conheça nosso jardim</p>
        <h2 data-reveal>Pequenos cuidados.<br/><em>Boas lembranças.</em></h2>
      </div>
      <div className="catalog-search" data-reveal><Search size={18} aria-hidden="true"/><label className="sr-only" htmlFor="catalog-search">Buscar produtos ou aromas</label><input id="catalog-search" type="search" placeholder="Buscar produtos ou aromas" value={query} onChange={event => setQuery(event.target.value)}/>{query && <button aria-label="Limpar busca" onClick={() => setQuery('')}><X size={16}/></button>}</div>
    </div>
    <div className="gallery-switch" ref={switcher} role="group" aria-label="Escolher categoria" data-reveal>
      {categories.map(item => <button key={item.id} aria-pressed={!searching && categoryId === item.id} onClick={() => {onCategoryChange(item.id);setQuery('');}}>{item.short ?? item.name}</button>)}
    </div>
    <div data-reveal>
      {searching ? <>
        <p className="results-count" role="status">{results.length} {results.length === 1 ? 'resultado' : 'resultados'} neste jardim</p>
        {results.length > 0 && <div className="gallery-grid">{results.map(card => <CatalogCard key={card.key} card={card} onOpen={onOpen}/>)}</div>}
        {!results.length && <div className="catalog-empty"><Search size={30} strokeWidth={1.2} aria-hidden="true"/><h3>Nenhum resultado por aqui.</h3><p>Tente outro nome ou escolha uma categoria.</p><button className="text-link" onClick={() => setQuery('')}>Ver toda a vitrine</button></div>}
      </> : <div key={category.id} className="gallery-panel">
        {cards.length > 0 && <div className="gallery-grid">{cards.map(card => <CatalogCard key={card.key} card={card} onOpen={onOpen}/>)}</div>}
        {withoutPhoto.length > 0 && <button className="more-aromas" aria-haspopup="dialog" onClick={() => onOpen({ category, product: withoutPhoto[0].product })}>
          <span><small>Mais {withoutPhoto.length} aromas</small>{withoutPhoto.map(({ aroma }) => aroma.name).join(' · ')}</span>
          <ArrowUpRight size={22} strokeWidth={1.5} aria-hidden="true"/>
        </button>}
        {!cards.length && <div className="catalog-empty"><Flower2 size={34} strokeWidth={1.1} aria-hidden="true"/><h3>{category.name}</h3><p>As fotografias, descrições e preços desta categoria serão adicionados em breve.</p><div className="details-actions"><button className="button primary" onClick={() => onAdd(category.name)}><Plus size={17} aria-hidden="true"/>Adicionar à lista</button><InstagramLink label="Consultar pelo Instagram" className="text-link"/></div></div>}
      </div>}
    </div>
  </section>;
}
