import { useState } from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { move, uniqueId, type EditorProps } from './fields';

export function AromasEditor({ content, edit }: EditorProps) {
  const [newName, setNewName] = useState('');
  // Só os produtos vendidos por aroma (como difusor e home spray) recebem os aromas novos.
  const withAromas = content.products.filter(product => product.aromas?.length);
  const add = () => {
    const name = newName.trim();
    if (!name) return;
    if (content.aromas.some(aroma => aroma.name.toLowerCase() === name.toLowerCase())) return alert(`O aroma "${name}" já existe.`);
    const id = uniqueId(name, content.aromas.map(aroma => aroma.id));
    edit(draft => {
      draft.aromas.push({ id, name });
      for (const product of draft.products) if (product.aromas?.length) product.aromas.push({ id, images: [] });
    });
    setNewName('');
  };
  const remove = (id: string, name: string) => {
    const using = content.products.filter(product => product.aromas?.some(aroma => aroma.id === id));
    if (!confirm(using.length ? `Excluir "${name}"? Ele também sai de: ${using.map(product => product.name).join(', ')}, junto com as fotos desse aroma.` : `Excluir "${name}"?`)) return;
    edit(draft => {
      draft.aromas = draft.aromas.filter(aroma => aroma.id !== id);
      draft.ordemDeDestaque = draft.ordemDeDestaque.filter(item => item !== id);
      for (const product of draft.products) {
        if (!product.aromas) continue;
        product.aromas = product.aromas.filter(aroma => aroma.id !== id);
        if (!product.aromas.length) delete product.aromas;
      }
    });
  };
  const toggleIn = (productId: string, id: string, on: boolean) => edit(draft => {
    const product = draft.products.find(item => item.id === productId)!;
    const own = product.aromas ?? [];
    product.aromas = on ? draft.aromas.flatMap(aroma => aroma.id === id ? [{ id, images: [] }] : own.filter(item => item.id === aroma.id)) : own.filter(item => item.id !== id);
  });

  return <section>
    <div className="section-head"><div><h2>Aromas</h2><p>Esta ordem é a da faixa de aromas no topo do site. Para fotos e preços de cada aroma, abra o produto em Produtos.</p></div></div>
    <form className="card inline-add" onSubmit={event => { event.preventDefault(); add(); }}>
      <label htmlFor="novo-aroma">Novo aroma</label>
      <div><input id="novo-aroma" value={newName} placeholder="Ex.: Jasmim" onChange={event => setNewName(event.target.value)}/><button className="button primary" disabled={!newName.trim()}><Plus size={18}/>Adicionar</button></div>
      {withAromas.length > 0 && <small>Ele entra automaticamente em: {withAromas.map(product => product.name).join(', ')}.</small>}
    </form>
    <ul className="list aroma-list">
      {content.aromas.map((aroma, index) => <li key={aroma.id} className="aroma-row">
        <div className="reorder">
          <button className="mini-button" aria-label={`Subir ${aroma.name}`} disabled={index === 0} onClick={() => edit(draft => move(draft.aromas, index, index - 1))}><ArrowUp size={15}/></button>
          <button className="mini-button" aria-label={`Descer ${aroma.name}`} disabled={index === content.aromas.length - 1} onClick={() => edit(draft => move(draft.aromas, index, index + 1))}><ArrowDown size={15}/></button>
        </div>
        <div className="aroma-row-main">
          <input aria-label={`Nome do aroma ${index + 1}`} value={aroma.name} onChange={event => edit(draft => { draft.aromas[index].name = event.target.value; })}/>
          {withAromas.length > 0 && <div className="mini-chips">{withAromas.map(product => {
            const on = !!product.aromas?.some(item => item.id === aroma.id);
            return <button key={product.id} type="button" className="chip small" aria-pressed={on} onClick={() => toggleIn(product.id, aroma.id, !on)}>{product.name}</button>;
          })}</div>}
        </div>
        <button className="mini-button danger" aria-label={`Excluir ${aroma.name}`} onClick={() => remove(aroma.id, aroma.name)}><Trash2 size={15}/></button>
      </li>)}
    </ul>
  </section>;
}
