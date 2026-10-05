import ExcelJS from 'exceljs';
import { QuizData, ScoresPDF } from './pdfGenerator';
import { SCALE_VERSION, SCALE_LANGUAGE, SCALE_COPYRIGHT, SITE_URL } from '@/config/scale';
import { SUBDOMAIN_LABELS, DOMAIN_LABELS, OVERALL_LABEL } from '@/config/domainLabels';

/** Pulls the leading "= "/"< "/"> " prefix calc.ts adds to z/p off, returning a plain number (or null if unparseable). */
function toNumber(value: string | undefined): number | null {
  if (!value) return null;
  const match = value.match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : null;
}

const HEADER_FILL: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFE5E7EB' },
};

export const generateQuizExcel = async (
  quizData: QuizData,
  scoresPDF: ScoresPDF,
  calcResults?: { [key: string]: { z: string; p: string } }
) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'DAND Scale';
  workbook.created = new Date();

  const dataRow = scoresPDF.find((s) => s.question === 'DATA');
  const patientIdRow = scoresPDF.find((s) => s.question === 'ID PAZIENTE');

  // Creo un unico foglio di lavoro
  const sheet = workbook.addWorksheet('Report DAND');

  // Intestazione metadati
  const meta: [string, string][] = [
    ['Versione DAND Scale', SCALE_VERSION],
    ['Lingua', SCALE_LANGUAGE.toUpperCase()],
    ['Data valutazione', String(dataRow?.response ?? '')],
    ['Identificativo paziente', String(patientIdRow?.response ?? '')],
    ['Operatore (Nome)', quizData.user.name],
    ['Operatore (Email)', quizData.user.email],
    ['Report generato il', new Date(quizData.user.completedAt).toLocaleString('it-IT')],
    ['Sito Ufficiale', SITE_URL || ''], 
    [SCALE_COPYRIGHT, ''],
  ];
  
  meta.forEach(([label, value]) => {
    const row = sheet.addRow([label, value]);
    row.font = { italic: true, color: { argb: 'FF6B7280' } };
  });
  sheet.addRow([]);

  // Funzione helper per aggiungere le intestazioni di sezione con sfondo grigio
  const addSectionHeader = (title: string, col2Header: string, col3Header: string) => {
    const headerRow = sheet.addRow([title, col2Header, col3Header]);
    headerRow.font = { bold: true };
    headerRow.eachCell((cell) => (cell.fill = HEADER_FILL));
  };

  // Funzione helper per inserire solo i valori numerici nei risultati
  const addResultRow = (label: string, key: string) => {
    if (!calcResults) return;
    const entry = calcResults[key];
    if (!entry) return;
    sheet.addRow([label, toNumber(entry.z), toNumber(entry.p)]);
  };

  // 1. Sezione: Punteggio per sottodomini
  addSectionHeader('Punteggio per sottodomini', 'Punteggio Z', 'Percentile');
  if (calcResults) {
    SUBDOMAIN_LABELS.forEach(({ key, label }) => addResultRow(label, key));
  }
  sheet.addRow([]);

  // 2. Sezione: Punteggio per domini
  addSectionHeader('Punteggio per domini', 'Punteggio Z', 'Percentile');
  if (calcResults) {
    DOMAIN_LABELS.forEach(({ key, label }) => addResultRow(label, key));
  }
  sheet.addRow([]);

  // 3. Sezione: Punteggio overall
  addSectionHeader('Punteggio overall', 'Punteggio Z', 'Percentile');
  if (calcResults) {
    addResultRow(OVERALL_LABEL.label, OVERALL_LABEL.key);
  }
  sheet.addRow([]);

  // 4. Sezione: Punteggio per item
  addSectionHeader('Punteggio per item', 'Risposta', 'Punteggio');
  scoresPDF
    .filter((row) => row.question !== 'DATA' && row.question !== 'ID PAZIENTE')
    .forEach((row) => {
      sheet.addRow([row.question ?? '', row.response != null ? String(row.response) : '', row.score ?? '']);
    });

  // Impostazione larghezza colonne
  sheet.columns = [{ width: 55 }, { width: 35 }, { width: 20 }];

  // Generazione del file Excel e download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `D-DAND-risultati-${new Date().toISOString().split('T')[0]}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return true;
};