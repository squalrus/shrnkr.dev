# The Actual Science (a non-satirical appendix)

SHRNKR is satire — a parody of token-cost-optimization middleware. But the underlying
question is a real one people actually ask about tools like this: **if you shrink a
prompt's character count, does the token count billed by the model provider go down
by a comparable amount?**

Short answer: no. Against the current algorithm, it's worse than "no" — sending the
shrunk text through most aggression levels costs *more* real tokens than sending the
original, unmodified sentence. This doc explains why, with real numbers from a real
tokenizer, not the cosmetic string-length math the live demo uses (see `README.md` /
`CLAUDE.md` — the demo's stats are explicitly not real token counts).

## The core misunderstanding

LLM billing is based on **tokens**, not characters. Tokens come from a Byte Pair
Encoding (BPE) vocabulary trained on huge corpora of *normal* text. That vocabulary
already contains merges for common whole words and word-fragments — `"your"`,
`"please"`, `"information"`, `" the"` (with the leading space), `"tion"`, `"ing"`, etc.
are frequently single tokens or small fixed groups of tokens, because they occur
constantly in the training data.

Deleting characters (vowels, "every 4th character"), gluing words together with no
spaces, or substituting slang (`your → ur`, `please → pls`) does two things at once:

1. It reliably shrinks **character count**.
2. It does *not* reliably shrink **token count** — because the resulting substrings
   are often no longer in the tokenizer's vocabulary as a clean match. When BPE hits
   a string it doesn't recognize, it falls back to splitting it into smaller pieces
   (down to individual bytes in the worst case), which can cost *more* tokens for a
   *shorter* string than the original, cleanly-tokenized word did.

This is the same reason "l33t sp3ak" and heavy SMS abbreviation don't compress well
under modern tokenizers even though they look shorter to a human — the model's
vocabulary wasn't built around them.

## Methodology

`js/shrink.js`'s `shrinkText()` was run at all five levels against five representative
business-email-style sample sentences (the same set `tests/compare-levels.js` uses),
using a seeded RNG (`seed = 42`) for reproducibility. This reflects the pipeline as of
the v0.4.0 redesign — word-pairing now starts at level 2, the full merge-into-one-word
behavior kicks in at level 3, DLE runs at level 4, and JDSL runs at level 5 (see
`CLAUDE.md`). Output was tokenized with two real OpenAI tokenizer vocabularies via the
[`gpt-tokenizer`](https://www.npmjs.com/package/gpt-tokenizer) package:

- `cl100k_base` (GPT-3.5 / GPT-4 generation)
- `o200k_base` (GPT-4o generation)

This is a one-off analysis — `gpt-tokenizer` is **not** a project dependency and isn't
installed anywhere in this repo. To reproduce, install it in a scratch directory,
`require()` `js/shrink.js` from there (it's DOM-free by design, see `CLAUDE.md`), and
encode the before/after strings.

## Results

Aggregate across all five samples, relative to the unshrunk original:

| Level | Avg. char reduction | cl100k token Δ | o200k token Δ |
| --- | --- | --- | --- |
| 1 — Garlic Press | −4.8% | **−10.5%** | **−7.1%** |
| 2 — Panini Press | −15.1% | **+7.1%** | **+9.4%** |
| 3 — Vacuum Sealer | −29.4% | **+27.7%** | **+30.2%** |
| 4 — Pressure Cooker | −36.4% | **+23.1%** | **+27.1%** |
| 5 — Meat Grinder | −53.9% | **+8.6%** | **+8.9%** |

A few things jump out:

**Only the gentlest setting actually reduces real tokens.** Level 1 — filler-phrase
deletion, punctuation stripping, and a handful of word→symbol swaps, with vowel
elision and word-merging both switched off — is the *only* level that comes out ahead
on billed tokens. Every level from 2 up costs **more** real tokens than sending the
original sentence untouched, despite cutting anywhere from 15% to 54% of the
characters. "More aggressive" and "more expensive" point the same direction here.

**Character reduction climbs monotonically with level; token reduction does not, and
mostly runs backwards.** Level 3 is now the single worst performer on real tokens
(+27.7% cl100k, +30.2% o200k on average) despite level 4 cutting more characters. In
one individual sample, level 4 cost **+48.1% more cl100k tokens** than sending the
original, unshrunk sentence (27 tokens → 40). The word-merging stage (levels 2+)
deletes spaces and glues words into long unbroken strings; BPE has no learned merge
for `"theqrtrlyrportshwsrevnup12%drivnprmrilybygrwthinthentrprsesgmnthoghchurntickedupslightlyinsmb"`,
so it shreds the string into many small fallback tokens — you pay for more tokens to
say less.

**Level 5 (JDSL) blunts the damage, but doesn't undo it.** Once JDSL deletes every 4th
character indiscriminately, words are chopped down toward such short fragments that
the tokenizer's per-character/byte fallback becomes *more* uniform and somewhat
cheaper than levels 2–4 again — not because JDSL is smart about tokenization (it
deletes characters with zero awareness of token boundaries), but because sufficiently
destroyed text stops trying and failing to match longer vocabulary merges. It still
lands at +8.6%/+8.9% — worse than doing nothing — and it's also the least
human-readable output by a wide margin, so there's no tier where "very aggressive"
buys you anything real.

Level 1 — the setting that only strips filler phrases, punctuation, and a few very
common word→symbol swaps (`and → &`, `you → u`) — is the sole level that respects
tokenizer vocabulary boundaries closely enough to come out net negative on actual
billable tokens.

## What would actually reduce token spend

None of this is to say prompt/response compression is fake — it's a real, actively
researched area. It just doesn't work the way SHRNKR's pipeline (or most "compression"
gimmicks that operate on raw characters) implies. Approaches that actually move the
needle:

- **Prompt compression at the token/semantic level** (e.g. LLMLingua, Selective
  Context) — these rank tokens by how much a smaller reference model thinks they
  contribute to the prompt's meaning, and drop *low-information* tokens, not
  characters within every word. Crucially, they leave high-value tokens (and the
  tokenizer's preferred merges) intact.
- **Prompt caching** — providers now let you pay a fraction of the input-token price
  for a prompt prefix that's identical across repeated calls (system prompts, few-shot
  examples, long context). This is usually the single biggest real lever, and requires
  no destructive rewriting at all.
- **Reducing `max_tokens` / structured output constraints** — capping or shaping the
  *response* (JSON schemas, function calling, shorter format instructions) reduces
  billed output tokens directly, instead of hoping a mangled output string
  coincidentally tokenizes shorter.
- **Semantic deduplication / context pruning** — dropping whole redundant turns,
  documents, or retrieved chunks that don't affect the answer, rather than compressing
  every surviving chunk character-by-character.
- **Choosing a cheaper model for the task** — often a bigger cost lever than any
  prompt-side compression.

## The joke, restated with real numbers

SHRNKR's hero stat claims a flat **"38% avg. token reduction"**, and the pricing
section's worked example and testimonial both cite **41% at level 4**. Against the
current algorithm and real tokenizers, level 4 doesn't underperform that claim — it
runs in the *opposite direction*: **+23.1% more cl100k tokens, +27.1% more o200k
tokens**, on average, than sending the original text. The one level that comes
anywhere close to a real reduction is level 1, the setting SHRNKR's own UI treats as
the boring, unambitious tier. The demo is honest about being cosmetic (`CLAUDE.md`:
*"derived from string-length deltas, not any real tokenizer"*); this doc is the
receipts for why that distinction matters, and why a real version of this product
would need to compress tokens, not letters.
