// Cada foto de produto tem uma versão leve de 640 px (`-640.webp`), usada principalmente no celular.
export const photoSrcSet = (src: string, width = 1086) => `${src.replace(/\.jpg$/, '-640.webp')} 640w, ${src} ${width}w`;
export const cardSizes = '(max-width: 900px) 50vw, 33vw';
// O valor de 320 px é proposital: mesmo em telas de alta densidade, o celular baixa a versão leve, que continua nítida.
export const fullSizes = '(max-width: 900px) 320px, 520px';
