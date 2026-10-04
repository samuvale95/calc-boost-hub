// i18next setup (DAND Scale plan, point 9: "Prima fase: Italiano,
// Inglese, Francese"). Resources are bundled at build time (no runtime
// HTTP backend) — the whole UI translation payload is a few KB, not
// worth an extra network round trip or loading-flash to fetch it lazily.
//
// Languages are auto-discovered from src/locales/*/common.json — see
// languages.ts. Adding one needs no edit here.
//
// This governs the INTERFACE language only. It does not affect the DAND
// Scale questionnaire itself, which stays Italian until the Fondazione
// approves a translated version — see src/data/DAND_qt.json and the note
// in src/utils/calc.ts.
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './languages';
import { firebaseAuth } from '@/config/firebase';

const localeModules = import.meta.glob<{ default: Record<string, unknown> }>(
  '/src/locales/*/common.json',
  { eager: true }
);

const resources: Record<string, { common: Record<string, unknown> }> = {};
for (const path in localeModules) {
  const match = path.match(/\/src\/locales\/([a-zA-Z-]+)\/common\.json$/);
  if (!match) continue;
  const code = match[1];
  const { _meta: _unusedMeta, ...translations } = localeModules[path].default;
  resources[code] = { common: translations };
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
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

// Firebase picks the language of the emails it sends (sign-in link, email
// verification, password reset) from auth.languageCode, so keep it in step
// with the interface language — see the per-language templates in the
// Firebase console (Authentication -> Templates).
const syncFirebaseLanguage = (lng?: string) => {
  if (firebaseAuth && lng) firebaseAuth.languageCode = lng.split('-')[0];
};
syncFirebaseLanguage(i18n.language);
i18n.on('languageChanged', syncFirebaseLanguage);

export default i18n;
