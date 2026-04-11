# HARVEST.md
Questions for the Linguist course creator — answer in order, in one sitting.

---

## How to use this document

Answer top to bottom. The earlier questions produce the content that no one else can supply — the session failures and the real constraints — so don't skip ahead to the easier ones.

---

## Level of detail guide

**Session questions:** rough is fine. No exact prompts, no timestamps. What you were working on and what went wrong is enough.

**Cost questions:** order of magnitude is enough. "More than I expected" and "about right" are valid answers.

**Deviations:** the consequence matters more than the detail of what went wrong. What did it cost you — time, rework, a module that had to be rewritten?

**Decisions:** the reason matters more than the decision itself. Why you chose something tells the reader more than what you chose.

---

## 1. Session failures

*These questions fill DEVIATIONS.md and the most honest parts of CLAUDE.md. They are the hardest to reconstruct later — answer these first.*

**1.1** Think of a session that ran too long. What were you working on, and what was the first sign something was off — a repeated correction, a response that felt slightly adrift, something else?
*(One session is enough. The sign matters more than the length. Feeds DEVIATIONS.md.)*

**1.2** Was there a constraint you set at the start of a session — a scope limit, a tone rule, a structural decision — that was quietly dropped later in the same session? What was the constraint, and when did you notice it was gone?
*(If you noticed mid-session, say so. If you only noticed in the output, say that instead. Feeds CLAUDE.md.)*

**1.3** Is there a checkpoint you wish you had taken? Not in general — specifically: before what task, in what session, would a checkpoint have saved you real time?
*(The task is more useful than a general principle. Feeds CLAUDE.md.)*

**1.4** Did you ever delegate a task to an agent that came back wrong? What did the brief miss — too vague, wrong scope, missing context about the course audience?
*(If it happened more than once, pick the clearest example. Feeds DEVIATIONS.md.)*

**1.5** Is there something you corrected three or more times in the same session? A structural pattern, a tone note, a formatting rule — something that kept slipping?
*(This is the most direct signal of what needs to be in CLAUDE.md. One example is enough.)*

---

## 2. Cost and scope

*These questions give the Substack posts their honesty and help future readers calibrate their own expectations.*

**2.1** Which session surprised you most on cost? What were you doing — was it a long generative session, a lot of back-and-forth correction, or something else?
*(Order of magnitude is fine: "much more than I expected" or "surprisingly cheap." Feeds Substack.)*

**2.2** Was there a point where you consciously decided to keep going despite knowing the session was long? What made you push through — were you close to finishing something, or did it feel like stopping would lose context you couldn't recover?
*(The reasoning matters here, not the outcome. Feeds Substack and DEVIATIONS.md.)*

**2.3** Did you ever stop a session early because the context felt too degraded to continue — responses going in circles, quality clearly dropping? If yes, what were you working on?
*(A yes or no is useful. A brief description is better. Feeds CLAUDE.md.)*

---

## 3. Build decisions

*These questions establish the history of the build — what came first, what was hard, and what you'd do differently.*

**3.1** What was the first thing you built with Claude Code on this site? Not the first thing you planned — the first thing you actually made.
*(One sentence is enough. Feeds Substack post on the build origin.)*

**3.2** Which module required the most passes to get right — the most rounds of revision before it felt like the rest of the course?
*(Name the module and, if you remember, what kept being wrong about it. Feeds DEVIATIONS.md.)*

**3.3** Was there a CLAUDE.md at any point during the original build? If not, when did you first wish there had been — what had just gone wrong?
*(If there was one, what was in it? If not, the moment of wishing is the interesting part. Feeds CLAUDE.md introduction.)*

**3.4** What's one decision that was made through conversation with Claude Code that you had to restate multiple times — a course structure choice, a naming convention, a pedagogical rule? What made it keep slipping?
*(The slipping is the story. Feeds CLAUDE.md and DEVIATIONS.md.)*

---

## 4. Voice and quality

*These questions find the weakest parts of the course — the places where the build shows through.*

**4.1** Is there a module you're not happy with — one that doesn't sound like the rest, or that you'd rewrite if you had another pass?
*(Name it and say what's wrong. One module is enough. Feeds DEVIATIONS.md.)*

**4.2** Is there a Without/With example in the course that felt invented rather than drawn from something real — something you wrote to fill the exercise rather than because it illustrated the point?
*(If yes, which module? The fact that it's invented matters more than which example. Feeds DEVIATIONS.md.)*

**4.3** What does the course get wrong about how Claude Code actually works in practice? Not a mistake — something the course simplifies or elides because it's too messy to teach cleanly?
*(This is the most valuable question in this section. Rough answer is fine. Feeds DEVIATIONS.md and Substack.)*

---

## 5. Substack and product

*These questions scope the documentation work beyond the sandbox repo.*

**5.1** What other Vuelo Labs projects will appear in the Substack? A brief list is enough — name and one-line description of each.
*(This shapes how the sandbox repo documents refer to the wider body of work. Feeds Substack planning.)*

**5.2** What's the one thing that happened during this build that you most want documented — the thing someone else building a course with Claude Code couldn't learn from anywhere else?
*(This is the lede for the most important Substack post. Answer this last, after the earlier questions have surfaced what's actually worth saying.)*
