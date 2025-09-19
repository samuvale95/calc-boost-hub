import pkg from "jstat"; // per distribuzione gamma
const { jStat } = pkg;

import table from "../data/calc_table.json" with { type: "json" } // parametri di pred
// import data from "../utils/test_data.json" with { type: "json" }

// creo funzione per calcolo meadia
function calcMean(arr: number[]): number {
  const sum = arr.reduce((acc, val) => acc + val, 0);
  return (sum / arr.length);
}

// creo funzione per calcolo logit
function calcLogit(mean: number): number {
  if (mean === 0) {
    return -4.8
  } else if (mean === 1) {
    return 4.8
  } else {
    return Math.log(mean / (1- mean)); 
  }
}

export function calcResults(answers: { [key: string]: any }): { [key: string]: { z: string; p: string } } {
  const responseArray: any[] = Object.values(answers);
  const allLogit: { [key: string]: number } = {};

  // calcolo ln(età in mesi) centrato
  const ageQ = "ETÀ in anni e mesi, es. se il paziente ha 3 anni e 4 mesi scrivere 3 nella casella 'Anni' e 4 in quella 'Mesi'"
  const ageItem = responseArray.find((item: any) => item.question === ageQ);
  const age = ageItem.Anni * 12 + ageItem.Mesi;
  const meanLnAge = 4.944218314;
  const lnAge0 = Math.log(age) - meanLnAge;

  // estrapolo genere e nazionalità
  const sexItem = responseArray.find((item: any) => item.question === "GENERE");
  const natItem = responseArray.find((item: any) => item.question === "NAZIONALITÀ");
  const sex = sexItem.score;
  const nat = natItem.score;

  // calcolo logit overall
  const overallItems = responseArray.filter((resp: any) => resp.subdom >= 1 && resp.subdom <= 17); // elimino subdom 0, 18, 19 
  const overallMean = calcMean(overallItems.map((item: any) => item.score)) // calcolo media overall
  allLogit["Overall"] = calcLogit(overallMean) // calcolo logit e aggiungo a allLogit

  // calcolo logit doms
  const domNames = ["Mot", "Aut", "Lan", "Mem", "Emo"]; // escludo Pers e Sleep

  for (const domName of domNames) {
    const items = responseArray.filter((resp: any) => resp.dom === domName); // filtro per dom
    const domMean = calcMean(items.map((item: any) => item.score)) // calcolo media per dom
    allLogit[domName] = calcLogit(domMean); // calcolo logit e aggiungo a allLogit
  }

  // calcolo logit subdoms ESCLUSI 18 e 19
  for (let i = 1; i <= 17; i++) {
    const items = responseArray.filter((resp: any) => resp.subdom === i); // filtro per subdom eslcudendo 0, 18, 19
    const subMean = calcMean(items.map((item: any) => item.score)) // calcolo media per subdom
    allLogit[`sub${i}`] = calcLogit(subMean); // calcolo logit e aggiungo a allLogit
  }

  // calcolo logit subdom 18
  const meanSub18 = responseArray.filter((resp: any) => resp.subdom === 18).map((resp: any) => resp.score).reduce((acc: number, val: number) => acc + val, 0) / 24 // calcolo media subdom 18 con formula apposita
  allLogit["sub18"] = calcLogit(meanSub18) // calcolo logit e aggiungo a allLogit

  // calcolo percentili ESCLUSO subdom 19
  const results: { [key: string]: { z: string; p: string } } = {};

  for (const [key, value] of Object.entries(allLogit)) {
    const dom = table.find((item: any) => item.dom === key); // trovo riga coefficienti per overall/dom/subdom in table.js
    const sd = dom.sd; // estrapolo sd
    const pred = (dom.int) + ((dom.s_age) * lnAge0) + ((dom.s_nat) * nat) + ((dom.s_sex) * sex) + ((dom.s_sexnat) * sex * nat); // calcolo media prevista per la popolazione dei pari
    const z = (value - pred) / sd; // calcolo z
    const p = jStat.normal.cdf(z, 0, 1) * 100; // calcolo percentile rispetto alla distribuzione normale standard

    // preparo risultati per PDF e aggiungo a results
    if (value === - 4.8) {
      results[key] = {"z": z.toFixed(2), "p": "< "+p.toFixed(0) }
    } else if (value === 4.8) {
      results[key] = {"z": z.toFixed(2), "p": "> "+p.toFixed(0) }
    } else {
      results[key] = {"z": z.toFixed(2), "p": p.toFixed(0) }
    }  
  }

  // calcolo percentile subdom 19
  const nRisvegli = responseArray.find((item: any) => item.subdom === 19).score;
  const sub19Mean = Math.exp(0.114 + (0.416 * lnAge0) + (0.559 * nat)); // calcolo media popolazione dei pari
  const alpha = 0.521648409;
  const beta = sub19Mean / alpha;
  const p19 = (jStat.gamma.cdf(nRisvegli, alpha, beta) * 100); // calcolo percentile rispetto alla distribuzione gamma dei pari

  // preparo risultati per PDF e aggiungo a results
  results["sub19"] = {"z": "-", "p": p19.toFixed(0)}

  return results
}

// console.log(calcResults(data))
