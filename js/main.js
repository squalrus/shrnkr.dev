// ---- aggression label ----
// level names, gentlest to most destructive — same idea as naming model sizes
// instead of numbering them
const LEVEL_NAMES = ['Garlic Press', 'Panini Press', 'Vacuum Sealer', 'Pressure Cooker', 'Meat Grinder'];
function levelLabel(level) {
  return `${LEVEL_NAMES[level - 1]} (lvl ${level})`;
}
const aggInput = document.getElementById('aggression');
const aggLabel = document.getElementById('aggressionLabel');
aggInput.addEventListener('input', () => {
  aggLabel.textContent = levelLabel(aggInput.value);
});

// ---- shrink algorithm ----
// shrinkText() lives in js/shrink.js, loaded before this file, so it can
// also be required from Node for tests without a DOM.

const inputText = document.getElementById('inputText');
const outputBox = document.getElementById('outputBox');
const shrinkBtn = document.getElementById('shrinkBtn');
const statRow = document.getElementById('statRow');
const statTokens = document.getElementById('statTokens');
const statMoney = document.getElementById('statMoney');
const statReadability = document.getElementById('statReadability');

function runShrink() {
  const original = inputText.value;
  const level = parseInt(aggInput.value, 10);
  if (!original.trim()) {
    outputBox.innerHTML = '<span class="cursor"></span>';
    statRow.style.display = 'none';
    return;
  }
  const shrunk = shrinkText(original, level);

  outputBox.textContent = '';
  let i = 0;
  shrinkBtn.disabled = true;
  const typer = setInterval(() => {
    outputBox.textContent = shrunk.slice(0, i);
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    outputBox.appendChild(cursor);
    i++;
    if (i > shrunk.length) {
      clearInterval(typer);
      shrinkBtn.disabled = false;
    }
  }, 12);

  const origLen = original.length;
  const newLen = shrunk.length;
  const pctSaved = Math.max(0, Math.round((1 - newLen / Math.max(origLen, 1)) * 100));
  const readability = Math.max(2, 100 - pctSaved - level * 6);
  const money = (pctSaved / 100 * 0.014 * (origLen / 4)).toFixed(4);

  statTokens.textContent = pctSaved + '%';
  statMoney.textContent = '$' + money;
  statReadability.textContent = readability + '%';
  statRow.style.display = 'grid';
}

shrinkBtn.addEventListener('click', runShrink);
window.addEventListener('load', () => setTimeout(runShrink, 1400));

// ---- pricing: spend slider drives the reduction table ----
const spendInput = document.getElementById('spend');
const spendLabel = document.getElementById('spendLabel');
const pricingRowsEl = document.getElementById('pricingRows');
const pricingExampleEl = document.getElementById('pricingExample');

const REDUCTIONS = [0.08, 0.19, 0.33, 0.41, 0.68];
const BAR_WIDTHS = ['12%', '28%', '49%', '60%', '100%'];

function fmt(n) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function renderPricing() {
  const spend = parseInt(spendInput.value, 10);
  spendLabel.textContent = '$' + spend.toLocaleString('en-US');

  pricingRowsEl.innerHTML = REDUCTIONS.map((p, i) => `
    <div class="pricing-row">
      <div class="level mono">${LEVEL_NAMES[i]}<br><span class="level-num">lvl ${i + 1}</span></div>
      <div class="reduction">${Math.round(p * 100)}%</div>
      <div class="pricing-bar-track"><div class="pricing-bar-fill" style="width:${BAR_WIDTHS[i]};"><div class="pricing-bar-keep"></div><div class="pricing-bar-fee"></div></div></div>
      <div class="keep">${fmt(spend * p * 0.99)} kept</div>
    </div>
  `).join('');

  const spent = spend * 0.41;
  const fee = spent * 0.01;
  const kept = spent * 0.99;
  pricingExampleEl.textContent = `Worked example: spend $${spend.toLocaleString('en-US')}/mo, run Pressure Cooker (lvl 4), cut 41% of your tokens. That's ${fmt(spent)} saved. SHRNKR takes ${fmt(fee)} of it. You keep ${fmt(kept)}. Same formula at any spend, any level.`;
}

spendInput.addEventListener('input', renderPricing);
renderPricing();
