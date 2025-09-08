import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts for better support
Font.register({
  family: 'Helvetica',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontSize: 11,
    fontFamily: 'Helvetica',
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 25,
    paddingBottom: 15,
    borderBottom: '2 solid #2563eb',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1e40af',
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1f2937',
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 3,
  },
  question: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#f9fafb',
    borderLeft: '3 solid #3b82f6',
    borderRadius: 2,
  },
  questionText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#1f2937',
  },
  answer: {
    fontSize: 10,
    color: '#374151',
    backgroundColor: '#ffffff',
    padding: 6,
    borderRadius: 2,
    border: '1 solid #e5e7eb',
  },
  answerLabel: {
    fontWeight: 'bold',
    color: '#059669',
  },
  noAnswer: {
    fontSize: 10,
    color: '#ef4444',
    fontStyle: 'italic',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#9ca3af',
    borderTop: '1 solid #e5e7eb',
    paddingTop: 10,
  },
});

interface QuizPDFProps {
  quizData: {
    user: {
      name: string;
      email: string;
      completedAt: string;
    };
    questions: any[];
    sections: any[];
    summary: {
      totalQuestions: number;
      answeredQuestions: number;
      completionRate: string;
    };
  };
  selectedAnswers: { [key: string]: any };
}

const renderAnswer = (question: any, answer: any) => {
  if (!answer) {
    return <Text style={styles.noAnswer}>Non risposta</Text>;
  }

  switch (question.type) {
    case 'open-numeric':
      const numericAnswers = Object.entries(answer)
        .filter(([key]) => !['question', 'score', 'dom', 'subdom', 'prop'].includes(key))
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      return (
        <Text style={styles.answer}>
          <Text style={styles.answerLabel}>Risposta: </Text>
          {numericAnswers || 'Nessun valore inserito'}
        </Text>
      );

    case 'single-choice':
      return (
        <Text style={styles.answer}>
          <Text style={styles.answerLabel}>Risposta: </Text>
          {answer.question || 'Non selezionata'}
          {answer.score !== undefined && (
            <Text> (Score: {answer.score})</Text>
          )}
        </Text>
      );

    case 'closed-numeric':
      return (
        <Text style={styles.answer}>
          <Text style={styles.answerLabel}>Valore: </Text>
          {answer.score || 'Non impostato'}
        </Text>
      );

    default:
      return <Text style={styles.noAnswer}>Tipo di domanda non supportato</Text>;
  }
};

const QuizPDFDocument: React.FC<QuizPDFProps> = ({ quizData, selectedAnswers }) => {
  // Group questions by section
  const questionsBySection = quizData.questions.reduce((acc, question) => {
    if (!acc[question.section]) {
      acc[question.section] = [];
    }
    acc[question.section].push(question);
    return acc;
  }, {} as { [key: string]: any[] });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Quiz di Formazione Medica</Text>
          <Text style={styles.subtitle}>Risultati del Test</Text>
          <Text style={styles.subtitle}>
            Completato da: {quizData.user.name}
          </Text>
          <Text style={styles.subtitle}>
            Data: {new Date(quizData.user.completedAt).toLocaleDateString('it-IT', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>


        {/* Questions by Section */}
        {Object.entries(questionsBySection).map(([sectionName, questions]) => (
          <View key={sectionName} style={styles.section}>
            <Text style={styles.sectionTitle}>{sectionName}</Text>
            {questions.map((question, index) => (
              <View key={question.id} style={styles.question}>
                <Text style={styles.questionText}>
                  {index + 1}. {question.text}
                </Text>
                {renderAnswer(question, selectedAnswers[question.id])}
              </View>
            ))}
          </View>
        ))}

        {/* Footer */}
        <Text style={styles.footer}>
          Generato automaticamente da Calc Boost Hub - {new Date().toLocaleDateString('it-IT')}
        </Text>
      </Page>
    </Document>
  );
};

export default QuizPDFDocument;
