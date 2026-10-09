# Jardim de Perfumes

Base local de uma vitrine comercial da Jardim de Perfumes. Design aprovado: rosa claro, creme e rosa antigo; produção artesanal, contato pelo Instagram e atendimento na região de Campinas. Sem checkout, WhatsApp, backend ou publicação automática.

## Executar

Requer Node.js 22.12+ e pnpm (ou npm).

```sh
pnpm install
pnpm dev
```

## Verificar e preparar para publicação

```sh
pnpm build
pnpm preview
```

O build executa a verificação de TypeScript e gera `dist/`. Vercel futuramente: framework Vite, comando `pnpm build`, saída `dist`. Publicar somente após autorização.

## Conteúdo

- `src/data/catalog.ts`: categorias, futuros produtos, promoções e feiras.
- `src/data/store.ts`: contatos e textos confirmados da marca.
- `src/components/`: elementos reutilizáveis.
- `src/styles/`: identidade visual e comportamento responsivo.
- `public/images/`: logo original e futuras fotos reais.

As nove categorias são reais, mas não representam produtos individuais cadastrados. Não há preços, aromas, medidas, depoimentos ou eventos fictícios. O ano de fundação não foi confirmado e não aparece. Textos comerciais adicionais deverão ser revisados pela proprietária.

## Etapas

1. Estrutura e documentação.
2. Identidade visual e catálogo editável.
3. Interações, verificação e prévia local.

O cadastro definitivo de produtos será feito posteriormente com imagens, dados reais e confirmação de conclusão do usuário.
