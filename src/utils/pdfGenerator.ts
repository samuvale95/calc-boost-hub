import { pdf } from '@react-pdf/renderer';
import React from 'react';
import QRCode from 'qrcode';
import QuizPDFDocument from '@/components/QuizPDF';
import { SCALE_VERSION, SCALE_LANGUAGE, SCALE_COPYRIGHT, SITE_URL } from '@/config/scale';
import { downloadBlob, todayStamp } from './downloadBlob';

export interface QuizData {
  user: {
    name: string;
    email: string;
    completedAt: string;
  };
  questions: any[];
  sections: any[];
}

export interface ScoreRow {
  question: string;
  response?: any;
  score: number | string;
}

export type ScoresPDF = ScoreRow[];

export interface GeneratedFile {
  blob: Blob;
  filename: string;
}

/** Renders the results PDF in memory, without downloading it. */
export const buildQuizPDF = async (
  quizData: QuizData,
  scoresPDF: ScoresPDF,
  calcResults?: { [key: string]: { z: string; p: string } }
): Promise<GeneratedFile> => {
  try {
    // QR code linking back to the official site (DAND Scale plan, point 8).
    // Generated up front, as a data URL, because react-pdf's <Image> needs
    // its src ready at render time — it can't await one itself.
    const qrCodeDataUrl = await QRCode.toDataURL(SITE_URL, { margin: 1, width: 160 });

    const blob = await pdf(
      React.createElement(QuizPDFDocument, {
        quizData,
        scoresPDF,
        calcResults,
        qrCodeDataUrl,
        scaleVersion: SCALE_VERSION,
        scaleLanguage: SCALE_LANGUAGE,
        copyright: SCALE_COPYRIGHT,
      })
    ).toBlob();

    return { blob, filename: `D-DAND-risultati-${todayStamp()}.pdf` };
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Errore durante la generazione del PDF');
  }
};

/** Renders the results PDF and downloads it. */
export const generateQuizPDF = async (
  quizData: QuizData,
  scoresPDF: ScoresPDF,
  calcResults?: { [key: string]: { z: string; p: string } }
) => {
  const { blob, filename } = await buildQuizPDF(quizData, scoresPDF, calcResults);
  downloadBlob(blob, filename);
  return true;
};
