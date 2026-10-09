import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { type Category, type Product, products } from '../data/catalog';
import { PhotoPlaceholder } from './PhotoPlaceholder';
import { InstagramLink } from './InstagramLink';
export interface Selection { category: Category; product?: Product }
const money = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
function DetailsContent({ selection }: { selection: Selection }) {
  const gallery = useRef<HTMLDivElement>(null);
  const items = products.filter(p => p.categoryId === selection.category.id && p.available !== false);
  const [productId, setProductId] = useState(selection.product?.id ?? items[0]?.id);
  const product = items.find(p => p.id === productId);
  const aromas = product?.aromas?.filter(a => a.available !== false) ?? [];
  const [aromaId, setAromaId] = useState<string>();
  const aroma = aromas.find(a => a.id === aromaId) ?? aromas[0];
  const [photoIndex, setPhotoIndex] = useState(0);
  const images = aroma?.images.length ? aroma.images : product?.images ?? [];
  const photo = images[photoIndex] ?? images[0];
  const price = aroma?.price ?? product?.price;
  const selectAroma = (id: string) => {
    setAromaId(id);
    setPhotoIndex(0);
    requestAnimationFrame(() => gallery.current?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    }));
  };
  return <div className="details-grid"><div className="details-gallery" ref={gallery}><div className="details-main-photo" aria-live="polite">{photo ? <img src={photo.src} alt={photo.alt} width="600" height="650"/> : <PhotoPlaceholder/>}</div>{images.length > 1 && <div className="photo-thumbnails" aria-label="Fotografias do produto">{images.map((image, i) => <button key={`${image.src}-${i}`} onClick={() => setPhotoIndex(i)} aria-pressed={photoIndex === i} aria-label={`Ver foto ${i + 1}`}><img src={image.src} alt={image.alt}/></button>)}</div>}</div><div className="details-copy"><p className="eyebrow">{selection.category.group}</p><h2 id="product-detail-title">{product?.name ?? selection.category.name}</h2>{product?.description && <p>{product.description}</p>}{product?.size && <p>{product.size}</p>}{items.length > 1 && <div className="detail-options"><h3>Produtos desta categoria</h3>{items.map(item => <button key={item.id} aria-pressed={item.id === productId} onClick={() => {setProductId(item.id);setAromaId(undefined);setPhotoIndex(0);}}>{item.name}</button>)}</div>}
    <div className="detail-options"><h3>Aromas</h3>{aromas.length ? <><div className="aroma-options">{aromas.map(option => <button key={option.id} aria-pressed={option.id === aroma?.id} onClick={() => selectAroma(option.id)}>{option.name}</button>)}</div><div className="selected-aroma" aria-live="polite"><strong>{aroma?.name}</strong>{aroma?.description && <p>{aroma.description}</p>}</div></> : <p>{product?.fragrance ?? 'Os aromas disponíveis ainda serão adicionados. Consulte as opções pelo Instagram.'}</p>}</div>
    {price !== undefined && <p className="detail-price" aria-live="polite">{money(price)}</p>}{!product && <p>As fotografias, descrições e preços desta categoria serão adicionados em breve.</p>}<InstagramLink label="Consultar este produto"/><p className="detail-delivery">Envio para a região de Campinas. Frete combinado pelo Instagram.</p></div></div>;
}
export function ProductDetails({ selection, onClose }: { selection: Selection; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { const element = dialog.current!; const previous = document.body.style.overflow; if(!element.open)element.showModal();document.body.style.overflow='hidden';return () => {document.body.style.overflow=previous;}; }, []);
  return <dialog className="product-dialog" ref={dialog} aria-labelledby="product-detail-title" onClose={onClose} onClick={event => {if(event.target===dialog.current){const rect=dialog.current.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)onClose();}}}><button className="icon-button details-close" aria-label="Fechar detalhes" onClick={onClose} autoFocus><X size={20}/></button><DetailsContent selection={selection}/></dialog>;
}
