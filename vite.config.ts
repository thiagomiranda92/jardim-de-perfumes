import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
declare const process: { env: Record<string, string | undefined> };

// No GitHub Pages o site fica em /jardim-de-perfumes/. No Vercel (que define VERCEL=1 no build) fica na raiz.
export default defineConfig(({ command, isPreview }) => ({
  base: !process.env.VERCEL && (command === 'build' || isPreview) ? '/jardim-de-perfumes/' : '/',
  plugins: [react(), tailwindcss()],
}));
