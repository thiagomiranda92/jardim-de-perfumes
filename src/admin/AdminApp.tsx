import { useCallback, useEffect, useState } from 'react';
import { ArrowUpRight, CalendarDays, Check, Flower2, Gift, LayoutGrid, Loader2, Package } from 'lucide-react';
import type { Content } from '../data/catalog';
import { store } from '../data/store';
import { loadContent, saveContent } from './api';
import { AromasEditor } from './AromasEditor';
import { CategoriesEditor } from './CategoriesEditor';
import { FairsEditor } from './FairsEditor';
import { HighlightsEditor } from './HighlightsEditor';
import { ProductsEditor } from './ProductsEditor';
import type { Edit } from './fields';

const tabs = [
  { id: 'produtos', label: 'Produtos', icon: Package, Editor: ProductsEditor },
  { id: 'novidades', label: 'Promoções e kits', icon: Gift, Editor: HighlightsEditor },
  { id: 'feiras', label: 'Feiras', icon: CalendarDays, Editor: FairsEditor },
  { id: 'aromas', label: 'Aromas', icon: Flower2, Editor: AromasEditor },
  { id: 'categorias', label: 'Categorias', icon: LayoutGrid, Editor: CategoriesEditor },
];

// Campos obrigatórios antes de salvar; o site quebraria ou mostraria cards vazios sem eles.
const problems = (content: Content) => [
  ...content.products.filter(item => !item.name.trim()).map(() => 'Há um produto sem nome.'),
  ...content.products.filter(item => !content.categories.some(category => category.id === item.categoryId)).map(item => `O produto "${item.name}" está sem categoria.`),
  ...content.categories.filter(item => !item.name.trim()).map(() => 'Há uma categoria sem nome.'),
  ...content.aromas.filter(item => !item.name.trim()).map(() => 'Há um aroma sem nome.'),
  ...content.highlights.filter(item => !item.title.trim() || !item.text.trim()).map(item => `A novidade "${item.title || 'sem título'}" precisa de título e texto.`),
  ...content.fairs.filter(item => !item.title.trim() || !item.date || !item.location.trim()).map(item => `A feira "${item.title || 'sem nome'}" precisa de nome, data e local.`),
];

export function AdminApp() {
  const [saved, setSaved] = useState<Content>();
  const [draft, setDraft] = useState<Content>();
  const [loadError, setLoadError] = useState<string>();
  const [tab, setTab] = useState(() => tabs.find(item => `#${item.id}` === location.hash)?.id ?? tabs[0].id);
  const [status, setStatus] = useState<{ kind: 'saving' | 'saved' | 'error'; message?: string }>();
  const [version, setVersion] = useState(0);

  useEffect(() => {
    loadContent().then(content => { setSaved(content); setDraft(content); }, error => setLoadError(error.message));
  }, []);
  useEffect(() => {
    const follow = () => { const found = tabs.find(item => `#${item.id}` === location.hash); if (found) setTab(found.id); };
    addEventListener('hashchange', follow);
    return () => removeEventListener('hashchange', follow);
  }, []);
  const dirty = !!draft && JSON.stringify(draft) !== JSON.stringify(saved);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    addEventListener('beforeunload', warn);
    return () => removeEventListener('beforeunload', warn);
  }, [dirty]);

  const edit: Edit = useCallback(change => {
    setStatus(undefined);
    setDraft(previous => {
      const next = structuredClone(previous!);
      change(next);
      return next;
    });
  }, []);
  const save = async () => {
    const found = problems(draft!);
    if (found.length) return setStatus({ kind: 'error', message: [...new Set(found)].join(' ') });
    setStatus({ kind: 'saving' });
    try {
      await saveContent(draft!);
      setSaved(draft);
      setStatus({ kind: 'saved' });
    } catch (error) {
      setStatus({ kind: 'error', message: error instanceof Error ? error.message : 'Não foi possível salvar.' });
    }
  };
  const discard = () => {
    if (!confirm('Descartar todas as alterações que ainda não foram salvas?')) return;
    setDraft(saved);
    setStatus(undefined);
    setVersion(v => v + 1);
  };
  const openTab = (id: string) => {
    setTab(id);
    history.replaceState(null, '', `#${id}`);
    scrollTo({ top: 0 });
  };

  const { Editor } = tabs.find(item => item.id === tab)!;
  return <div className={`admin${dirty || status ? ' has-bar' : ''}`}>
    <header className="admin-header">
      <div className="admin-shell admin-top">
        <a className="admin-brand" href="/" target="_blank" rel="noopener"><img src={store.logo} alt="" width="44" height="37"/><span>Jardim <i>de</i> Perfumes<small>Painel</small></span></a>
        <a className="view-site" href="/" target="_blank" rel="noopener">Ver site<ArrowUpRight size={15}/></a>
      </div>
      <nav className="admin-shell admin-tabs" aria-label="Seções do painel">
        {tabs.map(({ id, label, icon: Icon }) => <button key={id} aria-current={tab === id ? 'page' : undefined} onClick={() => openTab(id)}><Icon size={17} aria-hidden="true"/>{label}</button>)}
      </nav>
    </header>
    <main className="admin-shell admin-main">
      {loadError ? <div className="card notice"><h2>Não foi possível abrir o painel</h2><p>{loadError}</p></div>
        : draft ? <Editor key={`${tab}-${version}`} content={draft} edit={edit}/>
        : <p className="loading"><Loader2 size={20} className="spin"/>Carregando…</p>}
    </main>
    {(dirty || status) && <div className="save-bar" role="region" aria-label="Salvar alterações">
      <div className="admin-shell save-inner">
        <p role="status" className={status?.kind === 'error' ? 'is-error' : undefined}>
          {status?.kind === 'saved' && !dirty ? <><Check size={17}/>Salvo! O site já mostra as alterações.</>
            : status?.kind === 'error' ? status.message
            : status?.kind === 'saving' ? 'Salvando…'
            : 'Você tem alterações que ainda não foram salvas.'}
        </p>
        {dirty && <div className="save-actions">
          <button className="button ghost" onClick={discard} disabled={status?.kind === 'saving'}>Descartar</button>
          <button className="button primary" onClick={save} disabled={status?.kind === 'saving'}>{status?.kind === 'saving' ? <Loader2 size={17} className="spin"/> : <Check size={17}/>}Salvar alterações</button>
        </div>}
      </div>
    </div>}
  </div>;
}
