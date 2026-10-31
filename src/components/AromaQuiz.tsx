import { useState } from 'react';
import { ArrowLeft, ArrowUpRight, Check, Plus, RotateCcw } from 'lucide-react';
import { categories, products, type Aroma } from '../data/catalog';
import { perfilDosAromas, perguntaClima, perguntaFamilia, perguntaProduto, type Clima, type Familia } from '../data/quiz';
import { cardSizes, photoSrcSet } from '../data/photos';
import { PhotoPlaceholder } from './PhotoPlaceholder';
import type { Selection } from './ProductDetails';

interface Answers { productId?: string; clima?: Clima; familia?: Familia }

// Clima pesa mais que família; no empate, vem primeiro o aroma que já tem fotografia.
function recommend(aromas: Aroma[], { clima, familia }: Answers) {
  const score = (aroma: Aroma) => {
    const profile = perfilDosAromas[aroma.id];
    if (!profile) return -1;
    return (profile.clima === clima ? 2 : 0) + (profile.familia === familia ? 1 : 0) + (aroma.images.length ? .5 : 0);
  };
  return aromas.filter(aroma => perfilDosAromas[aroma.id]).sort((a, b) => score(b) - score(a)).slice(0, 3);
}

export function AromaQuiz({ onOpen, onAdd }: { onOpen: (selection: Selection) => void; onAdd: (label: string) => void }) {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [addedLabel, setAddedLabel] = useState<string>();
  const questions = [perguntaProduto, perguntaClima, perguntaFamilia];
  const keys = ['productId', 'clima', 'familia'] as const;
  const finished = step >= questions.length;
  const product = products.find(item => item.id === answers.productId);
  const category = categories.find(item => item.id === product?.categoryId);
  const results = finished && product ? recommend(product.aromas ?? [], answers) : [];
  const [main, ...others] = results;
  const open = (aroma: Aroma) => category && product && onOpen({ category, product, aromaId: aroma.id });
  const restart = () => {
    setAnswers({});
    setStep(0);
    setAddedLabel(undefined);
  };
  const mainLabel = product && main ? `${product.name} · ${main.name}` : '';
  return <section id="quiz" className="quiz shell">
    <div className="quiz-intro">
      <p className="eyebrow" data-reveal>Descubra seu aroma</p>
      <h2 data-reveal>Qual aroma <em>combina com você?</em></h2>
      <p data-reveal>Três perguntas rápidas para encontrar um bom ponto de partida no nosso jardim.</p>
    </div>
    <div className="quiz-card" data-reveal>
      {!finished ? <div key={step} className="quiz-step">
        <div className="quiz-progress" role="img" aria-label={`Pergunta ${step + 1} de ${questions.length}`}>{questions.map((_, index) => <span key={index} className={index <= step ? 'is-done' : ''}/>)}</div>
        <h3>{questions[step].title}</h3>
        <div className="quiz-options">{questions[step].options.map(option => <button key={option.value} onClick={() => {setAnswers({ ...answers, [keys[step]]: option.value });setStep(step + 1);}}>{option.label}<ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true"/></button>)}</div>
        {step > 0 && <button className="text-link quiz-back" onClick={() => setStep(step - 1)}><ArrowLeft size={15} aria-hidden="true"/>Voltar</button>}
      </div> : main && <div className="quiz-result" role="status">
        <div className="quiz-photo">{main.images[0] ? <img src={main.images[0].src} srcSet={photoSrcSet(main.images[0].src)} sizes={cardSizes} alt={main.images[0].alt} width="1086" height="1448"/> : <PhotoPlaceholder/>}</div>
        <div className="quiz-summary">
          <p className="eyebrow">Sugestão para você</p>
          <h3><small>{product?.name}</small>{main.name}</h3>
          <div className="quiz-actions">
            <button className="button primary" onClick={() => {onAdd(mainLabel);setAddedLabel(mainLabel);}}>{addedLabel === mainLabel ? <Check size={17} aria-hidden="true"/> : <Plus size={17} aria-hidden="true"/>}{addedLabel === mainLabel ? 'Adicionado à lista' : 'Adicionar à lista'}</button>
            <button className="text-link" onClick={() => open(main)}>Ver detalhes<ArrowUpRight size={15} aria-hidden="true"/></button>
          </div>
          {others.length > 0 && <div className="quiz-others"><p>Também pode combinar:</p><div>{others.map(aroma => <button key={aroma.id} onClick={() => open(aroma)}>{aroma.name}</button>)}</div></div>}
          <button className="text-link quiz-back" onClick={restart}><RotateCcw size={15} aria-hidden="true"/>Refazer</button>
        </div>
      </div>}
    </div>
  </section>;
}
