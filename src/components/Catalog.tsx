import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { categories, products, type Group } from '../data/catalog';
import { store } from '../data/store';
import { PhotoPlaceholder } from './PhotoPlaceholder';
const filters = ['Todos', 'Ambientes', 'Autocuidado', 'Carro'] as const;
export function Catalog() {
  const [filter, setFilter] = useState<Group | 'Todos'>('Todos');
  const visible = categories.filter(c => filter === 'Todos' || c.group === filter);
  return <section id="colecao" className="catalog section-shell">
    <div className="section-heading"><div><p className="eyebrow">Conheça nosso jardim</p><h2>Pequenos cuidados.<br/><em>Boas lembranças.</em></h2></div><p>Explore nossas categorias de aromas e autocuidado. Produtos artesanais, feitos à mão.</p></div>
    <div className="filters" role="group" aria-label="Filtrar categorias">{filters.map(f => <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}>{f}</button>)}</div>
    <p className="catalog-note">Nossa vitrine está florescendo. Fotografias, detalhes e preços serão adicionados em breve.</p>
    <div className="product-grid">{visible.flatMap((category) => {
      const items = products.filter(p => p.categoryId === category.id && p.available !== false);
      if (!items.length) return [<article className="product-card" key={category.id}><PhotoPlaceholder variant={categories.indexOf(category)}/><div className="product-info"><span className="product-category">{category.group}</span><h3>{category.name}</h3><a href={store.instagram} target="_blank" rel="noopener noreferrer" aria-label={`Consultar ${category.name} no Instagram (abre em nova aba)`}>Consultar no Instagram <ArrowUpRight size={16}/></a></div></article>];
      return items.map(product => <article className="product-card" key={product.id}>{product.images[0] ? <img className="product-photo" src={product.images[0].src} alt={product.images[0].alt} loading="lazy" width="600" height="650"/> : <PhotoPlaceholder/>}<div className="product-info"><span className="product-category">{category.name}</span><h3>{product.name}</h3>{product.description && <p>{product.description}</p>}{product.fragrance && <p>{product.fragrance}</p>}{product.size && <p>{product.size}</p>}{product.price !== undefined && <p className="price">{new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(product.price)}</p>}<a href={store.instagram} target="_blank" rel="noopener noreferrer" aria-label={`Consultar ${product.name} no Instagram (abre em nova aba)`}>Consultar no Instagram <ArrowUpRight size={16}/></a></div></article>);
    })}</div>
    <p className="results-count" role="status">{visible.length} {visible.length === 1 ? 'categoria' : 'categorias'} neste jardim</p>
  </section>;
}
