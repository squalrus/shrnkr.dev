// ---- ticker ----
const tickerMsgs = [
  'SAVINGS COUNTER: <b>4,281,004</b> tokens "saved" today',
  'NOW TRENDING: <b>"thursdyPM"</b>',
  'SQUISH LEVEL 5 UPTIME: <b>12%</b> comprehensible',
  'ENGINEER SATISFACTION: <b>declining, as expected</b>',
  'CFO SATISFACTION: <b>all time high</b>',
  'VOWELS REMAINING IN PROD: <b>low</b>'
];
const tickerEl = document.getElementById('tickerInner');
tickerEl.innerHTML = (tickerMsgs.concat(tickerMsgs)).map(m => `<span>${m}</span>`).join('');

// ---- hero headline squish animation ----
const heroEl = document.getElementById('heroHeadline');
const words = heroEl.textContent.split(' ');
heroEl.innerHTML = words.map(w => `<span class="squishword">${w}</span>`).join(' ');
setTimeout(() => {
  document.querySelectorAll('.squishword').forEach((el, i) => {
    setTimeout(() => el.classList.add('done'), i * 120);
  });
}, 600);

// ---- aggression label ----
const levels = {
  1: 'Level 1 — "barely tried"',
  2: 'Level 2 — "a little unhinged"',
  3: 'Level 3 — "still technically words"',
  4: 'Level 4 — "your on-call engineer is worried"',
  5: 'Level 5 — "one word. always one word."'
};
const aggInput = document.getElementById('aggression');
const aggLabel = document.getElementById('aggressionLabel');
aggInput.addEventListener('input', () => {
  aggLabel.textContent = levels[aggInput.value];
});

// ---- squish algorithm ----
const vowelPattern = /[aeiouAEIOU]/g;

function squishText(text, level) {
  let words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';

  // stage 1: strip most punctuation
  words = words.map(w => w.replace(/[,.;:!?"']/g, ''));

  // stage 2: adaptive vowel elision — more aggressive at higher levels,
  // but always keep the first letter of each word so it's semi-legible
  const vowelKeepChance = [1, 0.85, 0.55, 0.3, 0.1][level - 1];
  words = words.map(w => {
    if (w.length <= 3) return w;
    const first = w[0];
    const rest = w.slice(1).split('').filter(ch => {
      if (!/[aeiouAEIOU]/.test(ch)) return true;
      return Math.random() < vowelKeepChance;
    }).join('');
    return first + rest;
  });

  // stage 3: common word contractions (dumb optimizations)
  const dumbMap = {
    'because': 'bc', 'you': 'u', 'your': 'ur', "you're": 'ur',
    'and': '&', 'thursday': 'thursdy', 'afternoon': 'PM', 'morning': 'AM',
    'schedule': 'schedul', 'production': 'prod', 'engineer': 'eng',
    'percent': 'pct', 'quarterly': 'qtrly', 'segment': 'seg'
  };

  // stage 4: merge N adjacent words into one compound, N grows with level
  const mergeGroup = [1, 1, 2, 3, 5][level - 1];
  const merged = [];
  for (let i = 0; i < words.length; i += mergeGroup) {
    const chunk = words.slice(i, i + mergeGroup).join('');
    merged.push(chunk);
  }

  let result = merged.join(level >= 4 ? '' : ' ');

  // stage 5: enterprise mode — collapse EVERYTHING into one word
  if (level === 5) {
    result = merged.join('').toLowerCase();
  }

  return result || '(nothing survived)';
}

const inputText = document.getElementById('inputText');
const outputBox = document.getElementById('outputBox');
const squishBtn = document.getElementById('squishBtn');
const statRow = document.getElementById('statRow');
const statTokens = document.getElementById('statTokens');
const statMoney = document.getElementById('statMoney');
const statReadability = document.getElementById('statReadability');

function runSquish() {
  const original = inputText.value;
  const level = parseInt(aggInput.value, 10);
  if (!original.trim()) {
    outputBox.innerHTML = '<span class="cursor"></span>';
    statRow.style.display = 'none';
    return;
  }
  const squished = squishText(original, level);

  outputBox.textContent = '';
  let i = 0;
  squishBtn.disabled = true;
  const typer = setInterval(() => {
    outputBox.textContent = squished.slice(0, i);
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    outputBox.appendChild(cursor);
    i++;
    if (i > squished.length) {
      clearInterval(typer);
      squishBtn.disabled = false;
    }
  }, 12);

  const origLen = original.length;
  const newLen = squished.length;
  const pctSaved = Math.max(0, Math.round((1 - newLen / Math.max(origLen, 1)) * 100));
  const readability = Math.max(2, 100 - pctSaved - level * 6);
  const money = (pctSaved / 100 * 0.014 * (origLen / 4)).toFixed(4);

  statTokens.textContent = pctSaved + '%';
  statMoney.textContent = '$' + money;
  statReadability.textContent = readability + '%';
  statRow.style.display = 'flex';
}

squishBtn.addEventListener('click', runSquish);
window.addEventListener('load', () => setTimeout(runSquish, 1400));
