export type Clima = 'calma' | 'frescor' | 'aconchego' | 'alegria';
export type Familia = 'floral' | 'natureza' | 'doce' | 'especiado';

// RASCUNHO a revisar com a proprietária: classificação deduzida apenas do nome de cada aroma.
// Aromas cujo nome não indica o perfume (Martan, Baboo, Bons Fluidos, Quebra-Nozes) ficam de fora até serem classificados.
export const perfilDosAromas: Record<string, { clima: Clima; familia: Familia }> = {
  lavanda: { clima: 'calma', familia: 'floral' },
  acqua: { clima: 'frescor', familia: 'natureza' },
  'cha-branco': { clima: 'calma', familia: 'natureza' },
  'cha-verde': { clima: 'frescor', familia: 'natureza' },
  'rosa-branca': { clima: 'calma', familia: 'floral' },
  'cereja-avela': { clima: 'aconchego', familia: 'doce' },
  girassol: { clima: 'alegria', familia: 'floral' },
  'capim-limao': { clima: 'frescor', familia: 'natureza' },
  'brisa-do-mar': { clima: 'frescor', familia: 'natureza' },
  'flor-de-cerejeira': { clima: 'alegria', familia: 'floral' },
  'especiaria-dourada': { clima: 'aconchego', familia: 'especiado' },
  'doce-encanto': { clima: 'alegria', familia: 'doce' },
  'vanilla-lemon': { clima: 'alegria', familia: 'doce' },
  aconchego: { clima: 'aconchego', familia: 'doce' },
  'flor-de-figo': { clima: 'aconchego', familia: 'floral' },
  pistache: { clima: 'aconchego', familia: 'doce' },
  primavera: { clima: 'alegria', familia: 'floral' },
};

export const perguntaProduto = {
  title: 'Como você gosta de perfumar a casa?',
  options: [
    { value: 'difusor', label: 'Aos poucos, ao longo do dia' },
    { value: 'home-spray', label: 'Na hora, com algumas borrifadas' },
  ],
};
export const perguntaClima: { title: string; options: { value: Clima; label: string }[] } = {
  title: 'Que clima você quer criar?',
  options: [
    { value: 'calma', label: 'Calmo, para desacelerar' },
    { value: 'frescor', label: 'Leve e fresco' },
    { value: 'aconchego', label: 'Aconchegante' },
    { value: 'alegria', label: 'Alegre e cheio de vida' },
  ],
};
export const perguntaFamilia: { title: string; options: { value: Familia; label: string }[] } = {
  title: 'O que mais chama sua atenção?',
  options: [
    { value: 'floral', label: 'Flores' },
    { value: 'natureza', label: 'Folhas, chás e brisa' },
    { value: 'doce', label: 'Notas doces' },
    { value: 'especiado', label: 'Especiarias' },
  ],
};
