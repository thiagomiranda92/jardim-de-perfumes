import { useState } from 'react';
import { ArrowDown, ArrowUp, Plus } from 'lucide-react';
import { groups, type Category } from '../data/catalog';
import { Field, FormHeader, ListRow, TextField, move, uniqueId, type EditorProps } from './fields';

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
      return <ListRow key={item.id} photo={null} title={item.name || 'Sem nome'} subtitle={`${item.group} · ${count} ${count === 1 ? 'produto' : 'produtos'}`} onOpen={() => setOpenId(item.id)} before={<div className="reorder">
        <button className="mini-button" aria-label={`Subir ${item.name}`} disabled={index === 0} onClick={() => edit(draft => move(draft.categories, index, index - 1))}><ArrowUp size={15}/></button>
        <button className="mini-button" aria-label={`Descer ${item.name}`} disabled={index === content.categories.length - 1} onClick={() => edit(draft => move(draft.categories, index, index + 1))}><ArrowDown size={15}/></button>
      </div>}/>;
    })}</ul>
  </section>;
}
