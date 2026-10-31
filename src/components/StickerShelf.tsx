import type { MouseEvent, ReactNode } from 'react';

function DiffuserArt() {
  return <svg viewBox="0 0 100 130" aria-hidden="true">
    <defs><linearGradient id="st-diffuser" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f6cdb4"/><stop offset="1" stopColor="#cf8460"/></linearGradient></defs>
    <g className="st-reeds" fill="none" stroke="#c9a06c" strokeWidth="3.4" strokeLinecap="round"><path d="M46 56 34 6"/><path d="M50 56V3"/><path d="M54 56 67 7"/></g>
    <circle cx="50" cy="93" r="33" fill="url(#st-diffuser)"/>
    <g fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="3" strokeLinecap="round"><path d="M31 72c-8 22 6 40 24 46"/><path d="M46 62c-10 22 2 44 22 50"/><path d="M62 65c-6 16 0 30 14 39"/></g>
    <rect x="39" y="47" width="22" height="15" rx="3" fill="#d9a441"/><rect x="43" y="49" width="4" height="11" fill="#f6dc9a"/>
    <g fill="#fffaf2" stroke="#d8c8b4" strokeWidth=".7"><circle cx="35" cy="65" r="4"/><circle cx="42" cy="67" r="4"/><circle cx="50" cy="68" r="4"/><circle cx="58" cy="67" r="4"/><circle cx="65" cy="65" r="4"/><circle cx="45" cy="78" r="3.6"/><circle cx="45" cy="86" r="3.6"/><circle cx="55" cy="78" r="3.6"/><circle cx="55" cy="86" r="3.6"/></g>
    <circle cx="45" cy="94" r="3.2" fill="#d9a441"/><circle cx="55" cy="94" r="3.2" fill="#d9a441"/>
  </svg>;
}

function SprayArt() {
  return <svg viewBox="0 0 100 130" aria-hidden="true">
    <defs><linearGradient id="st-spray" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#f5a24b"/><stop offset=".55" stopColor="#f7b76c"/><stop offset="1" stopColor="#e2832b"/></linearGradient></defs>
    <g className="st-mist" fill="#c9dfe6"><circle cx="19" cy="13" r="3.4"/><circle cx="10" cy="22" r="2.6"/><circle cx="23" cy="25" r="2.2"/><circle cx="7" cy="9" r="2"/></g>
    <rect x="39" y="7" width="23" height="29" rx="4" fill="#e7f0f3" stroke="#bfd2d9" strokeWidth="1.2"/>
    <path d="M45 13h6l-1 6h7v8H45z" fill="#fff" stroke="#bfd2d9" strokeWidth="1"/><path d="M45 15h-8v4h8z" fill="#fff" stroke="#bfd2d9" strokeWidth="1"/>
    <rect x="35" y="33" width="31" height="15" rx="2.5" fill="#d9a441"/><rect x="40" y="35" width="5" height="11" fill="#f6dc9a"/>
    <rect x="24" y="48" width="53" height="79" rx="9" fill="url(#st-spray)"/>
    <rect x="31" y="78" width="39" height="38" rx="2" fill="#fffaf5"/>
    <g fill="none" stroke="#a2455d" strokeWidth="2" strokeLinecap="round"><path d="M37 88h27"/><path d="M41 96h19"/><path d="M45 105h11"/></g>
    <g fill="#fffaf2" stroke="#d8c8b4" strokeWidth=".7"><circle cx="35" cy="52" r="3.8"/><circle cx="43" cy="53" r="3.8"/><circle cx="51" cy="54" r="3.8"/><circle cx="59" cy="53" r="3.8"/><circle cx="66" cy="52" r="3.8"/><circle cx="46" cy="63" r="3.4"/><circle cx="56" cy="63" r="3.4"/></g>
    <circle cx="46" cy="71" r="3" fill="#d9a441"/><circle cx="56" cy="71" r="3" fill="#d9a441"/>
  </svg>;
}

function CarArt() {
  return <svg viewBox="0 0 100 130" aria-hidden="true">
    <g className="st-swing">
      <path d="M50 3c-7 0-11 5-11 10s4 9 11 9 11-4 11-9-4-10-11-10z" fill="none" stroke="#c9a06c" strokeWidth="2.6"/>
      <path d="M50 22v22" stroke="#c9a06c" strokeWidth="2.6"/>
      <circle cx="50" cy="44" r="4.4" fill="#d9a441"/>
      <path d="M21 104c-11-7-7-20 6-18-3 13 2 18-6 18zM79 104c11-7 7-20-6-18 3 13-2 18 6 18z" fill="#6f8f66"/>
      <g fill="#d96f88"><circle cx="50" cy="66" r="17"/><circle cx="29" cy="82" r="17"/><circle cx="71" cy="82" r="17"/><circle cx="37" cy="105" r="17"/><circle cx="63" cy="105" r="17"/></g>
      <circle cx="50" cy="87" r="24" fill="#c9506d"/>
      <circle cx="50" cy="87" r="16" fill="#e8879c"/>
      <path d="M50 75c8 0 12 6 11 12-1 7-8 10-13 7-5-2-6-9-2-12 3-2 8 0 8 4 0 3-3 5-5 4" fill="none" stroke="#a2455d" strokeWidth="2.6" strokeLinecap="round"/>
    </g>
  </svg>;
}

function FootBathArt() {
  return <svg viewBox="0 0 100 130" aria-hidden="true">
    <defs><linearGradient id="st-bath" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#f4c9cf"/><stop offset="1" stopColor="#d98e9c"/></linearGradient></defs>
    <g className="st-bubbles" fill="#fff" stroke="#9fc8d2" strokeWidth="1.2"><circle cx="27" cy="39" r="6"/><circle cx="48" cy="24" r="7.5"/><circle cx="70" cy="37" r="5"/><circle cx="60" cy="10" r="4"/></g>
    <path d="M5 58h90l-8 56c-1 8-7 13-15 13H28c-8 0-14-5-15-13z" fill="url(#st-bath)"/>
    <rect x="1" y="52" width="98" height="14" rx="7" fill="#c9778a"/>
    <ellipse cx="50" cy="58" rx="43" ry="7" fill="#a9dbe0"/>
    <path d="M30 57c3-5 10-5 13 0-4 3-9 3-13 0zM58 59c3-4 9-4 12 0-4 3-8 3-12 0z" fill="#e8879c"/>
    <circle cx="50" cy="56" r="2.4" fill="#fffaf2"/><circle cx="21" cy="59" r="2" fill="#fffaf2"/><circle cx="79" cy="57" r="2" fill="#fffaf2"/>
    <g fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="2.6" strokeLinecap="round"><path d="M27 82c10 7 36 7 46 0"/><path d="M34 98c8 4 24 4 32 0"/></g>
  </svg>;
}

const stickers: { categoryId: string; label: string; short?: string; alt: string; art: ReactNode }[] = [
  { categoryId: 'difusores', label: 'Difusor', alt: 'difusores', art: <DiffuserArt/> },
  { categoryId: 'home-spray', label: 'Home spray', alt: 'home spray', art: <SprayArt/> },
  { categoryId: 'aromatizadores-carro', label: 'Aromatizador', short: 'Carro', alt: 'aromatizadores de carro', art: <CarArt/> },
  { categoryId: 'escalda-pes-sal', label: 'Escalda-pés', alt: 'escalda-pés', art: <FootBathArt/> },
];

export function StickerShelf({ onSelect }: { onSelect: (categoryId: string, event: MouseEvent<HTMLAnchorElement>) => void }) {
  return <nav className="sticker-shelf" aria-label="Atalhos para a vitrine">
    {stickers.map((sticker, index) => <a key={sticker.categoryId} className="sticker" href="#colecao" aria-label={`Ver ${sticker.alt} na vitrine`} onClick={event => onSelect(sticker.categoryId, event)} style={{ '--i': index } as React.CSSProperties}>
      <span className="sticker-art"><span className="sticker-bob">{sticker.art}</span></span>
      <span className="sticker-label" aria-hidden="true"><span className="label-full">{sticker.label}</span><span className="label-short">{sticker.short ?? sticker.label}</span></span>
    </a>)}
  </nav>;
}
