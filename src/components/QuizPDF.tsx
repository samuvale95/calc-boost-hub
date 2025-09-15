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
    fontSize: 24,
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
  table: {
    marginBottom: 15,
    border: '1 solid #e5e7eb',
    borderRadius: 3,
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderBottom: '1 solid #e5e7eb',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e5e7eb',
  },
  tableCell: {
    flex: 1,
    padding: 8,
    fontSize: 10,
  },
  tableCellLabel: {
    fontWeight: 'bold',
    color: '#374151',
  },
  tableCellValue: {
    color: '#6b7280',
  },
  resultsSection: {
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1f2937',
    padding: 8,
    borderRadius: 3,
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
  };
  scoresPDF: {
    question: string;
    response?: string;
    score: number | string;
  }[];
  calcResults?: { [key: string]: number };
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
      return (
        <Text style={styles.answer}>
          <Text style={styles.answerLabel}>Risposta: </Text>
          {numericAnswers || 'Nessun valore inserito'}
        </Text>
      );
    }

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

const QuizPDFDocument: React.FC<QuizPDFProps> = ({ quizData, scoresPDF, calcResults }) => {

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>D-DAND</Text>
          <Text style={styles.subtitle}>Report dei Risultati</Text>
        </View>

        {/* Patient Name Section */}
        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>Identificativo Paziente: ________________________________</Text>
        </View>

        {/* Results Sections */}
        {calcResults && (
          <>
            {/* Overall Results */}
            <View style={styles.resultsSection}>
              <Text style={styles.resultsTitle}>Punteggio Overall</Text>
              <View style={styles.table}>
                <View style={styles.tableRow} wrap={false}>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableCellLabel}>Overall</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableCellValue}>{calcResults.Overall?.toFixed(2) || 'N/A'}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Domain Results */}
            <View style={styles.resultsSection}>
              <Text style={styles.resultsTitle}>Punteggio per Domini</Text>
              <View style={styles.table}>
                {[
                  {dom: 'Mot', label:"Abilità motorie"},
                  {dom: "Lan", label:"Linguaggio e interazione sociale"},
                  {dom: "Aut", label:"Autonomie"},
                  {dom: "Mem", label:"Memoria e abilità scolastiche"},
                  {dom: "Emo", label:"Regolazione comportamentale ed emotiva"}
                ].map(({dom, label}) => (
                  <View key={dom} style={styles.tableRow} wrap={false}>
                    <View style={styles.tableCell}>
                      <Text style={styles.tableCellLabel}>{label}</Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={styles.tableCellValue}>{calcResults[dom]?.toFixed(2) || 'N/A'}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Subdomain Results */}
            <View style={styles.resultsSection}>
              <Text style={styles.resultsTitle}>Punteggio per Sottodomini</Text>
              <View style={styles.table}>
                {Array.from({length: 19}, (_, i) => i + 1).map(subdom => (
                  <View key={subdom} style={styles.tableRow} wrap={false}>
                    <View style={styles.tableCell}>
                      <Text style={styles.tableCellLabel}>Sub {subdom}</Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={styles.tableCellValue}>{calcResults[`sub${subdom}`]?.toFixed(2) || 'N/A'}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Individual Item Results */}
            <View style={styles.resultsSection}>
              <Text style={styles.resultsTitle}>Punteggio per Item</Text>
              <View style={styles.table}>
                {scoresPDF.map(({question, response = null, score}) => {
                  return (
                    <View key={question} style={styles.tableRow} wrap={false}>
                      <View style={[styles.tableCell, { flex: 1, justifyContent: 'center'}]}>
                        <Text style={styles.tableCellLabel}>{question || 'N/A'}</Text>
                      </View>
                      <View style={[styles.tableCell, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                        <Text style={styles.tableCellValue}>{score || 'N/A'}</Text>
                      </View>
                      <View style={[styles.tableCell, { flex: 2, justifyContent: 'center' }]}>
                        <Text style={styles.tableCellValue}>{response || ''}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Generato automaticamente da Calc Boost Hub - {new Date().toLocaleDateString('it-IT')}
        </Text>
      </Page>
    </Document>
  );
};

export default QuizPDFDocument;
