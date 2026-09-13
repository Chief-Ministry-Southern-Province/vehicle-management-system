// Recognize date-only labels, including labels already mounted when the language
// changes. Never replace month names inside names, addresses, or prose.
const codes = ['en', 'si', 'ta'];
const tokens = new Map();
const add = (row) => row.forEach((value) => tokens.set(value.toLocaleLowerCase(), row));
const calendar = [
  ['January', 'ජනවාරි', 'ஜனவரி'], ['February', 'පෙබරවාරි', 'பிப்ரவரி'],
  ['March', 'මාර්තු', 'மார்ச்'], ['April', 'අප්‍රේල්', 'ஏப்ரல்'],
  ['May', 'මැයි', 'மே'], ['June', 'ජූනි', 'ஜூன்'],
  ['July', 'ජූලි', 'ஜூலை'], ['August', 'අගෝස්තු', 'ஆகஸ்ட்'],
  ['September', 'සැප්තැම්බර්', 'செப்டம்பர்'], ['October', 'ඔක්තෝබර්', 'அக்டோபர்'],
  ['November', 'නොවැම්බර්', 'நவம்பர்'], ['December', 'දෙසැම්බර්', 'டிசம்பர்'],
  ['Monday', 'සඳුදා', 'திங்கள்'], ['Tuesday', 'අඟහරුවාදා', 'செவ்வாய்'],
  ['Wednesday', 'බදාදා', 'புதன்'], ['Thursday', 'බ්‍රහස්පතින්දා', 'வியாழன்'],
  ['Friday', 'සිකුරාදා', 'வெள்ளி'], ['Saturday', 'සෙනසුරාදා', 'சனி'],
  ['Sunday', 'ඉරිදා', 'ஞாயிறு'],
];
for (const row of calendar) {
  add(row);
  tokens.set(row[0].slice(0, 3).toLowerCase(), row);
}
// Include native short forms emitted by Intl (e.g. Tamil month abbreviations).
// The explicit table above is still authoritative when a runtime lacks Sinhala.
calendar.forEach((row, index) => {
  const date = index < 12 ? new Date(Date.UTC(2026, index, 1)) : new Date(Date.UTC(2026, 5, index - 11));
  for (const language of codes) {
    for (const width of ['short', 'long']) {
      const value = new Intl.DateTimeFormat(`${language}-LK`, { [index < 12 ? 'month' : 'weekday']: width, timeZone: 'UTC' }).format(date);
      tokens.set(value.toLocaleLowerCase(), row);
    }
  }
});
tokens.set('sept', calendar[8]);
add(['AM', 'පෙ.ව.', 'முற்பகல்']);
add(['PM', 'ප.ව.', 'பிற்பகல்']);
add(['at', 'වේලාව', 'நேரம்']);
const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const pattern = new RegExp([...tokens.keys()].sort((a, b) => b.length - a.length).map(escape).join('|'), 'giu');

export function translateDateText(value, language) {
  if (!codes.includes(language)) return value;
  const remainder = value.replace(pattern, '');
  if (!/^[\d\s,.:/()$–—-]*$/.test(remainder)) return value;
  return value.replace(pattern, (token) => tokens.get(token.toLocaleLowerCase())[codes.indexOf(language)]);
}
