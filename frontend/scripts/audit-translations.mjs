import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from '@babel/parser';
import { translatePageText } from '../src/i18n/translate.js';
import { pageTranslations } from '../src/i18n/pageTranslations.js';
import { translations } from '../src/i18n/translations.js';
import { preservedUiText } from './preserved-ui-text.mjs';

if (process.argv.includes('--mixed')) {
  for (const language of ['si', 'ta']) {
    console.log(language, [...Object.values(pageTranslations[language]), ...Object.values(translations[language])].filter((value) => /[A-Za-z]/.test(value)));
  }
  process.exit();
}

function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? files(join(directory, entry.name)) : [join(directory, entry.name)]);
}

const phrases = new Map();
const sources = new Map();
const technicalValues = new Set(['asc', 'desc', 'checking', 'prompt', 'custom', 'start', 'end', 'hidden', 'text']);
function record(text, file, line = 1) {
  text = text?.replace(/\s+/g, ' ').trim();
  if (!text || preservedUiText.has(text) || technicalValues.has(text)) return;
  if (/^[/#]|(?:^|\s|:)(?:-?translate|bg|text|border|rounded|hover|focus|dark|grid|flex|font|items|justify|shadow|transition|overflow|animate|cursor|opacity|pointer-events|rotate|col-span|p[xtblrsy]?|m[xtblrsy]?|w|h)-|^(?:fuel|role|nav|odometer|driverTable|approvalRecords)\.|-error$|^url\(/.test(text)) return;
  if (text && /[a-z]{2}/i.test(text) && ['si', 'ta'].some((language) => translatePageText(text, language) === text)) {
    phrases.set(text, `${file}:${line}`);
  }
}
const attributes = new Set(['placeholder', 'title', 'aria-label', 'alt', 'label', 'description', 'message']);
function visit(node, file, parent) {
  if (!node || typeof node !== 'object') return;
  let text;
  if (node.type === 'JSXText') text = node.value.replace(/\s+/g, ' ').trim();
  if (node.type === 'StringLiteral' && (
    (parent?.type === 'JSXAttribute' && attributes.has(parent.name.name)) ||
    (parent?.type === 'ObjectProperty' && attributes.has(parent.key.name)) ||
    (['CallExpression', 'NewExpression'].includes(parent?.type) && /toast\.|(?:Error|alert|confirm|alertLocalized|confirmLocalized|setError)\(/.test(sources.get(file).slice(parent.start, node.start))) ||
    parent?.type === 'ConditionalExpression'
  )) text = node.value.trim();
  if (process.argv.includes('--all-literals') && node.type === 'StringLiteral' && /[A-Za-z]{2}/.test(node.value) &&
    !/[{}<>]|(?:bg|text|border|rounded|hover|focus|dark|grid|flex|font|items|justify|shadow|transition|overflow|p|m|w|h)-|^\.?\.?\/|^https?:|^image\//.test(node.value) &&
    !/^[\w.-]+$/.test(node.value)) text = node.value.trim();
  if (process.argv.includes('--templates') && node.type === 'TemplateLiteral') {
    const template = node.quasis.map((part) => part.value.cooked).join('123');
    if (!/[{}<>]|(?:bg|text|border|rounded|hover|focus|dark|grid|flex|font|items|justify|shadow|transition|overflow|p|m|w|h)-|^https?:/.test(template)) record(template, file, node.loc.start.line);
  }
  record(text, file, node.loc?.start.line);
  for (const [key, value] of Object.entries(node)) {
    if (key === 'loc') continue;
    if (Array.isArray(value)) value.forEach((child) => visit(child, file, node));
    else if (value && typeof value === 'object') visit(value, file, node);
  }
}
for (const file of files('src').filter((file) => /\.[jt]sx$/.test(file) || /[\\/]utils[\\/].*\.js$/.test(file))) {
  sources.set(file, readFileSync(file, 'utf8'));
  visit(parse(sources.get(file), { sourceType: 'module', plugins: ['jsx'] }), file);
}
if (process.argv.includes('--reports')) {
  for (const file of files('src/utils').filter((file) => /Pdf\.js$/.test(file))) {
    const source = readFileSync(file, 'utf8');
    // Report markup uses escaped dynamic values. Audit the surrounding labels.
    for (const match of source.matchAll(/>([^<>`]*[A-Za-z][^<>`]*)</g)) {
      const text = match[1].replace(/\$\{[^}]*\}/g, '123').replace(/&(?:nbsp|amp);/g, ' ');
      if (!/[{}]/.test(text)) record(text, file);
    }
  }
}
if (process.argv.includes('--backend')) {
  for (const file of files('../backend/app').filter((file) => /\.php$/.test(file))) {
    for (const match of readFileSync(file, 'utf8').matchAll(/['"]([^'"\n]*[a-z] [^'"\n]*[.!?])['"]/g)) record(match[1], file);
  }
}
console.log(JSON.stringify(process.argv.includes('--locations') ? Object.fromEntries([...phrases.entries()].sort()) : [...phrases.keys()].sort(), null, 2));
console.log(`${phrases.size} uncovered static phrases`);
if (process.argv.includes('--check') && phrases.size) process.exitCode = 1;
