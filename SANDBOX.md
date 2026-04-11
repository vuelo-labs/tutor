# Linguist Tutor

## What this is

This is the Linguist codebase. Not a tutorial project, not a training exercise — the actual site that runs at linguist.fyi, one version behind the live branch. You have it because you are a paying subscriber. When you run `claude` in this directory, Claude Code reads the CLAUDE.md file and works under its constraints. Those constraints are the same principles the course teaches. You are not just studying the course from the outside; you are working on the thing that teaches it.

## There is no finished state

The site is complete in the sense that it runs. It is not complete in the sense that there is nothing left to improve. Every module can be made clearer. Every exercise can be made sharper. New Without/With examples can be added from sessions you run yourself. The CLAUDE.md can be extended as you discover where it falls short. The work returns value indefinitely. There is no correct end state to reach, and no moment where the task is done.

## What is fixed and what is shaped by prompting

Some of this codebase is deterministic: the same input always produces the same output, and the right answer is knowable in advance.

The HTML scaffolding — headers, navigation bars, breadcrumbs, pagination — follows a fixed pattern across every module. The CSS system in `style.css` and `course/course.css` defines the visual language for the entire site. The JavaScript in `progress.js` and `profile.js` handles module completion tracking and learner profile state. The file and folder structure (`/course/b/`, `/course/e/`, `/course/a/`) is the permanent navigation backbone. You do not touch these unless something is broken.

Some of this codebase is AI-shaped: the right answer is not predetermined, and judgment is required throughout.

All prose content inside course modules is in this category. The voice and register. The Without/With examples that show the difference between a weak prompt and a strong one. The module structure (hero, body, exercise, Copy-Personalise-Use, What good looks like) is fixed as a pattern, but how that pattern is executed in each module is a matter of craft. The CLAUDE.md itself sits in an interesting middle position: the file is fixed, but its contents were shaped over time by session failures. Every instruction in it exists because something went wrong without it.

The middle ground is worth noticing. Course structure decisions — how many modules, what a module covers, how beginner connects to enabled — are not purely deterministic, but they are not freely improvable either. They have rationale behind them. The module objectives are written with specific precision. Changes to these should be deliberate.

## What productive work looks like

Fix a voice deviation in a module. The course has a specific register: plain, direct, no hedging, short paragraphs, no decorative punctuation. When a module drifts — sounds more like a blog post, uses "it's worth noting," runs sentences together that should be separate — that is something to fix. Read the module, identify the section that broke, rewrite it to match the register.

Add a Without/With example from a real session you ran. Without/With examples are the clearest teaching tool in the course. They show a real prompt, the output it produced, a stronger version of the prompt, and the better output. If you ran a session outside this codebase and found a prompt pair worth teaching, you can add it to the relevant module as a new example.

Improve an exercise. Exercises follow the Copy-Personalise-Use pattern. If the prompt in an exercise is too generic, too narrow, or points to a context most learners will not have, it can be improved. The test is whether a learner with no prior experience could copy it, change two details, and immediately find it useful.

Study the CLAUDE.md to write one for your own project. The CLAUDE.md in this repo was not written in one sitting. It grew from sessions where Claude Code did something wrong. Reading it with that history in mind — asking what failure each instruction was written to prevent — is the most direct way to learn how to write one for a different codebase.

Tighten the "What good looks like" section in any module. This is the section that tells learners what a successful output looks and feels like, so they know whether the AI actually helped. These sections are easy to write vaguely. Specific is better.

## Two practices developed during the real build

These are not in the course. They came from the build itself.

**Checkpoint text files.** At the end of a session, write the current state to `_session.md` in the root of this repo: what was completed, what constraints are active, what the next step is. Read it at the start of the next session before you do anything. This is more reliable than asking Claude Code to summarise because you control what gets written. The course teaches the checkpoint prompt — this is a better version of the same idea.

**Clear and reseed.** If a session goes wrong in the first few turns — decisions being made you didn't authorise, scope drifting — stop. Use `/clear`. Identify what the opening prompt missed. Write a corrected version that addresses the gap. Restart. Mid-session corrections compound the problem. A clean restart with a better seed is almost always faster.

---

## What not to do

Do not restructure the site, rename files, or alter the CSS system; the live site and every subscriber's copy depend on the existing structure staying intact.
