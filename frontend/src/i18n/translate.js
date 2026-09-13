import { pageTranslations } from './pageTranslations.js';
import { translations } from './translations.js';
import { uiPhrases } from './uiPhrases.js';

const normalize = (value) => String(value).replace(/\s+/g, ' ').trim().replace(/[.!?:…]+$/, '').toLowerCase();
const codes = ['en', 'si', 'ta'];
const index = new Map();
const register = (row) => {
  codes.forEach((code) => {
    if (row[code]) index.set(normalize(row[code]), row);
  });
};
for (const source of new Set([...Object.keys(pageTranslations.si), ...Object.keys(pageTranslations.ta)])) {
  register({ en: source, si: pageTranslations.si[source], ta: pageTranslations.ta[source] });
}
for (const key of Object.keys(translations.en)) {
  register(Object.fromEntries(codes.map((code) => [code, translations[code][key]])));
}
for (const [en, si, ta] of uiPhrases) register({ en, si, ta });

export function translatePageText(value, language) {
  if (typeof value !== 'string' || !value || !codes.includes(language)) return value;
  const direct = index.get(normalize(value));
  if (direct?.[language]) {
    // Preserve the author's English spelling/case and surrounding punctuation.
    if (language === 'en' && normalize(value) === normalize(direct.en)) return value;
    const leading = value.match(/^\s*/)[0];
    const trailing = value.match(/\s*$/)[0];
    const punctuation = value.trim().match(/[.!?:…]+$/)?.[0] || '';
    return leading + direct[language].replace(/[.!?:…]+$/, '') + punctuation + trailing;
  }
  // Translate separately authored clauses/counts only when every word is known.
  // Never substitute individual words inside names, addresses, or free text.
  const pieces = value.split(/(\s*[·•|→↑×/()]\s*|\s+\d[\d,.%]*\s*|^\d[\d,.%]*\s*)/);
  if (pieces.length > 1) {
    const converted = pieces.map((piece) => /[A-Za-z\u0D80-\u0DFF\u0B80-\u0BFF]/.test(piece)
      ? index.get(normalize(piece))?.[language] : piece);
    if (converted.every((piece) => piece !== undefined)) return converted.join('');
  }
  return value;
}
