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

## [Context] — Early sessions ran too long while learning context management

**Course says:** A-05 identifies context rot as the gradual degradation of Claude Code's working state in long sessions. The fix is checkpointing before it happens — not after symptoms appear. A-04 says one task per session, use /clear between phases.

**What happened:** Early sessions ran very long. The build was underway before the discipline of scoped sessions was established — context management was being learned through the build itself, not before it. The model had to be repeatedly reminded of styling decisions and structural rules that had been established earlier in the same session.

**Consequence:** Repeated corrections across multiple turns. Constraints re-established from scratch each time rather than surviving from the initial statement. The early modules took more passes than later ones — not because they were harder, but because the session discipline wasn't there yet.

**Module:** A-04: Session Hygiene / A-05: Context Awareness and Compaction

---

## [Cost] — Long bash output in the main thread was expensive and polluted context

**Course says:** A-07 (Tool Fluency) says to name the right tool for each task. A-08 says that tasks which are independent, produce evaluable output, and would generate noise in the main session are good candidates for delegation. Search tasks — grep, file scanning, directory traversal — are exactly that.

**What happened:** Early sessions ran search operations in the main thread. Long bash output — grep results, directory listings, file contents — accumulated in the context. This was expensive in two ways: the token cost of the output itself, and the context noise that followed, which crowded out other working memory and contributed to later compaction pressure. The pattern repeated until searching was moved to agent delegations.

**Consequence:** Higher cost per session than necessary, compaction pressure from large tool output, and a context that was harder to work in. Once search tasks were delegated to agents, the main session stayed cleaner and costs dropped.

**Module:** A-07: Tool Fluency / A-08: Agent Delegation and Briefing

---

## [Practice] — Checkpoint text files: a personal workaround the course doesn't teach

**Course says:** A-05 teaches manual checkpointing by asking Claude Code to summarise the current session state, then verifying that summary before continuing.

**What happened:** A different practice emerged during the build: writing state to a plain text file at the end of a session — current task, active constraints, decisions made, next step — so that it could be read back at the start of the next session. This is not the same as the A-05 checkpoint prompt. It bypasses Claude Code's summarisation entirely and relies on the creator to write the state themselves.

**Consequence:** More reliable than asking Claude Code to summarise, because the creator controls what gets written. More effortful, because it requires deliberate writing at the end of every session. The text file survived session boundaries in a way that Claude Code's context does not. This is a real technique — it just lives outside the course's formal vocabulary.

**Note for the sandbox:** The CLAUDE.md constraint "checkpoint before complex phases" can be satisfied either way — Claude Code's checkpoint prompt, or a written text file. The text file version is more reliable. Use whichever you'll actually do.

**Module:** A-05: Context Awareness and Compaction (extends / deviates from)

---

## [Hygiene] — Scope gaps in v1 seed prompt, cleared and reseeded

**Course says:** A-04 says to scope a session to a single task before you start. A-02 (Mental Model) says the opening seed is the highest-leverage message in any session — it sets the frame for everything that follows. A gap in the opening seed is a gap that compounds.

**What happened:** Several sessions began with a seed prompt that underspecified scope. When decisions started going in a direction that felt wrong — the model making choices the creator hadn't authorised — the session was cleared and restarted with a corrected prompt that addressed what had been forgotten the first time. Rather than correcting mid-session, the practice was to stop, identify the scope gap, fix the seed, and start fresh.

**Consequence:** Sessions that would have required many corrections mid-stream were replaced with one clean restart. The extra cost was the cleared session — but that cost was lower than the alternative. The pattern also trained a useful reflex: noticing when a session is going wrong early enough to restart, rather than pushing through and compounding the problem.

**Module:** A-02: Mental Model Refresher / A-04: Session Hygiene

---

## [Context] — Styling and tone constraints had to be restated repeatedly

**Course says:** A-05 is explicit: constraints expressed conversationally are exactly what compaction loses. A standing constraint needs to be stated as a standalone message before work begins, not as a correction mid-session. A-03 (CLAUDE.md) exists specifically to front-load constraints that would otherwise need repeating.

**What happened:** Styling decisions and tone rules were stated once, then had to be restated — sometimes multiple times within the same session. There was no CLAUDE.md during the early build. Constraints lived in the conversation and got lost when compaction fired. Tone and format were the most frequent repeats: the same note about register, the same instruction about paragraph length, the same structural preference — session after session.

**Consequence:** Every new session that touched content started with the same correction pass before useful work could begin. Modules in the early build reflect this — slightly inconsistent register, occasional structural drift — because the constraints weren't stable enough to hold across sessions.

**Module:** A-03: CLAUDE.md / A-05: Context Awareness and Compaction

---

## [Scope] — Course structure changed, then many changes stacked on top, reversal was painful

**Course says:** A-06 (Output Engineering) says to separate planning from execution — get a plan approved before anything is written. A-05 says to checkpoint before high-stakes phases. A structural decision about course organisation is exactly the kind of decision that needs a checkpoint: if you change your mind after ten sessions of work have been built on top of it, the reversal cost is all ten sessions, not just the one that made the decision.

**What happened:** Course structure was changed mid-build. Subsequent sessions built content on top of the new structure without the structural decision having been properly validated first. When a rollback was needed, all the changes made in between made the reversal complex and slow. No checkpoint had been taken before the structural change to establish what state was being changed from.

**Consequence:** The rollback required significantly more work than the original structural change. Every intermediate session had to be accounted for. The lesson was clear in retrospect — a checkpoint before a structural decision isn't bureaucracy, it's a recovery point.

**Module:** A-05: Context Awareness and Compaction (manual checkpointing) / A-06: Output Engineering (plan before execute)

---

## [Delegation] — Agents over-scoped, returned architecture recommendations instead of work

**Course says:** A-08 is explicit about scope: name what is in, name what is out. Without an explicit scope ceiling, an agent will interpret the task as broadly as the goal sentence allows. "Improve this section" is a goal. It is not a scope.

**What happened:** Several early agent delegations were over-scoped. Agents ran long and returned architectural recommendations and structural suggestions rather than executing the specified task. The brief had stated a goal without constraining the method or the output. Agents treated the task as an open analysis problem rather than a bounded execution task.

**Consequence:** Sessions ran long and output was unusable — the agent had done a different job than the one intended. Re-briefing or manual work replaced the delegation. The cost was the original agent session plus the rework, when a tighter brief would have produced usable output in one pass.

**Module:** A-08: Agent Delegation and Briefing (scope constraint)

---

## [Origin] — The experience came before the course

**Course says:** Nothing — this is a build origin note, not a deviation.

**What happened:** The starting point was not "I will build a course." It was a design idea: the human vs machine dichotomy, the warm and cool palette as a visual expression of two modes of thinking. The experience came first. The course content was built to inhabit that frame rather than the frame being designed to serve existing content. This is worth knowing because it explains decisions that might otherwise look arbitrary — the palette system, the mode language, the manifesto — those came from the original idea, not from a curriculum plan.

**Why it matters for the sandbox:** You are working inside a design that was shaped by a concept, not a content strategy. When something feels over-designed for a course site, that is probably why.

**Module:** N/A — context for the build

---

## [Difficulty] — Beginner course: approachable but keeping the pace up

**Course says:** Nothing directly — but A-06 (Output Engineering) and A-03 (CLAUDE.md) both speak to the problem of getting consistent register and calibration across many outputs.

**What happened:** The beginner modules required the most passes. The tension was specific: the audience has low confidence with technology, so the material needed to be genuinely approachable — but slowing down too much loses the learner before they reach the useful parts. Too fast, too jargon-heavy, and the course becomes another thing that assumed too much. Too slow, too reassuring, and it becomes condescending. Getting that calibration consistent across ten modules, across multiple sessions, without a CLAUDE.md holding the tone, took more rounds than any other part of the build.

**Consequence:** The beginner modules were revised more than any other stage. Some of that revision was substance; a significant amount was register correction.

**Module:** A-03: CLAUDE.md (a voice constraint file would have held calibration across sessions)

---

## [Missing tool] — No CLAUDE.md during the build — found spacing fix by accident

**Course says:** A-03 teaches CLAUDE.md as the mechanism for front-loading constraints that would otherwise need repeating across sessions. The course was built without one.

**What happened:** No CLAUDE.md existed during the original build. Constraints — voice, CSS conventions, structural rules — were restated session by session. One consequence was a persistent spacing problem: header spacing after removed `<hr>` elements was wrong, and repeated prompts asking Claude Code to find and fix the spacing produced nothing useful. The model couldn't locate the cause through prompting alone. The fix — adjusting `h2` margin-top in `course/course.css` — was found by accident, not through a systematic debugging session.

**Consequence:** An unknown amount of session time spent prompting for a fix that prompting couldn't produce. The fix was a two-line CSS change. The time cost was disproportionate because the debugging approach was wrong — asking the model to find something it couldn't reason to, rather than reading the CSS directly and searching for the cause.

**What this teaches:** Claude Code cannot always find what you're looking for through prompting alone. If a prompt-driven search fails twice, switch to a direct approach — read the file, search the code, find it yourself. Then tell Claude Code exactly what to change.

**Module:** A-03: CLAUDE.md (front-loading constraints) / A-07: Tool Fluency (knowing when to use a tool vs. do it yourself)

---

## [HARVEST] — Tasks done manually that could have been delegated

**Course says:** A-08 defines the delegation test: independent task, evaluable output, would generate noise in the main session. Tasks that pass all three are good candidates for delegation.

**What happened:** [HARVEST: identify tasks that were done in the main session but would have been better delegated. What was the task? Why wasn't it delegated — oversight, habit, or a reasonable judgement call? How much did it fill the main session with content that wasn't needed again?]

**Consequence:** [HARVEST: context noise in the main session, compaction pressure, output quality degradation downstream.]

**Module:** A-08: Agent Delegation and Briefing

---

## [Honest critique] — The course keeps the imagination down in favour of practicality

**Course says:** The course is structured around practical techniques — opening seeds, verb choice, constraints, tool naming, delegation briefs. Each module teaches something specific and repeatable. That is the point.

**What it misses:** Practicality has a cost. The techniques are taught as a path through a defined space, and learners who follow the path carefully may never discover what lies outside it. The course does not teach experimentation. It does not show what happens when you ignore the structure, push past the scope, give the model more latitude than the brief allows. Some of the most useful things you learn with Claude Code are found by breaking the rules, not following them — and the course has nothing to say about that.

**Why this is a real gap:** The course is built for people with low confidence. That audience needs guardrails. But guardrails that are never questioned become ceilings. A learner who completes all twenty-seven modules and treats the techniques as the limit of what is possible has been undserved by the course — not because the techniques are wrong, but because the course never signals that they are a floor, not a ceiling.

**What the sandbox can do about it:** The sandbox is unfinishable by design. There is no correct end state. A learner who starts improvising — adding things the course didn't ask for, trying approaches the CLAUDE.md doesn't cover, pushing against the constraints to see what breaks — is using it correctly. The CLAUDE.md enforces the floor. It should not feel like the ceiling.

**Module:** Course-wide — no specific module, but most visible in the Advanced Practitioner stage

---

## [HARVEST] — Tasks delegated that should have been done manually

**Course says:** A-08 is explicit: never delegate understanding. If you need to understand something — to learn it, develop a view on it, make a decision based on it — do it in your main session. Delegation done poorly gives you an expensive result you cannot assess.

**What happened:** [HARVEST: identify delegations where the output came back and the user couldn't evaluate whether it was correct. What was the task? What made it hard to assess? Was it delegated because it was genuinely delegatable, or because it seemed complex?]

**Consequence:** [HARVEST: was the output used anyway, unchecked? Was a second delegation required? What was the cost of delegating something that needed direct engagement?]

**Module:** A-08: Agent Delegation and Briefing (the delegation decision)

---

## [Thesis] — The point of the course is to use AI less

**Course says:** Nothing — this is never stated explicitly anywhere in the course. That is the gap.

**What the build taught:** The goal of learning to use AI effectively is not to use it more. It is to develop enough fluency that you know when not to reach for it — when the task is faster, better, or more honest done without it. A practitioner who has internalised the course techniques uses AI less than someone who hasn't, not more. Less because they know the cost. Less because they can see when the tool is the wrong one. Less because they've developed the judgment to distinguish tasks that warrant AI from tasks that don't.

**Why the course doesn't say this:** It's harder to sell a course by saying "after this, you'll use the tool less." But it's the true outcome for anyone who applies the material seriously. The mode-switch thinking — human mode, machine mode — is the beginning of this. The course teaches it but never names the destination.

**What this means for the Substack:** Every post documenting a real Vuelo Labs project is a case study in this. Not "here's how we used AI to build X" — but "here's what we used AI for, here's what we didn't, and here's how we knew the difference."

**Module:** Course-wide — the missing thesis statement
