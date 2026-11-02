import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// No GitHub Pages o site fica em /jardim-de-perfumes/. Com domínio próprio, troque o valor por '/'.
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/jardim-de-perfumes/' : '/',
  plugins: [react(), tailwindcss()],
}));
