const test = require('node:test');
const assert = require('node:assert/strict');
const { shrinkText } = require('../js/shrink.js');

// Deterministic RNG so vowel-elision results are reproducible instead of
// depending on Math.random(). shrinkText() accepts rng as its 3rd arg
// specifically so tests can inject this.
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// rng() < vowelKeepChance decides whether a vowel survives — a constant 0
// is always below any positive keepChance, so this keeps every vowel at
// every level, isolating whatever else a test wants to look at.
const keepAllVowels = () => 0;

const SAMPLES = [
  "We had a baby, it's a boy, we're thrilled to announce our new AI feature is ready for production deployment next quarter.",
  "Sure — here are three ways to reduce your AWS bill: right-size your EC2 instances, move cold data to S3 Glacier, and set up billing alerts.",
  "I'd recommend scheduling the client call for Thursday afternoon, since Priya mentioned she's traveling Wednesday and won't be back until late morning.",
  "The quarterly report shows revenue up 12%, driven primarily by growth in the enterprise segment, though churn ticked up slightly in SMB."
];

test('empty and whitespace-only input produce empty output', () => {
  assert.equal(shrinkText('', 3, mulberry32(1)), '');
  assert.equal(shrinkText('   ', 3, mulberry32(1)), '');
});

test('level 1 keeps every vowel and every word separate when nothing else is in play', () => {
  const rng = mulberry32(1);
  assert.equal(shrinkText('production deployment quarter', 1, rng), 'production deployment quarter');
});

test('levels 1-3 stay space-separated, levels 4-5 collapse to one token', () => {
  for (const text of SAMPLES) {
    for (const level of [1, 2, 3]) {
      assert.ok(shrinkText(text, level, mulberry32(1)).includes(' '), `level ${level} should keep spaces`);
    }
    for (const level of [4, 5]) {
      assert.ok(!shrinkText(text, level, mulberry32(1)).includes(' '), `level ${level} should have no spaces`);
    }
  }
});

test('level 5 output is always lowercase', () => {
  for (const text of SAMPLES) {
    const out = shrinkText(text, 5, mulberry32(2));
    assert.equal(out, out.toLowerCase());
  }
});

test('short words (<=3 chars) are never touched by vowel elision', () => {
  // level 4, not 5 — level 5 additionally runs JDSL, which deletes
  // characters regardless of word length, so it isn't the right level to
  // isolate the elision-only "words <=3 chars are skipped" rule.
  const alwaysStrip = () => 1; // 1 is never < any keepChance <= 1, so every eligible vowel is dropped
  const out = shrinkText('hi cat', 4, alwaysStrip);
  assert.ok(out.includes('cat'), `expected short word "cat" to survive untouched, got "${out}"`);
});

test('redundant phrase detection deletes pure filler outright', () => {
  const out = shrinkText(
    "Just wanted to check in on the deploy — to be honest, it's fine.",
    1,
    mulberry32(1)
  );
  assert.ok(!/wanted to check in/i.test(out));
  assert.ok(!/to be honest/i.test(out));
  assert.ok(/deploy/i.test(out));
});

test('wordy-but-meaningful phrases are shortened, not deleted', () => {
  const out = shrinkText('We need to ship this in order to hit the deadline.', 1, mulberry32(1));
  assert.ok(!/in order to/i.test(out));
  assert.ok(/deadline/i.test(out));
});

test('common words are swapped for compact symbols', () => {
  const out = shrinkText('We will move the data and increase throughput.', 1, mulberry32(1));
  assert.ok(out.includes('→'), `expected "move" -> "→", got "${out}"`);
  assert.ok(out.includes('&'), `expected "and" -> "&", got "${out}"`);
  assert.ok(out.includes('↑'), `expected "increase" -> "↑", got "${out}"`);
});

test('sentence flattening strips all dash variants, not just hyphen-minus', () => {
  const out = shrinkText('Sure — here: right-size it – now ― done.', 1, mulberry32(1));
  assert.ok(!/[-‐-―]/.test(out), `expected no dash characters left, got "${out}"`);
});

test('JDSL (level 5 only) deletes exactly every 4th character after merging — this is what actually separates level 5 from level 4, not vowel-elision odds alone', () => {
  for (const text of SAMPLES) {
    // with every vowel kept, level 4's output is just the merged, symbol-
    // substituted, punctuation-stripped text — i.e. level 5's shape right
    // before JDSL runs on it (case aside).
    const out4 = shrinkText(text, 4, keepAllVowels);
    const out5 = shrinkText(text, 5, keepAllVowels);
    const expectedLength = out4.length - Math.floor(out4.length / 4);
    assert.equal(out5.length, expectedLength, `expected JDSL to drop 1/4 of "${out4}"`);
    assert.notEqual(out5, out4.toLowerCase());
  }
});
