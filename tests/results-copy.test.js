// The "Results" section and the Dana R. testimonial in index.html show
// hand-placed "shrunk" text as marketing copy. This test pins each snippet
// to a specific (input, level, seed) so a future shrink.js change that
// silently changes the output gets caught here instead of leaving stale
// copy on the page — which is exactly what happened before this test
// existed.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
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

// (text, level, seed) must match what generated the snippet baked into
// index.html's Results section — regenerate both together if either changes.
const CASE_STUDIES = [
  {
    text: "Sure — here are three ways to reduce your AWS bill: right-size your EC2 instances, move cold data to S3 Glacier, and set up billing alerts.",
    level: 4,
    seed: 11
  },
  {
    text: "I'd recommend scheduling the client call for Thursday afternoon, since Priya mentioned she's traveling Wednesday and won't be back until late morning.",
    level: 3,
    seed: 11
  },
  {
    text: "The quarterly report shows revenue up 12%, driven primarily by growth in the enterprise segment, though churn ticked up slightly in SMB.",
    level: 5,
    seed: 11
  }
];

// same idea as CASE_STUDIES: the Dana R. testimonial is itself written in
// SHRNKR's own "after" style, as if even the customer quote got run
// through the product — this pins it to what it's "before" would be.
const TESTIMONIALS = [
  {
    text: "We cut our token spend by 41 percent in week one. We didn't change a single prompt template.",
    level: 4,
    seed: 11
  }
];

function assertSnippetInHtml(html, { text, level, seed }) {
  const expected = shrinkText(text, level, mulberry32(seed));
  // index.html HTML-escapes '&' as '&amp;'; shrinkText's raw output uses '&'
  const expectedInHtml = expected.replace(/&/g, '&amp;');
  assert.ok(
    html.includes(expectedInHtml),
    `index.html is missing/out of date for: "${text}" at level ${level}\nexpected snippet: ${expected}`
  );
}

test('Results section case studies match real shrinkText() output', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  for (const item of CASE_STUDIES) assertSnippetInHtml(html, item);
});

test('testimonial "shrunk" quote matches real shrinkText() output', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  for (const item of TESTIMONIALS) assertSnippetInHtml(html, item);
});
