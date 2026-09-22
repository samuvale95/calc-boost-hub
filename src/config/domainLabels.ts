// Human-readable labels for calcResults' keys (see src/utils/calc.ts),
// shared between the PDF (QuizPDF.tsx) and Excel (excelGenerator.ts)
// reports so the two never drift apart.
export const SUBDOMAIN_LABELS: { key: string; label: string }[] = [
  { key: 'sub1', label: 'Grossomotorio' },
  { key: 'sub2', label: 'Energia e sport' },
  { key: 'sub3', label: 'Finemotorio' },
  { key: 'sub4', label: 'Interazione sociale' },
  { key: 'sub5', label: 'Gioco' },
  { key: 'sub6', label: 'Comprensione linguistica' },
  { key: 'sub7', label: 'Produzione linguistica' },
  { key: 'sub8', label: 'Alimentazione' },
  { key: 'sub9', label: 'Autonomie personali' },
  { key: 'sub10', label: 'Autonomie domestiche' },
  { key: 'sub11', label: 'Autonomie sociali' },
  { key: 'sub12', label: 'Memoria e apprendimento' },
  { key: 'sub13', label: 'Regolazione emotiva' },
  { key: 'sub14', label: 'Comportamento internalizzante' },
  { key: 'sub15', label: 'Attenzione e controllo motorio' },
  { key: 'sub16', label: 'Problemi sociali e comunicativi' },
  { key: 'sub17', label: 'Comportamento esternalizzante' },
  { key: 'sub18', label: 'Ore di sonno totali' },
  { key: 'sub19', label: 'Risvegli settimanali' },
];

export const DOMAIN_LABELS: { key: string; label: string }[] = [
  { key: 'Mot', label: 'Abilità motorie' },
  { key: 'Lan', label: 'Linguaggio e interazione sociale' },
  { key: 'Aut', label: 'Autonomie' },
  { key: 'Mem', label: 'Memoria e abilità scolastiche' },
  { key: 'Emo', label: 'Regolazione comportamentale ed emotiva' },
];

export const OVERALL_LABEL = { key: 'Overall', label: 'Overall' };
