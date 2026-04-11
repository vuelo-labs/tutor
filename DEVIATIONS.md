# DEVIATIONS.md

This is an honest log of where the real Linguist build deviated from the principles the course itself teaches. It is the most valuable document in this sandbox. Every entry here is a teaching moment that lived inside an actual build decision, not a hypothetical.

The course teaches this. The build did that. Here is what it cost.

---

## [Scope] — Skip-to-content links added then removed

**Course says:** A-04 (Session Hygiene) says to scope a session to a single task with a clear done state before you start. Front-load your constraints. If a task touches more than two or three files, separate plan from execution (A-06) — see the approach before it becomes action.

**What happened:** An accessibility audit recommended adding skip-to-content links across all 31 pages. A session was opened and the links were added across all 31 files. No plan step was taken. No validation question was asked — "should we confirm this with you before executing across all 31 files?" The user then asked to remove the links. A second agent session was spun up to undo the work.

**Consequence:** Two full multi-file agent passes — one to add, one to remove — for a net change of zero. Token cost of both passes, time spent reviewing the removal, and an extra session of accumulated context that served no purpose.

**Module:** A-04: Session Hygiene / A-06: Output Engineering (plan before execute)

---

## [Context] — CSS variable referenced before it existed

**Course says:** A-04 says to front-load constraints before work begins. A-05 (Context Awareness and Compaction) identifies constraints expressed conversationally as exactly the kind of thing that gets lost — or never established in the first place. The constraint "only use variables that already exist in the CSS system" is a project-specific rule that had to be stated to be enforced.

**What happened:** A new hover state was written using `var(--w-surface)`. That variable did not exist in style.css. The session had no standing instruction about which CSS variables were valid. The constraint was never stated. The error was only caught during a review of the output — not before the code was written.

**Consequence:** A correction pass was required. The hover state had to be rewritten. More importantly, the variable could have propagated to other files before anyone noticed if the review had been less careful.

**Module:** A-04: Session Hygiene (front-load constraints) / A-05: Context Awareness and Compaction

---

## [File context] — Paragraph inserted into the wrong file

**Course says:** A-05 describes context rot: as a session runs long, Claude Code loses track of what was established earlier. One symptom is that it starts operating on the wrong thing — a different file, a different section, a different scope. The fix is checkpointing before complex phases and watching for drift.

**What happened:** A new paragraph was written for the manifesto page. The session inserted it into `/download/index.html` — the print version — instead of `/manifesto/index.html`. The user was viewing the manifesto at the time. The session had drifted from the correct file context. The error was not caught until the user checked the live site. A second insertion was required to put the paragraph in the right place.

**Consequence:** One extra insertion pass. More significantly, a paragraph existed in the wrong file until caught — if the download page had gone to print, the paragraph would have appeared in the wrong document.

**Module:** A-05: Context Awareness and Compaction (context rot, file-level drift)

---

## [Hallucination] — A-08 referenced a module that doesn't exist

**Course says:** A-04 says to front-load constraints before work begins. The constraint "do not reference modules that do not exist" is easy to state and costs nothing. A-08 is the final module in the Advanced Practitioner track — it needed to reference what comes next.

**What happened:** The closing paragraph of A-08 directed learners to continue to "X-01: API Fundamentals." No such module exists. The course does not have an X-series. This was a hallucination of future content — the model generated a plausible-sounding next step and named it confidently. A correction pass was required to remove the reference.

**Consequence:** One correction pass. The real cost is reputational: a learner who reaches the end of A-08 and looks for X-01 finds nothing. It breaks trust in the course's internal navigation.

**Module:** A-04: Session Hygiene (front-load constraints) / A-08: Agent Delegation and Briefing (brief completeness)

---

## [Assumptions] — Cloudflare Pages not auto-deploying from git push

**Course says:** A-04 says to validate your environment assumptions before a session begins, not during. Assumptions about the environment are exactly the kind of constraint that needs to be established upfront — if you assume deployment works a certain way and it does not, every deploy in the session is wrong until someone notices.

**What happened:** The session assumed that git push would trigger an automatic deploy on Cloudflare Pages. It did not. Manual `npx wrangler pages deploy` was required for every deploy throughout the build. The assumption was never validated at the start of any session. The mismatch was discovered by noticing that pushes weren't reflected on the live site.

**Consequence:** Every session that included a deploy step had a broken mental model of how deploys worked. Time spent waiting for deploys that didn't happen. Repeated manual intervention that could have been handled once as a standing procedure if the environment had been validated first.

**Module:** A-04: Session Hygiene (validate environment assumptions before starting)

---

## [HARVEST] — Sessions that ran too long and accumulated context rot

**Course says:** A-05 identifies context rot as the gradual degradation of Claude Code's working state in long sessions. Symptoms: re-asked questions, constraint drift, wrong file names, vague responses where earlier responses were precise. The fix is checkpointing before it happens.

**What happened:** [HARVEST: identify which sessions ran long enough that compaction fired. Note any specific symptoms — did Claude Code re-ask something that had already been answered? Use the wrong file name? Violate a constraint established earlier? Which module or section was being built?]

**Consequence:** [HARVEST: what did the context rot cost — extra turns, rework, wrong output that made it into a file?]

**Module:** A-05: Context Awareness and Compaction

---

## [HARVEST] — Real token costs that surprised

**Course says:** A-01 (Cost, Tokens, and What Things Cost) gives benchmark costs for common operations. The point is to build intuition about cost before it surprises you. Surprises mean the cost model was wrong.

**What happened:** [HARVEST: identify sessions with unexpectedly high token costs. Note the session, the task, the rough token amount if known. What was the mismatch between expected and actual cost? Was it a large file read? A multi-file agent pass? A delegation that ran wider than expected?]

**Consequence:** [HARVEST: total unexpected spend, or specific sessions where cost exceeded expectation significantly.]

**Module:** A-01: Cost, Tokens, and What Things Cost / A-08: Agent Delegation and Briefing

---

## [HARVEST] — Constraints expressed conversationally then violated

**Course says:** A-05 is explicit: constraints expressed conversationally — "yeah, probably don't do that" — are exactly what compaction loses. A standing constraint needs to be stated as a standalone message, not as a reply buried in a longer exchange.

**What happened:** [HARVEST: identify constraints that were established conversationally and then violated in a later turn. What was the constraint? How was it expressed? When did it get violated? Was the violation caught immediately or later?]

**Consequence:** [HARVEST: what did the violation cost — rework, a correction pass, output that had to be undone?]

**Module:** A-04: Session Hygiene (front-load constraints) / A-05: Context Awareness and Compaction

---

## [HARVEST] — Checkpoints not taken before something went wrong

**Course says:** A-05 teaches manual checkpointing — asking Claude Code to summarise the current state before a complex or high-stakes phase, verifying the summary, and correcting it before continuing. A corrected checkpoint costs one turn. Uncorrected drift can cost many.

**What happened:** [HARVEST: identify moments where a checkpoint would have caught something before it went wrong. Which session, which task, what was the turning point? What would a checkpoint have revealed if it had been taken?]

**Consequence:** [HARVEST: what did the missing checkpoint cost — wrong output across multiple files, a constraint that had drifted, a completed phase that needed to be redone?]

**Module:** A-05: Context Awareness and Compaction (manual checkpointing)

---

## [HARVEST] — Agent briefs that failed or returned wrong scope

**Course says:** A-08 says a subagent starts with zero context. Brief it the way you would brief a capable colleague who has just walked into the room with no background. A brief without explicit scope will return output that is broader, narrower, or differently shaped than what was intended.

**What happened:** [HARVEST: identify agent delegations that returned the wrong scope or format. What was the brief? What did the agent return? What part of the brief was underspecified — goal, context, scope, output format, or length target?]

**Consequence:** [HARVEST: was the output usable? Did it require a correction pass or a full re-delegation? What did the extra cost amount to?]

**Module:** A-08: Agent Delegation and Briefing

---

## [HARVEST] — Tasks done manually that could have been delegated

**Course says:** A-08 defines the delegation test: independent task, evaluable output, would generate noise in the main session. Tasks that pass all three are good candidates for delegation.

**What happened:** [HARVEST: identify tasks that were done in the main session but would have been better delegated. What was the task? Why wasn't it delegated — oversight, habit, or a reasonable judgement call? How much did it fill the main session with content that wasn't needed again?]

**Consequence:** [HARVEST: context noise in the main session, compaction pressure, output quality degradation downstream.]

**Module:** A-08: Agent Delegation and Briefing

---

## [HARVEST] — Tasks delegated that should have been done manually

**Course says:** A-08 is explicit: never delegate understanding. If you need to understand something — to learn it, develop a view on it, make a decision based on it — do it in your main session. Delegation done poorly gives you an expensive result you cannot assess.

**What happened:** [HARVEST: identify delegations where the output came back and the user couldn't evaluate whether it was correct. What was the task? What made it hard to assess? Was it delegated because it was genuinely delegatable, or because it seemed complex?]

**Consequence:** [HARVEST: was the output used anyway, unchecked? Was a second delegation required? What was the cost of delegating something that needed direct engagement?]

**Module:** A-08: Agent Delegation and Briefing (the delegation decision)
