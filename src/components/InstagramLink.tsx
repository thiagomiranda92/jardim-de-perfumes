import { ArrowUpRight, Instagram } from 'lucide-react';
import { store } from '../data/store';
export function InstagramLink({ label = 'Conversar no Instagram', className = 'button primary' }: { label?: string; className?: string }) {
  return <a className={className} href={store.instagram} target="_blank" rel="noopener noreferrer"><Instagram size={17} aria-hidden="true" />{label}<ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (abre em nova aba)</span></a>;
}
