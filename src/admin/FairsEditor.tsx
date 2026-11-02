import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { FairEvent } from '../data/catalog';
import { FormHeader, ListRow, TextArea, TextField, uniqueId, type EditorProps } from './fields';

const pad = (value: number) => String(value).padStart(2, '0');
const todayIso = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const longDate = (iso: string) => {
  const [year, month, day] = iso.split('-').map(Number);
  return year ? new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(year, month - 1, day)) : 'Sem data';
};

export function FairsEditor({ content, edit }: EditorProps) {
  const [openId, setOpenId] = useState<string>();
  const today = todayIso();
  const fair = content.fairs.find(item => item.id === openId);
  if (fair) {
    const change = (fn: (item: FairEvent) => void) => edit(draft => fn(draft.fairs.find(item => item.id === fair.id)!));
    const remove = () => {
      if (!confirm(`Excluir "${fair.title || 'feira sem nome'}"?`)) return;
      edit(draft => { draft.fairs = draft.fairs.filter(item => item.id !== fair.id); });
      setOpenId(undefined);
    };
    return <section className="form" key={fair.id}>
      <FormHeader title={fair.title || 'Nova feira'} onBack={() => setOpenId(undefined)} onDelete={remove}/>
      <div className="card">
        <TextField label="Nome da feira" required placeholder="Ex.: Feira de Artesanato do Taquaral" value={fair.title} onChange={value => change(item => { item.title = value ?? ''; })}/>
        <div className="field-row">
          <TextField label="Data" type="date" required value={fair.date} onChange={value => change(item => { item.date = value ?? ''; })}/>
          <TextField label="Horário" placeholder="Ex.: 9h às 16h" value={fair.time} onChange={value => change(item => { item.time = value; })}/>
        </div>
        <TextField label="Local" required placeholder="Ex.: Parque Portugal" hint="O botão “Ver no mapa” procura por local e endereço." value={fair.location} onChange={value => change(item => { item.location = value ?? ''; })}/>
        <TextField label="Endereço" placeholder="Rua, número, bairro, cidade" value={fair.address} onChange={value => change(item => { item.address = value; })}/>
        <TextArea label="Observação" value={fair.note} onChange={value => change(item => { item.note = value; })}/>
      </div>
    </section>;
  }

  const create = () => {
    const id = uniqueId(`feira-${today}`, content.fairs.map(item => item.id));
    edit(draft => { draft.fairs.push({ id, date: today, title: '', location: '' }); });
    setOpenId(id);
  };
  const sorted = [...content.fairs].sort((a, b) => a.date.localeCompare(b.date));
  const past = sorted.filter(item => item.date < today);
  const next = sorted.filter(item => item.date >= today);
  const row = (item: FairEvent) => <ListRow key={item.id} photo={null} title={item.title || 'Feira sem nome'} subtitle={[longDate(item.date), item.time, item.location].filter(Boolean).join(' · ')} onOpen={() => setOpenId(item.id)}/>;
  return <section>
    <div className="section-head">
      <div><h2>Feiras</h2><p>Os dias aparecem marcados no calendário do site, com local e link para o mapa.</p></div>
      <button className="button primary" onClick={create}><Plus size={18}/>Nova feira</button>
    </div>
    <div className="list-group"><h3>Próximas</h3>{next.length ? <ul className="list">{next.map(row)}</ul> : <p className="empty">Nenhuma feira marcada.</p>}</div>
    {past.length > 0 && <div className="list-group past">
      <div className="group-head"><h3>Já aconteceram</h3><button className="text-button" onClick={() => { if (confirm(`Apagar ${past.length} ${past.length === 1 ? 'feira passada' : 'feiras passadas'}?`)) edit(draft => { draft.fairs = draft.fairs.filter(item => item.date >= today); }); }}>Apagar todas</button></div>
      <ul className="list">{past.reverse().map(row)}</ul>
    </div>}
  </section>;
}
