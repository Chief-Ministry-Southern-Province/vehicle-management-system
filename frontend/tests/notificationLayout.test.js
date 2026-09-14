import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from '@babel/parser';

// Source-level layout guards: a dropdown's own z-index cannot escape clipping
// on its header. These complement, rather than replace, browser layout checks.
const source = readFileSync(new URL('../src/components/layout/Topbar.jsx', import.meta.url), 'utf8');
const ast = parse(source, { sourceType: 'module', plugins: ['jsx'] });
const elements = [];
function visit(node) {
  if (!node || typeof node !== 'object') return;
  if (node.type === 'JSXOpeningElement') elements.push(node);
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) value.forEach(visit);
    else if (value && typeof value === 'object') visit(value);
  }
}
visit(ast);
const attribute = (node, name) => node.attributes.find((item) => item.name?.name === name)?.value;
const classes = (node) => attribute(node, 'className')?.value.split(/\s+/) || [];

test('topbar allows the dropdown outside the header but clips its artwork', () => {
  const header = elements.find((node) => node.name.name === 'header');
  assert.ok(classes(header).includes('overflow-visible'));
  assert.ok(!classes(header).includes('overflow-hidden'));
  assert.ok(elements.some((node) => classes(node).includes('pointer-events-none') && classes(node).includes('overflow-hidden')));
});

test('notification panel fits the mobile header and keeps its list scrollable', () => {
  const panel = elements.find((node) => attribute(node, 'id')?.value === 'notification-panel');
  assert.ok(panel, 'The bell must control an identifiable panel');
  assert.ok(classes(panel).includes('inset-x-3'));
  assert.ok(classes(panel).includes('sm:left-auto'));
  assert.ok(classes(panel).includes('sm:right-0'));
  assert.ok(classes(panel).includes('max-h-[calc(100dvh-6rem)]'));
  const anchor = elements.find((node) => attribute(node, 'ref')?.expression?.name === 'notificationMenuRef');
  assert.ok(classes(anchor).includes('static'));
  assert.ok(classes(anchor).includes('sm:relative'));
  assert.ok(elements.some((node) => attribute(node, 'aria-controls')?.value === 'notification-panel'));
  assert.ok(elements.some((node) => classes(node).includes('min-h-0') && classes(node).includes('overflow-y-auto')));
});
