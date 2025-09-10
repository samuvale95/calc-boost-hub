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
    padding: 20,
    fontSize: 9,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    marginBottom: 3,
  },
  section: {
    marginBottom: 15,
    pageBreakInside: 'avoid',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
    padding: 5,
    borderBottom: '1 solid #333',
  },
  question: {
    marginBottom: 8,
    padding: 5,
    border: '0.5 solid #ccc',
    backgroundColor: '#fafafa',
  },
  questionText: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  answer: {
    fontSize: 8,
    marginLeft: 10,
  },
  noAnswer: {
    fontSize: 8,
    fontStyle: 'italic',
    marginLeft: 10,
    color: '#666',
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
    case 'open-numeric': {
      const numericAnswers = Object.entries(answer)
        .filter(([key]) => !['question', 'score', 'dom', 'subdom', 'prop'].includes(key))
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      return <Text style={styles.answer}>{numericAnswers || 'Nessun valore'}</Text>;
    }

    case 'single-choice':
      return <Text style={styles.answer}>{answer.question || 'Non selezionata'}</Text>;

    case 'closed-numeric':
      return <Text style={styles.answer}>{answer.score || 'Non impostato'}</Text>;

    default:
      return <Text style={styles.noAnswer}>Non supportato</Text>;
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
          <Text style={styles.subtitle}>{quizData.user.name} - {new Date(quizData.user.completedAt).toLocaleDateString('it-IT')}</Text>
        </View>


        {/* Questions by Section */}
        {Object.entries(questionsBySection).map(([sectionName, questions]) => (
          <View key={sectionName} style={styles.section}>
            <Text style={styles.sectionTitle}>{sectionName}</Text>
            {(questions as any[]).map((question, index) => (
              <View key={question.id} style={styles.question}>
                <Text style={styles.questionText}>
                  {index + 1}. {question.text}
                </Text>
                {renderAnswer(question, selectedAnswers[question.id])}
              </View>
            ))}
          </View>
        ))}

      </Page>
    </Document>
  );
};

export default QuizPDFDocument;
