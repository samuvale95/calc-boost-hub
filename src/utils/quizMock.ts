import { v4 as uuidv4 } from 'uuid';

export const createMockQuizData = () => {
  const mockAnswers = {
    'q1': {
      question: 'Risposta A',
      score: 3,
      dom: 'Dominio A',
      subdom: 'Sottodominio A'
    },
    'q2': {
      score: 7,
      dom: 'Dominio B',
      subdom: 'Sottodominio B',
      question: 'Risposta B'
    },
    'q3': {
      'Campo 1': 15,
      'Campo 2': 25,
      'Campo 3': 10,
      score: 50,
      dom: 'Dominio C',
      subdom: 'Sottodominio C',
      question: 'Valori numerici'
    },
    'q4': {
      question: 'Risposta D',
      score: 5,
      dom: 'Dominio D',
      subdom: 'Sottodominio D'
    },
    'q5': {
      score: 8,
      dom: 'Dominio E',
      subdom: 'Sottodominio E',
      question: 'Risposta E'
    }
  };

  const mockQuestions = [
    {
      id: 'q1',
      text: 'Quale è il protocollo più appropriato per il trattamento dell\'ipertensione in pazienti diabetici?',
      type: 'single-choice',
      section: 'Cardiologia',
      dom: 'Dominio A',
      subdom: 'Sottodominio A',
      response: [
        { text: 'ACE-inibitori', score: 3 },
        { text: 'Beta-bloccanti', score: 1 },
        { text: 'Diuretici tiazidici', score: 2 },
        { text: 'Calcio-antagonisti', score: 2 }
      ]
    },
    {
      id: 'q2',
      text: 'Valuta l\'efficacia del trattamento su una scala da 1 a 10',
      type: 'closed-numeric',
      section: 'Cardiologia',
      dom: 'Dominio B',
      subdom: 'Sottodominio B',
      response: [{ min: 1, max: 10 }]
    },
    {
      id: 'q3',
      text: 'Inserisci i valori per i seguenti parametri clinici:',
      type: 'open-numeric',
      section: 'Endocrinologia',
      dom: 'Dominio C',
      subdom: 'Sottodominio C',
      response: [
        { text: 'Campo 1', min: '0', max: '50' },
        { text: 'Campo 2', min: '0', max: '100' },
        { text: 'Campo 3', min: '0', max: '25' }
      ]
    },
    {
      id: 'q4',
      text: 'Qual è la diagnosi differenziale più probabile per un paziente con dolore toracico acuto?',
      type: 'single-choice',
      section: 'Medicina d\'Urgenza',
      dom: 'Dominio D',
      subdom: 'Sottodominio D',
      response: [
        { text: 'Infarto miocardico', score: 5 },
        { text: 'Embolia polmonare', score: 4 },
        { text: 'Pneumotorace', score: 3 },
        { text: 'Reflusso gastroesofageo', score: 1 }
      ]
    },
    {
      id: 'q5',
      text: 'Valuta il rischio chirurgico del paziente',
      type: 'closed-numeric',
      section: 'Medicina d\'Urgenza',
      dom: 'Dominio E',
      subdom: 'Sottodominio E',
      response: [{ min: 1, max: 10 }]
    }
  ];

  const mockSections = [
    {
      id: 'cardio',
      name: 'Cardiologia',
      questions: ['q1', 'q2']
    },
    {
      id: 'endo',
      name: 'Endocrinologia',
      questions: ['q3']
    },
    {
      id: 'urgenza',
      name: 'Medicina d\'Urgenza',
      questions: ['q4', 'q5']
    }
  ];

  return {
    questions: mockQuestions,
    sections: mockSections,
    answers: mockAnswers,
    user: {
      name: 'Test User',
      completedAt: new Date().toISOString()
    }
  };
};
