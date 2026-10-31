import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { highlights, type Highlight } from '../data/catalog';
import { FairCalendar } from './FairCalendar';
import { InstagramLink } from './InstagramLink';
const pending: Highlight[] = [
  { id: 'promocoes', kind: 'Promoção', title: 'As novidades florescem por aqui.', text: 'As promoções da Jardim de Perfumes serão anunciadas neste espaço. Enquanto isso, acompanhe nosso Instagram.' },
  { id: 'presentes', kind: 'Presente', title: 'Presentes feitos à mão.', text: 'Os kits e as sugestões de presente serão publicados neste espaço. Para combinar o seu, fale com a gente pelo Instagram.' },
];
const eyebrow: Record<Highlight['kind'], string> = { 'Promoção': 'Novidades & promoções', 'Presente': 'Kits & presentes' };
export function Highlights() {
  const slides = highlights.length ? highlights : pending;
  const [index, setIndex] = useState(0);
  const current = slides[index % slides.length];
  return <section id="novidades" className="highlights" aria-label="Novidades, presentes e feiras">
    <div className="shell highlights-inner">
      <div className="highlight-panel" data-reveal>
        {current.image && <img key={current.image.src} className="highlight-image" src={current.image.src} alt={current.image.alt} loading="lazy"/>}
        <div className="highlight-copy" key={current.id} aria-live="polite" aria-atomic="true"><p className="eyebrow">{eyebrow[current.kind]}</p><h2>{current.title}</h2><p>{current.text}</p>{current.validity && <p><strong>{current.validity}</strong></p>}<InstagramLink className="text-link" label="Falar no Instagram" /></div>
        <div className="carousel-controls"><span>{String(index + 1).padStart(2, '0')} <span className="muted">/ {String(slides.length).padStart(2, '0')}</span></span><button className="icon-button" aria-label="Novidade anterior" onClick={() => setIndex((index + slides.length - 1) % slides.length)}><ArrowLeft size={18}/></button><button className="icon-button" aria-label="Próxima novidade" onClick={() => setIndex((index + 1) % slides.length)}><ArrowRight size={18}/></button></div>
      </div>
      <div data-reveal><FairCalendar/></div>
    </div>
  </section>;
}
