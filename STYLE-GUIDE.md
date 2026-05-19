# Site Style Guide

This guide governs all written content on `sam-loiterstein.com`. It builds on `AI-Policy.md` and `config-tone.txt`. The policy is the floor. The tone file defines register. This guide adds project-specific rules and conventions on top.

When this guide and the policy conflict, the policy wins. When two guide rules conflict, follow the order in `AI-Policy.md` section 8.

---

## 1. Scope

Applies to:

- Site copy under `client/src/data/content.ts`
- Hardcoded UI strings in `client/src/components/**`
- Form validation messages and toast text
- Server log messages and API error strings
- SEO metadata in `client/index.html`
- Repository documentation: `README.md`, `STYLE-GUIDE.md`, `AI-Policy.md`

---

## 2. Punctuation Conventions

Inherits all rules from `AI-Policy.md` section 2. In addition:

### 2.1 Date ranges
Use the word `to` between years.

- Correct: `2024 to 2025`, `2025 to Present`
- Incorrect: `2024 — 2025`, `2024 – 2025`

### 2.2 Separators in lists and metadata chrome
Use commas in prose. Use periods between short metadata fragments. Avoid the interpunct (`·`), bullets (`•`), and the multiplication sign (`×`) in copy.

- Correct: `Washington, DC. Open to new engagements.`
- Incorrect: `Washington, DC · Open to new engagements`

### 2.3 Range and connector words inside copy
Replace dash-as-connector with `to`, `and`, or a comma.

- Correct: `Nexus Consulting, JamBase, and George Washington University`
- Incorrect: `Nexus Consulting · JamBase · George Washington University`

### 2.4 Apostrophes and quotes
Use straight ASCII apostrophes (`'`) and quotes (`"`). Avoid curly quotes inside strings unless the file is intentionally typeset.

### 2.5 Ellipsis
Avoid trailing ellipsis (`…` or `...`) in body copy. Loading states may use `Sending` rather than `Sending…`.

---

## 3. Voice and Tone

Inherits `AI-Policy.md` section 3 and `config-tone.txt`. Site-specific defaults:

- First person singular: `I`. Never `we` (single founder voice).
- Address the reader as `you` only when describing services. Avoid generic `you` framing in About copy.
- Avoid filler greetings. The Hero introduction is the only place a direct greeting appears.

---

## 4. Structural Language

Inherits `AI-Policy.md` section 4. Additional site rules:

- No headings phrased as questions, except inside a CTA prompt where a single short question is allowed.
- No sentence may begin with `Just`, `Honestly`, `Actually`, or `Look,`.
- Section titles are noun phrases or short declarative sentences. They end with a period only when they are full sentences.

---

## 5. Objectivity and Content Framing

Inherits `AI-Policy.md` section 5. Banned in copy:

- Evaluative adjectives applied to self: `successful`, `passionate`, `world-class`, `top`, `award-winning`, `best`, `premier`, `select` (when used to imply prestige).
- Marketing intensifiers: `truly`, `seamlessly`, `effortlessly`, `simply`, `just`.
- Hype language: `disrupting`, `revolutionizing`, `unlocking`, `cutting-edge`.
- Self-comment phrases: `excited to`, `humbled by`, `lucky enough`, `proud to`.

Allowed factual modifiers when verifiably accurate: `early stage`, `student powered`, `scaled to N`, `200+`, `live`, `published`.

---

## 6. Numbers and Units

- Use digits for all quantities (`6`, `200+`, `$51M+`).
- Use a `+` suffix to indicate `at least`. No spaces (`200+`, not `200 +`).
- Currency uses `$` prefix and `M` or `K` suffix without spaces (`$51M+`).
- Spell out single-digit counts only inside narrative prose where digits would feel jarring. Within stat strips, dashboards, and labels, always use digits.

---

## 7. Capitalization

- Section titles and section eyebrows use sentence case.
- Proper nouns retain their canonical casing (`The George Washington University`, `Salesforce`, `HubSpot`, `LinkedIn`, `Vrije Universiteit Amsterdam`).
- Acronyms stay all caps (`GTM`, `CRM`, `MVP`, `RevOps`, `BS`, `JCRC`).
- Job titles inside timeline entries use Title Case (`Co-Founder and CEO`, `Revenue Operations Intern`).

---

## 8. Lists and Bullets

- Bullets do not end in periods unless the bullet contains more than one sentence.
- Bullets begin with a noun phrase or imperative verb. Mixing the two within a single list is not allowed.
- Tag pills (project tags, media types, insight tags) are short noun labels in Title Case (`Product`, `Operations`, `RevOps`).

---

## 9. CTAs and Buttons

- Button labels use sentence case verb phrases: `Contact`, `Send message`, `Open LinkedIn`, `Download Resume PDF`, `View Work`.
- Avoid filler verbs (`Click here`, `Submit`, `Go`).
- The same action uses the same label across the site. `Contact` is the canonical inquiry CTA. `Open LinkedIn` is the canonical LinkedIn CTA.

---

## 10. Form Copy

- Field labels use Title Case (`Name`, `Email`, `Message`).
- Placeholder text is short and instructive, not promotional.
- Validation messages are direct: state the issue, then the corrective action.

  - Correct: `Email is required.`
  - Correct: `Please provide a valid email.`
  - Incorrect: `Whoops, looks like that email is not valid.`

- Success and error states are single short declarative sentences. No exclamation marks.

---

## 11. SEO and Metadata

- The `<title>` is the canonical name and a short positioning statement, separated by a period.
- The meta description is one declarative sentence under 160 characters.
- Open Graph and Twitter card titles match the `<title>` exactly.

---

## 12. Editing and Enforcement

- All site-visible copy lives in `client/src/data/content.ts` whenever possible.
- Pull requests that introduce em dashes, en dashes, interpuncts, or banned phrasing are not merged until rewritten.
- Generated copy from any AI tool must be reviewed against `AI-Policy.md`, `config-tone.txt`, and this guide before being committed. The tool's output is not exempt from review.
