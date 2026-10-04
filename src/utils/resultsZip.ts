import JSZip from 'jszip';
import { QuizData, ScoresPDF, buildQuizPDF } from './pdfGenerator';
import { buildQuizExcel } from './excelGenerator';
import { downloadBlob, todayStamp } from './downloadBlob';

/** Builds the results PDF and Excel and downloads them together as one .zip. */
export const generateResultsZip = async (
  quizData: QuizData,
  scoresPDF: ScoresPDF,
  calcResults?: { [key: string]: { z: string; p: string } }
) => {
  const [pdfFile, excelFile] = await Promise.all([
    buildQuizPDF(quizData, scoresPDF, calcResults),
    buildQuizExcel(quizData, scoresPDF, calcResults),
  ]);

  const zip = new JSZip();
  zip.file(pdfFile.filename, pdfFile.blob);
  zip.file(excelFile.filename, excelFile.blob);
  const blob = await zip.generateAsync({ type: 'blob' });

  downloadBlob(blob, `D-DAND-risultati-${todayStamp()}.zip`);
  return true;
};
