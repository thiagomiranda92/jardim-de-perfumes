import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Instagram, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { store } from '../data/store';
import { orderMessage, type OrderItem } from '../hooks/useOrderList';

interface OrderListProps {
  items: OrderItem[];
  count: number;
  onQuantityChange: (label: string, quantity: number) => void;
}

function OrderDialog({ items, onQuantityChange, onClose }: Omit<OrderListProps, 'count'> & { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);
  const message = orderMessage(items);
  useEffect(() => { const element = dialog.current!; const previous = document.body.style.overflow; if(!element.open)element.showModal();document.body.style.overflow='hidden';return () => {document.body.style.overflow=previous;}; }, []);
  useEffect(() => setCopied(false), [message]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };
  return <dialog className="order-dialog" ref={dialog} aria-labelledby="order-title" onClose={onClose} onClick={event => {if(event.target===dialog.current){const rect=dialog.current.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)onClose();}}}>
    <header className="order-header"><h2 id="order-title">Minha lista</h2><button className="icon-button" aria-label="Fechar lista" onClick={onClose} autoFocus><X size={20}/></button></header>
    {items.length ? <>
      <ul className="order-items">{items.map(item => <li key={item.label}>
        <span>{item.label}</span>
        <div className="order-quantity">
          <button aria-label={`Diminuir ${item.label}`} onClick={() => onQuantityChange(item.label, item.quantity - 1)}>{item.quantity === 1 ? <Trash2 size={15}/> : <Minus size={15}/>}</button>
          <span aria-live="polite">{item.quantity}</span>
          <button aria-label={`Aumentar ${item.label}`} onClick={() => onQuantityChange(item.label, item.quantity + 1)}><Plus size={15}/></button>
        </div>
      </li>)}</ul>
      <div className="order-send">
        <p className="order-steps">O pedido é combinado pelo Instagram. Copie a mensagem, abra a conversa e cole.</p>
        <label htmlFor="order-message">Sua mensagem</label>
        <textarea id="order-message" readOnly rows={Math.min(items.length + 8, 12)} value={message}/>
        <a className="button primary" href={store.instagramMessage} target="_blank" rel="noopener noreferrer" onClick={copy}><Instagram size={17} aria-hidden="true"/>Copiar e abrir o Instagram<span className="sr-only"> (abre em nova aba)</span></a>
        <button className="text-link order-copy" onClick={copy}>{copied ? <Check size={15} aria-hidden="true"/> : <Copy size={15} aria-hidden="true"/>}{copied ? 'Mensagem copiada' : 'Só copiar a mensagem'}</button>
        <p className="sr-only" role="status">{copied ? 'Mensagem copiada' : ''}</p>
      </div>
    </> : <p className="order-empty">Sua lista está vazia. Abra um produto na vitrine e adicione o que quiser.</p>}
  </dialog>;
}

export function OrderList({ items, count, onQuantityChange }: OrderListProps) {
  const [open, setOpen] = useState(false);
  return <>
    {count > 0 && <button className="order-toggle" aria-haspopup="dialog" onClick={() => setOpen(true)}><ShoppingBag size={18} aria-hidden="true"/>Minha lista<span key={count}>{count}</span></button>}
    {open && <OrderDialog items={items} onQuantityChange={onQuantityChange} onClose={() => setOpen(false)}/>}
  </>;
}
