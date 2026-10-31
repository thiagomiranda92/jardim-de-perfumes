import { useEffect, useRef, useState } from 'react';
import { Check, Plus, X } from 'lucide-react';
import { type Category, type Product, products } from '../data/catalog';
import { store } from '../data/store';
import { fullSizes, photoSrcSet } from '../data/photos';
import { PhotoPlaceholder } from './PhotoPlaceholder';
import { InstagramLink } from './InstagramLink';
export interface Selection { category: Category; product?: Product; aromaId?: string }
const money = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
function DetailsContent({ selection, onAdd }: { selection: Selection; onAdd: (label: string) => void }) {
  const gallery = useRef<HTMLDivElement>(null);
  const [addedLabel, setAddedLabel] = useState<string>();
  const items = products.filter(p => p.categoryId === selection.category.id && p.available !== false);
  const [productId, setProductId] = useState(selection.product?.id ?? items[0]?.id);
  const product = items.find(p => p.id === productId);
  const aromas = product?.aromas?.filter(a => a.available !== false) ?? [];
  const [aromaId, setAromaId] = useState(selection.aromaId);
  // Sem aroma escolhido, começa pelo primeiro que já tem fotografia.
  const aroma = aromas.find(a => a.id === aromaId) ?? aromas.find(a => a.images.length) ?? aromas[0];
  const [photoIndex, setPhotoIndex] = useState(0);
  const images = aroma?.images.length ? aroma.images : product?.images ?? [];
  const photo = images[photoIndex] ?? images[0];
  const price = aroma?.price ?? product?.price;
  const orderLabel = product ? [product.name, aroma?.name].filter(Boolean).join(' · ') : selection.category.name;
  const addToList = () => {
    onAdd(orderLabel);
    setAddedLabel(orderLabel);
  };
  const selectAroma = (id: string) => {
    setAromaId(id);
    setPhotoIndex(0);
    requestAnimationFrame(() => gallery.current?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'nearest',
    }));
  };
  return <div className="details-grid">
    <div className="details-gallery" ref={gallery}>
      <div className="details-main-photo" aria-live="polite">{photo ? <img key={photo.src} src={photo.src} srcSet={photoSrcSet(photo.src)} sizes={fullSizes} alt={photo.alt} width="1086" height="1448"/> : <PhotoPlaceholder/>}</div>
      {images.length > 1 && <div className="photo-thumbnails" aria-label="Fotografias do produto">{images.map((image, i) => <button key={`${image.src}-${i}`} onClick={() => setPhotoIndex(i)} aria-pressed={photoIndex === i} aria-label={`Ver foto ${i + 1}`}><img src={image.src} alt={image.alt}/></button>)}</div>}
    </div>
    <div className="details-copy">
      <p className="eyebrow">{selection.category.group}</p>
      <h2 id="product-detail-title">{product?.name ?? selection.category.name}{aroma && <em>{aroma.name}</em>}</h2>
      {product?.description && <p>{product.description}</p>}
      {product?.size && <p>{product.size}</p>}
      {aroma?.description && <p>{aroma.description}</p>}
      {price !== undefined && <p className="detail-price" aria-live="polite">{money(price)}</p>}
      {items.length > 1 && <div className="detail-options"><h3>Produtos desta categoria</h3><div className="option-list">{items.map(item => <button key={item.id} aria-pressed={item.id === productId} onClick={() => {setProductId(item.id);setAromaId(undefined);setPhotoIndex(0);}}>{item.name}</button>)}</div></div>}
      <div className="detail-options"><h3>Aromas</h3>{aromas.length ? <div className="option-list">{aromas.map(option => <button key={option.id} aria-pressed={option.id === aroma?.id} onClick={() => selectAroma(option.id)}>{option.name}{option.images.length > 0 && <span className="has-photo" title="Com fotografia"><span className="sr-only"> (com fotografia)</span></span>}</button>)}</div> : <p>{product?.fragrance ?? 'Os aromas disponíveis ainda serão adicionados. Consulte as opções pelo Instagram.'}</p>}</div>
      {!product && <p>As fotografias, descrições e preços desta categoria serão adicionados em breve.</p>}
      <div className="details-actions">
        <button className="button primary" onClick={addToList}>{addedLabel === orderLabel ? <Check size={17} aria-hidden="true"/> : <Plus size={17} aria-hidden="true"/>}{addedLabel === orderLabel ? 'Adicionado à lista' : 'Adicionar à lista'}</button>
      </div>
      <div className="details-consult"><InstagramLink label="Consultar pelo Instagram" className="text-link"/></div>
      <p className="sr-only" role="status">{addedLabel === orderLabel ? `${orderLabel} adicionado à lista` : ''}</p>
      <p className="detail-delivery">{store.delivery}</p>
    </div>
  </div>;
}
export function ProductDetails({ selection, onClose, onAdd }: { selection: Selection; onClose: () => void; onAdd: (label: string) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { const element = dialog.current!; const previous = document.body.style.overflow; if(!element.open)element.showModal();document.body.style.overflow='hidden';return () => {document.body.style.overflow=previous;}; }, []);
  return <dialog className="product-dialog" ref={dialog} aria-labelledby="product-detail-title" onClose={onClose} onClick={event => {if(event.target===dialog.current){const rect=dialog.current.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)onClose();}}}><button className="icon-button details-close" aria-label="Fechar detalhes" onClick={onClose} autoFocus><X size={20}/></button><DetailsContent selection={selection} onAdd={onAdd}/></dialog>;
}
