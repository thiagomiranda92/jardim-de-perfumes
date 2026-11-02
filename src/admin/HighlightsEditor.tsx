import { useState } from 'react';
import { ArrowDown, ArrowUp, Plus } from 'lucide-react';
import { highlightKinds, type Highlight } from '../data/catalog';
import { Field, FormHeader, ListRow, PhotoList, TextArea, TextField, move, uniqueId, type EditorProps } from './fields';

export function HighlightsEditor({ content, edit }: EditorProps) {
  const [openId, setOpenId] = useState<string>();
  const highlight = content.highlights.find(item => item.id === openId);
  if (highlight) {
    const change = (fn: (item: Highlight) => void) => edit(draft => fn(draft.highlights.find(item => item.id === highlight.id)!));
    const remove = () => {
      if (!confirm(`Excluir "${highlight.title || 'sem título'}"?`)) return;
      edit(draft => { draft.highlights = draft.highlights.filter(item => item.id !== highlight.id); });
      setOpenId(undefined);
    };
    return <section className="form" key={highlight.id}>
      <FormHeader title={highlight.title || 'Nova novidade'} onBack={() => setOpenId(undefined)} onDelete={remove}/>
      <div className="card">
        <Field label="Tipo">{id => <select id={id} value={highlight.kind} onChange={event => change(item => { item.kind = event.target.value as Highlight['kind']; })}>{highlightKinds.map(kind => <option key={kind}>{kind}</option>)}</select>}</Field>
        <TextField label="Título" required placeholder="Ex.: Kit Dia das Mães" value={highlight.title} onChange={value => change(item => { item.title = value ?? ''; })}/>
        <TextArea label="Texto" required hint="O que está incluído, preço, condições." value={highlight.text} onChange={value => change(item => { item.text = value ?? ''; })}/>
        <TextField label="Validade" placeholder="Ex.: Até 30 de novembro" value={highlight.validity} onChange={value => change(item => { item.validity = value; })}/>
      </div>
      <div className="card">
        <h3>Foto</h3>
        <PhotoList max={1} photos={highlight.image ? [highlight.image] : []} name={highlight.title} onChange={photos => change(item => { item.image = photos[0]; })}/>
      </div>
    </section>;
  }

  const create = () => {
    const id = uniqueId('novidade', content.highlights.map(item => item.id));
    edit(draft => { draft.highlights.push({ id, kind: 'Promoção', title: '', text: '' }); });
    setOpenId(id);
  };
  return <section>
    <div className="section-head">
      <div><h2>Promoções e kits</h2><p>Aparecem no carrossel de novidades, nesta ordem. Sem nenhum cadastro, o site mostra avisos de que as novidades virão em breve.</p></div>
      <button className="button primary" onClick={create}><Plus size={18}/>Nova novidade</button>
    </div>
    {content.highlights.length ? <ul className="list">{content.highlights.map((item, index) => <ListRow key={item.id} photo={item.image} title={item.title || 'Sem título'} subtitle={[item.kind, item.validity].filter(Boolean).join(' · ')} onOpen={() => setOpenId(item.id)} before={<div className="reorder">
      <button className="mini-button" aria-label="Subir" disabled={index === 0} onClick={() => edit(draft => move(draft.highlights, index, index - 1))}><ArrowUp size={15}/></button>
      <button className="mini-button" aria-label="Descer" disabled={index === content.highlights.length - 1} onClick={() => edit(draft => move(draft.highlights, index, index + 1))}><ArrowDown size={15}/></button>
    </div>}/>)}</ul> : <p className="empty">Nenhuma promoção ou kit cadastrado.</p>}
  </section>;
}
