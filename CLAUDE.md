# CLAUDE.md — Linguist Sandbox

This file is not documentation. It is a set of active constraints for every session in this repo. Read it before you start, and restate any relevant section when a session drifts.

---

## What this project is

Linguist is an AI literacy course delivered as a plain HTML/CSS website with no framework, no build step, and no compilation. Every file you edit is the file the browser reads. If you change a class name and nothing updates, the browser is already showing you the result — there is no cache layer to blame.

---

## Voice and register

Write in plain, direct prose. No hedging, no filler phrases like "certainly" or "great question", no padding that delays the point.

The register is serif — reads like considered writing, not a checklist. Short paragraphs. Three sentences maximum.

Use second person throughout. "You open the file" not "the learner opens the file" or "users should open the file."

> [ANNOTATION: Voice drift is the most common failure in long sessions. It starts subtly — an extra sentence here, a softening phrase there — and within a few exchanges the output reads like product documentation. If you notice this happening, stop and restate this section as a standalone message before continuing. Maps to module A-05.]

---

## CSS system — do not invent

Use only CSS variables already defined in `style.css` or `course/course.css`. The full set of custom properties is:

**Warm palette** (site-wide): `--w-bg`, `--w-bg-card`, `--w-bg-input`, `--w-border`, `--w-border-focus`, `--w-text`, `--w-muted`, `--w-faint`, `--w-accent`, `--w-accent-soft`, `--w-accent-light`

**Cool palette** (advanced stage): `--c-bg`, `--c-bg-card`, `--c-bg-inner`, `--c-border`, `--c-text`, `--c-muted`, `--c-faint`, `--c-accent`, `--c-accent-soft`, `--c-accent-light`

**Typography**: `--serif`, `--mono`, `--sans`

**Spacing**: `--space-xs`, `--space-sm`, `--space-md`, `--space-lg`, `--space-xl`, `--space-2xl`

**Layout**: `--max-width`, `--max-width-wide`

Do not create new variables without explicit instruction. Do not add inline styles — use or extend the existing class system.

> [ANNOTATION: An invented variable produces no error. The browser ignores it silently and the element falls back to its default styles or nothing at all. You won't see the problem until you look at the page. Restate this constraint at the start of any session that involves CSS. Maps to module A-03.]

---

## File and folder conventions

Course modules live at `/course/[stage]/[number]/index.html` where stage is `b` (beginner), `e` (enabled), or `a` (advanced). Examples: `/course/b/01/index.html`, `/course/a/09/index.html`.

Do not rename files. Do not restructure folders. The site has no router — the URL is the path. A renamed file is a broken link.

> [ANNOTATION: There is no undo for a structural change except git. Before any write operation, confirm the exact file path aloud. If you are not certain, check the folder first. Maps to module A-06: plan before you execute.]

---

## Content constraints

Do not reference modules, tracks, or features that do not exist in the current file structure. Do not invent titles for future content — "coming soon" is acceptable, a specific module name is not.

Do not make claims about course content in one module that contradict another module unless you have read both.

> [ANNOTATION: Invented module references are the hardest errors to catch because they sound plausible. Two sessions passed before one was found in this project. The check is simple: if you are about to name a module, verify it exists. Restate this constraint before any module-writing session. Maps to module A-03.]

---

## Session hygiene

One task per session. Use `/clear` between distinct phases of work — for example, between writing content and editing CSS.

If a session has produced substantive output for more than two separate tasks, it is too long. Stop, checkpoint, and start fresh.

> [ANNOTATION: This repo has 27 modules across three stages. A session that touches files in more than one stage or more than three separate modules has probably lost scope. The output may still look fine — that is the danger. Maps to module A-04.]

---

## Checkpointing

Before editing any module that references another module, restate the active constraints for both. Cross-module consistency — a concept introduced in one place and contradicted or mislabelled in another — is the failure mode that survives the longest undetected.

> [ANNOTATION: Context compaction in a long session quietly drops earlier constraints. The model continues confidently. Checkpointing is not a formality — it is the only reliable way to catch what has been forgotten. Maps to module A-05.]

---

## What requires human approval before execution

Do not proceed with any of the following without explicit confirmation:

- Any change to `style.css` or `course/course.css`
- Any new section added to an existing module, or structural reorganisation of a module
- Any content that makes a claim about how Claude Code works — capability, behaviour, or limitation

These are not suggestions. If you are about to do one of these things, stop and ask.

---

## Harvest — constraints we still need to write

The following are placeholders for constraints that came from real session failures. Fill them in when the relevant history is documented.

- [HARVEST: What specific content was invented in the two sessions before it was caught? Which module and what was the false reference? That detail will sharpen the constraint above.]

- [HARVEST: Was there a session where a CSS class was created that duplicated an existing one under a different name? If so, what was the pattern — and should there be a "check before you create" rule for classes as well as variables?]

- [HARVEST: Has a module pagination link ever been written pointing to a module number that didn't exist yet? If so, that needs its own constraint in the file and folder section.]

- [HARVEST: Was there a session where the wrong stage palette was applied to a module — warm variables used in an advanced-stage page or vice versa? If so, the CSS section needs a note about palette scope.]
