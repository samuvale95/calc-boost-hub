// Supported UI languages (DAND Scale plan, point 9: "Prima fase:
// Italiano, Inglese, Francese"). To add a language: add its code here
// and a matching src/locales/<code>/common.json — nothing else to touch.
//
// This is the INTERFACE language, separate from the scale's own
// language/version (see src/config/scale.ts and the plan's "Versioni
// linguistiche e adattamento culturale", point 9): the scale itself only
// ships in a language once the Fondazione has approved a translated,
// back-translated version — see calc.ts's note on why the quiz content
// isn't switched by this setting (yet).
export interface SupportedLanguage {
  code: string;
  label: string;
  nativeLabel: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'it', label: 'Italian', nativeLabel: 'Italiano' },
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'fr', label: 'French', nativeLabel: 'Français' },
];

export const DEFAULT_LANGUAGE = 'it';
