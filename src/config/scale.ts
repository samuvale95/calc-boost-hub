// DAND Scale versioning/metadata, stamped on every generated report
// (DAND Scale plan, point 8: "Inserire versione DAND, lingua, data e
// copyright nel PDF").
//
// Bump SCALE_VERSION whenever the Fondazione publishes a new official
// version of the scale or its scoring (see calc.ts / calc_table.json) —
// it is NOT the app's own package.json version.
export const SCALE_VERSION = "1.0";

// Language of the questions currently in src/data/DAND_qt.json. Update
// this alongside the i18n work (DAND Scale plan, point 9) once the scale
// itself has an approved translation — see the note in prepPDF.ts and
// calc.ts about questions being matched by their Italian text.
export const SCALE_LANGUAGE = "it";

// Placeholder pending the official wording from Fondazione Dravet ETS
// (DAND Scale plan, point 1: "Definire la dicitura copyright ufficiale
// da inserire su scala, manuali, sito, calculator e PDF"). Replace this
// single constant once they provide it — every report reads from here.
export const SCALE_COPYRIGHT = "© Fondazione Dravet ETS — Tutti i diritti riservati";

export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) || window.location.origin;
