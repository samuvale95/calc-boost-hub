export function prepScoresPDF(answers: { [key: string]: any }): { question: string; response?: any; score: string | number; }[] {
  const responseArray: any[] = Object.values(answers);
  const scoresPDF: { question: string; response?: any; score: string | number; }[] = [];

  const ageQ = "ETÀ in anni e mesi, es. se il paziente ha 3 anni e 4 mesi scrivere 3 nella casella 'Anni' e 4 in quella 'Mesi'";

  for (const item of responseArray) {
    // Gestione speciale per la domanda sull'età
    if (item.question === ageQ) {
      scoresPDF.push({
        question: "ETÀ",
        score: item.Anni*12 + item.Mesi,
        response: `${item.Anni} anni e ${item.Mesi} mesi`
      });
    } else {
      // Gestione per tutte le altre domande
      let formattedScore: number;

      // "Percentualizza" lo score per le domande single-choice (subdom da 1 a 17)
      if (item.subdom > 0 && item.subdom <= 17) {
        formattedScore = Math.round(item.score * 100);
      } else {
        formattedScore = item.score;
      }

      scoresPDF.push({
        question: item.question,
        response: item.response,
        score: formattedScore
      });
    }
  }
  return scoresPDF;
}
