import { v4 as uuidv4 } from "uuid";

// Mock data for testing PDF generation
export const createMockQuizData = () => {
  const mockQuestions = [
    {
      id: uuidv4(),
      text: "ETÀ",
      type: "open-numeric",
      section: "DATI PERSONALI",
      response: [
        { id: uuidv4(), text: "Anno di nascita", min: "1900" },
        { id: uuidv4(), text: "Mese di nascita", min: "1", max: "12" }
      ],
      dom: "Pers",
      subdom: 0
    },
    {
      id: uuidv4(),
      text: "GENERE",
      type: "single-choice",
      section: "DATI PERSONALI",
      response: [
        { id: uuidv4(), text: "Maschio", score: -0.5 },
        { id: uuidv4(), text: "Femmina", score: 0.5 }
      ],
      dom: "Pers",
      subdom: 0
    },
    {
      id: uuidv4(),
      text: "NAZIONALITÀ",
      type: "single-choice",
      section: "DATI PERSONALI",
      response: [
        { id: uuidv4(), text: "Italiana", score: -0.5 },
        { id: uuidv4(), text: "Francese", score: 0.5 }
      ],
      dom: "Pers",
      subdom: 0
    },
    {
      id: uuidv4(),
      text: "PESO CORPOREO",
      type: "closed-numeric",
      section: "DATI FISICI",
      response: [
        { id: uuidv4(), text: "Kg", score: 0 }
      ],
      options: { min: 30, max: 200, step: 1 },
      dom: "Phys",
      subdom: 1
    },
    {
      id: uuidv4(),
      text: "ALTEZZA",
      type: "closed-numeric",
      section: "DATI FISICI",
      response: [
        { id: uuidv4(), text: "cm", score: 0 }
      ],
      options: { min: 120, max: 220, step: 1 },
      dom: "Phys",
      subdom: 1
    },
    {
      id: uuidv4(),
      text: "PRESSIONE SISTOLICA",
      type: "open-numeric",
      section: "PARAMETRI VITALI",
      response: [
        { id: uuidv4(), text: "mmHg", min: "60", max: "250" }
      ],
      dom: "Vital",
      subdom: 2
    },
    {
      id: uuidv4(),
      text: "PRESSIONE DIASTOLICA",
      type: "open-numeric",
      section: "PARAMETRI VITALI",
      response: [
        { id: uuidv4(), text: "mmHg", min: "40", max: "150" }
      ],
      dom: "Vital",
      subdom: 2
    },
    {
      id: uuidv4(),
      text: "FREQUENZA CARDIACA",
      type: "closed-numeric",
      section: "PARAMETRI VITALI",
      response: [
        { id: uuidv4(), text: "bpm", score: 0 }
      ],
      options: { min: 40, max: 200, step: 1 },
      dom: "Vital",
      subdom: 2
    },
    {
      id: uuidv4(),
      text: "TEMPERATURA CORPOREA",
      type: "open-numeric",
      section: "PARAMETRI VITALI",
      response: [
        { id: uuidv4(), text: "°C", min: "35", max: "42" }
      ],
      dom: "Vital",
      subdom: 2
    },
    {
      id: uuidv4(),
      text: "DIABETE MELLITO",
      type: "single-choice",
      section: "ANAMNESI PATOLOGICA",
      response: [
        { id: uuidv4(), text: "No", score: 0 },
        { id: uuidv4(), text: "Sì, tipo 1", score: 2 },
        { id: uuidv4(), text: "Sì, tipo 2", score: 1 }
      ],
      dom: "Path",
      subdom: 3
    },
    {
      id: uuidv4(),
      text: "IPERTENSIONE ARTERIOSA",
      type: "single-choice",
      section: "ANAMNESI PATOLOGICA",
      response: [
        { id: uuidv4(), text: "No", score: 0 },
        { id: uuidv4(), text: "Sì, controllata", score: 1 },
        { id: uuidv4(), text: "Sì, non controllata", score: 2 }
      ],
      dom: "Path",
      subdom: 3
    },
    {
      id: uuidv4(),
      text: "CARDIOPATIA ISCHEMICA",
      type: "single-choice",
      section: "ANAMNESI PATOLOGICA",
      response: [
        { id: uuidv4(), text: "No", score: 0 },
        { id: uuidv4(), text: "Sì, stabile", score: 1 },
        { id: uuidv4(), text: "Sì, instabile", score: 3 }
      ],
      dom: "Path",
      subdom: 3
    },
    {
      id: uuidv4(),
      text: "INSUFFICIENZA RENALE",
      type: "single-choice",
      section: "ANAMNESI PATOLOGICA",
      response: [
        { id: uuidv4(), text: "No", score: 0 },
        { id: uuidv4(), text: "Sì, lieve", score: 1 },
        { id: uuidv4(), text: "Sì, moderata", score: 2 },
        { id: uuidv4(), text: "Sì, grave", score: 3 }
      ],
      dom: "Path",
      subdom: 3
    },
    {
      id: uuidv4(),
      text: "FUMO",
      type: "single-choice",
      section: "FATTORI DI RISCHIO",
      response: [
        { id: uuidv4(), text: "Non fumatore", score: 0 },
        { id: uuidv4(), text: "Ex fumatore", score: 1 },
        { id: uuidv4(), text: "Fumatore attivo", score: 2 }
      ],
      dom: "Risk",
      subdom: 4
    },
    {
      id: uuidv4(),
      text: "ALCOL",
      type: "single-choice",
      section: "FATTORI DI RISCHIO",
      response: [
        { id: uuidv4(), text: "Non bevitore", score: 0 },
        { id: uuidv4(), text: "Bevitore moderato", score: 1 },
        { id: uuidv4(), text: "Bevitore eccessivo", score: 2 }
      ],
      dom: "Risk",
      subdom: 4
    },
    {
      id: uuidv4(),
      text: "ATTIVITÀ FISICA",
      type: "single-choice",
      section: "FATTORI DI RISCHIO",
      response: [
        { id: uuidv4(), text: "Sedentario", score: 2 },
        { id: uuidv4(), text: "Leggermente attivo", score: 1 },
        { id: uuidv4(), text: "Moderatamente attivo", score: 0 },
        { id: uuidv4(), text: "Molto attivo", score: -1 }
      ],
      dom: "Risk",
      subdom: 4
    },
    {
      id: uuidv4(),
      text: "ALIMENTAZIONE",
      type: "single-choice",
      section: "FATTORI DI RISCHIO",
      response: [
        { id: uuidv4(), text: "Sana", score: 0 },
        { id: uuidv4(), text: "Discreta", score: 1 },
        { id: uuidv4(), text: "Scarsa", score: 2 }
      ],
      dom: "Risk",
      subdom: 4
    },
    {
      id: uuidv4(),
      text: "STRESS",
      type: "closed-numeric",
      section: "FATTORI DI RISCHIO",
      response: [
        { id: uuidv4(), text: "Livello", score: 0 }
      ],
      options: { min: 0, max: 10, step: 1 },
      dom: "Risk",
      subdom: 4
    },
    {
      id: uuidv4(),
      text: "SONNO",
      type: "closed-numeric",
      section: "FATTORI DI RISCHIO",
      response: [
        { id: uuidv4(), text: "Ore per notte", score: 0 }
      ],
      options: { min: 3, max: 12, step: 0.5 },
      dom: "Risk",
      subdom: 4
    }
  ];

  const mockAnswers = {
    [mockQuestions[0].id]: {
      question: "ETÀ",
      score: 0,
      dom: "Pers",
      subdom: 0,
      "Anno di nascita": "1985",
      "Mese di nascita": "6"
    },
    [mockQuestions[1].id]: {
      question: "GENERE",
      score: -0.5,
      dom: "Pers",
      subdom: 0,
      prop: 0.5
    },
    [mockQuestions[2].id]: {
      question: "NAZIONALITÀ",
      score: -0.5,
      dom: "Pers",
      subdom: 0,
      prop: 0.5
    },
    [mockQuestions[3].id]: {
      question: "PESO CORPOREO",
      score: 75,
      dom: "Phys",
      subdom: 1
    },
    [mockQuestions[4].id]: {
      question: "ALTEZZA",
      score: 175,
      dom: "Phys",
      subdom: 1
    },
    [mockQuestions[5].id]: {
      question: "PRESSIONE SISTOLICA",
      score: 0,
      dom: "Vital",
      subdom: 2,
      "mmHg": "120"
    },
    [mockQuestions[6].id]: {
      question: "PRESSIONE DIASTOLICA",
      score: 0,
      dom: "Vital",
      subdom: 2,
      "mmHg": "80"
    },
    [mockQuestions[7].id]: {
      question: "FREQUENZA CARDIACA",
      score: 72,
      dom: "Vital",
      subdom: 2
    },
    [mockQuestions[8].id]: {
      question: "TEMPERATURA CORPOREA",
      score: 0,
      dom: "Vital",
      subdom: 2,
      "°C": "36.5"
    },
    [mockQuestions[9].id]: {
      question: "DIABETE MELLITO",
      score: 0,
      dom: "Path",
      subdom: 3,
      prop: 0.33
    },
    [mockQuestions[10].id]: {
      question: "IPERTENSIONE ARTERIOSA",
      score: 0,
      dom: "Path",
      subdom: 3,
      prop: 0.33
    },
    [mockQuestions[11].id]: {
      question: "CARDIOPATIA ISCHEMICA",
      score: 0,
      dom: "Path",
      subdom: 3,
      prop: 0.33
    },
    [mockQuestions[12].id]: {
      question: "INSUFFICIENZA RENALE",
      score: 0,
      dom: "Path",
      subdom: 3,
      prop: 0.25
    },
    [mockQuestions[13].id]: {
      question: "FUMO",
      score: 0,
      dom: "Risk",
      subdom: 4,
      prop: 0.33
    },
    [mockQuestions[14].id]: {
      question: "ALCOL",
      score: 1,
      dom: "Risk",
      subdom: 4,
      prop: 0.33
    },
    [mockQuestions[15].id]: {
      question: "ATTIVITÀ FISICA",
      score: 0,
      dom: "Risk",
      subdom: 4,
      prop: 0.25
    },
    [mockQuestions[16].id]: {
      question: "ALIMENTAZIONE",
      score: 1,
      dom: "Risk",
      subdom: 4,
      prop: 0.33
    },
    [mockQuestions[17].id]: {
      question: "STRESS",
      score: 6,
      dom: "Risk",
      subdom: 4
    },
    [mockQuestions[18].id]: {
      question: "SONNO",
      score: 7.5,
      dom: "Risk",
      subdom: 4
    }
  };

  // Group questions by section
  const sections = mockQuestions.reduce((acc, question) => {
    if (!acc[question.section]) {
      acc[question.section] = [];
    }
    acc[question.section].push(question);
    return acc;
  }, {} as { [key: string]: any[] });

  return {
    questions: mockQuestions,
    sections: Object.entries(sections).map(([name, questions]) => ({
      name,
      questions,
      id: uuidv4()
    })),
    answers: mockAnswers
  };
};
