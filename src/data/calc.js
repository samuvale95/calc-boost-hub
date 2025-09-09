import data from "./DAND_fake_output.json" with { type: "json" }
import table from "./calc_table.json" with { type: "json" }

// credo un array con i valori degli oggetti in data (gli oggetti in data erano l'uuid con dentro le robe che mi interssano)
const responseArray = Object.values(data);

// creo funzione per calcolo del logaritmo naturale della media
function calcLnMean(arr) {
  const sum = arr.reduce((acc, val) => acc + val, 0);
  const mean = sum / arr.length;

  if (mean === 0) {
    return -4.8
  } else if (mean === 1) {
    return 4.8
  } else {
    return Math.log(mean) // logaritmo naturale della media
  }
}

const allLnMeans = {};

// calcolo ln(medie) subdoms ESCLUSO 18
for (let i = 1; i <= 17; i++) {
  const items = responseArray.filter(resp => resp.subdom === i); // filtro per subdom
  const mean = calcLnMean(items.map(item => item.score*item.prop)); // calcolo ln(media)
  allLnMeans[`sub${i}`] = mean; // aggiungo ln(media) a allLnMeans
}

// calcolo ln(media) subdom 18
allLnMeans["sub18"] = Math.log(responseArray.filter(resp => resp.subdom === 18).map(resp => resp.score).reduce((acc, val) => acc + val, 0) / 24);

// calcolo ln(medie) doms
const domNames = ["Mot", "Aut", "Lan", "Mem", "Emo"];

for (const domName of domNames) {
  const items = responseArray.filter(resp => resp.dom === domName); // filtro per dom
  allLnMeans[domName] = calcLnMean(items.map(item => item.score*item.prop)); // calcolo ln(media) e aggiungo a allLnMeans
}

// calcolo ln(media) overall
const overallItems = responseArray.filter(resp => resp.subdom >= 1 && resp.subdom <= 17); // elimino subdom 0, 18, 19 
allLnMeans["Overall"] = calcLnMean(overallItems.map(item => item.score*item.prop)) // calcolo ln(media) e aggiungo a allLnMeans

// estrapolo età, genere, nazionalità
const sex = responseArray.find(item => item.question === "GENERE").score
const nat = responseArray.find(item => item.question === "NAZIONALITÀ").score
const lnAge0 = Math.log(42) - 4.944218314 // provvisorio finchè non capiamo come chiederla

// calcolo Z!
const results = {}

for (const [key, value] of Object.entries(allLnMeans)) {
  const dom = table.find(item => item.dom === key); // può essere sub, dom o overall
  const sd = dom.sd
  const pred = dom.int + (dom.s_age*lnAge0) + (dom.s_nat*nat) + (dom.s_sex*sex) + (dom.s_sexnat*sex*nat)
  results[key] = (value * pred) / sd
}

console.log(allLnMeans)







