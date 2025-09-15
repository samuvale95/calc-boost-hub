import { pdf } from '@react-pdf/renderer';
import React from 'react';
import QuizPDFDocument from '@/components/QuizPDF';

export interface QuizData {
  user: {
    name: string;
    email: string;
    completedAt: string;
  };
  questions: any[];
  sections: any[];
}

export interface ScoresPDF {
  question: string;
  response?: string;
  score: number | string;
}[];

export const generateQuizPDF = async (quizData: QuizData, scoresPDF: ScoresPDF, calcResults?: { [key: string]: number }) => {
  try {
    // Generate PDF blob
    const blob = await pdf(React.createElement(QuizPDFDocument, { quizData, scoresPDF, calcResults })).toBlob(); // crea il pdf
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quiz-risultati-${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Errore durante la generazione del PDF');
  }
};
