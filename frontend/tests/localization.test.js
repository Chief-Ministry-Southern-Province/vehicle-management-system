import assert from 'node:assert/strict';
import test from 'node:test';
import { translatePageText } from '../src/i18n/translate.js';
import { uiPhrases } from '../src/i18n/uiPhrases.js';
import { messageTemplates } from '../src/i18n/messageTemplates.js';
import { localizedRecord, localizeText, localizeElement } from '../src/i18n/localizeDom.js';
import { confirmLocalized, getCurrentLocale } from '../src/i18n/runtime.js';
import { formatLocalDate } from '../src/utils/dateTime.js';

test('every catalog phrase has Sinhala and Tamil display text', () => {
  for (const row of uiPhrases) {
    assert.equal(row.length, 3, row[0]);
    for (const language of ['si', 'ta']) {
      const result = translatePageText(row[0], language);
      assert.notEqual(result, row[0], `${language}: ${row[0]}`);
      assert.match(result, language === 'si' ? /[\u0d80-\u0dff]/ : /[\u0b80-\u0bff]/, `${language}: ${row[0]}`);
    }
  }
});

test('all static login-page labels translate to Sinhala and Tamil', () => {
  const labels = [
    'Chief Ministry', 'Southern Province', 'Sri Lanka', 'Vehicle Management', 'System',
    'Vehicle Management System', 'Manage Vehicles | Optimize Resources | Deliver Better Services',
    'Efficient', 'Allocation', 'Better', 'Planning', 'Accountable', 'Operations',
    'Data Driven', 'Decisions', 'Chief Ministry, Dakshinapaya, Labuduwa, Galle, Sri Lanka',
    'Welcome Back', 'Sign in to continue to the Vehicle Management System', 'User ID',
    'Password', 'Forgot Password?', 'Login', 'or', 'Authorized Users Only',
    'For official use of the Chief Ministry - Southern Province.', 'People | Service | Sustainability',
  ];

  for (const language of ['si', 'ta']) {
    for (const label of labels) {
      assert.doesNotMatch(translatePageText(label, language), /[A-Za-z]/, `${language}: ${label}`);
    }
  }
});

test('dynamic messages translate without changing substituted names or identifiers', () => {
  for (const row of messageTemplates) {
    const source = row[0].replace(/\{(\d+)\}/g, (_, i) => `VALUE-${i}`);
    for (const language of ['si', 'ta']) {
      const result = translatePageText(source, language);
      assert.notEqual(result, source, source);
      for (const placeholder of source.match(/VALUE-\d+/g) || []) assert.ok(result.includes(placeholder), source);
    }
  }
  assert.doesNotMatch(translatePageText('Returned 2h ago', 'ta'), /Returned/);
});

test('language switches restore the original source and preserve React updates', () => {
  let record = localizedRecord(undefined, 'Save Changes', 'si');
  for (const language of ['ta', 'en', 'si', 'ta', 'en']) record = localizedRecord(record, record.rendered, language);
  assert.equal(record.rendered, 'Save Changes');
  record = localizedRecord(record, 'Cancel', 'ta');
  record = localizedRecord(record, record.rendered, 'en');
  assert.equal(record.rendered, 'Cancel');
});

test('translating implicit dropdown labels does not change submitted values', () => {
  const parent = { tagName: 'OPTION', textContent: 'Available', closest: () => null, hasAttribute: () => Object.hasOwn(parent, 'value') };
  const node = { parentElement: parent, data: 'Available' };
  for (const language of ['si', 'ta', 'en']) localizeText(node, language);
  assert.equal(parent.value, 'Available');
  assert.equal(node.data, 'Available');
  node.data = 'Unavailable';
  localizeText(node, 'ta');
  assert.equal(parent.value, 'Unavailable');
  parent.value = 'canonical-status';
  node.data = 'Available';
  localizeText(node, 'si');
  assert.equal(parent.value, 'canonical-status');
});

test('placeholder changes are tracked independently and form values are untouched', () => {
  const attributes = new Map([['placeholder', 'Search vehicles'], ['title', 'Close']]);
  const element = { nodeType: 1, value: 'May Silva', closest: () => null, querySelectorAll: () => [], hasAttribute: (name) => attributes.has(name), getAttribute: (name) => attributes.get(name), setAttribute: (name, value) => attributes.set(name, value), ownerDocument: { createTreeWalker: () => ({ nextNode: () => null }) } };
  localizeElement(element, 'si');
  attributes.set('placeholder', 'Search drivers');
  localizeElement(element, 'ta');
  localizeElement(element, 'en');
  assert.equal(attributes.get('placeholder'), 'Search drivers');
  assert.equal(attributes.get('title'), 'Close');
  assert.equal(element.value, 'May Silva');
});

test('protected text and unknown user-authored values remain intact', () => {
  const node = { parentElement: { closest: () => ({}) }, data: 'Available' };
  localizeText(node, 'si');
  assert.equal(node.data, 'Available');
  for (const value of ['May Silva', 'REQ-0042', 'Toyota Camry', 'user@gov.lk', 'No. 12, Station Road']) {
    assert.equal(translatePageText(value, 'ta'), value);
  }
});

test('counts preserve spacing and dates translate without touching free text', () => {
  assert.match(translatePageText('Total 25 Vehicles', 'si'), /\s25\s/);
  for (const value of ['Friday', '13 September 2026', '08:00 AM', 'June ($5,300)']) {
    assert.doesNotMatch(translatePageText(value, 'si'), /[A-Za-z]/, value);
    assert.doesNotMatch(translatePageText(value, 'ta'), /[A-Za-z]/, value);
  }
  assert.equal(translatePageText('May Silva', 'si'), 'May Silva');
  const tamilDate = new Intl.DateTimeFormat('ta-LK', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date('2026-09-13'));
  assert.doesNotMatch(translatePageText(tamilDate, 'en'), /[\u0b80-\u0bff]/);
  assert.equal(translatePageText('Friday', 'si'), 'සිකුරාදා');
});

test('native confirmation messages and shared dates follow the saved preference', () => {
  const storage = globalThis.localStorage;
  const browser = globalThis.window;
  try {
    globalThis.localStorage = { getItem: () => 'ta' };
    globalThis.window = { confirm: (message) => { assert.ok(message.includes('May Silva')); assert.doesNotMatch(message, /Remove|system/); return false; } };
    assert.equal(confirmLocalized('Remove May Silva from the system?'), false);
    assert.equal(getCurrentLocale(), 'ta-LK');
    assert.doesNotMatch(formatLocalDate('2026-09-13T12:00:00Z'), /Sep/);
  } finally {
    if (storage === undefined) delete globalThis.localStorage; else globalThis.localStorage = storage;
    if (browser === undefined) delete globalThis.window; else globalThis.window = browser;
  }
});

test('validation field labels and report timestamps do not leak English', () => {
  for (const language of ['si', 'ta']) {
    for (const value of [
      'The phone field is required.',
      'The start odometer km field must be a number.',
      'The password field must be at least 8 characters.',
      'The phone field is required. (and 1 more error)',
      'The date of birth field must be a date before today.',
      'Driver Details Record | 0042 | Generated 13 September 2026 at 08:00 AM by the Vehicle Management System',
      'Driver Details Record \u00a0|\u00a0 0042 \u00a0|\u00a0 Generated 13 September 2026 at 08:00 AM by the Vehicle Management System',
      'Returned 2h ago',
    ]) assert.doesNotMatch(translatePageText(value, language), /[A-Za-z]/, `${language}: ${value}`);
  }
});
