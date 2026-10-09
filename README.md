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

## Adicionar fotografias e produtos

1. Salve as fotografias reais em `public/images/products/`, com nomes descritivos. Prefira WebP, proporções consistentes e imagens de até aproximadamente 1600 pixels. Preserve a embalagem e evite cortes.
2. Em `src/data/catalog.ts`, acrescente um item à lista `products`, usando o `categoryId` de uma das categorias existentes.
3. Preencha `id`, `name`, `categoryId` e `images`. Cada imagem usa `src` (caminho iniciado em `/images/products/`) e `alt` (descrição objetiva da foto).
4. Adicione `price` como número em reais apenas quando confirmado. A página formata o valor automaticamente. Descrição, fragrância, tamanho e disponibilidade são opcionais.
5. O card neutro de uma categoria é substituído pelos produtos cadastrados nessa categoria. A primeira fotografia é exibida; o modelo de dados permite guardar várias fotos para uma galeria futura.
6. Execute `pnpm build` e revise a página antes de salvar um commit.

## Promoções e feiras

Cadastre apenas informações confirmadas na lista `highlights`, em `src/data/catalog.ts`: identificador, tipo (`Promoção` ou `Feira`), título, texto e, quando aplicável, data e local. O carrossel usa essa lista. Enquanto estiver vazia, ele apresenta avisos transparentes de que os detalhes serão publicados posteriormente. Não há rotação automática.

## Revisão da base

- Build de produção e verificação TypeScript concluídos.
- Nove categorias e filtros de autocuidado (4) e carro (1) verificados.
- Carrossel nas duas direções e abertura/fechamento do menu mobile verificados.
- Logo carregada, links configurados para o perfil informado e sem erros JavaScript.
- Sem rolagem horizontal em 320, 390, 768, 1024 e 1440 pixels.
- Capturas de desktop e celular revisadas visualmente.

A aparência foi aprovada como direção de design pelo usuário; os textos novos da apresentação devem ser revisados na próxima rodada. SEO inicial inclui título, descrição e idioma. Canonical, imagem social e informações comerciais completas devem ser configurados quando houver domínio e conteúdo definitivo.
