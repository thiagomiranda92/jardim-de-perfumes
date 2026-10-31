import { useEffect, useState, type MouseEvent } from 'react';
import { ArrowDown, ArrowUpRight, Flower2, Leaf, MapPin, Menu, X } from 'lucide-react';
import { store } from './data/store';
import { aromaNames } from './data/catalog';
import { useReveal } from './hooks/useReveal';
import { Catalog } from './components/Catalog';
import { Highlights } from './components/Highlights';
import { InstagramLink } from './components/InstagramLink';
import { ProductDetails, type Selection } from './components/ProductDetails';

const navigation = [
  { href: '#colecao', label: 'Nossa vitrine' },
  { href: '#novidades', label: 'Novidades & feiras' },
  { href: '#sobre', label: 'Nosso jardim' },
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selection, setSelection] = useState<Selection>();
  useReveal();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const targetId = event.currentTarget.getAttribute('href');
    if (!targetId?.startsWith('#')) return;
    event.preventDefault();
    setMenuOpen(false);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.querySelector(targetId)?.scrollIntoView();
      window.history.replaceState(null, '', targetId);
    }));
  };
  return <>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <div className={`header-layer${scrolled || menuOpen ? ' is-solid' : ''}`}>
      <header className="site-header shell">
        <a href="#inicio" className="brand" aria-label="Jardim de Perfumes, início" onClick={handleNavClick}>
          <img src={store.logo} alt="" width="54" height="46"/>
          <span>Jardim <i>de</i> Perfumes</span>
        </a>
        <button className="menu-toggle icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="main-nav" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}>{menuOpen ? <X size={20}/> : <Menu size={20}/>}</button>
        <nav id="main-nav" aria-label="Navegação principal" className={menuOpen ? 'open' : ''}>
          {navigation.map(item => <a key={item.href} href={item.href} onClick={handleNavClick}>{item.label}</a>)}
          <InstagramLink label="Fale com a gente" className="header-contact"/>
        </nav>
      </header>
    </div>
    <main id="conteudo">
      <section id="inicio" className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow hero-line" style={{ '--d': '0ms' } as React.CSSProperties}>Aromas que guardam histórias</p>
          <h1>
            <span className="hero-line" style={{ '--d': '80ms' } as React.CSSProperties}>Um aroma.</span>
            <span className="hero-line" style={{ '--d': '180ms' } as React.CSSProperties}>Um instante.</span>
            <em className="hero-line" style={{ '--d': '280ms' } as React.CSSProperties}>Uma lembrança.</em>
          </h1>
          <p className="hero-slogan hero-line" style={{ '--d': '400ms' } as React.CSSProperties}>{store.slogan}</p>
          <div className="hero-actions hero-line" style={{ '--d': '500ms' } as React.CSSProperties}>
            <a href="#colecao" className="button primary" onClick={handleNavClick}>Explore nossa vitrine <ArrowUpRight size={17} aria-hidden="true"/></a>
            <a className="text-link" href="#sobre" onClick={handleNavClick}>Conheça a marca <ArrowDown size={15} aria-hidden="true"/></a>
          </div>
        </div>
        <div className="hero-visual">
          <figure className="hero-photo"><img src="/images/products/bons-fluidos-difusor.jpg" alt="Difusor Bons Fluidos em frasco rosé decorado com pérolas, sobre uma mesa de madeira diante de samambaias." width="1086" height="1448" fetchPriority="high"/></figure>
          <figure className="hero-photo-small"><img src="/images/products/flor-de-figo-difusor.jpg" alt="Difusor Flor de Figo em frasco bordô decorado com pérolas, sobre bandeja rosé." width="1254" height="1254"/></figure>
          <svg className="hero-seal" viewBox="0 0 120 120" aria-hidden="true">
            <defs><path id="seal-path" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0"/></defs>
            <text><textPath href="#seal-path">feito à mão · produção artesanal · </textPath></text>
          </svg>
        </div>
      </section>
      <div className="marquee" aria-label={`Aromas: ${aromaNames.join(', ')}`} role="img">
        <div className="marquee-track" aria-hidden="true">
          {[0, 1].map(copy => <div className="marquee-group" key={copy}>{aromaNames.map(name => <span key={name}>{name}<Flower2 size={15} strokeWidth={1.4}/></span>)}</div>)}
        </div>
      </div>
      <Catalog onOpen={setSelection}/>
      <section className="manifesto">
        <div className="shell manifesto-inner">
          <div>
            <p className="eyebrow" data-reveal>Por que aromas</p>
            <blockquote data-reveal>{store.slogan}</blockquote>
          </div>
          <ul className="values" data-reveal>
            <li><Flower2 size={22} strokeWidth={1.3} aria-hidden="true"/>Aromas para o seu dia</li>
            <li><Leaf size={22} strokeWidth={1.3} aria-hidden="true"/>Produção artesanal</li>
            <li><MapPin size={22} strokeWidth={1.3} aria-hidden="true"/>Região de Campinas · SP</li>
          </ul>
        </div>
      </section>
      <Highlights/>
      <section id="sobre" className="about shell">
        <div className="about-photo" data-reveal><img src="/images/products/flor-de-cerejeira-home-spray.jpg" alt="Home spray Flor de Cerejeira em frasco rosado decorado com cristais." loading="lazy" width="1086" height="1448"/></div>
        <div className="about-copy">
          <img className="about-logo" src={store.logo} alt="Logotipo Jardim de Perfumes com rosas e folhagens" loading="lazy" width="1600" height="1351" data-reveal/>
          <p className="eyebrow" data-reveal>Por trás dos aromas</p>
          <h2 data-reveal>Feito à mão.<br/><em>Para estar perto.</em></h2>
          <div data-reveal>
            <p>A Jardim de Perfumes reúne produtos artesanais para perfumação e autocuidado. Cada produto é feito à mão.</p>
            <p>Você encontra nosso jardim no Instagram e nas feiras artesanais das quais participamos.</p>
            <InstagramLink label="Conheça nosso Instagram" className="text-link"/>
          </div>
        </div>
      </section>
      <section id="contato" className="contact">
        <img src="/images/products/martan-difusor.jpg" alt="" loading="lazy" width="1086" height="1448"/>
        <div className="contact-inner shell">
          <p className="eyebrow" data-reveal>Vamos conversar?</p>
          <h2 data-reveal>Encontre seu próximo <em>aroma favorito.</em></h2>
          <p data-reveal>Para conhecer os produtos, consultar disponibilidade e combinar seu pedido, fale com a gente pelo Instagram.</p>
          <div data-reveal><InstagramLink className="button light"/></div>
          <p className="delivery" data-reveal><MapPin size={17} aria-hidden="true"/>{store.delivery}</p>
        </div>
      </section>
    </main>
    <footer className="site-footer">
      <div className="shell">
        <a href="#inicio" className="footer-brand" onClick={handleNavClick}>Jardim <i>de</i> Perfumes</a>
        <div className="footer-meta">
          <span>Aromas, cuidado e boas lembranças.</span>
          <a href={store.instagram} target="_blank" rel="noopener noreferrer">{store.instagramHandle}<ArrowUpRight size={14} aria-hidden="true"/><span className="sr-only"> (abre em nova aba)</span></a>
          <small>© {new Date().getFullYear()} Jardim de Perfumes</small>
        </div>
      </div>
    </footer>
    {selection && <ProductDetails selection={selection} onClose={() => setSelection(undefined)}/>}
  </>;
}
