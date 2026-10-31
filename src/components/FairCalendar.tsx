import { useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Clock, MapPin, Navigation } from 'lucide-react';
import { fairs, type FairEvent } from '../data/catalog';
import { InstagramLink } from './InstagramLink';

const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const pad = (value: number) => String(value).padStart(2, '0');
const toIso = (year: number, month: number, day: number) => `${year}-${pad(month + 1)}-${pad(day)}`;
const fromIso = (iso: string) => {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
};
const longDate = (iso: string) => new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(fromIso(iso));
const mapUrl = ({ location, address }: FairEvent) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([location, address].filter(Boolean).join(', '))}`;

export function FairCalendar() {
  const today = new Date();
  const todayIso = toIso(today.getFullYear(), today.getMonth(), today.getDate());
  const sorted = [...fairs].sort((a, b) => a.date.localeCompare(b.date));
  const next = sorted.find(fair => fair.date >= todayIso);
  const start = next ? fromIso(next.date) : today;
  const [month, setMonth] = useState({ year: start.getFullYear(), month: start.getMonth() });
  const [selected, setSelected] = useState(next?.date);

  const first = new Date(month.year, month.month, 1);
  const total = new Date(month.year, month.month + 1, 0).getDate();
  const title = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(first);
  const move = (step: number) => {
    const target = new Date(month.year, month.month + step, 1);
    setMonth({ year: target.getFullYear(), month: target.getMonth() });
    const prefix = toIso(target.getFullYear(), target.getMonth(), 1).slice(0, 7);
    setSelected(sorted.find(fair => fair.date.startsWith(prefix))?.date);
  };
  const selectedFairs = sorted.filter(fair => fair.date === selected);

  return <div className="fair-calendar">
    <div className="calendar-head">
      <div><p className="eyebrow">Agenda de feiras</p><h3>{title}</h3></div>
      <div className="calendar-nav">
        <button className="icon-button" aria-label="Mês anterior" onClick={() => move(-1)}><ArrowLeft size={18}/></button>
        <button className="icon-button" aria-label="Próximo mês" onClick={() => move(1)}><ArrowRight size={18}/></button>
      </div>
    </div>
    <div className="calendar-grid" role="group" aria-label={`Calendário de ${title}`}>
      {weekDays.map(day => <span className="calendar-weekday" key={day} aria-hidden="true">{day.slice(0, 3)}</span>)}
      {Array.from({ length: first.getDay() }, (_, index) => <span key={`vazio-${index}`}/>)}
      {Array.from({ length: total }, (_, index) => {
        const day = index + 1;
        const iso = toIso(month.year, month.month, day);
        const hasFair = sorted.some(fair => fair.date === iso);
        const classes = ['calendar-day', iso === todayIso && 'is-today', iso < todayIso && 'is-past'].filter(Boolean).join(' ');
        return hasFair
          ? <button key={iso} className={`${classes} has-fair`} aria-pressed={selected === iso} aria-label={`${longDate(iso)}, feira marcada`} onClick={() => setSelected(iso)}>{day}</button>
          : <span key={iso} className={classes}>{day}</span>;
      })}
    </div>
    <div className="calendar-details" aria-live="polite">
      {selectedFairs.length > 0 ? selectedFairs.map(fair => <article key={fair.id}>
        <p className="calendar-date">{longDate(fair.date)}</p>
        <h4>{fair.title}</h4>
        <ul>
          {fair.time && <li><Clock size={16} aria-hidden="true"/>{fair.time}</li>}
          <li><MapPin size={16} aria-hidden="true"/><span>{fair.location}{fair.address && <small>{fair.address}</small>}</span></li>
        </ul>
        {fair.note && <p className="calendar-note">{fair.note}</p>}
        <a className="text-link" href={mapUrl(fair)} target="_blank" rel="noopener noreferrer"><Navigation size={15} aria-hidden="true"/>Ver no mapa<span className="sr-only"> (abre em nova aba)</span></a>
      </article>) : <div className="calendar-empty">
        <CalendarDays size={22} strokeWidth={1.3} aria-hidden="true"/>
        <p>{sorted.length ? 'Nenhuma feira marcada neste mês.' : 'As próximas datas serão publicadas aqui assim que forem confirmadas.'}</p>
        {!sorted.length && <InstagramLink className="text-link" label="Acompanhar no Instagram"/>}
      </div>}
    </div>
  </div>;
}
