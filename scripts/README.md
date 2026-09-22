# Aggiungere una lingua all'interfaccia (senza toccare codice)

Il sito scopre le lingue automaticamente da `src/locales/*/common.json`
(vedi `src/i18n/languages.ts` e `src/i18n/config.ts`) — aggiungere un file
lì è sufficiente, non serve editare altro codice.

## Workflow completo

**1. Genera il file da mandare a chi traduce**

```bash
npm run i18n:export -- es
```

Crea `translations-es.xlsx`: un foglio "Istruzioni" e un foglio
"Traduzioni" con 4 colonne (chiave, italiano, inglese di riferimento,
traduzione da compilare) più una colonna "Note" che segnala automaticamente
dove NON toccare `{{placeholder}}` o tag tipo `<strong>`.

**2. Mandalo a chi traduce.** Deve scrivere solo nella colonna
"Traduzione" (evidenziata in giallo) e, se serve, correggere il nome
della lingua nel foglio "Istruzioni". Nessun rischio di rompere JSON:
lavora su Excel/Google Sheets, non tocca file di codice.

**3. Quando torna compilato, importalo**

```bash
npm run i18n:import -- es translations-es.xlsx
```

Lo script valida tutto prima di scrivere niente:
- ogni chiave italiana ha una traduzione (nessuna riga vuota)
- nessuna chiave in più/mancante
- ogni `{{placeholder}}` e tag HTML è rimasto identico nella traduzione

Se trova un problema, elenca riga per riga cosa correggere e **non scrive
nessun file** — rimanda il file a chi traduce, richiedi la correzione,
reimporta.

Se tutto è a posto, crea `src/locales/es/common.json` pronto all'uso.

**4. Build, commit, push, rilascia.** Fine — la lingua è già attiva, non
c'è nessun altro file da modificare.

## Aggiornare una lingua esistente (proofreading / nuove frasi)

Stesso comando di export su una lingua che esiste già:

```bash
npm run i18n:export -- fr
```

La colonna "Traduzione" viene pre-riempita con le traduzioni attuali,
comodo per far rileggere/aggiornare a chi traduce invece di ripartire da
zero. Reimporta allo stesso modo.

## Cosa NON copre questo workflow

Solo l'interfaccia (bottoni, menu, testi di navigazione, email di
sistema quando saranno tradotte). Le **domande della scala** (in
`src/data/DAND_qt.json`) restano fuori: quelle richiedono un processo di
validazione con la Fondazione (adattamento linguistico-culturale,
back-translation, approvazione) — vedi il piano, punto 9. Tradurle con
questo stesso meccanismo, senza quel processo, romperebbe anche il
calcolo dei punteggi (`src/utils/calc.ts` riconosce alcune domande dal
testo italiano esatto).
