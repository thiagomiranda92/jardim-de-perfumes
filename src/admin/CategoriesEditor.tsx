import { useState } from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { groups, type Category } from '../data/catalog';
import { Field, FormHeader, ListRow, TextField, move, uniqueId, type EditorProps } from './fields';

function SizesField({ sizes, onChange }: { sizes: string[]; onChange: (sizes: string[]) => void }) {
  const [text, setText] = useState('');
  const add = () => {
    const size = text.trim();
    if (!size) return;
    if (!sizes.some(item => item.toLowerCase() === size.toLowerCase())) onChange([...sizes, size]);
    setText('');
  };
  return <>
    {sizes.length > 0 && <ul className="size-list">{sizes.map((size, index) => <li key={size}>
      <span>{size}</span>
      <button type="button" className="mini-button" aria-label={`Mover ${size} para cima`} disabled={index === 0} onClick={() => { const next = [...sizes]; move(next, index, index - 1); onChange(next); }}><ArrowUp size={15}/></button>
      <button type="button" className="mini-button danger" aria-label={`Remover ${size}`} onClick={() => onChange(sizes.filter(item => item !== size))}><Trash2 size={15}/></button>
    </li>)}</ul>}
    <div className="inline-add"><label htmlFor="novo-tamanho" className="sr-only">Novo tamanho</label><div>
      <input id="novo-tamanho" value={text} placeholder="Ex.: 250 ml" onChange={event => setText(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); add(); } }}/>
      <button type="button" className="button primary" disabled={!text.trim()} onClick={add}><Plus size={18}/>Adicionar</button>
    </div></div>
  </>;
}

export function CategoriesEditor({ content, edit }: EditorProps) {
  const [openId, setOpenId] = useState<string>();
  const category = content.categories.find(item => item.id === openId);
  if (category) {
    const count = content.products.filter(product => product.categoryId === category.id).length;
    const change = (fn: (item: Category) => void) => edit(draft => fn(draft.categories.find(item => item.id === category.id)!));
    const remove = () => {
      if (count) return alert(`Esta categoria tem ${count} ${count === 1 ? 'produto' : 'produtos'}. Mude-os de categoria ou exclua-os antes.`);
      if (!confirm(`Excluir a categoria "${category.name || 'sem nome'}"?`)) return;
      edit(draft => { draft.categories = draft.categories.filter(item => item.id !== category.id); });
      setOpenId(undefined);
    };
    return <section className="form" key={category.id}>
      <FormHeader title={category.name || 'Nova categoria'} onBack={() => setOpenId(undefined)} onDelete={remove}/>
      <div className="card">
        <TextField label="Nome" required value={category.name} onChange={value => change(item => { item.name = value ?? ''; })}/>
        <TextField label="Nome curto" hint="Usado nos botões da vitrine quando o nome é longo." value={category.short} onChange={value => change(item => { item.short = value; })}/>
        <Field label="Grupo">{id => <select id={id} value={category.group} onChange={event => change(item => { item.group = event.target.value as Category['group']; })}>{groups.map(group => <option key={group}>{group}</option>)}</select>}</Field>
      </div>
      <div className="card">
        <h3>Tamanhos padrão</h3>
        <p className="card-hint">Ao cadastrar um produto desta categoria, o tamanho é escolhido só entre estas opções. Um tamanho chamado “Vidro” não tem medida fixa: ao escolhê-lo, o produto pede quantos ml. Deixe a lista vazia quando a categoria não tiver tamanho padrão: aí o tamanho é digitado em cada produto.</p>
        <SizesField sizes={category.sizes ?? []} onChange={sizes => change(item => { if (sizes.length) item.sizes = sizes; else delete item.sizes; })}/>
      </div>
    </section>;
  }

  const create = () => {
    const id = uniqueId('nova-categoria', content.categories.map(item => item.id));
    edit(draft => { draft.categories.push({ id, name: '', group: 'Ambientes' }); });
    setOpenId(id);
  };
  return <section>
    <div className="section-head">
      <div><h2>Categorias</h2><p>Os botões da vitrine, nesta ordem.</p></div>
      <button className="button primary" onClick={create}><Plus size={18}/>Nova categoria</button>
    </div>
    <ul className="list">{content.categories.map((item, index) => {
      const count = content.products.filter(product => product.categoryId === item.id).length;
      return <ListRow key={item.id} photo={null} title={item.name || 'Sem nome'} subtitle={[item.group, `${count} ${count === 1 ? 'produto' : 'produtos'}`, item.sizes?.length ? `Tamanhos: ${item.sizes.join(', ')}` : 'Tamanho livre'].join(' · ')} onOpen={() => setOpenId(item.id)} before={<div className="reorder">
        <button className="mini-button" aria-label={`Subir ${item.name}`} disabled={index === 0} onClick={() => edit(draft => move(draft.categories, index, index - 1))}><ArrowUp size={15}/></button>
        <button className="mini-button" aria-label={`Descer ${item.name}`} disabled={index === content.categories.length - 1} onClick={() => edit(draft => move(draft.categories, index, index + 1))}><ArrowDown size={15}/></button>
      </div>}/>;
    })}</ul>
  </section>;
}
