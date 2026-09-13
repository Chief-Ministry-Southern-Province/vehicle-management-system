import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from '@babel/parser';
import { translatePageText } from '../src/i18n/translate.js';

function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? files(join(directory, entry.name)) : [join(directory, entry.name)]);
}

const phrases = new Map();
const attributes = new Set(['placeholder', 'title', 'aria-label', 'alt', 'label', 'description', 'message']);
function visit(node, file, parent) {
  if (!node || typeof node !== 'object') return;
  let text;
  if (node.type === 'JSXText') text = node.value.replace(/\s+/g, ' ').trim();
  if (node.type === 'StringLiteral' && (
    (parent?.type === 'JSXAttribute' && attributes.has(parent.name.name)) ||
    (parent?.type === 'ObjectProperty' && attributes.has(parent.key.name)) ||
    (parent?.type === 'CallExpression' && /toast\.|(?:Error|alert|confirm)\(/.test(readFileSync(file, 'utf8').slice(parent.start, node.start)))
  )) text = node.value.trim();
  if (text && /[a-z]{2}/i.test(text) && ['si', 'ta'].some((language) => translatePageText(text, language) === text)) {
    phrases.set(text, file);
  }
  for (const [key, value] of Object.entries(node)) {
    if (key === 'loc') continue;
    if (Array.isArray(value)) value.forEach((child) => visit(child, file, node));
    else if (value && typeof value === 'object') visit(value, file, node);
  }
}
for (const file of files('src').filter((file) => /\.[jt]sx$/.test(file))) {
  visit(parse(readFileSync(file, 'utf8'), { sourceType: 'module', plugins: ['jsx'] }), file);
}
console.log(JSON.stringify([...phrases.keys()].sort(), null, 2));
console.log(`${phrases.size} uncovered static phrases`);
