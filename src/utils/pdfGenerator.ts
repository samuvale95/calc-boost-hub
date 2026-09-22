import { pdf } from '@react-pdf/renderer';
import React from 'react';
import QRCode from 'qrcode';
import QuizPDFDocument from '@/components/QuizPDF';
import { SCALE_VERSION, SCALE_LANGUAGE, SCALE_COPYRIGHT, SITE_URL } from '@/config/scale';

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

export const generateQuizPDF = async (
  quizData: QuizData,
  scoresPDF: ScoresPDF,
  calcResults?: { [key: string]: { z: string; p: string } }
) => {
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

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `D-DAND-risultati-${new Date().toISOString().split('T')[0]}.pdf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Errore durante la generazione del PDF');
  }
};
