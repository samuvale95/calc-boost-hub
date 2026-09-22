// i18next setup (DAND Scale plan, point 9: "Prima fase: Italiano,
// Inglese, Francese"). Resources are bundled at build time (no runtime
// HTTP backend) — the whole UI translation payload is a few KB, not
// worth an extra network round trip or loading-flash to fetch it lazily.
//
// This governs the INTERFACE language only. It does not affect the DAND
// Scale questionnaire itself, which stays Italian until the Fondazione
// approves a translated version — see src/data/DAND_qt.json and the note
// in src/utils/calc.ts.
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import it from '@/locales/it/common.json';
import en from '@/locales/en/common.json';
import fr from '@/locales/fr/common.json';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './languages';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      it: { common: it },
      en: { common: en },
      fr: { common: fr },
    },
    ns: ['common'],
    defaultNS: 'common',
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES.map((l) => l.code),
    interpolation: {
      escapeValue: false, // React already escapes; also needed for the <strong> markup in usageCounter
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'dand_language',
    },
  });

export default i18n;
