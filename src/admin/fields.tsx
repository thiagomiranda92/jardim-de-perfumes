import { useId, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, ImagePlus, Loader2, Trash2 } from 'lucide-react';
import type { Content, Photo } from '../data/catalog';
import { asset } from '../data/photos';
import { uploadPhoto } from './api';

// Cada tela do painel recebe o rascunho e uma função que o altera; nada vai ao site antes de "Salvar alterações".
export type Edit = (change: (draft: Content) => void) => void;
export interface EditorProps { content: Content; edit: Edit }

export const slugify = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item';
export const uniqueId = (text: string, taken: string[]) => {
  const base = slugify(text);
  let id = base;
  for (let n = 2; taken.includes(id); n++) id = `${base}-${n}`;
  return id;
};
export const money = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
export const move = <T,>(list: T[], from: number, to: number) => {
  if (to < 0 || to >= list.length) return;
  const [item] = list.splice(from, 1);
  list.splice(to, 0, item);
};

export function Field({ label, hint, children }: { label: string; hint?: string; children: (id: string) => ReactNode }) {
  const id = useId();
  return <div className="field"><label htmlFor={id}>{label}</label>{children(id)}{hint && <small>{hint}</small>}</div>;
}

export function TextField({ label, hint, value, onChange, required, placeholder, type = 'text' }: { label: string; hint?: string; value?: string; onChange: (value: string | undefined) => void; required?: boolean; placeholder?: string; type?: string }) {
  return <Field label={required ? `${label} *` : label} hint={hint}>{id => <input id={id} type={type} value={value ?? ''} placeholder={placeholder} required={required} onChange={event => onChange(event.target.value || undefined)}/>}</Field>;
}

export function TextArea({ label, hint, value, onChange, required }: { label: string; hint?: string; value?: string; onChange: (value: string | undefined) => void; required?: boolean }) {
  return <Field label={required ? `${label} *` : label} hint={hint}>{id => <textarea id={id} rows={4} value={value ?? ''} required={required} onChange={event => onChange(event.target.value || undefined)}/>}</Field>;
}

// Aceita "29,90", "29.90" ou "1.250,00"; vazio significa sem preço na página.
const parsePrice = (text: string) => {
  const clean = text.replace(/[R$\s]/g, '');
  if (!clean) return undefined;
  const value = Number(clean.includes(',') ? clean.replace(/\./g, '').replace(',', '.') : clean);
  return Number.isFinite(value) && value >= 0 ? Math.round(value * 100) / 100 : NaN;
};
export function PriceField({ label = 'Preço', hint = 'Deixe vazio para não mostrar preço.', value, onChange }: { label?: string; hint?: string; value?: number; onChange: (value: number | undefined) => void }) {
  const format = (n?: number) => n === undefined ? '' : n.toFixed(2).replace('.', ',');
  const [text, setText] = useState(format(value));
  const parsed = parsePrice(text);
  return <Field label={label} hint={Number.isNaN(parsed) ? 'Valor inválido. Use, por exemplo, 39,90.' : hint}>{id => <div className={`price-input${Number.isNaN(parsed) ? ' is-invalid' : ''}`}><span>R$</span><input id={id} inputMode="decimal" placeholder="0,00" value={text} onChange={event => {
    setText(event.target.value);
    const next = parsePrice(event.target.value);
    if (!Number.isNaN(next)) onChange(next);
  }} onBlur={() => { if (!Number.isNaN(parsed)) setText(format(parsed)); }}/></div>}</Field>;
}

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="toggle"><input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)}/><span aria-hidden="true"/>{label}</label>;
}

export function Thumb({ photo }: { photo?: Photo }) {
  return <span className="thumb">{photo && <img src={asset(photo.src)} alt="" loading="lazy"/>}</span>;
}

export function PhotoList({ photos, onChange, name, max }: { photos: Photo[]; onChange: (photos: Photo[]) => void; name: string; max?: number }) {
  const input = useRef<HTMLInputElement>(null);
  const [sending, setSending] = useState(0);
  const [error, setError] = useState<string>();
  const latest = useRef(photos);
  latest.current = photos;
  const full = max !== undefined && photos.length >= max;
  const send = async (files: FileList) => {
    setError(undefined);
    const list = [...files].slice(0, max === undefined ? undefined : max - photos.length);
    setSending(list.length);
    for (const file of list) {
      try {
        const src = await uploadPhoto(file, name || 'foto');
        latest.current = [...latest.current, { src, alt: name }];
        onChange(latest.current);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Não foi possível enviar a foto.');
      }
      setSending(n => n - 1);
    }
  };
  const update = (index: number, change: (list: Photo[]) => void) => {
    const next = photos.map(photo => ({ ...photo }));
    change(next);
    onChange(next);
  };
  return <div className="photo-list">
    {photos.length > 0 && <ul>
      {photos.map((photo, index) => <li key={photo.src}>
        <img src={asset(photo.src)} alt=""/>
        <div className="photo-tools">
          {photos.length > 1 && <>
            <button type="button" className="mini-button" aria-label="Mover foto para a esquerda" disabled={index === 0} onClick={() => update(index, list => move(list, index, index - 1))}><ArrowLeft size={15}/></button>
            <button type="button" className="mini-button" aria-label="Mover foto para a direita" disabled={index === photos.length - 1} onClick={() => update(index, list => move(list, index, index + 1))}><ArrowRight size={15}/></button>
          </>}
          <button type="button" className="mini-button danger" aria-label="Remover foto" onClick={() => update(index, list => list.splice(index, 1))}><Trash2 size={15}/></button>
        </div>
        <Field label="Descrição da foto" hint="Ajuda quem usa leitor de tela.">{id => <input id={id} value={photo.alt} onChange={event => update(index, list => { list[index].alt = event.target.value; })}/>}</Field>
      </li>)}
    </ul>}
    {!full && <button type="button" className="upload-button" disabled={sending > 0} onClick={() => input.current?.click()}>
      {sending > 0 ? <><Loader2 size={18} className="spin"/>Enviando {sending > 1 ? `${sending} fotos` : 'foto'}…</> : <><ImagePlus size={18}/>{photos.length ? 'Adicionar outra foto' : 'Adicionar foto'}</>}
    </button>}
    <input ref={input} type="file" accept="image/*" multiple={max !== 1} hidden onChange={event => { if (event.target.files?.length) send(event.target.files); event.target.value = ''; }}/>
    {error && <p className="form-error" role="alert">{error}</p>}
  </div>;
}

export function ListRow({ photo, title, subtitle, badge, onOpen, before }: { photo?: Photo | null; title: string; subtitle?: string; badge?: string; onOpen: () => void; before?: ReactNode }) {
  return <li className={before ? 'row-with-order' : undefined}>{before}<button className="list-row" onClick={onOpen}>
    {photo !== null && <Thumb photo={photo}/>}
    <span className="list-text"><strong>{title}</strong>{subtitle && <small>{subtitle}</small>}</span>
    {badge && <span className="badge">{badge}</span>}
    <ChevronRight size={18} aria-hidden="true"/>
  </button></li>;
}

export function FormHeader({ title, onBack, onDelete, deleteLabel }: { title: string; onBack: () => void; onDelete?: () => void; deleteLabel?: string }) {
  return <div className="form-header">
    <button className="back-button" onClick={onBack}><ChevronLeft size={18}/>Voltar</button>
    <h2>{title}</h2>
    {onDelete && <button className="mini-button danger with-text" onClick={onDelete}><Trash2 size={15}/>{deleteLabel ?? 'Excluir'}</button>}
  </div>;
}
