import { pageTranslations } from './pageTranslations.js';
import { translations } from './translations.js';
import { uiPhrases } from './uiPhrases.js';
import { messageTemplates } from './messageTemplates.js';
import { translateDateText } from './dateText.js';

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

const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const templates = [...messageTemplates].sort((a, b) => b[0].replace(/\{\d+\}/g, '').length - a[0].replace(/\{\d+\}/g, '').length).flatMap((row) => codes.map((code, column) => {
  const positions = [...row[column].matchAll(/\{(\d+)\}/g)].map((match) => Number(match[1]));
  const pattern = row[column].split(/\{\d+\}/).map(escape).join('(.+?)');
  return { code, row, positions, pattern: new RegExp(`^${pattern}$`, 'i') };
}));

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
  for (const template of templates) {
    const match = value.replace(/\s+/g, ' ').trim().match(template.pattern);
    if (!match) continue;
    if (language === template.code) return value;
    const values = {};
    template.positions.forEach((position, index) => {
      const value = match[index + 1];
      values[position] = template.row[3]?.includes(position) ? translatePageText(value, language) : value;
    });
    return template.row[codes.indexOf(language)].replace(/\{(\d+)\}/g, (_, position) => values[position]);
  }
  const dateText = translateDateText(value, language);
  if (dateText !== value) return dateText;
  // Translate separately authored clauses/counts only when every word is known.
  // Never substitute individual words inside names, addresses, or free text.
  const pieces = value.split(/(\s*[·•|→↑×/()]\s*|\s+\d[\d,.%]*\s*|^\d[\d,.%]*\s*)/);
  if (pieces.length > 1) {
    const converted = pieces.map((piece) => /[A-Za-z\u0D80-\u0DFF\u0B80-\u0BFF]/.test(piece)
      ? (index.get(normalize(piece))?.[language] ? translatePageText(piece, language) : undefined) : piece);
    if (converted.every((piece) => piece !== undefined)) return converted.join('');
  }
  return value;
}
