import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { ArrowUpRight, CalendarDays, Check, Flower2, Gift, LayoutGrid, Loader2, LogOut, Package } from 'lucide-react';
import type { Content } from '../data/catalog';
import { store } from '../data/store';
import { ApiError, loadContent, login, logout, saveContent } from './api';
import { AromasEditor } from './AromasEditor';
import { CategoriesEditor } from './CategoriesEditor';
import { FairsEditor } from './FairsEditor';
import { HighlightsEditor } from './HighlightsEditor';
import { ProductsEditor } from './ProductsEditor';
import { isGlassSize, type Edit } from './fields';

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
  ...content.products.filter(item => item.size && isGlassSize(item.size) && content.categories.find(category => category.id === item.categoryId)?.sizes?.includes(item.size)).map(item => `Informe quantos ml tem o produto "${item.name}".`),
  ...content.products.filter(item => item.variants?.some(variant => !variant.size.trim())).map(item => `Escolha o tamanho de todos os tamanhos do produto "${item.name}".`),
  ...content.products.filter(item => item.variants?.some(variant => isGlassSize(variant.size) && content.categories.find(category => category.id === item.categoryId)?.sizes?.includes(variant.size))).map(item => `Informe quantos ml tem o tamanho de vidro do produto "${item.name}".`),
  ...content.products.filter(item => item.variants && new Set(item.variants.map(variant => variant.size)).size < item.variants.length).map(item => `O produto "${item.name}" tem o mesmo tamanho cadastrado duas vezes.`),
  ...content.categories.filter(item => !item.name.trim()).map(() => 'Há uma categoria sem nome.'),
  ...content.aromas.filter(item => !item.name.trim()).map(() => 'Há um aroma sem nome.'),
  ...content.highlights.filter(item => !item.title.trim() || !item.text.trim()).map(item => `A novidade "${item.title || 'sem título'}" precisa de título e texto.`),
  ...content.fairs.filter(item => !item.title.trim() || !item.date || !item.location.trim()).map(item => `A feira "${item.title || 'sem nome'}" precisa de nome, data e local.`),
];

function LoginForm({ expired, onDone }: { expired: boolean; onDone: () => void }) {
  const [senha, setSenha] = useState('');
  const [error, setError] = useState<string>();
  const [sending, setSending] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSending(true);
    setError(undefined);
    try {
      await login(senha);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar.');
      setSending(false);
    }
  };
  return <form className="card login" onSubmit={submit}>
    <h2>{expired ? 'Entre de novo' : 'Entrar no painel'}</h2>
    <p className="card-hint">{expired ? 'Sua sessão terminou. Suas alterações continuam aqui: entre e clique em Salvar alterações.' : 'Área restrita da Jardim de Perfumes.'}</p>
    <div className="field"><label htmlFor="senha">Senha</label><input id="senha" type="password" autoComplete="current-password" autoFocus value={senha} onChange={event => setSenha(event.target.value)}/></div>
    {error && <p className="form-error" role="alert">{error}</p>}
    <button className="button primary" disabled={!senha || sending}>{sending && <Loader2 size={17} className="spin"/>}Entrar</button>
  </form>;
}

export function AdminApp() {
  const [saved, setSaved] = useState<Content>();
  const [contentVersion, setContentVersion] = useState<string>();
  const [draft, setDraft] = useState<Content>();
  const [loadError, setLoadError] = useState<string>();
  const [needsLogin, setNeedsLogin] = useState(false);
  const [tab, setTab] = useState(() => tabs.find(item => `#${item.id}` === location.hash)?.id ?? tabs[0].id);
  const [status, setStatus] = useState<{ kind: 'saving' | 'saved' | 'error'; message?: string }>();
  const [version, setVersion] = useState(0);

  const load = useCallback(() => {
    setLoadError(undefined);
    loadContent().then(({ content, version }) => { setSaved(content); setDraft(content); setContentVersion(version); setNeedsLogin(false); }, error => {
      if (error instanceof ApiError && error.status === 401) setNeedsLogin(true);
      else setLoadError(error.message);
    });
  }, []);
  useEffect(load, [load]);
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
      setContentVersion(await saveContent(draft!, contentVersion!));
      setSaved(draft);
      setStatus({ kind: 'saved' });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setNeedsLogin(true);
        return setStatus(undefined);
      }
      setStatus({ kind: 'error', message: error instanceof Error ? error.message : 'Não foi possível salvar.' });
    }
  };
  const leave = async () => {
    if (dirty && !confirm('Sair sem salvar as alterações?')) return;
    await logout().catch(() => undefined);
    setDraft(undefined);
    setSaved(undefined);
    setStatus(undefined);
    setNeedsLogin(true);
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
        <div className="top-links">
          <a className="view-site" href="/" target="_blank" rel="noopener">Ver site<ArrowUpRight size={15}/></a>
          {!import.meta.env.DEV && draft && !needsLogin && <button className="view-site" onClick={leave}>Sair<LogOut size={15}/></button>}
        </div>
      </div>
      <nav className="admin-shell admin-tabs" aria-label="Seções do painel">
        {tabs.map(({ id, label, icon: Icon }) => <button key={id} aria-current={tab === id ? 'page' : undefined} onClick={() => openTab(id)}><Icon size={17} aria-hidden="true"/>{label}</button>)}
      </nav>
    </header>
    <main className="admin-shell admin-main">
      {needsLogin ? <LoginForm expired={!!draft} onDone={() => { if (draft) setNeedsLogin(false); else load(); }}/>
        : loadError ? <div className="card notice"><h2>Não foi possível abrir o painel</h2><p>{loadError}</p><button className="button ghost" onClick={load}>Tentar de novo</button></div>
        : draft ? <Editor key={`${tab}-${version}`} content={draft} edit={edit}/>
        : <p className="loading"><Loader2 size={20} className="spin"/>Carregando…</p>}
    </main>
    {(dirty || status) && <div className="save-bar" role="region" aria-label="Salvar alterações">
      <div className="admin-shell save-inner">
        <p role="status" className={status?.kind === 'error' ? 'is-error' : undefined}>
          {status?.kind === 'saved' && !dirty ? <><Check size={17}/>{import.meta.env.DEV ? 'Salvo! O site já mostra as alterações.' : 'Salvo! O site mostra as alterações em cerca de 1 minuto.'}</>
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
