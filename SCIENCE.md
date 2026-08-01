# The Actual Science (a non-satirical appendix)

SHRNKR is satire — a parody of token-cost-optimization middleware. But the underlying
question is a real one people actually ask about tools like this: **if you shrink a
prompt's character count, does the token count billed by the model provider go down
by a comparable amount?**

Short answer: no, not reliably, and sometimes it goes up. This doc explains why, with
real numbers from a real tokenizer, not the cosmetic string-length math the live demo
uses (see `README.md` / `CLAUDE.md` — the demo's stats are explicitly not real token
counts).

## The core misunderstanding

LLM billing is based on **tokens**, not characters. Tokens come from a Byte Pair
Encoding (BPE) vocabulary trained on huge corpora of *normal* text. That vocabulary
already contains merges for common whole words and word-fragments — `"your"`,
`"please"`, `"information"`, `" the"` (with the leading space), `"tion"`, `"ing"`, etc.
are frequently single tokens or small fixed groups of tokens, because they occur
constantly in the training data.

Deleting characters (vowels, "every 4th character") or substituting slang
(`your → ur`, `please → pls`) does two things at once:

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
business-email-style sample sentences, using a seeded RNG for reproducibility. Output
was tokenized with two real OpenAI tokenizer vocabularies via the
[`gpt-tokenizer`](https://www.npmjs.com/package/gpt-tokenizer) package:

- `cl100k_base` (GPT-3.5 / GPT-4 generation)
- `o200k_base` (GPT-4o generation)

This is a one-off analysis — `gpt-tokenizer` is **not** a project dependency and isn't
installed anywhere in this repo. To reproduce, install it in a scratch directory,
`require()` `js/shrink.js` from there (it's DOM-free by design, see `CLAUDE.md`), and
encode the before/after strings.

## Results

Aggregate across all five samples, token counts relative to the unshrunk original:

| Level | Avg. char reduction | cl100k token Δ | o200k token Δ |
|---|---|---|---|
| 1 — Garlic Press | −38% | **−28.1%** | **−29.2%** |
| 2 — Panini Press | −40% | −18.5% | −22.5% |
| 3 — Vacuum Sealer | −52% | −2.2% | −10.1% |
| 4 — Pressure Cooker | −60% | −2.8% | −10.7% |
| 5 — Meat Grinder | −70% | −25.3% | −33.1% |

Two things jump out:

**Character reduction climbs monotonically with level; token reduction does not.**
Levels 3 and 4 — the "more aggressive" middle tiers — are the *worst* performers on
actual billable tokens, despite cutting far more characters than level 1. In one
individual sample, level 3 cost **+34% more cl100k tokens** than sending the original,
unshrunk sentence. The word-merging stage (levels 3+) deletes spaces and glues words
into long unbroken strings; BPE has no learned merge for `"achncetolk@thepropsal"`, so
it shreds the string into many small fallback tokens — you can end up paying for more
tokens to say less.

**Level 5 (JDSL) partially recovers, but by accident, not by design.** Once JDSL
deletes every 4th character indiscriminately, words are chopped down toward such short
fragments that the tokenizer's per-character/byte fallback becomes *more* uniform and
somewhat cheaper again — not because JDSL is smart about tokenization (it deletes
characters with zero awareness of token boundaries), but because sufficiently
destroyed text stops trying and failing to match longer vocabulary merges. This is
also why level 5's output is the least human-readable by a wide margin.

Level 1 — the *gentlest* setting, which only strips filler phrases, punctuation, and a
handful of very common word→symbol swaps (`and → &`, `you → u`) — is consistently
among the best actual token-reduction levels, because filler-phrase deletion and
common-word symbol swaps are the only stages that respect tokenizer vocabulary
boundaries at all.

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

SHRNKR's hero stat claims a flat **"38% avg. token reduction"** and the pricing
section's worked example uses **41% at level 4**. The actual measured number at level
4, on realistic text, against real tokenizers, is **~3–11%** — worse than level 1, and
in the wrong direction from what "more aggressive" implies. The demo is honest about
being cosmetic (`CLAUDE.md`: *"derived from string-length deltas, not any real
tokenizer"*); this doc is the receipts for why that distinction matters, and why a real
version of this product would need to compress tokens, not letters.
