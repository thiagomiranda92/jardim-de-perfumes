import { useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Sparkles } from 'lucide-react';
import { highlights, type Highlight } from '../data/catalog';
import { InstagramLink } from './InstagramLink';
const pending: Highlight[] = [
  { id: 'promocoes', kind: 'Promoção' as const, title: 'As novidades florescem por aqui.', text: 'As promoções da Jardim de Perfumes serão anunciadas neste espaço. Enquanto isso, acompanhe nosso Instagram.' },
  { id: 'feiras', kind: 'Feira' as const, title: 'Nosso próximo encontro.', text: 'Participamos de feiras artesanais. Assim que as próximas datas e locais forem confirmados, você encontrará os detalhes aqui.' },
];
export function Highlights() {
  const slides = highlights.length ? highlights : pending;
  const [index, setIndex] = useState(0);
  const current = slides[index % slides.length];
  return <section id="novidades" className="highlights section-shell" aria-label="Novidades e feiras">
    <div className="highlight-art" aria-hidden="true">{current.kind === 'Feira' ? <CalendarDays size={64} strokeWidth={.8} /> : <Sparkles size={64} strokeWidth={.8} />}<span>Jardim em movimento</span></div>
    <div className="highlight-copy" aria-live="polite" aria-atomic="true"><p className="eyebrow">{current.kind === 'Feira' ? 'Agenda de feiras' : 'Novidades & promoções'}</p><h2>{current.title}</h2><p>{current.text}</p>{current.date && <p><strong>{current.date}</strong>{current.location && ` · ${current.location}`}</p>}<InstagramLink className="text-link" label="Acompanhar no Instagram" /></div>
    <div className="carousel-controls"><span>{String(index + 1).padStart(2, '0')} <span className="muted">/ {String(slides.length).padStart(2, '0')}</span></span><button className="icon-button" aria-label="Novidade anterior" onClick={() => setIndex((index + slides.length - 1) % slides.length)}><ArrowLeft size={18}/></button><button className="icon-button" aria-label="Próxima novidade" onClick={() => setIndex((index + 1) % slides.length)}><ArrowRight size={18}/></button></div>
  </section>;
}
