import { useState } from 'react';
import { ArrowDown, ArrowUpRight, Flower2, Leaf, MapPin, Menu, X } from 'lucide-react';
import { store } from './data/store';
import { Catalog } from './components/Catalog';
import { Highlights } from './components/Highlights';
import { InstagramLink } from './components/InstagramLink';
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <div className="announcement">Feito à mão, para fazer parte dos seus momentos. <Flower2 size={13} aria-hidden="true"/></div>
    <header className="site-header section-shell"><a href="#inicio" className="brand" aria-label="Jardim de Perfumes, início"><Flower2 strokeWidth={1} size={30} aria-hidden="true"/><span>Jardim <i>de</i> Perfumes<small>AROMAS & AUTOCUIDADO</small></span></a><button className="menu-toggle icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="main-nav" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}>{menuOpen ? <X/> : <Menu/>}</button><nav id="main-nav" aria-label="Navegação principal" className={menuOpen ? 'open' : ''} onClick={() => setMenuOpen(false)}><a href="#colecao">Nossa vitrine</a><a href="#novidades">Novidades & feiras</a><a href="#sobre">Nosso jardim</a><InstagramLink label="Fale com a gente" className="header-contact"/></nav></header>
    <main id="conteudo">
      <section id="inicio" className="hero section-shell"><div className="hero-copy"><p className="eyebrow"><span/> Aromas que guardam histórias</p><h1>Um aroma.<br/>Um instante.<br/><em>Uma lembrança.</em></h1><p className="hero-slogan">{store.slogan}</p><div className="hero-actions"><a href="#colecao" className="button primary">Explore nossa vitrine <ArrowUpRight size={17}/></a><a className="text-link" href="#sobre">Conheça a marca <ArrowDown size={15}/></a></div><div className="hero-caption"><Leaf size={18} strokeWidth={1.3} aria-hidden="true"/><span>Produtos artesanais · Feitos à mão</span></div></div><div className="hero-art"><div className="logo-mat"><img src={store.logo} alt="Logotipo Jardim de Perfumes com rosas e folhagens" width="1600" height="1351" fetchPriority="high"/></div><span className="art-label">um jardim de sensações</span><div className="art-seal" aria-hidden="true"><Flower2 size={28} strokeWidth={1}/><span>FEITO<br/>À MÃO</span></div></div></section>
      <div className="values-strip"><span><Flower2 size={18}/>Aromas para o seu dia</span><span><Leaf size={18}/>Produção artesanal</span><span><MapPin size={18}/>Região de Campinas · SP</span></div>
      <Highlights/>
      <Catalog/>
      <section id="sobre" className="about"><div className="section-shell about-inner"><div className="about-emblem" aria-hidden="true"><Flower2 size={112} strokeWidth={.7}/><span>Jardim<br/><em>de Perfumes</em></span></div><div><p className="eyebrow">Por trás dos aromas</p><h2>Feito à mão.<br/><em>Para estar perto.</em></h2><p>A Jardim de Perfumes reúne produtos artesanais para perfumação e autocuidado. Cada produto é feito à mão.</p><p>Você encontra nosso jardim no Instagram e nas feiras artesanais das quais participamos.</p><InstagramLink label="Conheça nosso Instagram" className="text-link"/></div></div></section>
      <section id="contato" className="contact section-shell"><p className="eyebrow">Vamos conversar?</p><h2>Encontre seu próximo<br/><em>aroma favorito.</em></h2><p>Para conhecer os produtos, consultar disponibilidade<br className="desktop-break"/> e combinar seu pedido, fale com a gente pelo Instagram.</p><InstagramLink/><div className="delivery"><MapPin size={17} aria-hidden="true"/><p>{store.delivery}</p></div></section>
    </main>
    <footer className="site-footer section-shell"><a href="#inicio" className="footer-brand">Jardim de Perfumes</a><span>Aromas, cuidado e boas lembranças.</span><a href={store.instagram} target="_blank" rel="noopener noreferrer">{store.instagramHandle}<ArrowUpRight size={14}/><span className="sr-only"> (abre em nova aba)</span></a><small>© {new Date().getFullYear()} Jardim de Perfumes</small></footer>
  </>;
}
