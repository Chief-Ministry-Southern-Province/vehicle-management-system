import { translatePageText } from './translate.js';

export const translatableAttributes = ['placeholder', 'title', 'aria-label', 'aria-description', 'alt', 'label'];
const textRecords = new WeakMap();
const attributeRecords = new WeakMap();
const implicitOptions = new WeakMap();
const excluded = '[data-no-translate], [translate="no"], [contenteditable="true"], script, style, code, pre, textarea';

export function canTranslateNode(node) {
  return node.parentElement && !node.parentElement.closest(excluded);
}

// Track both source and our last rendering so React updates and moved DOM nodes
// never turn translated text into the source for the next language switch.
export function localizedRecord(previous, current, language) {
  const source = previous && current === previous.rendered ? previous.source : current;
  return { source, rendered: translatePageText(source, language) };
}

export function localizeText(node, language) {
  if (!canTranslateNode(node)) return;
  const parent = node.parentElement;
  // HTML options without a value submit their text. Freeze that original value
  // before translating the visible label; never translate submitted values.
  const record = localizedRecord(textRecords.get(node), node.data, language);
  if (parent.tagName === 'OPTION') {
    const previousValue = implicitOptions.get(parent);
    if (!parent.hasAttribute('value') || (previousValue !== undefined && parent.value === previousValue)) {
      const sourceValue = previousValue === undefined ? parent.textContent : record.source;
      parent.value = sourceValue;
      implicitOptions.set(parent, sourceValue);
    } else {
      // React supplied an explicit value after mounting: ownership returns to it.
      implicitOptions.delete(parent);
    }
  }
  textRecords.set(node, record);
  if (node.data !== record.rendered) node.data = record.rendered;
}

export function localizeElement(root, language) {
  if (root.nodeType === 3) return localizeText(root, language);
  if (root.nodeType !== 1) return;
  for (const element of [root, ...root.querySelectorAll('*')]) {
    if (element.closest(excluded)) continue;
    const records = attributeRecords.get(element) || {};
    for (const attribute of translatableAttributes) {
      if (!element.hasAttribute(attribute)) { delete records[attribute]; continue; }
      const current = element.getAttribute(attribute);
      records[attribute] = localizedRecord(records[attribute], current, language);
      if (current !== records[attribute].rendered) element.setAttribute(attribute, records[attribute].rendered);
    }
    attributeRecords.set(element, records);
  }
  const walker = root.ownerDocument.createTreeWalker(root, 4);
  let node;
  while ((node = walker.nextNode())) localizeText(node, language);
}
