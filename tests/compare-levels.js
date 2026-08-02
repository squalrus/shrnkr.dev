// Diagnostic report, not an assertion suite (see shrink.test.js for that).
// Run with: node tests/compare-levels.js
// Prints every level's output for each sample text side by side, plus a
// similarity score between level 4 and level 5 specifically.
const { shrinkText } = require('../js/shrink.js');

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function lcsLength(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

// 1.0 = identical, 0.0 = nothing in common. Case-insensitive since level 5
// always lowercases and level 4 doesn't — casing alone shouldn't count as
// "different content" for this comparison.
function similarity(a, b) {
  const [x, y] = [a.toLowerCase(), b.toLowerCase()];
  if (!x.length && !y.length) return 1;
  return (2 * lcsLength(x, y)) / (x.length + y.length);
}

const SAMPLES = [
  "We had a baby, it's a boy, we're thrilled to announce our new AI feature is ready for production deployment next quarter.",
  "Sure — here are three ways to reduce your AWS bill: right-size your EC2 instances, move cold data to S3 Glacier, and set up billing alerts.",
  "I'd recommend scheduling the client call for Thursday afternoon, since Priya mentioned she's traveling Wednesday and won't be back until late morning.",
  "The quarterly report shows revenue up 12%, driven primarily by growth in the enterprise segment, though churn ticked up slightly in SMB.",
  "schedule the meeting for thursday"
];

const SEED = 42;
const LEVEL_NAMES = ['Garlic Press', 'Panini Press', 'Vacuum Sealer', 'Pressure Cooker', 'Meat Grinder'];

for (const text of SAMPLES) {
  console.log('='.repeat(70));
  console.log('ORIGINAL:', text);
  console.log('-'.repeat(70));
  const outputs = {};
  for (let level = 1; level <= 5; level++) {
    const out = shrinkText(text, level, mulberry32(SEED));
    outputs[level] = out;
    console.log(`L${level} ${LEVEL_NAMES[level - 1].padEnd(15)} (${String(out.length).padStart(3)} chars): ${out}`);
  }
  const sim = similarity(outputs[4], outputs[5]);
  console.log(`\nLevel 4 vs Level 5 similarity: ${(sim * 100).toFixed(1)}%  (length ${outputs[4].length} vs ${outputs[5].length})`);
  console.log();
}

console.log('='.repeat(70));
console.log('Note: levels 3-5 share the same merge-into-one-word + lowercase base.');
console.log('Level 4 additionally runs DLE (collapses repeated consecutive letters);');
console.log('level 5 instead runs JDSL (deletes every 4th character outright). Those');
console.log('two distinct passes are what keep levels 3/4/5 from converging on short');
console.log('input instead of just differing by vowelKeepChance.');
