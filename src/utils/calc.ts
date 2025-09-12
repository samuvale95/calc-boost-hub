import pkg from "jstat"; // per distribuzione gamma
const { jStat } = pkg;

import table from "../data/calc_table.json" with { type: "json" } // parametri di pred

// creo funzione per calcolo del logaritmo naturale della media
function calcLnMean(arr: number[]): number {
  // calcolo media
  const sum = arr.reduce((acc, val) => acc + val, 0);
  const mean = sum / arr.length;

  // calcolo ln(media)
  if (mean === 0) {
    return -4.8 // minimo ln(mean) possibile
  } else if (mean === 1) {
    return 4.8 // massimo ln(mean) possibile
  } else {
    return Math.log(mean)
  }
}

export function calcResults(answers: { [key: string]: any }): { [key: string]: number } {
  const responseArray: any[] = Object.values(answers);
  const allLnMeans: { [key: string]: number } = {};

  // calcolo ln(età in mesi) centrato
  const ageQ = "ETÀ in anni e mesi, es. se il paziente ha 3 anni e 4 mesi scrivere 3 nella casella 'Anni' e 4 in quella 'Mesi'"
  const ageItem = responseArray.find((item: any) => item.question === ageQ);
  const age = ageItem?.Anni || 0 * 12 + ageItem?.Mesi || 0;
  const meanLnAge = 4.944218314;
  const lnAge0 = Math.log(age) - meanLnAge;

  // estrapolo genere e nazionalità
  const sexItem = responseArray.find((item: any) => item.question === "GENERE");
  const natItem = responseArray.find((item: any) => item.question === "NAZIONALITÀ");
  const sex = sexItem?.score || 0;
  const nat = natItem?.score || 0;

  // calcolo ln(media) overall
  const overallItems = responseArray.filter((resp: any) => resp.subdom >= 1 && resp.subdom <= 17); // elimino subdom 0, 18, 19 
  allLnMeans["Overall"] = calcLnMean(overallItems.map((item: any) => item.score)) // calcolo ln(media) e aggiungo a allLnMeans

  // calcolo ln(medie) doms
  const domNames = ["Mot", "Aut", "Lan", "Mem", "Emo"];

  for (const domName of domNames) {
    const items = responseArray.filter((resp: any) => resp.dom === domName); // filtro per dom
    allLnMeans[domName] = calcLnMean(items.map((item: any) => item.score)); // calcolo ln(media) e aggiungo a allLnMeans
  }

  // calcolo ln(medie) subdoms ESCLUSI 18 e 19
  for (let i = 1; i <= 17; i++) {
    const items = responseArray.filter((resp: any) => resp.subdom === i); // filtro per subdom
    const mean = calcLnMean(items.map((item: any) => item.score)); // calcolo ln(media)
    allLnMeans[`sub${i}`] = mean; // aggiungo ln(media) a allLnMeans
  }

  // calcolo ln(media) subdom 18
  allLnMeans["sub18"] = Math.log(responseArray.filter((resp: any) => resp.subdom === 18).map((resp: any) => resp.score).reduce((acc: number, val: number) => acc + val, 0) / 24);

  // calcolo Z ESCLUSO subdom 19
  const results: { [key: string]: number } = {}

  for (const [key, value] of Object.entries(allLnMeans)) {
    const dom = table.find((item: any) => item.dom === key); // può essere sub, dom o overall
    const sd = dom?.sd || 1;
    const pred = (dom?.int || 0) + ((dom?.s_age || 0) * lnAge0) + ((dom?.s_nat || 0) * nat) + ((dom?.s_sex || 0) * sex) + ((dom?.s_sexnat || 0) * sex * nat);
    results[key] = (value - pred) / sd;
  }

  // calcolo Z subdom 19
  const subdom19Item = responseArray.find((item: any) => item.subdom === 19);
  const nRisvegli = subdom19Item?.score || 0; // estrapolo score utente
  const sub19Mean = Math.exp(0.114 + (0.416 * lnAge0) + (0.559 * nat)); // calcolo media
  const alpha = 0.521648409;
  const beta = sub19Mean / alpha;
  results["sub19"] = jStat.gamma.cdf(nRisvegli, alpha, beta);

  return results
}
