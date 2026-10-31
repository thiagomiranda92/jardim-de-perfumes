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

Difusor e Home spray já possuem os 21 aromas informados pelo usuário, incluindo Chá verde. Bons Fluidos, Chá verde, Flor de Cerejeira, Martan, Quebra-Nozes, Girassol e Flor de Figo têm imagens individuais para difusor e home spray, derivadas das fotografias reais enviadas e otimizadas em JPEG. No caso de Girassol, o frasco largo da esquerda foi associado provisoriamente ao difusor; o rótulo da própria foto ainda precisa ser confirmado com a proprietária. A grafia “Baboo” foi preservada como recebida e também precisa ser confirmada. As demais fotos, volumes e preços continuam pendentes.

## Adicionar fotografias e produtos

1. Salve as fotografias reais em `public/images/products/`, com nomes descritivos. Prefira WebP, proporções consistentes e imagens de até aproximadamente 1600 pixels. Preserve a embalagem e evite cortes.
2. Em `src/data/catalog.ts`, acrescente um item à lista `products`, usando o `categoryId` de uma das categorias existentes.
3. Preencha `id`, `name`, `categoryId` e `images`. Cada imagem usa `src` (caminho iniciado em `/images/products/`) e `alt` (descrição objetiva da foto).
4. Adicione `price` como número em reais apenas quando confirmado. A página formata o valor automaticamente. Descrição, fragrância, tamanho e disponibilidade são opcionais.
5. O aviso de fotos em breve de uma categoria na vitrine é substituído pelos produtos cadastrados nessa categoria. Ao clicar, uma janela de detalhes mostra as fotos, com miniaturas para alternar entre elas.
6. Execute `pnpm build` e revise a página antes de salvar um commit.

## Vitrine

A vitrine reúne as nove categorias em botões, um ao lado do outro. Cada categoria mostra seus produtos em cards com fotografia; difusor e home spray mostram um card por aroma com foto, e os demais aromas aparecem listados abaixo. Para incluir a foto de um aroma, cadastre as duas imagens em `fotosDosAromas`; `ordemDeDestaque`, em `src/data/catalog.ts`, define a ordem dos cards. Categorias sem produto cadastrado exibem um aviso de que as fotos serão adicionadas em breve.

As figurinhas sobre a faixa de aromas são ilustrações em `src/components/StickerShelf.tsx` e levam direto à categoria correspondente na vitrine; a lista `stickers` define o destino de cada uma. O desenho do aromatizador de carro e do escalda-pés é ilustrativo e deve ser revisado pela proprietária.

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

## Busca e aromas

A busca combina nome, categoria, descrição e aromas cadastrados; ignora acentos e maiúsculas e percorre a vitrine inteira, mostrando um card para cada resultado. Os cards abrem detalhes sem sair da vitrine. A janela pode ser fechada pelo botão, pela tecla Escape ou clicando fora dela.

Para cada produto, a lista opcional `aromas` contém `id`, `name` e `images`, além de descrição, preço e disponibilidade opcionais. Ao selecionar um aroma, a foto principal muda para a primeira imagem dele, as miniaturas são atualizadas e o preço específico aparece, se informado. Na ausência de fotos do aroma, usam-se as fotografias gerais do produto. Nenhum aroma foi cadastrado sem confirmação.
