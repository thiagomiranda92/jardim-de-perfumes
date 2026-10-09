import { useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { categories, products, type Group } from '../data/catalog';
import { PhotoPlaceholder } from './PhotoPlaceholder';
import { ProductDetails, type Selection } from './ProductDetails';
const filters = ['Todos', 'Ambientes', 'Autocuidado', 'Carro'] as const;
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export function Catalog() {
  const [filter, setFilter] = useState<Group | 'Todos'>('Todos');
  const [query, setQuery] = useState('');
  const [selection, setSelection] = useState<Selection>();
  const entries: Selection[] = categories.filter(c => filter === 'Todos' || c.group === filter).flatMap(category => {
    const items = products.filter(p => p.categoryId === category.id && p.available !== false);
    return items.length ? items.map(product => ({ category, product })) : [{ category }];
  });
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  const visible = entries.filter(({ category, product }) => {
    const text = normalize([category.name, category.group, product?.name, product?.description, product?.fragrance, ...(product?.aromas?.filter(a=>a.available!==false).map(a => a.name) ?? [])].join(' '));
    return terms.every(term => text.includes(term));
  });
  return <section id="colecao" className="catalog section-shell">
    <div className="section-heading"><div><p className="eyebrow">Conheça nosso jardim</p><h2>Pequenos cuidados.<br/><em>Boas lembranças.</em></h2></div><p>Explore nossas categorias de aromas e autocuidado. Produtos artesanais, feitos à mão.</p></div>
    <div className="catalog-tools"><div className="filters" role="group" aria-label="Filtrar categorias">{filters.map(f => <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}>{f}</button>)}</div><div className="catalog-search"><Search size={18} aria-hidden="true"/><label className="sr-only" htmlFor="catalog-search">Buscar produtos ou aromas</label><input id="catalog-search" type="search" placeholder="Buscar produtos ou aromas" value={query} onChange={event => setQuery(event.target.value)}/>{query && <button aria-label="Limpar busca" onClick={() => setQuery('')}><X size={16}/></button>}</div></div>
    <p className="catalog-note">Clique em um card para conhecer os detalhes. Fotografias, aromas e preços serão adicionados em breve.</p>
    <div className="product-grid">{visible.map(entry => {const { category, product } = entry;return <article className="product-card" key={product?.id ?? category.id}><button className="product-open" aria-haspopup="dialog" aria-label={`Ver detalhes de ${product?.name ?? category.name}`} onClick={() => setSelection(entry)}>{product?.images[0] ? <img className="product-photo" src={product.images[0].src} alt={product.images[0].alt} loading="lazy" width="600" height="650"/> : <PhotoPlaceholder variant={categories.indexOf(category)}/>}<span className="product-info"><span className="product-category">{category.group}</span><span className="product-title">{product?.name ?? category.name}</span>{product?.price !== undefined && <span className="card-price">{new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(product.price)}</span>}<span className="card-details-link">Ver detalhes & aromas <ArrowUpRight size={16}/></span></span></button></article>;})}</div>
    {!visible.length && <div className="search-empty"><Search size={26} aria-hidden="true"/><h3>Nenhum resultado por aqui.</h3><p>Tente outro nome ou escolha uma categoria diferente.</p><button className="text-link" onClick={() => {setQuery('');setFilter('Todos');}}>Ver toda a vitrine</button></div>}
    <p className="results-count" role="status">{visible.length} {visible.length === 1 ? 'resultado' : 'resultados'} neste jardim</p>
    {selection && <ProductDetails selection={selection} onClose={() => setSelection(undefined)}/>}
  </section>;
}
