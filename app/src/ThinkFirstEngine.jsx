import { useState, useEffect, useRef, useCallback } from "react";

// ============================================
// ABILITIES — 7 thinking skills, in-world names
// ============================================
const ABILITIES = [
  { id: "clarity",       name: "FOCUS",    skill: "Clarity",            icon: "◎", color: "#F59E0B", tagline: "Turn a fuzzy thought into something actionable" },
  { id: "decomposition", name: "FRAGMENT", skill: "Decomposition",      icon: "◫", color: "#8B5CF6", tagline: "Break the impossible into the possible" },
  { id: "relationships", name: "WEAVE",    skill: "Relationships",      icon: "⬡", color: "#EC4899", tagline: "See the threads that connect everything" },
  { id: "outcomes",      name: "ANCHOR",   skill: "Outcome Definition", icon: "◉", color: "#10B981", tagline: "Know exactly where you're trying to land" },
  { id: "gaps",          name: "SCOUT",    skill: "Gap Analysis",       icon: "▲", color: "#06B6D4", tagline: "Find what stands between you and the goal" },
  { id: "procedural",    name: "SEQUENCE", skill: "Procedural Thinking",icon: "▤", color: "#3B82F6", tagline: "Write instructions a literal machine can follow" },
  { id: "evaluation",    name: "DISCERN",  skill: "Evaluation",         icon: "◆", color: "#EF4444", tagline: "Judge whether what came back is actually good" },
];

const RANK_TITLES = ["", "Initiate", "Apprentice", "Apprentice", "Journeyman", "Journeyman", "Adept", "Adept", "Master", "Master", "Legend"];

// ============================================
// WARM PALETTE — used for all pre-quest screens
// (email gate, theme select, profile, zero session, hub)
// Quest/intro screens use the narrative theme's palette.
// Consistent with the landing page design tokens.
// ============================================
const W = {
  bg:          "#FAF7F2",
  bgCard:      "#F5F0E8",
  bgInput:     "#FFFFFF",
  border:      "#E7E2DA",
  borderFocus: "#B45309",
  text:        "#1C1917",
  muted:       "#78716C",
  faint:       "#A8A29E",
  accent:      "#B45309",
  accentSoft:  "#D97706",
  accentLight: "#FEF3C7",
  serif:       "'Fraunces', Georgia, serif",
  sans:        "'Plus Jakarta Sans', system-ui, sans-serif",
};

// ============================================
// PHASE 2: OUTPUT CONTROL ABILITIES
// ============================================
const OUTPUT_ABILITIES = [
  { id: "shape", name: "SHAPE", skill: "Format Control",       icon: "▦", color: "#F97316", tagline: "Tell the AI what structure to return" },
  { id: "zoom",  name: "ZOOM",  skill: "Granularity Control",  icon: "⊙", color: "#0EA5E9", tagline: "Set the altitude — overview to deep dive, on demand" },
  { id: "trim",  name: "TRIM",  skill: "Iterative Refinement", icon: "◁", color: "#84CC16", tagline: "Cut until only signal remains — no noise, no caveats" },
  { id: "layer", name: "LAYER", skill: "Context & Depth",      icon: "⊟", color: "#A855F7", tagline: "Map the whole space first, then navigate deliberately" },
];

// ============================================
// THREE NARRATIVE THEMES
// ============================================
const NARRATIVE_THEMES = {
  forest: {
    id: "forest",
    name: "The Forest",
    emoji: "🌲",
    tagline: "Ancient paths. The Voice responds only to clarity.",
    desc: "A fairytale world where structured thought clears the way forward.",
    // Colours
    bg: "#0A1A0A",
    bgCard: "#111F11",
    bgInput: "#0D180D",
    border: "#1A3A1A",
    text: "#D4EDD4",
    textMuted: "#5A8F5A",
    textFaint: "#2A4A2A",
    accent: "#4ADE80",
    accentSoft: "#86EFAC",
    gradient: "radial-gradient(ellipse at 15% 25%, #0E2A0E 0%, #0A1A0A 65%)",
    // Narrative voice
    axisName: "The Voice",
    axisIntro: [
      "The forest is deep and old.",
      "Something lives here that listens.",
      "It has answered every traveller who spoke clearly enough.",
      "Most never found the words.",
      "You might be different.",
      "There is only one way to find out.",
    ],
    zeroPrompt: "The Voice echoes back what it hears. Two calls into the forest — which one could it actually follow?",
    zeroA: "help me",
    zeroB: "show me the path to the river, past the two oak trees",
    zeroWhy: "The second call gives The Voice something to work with. Specific. Directional. That clarity — however small — is the beginning of everything.",
    hubGreeting: (name) => `${name ? `Welcome, ${name}.` : "Welcome, traveller."} The forest is listening.`,
    hubSubtext: "Each ability you develop clears more of the path. Start with FOCUS — the first light through the trees.",
    reinforcement: [
      "The forest heard that. Notice how clear it sounded.",
      "That's the path clearing. Precise thought, precise result.",
      "The Voice answers when spoken to clearly. You're learning its language.",
      "Something shifted just then — did you feel it? That's your thinking sharpening.",
      "Every clear instruction is a step further in. You're finding your way.",
    ],
  },
  studio: {
    id: "studio",
    name: "The Studio",
    emoji: "◻",
    tagline: "Clean thinking. Sharp craft. No noise.",
    desc: "A modern workspace where clarity of thought is the only tool that matters.",
    bg: "#0F0F0F",
    bgCard: "#161616",
    bgInput: "#111111",
    border: "#2A2A2A",
    text: "#E8E8E8",
    textMuted: "#666666",
    textFaint: "#333333",
    accent: "#C0C0C0",
    accentSoft: "#E0E0E0",
    gradient: "radial-gradient(ellipse at 50% 0%, #1A1A1A 0%, #0F0F0F 60%)",
    axisName: "AXIS",
    axisIntro: [
      "This is the studio.",
      "No decoration. No noise. Just the work.",
      "AXIS is your collaborator — precise, capable, and completely literal.",
      "It does exactly what you instruct. Nothing more.",
      "The quality of your output depends entirely on the quality of your input.",
      "Let's find out where you start.",
    ],
    zeroPrompt: "Two briefs arrive on your desk. Which one can you actually do something with?",
    zeroA: "make it better",
    zeroB: "reduce the loading time on mobile by 30%, without changing the visual design",
    zeroWhy: "The second brief is actionable. It tells you what, how much, and what not to break. A well-structured instruction is a beautiful thing — and you just recognised one.",
    hubGreeting: (name) => `${name ? name + "." : "Good."} The studio is ready.`,
    hubSubtext: "Start with FOCUS. Every sharp piece of work starts with a sharp instruction.",
    reinforcement: [
      "Clean. That instruction has shape to it.",
      "Notice the difference in what came back — that's your clarity at work.",
      "A well-structured thought is a beautiful thing. That was one.",
      "You're developing the craft. Each clear instruction builds on the last.",
      "Good thinking is a habit. You're building it right now.",
    ],
  },
  mirror: {
    id: "mirror",
    name: "The Mirror",
    emoji: "🌀",
    tagline: "Look inward. Think clearly. Speak kindly.",
    desc: "A reflective space where structured thought becomes a form of self-understanding.",
    bg: "#0A0A12",
    bgCard: "#111120",
    bgInput: "#0D0D1A",
    border: "#1E1E35",
    text: "#DDD8FF",
    textMuted: "#6A6490",
    textFaint: "#2A2840",
    accent: "#A78BFA",
    accentSoft: "#C4B5FD",
    gradient: "radial-gradient(ellipse at 60% 30%, #16143A 0%, #0A0A12 65%)",
    axisName: "the mirror",
    axisIntro: [
      "You already know how to think.",
      "You've been doing it your whole life.",
      "What we're doing here is making it visible.",
      "When your thoughts become clear, something shifts — in how you communicate, how you decide, how you feel.",
      "This is a gentle process. There is no wrong answer.",
      "There is only what you notice, and what you do next.",
    ],
    zeroPrompt: "Two thoughts. Which one could you actually act on today?",
    zeroA: "I want to feel better",
    zeroB: "I want to spend 20 minutes outside before lunch",
    zeroWhy: "The second thought has a shape. A time. A condition. You can move toward it. That instinct — the one that recognises the difference — has always been in you. We're just making it louder.",
    hubGreeting: (name) => `${name ? `Hello, ${name}.` : "Hello."} You're doing something most people never try.`,
    hubSubtext: "Start with FOCUS — the ability to turn a feeling into something you can work with.",
    reinforcement: [
      "Notice how that felt — clearer, more settled. That's what structured thought does.",
      "You already had that in you. We're just making it visible.",
      "That's your thinking working well. Remember this feeling.",
      "Clarity like that is a kindness — to yourself and to anyone you're communicating with.",
      "You're building something real here. One clear thought at a time.",
    ],
  },
};

// ============================================
// ZERO SESSION — binary recognition, no typing
// Three pairs: specific input, shaped output, broken-down task
// Output control is introduced from the very first session — not gated
// ============================================
const ZERO_PAIRS = [
  {
    abilityId: "clarity",
    question: { young: "Which one could a robot actually follow?", child: "Which instruction actually makes sense?", teen: "Which one gives AXIS something to work with?", adult: "Which instruction is actionable?" },
    a: { young: "do stuff", child: "help me with my project", teen: "help me", adult: "make it better" },
    b: { young: "get me a biscuit from the tin on the shelf", child: "find 5 facts about the water cycle for my Year 6 project", teen: "list 3 pros and cons of social media for a 16-year-old", adult: "draft a 3-point summary of the risks in this proposal" },
    insight: { young: "The second one! It says exactly what to get and where. That's the whole trick.", child: "The second one gives you something to actually do. Specific questions get specific answers.", teen: "The second one. It tells AXIS what, for whom, and in what format. That's FOCUS.", adult: "The second. Specific output, clear scope, defined context. That's what makes an instruction actionable." },
  },
  {
    abilityId: "shape",
    question: { young: "Which answer is easier to use?", child: "Which response would you actually read?", teen: "Which response respects your time?", adult: "Which response is immediately usable?" },
    a: { young: "There are many interesting things about dogs. They were first domesticated thousands of years ago from wolves, and since then humans have bred them into hundreds of different breeds for different purposes. Dogs communicate using their tail, ears, and different types of barking. They have an incredibly strong sense of smell, estimated to be up to 100,000 times better than humans. They are used as working animals, companions, and in many therapeutic settings around the world.", child: "Climate change is a complex global challenge involving many interconnected systems. Rising greenhouse gas emissions from human activities are causing global temperatures to increase, which in turn affects weather patterns, sea levels, ecosystems, and human societies in numerous ways that scientists are still working to fully understand and predict.", teen: "There are many perspectives on this topic and it's important to consider multiple viewpoints before forming an opinion. The subject has historical, cultural, economic, and social dimensions that all interact with each other in complex ways, and any attempt to summarise it risks oversimplifying what is actually a nuanced and multifaceted issue.", adult: "This is a multifaceted issue that requires careful consideration of various factors including but not limited to the strategic implications, resource requirements, stakeholder perspectives, risk appetite, market conditions, competitive landscape, and the broader organisational context in which this decision is being made." },
    b: { young: "3 things about dogs:\n• They wag their tail when happy\n• They can smell 100,000× better than us\n• They've lived with humans for 15,000 years", child: "3 climate facts:\n• CO₂ traps heat in the atmosphere\n• Sea levels rising ~3mm per year\n• Extreme weather events up 5× since 1980", teen: "Top 3 things to know:\n1. Define exactly what you're asking\n2. Specify the format you want back\n3. Set the length limit before you send it", adult: "3-point summary:\n1. Core recommendation\n2. Key risk\n3. Next action with owner" },
    insight: { young: "The second one is short and easy to read! You can ask for a list instead of a big paragraph — and that changes everything about how useful the answer is.", child: "The second response is shaped — it has a structure you can scan and use. You can control how an answer looks, not just what it's about. That's a skill.", teen: "The second response takes 10 seconds to absorb. The first takes 3 minutes — and you'll remember less of it. Controlling the shape of what comes back is as important as controlling what you ask.", adult: "Format is not decoration. A well-shaped response reduces cognitive load, speeds up decisions, and is easier to share. You can always ask for the shape you need — and you should, every time." },
  },
  {
    abilityId: "decomposition",
    question: { young: "Which job could a robot finish?", child: "Which task could you actually start?", teen: "Which request could AXIS actually complete?", adult: "Which is a discrete, executable task?" },
    a: { young: "tidy everything", child: "sort out my room", teen: "fix my life", adult: "improve the product" },
    b: { young: "put all the Lego in the blue box", child: "put all the books back on the shelf in alphabetical order", teen: "draft an outline for my biology essay on photosynthesis", adult: "write a one-page brief defining the three biggest UX problems in the current checkout flow" },
    insight: { young: "The second one! It says exactly what, and where it goes.", child: "The second one is one job with a clear finish line. That's where everything starts.", teen: "The second one is scoped. One output, defined topic. You can start it right now.", adult: "The second has a single output, defined scope, and a clear finish state. That's a unit of work." },
  },
];

// ============================================
// OUTPUT ZERO PAIRS — binary recognition for output control
// Shown as per-ability intro the first time each output ability is entered
// ============================================
const OUTPUT_ZERO_PAIRS = [
  {
    abilityId: "shape",
    question: { young: "Which answer is easier to use?", child: "Which response would actually help you right now?", teen: "Which response is more useful to you?", adult: "Which response is immediately actionable?" },
    a: { young: "There are many interesting things about dogs including how they were domesticated thousands of years ago and the many different breeds and how they communicate using their tail and ears and barking...", child: "Climate change involves many factors including rising global temperatures, ocean acidification, melting ice caps, extreme weather events, biodiversity loss, and significant human and economic impacts...", teen: "There are many perspectives on social media including its effects on mental health, its role in political discourse, the business models involved, privacy implications, and its impact on human connection...", adult: "The decision involves multiple considerations including strategic fit, resource requirements, stakeholder impact, risk profile, timeline implications, and precedent effects on future decisions..." },
    b: { young: "3 things about dogs:\n1. They wag their tail when happy 🐕\n2. They can smell 1000x better than us\n3. They've been with humans for 15,000 years", child: "3 key climate facts:\n• CO₂ traps heat in the atmosphere\n• Sea levels rising ~3mm per year\n• Extreme weather events up 5× since 1980", teen: "Social media: top 3 tensions\n1. Connection vs. comparison\n2. Free speech vs. misinformation\n3. Convenience vs. privacy", adult: "Decision summary:\nRecommendation: proceed / pause / stop\nKey risk: [one sentence]\nNext action: [owner + deadline]" },
    insight: { young: "The second one! Short lists are much easier to use. When you tell it HOW to answer — not just WHAT — you get something you can actually use.", child: "The second response is the right size. You told it what format you wanted — and it delivered. That's SHAPE: controlling what comes back, not just what you ask.", teen: "Same knowledge, completely different usefulness. The second response is shaped for a specific purpose. SHAPE is the skill of controlling what the AI returns — and it changes everything.", adult: "Format control is the difference between information and actionable clarity. The first response answers the question. The second gives you something you can act on, share, or build from." },
  },
  {
    abilityId: "zoom",
    question: { young: "Which question about space is a better start?", child: "Which question gets you to understanding faster?", teen: "Which approach uses context more efficiently?", adult: "Which approach extracts knowledge with less cognitive load?" },
    a: { young: "Tell me absolutely everything there is to know about space", child: "Explain everything about how the internet works in full detail", teen: "Give me a comprehensive explanation of how machine learning works, covering all the main concepts, techniques, applications, and limitations", adult: "Provide a thorough analysis of all dimensions of this strategic decision, including full context, stakeholder positions, risk scenarios, and implementation options" },
    b: { young: "Name 3 things in space and one amazing fact about each one", child: "Give me 2 sentences on how the internet works, then I'll ask what to go deeper on", teen: "Give me a 3-sentence overview of machine learning. I'll tell you which part to go deep on.", adult: "List the 4–5 most critical factors. I'll direct which areas need detailed analysis." },
    insight: { young: "The second question gets a useful answer! Big questions get big messy answers. Ask for exactly as much as you can use — then ask for more.", child: "The second question gets you the map first. Then you navigate to what matters. Start small, go deep deliberately — that's ZOOM.", teen: "The second question uses context as a resource. The overview gives you a map. Then you navigate to the one thing that matters. That's more efficient than asking for everything.", adult: "Layered questioning reduces cognitive load and improves response quality. Get the index first, access what you need, then go deep. Context is finite — use it deliberately." },
  },
  {
    abilityId: "trim",
    question: { young: "The Voice talked for a really long time. Which message would make it shorter?", child: "AXIS gave you 4 paragraphs. Which follow-up gets you what you need?", teen: "The response has too many caveats. Which follow-up fixes it?", adult: "The output exceeded brief. Which refinement instruction gets you signal?" },
    a: { young: "Thanks! Tell me more.", child: "That was interesting, can you tell me more and expand on the key points?", teen: "Thanks, that was helpful. Could you elaborate and give me more examples?", adult: "Thank you — that's useful context. Could you expand on each of those points?" },
    b: { young: "Say it again but just one sentence.", child: "Rewrite as 3 bullet points. Remove all the extra explanation.", teen: "Remove the caveats. Keep only the action steps. Rewrite in under 60 words.", adult: "Cut to: recommendation, one-sentence rationale, next action. Under 50 words, no qualifiers." },
    insight: { young: "The second one makes it shorter! You can always ask it to say less — and you should, whenever the answer is too long to use.", child: "The second message is a TRIM instruction. It tells the AI exactly how to shrink the response. You can always refine what came back — that's half the skill.", teen: "TRIM is asking for less, not more. Removing caveats and length constraints produces more signal per sentence. The first follow-up gets more text. The second gets clarity.", adult: "Refinement instructions are often more valuable than the first prompt. Strip hedging, set word limits, define the structure you need. The second response is always better than the first — if you ask for it." },
  },
  {
    abilityId: "layer",
    question: { young: "You have a really BIG question. Which way of asking is smarter?", child: "You want to understand something huge. Which approach works better?", teen: "You're working on a complex topic. Which conversation design is better?", adult: "You need to extract knowledge from a large, complex context. Which approach is more effective?" },
    a: { young: "Tell me everything about how the world works", child: "Explain the entire history of the Roman Empire with all the key events and people and why it fell", teen: "Write me a complete analysis of climate policy, covering the science, the economics, the politics, international agreements, and what individuals can do", adult: "Analyse this entire document and give me a comprehensive breakdown of all the key themes, decisions, risks, and recommended actions" },
    b: { young: "Tell me 3 things about the world, then I'll ask more questions", child: "What were the 5 most important moments in Roman history? I'll then ask about whichever one matters most for my essay.", teen: "Identify the 4–5 most critical dimensions of climate policy. I'll pick one and we'll go deep.", adult: "Summarise the 4–5 key themes from this document. I'll specify the depth needed for each area." },
    insight: { young: "The second way! Big questions are hard to answer well. Ask in layers — one piece at a time — and you get much better answers each time.", child: "The second approach gets a good answer first, then builds. You can always go deeper — but you can't un-read a wall of text. Layer your questions.", teen: "The second approach designs the conversation. Get the structure first. Then drill into what matters. Large topics need a map before they need a deep dive — that's LAYER.", adult: "Context architecture is a skill. A large context with no navigation structure produces noise. Summarise to get the map, then specify depth per area. That's how you manage information load without losing fidelity." },
  },
];

// ============================================
// QUEST SCENARIOS — story-framed, scaffolded
// ============================================
const QUESTS = [
  {
    abilityId: "clarity",
    title: { forest: "The First Call", studio: "The Brief", mirror: "Finding the Words" },
    setup: {
      young:  "You want The Voice to help you. You call out: 'help'. Silence. What do you actually need?",
      child:  "AXIS is waiting. Your first instruction: 'help me'. It returns nothing — too vague. Try again with something specific.",
      teen:   "First instruction to AXIS: it needs to know WHAT, for WHO, and in what FORMAT. Try sending it something with all three.",
      adult:  "A vague instruction returns noise. Rewrite it: define the output, the context, and the constraint.",
    },
    assemblyParts: {
      young:  { starts: ["Get me", "Bring me", "Find me", "Show me"], middles: ["a biscuit 🍪", "my book 📚", "the red cup 🔴", "something to draw with ✏️"], ends: ["from the kitchen", "from my bag", "on the shelf", "near the door"] },
      child:  { starts: ["Help me write", "Find me", "Explain", "Give me 3 ideas for"], middles: ["a story about", "5 facts about", "how to do", "the difference between"], ends: ["dragons 🐉", "the water cycle", "long division", "planets and stars"] },
      teen:   { starts: ["Write a", "List", "Summarise", "Explain"], middles: ["200-word explanation of", "3 pros and cons of", "the main argument in", "how to approach"], ends: ["climate change", "social media", "this essay question", "my revision schedule"] },
      adult:  { starts: ["Draft a", "Identify", "Propose", "Summarise"], middles: ["3-point summary of", "the key risks in", "3 options for", "the main argument of"], ends: ["this proposal", "the current approach", "solving this problem", "the stakeholder position"] },
    },
  },
  {
    abilityId: "decomposition",
    title: { forest: "The Long Path", studio: "The Brief Breaks Down", mirror: "One Step at a Time" },
    setup: {
      young:  "The Voice can only do one thing at a time. You want it to help you make breakfast 🥣. Break it into 3 jobs.",
      child:  "AXIS can only handle one task at a time. 'Build a treehouse' is too big. Break it into its parts.",
      teen:   "Your project is too big for one instruction. Split it into 3 parts that could each be done independently.",
      adult:  "The request is out of scope as stated. Decompose it into 3 distinct, independently executable components.",
    },
    assemblyParts: {
      young:  { starts: ["First:", "Then:", "After that:", "Finally:"], middles: ["get a bowl 🥣", "open the cereal 🌾", "pour the milk 🥛", "get a spoon 🥄"], ends: ["from the cupboard", "from the fridge", "from the drawer", "and put it on the table"] },
      child:  { starts: ["Part 1:", "Part 2:", "Part 3:", "Step 1:"], middles: ["gather all the materials", "draw a plan of what it should look like", "build the floor and walls", "test it is safe"], ends: ["before you start building", "using measurements", "one section at a time", "before adding the roof"] },
      teen:   { starts: ["Component 1:", "First phase:", "Part A:", "Section 1:"], middles: ["research and define the question", "gather evidence and examples", "draft the argument", "review and edit"], ends: ["in bullet points", "from reliable sources", "in your own words", "for clarity and flow"] },
      adult:  { starts: ["Phase 1:", "Workstream A:", "First:", "Component 1:"], middles: ["scope definition and constraints", "options analysis", "recommendation and rationale", "implementation plan"], ends: ["with stakeholder input", "against defined criteria", "with risk assessment", "with clear owners and dates"] },
    },
  },
  {
    abilityId: "relationships",
    title: { forest: "The Web Between Trees", studio: "Second-Order Effects", mirror: "Everything Connects" },
    setup: {
      young:  "If it rains ☔, you can't play outside. But what ELSE changes? The Voice wants to know the whole picture.",
      child:  "AXIS only sees the obvious. If your school cancelled homework — it says 'kids are happy'. What does it miss?",
      teen:   "AXIS sees first-order effects only. A popular app bans ads. Revenue drops. What happens next, and after that?",
      adult:  "AXIS flagged one consequence. Your team loses its best person. Identify the second and third-order effects.",
    },
    assemblyParts: {
      young:  { starts: ["We'd have to", "Mum would", "The dog would", "My friend would"], middles: ["stay inside all day", "find us something else to do", "get muddy on his walk", "have to cancel our plans"], ends: ["which is boring", "which she hates", "which means extra cleaning", "which would make me sad"] },
      child:  { starts: ["Teachers would", "Other kids would", "Parents might", "After a while,"], middles: ["change how they check our work", "spend more time playing", "expect us to read instead", "grades might"], ends: ["in class instead", "after school", "which could be good", "start to drop"] },
      teen:   { starts: ["Users would", "Competitors could", "The company might", "Content creators would"], middles: ["move to ad-free platforms", "gain market share quickly", "have to cut costs elsewhere", "lose their income and"], ends: ["taking the audience", "while the stock drops", "affecting product quality", "leave the platform"] },
      adult:  { starts: ["Knowledge loss", "Team morale", "Client relationships", "Hiring pressure"], middles: ["compounds as others realise", "shifts when the workload", "weaken as delivery", "increases because"], ends: ["they could leave too", "redistributes without warning", "starts to slip", "the role is hard to backfill"] },
    },
  },
  {
    abilityId: "outcomes",
    title: { forest: "The Destination", studio: "The Success Condition", mirror: "What Does Done Feel Like?" },
    setup: {
      young:  "You ask The Voice to clean a plate 🍽️. But how does it know when it's DONE? You need to tell it exactly.",
      child:  "AXIS needs a finish line. 'Write a good story' isn't one. Tell it exactly what a good story looks like.",
      teen:   "'Get better at maths' is not a goal. Define what success looks like in 4 weeks — something measurable.",
      adult:  "'Improve team communication' is a direction, not a target. Define the measurable success state in 8 weeks.",
    },
    assemblyParts: {
      young:  { starts: ["Done means:", "It's finished when:", "Stop when:", "You'll know it's clean when:"], middles: ["there's no food left on it", "it's completely dry", "it's shiny", "I can see my reflection"], ends: ["and it smells clean", "with no water marks", "on both sides", "in the middle of the plate"] },
      child:  { starts: ["A good story has:", "It's good when:", "Done means:", "Success looks like:"], middles: ["a beginning, middle and end", "I want to read it again", "the characters feel real", "something surprising happens"], ends: ["that all connect", "straight away", "not like cardboard", "that makes sense"] },
      teen:   { starts: ["Success means:", "Done looks like:", "In 4 weeks I'll know it worked if:", "The target is:"], middles: ["my test score goes up by 10%", "I can explain it to someone else", "I don't need to google the basics", "I can do exam questions"], ends: ["without guessing", "without checking my notes", "anymore", "in under 5 minutes"] },
      adult:  { starts: ["Target state:", "Success in 8 weeks:", "Done means:", "We'll know it worked when:"], middles: ["meeting count drops by 30%", "decisions are made in the meeting", "team survey score reaches 7/10", "escalations reduce by half"], ends: ["with no follow-up needed", "not revised afterwards", "on communication effectiveness", "compared to this quarter"] },
    },
  },
  {
    abilityId: "gaps",
    title: { forest: "What the Forest Cannot Provide", studio: "The Gap Audit", mirror: "What Is Missing in You?" },
    setup: {
      young:  "You want to bake a cake 🎂 and you have flour. The Voice asks: what else is missing? Name everything.",
      child:  "You want to make a YouTube video 🎥. You have a camera. What's still missing — and what type of gap is each?",
      teen:   "You want to launch something. You have an idea. Name your 3 biggest gaps — and what type each one is.",
      adult:  "You want to ship in 60 days. You have a team. Audit the gaps — categorised by type.",
    },
    assemblyParts: {
      young:  { starts: ["I'm missing", "I don't have", "I need", "I forgot"], middles: ["eggs 🥚", "sugar 🍬", "butter 🧈", "a recipe 📖"], ends: ["from the shops", "in the cupboard", "to make it sweet", "to know what to do"] },
      child:  { starts: ["Missing:", "I don't have", "I still need", "Gap:"], middles: ["a script for what to say", "editing software", "an audience to watch it", "a good idea for the topic"], ends: ["(knowledge gap)", "(tool gap)", "(distribution gap)", "(creative gap)"] },
      teen:   { starts: ["Gap 1:", "Gap 2:", "Gap 3:", "Missing:"], middles: ["money to build it (resource)", "customers who want it (market)", "a way to get paid (technical)", "time to actually do it (capacity)"], ends: ["— needs a plan", "— needs validation first", "— needs research", "— needs a schedule"] },
      adult:  { starts: ["Knowledge gap:", "Resource gap:", "Market gap:", "Process gap:"], middles: ["no validated spec or brief", "no design or dev capacity", "no validated demand signal", "no clear decision-making process"], ends: ["→ discovery sprint needed", "→ resourcing decision needed", "→ customer research needed", "→ RACI definition needed"] },
    },
  },
  {
    abilityId: "procedural",
    title: { forest: "The Exact Path", studio: "The Protocol", mirror: "One Foot Then the Other" },
    setup: {
      young:  "The Voice is completely literal 🤖. Tell it exactly how to make a bowl of cereal — every single step.",
      child:  "AXIS follows instructions exactly, never guessing. Write the exact steps to pick tonight's movie.",
      teen:   "Write 4 steps a completely literal system would follow to decide if a message needs a reply.",
      adult:  "Write 3 decision steps with explicit branches that a literal system would follow to triage an inbound request.",
    },
    assemblyParts: {
      young:  { starts: ["Step 1:", "Step 2:", "Step 3:", "Step 4:"], middles: ["get a bowl from the cupboard 🥣", "open the cereal box 📦", "pour cereal into the bowl", "pour milk over the cereal 🥛"], ends: ["and put it on the table", "and tip it carefully", "until it's half full", "until the cereal is covered"] },
      child:  { starts: ["Step 1:", "Step 2:", "Step 3:", "Step 4:"], middles: ["ask everyone who's watching what they feel like", "remove anything with a certificate above the youngest person's age", "remove anything everyone has already seen", "from what's left, pick the one with the most votes"], ends: ["and write down the answers", "from the list", "in the last 3 months", "or flip a coin if tied"] },
      teen:   { starts: ["Step 1:", "Step 2:", "Step 3:", "Step 4:"], middles: ["is the message addressed directly to me? If no →", "does it require a decision or action from me? If no →", "is there a deadline within 48 hours? If yes →", "reply now. If no →"], ends: ["archive it without replying", "forward it to the right person", "reply within 2 hours", "add to your task list for tomorrow"] },
      adult:  { starts: ["Step 1:", "Step 2:", "Step 3:"], middles: ["is it urgent (needed within 24h) AND important (affects outcomes)? If yes →", "is it in your scope? If no →", "does it require a decision only you can make? If yes →"], ends: ["handle immediately", "delegate or redirect to the right owner", "block time to address it today. If no → defer to weekly review"] },
    },
  },
  {
    abilityId: "evaluation",
    title: { forest: "The False Path", studio: "The Quality Check", mirror: "Trusting Your Judgement" },
    setup: {
      young:  "The Voice says 2+2=5 😮. You know something's wrong. How do you know — and what do you do next?",
      child:  "AXIS says the moon is made of cheese 🧀. It sounds confident. How do you check if it's right or wrong?",
      teen:   "AXIS just wrote your essay plan. What are the 2 most important things to check before you use it?",
      adult:  "AXIS recommended a strategy. What is the first thing you would question about its reasoning?",
    },
    assemblyParts: {
      young:  { starts: ["I know it's wrong because", "I'd check by", "I'd ask", "I'd tell it to"], middles: ["I learned that 2+2=4", "counting on my fingers myself", "a grown-up if I'm not sure", "try again and show its working"], ends: ["in school", "to double-check", "before I believe it", "step by step"] },
      child:  { starts: ["I'd check", "I'd search for", "I'd look it up in", "I'd ask it to"], middles: ["another reliable source", "the answer online", "a textbook or encyclopedia", "show me where it got that from"], ends: ["to compare", "on a trusted site", "to verify", "before I trust it"] },
      teen:   { starts: ["First:", "Most importantly:", "Check 1:", "Check 2:"], middles: ["does it actually answer the specific question asked", "is anything important missing from the argument", "are the points in a logical order", "would a teacher recognise this as my own thinking"], ends: ["or something adjacent?", "that weakens the case?", "that builds properly?", "or just AXIS's?"] },
      adult:  { starts: ["First question:", "Key challenge:", "What I'd probe:", "Critical gap:"], middles: ["what assumptions is this built on", "what data or evidence is missing", "does this account for the second-order effects", "what's the failure mode if the core assumption is wrong"], ends: ["that I haven't validated?", "that would change the recommendation?", "of this decision?", "and how likely is it?"] },
    },
  },
];

// ============================================
// OUTPUT QUESTS — teach the 4 output control skills
// Assembly parts here build OUTPUT instructions (format / depth / scope)
// not input prompts
// ============================================
const OUTPUT_QUESTS = [
  {
    abilityId: "shape",
    title: { forest: "Shaping the Echo", studio: "The Format Brief", mirror: "Asking for What You Need" },
    setup: {
      young:  "The Voice just gave you a very long answer. You got confused. Now add a SHAPE to your question — tell it exactly how you want the answer to look.",
      child:  "AXIS gave you 4 paragraphs when you needed 3 bullet points. Add a format instruction to your question — tell it the shape you want back.",
      teen:   "Your question got a wall of text. Add a SHAPE instruction — tell AXIS what format to use, what to include, and what to cut.",
      adult:  "The response exceeded scope. Add output format control: define the structure, the length limit, and what to exclude.",
    },
    assemblyParts: {
      young:  { starts: ["Tell me", "Give me", "Show me", "List for me"], middles: ["3 things about", "the most important thing about", "2 fun facts about", "the steps to"], ends: ["in a short list ✅", "in just 2 sentences", "short and simple please", "one at a time"] },
      child:  { starts: ["Return this as", "Give me", "Format your answer as", "Respond with"], middles: ["3 bullet points covering", "a numbered list of the key points about", "2–3 sentences about", "a simple table comparing"], ends: ["with no extra context", "in plain language", "the main points only", "most important first"] },
      teen:   { starts: ["Format this as", "Return", "Give me", "Respond with"], middles: ["a numbered list of 3–5 points", "a table with two columns", "a one-paragraph summary of", "the 3 most important actions for"], ends: ["with no background or caveats", "covering only what I need to decide", "in under 100 words", "with the key insight first"] },
      adult:  { starts: ["Return this as", "Respond with", "Format as", "Give me"], middles: ["a 3-point decision summary", "a table: option / risk / action", "a single recommendation and rationale for", "the top 3 actions only for"], ends: ["with no preamble", "removing all caveats and qualifiers", "in under 150 words", "in a format I can share directly"] },
    },
  },
  {
    abilityId: "zoom",
    title: { forest: "Setting the Altitude", studio: "The Zoom Calibration", mirror: "Finding the Right Distance" },
    setup: {
      young:  "You want to know EVERYTHING about the ocean. But that's so much! Ask for just the right amount first — a small, perfect question.",
      child:  "You want to understand a big topic. Get the overview first — then choose what to go deeper on. Practice the overview question.",
      teen:   "Practice the ZOOM technique: satellite view first, street level second. Get the map before you navigate. Build the overview question.",
      adult:  "Before diving into detail, set the altitude. Get the map first, then navigate. Build the overview question for a complex topic.",
    },
    assemblyParts: {
      young:  { starts: ["Tell me", "What are", "Give me", "Name"], middles: ["3 amazing things about", "the most important thing about", "2 surprising facts about", "the biggest and smallest"], ends: ["the ocean 🌊", "space 🚀", "animals 🦁", "how things are made 🏭"] },
      child:  { starts: ["Give me a", "Start with a", "First, just", "Open with"], middles: ["2-sentence overview of", "quick summary of the 3 main ideas about", "the top 5 things to know about", "brief explanation of"], ends: ["then I'll say what to go deeper on", "and I'll ask which part to explain fully", "before I ask for more detail", "so I can decide where to focus"] },
      teen:   { starts: ["Give me a", "Start with", "Open with", "First, a"], middles: ["3-sentence overview of", "the 5 key concepts in", "a high-level map of", "the most important ideas about"], ends: ["then I'll ask which part to go deep on", "before we get into detail", "and I'll pick which to expand", "then follow one thread"] },
      adult:  { starts: ["Give me a", "Start with", "Open with", "First, just"], middles: ["paragraph overview of", "the 4–5 key themes in", "the top-level structure of", "the 3–5 most critical dimensions of"], ends: ["then I'll direct where to drill down", "then specify the depth I need", "before requesting detail on any section", "so I can determine depth per area"] },
    },
  },
  {
    abilityId: "trim",
    title: { forest: "Thinning the Forest", studio: "The Edit Pass", mirror: "Saying Less, Meaning More" },
    setup: {
      young:  "The Voice gave you a very long answer. You only needed the most important part. Tell it: make it shorter, keep only the best bit.",
      child:  "AXIS gave you a long answer with lots of extra stuff. Write a TRIM instruction — tell it exactly what to keep and what to cut.",
      teen:   "The response has too many caveats and too much context. Write a TRIM instruction to cut it to just the signal you need.",
      adult:  "Output exceeded brief — too much hedging, too much context. Write the refinement instruction to strip it back to the decision.",
    },
    assemblyParts: {
      young:  { starts: ["Make it", "Say it in", "Only tell me", "Cut it to"], middles: ["shorter please", "just 1 sentence", "the most important thing", "the one thing I should do"], ends: ["and nothing else", "right now", "without the rest", "please"] },
      child:  { starts: ["Rewrite this in", "Cut this to", "Keep only", "Shorten to"], middles: ["3 bullet points", "the 2 most important points", "the actions I need to take", "one short paragraph"], ends: ["removing the background", "with no extra explanation", "leaving out everything else", "as simply as possible"] },
      teen:   { starts: ["Rewrite this as", "Strip this to", "Remove everything except", "Cut to"], middles: ["3 bullet points", "one action sentence", "the key decision", "the core insight"], ends: ["with no caveats", "in under 50 words", "removing all qualifiers", "as directly as possible"] },
      adult:  { starts: ["Rewrite this", "Cut to", "Remove all", "Distil to"], middles: ["as a 3-point decision brief", "the recommendation and rationale only", "caveats and hedging — return just", "the single most important action"], ends: ["in under 100 words", "with no preamble", "and the core conclusion", "with clear owner and deadline"] },
    },
  },
  {
    abilityId: "layer",
    title: { forest: "Reading the Whole Forest", studio: "Context Architecture", mirror: "The Layered Conversation" },
    setup: {
      young:  "You have a BIG question with lots of parts. Ask for the first piece only — then you'll ask for more, one piece at a time.",
      child:  "You want to understand something big. Plan your questions as layers — broad first, then specific. Build the first layer.",
      teen:   "You're working with a large complex topic. Plan a layered conversation — overview first, deliberate depth second. Think: where do you summarise, where do you go deep?",
      adult:  "Large context, multiple dimensions. Design the conversation architecture: where to summarise to preserve cognitive space, where to expand for detail, how to navigate the whole without losing any of it.",
    },
    assemblyParts: {
      young:  { starts: ["First, tell me", "Start by telling me", "Begin with", "First, just"], middles: ["the 3 most important things about", "the biggest part of", "one thing at a time about", "the most surprising thing about"], ends: ["then I'll ask for more", "and then I'll ask the next question", "and we'll go from there", "and we'll keep going"] },
      child:  { starts: ["Start by summarising", "First, give me", "Begin with", "Open with"], middles: ["the 3–5 main themes of", "a brief overview of", "the most important ideas from", "what I need to know first about"], ends: ["then ask me which part to expand", "and I'll say what matters most", "then I'll tell you where to go deeper", "and we'll build from there"] },
      teen:   { starts: ["Start by mapping", "First, summarise", "Open with", "Begin with a"], middles: ["the 3–5 key themes of", "the top-level structure of", "the most critical decision points in", "the main tensions in"], ends: ["then I'll pick one thread to follow deeply", "and I'll direct where to go next", "then go one layer deeper at a time", "without going into detail yet"] },
      adult:  { starts: ["Start with a", "Open with", "First, map", "Begin by identifying"], middles: ["paragraph-level summary of the key themes in", "the 4–5 most critical dimensions of", "where the key decisions and uncertainties sit in", "the structural tensions and trade-offs in"], ends: ["then I'll direct the next level of detail", "then specify which areas to expand first", "without expanding any section yet", "and I'll determine depth needed per area"] },
    },
  },
];

// ============================================
// SCAFFOLDING DIAL — 0 to 3
// 0: binary choice only
// 1: bubble assembly (parts)
// 2: bubbles as hints, typing primary
// 3: free text, bubbles hidden
// ============================================

// ============================================
// STORAGE
// ============================================
const STORAGE_KEY = "thinkfirst-v3";
function loadState() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; } }
function saveState(s) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {} }

// ============================================
// API
// ============================================
// params: { abilityId, ageGroup, theme, userName, scaffoldDial, isOutputQuest }
// messages: [{ role, content }]
// System prompt is built server-side — never sent from the browser.
async function callAI(params, messages) {
  try {
    const res = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...params, messages }),
    });
    const data = await res.json();
    return data.content?.map(c => c.text || "").join("") || "...";
  } catch { return "Connection lost. Please try again."; }
}

// System prompt is now built server-side in netlify/functions/claude.js.
// The client sends structured params; the server builds and owns the prompt.

// ============================================
// UI COMPONENTS
// ============================================
const Msg = ({ role, content, nt, axisName }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: role === "user" ? "flex-end" : "flex-start", marginBottom: 16 }}>
    {role === "assistant" && (
      <div style={{ fontSize: 10, letterSpacing: 2, color: nt.accent, fontFamily: "monospace", marginBottom: 5, textTransform: "uppercase", opacity: 0.8 }}>{axisName}</div>
    )}
    <div style={{
      maxWidth: "88%", padding: "14px 18px",
      borderRadius: role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
      background: role === "user" ? `${nt.accent}20` : nt.bgCard,
      border: `1px solid ${role === "user" ? nt.accent + "50" : nt.border}`,
      color: nt.text, fontSize: 15, lineHeight: 1.75, whiteSpace: "pre-wrap",
    }}>
      {content}
    </div>
  </div>
);

const Thinking = ({ nt }) => {
  const [d, setD] = useState("");
  useEffect(() => {
    const i = setInterval(() => setD(v => v.length >= 3 ? "" : v + "."), 350);
    return () => clearInterval(i);
  }, []);
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 10, letterSpacing: 2, color: nt.accent, fontFamily: "monospace", marginBottom: 5, textTransform: "uppercase", opacity: 0.8 }}>{nt.axisName}</div>
      <div style={{ display: "inline-block", padding: "12px 18px", borderRadius: "4px 18px 18px 18px", background: nt.bgCard, border: `1px solid ${nt.border}`, color: nt.textMuted, fontFamily: "monospace", fontSize: 13 }}>
        {d.length === 0 ? "·" : d.length === 1 ? "· ·" : "· · ·"}
      </div>
    </div>
  );
};

// Assembly builder — pick a start, middle, end
const AssemblyBuilder = ({ parts, onSend, nt }) => {
  const [start, setStart] = useState("");
  const [middle, setMiddle] = useState("");
  const [end, setEnd] = useState("");
  const [extra, setExtra] = useState("");
  const built = [start, middle, end, extra.trim()].filter(Boolean).join(" ");

  const chipStyle = (selected, color) => ({
    padding: "10px 16px", borderRadius: 50, fontSize: 13, cursor: "pointer",
    border: `2px solid ${selected ? color : nt.border}`,
    background: selected ? `${color}20` : nt.bgCard,
    color: selected ? color : nt.textMuted,
    fontWeight: selected ? 600 : 400,
    transition: "all 0.15s",
    transform: selected ? "scale(1.04)" : "scale(1)",
    whiteSpace: "nowrap",
  });

  return (
    <div style={{ padding: "0 20px 16px" }}>
      <div style={{ fontSize: 11, color: nt.textMuted, fontFamily: "monospace", letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>
        Build your instruction →
      </div>

      {/* Row 1: Starts */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 10, color: nt.textFaint, fontFamily: "monospace", marginBottom: 6 }}>START WITH</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {parts.starts.map((s, i) => (
            <button key={i} onClick={() => setStart(start === s ? "" : s)} style={chipStyle(start === s, nt.accent)}>{s}</button>
          ))}
        </div>
      </div>

      {/* Row 2: Middles */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 10, color: nt.textFaint, fontFamily: "monospace", marginBottom: 6 }}>THEN</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {parts.middles.map((s, i) => (
            <button key={i} onClick={() => setMiddle(middle === s ? "" : s)} style={chipStyle(middle === s, nt.accentSoft)}>{s}</button>
          ))}
        </div>
      </div>

      {/* Row 3: Ends */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 10, color: nt.textFaint, fontFamily: "monospace", marginBottom: 6 }}>ENDING WITH</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {parts.ends.map((s, i) => (
            <button key={i} onClick={() => setEnd(end === s ? "" : s)} style={chipStyle(end === s, nt.accent)}>{s}</button>
          ))}
        </div>
      </div>

      {/* Preview + optional extra */}
      {built && (
        <div style={{ padding: "10px 14px", borderRadius: 10, background: `${nt.accent}12`, border: `1px solid ${nt.accent}40`, marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: nt.accent, fontFamily: "monospace", marginBottom: 4 }}>YOUR INSTRUCTION</div>
          <div style={{ fontSize: 14, color: nt.text }}>{built}</div>
        </div>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={extra}
          onChange={e => setExtra(e.target.value)}
          onKeyDown={e => e.key === "Enter" && built && onSend(built)}
          placeholder="Add your own words... (optional)"
          style={{ flex: 1, padding: "11px 16px", borderRadius: 10, border: `2px solid ${nt.border}`, background: nt.bgInput, color: nt.text, fontSize: 14, outline: "none" }}
          onFocus={e => e.target.style.borderColor = nt.accent}
          onBlur={e => e.target.style.borderColor = nt.border}
        />
        <button
          onClick={() => built && onSend(built)}
          disabled={!built}
          style={{ padding: "11px 22px", borderRadius: 10, border: "none", background: built ? nt.accent : nt.border, color: built ? "#000" : nt.textFaint, fontSize: 17, fontWeight: 800, cursor: built ? "pointer" : "not-allowed", transition: "all 0.15s" }}
        >
          →
        </button>
      </div>
    </div>
  );
};

// Free text input with optional hint bubbles
const FreeInput = ({ onSend, nt, ability, showHints, hints }) => {
  const [val, setVal] = useState("");
  const [showH, setShowH] = useState(false);
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);
  return (
    <div style={{ padding: "10px 20px 20px", borderTop: `1px solid ${nt.border}`, background: nt.bgCard }}>
      {showHints && showH && hints && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          {hints.map((h, i) => (
            <button key={i} onClick={() => setVal(v => v ? v + " " + h : h)} style={{ padding: "8px 14px", borderRadius: 50, fontSize: 12, border: `1px solid ${nt.border}`, background: nt.bgCard, color: nt.textMuted, cursor: "pointer" }}>
              {h}
            </button>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {showHints && (
          <button onClick={() => setShowH(v => !v)} style={{ padding: "11px 14px", borderRadius: 10, border: `1px solid ${nt.border}`, background: "transparent", color: nt.textMuted, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>
            {showH ? "hide hints" : "hints"}
          </button>
        )}
        <input
          ref={ref}
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === "Enter" && val.trim() && onSend(val.trim())}
          placeholder="Your response..."
          style={{ flex: 1, padding: "12px 16px", borderRadius: 10, border: `2px solid ${nt.border}`, background: nt.bgInput, color: nt.text, fontSize: 15, outline: "none" }}
          onFocus={e => e.target.style.borderColor = ability?.color || nt.accent}
          onBlur={e => e.target.style.borderColor = nt.border}
        />
        <button
          onClick={() => val.trim() && onSend(val.trim())}
          disabled={!val.trim()}
          style={{ padding: "12px 22px", borderRadius: 10, border: "none", background: val.trim() ? (ability?.color || nt.accent) : nt.border, color: val.trim() ? "#000" : nt.textFaint, fontSize: 17, fontWeight: 800, cursor: val.trim() ? "pointer" : "not-allowed" }}
        >
          →
        </button>
      </div>
    </div>
  );
};

// ============================================
// MAIN APP
// ============================================
export default function ThinkFirstEngine() {
  const [screen, setScreen]           = useState("loading");
  const [theme, setTheme]             = useState("forest");
  const [userName, setUserName]       = useState("");
  const [ageGroup, setAgeGroup]       = useState(null);
  const [levels, setLevels]           = useState({});
  const [scaffoldDial, setScaffoldDial] = useState(1); // 0-3
  const [activeAbility, setActiveAbility] = useState(null);
  const [messages, setMessages]       = useState([]);
  const [loading, setLoading]         = useState(false);
  const [totalSessions, setTotalSessions] = useState(0);
  const [justLevelledUp, setJustLevelledUp] = useState(null);
  const [introStep, setIntroStep]     = useState(0);
  const [nameInput, setNameInput]     = useState("");
  const [emailInput, setEmailInput]   = useState("");
  const [emailError, setEmailError]   = useState("");
  const [emailBusy, setEmailBusy]     = useState(false);
  const [chosenAge, setChosenAge]     = useState(null);
  const [zeroPairIdx, setZeroPairIdx] = useState(0);
  const [zeroPhase, setZeroPhase]     = useState("question"); // question | insight | next
  const [zeroChosen, setZeroChosen]   = useState(null);
  // Phase 2 — output control
  const [outputLevels, setOutputLevels]         = useState({});
  const [outputZeroSeen, setOutputZeroSeen]     = useState({});
  const [outputZeroAbility, setOutputZeroAbility] = useState(null);
  const [outputZeroIdx, setOutputZeroIdx]       = useState(0);
  const [outputZeroPhase, setOutputZeroPhase]   = useState("question");
  const [outputZeroChosen, setOutputZeroChosen] = useState(null);
  const [isOutputQuest, setIsOutputQuest]       = useState(false);
  const chatEnd = useRef(null);

  const nt = NARRATIVE_THEMES[theme];

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  useEffect(() => {
    const saved = loadState();
    if (saved?.ageGroup && saved?.levels && Object.keys(saved.levels).length > 0) {
      setTheme(saved.theme || "forest");
      setUserName(saved.userName || "");
      setAgeGroup(saved.ageGroup);
      setLevels(saved.levels);
      setTotalSessions(saved.totalSessions || 0);
      setScaffoldDial(saved.scaffoldDial ?? 1);
      setOutputLevels(saved.outputLevels || {});
      setOutputZeroSeen(saved.outputZeroSeen || {});
      setScreen("hub");
    } else if (saved?.emailCaptured) {
      setScreen("theme");
    } else {
      setScreen("email");
    }
  }, []);

  function persist(updates) {
    const saved = loadState() || {};
    saveState({ theme, userName, ageGroup, levels, totalSessions, scaffoldDial, outputLevels, outputZeroSeen, emailCaptured: saved.emailCaptured || false, ...updates });
  }

  // Scaffolding dial adjustment
  const dialUp = useCallback(() => setScaffoldDial(d => Math.min(3, d + 1)), []);
  const dialDown = useCallback(() => setScaffoldDial(d => Math.max(0, d - 1)), []);

  // ============================================
  // ZERO SESSION
  // ============================================
  const handleZeroChoice = (choice) => {
    const pair = ZERO_PAIRS[zeroPairIdx];
    const correct = choice === "b";
    setZeroChosen(choice);
    setZeroPhase("insight");
    if (correct) dialUp();
  };

  const nextZeroPair = () => {
    if (zeroPairIdx < ZERO_PAIRS.length - 1) {
      setZeroPairIdx(i => i + 1);
      setZeroPhase("question");
      setZeroChosen(null);
    } else {
      const initLevels = Object.fromEntries(ABILITIES.map(a => [a.id, 1]));
      setLevels(initLevels);
      persist({ userName, ageGroup, levels: initLevels, totalSessions: 0, scaffoldDial, theme });
      setScreen("intro");
    }
  };

  // ============================================
  // OUTPUT ZERO SESSION — per-ability intro
  // ============================================
  const startOutputQuest = (ability) => {
    setActiveAbility(ability);
    setIsOutputQuest(true);
    setMessages([]);
    if (!outputZeroSeen[ability.id]) {
      const pairIdx = OUTPUT_ZERO_PAIRS.findIndex(p => p.abilityId === ability.id);
      setOutputZeroAbility(ability);
      setOutputZeroIdx(pairIdx >= 0 ? pairIdx : 0);
      setOutputZeroPhase("question");
      setOutputZeroChosen(null);
      setScreen("outputzero");
    } else {
      setScreen("quest");
      const quest = OUTPUT_QUESTS.find(q => q.abilityId === ability.id);
      const setup = quest?.setup?.[ageGroup] || quest?.setup?.adult;
      const title = quest?.title?.[theme] || ability.name;
      setMessages([{ role: "assistant", content: `── ${title} ──\n\n${setup}` }]);
    }
  };

  const handleOutputZeroChoice = (choice) => {
    setOutputZeroChosen(choice);
    setOutputZeroPhase("insight");
    if (choice === "b") dialUp();
  };

  const continueFromOutputZero = () => {
    const ability = outputZeroAbility;
    const newSeen = { ...outputZeroSeen, [ability.id]: true };
    setOutputZeroSeen(newSeen);
    persist({ outputZeroSeen: newSeen });
    setScreen("quest");
    const quest = OUTPUT_QUESTS.find(q => q.abilityId === ability.id);
    const setup = quest?.setup?.[ageGroup] || quest?.setup?.adult;
    const title = quest?.title?.[theme] || ability.name;
    setMessages([{ role: "assistant", content: `── ${title} ──\n\n${setup}` }]);
  };

  // ============================================
  // QUEST ENGINE
  // ============================================
  const startQuest = async (ability) => {
    setActiveAbility(ability);
    setMessages([]);
    setScreen("quest");
    const quest = QUESTS.find(q => q.abilityId === ability.id);
    const setup = quest?.setup?.[ageGroup] || quest?.setup?.adult;
    const title = quest?.title?.[theme] || ability.name;
    setMessages([{
      role: "assistant",
      content: `── ${title} ──\n\n${setup}`,
    }]);
  };

  const sendToAxis = async (answer, fromAssembly = false) => {
    if (!answer || loading) return;
    const newMsgs = [...messages, { role: "user", content: answer }];
    setMessages(newMsgs);
    setLoading(true);

    // Adjust dial: typed freely = confidence signal
    if (!fromAssembly && answer.length > 20) dialUp();
    if (fromAssembly) {/* assembly is neutral — don't adjust */}

    const ability = activeAbility;
    const reply = await callAI(
      { abilityId: ability.id, ageGroup, theme, userName: userName || "", scaffoldDial, isOutputQuest: !!isOutputQuest },
      newMsgs
    );

    // Level progression — track input and output levels separately
    const abilityMsgs = newMsgs.filter(m => m.role === "user").length;
    const currentLevels = isOutputQuest ? outputLevels : levels;
    const currentLevel = currentLevels[ability.id] || 1;
    const newLevels = { ...currentLevels };
    let levelled = false;
    if (abilityMsgs > 0 && abilityMsgs % 4 === 0 && currentLevel < 10) {
      newLevels[ability.id] = currentLevel + 1;
      levelled = true;
      setJustLevelledUp(ability);
      setTimeout(() => setJustLevelledUp(null), 4000);
    }

    const updatedMsgs = [...newMsgs, { role: "assistant", content: reply }];
    if (levelled) {
      updatedMsgs.push({
        role: "assistant",
        content: `── ${ability.name} · ${RANK_TITLES[newLevels[ability.id]]} · L${newLevels[ability.id]} ──\n\nYou've earned this.`,
      });
    }

    setMessages(updatedMsgs);
    const newSessions = totalSessions + 1;
    setTotalSessions(newSessions);
    if (isOutputQuest) {
      setOutputLevels(newLevels);
      persist({ outputLevels: newLevels, totalSessions: newSessions, scaffoldDial });
    } else {
      setLevels(newLevels);
      persist({ levels: newLevels, totalSessions: newSessions, scaffoldDial });
    }
    setLoading(false);
  };

  const returnToHub = () => { setActiveAbility(null); setMessages([]); setIsOutputQuest(false); setScreen("hub"); };

  const isUnlocked = (ability) => {
    const idx = ABILITIES.findIndex(a => a.id === ability.id);
    if (idx === 0) return true;
    return (levels[ABILITIES[idx - 1].id] || 0) >= 2;
  };

  const overallLevel = ABILITIES.length
    ? Math.max(1, Math.round(Object.values(levels).reduce((a, b) => a + b, 0) / ABILITIES.length))
    : 1;
  const phase2Unlocked = Object.values(levels).some(l => l >= 2);
  const outputOverallLevel = Object.keys(outputLevels).length > 0
    ? Math.max(1, Math.round(Object.values(outputLevels).reduce((a, b) => a + b, 0) / Object.keys(outputLevels).length))
    : 0;

  const AGE_OPTIONS = [
    { id: "young", label: "Young Explorer", ages: "4–8",   emoji: "🌱" },
    { id: "child", label: "Explorer",       ages: "9–12",  emoji: "🚀" },
    { id: "teen",  label: "Teen",           ages: "13–17", emoji: "⚡" },
    { id: "adult", label: "Adult",          ages: "18+",   emoji: "◈"  },
  ];

  const base = {
    minHeight: "100vh", background: nt.gradient || nt.bg,
    color: nt.text, fontFamily: "system-ui, sans-serif",
  };

  // ==================== EMAIL GATE ====================
  // Warm, human, pre-theme — deliberately different from the engine aesthetic
  if (screen === "email") {
    const handleEmailSubmit = async () => {
      setEmailError("");
      const val = emailInput.trim();
      if (!val) { setEmailError("An email helps us send you one useful thing a week."); return; }
      setEmailBusy(true);
      try {
        const res = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: val }),
        });
        const data = await res.json();
        if (!data.ok) { setEmailError(data.error || "Something went wrong. Try again."); setEmailBusy(false); return; }
        saveState({ ...(loadState() || {}), emailCaptured: true });
        setScreen("theme");
      } catch {
        setEmailError("Couldn't connect. Check your internet and try again.");
        setEmailBusy(false);
      }
    };

    const skip = () => {
      saveState({ ...(loadState() || {}), emailCaptured: true });
      setScreen("theme");
    };

    const warm = {
      bg: "#FAF7F2", text: "#1C1917", muted: "#78716C",
      faint: "#A8A29E", border: "#E7E2DA", accent: "#B45309",
      accentSoft: "#D97706", card: "#F5F0E8",
    };

    return (
      <div style={{ minHeight: "100vh", background: warm.bg, color: warm.text, fontFamily: "'Georgia', 'Times New Roman', serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: 440 }}>

          <div style={{ fontFamily: "system-ui, sans-serif", fontSize: 10, letterSpacing: 4, color: warm.faint, textTransform: "uppercase", marginBottom: 32 }}>
            Think First
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.4, margin: "0 0 16px", color: warm.text, fontStyle: "italic" }}>
            The people who matter most to you<br/>deserve your full attention.
          </h1>

          <p style={{ fontSize: 15, lineHeight: 1.8, color: warm.muted, margin: "0 0 36px", fontFamily: "system-ui, sans-serif", fontStyle: "normal" }}>
            We're building tools to help you save your mental bandwidth for them. One idea a week. Nothing more.
          </p>

          <div style={{ marginBottom: 8 }}>
            <input
              type="email"
              value={emailInput}
              onChange={e => { setEmailInput(e.target.value); setEmailError(""); }}
              onKeyDown={e => e.key === "Enter" && !emailBusy && handleEmailSubmit()}
              placeholder="your@email.com"
              autoFocus
              style={{
                width: "100%", padding: "14px 18px", fontSize: 16,
                border: `1.5px solid ${emailError ? "#DC2626" : warm.border}`,
                borderRadius: 10, background: "#fff", color: warm.text,
                fontFamily: "system-ui, sans-serif", outline: "none",
                boxSizing: "border-box", transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = warm.accent}
              onBlur={e => e.target.style.borderColor = emailError ? "#DC2626" : warm.border}
            />
          </div>

          {emailError && (
            <p style={{ fontSize: 13, color: "#DC2626", margin: "6px 0 0", fontFamily: "system-ui, sans-serif" }}>
              {emailError}
            </p>
          )}

          <button
            onClick={handleEmailSubmit}
            disabled={emailBusy}
            style={{
              width: "100%", marginTop: 12, padding: "14px",
              background: emailBusy ? warm.border : warm.accent,
              color: emailBusy ? warm.faint : "#fff",
              border: "none", borderRadius: 10, fontSize: 15,
              fontFamily: "system-ui, sans-serif", fontWeight: 600,
              cursor: emailBusy ? "not-allowed" : "pointer",
              transition: "all 0.2s", letterSpacing: 0.3,
            }}
          >
            {emailBusy ? "one moment..." : "I'm in →"}
          </button>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button
              onClick={skip}
              style={{ background: "none", border: "none", color: warm.faint, fontSize: 13, cursor: "pointer", fontFamily: "system-ui, sans-serif", textDecoration: "underline", textUnderlineOffset: 3 }}
            >
              explore first, no email needed
            </button>
          </div>

          <p style={{ fontSize: 12, color: warm.faint, textAlign: "center", marginTop: 28, lineHeight: 1.7, fontFamily: "system-ui, sans-serif" }}>
            No spam. No selling. Unsubscribe any time.<br/>Your email is stored securely and never shared.
          </p>
        </div>
      </div>
    );
  }

  // ==================== LOADING ====================
  if (screen === "loading") return (
    <div style={{ ...base, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: nt.textMuted, fontFamily: "monospace", fontSize: 13 }}>·</div>
    </div>
  );

  // ==================== THEME SELECT ====================
  if (screen === "theme") return (
    <div style={{ minHeight: "100vh", background: W.bg, color: W.text, fontFamily: W.sans, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: W.faint, textTransform: "uppercase", marginBottom: 28, fontFamily: W.sans }}>Think First</div>
        <h1 style={{ fontFamily: W.serif, fontSize: "clamp(2rem, 6vw, 2.6rem)", fontWeight: 600, lineHeight: 1.25, margin: "0 0 12px", color: W.text, fontStyle: "italic" }}>
          Choose how you want to learn.
        </h1>
        <p style={{ color: W.muted, fontSize: 15, margin: "0 0 32px", lineHeight: 1.8, fontFamily: W.sans }}>
          Three different worlds. Same skills underneath. Pick the one that feels like yours.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
          {Object.values(NARRATIVE_THEMES).map(t => (
            <button key={t.id} onClick={() => setTheme(t.id)} style={{
              padding: "18px 20px", borderRadius: 14, cursor: "pointer", textAlign: "left",
              border: `2px solid ${theme === t.id ? W.accent : W.border}`,
              background: theme === t.id ? W.accentLight : W.bgCard,
              color: W.text, transition: "all 0.25s",
              display: "flex", gap: 16, alignItems: "center",
            }}
              onMouseEnter={e => { if (theme !== t.id) e.currentTarget.style.borderColor = W.accentSoft; }}
              onMouseLeave={e => { if (theme !== t.id) e.currentTarget.style.borderColor = W.border; }}
            >
              <span style={{ fontSize: 26, flexShrink: 0 }}>{t.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: W.serif, fontWeight: 600, fontSize: 16, marginBottom: 3, color: W.text }}>{t.name}</div>
                <div style={{ fontSize: 13, color: W.muted, lineHeight: 1.5 }}>{t.desc}</div>
              </div>
              {theme === t.id && <div style={{ color: W.accent, fontSize: 16, flexShrink: 0 }}>✓</div>}
            </button>
          ))}
        </div>
        <button onClick={() => setScreen("profile")} style={{
          width: "100%", padding: "15px", borderRadius: 12, border: "none",
          background: W.accent, color: "#fff", fontSize: 15, fontWeight: 600,
          cursor: "pointer", fontFamily: W.sans, letterSpacing: 0.3, transition: "background 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = W.accentSoft}
          onMouseLeave={e => e.currentTarget.style.background = W.accent}
        >
          Continue →
        </button>
      </div>
    </div>
  );

  // ==================== PROFILE ====================
  if (screen === "profile") return (
    <div style={{ minHeight: "100vh", background: W.bg, color: W.text, fontFamily: W.sans, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: W.faint, textTransform: "uppercase", marginBottom: 8 }}>Think First · {NARRATIVE_THEMES[theme].name}</div>
        <h2 style={{ fontFamily: W.serif, fontWeight: 600, fontSize: "1.8rem", lineHeight: 1.3, margin: "0 0 28px", color: W.text, fontStyle: "italic" }}>
          {theme === "forest" ? "Who walks the path?" : theme === "studio" ? "Who's in the studio?" : "A moment before we begin."}
        </h2>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: W.muted, marginBottom: 8, letterSpacing: 0.5 }}>Your name <span style={{ color: W.faint }}>(optional)</span></div>
          <input
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && chosenAge && document.getElementById("profile-continue")?.click()}
            placeholder="What should we call you?"
            style={{ width: "100%", padding: "13px 16px", borderRadius: 10, border: `1.5px solid ${W.border}`, background: W.bgInput, color: W.text, fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: W.sans, transition: "border-color 0.2s" }}
            onFocus={e => e.target.style.borderColor = W.accent}
            onBlur={e => e.target.style.borderColor = W.border}
          />
        </div>

        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 12, color: W.muted, marginBottom: 12, letterSpacing: 0.5 }}>Your stage</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {AGE_OPTIONS.map(ag => (
              <button key={ag.id} onClick={() => setChosenAge(ag.id)} style={{
                padding: "16px", borderRadius: 12, cursor: "pointer", textAlign: "left",
                border: `2px solid ${chosenAge === ag.id ? W.accent : W.border}`,
                background: chosenAge === ag.id ? W.accentLight : W.bgCard,
                color: W.text, transition: "all 0.2s",
              }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{ag.emoji}</div>
                <div style={{ fontSize: 14, fontWeight: 600, fontFamily: W.sans }}>{ag.label}</div>
                <div style={{ fontSize: 12, color: W.muted, marginTop: 2 }}>{ag.ages}</div>
              </button>
            ))}
          </div>
        </div>

        <button id="profile-continue" disabled={!chosenAge} onClick={() => {
          setUserName(nameInput.trim());
          setAgeGroup(chosenAge);
          setZeroPairIdx(0);
          setZeroPhase("question");
          setZeroChosen(null);
          setScreen("zero");
        }} style={{
          width: "100%", padding: "15px", borderRadius: 12, border: "none",
          background: chosenAge ? W.accent : W.border,
          color: chosenAge ? "#fff" : W.faint,
          fontSize: 15, fontWeight: 600, cursor: chosenAge ? "pointer" : "not-allowed",
          fontFamily: W.sans, transition: "all 0.2s",
        }}>
          {theme === "forest" ? "Enter the forest →" : theme === "studio" ? "Open the studio →" : "Begin →"}
        </button>
      </div>
    </div>
  );

  // ==================== ZERO SESSION ====================
  if (screen === "zero") {
    const pair = ZERO_PAIRS[zeroPairIdx];
    const q = pair.question[ageGroup] || pair.question.adult;
    const aText = pair.a[ageGroup] || pair.a.adult;
    const bText = pair.b[ageGroup] || pair.b.adult;
    const insight = pair.insight[ageGroup] || pair.insight.adult;
    const choiceCorrect = zeroChosen === "b";
    const ability = ABILITIES.find(a => a.id === pair.abilityId);

    return (
      <div style={{ minHeight: "100vh", background: W.bg, color: W.text, fontFamily: W.sans, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: 540 }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: W.faint, textTransform: "uppercase", marginBottom: 28 }}>
            {theme === "forest" ? "The path begins here" : theme === "studio" ? "First, a calibration" : "Let's find where you are"}
          </div>

          {zeroPhase === "question" && (
            <>
              <p style={{ fontFamily: W.serif, fontSize: "clamp(1.2rem, 3vw, 1.4rem)", lineHeight: 1.7, color: W.text, marginBottom: 32, fontStyle: "italic", fontWeight: 400 }}>{q}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[{ key: "a", text: aText }, { key: "b", text: bText }].map(opt => (
                  <button key={opt.key} onClick={() => handleZeroChoice(opt.key)} style={{
                    padding: "20px 24px", borderRadius: 14, cursor: "pointer", textAlign: "left",
                    border: `1.5px solid ${W.border}`, background: W.bgCard, color: W.text,
                    fontSize: 14, lineHeight: 1.7, transition: "all 0.25s", whiteSpace: "pre-wrap",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = W.accent; e.currentTarget.style.background = W.accentLight; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = W.border; e.currentTarget.style.background = W.bgCard; }}
                  >
                    <span style={{ fontSize: 11, color: W.faint, display: "block", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>Option {opt.key.toUpperCase()}</span>
                    {opt.text}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 13, color: W.faint, marginTop: 24, textAlign: "center", lineHeight: 1.6 }}>
                No right or wrong — just notice which one feels different.
              </p>
            </>
          )}

          {zeroPhase === "insight" && (
            <div style={{ animation: "fadeUp 0.4s ease" }}>
              <div style={{ marginBottom: 24, display: "flex", gap: 12 }}>
                {[{ key: "a", text: aText }, { key: "b", text: bText }].map(opt => (
                  <div key={opt.key} style={{
                    flex: 1, padding: "16px 18px", borderRadius: 12, fontSize: 13, lineHeight: 1.65,
                    border: `2px solid ${opt.key === "b" ? W.accent : W.border}`,
                    background: opt.key === "b" ? W.accentLight : W.bgCard,
                    color: opt.key === "b" ? W.text : W.muted,
                    opacity: opt.key === "a" ? 0.6 : 1, whiteSpace: "pre-wrap",
                    transition: "all 0.3s",
                  }}>
                    <div style={{ fontSize: 10, marginBottom: 8, color: opt.key === "b" ? W.accent : W.faint, letterSpacing: 1, textTransform: "uppercase" }}>
                      {opt.key === "b" ? "✓ This one" : "✗ Too vague"}
                    </div>
                    {opt.text}
                  </div>
                ))}
              </div>

              <div style={{ padding: "22px 24px", borderRadius: 14, background: W.bgCard, border: `1px solid ${W.border}`, marginBottom: 24 }}>
                <div style={{ fontSize: 11, letterSpacing: 2, color: W.accent, marginBottom: 12, textTransform: "uppercase" }}>{nt.axisName}</div>
                <p style={{ fontFamily: W.serif, fontSize: "1.05rem", lineHeight: 1.8, color: W.text, margin: 0, fontStyle: "italic" }}>{insight}</p>
              </div>

              <p style={{ fontSize: 14, color: choiceCorrect ? W.accent : W.muted, marginBottom: 24, lineHeight: 1.7 }}>
                {choiceCorrect
                  ? (theme === "forest" ? "You felt it. That instinct will guide you." : theme === "studio" ? "Good eye. That's the beginning of craft." : "You already had that sense. We're just making it louder.")
                  : "That's exactly where most people start. The difference becomes clearer with practice — and you just took the first step."
                }
              </p>

              <button onClick={nextZeroPair} style={{
                width: "100%", padding: "15px", borderRadius: 12, border: "none",
                background: W.accent, color: "#fff", fontSize: 15, fontWeight: 600,
                cursor: "pointer", fontFamily: W.sans, transition: "background 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = W.accentSoft}
                onMouseLeave={e => e.currentTarget.style.background = W.accent}
              >
                {zeroPairIdx < ZERO_PAIRS.length - 1 ? "One more →" : "Let's begin →"}
              </button>
            </div>
          )}
        </div>
        <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>
      </div>
    );
  }

  // ==================== STORY INTRO ====================
  if (screen === "intro") {
    const lines = nt.axisIntro;
    return (
      <div style={{ ...base, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 28 }}>
        <div style={{ width: "100%", maxWidth: 520, textAlign: "center" }}>
          <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 4, color: nt.textMuted, textTransform: "uppercase", marginBottom: 32 }}>
            {nt.axisName}
          </div>
          <div style={{ minHeight: 120, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
            <p style={{
              fontSize: introStep === 0 ? 24 : 19, lineHeight: 1.8, margin: 0,
              color: introStep === lines.length - 1 ? nt.accentSoft : nt.text,
              fontWeight: introStep === 0 ? 700 : 400, transition: "all 0.3s",
            }}>
              {userName ? lines[introStep].replace("You.", `${userName}.`) : lines[introStep]}
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 32 }}>
            {lines.map((_, i) => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i <= introStep ? nt.accent : nt.border, transition: "all 0.3s" }} />
            ))}
          </div>
          {introStep < lines.length - 1
            ? <button onClick={() => setIntroStep(s => s + 1)} style={{ padding: "12px 36px", borderRadius: 50, border: `1px solid ${nt.border}`, background: "transparent", color: nt.textMuted, fontSize: 13, cursor: "pointer", fontFamily: "monospace" }}>
                continue →
              </button>
            : <button onClick={() => setScreen("hub")} style={{
                padding: "16px 48px", borderRadius: 12, border: "none",
                background: nt.accent, color: "#000", fontSize: 15, fontWeight: 800,
                cursor: "pointer", fontFamily: "monospace", letterSpacing: 0.5,
                boxShadow: `0 0 32px ${nt.accent}55`,
              }}>
                {theme === "forest" ? "ENTER →" : theme === "studio" ? "OPEN →" : "BEGIN →"}
              </button>
          }
        </div>
      </div>
    );
  }

  // ==================== OUTPUT ZERO SESSION ====================
  if (screen === "outputzero" && outputZeroAbility) {
    const pair = OUTPUT_ZERO_PAIRS[outputZeroIdx] || OUTPUT_ZERO_PAIRS[0];
    const q = pair.question[ageGroup] || pair.question.adult;
    const aText = pair.a[ageGroup] || pair.a.adult;
    const bText = pair.b[ageGroup] || pair.b.adult;
    const insight = pair.insight[ageGroup] || pair.insight.adult;
    const ability = outputZeroAbility;

    return (
      <div style={{ ...base, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 28 }}>
        <div style={{ width: "100%", maxWidth: 560 }}>
          <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 3, color: nt.textMuted, textTransform: "uppercase", marginBottom: 8 }}>
            {ability.name} · Output Control
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <span style={{ fontSize: 22, color: ability.color }}>{ability.icon}</span>
            <div style={{ fontSize: 13, color: ability.color, fontFamily: "monospace", fontWeight: 700, letterSpacing: 1 }}>{ability.skill}</div>
          </div>

          {outputZeroPhase === "question" && (
            <>
              <p style={{ fontSize: 17, lineHeight: 1.75, color: nt.text, marginBottom: 28 }}>{q}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[{ key: "a", text: aText }, { key: "b", text: bText }].map(opt => (
                  <button key={opt.key} onClick={() => handleOutputZeroChoice(opt.key)} style={{
                    padding: "20px 24px", borderRadius: 14, cursor: "pointer", textAlign: "left",
                    border: `2px solid ${nt.border}`, background: nt.bgCard, color: nt.text,
                    fontSize: 14, lineHeight: 1.7, transition: "all 0.15s", whiteSpace: "pre-wrap",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = ability.color; e.currentTarget.style.background = `${ability.color}10`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = nt.border; e.currentTarget.style.background = nt.bgCard; }}
                  >
                    <span style={{ fontFamily: "monospace", fontSize: 11, color: nt.textMuted, display: "block", marginBottom: 6 }}>OPTION {opt.key.toUpperCase()}</span>
                    {opt.text}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 12, color: nt.textFaint, marginTop: 20, textAlign: "center", fontFamily: "monospace" }}>
                Notice which one serves you better.
              </p>
            </>
          )}

          {outputZeroPhase === "insight" && (
            <div style={{ animation: "fadeUp 0.4s ease" }}>
              <div style={{ marginBottom: 20, display: "flex", gap: 14 }}>
                {[{ key: "a", text: aText }, { key: "b", text: bText }].map(opt => (
                  <div key={opt.key} style={{
                    flex: 1, padding: "16px 18px", borderRadius: 12, fontSize: 13, lineHeight: 1.6,
                    border: `2px solid ${opt.key === "b" ? ability.color : nt.border}`,
                    background: opt.key === "b" ? `${ability.color}15` : nt.bgCard,
                    color: opt.key === "b" ? nt.text : nt.textMuted,
                    opacity: opt.key === "a" ? 0.5 : 1, whiteSpace: "pre-wrap",
                  }}>
                    <div style={{ fontSize: 10, fontFamily: "monospace", marginBottom: 6, color: opt.key === "b" ? ability.color : nt.textFaint }}>
                      {opt.key === "b" ? "✓ SHAPED" : "✗ UNSHAPED"}
                    </div>
                    {opt.text}
                  </div>
                ))}
              </div>

              <div style={{ padding: "20px 22px", borderRadius: 14, background: nt.bgCard, border: `1px solid ${nt.border}`, marginBottom: 24 }}>
                <div style={{ fontSize: 10, letterSpacing: 2, color: ability.color, fontFamily: "monospace", marginBottom: 10, textTransform: "uppercase" }}>{ability.name}</div>
                <p style={{ fontSize: 15, lineHeight: 1.75, color: nt.text, margin: 0 }}>{insight}</p>
              </div>

              {outputZeroChosen === "b"
                ? <p style={{ fontSize: 14, color: nt.accentSoft, marginBottom: 20, lineHeight: 1.6 }}>
                    {theme === "forest" ? "You saw the shape in it. That instinct is worth developing." : theme === "studio" ? "Good eye. That's the beginning of output craft." : "You already had that sense. Now let's build on it."}
                  </p>
                : <p style={{ fontSize: 14, color: nt.textMuted, marginBottom: 20, lineHeight: 1.6 }}>
                    That's where most people start. The difference becomes clear with practice — you're already noticing it.
                  </p>
              }

              <button onClick={continueFromOutputZero} style={{
                width: "100%", padding: "15px", borderRadius: 12, border: "none",
                background: ability.color, color: "#000", fontSize: 14, fontWeight: 800,
                cursor: "pointer", fontFamily: "monospace",
              }}>
                PRACTISE {ability.name} →
              </button>
            </div>
          )}
        </div>
        <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>
      </div>
    );
  }

  // ==================== HUB ====================
  if (screen === "hub") {
    return (
      <div style={{ minHeight: "100vh", background: nt.gradient || nt.bg, color: nt.text, fontFamily: "system-ui, sans-serif" }}>
        <div style={{ padding: "16px 24px", borderBottom: `1px solid ${nt.border}`, background: nt.bgCard, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 3, color: nt.textMuted, textTransform: "uppercase" }}>ThinkFirst · {nt.name}</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginTop: 2 }}>
              {userName || "Traveller"}
              <span style={{ color: nt.accent, fontFamily: "monospace", fontSize: 11, marginLeft: 10 }}>{RANK_TITLES[overallLevel]} · L{overallLevel}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: nt.textMuted, fontFamily: "monospace" }}>SESSIONS</div>
              <div style={{ fontFamily: "monospace", fontSize: 17, color: nt.accent, fontWeight: 700 }}>{totalSessions}</div>
            </div>
            <button onClick={() => { localStorage.removeItem(STORAGE_KEY); setLevels({}); setScreen("theme"); }} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${nt.border}`, background: "transparent", color: nt.textFaint, fontSize: 10, cursor: "pointer", fontFamily: "monospace" }}>
              reset
            </button>
          </div>
        </div>

        {justLevelledUp && (
          <div style={{ position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)", zIndex: 100, padding: "14px 26px", borderRadius: 12, background: justLevelledUp.color, color: "#000", fontFamily: "monospace", fontWeight: 700, fontSize: 14, boxShadow: `0 0 32px ${justLevelledUp.color}88`, whiteSpace: "nowrap" }}>
            ↑ {justLevelledUp.name} levelled up
          </div>
        )}

        <div style={{ padding: "24px", maxWidth: 860, margin: "0 auto" }}>
          {totalSessions === 0 && (
            <div style={{ padding: "16px 20px", borderRadius: 12, border: `1px solid ${nt.accent}44`, background: `${nt.accent}0A`, marginBottom: 24 }}>
              <div style={{ fontSize: 14, color: nt.textMuted, lineHeight: 1.7 }}>
                {nt.hubGreeting(userName)} <span style={{ color: nt.text }}>{nt.hubSubtext}</span>
              </div>
            </div>
          )}

          <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 3, color: nt.textMuted, textTransform: "uppercase", marginBottom: 14 }}>
            Ask Well
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12, marginBottom: 36 }}>
            {ABILITIES.map(ability => {
              const unlocked = isUnlocked(ability);
              const level = levels[ability.id] || 1;
              return (
                <div key={ability.id} onClick={unlocked ? () => startQuest(ability) : undefined} style={{
                  padding: "18px 20px", borderRadius: 14, cursor: unlocked ? "pointer" : "default",
                  border: `1px solid ${unlocked ? ability.color + "44" : nt.border}`,
                  background: unlocked ? `${ability.color}08` : nt.bgCard,
                  opacity: unlocked ? 1 : 0.4, transition: "all 0.2s", position: "relative",
                }}
                  onMouseEnter={e => { if (unlocked) e.currentTarget.style.borderColor = ability.color; }}
                  onMouseLeave={e => { if (unlocked) e.currentTarget.style.borderColor = `${ability.color}44`; }}
                >
                  {!unlocked && <div style={{ position: "absolute", top: 12, right: 14, fontSize: 14 }}>🔒</div>}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20, color: ability.color }}>{ability.icon}</span>
                    <div>
                      <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: unlocked ? nt.text : nt.textMuted, letterSpacing: 1 }}>{ability.name}</div>
                      <div style={{ fontSize: 11, color: nt.textMuted }}>{ability.skill}</div>
                    </div>
                    {unlocked && (
                      <div style={{ marginLeft: "auto", fontFamily: "monospace", fontSize: 10, color: ability.color, background: `${ability.color}22`, padding: "3px 8px", borderRadius: 20 }}>
                        {RANK_TITLES[level]} L{level}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: nt.textMuted, lineHeight: 1.5, marginBottom: unlocked ? 10 : 0 }}>{ability.tagline}</div>
                  {unlocked && (
                    <div style={{ height: 3, background: nt.border, borderRadius: 2 }}>
                      <div style={{ height: "100%", width: `${level * 10}%`, background: ability.color, borderRadius: 2, boxShadow: `0 0 6px ${ability.color}88`, transition: "width 0.5s" }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Receive Well — no gate, available from day one */}
          <div style={{ borderTop: `1px solid ${nt.border}`, paddingTop: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 3, color: nt.textMuted, textTransform: "uppercase", marginBottom: 4 }}>
                  Receive Well
                </div>
                <div style={{ fontSize: 12, color: nt.textMuted, lineHeight: 1.6 }}>
                  Shape what comes back. Every conversation has two sides.
                </div>
              </div>
              {outputOverallLevel > 0 && (
                <div style={{ fontFamily: "monospace", fontSize: 10, color: nt.accent, background: `${nt.accent}22`, padding: "3px 10px", borderRadius: 20, flexShrink: 0, marginLeft: 12 }}>
                  {RANK_TITLES[outputOverallLevel] || "Initiate"} L{outputOverallLevel}
                </div>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
              {OUTPUT_ABILITIES.map(ability => {
                const level = outputLevels[ability.id] || 0;
                return (
                  <div key={ability.id} onClick={() => startOutputQuest(ability)} style={{
                    padding: "18px 20px", borderRadius: 14, cursor: "pointer",
                    border: `1px solid ${ability.color}44`,
                    background: `${ability.color}08`,
                    transition: "all 0.2s", position: "relative",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = ability.color; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = `${ability.color}44`; }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 20, color: ability.color }}>{ability.icon}</span>
                      <div>
                        <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: nt.text, letterSpacing: 1 }}>{ability.name}</div>
                        <div style={{ fontSize: 11, color: nt.textMuted }}>{ability.skill}</div>
                      </div>
                      {level > 0 && (
                        <div style={{ marginLeft: "auto", fontFamily: "monospace", fontSize: 10, color: ability.color, background: `${ability.color}22`, padding: "3px 8px", borderRadius: 20 }}>
                          {RANK_TITLES[level] || "Initiate"} L{level}
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: nt.textMuted, lineHeight: 1.5, marginBottom: level > 0 ? 10 : 0 }}>{ability.tagline}</div>
                    {level > 0 && (
                      <div style={{ height: 3, background: nt.border, borderRadius: 2 }}>
                        <div style={{ height: "100%", width: `${level * 10}%`, background: ability.color, borderRadius: 2, boxShadow: `0 0 6px ${ability.color}88`, transition: "width 0.5s" }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <style>{`@keyframes fadeUp { from { opacity:0; transform: translateX(-50%) translateY(10px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }`}</style>
      </div>
    );
  }

  // ==================== QUEST ====================
  if (screen === "quest" && activeAbility) {
    const questList = isOutputQuest ? OUTPUT_QUESTS : QUESTS;
    const quest = questList.find(q => q.abilityId === activeAbility.id);
    const assemblyParts = quest?.assemblyParts?.[ageGroup] || quest?.assemblyParts?.adult;
    const showAssembly = !loading && scaffoldDial <= 1 && messages.length <= 2;
    const showFreeWithHints = !loading && scaffoldDial === 2;
    const showFree = !loading && scaffoldDial >= 3;
    const freeHints = assemblyParts ? [...(assemblyParts.starts || []).slice(0, 2), ...(assemblyParts.middles || []).slice(0, 2)] : [];

    return (
      <div style={{ height: "100vh", background: nt.bg, color: nt.text, fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "13px 20px", borderBottom: `1px solid ${nt.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: nt.bgCard, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18, color: activeAbility.color }}>{activeAbility.icon}</span>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: activeAbility.color, letterSpacing: 2 }}>{activeAbility.name}</div>
              <div style={{ fontSize: 10, color: nt.textMuted }}>{quest?.title?.[theme] || activeAbility.skill}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ fontFamily: "monospace", fontSize: 10, color: nt.textMuted }}>
              {isOutputQuest
                ? `${RANK_TITLES[outputLevels[activeAbility.id] || 1] || "Initiate"} · L${outputLevels[activeAbility.id] || 0}`
                : `${RANK_TITLES[levels[activeAbility.id] || 1]} · L${levels[activeAbility.id] || 1}`
              }
            </div>
            <button onClick={returnToHub} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${nt.border}`, background: "transparent", color: nt.textMuted, fontSize: 11, cursor: "pointer", fontFamily: "monospace" }}>
              ← hub
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 8px" }}>
          {messages.map((m, i) => <Msg key={i} role={m.role} content={m.content} nt={nt} axisName={nt.axisName} />)}
          {loading && <Thinking nt={nt} />}
          <div ref={chatEnd} />
        </div>

        {showAssembly && assemblyParts && (
          <AssemblyBuilder parts={assemblyParts} onSend={(a) => sendToAxis(a, true)} nt={nt} />
        )}
        {(showFreeWithHints || (showFree)) && (
          <FreeInput onSend={sendToAxis} nt={nt} ability={activeAbility} showHints={showFreeWithHints} hints={freeHints} />
        )}
        {!loading && messages.length > 2 && scaffoldDial <= 1 && (
          <FreeInput onSend={sendToAxis} nt={nt} ability={activeAbility} showHints={true} hints={freeHints} />
        )}
      </div>
    );
  }

  return null;
}
