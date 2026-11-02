import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, Plus, X } from 'lucide-react';
import { aromaList, productsWithAroma } from '../data/catalog';
import { cardSizes, photoSrcSet } from '../data/photos';
import { InstagramLink } from './InstagramLink';
import { PhotoPlaceholder } from './PhotoPlaceholder';
import type { Selection } from './ProductDetails';

interface AromaDialogProps {
  aromaId: string;
  onClose: () => void;
  onOpen: (selection: Selection) => void;
  onAdd: (label: string) => void;
}

export function AromaDialog({ aromaId, onClose, onOpen, onAdd }: AromaDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [added, setAdded] = useState<string[]>([]);
  const name = aromaList.find(aroma => aroma.id === aromaId)?.name ?? '';
  const items = productsWithAroma(aromaId);
  useEffect(() => { const element = dialog.current!; const previous = document.body.style.overflow; if(!element.open)element.showModal();document.body.style.overflow='hidden';return () => {document.body.style.overflow=previous;}; }, []);
  return <dialog className="aroma-dialog" ref={dialog} aria-labelledby="aroma-dialog-title" onClose={onClose} onClick={event => {if(event.target===dialog.current){const rect=dialog.current.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)onClose();}}}>
    <button className="icon-button details-close" aria-label="Fechar" onClick={onClose} autoFocus><X size={20}/></button>
    <header className="aroma-dialog-head">
      <p className="eyebrow">Aroma</p>
      <h2 id="aroma-dialog-title"><em>{name}</em></h2>
      <p>{items.length} {items.length === 1 ? 'produto disponível' : 'produtos disponíveis'} neste aroma</p>
    </header>
    <div className="aroma-dialog-grid">
      {items.map(({ product, aroma, category }) => {
        const label = `${product.name} · ${aroma.name}`;
        const isAdded = added.includes(label);
        const photo = aroma.images[0];
        return <article key={product.id} className="aroma-product">
          <button className="aroma-product-photo" aria-haspopup="dialog" aria-label={`Ver detalhes de ${label}`} onClick={() => {onClose();onOpen({ category, product, aromaId: aroma.id });}}>
            {photo ? <img src={photo.src} srcSet={photoSrcSet(photo.src)} sizes={cardSizes} alt={photo.alt} loading="lazy" width="1086" height="1448"/> : <PhotoPlaceholder/>}
          </button>
          <h3>{product.name}</h3>
          <button className="button primary" onClick={() => {onAdd(label);setAdded([...added, label]);}}>{isAdded ? <Check size={16} aria-hidden="true"/> : <Plus size={16} aria-hidden="true"/>}{isAdded ? 'Adicionado' : 'Adicionar à lista'}</button>
          <button className="text-link" onClick={() => {onClose();onOpen({ category, product, aromaId: aroma.id });}}>Ver detalhes<ArrowUpRight size={15} aria-hidden="true"/></button>
        </article>;
      })}
    </div>
    <p className="sr-only" role="status">{added.length ? `${added[added.length - 1]} adicionado à lista` : ''}</p>
    <footer className="aroma-dialog-foot">
      <p>Quer este aroma em outro produto?</p>
      <InstagramLink className="text-link" label="Perguntar no Instagram"/>
    </footer>
  </dialog>;
}
