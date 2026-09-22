import ExcelJS from 'exceljs';
import { QuizData, ScoresPDF } from './pdfGenerator';
import { SCALE_VERSION, SCALE_LANGUAGE, SCALE_COPYRIGHT } from '@/config/scale';
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

  const writeMetaHeader = (sheet: ExcelJS.Worksheet) => {
    const meta: [string, string][] = [
      ['Versione DAND Scale', SCALE_VERSION],
      ['Lingua', SCALE_LANGUAGE.toUpperCase()],
      ['Data valutazione', String(dataRow?.response ?? '')],
      ['Identificativo paziente', String(patientIdRow?.response ?? '')],
      ['Report generato il', new Date(quizData.user.completedAt).toLocaleString('it-IT')],
      [SCALE_COPYRIGHT, ''],
    ];
    meta.forEach(([label, value]) => {
      const row = sheet.addRow([label, value]);
      row.font = { italic: true, color: { argb: 'FF6B7280' } };
    });
    sheet.addRow([]);
  };

  // --- Sheet "Risposte" ---
  const answersSheet = workbook.addWorksheet('Risposte');
  writeMetaHeader(answersSheet);

  const answersHeaderRow = answersSheet.addRow(['Domanda', 'Risposta', 'Punteggio']);
  answersHeaderRow.font = { bold: true };
  answersHeaderRow.eachCell((cell) => (cell.fill = HEADER_FILL));

  // The first two rows (DATA, ID PAZIENTE) are already in the meta header above.
  scoresPDF
    .filter((row) => row.question !== 'DATA' && row.question !== 'ID PAZIENTE')
    .forEach((row) => {
      answersSheet.addRow([row.question ?? '', row.response != null ? String(row.response) : '', row.score ?? '']);
    });

  answersSheet.columns = [{ width: 55 }, { width: 35 }, { width: 12 }];

  // --- Sheet "Risultati" ---
  const resultsSheet = workbook.addWorksheet('Risultati');
  writeMetaHeader(resultsSheet);

  const resultsHeaderRow = resultsSheet.addRow([
    'Dominio / Sottodominio',
    'Z (testo)',
    'Z (numero)',
    'Percentile (testo)',
    'Percentile (numero)',
  ]);
  resultsHeaderRow.font = { bold: true };
  resultsHeaderRow.eachCell((cell) => (cell.fill = HEADER_FILL));

  if (calcResults) {
    const addResultRow = (label: string, key: string) => {
      const entry = calcResults[key];
      if (!entry) return;
      resultsSheet.addRow([label, entry.z, toNumber(entry.z), entry.p, toNumber(entry.p)]);
    };

    addResultRow(OVERALL_LABEL.label, OVERALL_LABEL.key);
    DOMAIN_LABELS.forEach(({ key, label }) => addResultRow(label, key));
    SUBDOMAIN_LABELS.forEach(({ key, label }) => addResultRow(label, key));
  }

  resultsSheet.columns = [{ width: 40 }, { width: 14 }, { width: 14 }, { width: 16 }, { width: 16 }];

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
