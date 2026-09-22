#!/usr/bin/env node
// Generates an Excel file to hand to a translator (DAND Scale plan,
// point 9/10: adding a language should cost the studio ~zero — this is
// the "give them something to fill in, drop the result back in" half of
// that workflow; see i18n-import.mjs for the other half).
//
// Usage:
//   node scripts/i18n-export.mjs <language-code> [--out file.xlsx]
//
// Examples:
//   node scripts/i18n-export.mjs es                  # new language
//   node scripts/i18n-export.mjs fr                  # re-export an
//     existing one to update/proofread — column D is pre-filled with
//     the current translation instead of empty
import ExcelJS from 'exceljs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const args = process.argv.slice(2);
const targetLang = args[0];
if (!targetLang || targetLang.startsWith('--')) {
  console.error('Uso: node scripts/i18n-export.mjs <codice-lingua> [--out file.xlsx]');
  console.error('Esempio: node scripts/i18n-export.mjs es');
  process.exit(1);
}

const outIdx = args.indexOf('--out');
const outFile = outIdx !== -1 ? args[outIdx + 1] : `translations-${targetLang}.xlsx`;

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

function flatten(obj, prefix = '') {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k === '_meta') continue;
    const full = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object') Object.assign(out, flatten(v, full));
    else out[full] = String(v);
  }
  return out;
}

function placeholderNote(text) {
  const notes = [];
  const vars = [...new Set([...text.matchAll(/\{\{\w+\}\}/g)].map((m) => m[0]))];
  const tags = [...new Set([...text.matchAll(/<\/?\w+>/g)].map((m) => m[0]))];
  if (vars.length) notes.push(`NON toccare: ${vars.join(', ')}`);
  if (tags.length) notes.push(`Mantenere i tag: ${tags.join(', ')}`);
  return notes.join('  |  ');
}

const it = readJson(path.join(root, 'src/locales/it/common.json'));
const en = readJson(path.join(root, 'src/locales/en/common.json'));
const targetPath = path.join(root, `src/locales/${targetLang}/common.json`);
const existing = fs.existsSync(targetPath) ? readJson(targetPath) : {};

const itFlat = flatten(it);
const enFlat = flatten(en);
const existingFlat = flatten(existing);

const workbook = new ExcelJS.Workbook();

const info = workbook.addWorksheet('Istruzioni');
info.columns = [{ width: 100 }];
const KNOWN_NATIVE_NAMES = {
  es: 'Español', de: 'Deutsch', nl: 'Nederlands', hr: 'Hrvatski',
  pt: 'Português', ca: 'Català', el: 'Ελληνικά', pl: 'Polski',
  ro: 'Română', sv: 'Svenska', da: 'Dansk', tr: 'Türkçe',
};
const guessedNativeName = KNOWN_NATIVE_NAMES[targetLang] ?? '';

[
  'DAND Scale — traduzione interfaccia sito',
  '',
  `Lingua di destinazione: ${targetLang}`,
  `Nome lingua (nativo): ${guessedNativeName}`,
  '  ^ se vuoto o sbagliato, scrivi qui il nome della lingua come va',
  '    mostrato nel selettore del sito (es. "Español", "Deutsch").',
  '',
  'Come compilare:',
  '1. Vai al foglio "Traduzioni".',
  '2. Scrivi la traduzione nella colonna D ("Traduzione"), riga per riga.',
  '3. Colonne A, B, C: NON modificarle (servono a chi reimporta il file).',
  '4. Colonna E ("Note"): se presente, indica testo tecnico da NON tradurre',
  '   (es. {{count}}, {{email}}) o tag da mantenere (es. <strong>...</strong>).',
  '   Quel testo va lasciato identico, solo le parole attorno vanno tradotte.',
  '5. Non lasciare righe vuote in colonna D: ogni riga IT deve avere una',
  '   traduzione.',
  '6. Non tradurre nomi propri: "D-DAND", "DAND Scale", "Fondazione Dravet ETS".',
  '',
  'Nota: questa e\' solo l\'interfaccia del sito (bottoni, menu, testi di',
  'navigazione). Le domande del questionario clinico NON sono in questo',
  'file: quelle richiedono un processo di validazione separato con la',
  'Fondazione (adattamento linguistico-culturale, back-translation).',
].forEach((line) => info.addRow([line]));
info.getRow(1).font = { bold: true, size: 14 };
info.getRow(8).font = { bold: true };

const sheet = workbook.addWorksheet('Traduzioni');
sheet.columns = [
  { header: 'Chiave (non modificare)', key: 'key', width: 38 },
  { header: 'Italiano (originale)', key: 'it', width: 55 },
  { header: 'Inglese (riferimento)', key: 'en', width: 55 },
  { header: 'Traduzione', key: 'target', width: 55 },
  { header: 'Note', key: 'note', width: 40 },
];
const headerRow = sheet.getRow(1);
headerRow.font = { bold: true };
headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE5E7EB' } };
sheet.views = [{ state: 'frozen', ySplit: 1 }];
sheet.autoFilter = { from: 'A1', to: 'E1' };

for (const key of Object.keys(itFlat)) {
  sheet.addRow({
    key,
    it: itFlat[key],
    en: enFlat[key] ?? '',
    target: existingFlat[key] ?? '',
    note: placeholderNote(itFlat[key]),
  });
}
sheet.getColumn('key').font = { color: { argb: 'FF9CA3AF' } };
sheet.getColumn('target').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF9DB' } };

await workbook.xlsx.writeFile(path.join(root, outFile));
console.log(`Creato ${outFile} — ${Object.keys(itFlat).length} righe.`);
console.log(existingFlat && Object.keys(existingFlat).length
  ? 'Colonna "Traduzione" pre-riempita con le traduzioni esistenti (utile per un aggiornamento/proofreading).'
  : 'Manda il file a chi traduce: deve scrivere solo nella colonna "Traduzione" (evidenziata in giallo).');
