// Standalone so it can be required from Node for tests without a DOM.
// In the browser this is a plain global script (no modules, matching the
// rest of the project) — js/main.js calls shrinkText() directly.

// stage 0a: redundant phrase detection — pure filler, deleted outright
const FILLER_PHRASES = [
  "just wanted to check in",
  "just wanted to follow up",
  "just wanted to say",
  "wanted to reach out",
  "to be honest",
  "honestly speaking",
  "at the end of the day",
  "for what it's worth",
  "if that makes sense",
  "needless to say",
  "with that being said",
  "that being said",
  "i hope this email finds you well",
  "just a quick heads up",
  "just a heads up",
  "circling back",
  "circle back",
  "touch base",
  "per my last email",
  "at your earliest convenience"
];

// stage 0b: wordy-but-meaningful phrases — shortened, not deleted
const PHRASE_SHORTENINGS = {
  'in order to': 'to',
  'due to the fact that': 'because',
  'despite the fact that': 'although',
  'at this point in time': 'now',
  'in the event that': 'if',
  'in the near future': 'soon',
  'on a regular basis': 'regularly',
  'a large number of': 'many',
  'with regard to': 're'
};

// stage 1.5: semantic concatenation shorthand — common words swapped for
// compact symbols before vowel elision gets a chance at them
const SYMBOL_MAP = {
  'and': '&',
  'move': '→', 'moves': '→', 'moved': '→', 'moving': '→',
  'increase': '↑', 'increases': '↑', 'increased': '↑', 'increasing': '↑',
  'decrease': '↓', 'decreases': '↓', 'decreased': '↓', 'decreasing': '↓',
  'at': '@',
  'with': 'w/',
  'without': 'w/o',
  'number': '#',
  'percent': '%',
  'approximately': '~', 'about': '~', 'around': '~',
  'because': 'bc', 'since': 'bc',
  'you': 'u', 'your': 'ur', 'youre': 'ur',
  'please': 'pls',
  'thanks': 'thx',
  'information': 'info',
  'regarding': 're',
  'versus': 'vs'
};

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function phraseRegex(phrase) {
  return new RegExp(escapeRegExp(phrase).replace(/\s+/g, '\\s+'), 'gi');
}

function detectRedundantPhrases(text) {
  let out = text;
  for (const phrase of FILLER_PHRASES) {
    out = out.replace(phraseRegex(phrase), '');
  }
  for (const phrase in PHRASE_SHORTENINGS) {
    out = out.replace(phraseRegex(phrase), PHRASE_SHORTENINGS[phrase]);
  }
  // tidy up whatever a deleted phrase left behind — doubled commas, a
  // comma stranded right before terminal punctuation, doubled spaces
  return out
    .replace(/\s*,\s*,/g, ',')
    .replace(/,\s*([.!?])/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .replace(/^[,\s]+|[,\s]+$/g, '');
}

// stage 4 (level 5 only): proprietary JDSL — "Just Drop Some Letters" —
// technology. Vowel elision only ever touches vowels; once everything is
// squished into one long word, JDSL deletes every 4th character outright,
// no matter what it is. This is what actually makes level 5 different
// from level 4, instead of just a lower vowel-keep chance.
function jdsl(str) {
  let out = '';
  for (let i = 0; i < str.length; i++) {
    if ((i + 1) % 4 === 0) continue;
    out += str[i];
  }
  return out;
}

function shrinkText(text, level, rng = Math.random) {
  // stage 0: redundant phrase detection
  const detected = detectRedundantPhrases(text);

  let words = detected.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';

  // stage 1: strip most punctuation (sentence flattening)
  words = words.map(w => w.replace(/[,.;:!?"']/g, ''));

  // stage 1.5: swap common words for compact symbols
  words = words.map(w => SYMBOL_MAP[w.toLowerCase()] || w);

  // stage 2: adaptive vowel elision — more aggressive at higher levels,
  // but always keep the first letter of each word so it's semi-legible
  const vowelKeepChance = [1, 0.85, 0.55, 0.3, 0.1][level - 1];
  words = words.map(w => {
    if (w.length <= 3) return w;
    const first = w[0];
    const rest = w.slice(1).split('').filter(ch => {
      if (!/[aeiouAEIOU]/.test(ch)) return true;
      return rng() < vowelKeepChance;
    }).join('');
    return first + rest;
  });

  // stage 3: merge N adjacent words into one compound, N grows with level
  const mergeGroup = [1, 1, 2, 3, 5][level - 1];
  const merged = [];
  for (let i = 0; i < words.length; i += mergeGroup) {
    const chunk = words.slice(i, i + mergeGroup).join('');
    merged.push(chunk);
  }

  let result = merged.join(level >= 4 ? '' : ' ');

  // stage 4: enterprise mode — collapse EVERYTHING into one word, then
  // run it through JDSL
  if (level === 5) {
    result = jdsl(merged.join('').toLowerCase());
  }

  return result || '(nothing survived)';
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { shrinkText };
}
