import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { SUBDOMAIN_LABELS, DOMAIN_LABELS } from '@/config/domainLabels';

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
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  qrCodeCorner: {
    position: 'absolute',
    top: 30,
    right: 30,
    width: 48,
    height: 48,
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
  calcResults?: { [key: string]: { z: string; p: string } };
  /** Data URL (PNG) of a QR code linking to the official site — DAND Scale plan, point 8. */
  qrCodeDataUrl?: string;
  scaleVersion?: string;
  scaleLanguage?: string;
  copyright?: string;
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

const QuizPDFDocument: React.FC<QuizPDFProps> = ({
  quizData,
  scoresPDF,
  calcResults,
  qrCodeDataUrl,
  scaleVersion,
  scaleLanguage,
  copyright,
}) => {

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {qrCodeDataUrl && <Image src={qrCodeDataUrl} style={styles.qrCodeCorner} />}
          <Text style={styles.title}>D-DAND</Text>
          <Text style={styles.subtitle}>Report dei Risultati</Text>
          {(scaleVersion || scaleLanguage) && (
            <View style={styles.metaRow}>
              {scaleVersion && <Text style={styles.subtitle}>Versione {scaleVersion}</Text>}
              {scaleVersion && scaleLanguage && <Text style={styles.subtitle}>·</Text>}
              {scaleLanguage && <Text style={styles.subtitle}>Lingua: {scaleLanguage.toUpperCase()}</Text>}
            </View>
          )}
        </View>

        {/* Date and Name Section */}
        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>Data valutazione: {scoresPDF.find(s => s.question === "DATA")?.response || "___________________________________"}</Text>
          <Text style={styles.resultsTitle}>Identificativo Paziente: {scoresPDF.find(s => s.question === "ID PAZIENTE")?.response || "___________________________________"}</Text>
        </View>

        {/* Results Sections */}
        {calcResults && (
          <>
            {/* Subdomain Results */}
            <View style={styles.resultsSection}>
              <Text style={styles.resultsTitle}>Punteggio per Sottodomini</Text>
              <View style={styles.table}>
                {SUBDOMAIN_LABELS.map(({key: dom, label}) => (
                  <View key={dom} style={styles.tableRow} wrap={false}>
                    <View style={styles.tableCell}>
                      <Text style={styles.tableCellLabel}>{label}</Text>
                    </View>
                    <View style={[styles.tableCell, { alignItems: 'center'}]}>
                      <Text style={styles.tableCellValue}>z {calcResults[dom].z || 'N/A'}</Text>
                    </View>
                    <View style={[styles.tableCell, { alignItems: 'center'}]}>
                      <Text style={styles.tableCellValue}>percentile {calcResults[dom].p || 'N/A'}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
            
            {/* Domain Results */}
            <View style={styles.resultsSection}>
              <Text style={styles.resultsTitle}>Punteggio per Domini</Text>
              <View style={styles.table}>
                {DOMAIN_LABELS.map(({key: dom, label}) => (
                  <View key={dom} style={styles.tableRow} wrap={false}>
                    <View style={styles.tableCell}>
                      <Text style={styles.tableCellLabel}>{label}</Text>
                    </View>
                    <View style={[styles.tableCell, { alignItems: 'center'}]}>
                      <Text style={styles.tableCellValue}>z {calcResults[dom].z || 'N/A'}</Text>
                    </View>
                    <View style={[styles.tableCell, { alignItems: 'center'}]}>
                      <Text style={styles.tableCellValue}>percentile {calcResults[dom].p || 'N/A'}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Overall Results */}
            <View style={styles.resultsSection}>
              <Text style={styles.resultsTitle}>Punteggio Overall</Text>
              <View style={styles.table}>
                <View style={styles.tableRow} wrap={false}>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableCellLabel}>Overall</Text>
                  </View>
                     <View style={[styles.tableCell, { alignItems: 'center'}]}>
                    <Text style={styles.tableCellValue}>z {calcResults.Overall.z || 'N/A'} </Text>
                  </View>
                    <View style={[styles.tableCell, { alignItems: 'center'}]}>
                    <Text style={styles.tableCellValue}>percentile {calcResults.Overall.p || 'N/A'} </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Individual Item Results */}
            <View style={styles.resultsSection}>
              <Text style={styles.resultsTitle}>Punteggio per Item</Text>
              <View style={styles.table}>
                {scoresPDF.slice(2).map(({question, response = null, score}) => { // remove first 2 items: date and name
                  return (
                    <View key={question} style={styles.tableRow} wrap={false}>
                      <View style={[styles.tableCell, { flex: 1, justifyContent: 'center'}]}>
                        <Text style={styles.tableCellLabel}>{question || 'N/A'}</Text>
                      </View>
                      <View style={[styles.tableCell, { flex: 1, justifyContent: 'center', alignItems: 'center'}]}>
                        <Text style={styles.tableCellValue}>{score ?? 'N/A'}</Text>
                      </View>
                      <View style={[styles.tableCell, { flex: 2, justifyContent: 'center'}]}>
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
          Risultati calcolati automaticamente - {new Date().toLocaleDateString('it-IT')}
          {copyright ? `\n${copyright}` : ''}
        </Text>
      </Page>
    </Document>
  );
};

export default QuizPDFDocument;
