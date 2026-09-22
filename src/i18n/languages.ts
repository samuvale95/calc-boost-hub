// Supported UI languages (DAND Scale plan, point 9: "Prima fase:
// Italiano, Inglese, Francese"). Auto-discovered from
// src/locales/<code>/common.json's own "_meta" block — see config.ts.
//
// To add a language: drop a new src/locales/<code>/common.json (with a
// "_meta": { "label": ..., "nativeLabel": ... } entry) and nothing else
// — no code change here or in config.ts. See scripts/i18n-export.mjs /
// scripts/i18n-import.mjs for the Excel-based translator workflow that
// produces that file.
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

const localeModules = import.meta.glob<{ default: { _meta?: { label?: string; nativeLabel?: string } } }>(
  '/src/locales/*/common.json',
  { eager: true }
);

function deriveSupportedLanguages(): SupportedLanguage[] {
  const languages: SupportedLanguage[] = [];
  for (const path in localeModules) {
    const match = path.match(/\/src\/locales\/([a-zA-Z-]+)\/common\.json$/);
    if (!match) continue;
    const code = match[1];
    const meta = localeModules[path].default?._meta ?? {};
    languages.push({
      code,
      label: meta.label ?? code.toUpperCase(),
      nativeLabel: meta.nativeLabel ?? code.toUpperCase(),
    });
  }
  return languages.sort((a, b) => (a.code === 'it' ? -1 : b.code === 'it' ? 1 : a.code.localeCompare(b.code)));
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = deriveSupportedLanguages();

export const DEFAULT_LANGUAGE = 'it';
