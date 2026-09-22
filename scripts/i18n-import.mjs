#!/usr/bin/env node
// Turns a filled-in translation Excel (see i18n-export.mjs) back into
// src/locales/<lang>/common.json. Validates before writing anything:
// - every key from the Italian source is present and non-empty
// - no stray keys that no longer exist in the source
// - {{placeholder}} and <tag> markers are preserved exactly (a missing
//   or renamed one would silently break an interpolation or a Trans
//   component at runtime — see UsageCounter.tsx / CompleteProfileForm.tsx)
// On success, also adds/refreshes the language in SUPPORTED_LANGUAGES —
// nothing to do there either, it's auto-discovered (see languages.ts).
//
// Usage:
//   node scripts/i18n-import.mjs <language-code> <file.xlsx>
//
// Example:
//   node scripts/i18n-import.mjs es translations-es.xlsx
import ExcelJS from 'exceljs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const [targetLang, xlsxFile] = process.argv.slice(2);
if (!targetLang || !xlsxFile) {
  console.error('Uso: node scripts/i18n-import.mjs <codice-lingua> <file.xlsx>');
  process.exit(1);
}
if (!/^[a-z]{2,3}(-[A-Z]{2})?$/.test(targetLang)) {
  console.error(`Codice lingua "${targetLang}" sospetto (atteso tipo "es", "pt-BR"). Procedo comunque.`);
}
if (!fs.existsSync(xlsxFile)) {
  console.error(`File non trovato: ${xlsxFile}`);
  process.exit(1);
}

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

function unflatten(flat) {
  const out = {};
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split('.');
    let node = out;
    for (let i = 0; i < parts.length - 1; i++) {
      node[parts[i]] ??= {};
      node = node[parts[i]];
    }
    node[parts.at(-1)] = value;
  }
  return out;
}

function markers(text) {
  const vars = [...text.matchAll(/\{\{\w+\}\}/g)].map((m) => m[0]).sort();
  const tags = [...text.matchAll(/<\/?\w+>/g)].map((m) => m[0]).sort();
  return { vars, tags };
}

const it = readJson(path.join(root, 'src/locales/it/common.json'));
const itFlat = flatten(it);
const expectedKeys = new Set(Object.keys(itFlat));

const workbook = new ExcelJS.Workbook();
await workbook.xlsx.readFile(xlsxFile);
const sheet = workbook.getWorksheet('Traduzioni') ?? workbook.worksheets[workbook.worksheets.length - 1];
if (!sheet) {
  console.error('Nessun foglio "Traduzioni" trovato nel file.');
  process.exit(1);
}

const translated = {};
const seenKeys = new Set();
const errors = [];

sheet.eachRow((row, rowNumber) => {
  if (rowNumber === 1) return; // header
  const key = String(row.getCell(1).text ?? '').trim();
  const targetText = String(row.getCell(4).text ?? '').trim();
  if (!key) return;

  seenKeys.add(key);

  if (!expectedKeys.has(key)) {
    errors.push(`Riga ${rowNumber}: chiave "${key}" non esiste (piu') nel file sorgente IT — ignorata.`);
    return;
  }
  if (!targetText) {
    errors.push(`Riga ${rowNumber}: traduzione mancante per "${key}".`);
    return;
  }

  const src = markers(itFlat[key]);
  const dst = markers(targetText);
  if (JSON.stringify(src.vars) !== JSON.stringify(dst.vars)) {
    errors.push(
      `Riga ${rowNumber} ("${key}"): placeholder non corrispondenti. ` +
        `Originale: [${src.vars.join(', ')}] — Tradotto: [${dst.vars.join(', ')}]`
    );
  }
  if (JSON.stringify(src.tags) !== JSON.stringify(dst.tags)) {
    errors.push(
      `Riga ${rowNumber} ("${key}"): tag HTML non corrispondenti. ` +
        `Originale: [${src.tags.join(', ')}] — Tradotto: [${dst.tags.join(', ')}]`
    );
  }

  translated[key] = targetText;
});

const missingKeys = [...expectedKeys].filter((k) => !seenKeys.has(k));
if (missingKeys.length) {
  errors.push(
    `${missingKeys.length} chiavi assenti dal file Excel (mai viste, nessuna riga): ` +
      missingKeys.slice(0, 15).join(', ') +
      (missingKeys.length > 15 ? ', ...' : '')
  );
}

if (errors.length) {
  console.error(`\n${errors.length} problema/i trovato/i — NESSUN file scritto:\n`);
  errors.forEach((e) => console.error('  - ' + e));
  console.error('\nCorreggi il file Excel e riprova.');
  process.exit(1);
}

// The language's own display name, shown in the language switcher —
// read from the "Istruzioni" sheet's "Nome lingua (nativo): ..." line
// (see i18n-export.mjs), else a small built-in fallback map, else the
// bare code.
const KNOWN_NATIVE_NAMES = {
  es: 'Español', de: 'Deutsch', nl: 'Nederlands', hr: 'Hrvatski',
  pt: 'Português', ca: 'Català', el: 'Ελληνικά', pl: 'Polski',
  ro: 'Română', sv: 'Svenska', da: 'Dansk', tr: 'Türkçe',
};

let nativeLabel = KNOWN_NATIVE_NAMES[targetLang] ?? targetLang.toUpperCase();
const label = targetLang.toUpperCase();
const infoSheet = workbook.getWorksheet('Istruzioni');
if (infoSheet) {
  infoSheet.eachRow((row) => {
    const text = String(row.getCell(1).text ?? '');
    const match = text.match(/Nome lingua \(nativo\):\s*(.+)/i);
    if (match && match[1].trim()) nativeLabel = match[1].trim();
  });
}

const nested = { _meta: { label, nativeLabel }, ...unflatten(translated) };
const outPath = path.join(root, `src/locales/${targetLang}/common.json`);
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(nested, null, 2) + '\n');

console.log(`OK — creato ${path.relative(root, outPath)} (${Object.keys(translated).length} chiavi).`);
console.log(`Nome lingua nello switcher: "${nativeLabel}" (per cambiarlo, modifica "_meta.nativeLabel" nel file appena creato).`);
console.log('Nessun\'altra modifica al codice serve: la lingua e\' gia\' attiva. Fai build/commit/push e rilascia.');
