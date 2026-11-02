import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { painelLocal } from './scripts/painel-local';

// No GitHub Pages o site fica em /jardim-de-perfumes/. No Vercel (que define VERCEL=1 no build) fica na raiz
// e inclui o painel /adm, que depende das funções em api/ e por isso não vai para o GitHub Pages.
const vercel = !!process.env.VERCEL;
export default defineConfig(({ command, isPreview }) => ({
  base: !vercel && (command === 'build' || isPreview) ? '/jardim-de-perfumes/' : '/',
  plugins: [react(), tailwindcss(), painelLocal()],
  build: { rollupOptions: { input: vercel ? { site: 'index.html', adm: 'adm/index.html' } : 'index.html' } },
}));
