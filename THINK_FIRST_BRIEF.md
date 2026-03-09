# Think First — Website Build Brief

## For Claude Code: Build this as a production-ready static site deployable to Netlify.

---

## 1. PRODUCT VISION

**Think First** is a personalised, AI-native learning engine that teaches structured thinking — the foundational skill that makes every AI tool useful. It works across all ages (4 to adult) and capability levels, adapting dynamically to each user.

### The Problem
AI natives are learning to use AI before they learn to think. If you can't decompose a messy idea into structured steps, you can't direct an agent — you just accept whatever the machine gives you. This gap isn't technical literacy. It's cognitive infrastructure. And it affects everyone: a 10-year-old asking ChatGPT for homework answers and a CEO who can't articulate their decision-making criteria have the same root deficit.

### What Think First Is
A learning engine that:
- **Assesses your capability** across 7 core thinking skills, each with 10 levels
- **Generates exercises dynamically** via AI — no static content library, infinite personalised challenges
- **Delivers training proactively** via Slack, WhatsApp, or web at the moment you're cognitively sharpest
- **Builds a cognitive profile** over time — learning when you think best, which skills need work, and how you progress
- **Adapts to any ability level** — a 5-year-old taps picture bubbles, a teenager types structured arguments, an executive gets 60-second decision challenges between meetings

### The 7 Core Skills (one framework, all levels)
1. **Clarity** — turning vague thoughts into precise questions
2. **Decomposition** — breaking problems into parts
3. **Relationships** — seeing how parts connect (the hardest skill — where humans skip and machines can't)
4. **Outcome Definition** — knowing what "done" looks like
5. **Gap Analysis** — finding what's missing between here and there
6. **Procedural Thinking** — writing steps a literal machine can follow
7. **Evaluation** — knowing if the output is good

These are the same skills at every level. A 4-year-old learning to sort sandwich ingredients and a VP structuring an acquisition proposal are on the same skill tree — different levels, same framework.

### How It Adapts

| Level | Input Mode | AI Persona | Exercise Length |
|-------|-----------|------------|----------------|
| L1-2 | Tappable bubbles, pictures | Bolt — literal, supportive, refuses vague input | 30-60 seconds |
| L3-4 | Bubbles + typing | Vector — deliberately fallible, tests critical thinking | 60-90 seconds |
| L5-6 | Typing primary | Vector advanced — adversarial, introduces ambiguity | 2-3 minutes |
| L7-8 | Full text, multi-step | Prism — Socratic, switches roles (mentor/critic/examiner) | 3-5 minutes |
| L9-10 | Open-ended, multi-agent | Prism advanced — simulates multi-stakeholder scenarios | 5-10 minutes |

### The Timing Intelligence (Key Differentiator)
The system doesn't wait for users to log in. It reaches out at optimal moments:
- **Discovery phase (weeks 1-2):** Messages at varied times, measures response quality, speed, and engagement by time of day
- **Optimised phase (week 3+):** Delivers hard-skill training when the user is sharpest, creative exercises when they're relaxed, and never during dead zones
- **Ongoing:** Continuously updates the cognitive rhythm model. Detects when schedules shift.

At scale, this timing data becomes a moat — anonymised insights on when humans think best, publishable research, employer team analytics.

### Who It's For

| Audience | Context | Entry Point |
|----------|---------|------------|
| Children (4-12) | Schools, parents, after-school | Web app with bubble interface, parental dashboard |
| Teenagers (13-18) | Self-directed, school programmes | Slack/Discord/WhatsApp bot, proactive delivery |
| University / Early Career (18-24) | Students, bootcamps, grad schemes | Web + messaging, project-based exercises |
| Corporate (25+) | L&D teams, exec coaching, team development | Slack bot, never called "training" — positioned as decision support |

### The Bigger Play
Think First is application #1 on a generalised engine. The engine itself is a personalised, timing-aware, AI-native LMS that generates its own content for any skill domain. After proving the engine with structured thinking, it extends to: sales methodology, clinical reasoning, language learning, compliance training — any skill schema plugged into the same engine. The course is the proof. The engine is the product.

---

## 2. WEBSITE REQUIREMENTS

### Type
Single-page landing site. Static HTML/CSS/JS. No framework needed.

### Goal
**Validate demand + capture signups** across multiple audience segments. This is the front door — the Slack bot and web app come after.

### Target Audience (in priority order)
1. **Parents** of children 4-12 who worry about screen time / AI dependency
2. **Educators** (teachers, school administrators) looking for AI-age curriculum
3. **L&D / People Ops** in companies who need to upskill teams on AI-era thinking
4. **Individual adults** who want to think more clearly and use AI more effectively
5. **University programme directors** looking for supplementary cognitive skills training

### Sections (top to bottom)

**Hero**
- Bold headline: something that captures "learn to think before you learn to prompt" — the insight that structured thinking is the skill underneath every AI skill
- Subheadline: 1-2 sentences. Personalised, adaptive, meets you where you are.
- Email capture form with a dropdown or toggle: "I'm signing up as: Parent / Educator / Professional / Individual"
- No fluff, no stock imagery

**The Problem**
- AI is everywhere. The skill to use it well isn't technical — it's thinking clearly
- The gap: people at every age accept AI output without being able to evaluate, direct, or override it
- The cost of the gap: a generation that can prompt but can't think. Professionals who delegate decisions they don't understand. Kids who never develop independent reasoning.
- Make it feel urgent without being alarmist

**The Framework**
- The 7 skills, presented simply. Not as a curriculum — as a map of how clear thinking works
- Show that it's the same framework for a 6-year-old and a 40-year-old — the level changes, not the skill
- Brief example: "A child learns to break a sandwich recipe into steps. An executive learns to break a strategy into testable decisions. Same skill. Same framework. Different stakes."

**How It Works**
- Adaptive assessment: 5 minutes, conversational, places you on each skill independently
- Dynamic content: AI generates exercises tailored to your level, context, and goals. No static lessons.
- Proactive delivery: training comes to you via Slack, WhatsApp, or web — at the time you think best
- Continuous profiling: the system learns your cognitive rhythm and gets sharper over time
- Keep this section tight. 4 punchy points, not a product walkthrough.

**For Parents & Educators**
- How it works for kids: tappable bubbles, age-appropriate scenarios, no typing required for young learners
- The AI adapts: a literal robot that refuses vague questions (Bolt persona for younger levels)
- What parents/teachers see: progress dashboard, skill radar, session history
- Position as: "The thinking skills curriculum for the AI age"

**For Teams & Organisations**
- Delivered via Slack. Never called "training." Positioned as decision support.
- 60-second micro-challenges between meetings. Fits into the workday, doesn't compete with it.
- Team-level insights: where your team's thinking is strong, where it breaks down
- Position as: "The skill that makes every other AI investment pay off"

**The Vision**
- Where this is going: a cognitive profile that compounds across applications. Switch from thinking skills to sales methodology — the engine already knows how you learn.
- Timing intelligence that tells you when you think best (and helps you schedule accordingly)
- Keep it aspirational but grounded. 3-4 sentences max.

**Email Capture (repeated)**
- Second CTA: "Join the early access list"
- Same form with segment selector (Parent / Educator / Professional / Individual)

**Footer**
- Minimal: copyright, "Built in Dublin"

### Email Capture Implementation
Use **Netlify Forms** — zero backend. The segment selector (Parent/Educator/Professional/Individual) is critical for follow-up targeting.

```html
<form name="waitlist" method="POST" data-netlify="true" netlify-honeypot="bot-field">
  <input type="hidden" name="form-name" value="waitlist" />
  <p class="hidden"><label>Don't fill this out: <input name="bot-field" /></label></p>
  <input type="email" name="email" placeholder="your@email.com" required />
  <select name="segment" required>
    <option value="" disabled selected>I'm signing up as...</option>
    <option value="parent">Parent</option>
    <option value="educator">Educator</option>
    <option value="professional">Professional / Team Lead</option>
    <option value="individual">Individual</option>
  </select>
  <button type="submit">Get Early Access</button>
</form>
```

---

## 3. DESIGN DIRECTION

### Aesthetic
**Warm, intelligent, human.** This isn't a cold tech product. It's about thinking — the most human thing there is. Think: Montessori meets editorial design. Clean but warm. Structured but not clinical.

The site needs to feel trustworthy to a parent AND credible to a VP of L&D. That's a narrow band — no childish illustrations, no corporate blandness.

### Specifics
- **Typography**: Distinctive serif for headlines (e.g., Fraunces, Literata, or Newsreader from Google Fonts — something with personality and warmth). Clean sans-serif for body (e.g., DM Sans, Plus Jakarta Sans). Strong hierarchy. NOT Inter, Roboto, or system fonts.
- **Colour palette**: Warm and grounded. Deep warm charcoal or slate as primary text. Warm off-white or light cream background. Accent colour that signals thinking/intelligence without defaulting to blue — consider warm amber, terracotta, or deep sage green. Second accent for contrast. No purple gradients. No neon.
- **Layout**: Generous whitespace. Content-led — the words and framework are the star. The 7-skill framework could be visualised as a subtle radar chart or simple grid, but typography carries the weight.
- **Motion**: Subtle scroll-triggered fade-ins. The 7 skills could animate in sequence. Nothing bouncy. Things arrive with quiet confidence.
- **Imagery**: Minimal to none for v1. If anything, a single geometric motif — perhaps a subtle node/connection pattern that evokes "structured thinking" without being a cliché brain or circuit board.
- **Mobile-first**: Must be excellent on phone. Parents check on mobile. L&D people forward links from mobile.

### What to AVOID
- Generic SaaS landing page templates
- Anything that looks like an edtech startup from 2019 (bright primary colours, cartoon characters)
- "AI-powered" visual clichés (glows, gradients, circuit patterns, robot imagery)
- Childish design — the product adapts to children, but the website sells to parents and professionals
- Dark mode / hacker aesthetic
- Stock photos of any kind

---

## 4. TECHNICAL SPEC

### Stack
- Pure HTML + CSS + vanilla JS
- Single `index.html` file (or at most: index.html + style.css + script.js)
- Google Fonts loaded via `<link>` tags
- No build step, no bundler, no framework
- Responsive via CSS media queries

### Deployment Target: Netlify
- Static site, free tier, auto-deploys from GitHub
- Netlify Forms for email capture (zero backend)
- Free SSL, global CDN, custom domain support

### File Structure
```
/
├── index.html
├── style.css
├── script.js (scroll animations, form handling)
├── netlify.toml
└── README.md
```

### netlify.toml
```toml
[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### Performance
- Lighthouse 95+ on all metrics
- No JS required for core content (progressive enhancement)
- Total page weight under 200KB
- First contentful paint under 1s

---

## 5. COPY TONE

- **Warm and confident.** Not salesy. Not academic. Like a thoughtful person explaining something they care deeply about.
- **Inclusive across audiences.** A parent and a VP should both feel this is for them. Avoid jargon from either world.
- **Concise.** Every sentence earns its place.
- **The core insight should land hard:** structured thinking is the skill underneath every AI skill. Without it, AI makes you worse, not better.
- **British English** throughout (optimisation, personalised, programme, etc.)
- **Direct address.** "You", "your". Talk to the reader.
- **No buzzwords.** No "leverage", "synergy", "empower", "revolutionise". Say what you mean.
- **The 7 skills should feel like a revelation, not a curriculum.** Present them as a discovery about how thinking works, not a syllabus.

---

## 6. DEPLOYMENT STEPS (for after build)

1. Create GitHub repo: `think-first-site`
2. Push the built files
3. Go to netlify.com → "Add new site" → "Import from GitHub"
4. Select the repo → Deploy
5. Site is live at `[random-name].netlify.app`
6. (Optional) Add custom domain later

Every future `git push` auto-deploys. Set and forget.

---

## 7. REVIEW CHECKLIST (for Opus review pass)

After Sonnet builds v1, ask Opus to review against:
- [ ] Does the copy sell structured thinking as a universal skill, NOT a kids course or a corporate training product?
- [ ] Does it speak to all 4 audience segments without feeling generic?
- [ ] Is the 7-skill framework presented clearly and memorably?
- [ ] Is the "same skill, different levels" insight communicated effectively?
- [ ] Does the design feel warm, intelligent, and trustworthy?
- [ ] Would a parent trust this? Would a VP take it seriously?
- [ ] Does it work perfectly on mobile?
- [ ] Is the email capture form wired for Netlify Forms with segment selector?
- [ ] Lighthouse audit: 95+ across the board?
- [ ] Page weight under 200KB?
- [ ] Progressive enhancement (works without JS)?
- [ ] British English throughout?
- [ ] Zero dependencies, zero build step?
- [ ] Does the CTA create interest without being sleazy?
- [ ] Is the proactive delivery / timing intelligence explained simply?

---

## 8. CONTEXT FOR THE AI BUILDER

This product already has a working prototype: a React-based web app with 7-skill assessment, adaptive AI tutors (Bolt/Vector/Prism), bubble interface for younger users, and a skill radar dashboard. The Slack bot architecture has been designed (Vercel + Upstash Redis + Claude API + Slack Bolt SDK). The content architecture spans age 4 to corporate, with 7 developmental bands.

The website you're building is the LANDING PAGE — the front door that captures interest across all segments. The product itself (web app, Slack bot, assessment engine) is being built separately. This site just needs to sell the idea, capture emails with segment data, and look distinctive enough that people remember it.

The founder's north star: "set and forget, automatable at scale." Everything built should require zero ongoing maintenance. Static site, form handling by Netlify, auto-deploy from GitHub.

---

## 9. FUTURE ITERATIONS (not for v1)

- Interactive demo: "Try a 60-second thinking exercise" embedded on the page
- Segment-specific landing pages (parents, educators, corporate)
- Blog / thought leadership for SEO
- Pricing page when monetisation model is finalised
- Integration with the actual Think First web app for seamless signup → assessment flow
