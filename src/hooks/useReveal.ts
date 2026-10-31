import { useEffect } from 'react';

// Revela os elementos marcados com data-reveal ao entrarem na tela.
// Sem suporte ou com movimento reduzido, tudo permanece visível desde o início.
export function useReveal() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) return;
    const root = document.documentElement;
    root.classList.add('can-reveal');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    document.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
    return () => {
      observer.disconnect();
      root.classList.remove('can-reveal');
    };
  }, []);
}
