import { Image } from 'lucide-react';
export function PhotoPlaceholder({ variant = 0 }: { variant?: number }) {
  return <span className={`photo-placeholder tone-${variant % 3}`}><span className="photo-frame"><Image size={26} strokeWidth={1} aria-hidden="true" /></span><span>Foto em breve</span></span>;
}
