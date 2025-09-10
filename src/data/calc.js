import pkg from "jstat"; // per distribuzione gamma
const { jStat } = pkg; 

import data from "./DAND_fake_output.json" with { type: "json" } // output utente
import table from "./calc_table.json" with { type: "json" } // per parametri di pred

export function moveResults(results) {
  console.log("📊 Risultati ricevuti:", results);
  // Qui puoi fare i tuoi calcoli, salvare in variabili,
  // aggiornare strutture dati ecc.
}

// creo un array con i valori degli oggetti in data (gli oggetti in data erano l'uuid contenenti un oggetto risposta con le info utili)
const responseArray = Object.values(data);

// creo funzione per calcolo del logaritmo naturale della media
function calcLnMean(arr) {
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

// calcolo ln(età in mesi) centrato
const age = responseArray.find(item => item.question === "ETÀ").anni*12 + responseArray.find(item => item.question === "ETÀ").mesi
const meanLnAge = 4.944218314
const lnAge0 = Math.log(age) - meanLnAge

// estrapolo genere e nazionalità
const sex = responseArray.find(item => item.question === "GENERE").score
const nat = responseArray.find(item => item.question === "NAZIONALITÀ").score

// salvo ln(medie) 
const allLnMeans = {};

// calcolo ln(media) overall
const overallItems = responseArray.filter(resp => resp.subdom >= 1 && resp.subdom <= 17); // elimino subdom 0, 18, 19 
allLnMeans["Overall"] = calcLnMean(overallItems.map(item => item.score*item.prop)) // calcolo ln(media) e aggiungo a allLnMeans

// calcolo ln(medie) doms
const domNames = ["Mot", "Aut", "Lan", "Mem", "Emo"];

for (const domName of domNames) {
  const items = responseArray.filter(resp => resp.dom === domName); // filtro per dom
  allLnMeans[domName] = calcLnMean(items.map(item => item.score*item.prop)); // calcolo ln(media) e aggiungo a allLnMeans
}

// calcolo ln(medie) subdoms ESCLUSI 18 e 19
for (let i = 1; i <= 17; i++) {
  const items = responseArray.filter(resp => resp.subdom === i); // filtro per subdom
  const mean = calcLnMean(items.map(item => item.score*item.prop)); // calcolo ln(media)
  allLnMeans[`sub${i}`] = mean; // aggiungo ln(media) a allLnMeans
}

// calcolo ln(media) subdom 18
allLnMeans["sub18"] = Math.log(responseArray.filter(resp => resp.subdom === 18).map(resp => resp.score).reduce((acc, val) => acc + val, 0) / 24);

// calcolo Z ESCLUSO subdom 19
const results = {}

for (const [key, value] of Object.entries(allLnMeans)) {
  const dom = table.find(item => item.dom === key); // può essere sub, dom o overall
  const sd = dom.sd
  const pred = dom.int + (dom.s_age*lnAge0) + (dom.s_nat*nat) + (dom.s_sex*sex) + (dom.s_sexnat*sex*nat)
  results[key] = (value - pred) / sd
}

// calcolo Z subdom 19
const nRisvegli = responseArray.find(item => item.subdom === 19).score // estrapolo score utente
const sub19Mean = Math.exp(0.114 + (0.416*lnAge0) + (0.559*nat)) // calcolo media
const alpha = 0.521648409
const beta = sub19Mean / alpha
results["sub19"] = jStat.gamma.cdf(nRisvegli, alpha, beta)

console.log(results)











