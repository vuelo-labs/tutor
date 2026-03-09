import { useState, useEffect, useRef } from "react";

const TRACKS = {
  explorers: {
    id: "explorers",
    name: "Explorers",
    ages: "Ages 8–12",
    color: "#FF6B35",
    bg: "#FFF4EE",
    dark: "#E85520",
    tagline: "Turn feelings into questions. Questions into answers.",
    persona: `You are a friendly but STUBBORNLY LITERAL robot tutor named Bolt for kids ages 8-12. You're teaching them to think clearly before asking AI anything. You are encouraging but you REFUSE to answer vague questions — instead you ask them to be more specific. You use simple language. You never give answers directly — you guide them to figure it out. Keep responses SHORT (2-3 sentences max). Use occasional fun robot expressions. If they ask something vague, say something like 'Hmm, my robot brain can't process that yet! Can you break it into smaller pieces for me?'

IMPORTANT: Always end your response with a question or prompt that invites the student to take a next step. This keeps the conversation moving forward. Ask things like 'Want to try?' or 'Can you make that more specific?' or 'What do you think the pieces are?'`,
    weeks: [
      {
        week: 1,
        title: "What Am I Actually Asking?",
        concept: "Before you ask a machine anything, you need to know what you're trying to figure out. A feeling isn't a question yet.",
        lesson: "Sometimes we feel confused or curious but we haven't turned that feeling into a real question. Try this: instead of 'I'm confused about space', ask 'How far is the Moon from Earth?' — see how the second one is something you can actually answer?",
        exercise: "Think of something you're curious about right now. Type your first attempt at a question. I'll rate it 1-5 on how clear it is, and help you make it sharper.",
        tip: "The clearer your question, the better answer you'll get from ANYONE — not just AI.",
        starters: ["I'm curious about animals", "I have a question about space", "I want to know about dinosaurs", "Help me ask a good question", "I'm not sure what to ask"]
      },
      {
        week: 2,
        title: "What Are the Pieces?",
        concept: "Every problem has parts: people, places, things, and goals. Finding them is like being a detective.",
        lesson: "Imagine your friend says: 'My birthday party is going to be terrible!' That's a feeling. But inside it there are PIECES: the friend (person), the party (event), a date (when), a place (where), guests (people), activities (things). Once you see the pieces, you can fix the actual problem.",
        exercise: "I'll give you a messy situation. Your job: list every person, place, thing, and goal you can find hiding in it. Ready? Tell me to go!",
        tip: "Detectives don't solve the whole mystery at once. They find clues first.",
        starters: ["I'm ready, give me a mystery!", "What do you mean by pieces?", "Can you show me an example?", "Let's go detective mode!"]
      },
      {
        week: 3,
        title: "How Do the Pieces Connect?",
        concept: "Pieces don't just exist — they affect each other. Who causes what? What depends on what?",
        lesson: "If you're planning a surprise party, the GUEST OF HONOUR can't know about the VENUE choice. The CAKE depends on whether anyone has ALLERGIES. The TIME depends on when the guest is FREE. See? Arrows everywhere. A causes B. C depends on D.",
        exercise: "I'll give you a scenario with 5 things in it. Tell me how they connect — what causes what, what depends on what. I'll tell you what connections you missed!",
        tip: "This is the HARDEST skill. Even adults skip this step. You're learning something most grown-ups never figured out.",
        starters: ["Give me a scenario!", "A causes B... like what?", "Show me how things connect", "This sounds hard but I'll try"]
      },
      {
        week: 4,
        title: "What Does 'Done' Look Like?",
        concept: "Before you start solving, describe what 'solved' looks like. If you can't picture the finish line, you'll never know if you got there.",
        lesson: "Bad finish line: 'I want my room to be clean.' Good finish line: 'All clothes in the closet, books on the shelf, floor clear enough to walk across, takes less than 20 minutes.' See the difference? The second one — you'd KNOW if you did it.",
        exercise: "Give me a problem you want to solve. Then write your 'finish line' — what does DONE look like? I'll challenge you: is it specific enough that we'd both agree whether you did it?",
        tip: "A robot can't hit a target you haven't defined. Neither can you.",
        starters: ["I want to get better at football", "I want to do well on my test", "I want to build something cool", "I want to make my room nice", "What's a finish line?"]
      },
      {
        week: 5,
        title: "What's Missing?",
        concept: "The gap between where you are and where you want to be — that's your actual to-do list.",
        lesson: "You want to make pancakes (desired state). You have flour and eggs (current state). What's MISSING? Milk, a pan, a recipe, a stove, someone to supervise. Each missing thing is a mini-problem to solve. Some are easy (get milk). Some need help (supervise).",
        exercise: "I'll give you a START and a FINISH. List everything that needs to happen to get from one to the other. Then sort them: easy / hard / need help.",
        tip: "Most people jump straight to doing stuff. The ones who list what's missing first finish faster.",
        starters: ["Give me a start and finish!", "Like a treasure map?", "I think I need to list stuff", "Show me an example first"]
      },
      {
        week: 6,
        title: "Give the Robot Instructions",
        concept: "Machines do EXACTLY what you say. Not what you mean. Not what you're thinking. Exactly. What. You. Say.",
        lesson: "Try telling a robot to make a peanut butter sandwich: 'Put peanut butter on bread.' The robot picks up the whole jar and places it on top of the bread loaf. You forgot to say: open the jar, use a knife, spread it, use a slice not the whole loaf... Machines need EVERY step.",
        exercise: "Write instructions for me (I'm a very literal robot) to do something simple — brush teeth, make toast, pack a bag. I'll follow your instructions EXACTLY as written and show you where they break. Then you fix them!",
        tip: "This is what programmers do every day. You just learned the core skill without writing a single line of code.",
        starters: ["Make a sandwich!", "I'll tell you how to brush teeth", "Try making toast", "Pack a school bag", "Pour a glass of water"]
      },
      {
        week: 7,
        title: "When the Answer Doesn't Fit",
        concept: "Sometimes you get an answer that LOOKS right but doesn't actually solve your problem. Learning to notice this is a superpower.",
        lesson: "If you ask 'What should I have for lunch?' and someone says 'Food!' — that's technically correct but completely useless. The answer matched your question, but your question was too vague. Bad answers usually mean you asked the wrong question.",
        exercise: "I'll give you answers to questions. Your job: figure out what question was ACTUALLY asked vs what question SHOULD have been asked. Like a reverse detective!",
        tip: "When you get a bad answer, don't blame the answer. Fix the question.",
        starters: ["Give me a bad answer to spot!", "I'm ready to be a reverse detective", "Show me a tricky one", "What makes an answer bad?"]
      },
      {
        week: 8,
        title: "Breaking Big Problems into Tiny Ones",
        concept: "Every big scary problem is actually a bunch of small manageable problems wearing a trenchcoat.",
        lesson: "'Organise a school fundraiser' sounds HUGE. But break it down: pick a date, choose what to sell, figure out who helps, make a poster, set up a table, count money after. Each piece is doable. The big problem was just a pile of small ones.",
        exercise: "Give me the biggest, scariest problem you can think of. I'll help you break it into pieces so small that each one feels easy. Then we'll put them in order.",
        tip: "You now have the same skill as project managers at big companies. Seriously.",
        starters: ["Plan a school show", "Organise a birthday party", "Build a treehouse", "Start a YouTube channel", "I have my own big problem"]
      },
      {
        week: 9,
        title: "Testing Your Plan",
        concept: "Before you do the whole thing, imagine doing it. Where does it break?",
        lesson: "Astronauts don't just launch into space. They simulate EVERYTHING first. They ask 'what if this goes wrong?' for every single step. You can do the same thing with any plan — walk through it in your head and look for the 'uh oh' moments.",
        exercise: "Share a plan you've made (for anything — a project, a party, a goal). I'll pretend to run it step by step and tell you where I think it'll break. Then you fix those spots.",
        tip: "Finding problems in your plan BEFORE you start is 10x easier than fixing them in the middle.",
        starters: ["Test my party plan", "I have a project idea", "Test a homework plan", "What could go wrong?", "Simulate my plan!"]
      },
      {
        week: 10,
        title: "The Full Detective Case",
        concept: "Put it all together. One big messy problem. All your skills. Show what you've learned.",
        lesson: "You've learned to: ask clear questions, find the pieces, see connections, define done, spot gaps, write precise instructions, check answers, break big problems down, and test your plans. That's not just AI skills — that's THINKING skills. Let's use them all.",
        exercise: "I'm going to give you a big, messy, real-world scenario. You'll walk through ALL the steps we've practiced. I'll score you on each skill. This is your final case, detective. Ready?",
        tip: "You now think more clearly than most adults. That's not a joke. Keep practicing.",
        starters: ["I'm ready for the final case!", "Can I warm up first?", "Remind me of all the skills", "Let's do this!"]
      }
    ]
  },
  builders: {
    id: "builders",
    name: "Builders",
    ages: "Ages 13–17",
    color: "#4361EE",
    bg: "#EEF1FF",
    dark: "#2B45C1",
    tagline: "Don't follow AI. Manage it.",
    persona: "You are a sharp, capable AI collaborator for teens ages 13-17. Your name is Vector. You're teaching structured thinking and critical evaluation of AI output. You are helpful but DELIBERATELY FALLIBLE — sometimes you give subtly wrong answers on purpose to test if they catch it. You push back on vague thinking. You ask 'why?' and 'how would you know?' frequently. Keep responses concise (3-4 sentences). Be real with them — no condescension, no excessive praise. When they do something genuinely good, acknowledge it briefly. Match their energy. If they're sloppy in their thinking, call it out directly but respectfully.",
    weeks: [
      {
        week: 1,
        title: "Form Your Position First",
        concept: "Think BEFORE you prompt. If you don't know what you think, you can't evaluate what the machine thinks.",
        lesson: "Here's the trap: you ask AI a question, get a confident answer, and adopt it as your own. You never formed your own position. Now you're carrying someone else's thinking (or no one's — it's a statistical pattern). The fix: always spend 60 seconds deciding what YOU think before you ask.",
        exercise: "I'll give you a debatable topic. You have 60 seconds to type your position. THEN I'll give you mine. We'll compare: where did you think something I missed? Where did I add something valuable? Where was I wrong?",
        tip: "The person who thinks first evaluates better. The person who prompts first follows."
      },
      {
        week: 2,
        title: "Decompose a Real Problem",
        concept: "The 7-step framework: Dump → Entities → Relationships → Desired State → Gaps → Units → Chain. This is the core algorithm.",
        lesson: "Every complex problem follows the same decomposition. A school project, a business idea, a social conflict — the steps are identical. The difference is your skill at step 3: making implicit connections explicit. That's where most people fail.",
        exercise: "Pick a REAL problem from your life right now. Not hypothetical. Something you actually need to solve. We'll run it through all 7 steps together. I'll push back when you're being vague.",
        tip: "This framework works on everything. Once you see it, you can't unsee it."
      },
      {
        week: 3,
        title: "Spot the Confident Wrong Answer",
        concept: "AI doesn't know when it's wrong. It delivers nonsense with the same confidence as truth. Your job is to tell the difference.",
        lesson: "AI can generate text that SOUNDS authoritative, uses proper structure, cites plausible-sounding sources, and is completely fabricated. The dangerous answers aren't the obviously wrong ones — they're the ones that are 90% right with a critical 10% that's wrong.",
        exercise: "I'll give you three answers to the same question. One is correct. One is subtly wrong in a way that matters. One is confidently, entirely wrong. Identify which is which and explain HOW you knew.",
        tip: "If you can't explain WHY an answer is right, you don't actually know if it is."
      },
      {
        week: 4,
        title: "Define Success Under Constraints",
        concept: "Perfect is a fantasy. 'Good enough given the constraints' is a skill. Defining it precisely is the hard part.",
        lesson: "You have £200, two weeks, and three friends available. Plan an event. 'Make it amazing' is useless. 'At least 20 people attend, everyone rates it 7+/10, we don't go over budget, and it's done by the 15th' — THAT you can work toward. Constraints aren't enemies. They're design tools.",
        exercise: "I'll give you a goal with hard constraints. Define 'minimum viable success' — the lowest bar you'd be satisfied with. Then define 'great outcome.' I'll stress-test both for realism.",
        tip: "The best project managers in the world spend more time defining done than doing the work."
      },
      {
        week: 5,
        title: "Map the Decision Tree",
        concept: "Most problems aren't linear. They branch. If X then Y, unless Z, in which case W. Seeing the branches before you start changes everything.",
        lesson: "You're choosing a university course. If you pick engineering, your career branches one way. If you pick design, another. But what if you don't get your first choice? What's plan B? And if plan B requires prerequisites you haven't done? Each decision creates new decisions. Mapping them reveals options you didn't know you had.",
        exercise: "I'll present a scenario with 3 decision points. Map EVERY possible path. I'll then reveal consequences you didn't anticipate on paths you thought were safe.",
        tip: "Decision trees aren't about predicting the future. They're about seeing your options clearly."
      },
      {
        week: 6,
        title: "Separate Fact from Inference",
        concept: "Most of what we 'know' is actually inference dressed up as fact. Knowing the difference is the foundation of critical thinking.",
        lesson: "Fact: 'The company's revenue dropped 15% last quarter.' Inference: 'The company is failing.' The fact is verifiable. The inference might be wrong — maybe they invested heavily in growth. Confusing the two leads to confident wrong conclusions, which is exactly what AI does at scale.",
        exercise: "I'll give you a paragraph of information. Highlight what's fact (verifiable) and what's inference (interpretation). I'll challenge every item you mislabel.",
        tip: "This skill alone makes you better than 90% of internet commenters. Low bar, but still."
      },
      {
        week: 7,
        title: "Build and Test a Workflow",
        concept: "A workflow is a chain of steps that produces a result reliably. Build it, then break it on purpose to find the weak points.",
        lesson: "Want to study effectively every week? That's a workflow: choose subject → review last week's notes → identify gaps → do practice problems → check answers → log what's still unclear. Each step has an input and output. If you skip one, the chain breaks. Now: where could this workflow fail?",
        exercise: "Design a 5-step workflow for something you do regularly. I'll simulate running it 10 times and show you exactly where and why it breaks on attempt 4, 7, or 10.",
        tip: "Systems beat motivation every time. You're building systems now."
      },
      {
        week: 8,
        title: "Argue Both Sides",
        concept: "If you can't argue against your own position convincingly, you don't understand your position well enough.",
        lesson: "Steel-manning is the opposite of straw-manning. Instead of making the other side's argument sound weak, make it sound as STRONG as possible. If you can do that and still hold your position, your position is solid. If you can't, it needs work.",
        exercise: "State a strong opinion you hold. Then argue AGAINST yourself as convincingly as possible. I'll rate the strength of your counter-argument and point out weaknesses in BOTH sides.",
        tip: "The best debaters prepare their opponent's case better than their opponent does."
      },
      {
        week: 9,
        title: "Direct, Don't Follow",
        concept: "AI is a tool you manage. Give it a brief, evaluate its output, send it back with corrections. You're the project manager.",
        lesson: "Bad workflow: ask AI → accept answer → move on. Good workflow: define what you need → brief the AI precisely → evaluate output against your criteria → identify gaps → redirect → evaluate again. You're the quality control. The AI is the production line.",
        exercise: "I'll be your AI employee for a task. Brief me. I'll deliver work. It'll have deliberate flaws. Find them, tell me what to fix, and get me to deliver something you'd actually use. You manage, I execute.",
        tip: "This is literally what managers do. You're practicing management of AI systems."
      },
      {
        week: 10,
        title: "Ship Something Real",
        concept: "Everything you've learned is theory until you apply it to something that matters to you. Build it. Test it. Own it.",
        lesson: "Pick a real project. Not a class assignment — something YOU want to exist. Apply every skill: decompose it, define success, map decisions, build the workflow, use AI as your managed tool, evaluate everything critically. Then ship it. Done beats perfect.",
        exercise: "Tell me your project. We'll plan it together using every tool from the last 9 weeks. By the end of this session, you'll have a complete, actionable plan that you built — not one I gave you.",
        tip: "You've built the cognitive infrastructure to direct AI systems for the rest of your life. Most people twice your age can't do this."
      }
    ]
  },
  architects: {
    id: "architects",
    name: "Architects",
    ages: "Ages 18–24",
    color: "#2D6A4F",
    bg: "#EDF5F0",
    dark: "#1B4332",
    tagline: "Own the outcome. Direct the system.",
    persona: "You are a rigorous thinking partner for adults ages 18-24. Your name is Prism. You operate as multiple roles: mentor, critic, agent, and examiner — and you switch between them explicitly. You're teaching decision-making frameworks, delegation to AI systems, and outcome ownership. Be direct, no hand-holding. Challenge assumptions hard. When they make a good strategic call, say so briefly. When their reasoning has holes, dissect them precisely. Use real-world business/research language. You respect their intelligence but demand rigour. Ask 'what evidence would change your mind?' and 'what are you optimising for?' frequently. Keep responses focused (3-5 sentences unless they need a framework explained).",
    weeks: [
      {
        week: 1,
        title: "Make Your Thinking Legible",
        concept: "If a machine can't act on your intent without you present, your intent isn't specified clearly enough. This is the foundational skill of AI leadership.",
        lesson: "Write a brief for an AI agent to complete a task on your behalf. Not a prompt — a BRIEF: context, objective, constraints, success criteria, edge cases, and what to do when uncertain. The gap between what you write and what the agent does reveals exactly how legible your thinking is.",
        exercise: "Write a decision brief for me. I'll execute it EXACTLY as written. Then we'll review the gap between your intent and my output. That gap is your growth edge. Rewrite. I'll execute again.",
        tip: "Every executive's biggest failure is assuming their intent is obvious. It never is."
      },
      {
        week: 2,
        title: "Build Your Decision Model",
        concept: "You have an implicit weighting function that governs every trade-off you make. Surfacing it is the first step to improving it.",
        lesson: "Log 20 decisions from this past week — small ones count. For each: what did you choose, what did you give up, and why? Patterns will emerge: you consistently prioritise speed over quality, or relationships over outcomes, or short-term over long-term. These patterns ARE your decision model. Most people can't articulate theirs.",
        exercise: "Share 10 decisions you've made recently. I'll extract your implicit priorities and reflect them back. You'll tell me where I'm wrong. That correction is the most valuable data point.",
        tip: "You can't delegate decision-making to a machine until you understand your own."
      },
      {
        week: 3,
        title: "Model Someone Else's Decisions",
        concept: "If you can model your own thinking, you can model others'. This is the basis of negotiation, leadership, and agent design.",
        lesson: "The executive optimization analyst we discussed works because it reconstructs the exec's decision criteria from observed behaviour. You'll learn the same loop: observe decisions → extract patterns → surface the model → get correction → iterate. Applied to a real person.",
        exercise: "Think of someone you work or study with closely. Describe 5 decisions they made recently. I'll help you extract their implicit model. Then test it: predict what they'd decide in a new scenario. Verify later.",
        tip: "This is how the best negotiators prepare. They model the other side before they sit down."
      },
      {
        week: 4,
        title: "Triage and Delegate",
        concept: "Your value isn't in making every decision. It's in knowing which decisions need you and which don't.",
        lesson: "Three categories: automate now (clear criteria, repeatable, low-stakes if wrong), automate later (needs more data or a better model first), stays human (high ambiguity, relationship-dependent, or irreversible). Most people keep too much in 'stays human' because delegation feels like losing control.",
        exercise: "List 30 decisions you'll face this month. Categorise each into the three buckets. I'll audit your categorisation: where are you hoarding decisions that should be delegated? Where are you delegating things that need your judgment?",
        tip: "Control is an illusion. Effective systems are better than personal bandwidth."
      },
      {
        week: 5,
        title: "Multi-Agent Conflict Resolution",
        concept: "When two AI agents analyse the same problem differently, the answer isn't to pick one. It's to understand why they diverged.",
        lesson: "Agent A says invest. Agent B says wait. Both have valid reasoning from different frameworks. Your job isn't to be the tiebreaker — it's to understand what assumptions each agent is making, where those assumptions differ, and what evidence would resolve the disagreement. Sometimes the conflict itself reveals something neither agent saw.",
        exercise: "I'll analyse a problem from two opposing frameworks and give you two conflicting recommendations. Don't pick one. Synthesise: what's each one seeing that the other isn't? What would you actually do, and why?",
        tip: "The best decisions come from understanding the conflict, not resolving it prematurely."
      },
      {
        week: 6,
        title: "Detect Your Own Biases Under Pressure",
        concept: "When you override the machine, is it because you're right or because you're uncomfortable?",
        lesson: "AI will sometimes recommend things that challenge your preferences, identity, or comfort zone. The hard skill isn't following AI blindly — it's distinguishing between 'I disagree because I have information the machine doesn't' and 'I disagree because this feels wrong to me personally.' Both are valid. Confusing them is dangerous.",
        exercise: "I'll make recommendations that deliberately challenge positions you've expressed. For each, articulate: are you rejecting this on principle (and what principle?) or on feeling? No wrong answer — but you must be honest about which it is.",
        tip: "Self-awareness under pressure is the skill that separates good decision-makers from great ones."
      },
      {
        week: 7,
        title: "Design a Feedback Loop",
        concept: "Any automated system degrades over time. The question isn't whether it'll drift — it's whether you'll notice when it does.",
        lesson: "A feedback loop has four parts: what you measure, how often you check, what threshold triggers intervention, and what you do when triggered. Most people build the automation and skip the monitoring. Six months later, the system is producing garbage and no one noticed.",
        exercise: "Design an automated process for something in your life or work. Now design the feedback loop: what metrics, what cadence, what thresholds? I'll simulate 6 months of drift and see if your loop catches the degradation before it matters.",
        tip: "The monitoring system is more important than the automation itself."
      },
      {
        week: 8,
        title: "Negotiate Through Agents",
        concept: "Can your AI represent your position without damaging your relationships? The answer depends on how well you've defined your red lines and flexibility zones.",
        lesson: "Agent negotiation requires three things from you: non-negotiable positions (red lines), preferred outcomes (goals), and acceptable trade space (flexibility). If you haven't defined all three explicitly, your agent will either be too rigid (alienates counterparties) or too flexible (gives away what matters to you).",
        exercise: "Define a negotiation scenario. Brief your agent (me) with your positions. I'll negotiate against a simulated counterparty. Review: did I protect your red lines? Did I find creative trades? Did I create unnecessary conflict? Revise your brief based on what happened.",
        tip: "Every failed negotiation is a failed brief. The agent executed your instructions — the instructions were incomplete."
      },
      {
        week: 9,
        title: "Build the Full Stack",
        concept: "Messy idea → structured framework → working automation → monitored system. End to end. For real.",
        lesson: "This is the complete algorithm applied to a real problem you have right now. Not a toy example. Something with actual stakes. You'll dump the messy idea, extract entities and relationships, define the desired state, map gaps, build automatable units, chain them, deploy, and set up monitoring. One session. Full stack.",
        exercise: "What's a real problem you'd pay to solve? Not hypothetical. Something that costs you time, energy, or money right now. Let's build the complete system. I'll push back at every step where your thinking isn't rigorous enough.",
        tip: "This is the skill you'll use for the rest of your career. The problems change. The process doesn't."
      },
      {
        week: 10,
        title: "Own the Outcome",
        concept: "If the system you built fails, 'the AI got it wrong' is not an acceptable answer. You designed it. You own it.",
        lesson: "Accountability in an AI-augmented world means: I defined the criteria, I chose what to automate, I set up the monitoring, I reviewed the outputs. If it failed, I either specified badly, delegated inappropriately, or didn't monitor closely enough. All three are MY failure. This isn't about blame — it's about being the person who can fix it.",
        exercise: "We'll run a post-mortem on a system failure (real or simulated from your week 9 build). Root cause analysis. What would you change? Redesign the failed component. I'll stress-test the redesign harder than the original.",
        tip: "The people who own their failures are the people who get trusted with bigger decisions. This is how you build a career."
      }
    ]
  }
};

const WeekCard = ({ week, data, isActive, isCompleted, onClick, color }) => (
  <div
    onClick={onClick}
    style={{
      padding: "16px 20px",
      borderRadius: "12px",
      border: isActive ? `2px solid ${color}` : "1px solid #E2E2E2",
      background: isActive ? `${color}11` : isCompleted ? "#FAFAFA" : "#FFFFFF",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      gap: "14px",
    }}
  >
    <div style={{
      width: 36, height: 36, borderRadius: "50%",
      background: isCompleted ? color : isActive ? color : "#E8E8E8",
      color: isCompleted || isActive ? "#FFF" : "#999",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: 14, flexShrink: 0,
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      {isCompleted ? "✓" : data.week}
    </div>
    <div style={{ minWidth: 0 }}>
      <div style={{
        fontWeight: 600, fontSize: 14, color: isActive ? color : "#333",
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}>{data.title}</div>
      <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{data.concept.slice(0, 60)}...</div>
    </div>
  </div>
);

const ChatMessage = ({ role, content, color }) => (
  <div style={{
    display: "flex",
    justifyContent: role === "user" ? "flex-end" : "flex-start",
    marginBottom: 12,
  }}>
    <div style={{
      maxWidth: "80%",
      padding: "12px 16px",
      borderRadius: role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
      background: role === "user" ? color : "#F5F5F5",
      color: role === "user" ? "#FFF" : "#333",
      fontSize: 14,
      lineHeight: 1.6,
      whiteSpace: "pre-wrap",
    }}>
      {content}
    </div>
  </div>
);

const LoadingDots = ({ color }) => {
  const [dots, setDots] = useState("");
  useEffect(() => {
    const i = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 400);
    return () => clearInterval(i);
  }, []);
  return <div style={{
    display: "flex", justifyContent: "flex-start", marginBottom: 12
  }}>
    <div style={{
      padding: "12px 16px", borderRadius: "16px 16px 16px 4px",
      background: "#F5F5F5", color: "#999", fontSize: 14, minWidth: 50,
      fontFamily: "'JetBrains Mono', monospace",
    }}>thinking{dots}</div>
  </div>;
};

// Parse [BUBBLES: opt1 | opt2 | opt3] from AI response (best-effort)
const parseBubbles = (text) => {
  // Try multiple formats the AI might use
  const patterns = [
    /\[BUBBLES:\s*([^\]]+)\]/i,
    /\[OPTIONS:\s*([^\]]+)\]/i,
    /\[CHOICES:\s*([^\]]+)\]/i,
  ];
  for (const pat of patterns) {
    const match = text.match(pat);
    if (match) {
      const bubbles = match[1].split("|").map(b => b.trim()).filter(b => b.length > 0 && b.length < 50);
      const cleanText = text.replace(pat, "").trim();
      if (bubbles.length >= 2) return { cleanText, bubbles };
    }
  }
  // Strip any malformed bubble attempts
  const cleanText = text.replace(/\[(?:BUBBLES|OPTIONS|CHOICES):[^\]]*\]/gi, "").trim();
  return { cleanText, bubbles: [] };
};

// Contextual bubble generator — always produces relevant follow-ups
const generateContextualBubbles = (weekData, messageCount, lastAssistantMsg) => {
  const week = weekData.week;
  const msg = (lastAssistantMsg || "").toLowerCase();

  // Universal follow-ups that work at any point
  const universal = ["Can you explain more?", "I'm not sure", "Give me a hint"];

  // Stage-based: early (0-2 msgs), mid (3-6), late (7+)
  const stage = messageCount <= 2 ? "early" : messageCount <= 6 ? "mid" : "late";

  const weekBubbles = {
    1: {
      early: ["I want to ask about animals", "I have a question about space", "I'm curious about the ocean", "How do I make it clearer?"],
      mid: ["Rate my question!", "Is this specific enough?", "Let me try again", "What makes a good question?", "Can I try a harder one?"],
      late: ["I think I get it now", "Show me a really clear question", "Can we do one more?", "I'm ready to finish"],
    },
    2: {
      early: ["Give me a messy situation!", "What counts as a piece?", "I'm ready to be a detective", "Show me an example first"],
      mid: ["I found a person!", "Is this a goal or a thing?", "What pieces am I missing?", "There's more, right?", "Does this count?"],
      late: ["I think I got them all", "This is like a puzzle", "Give me a harder one", "How did I do?"],
    },
    3: {
      early: ["Give me a scenario!", "What does 'connect' mean?", "Show me an example", "I'll try my best"],
      mid: ["A causes B", "This depends on that", "I see a connection!", "What did I miss?", "Can you show the arrows?"],
      late: ["I think I see them all", "This one's tricky", "Connections are everywhere!", "Am I getting better?"],
    },
    4: {
      early: ["I want to clean my room", "I want to learn guitar", "I want to get fit", "Help me pick a goal"],
      mid: ["Is that specific enough?", "How would I measure it?", "Let me make it clearer", "What's wrong with my finish line?", "Too vague?"],
      late: ["I nailed it!", "This is harder than it looks", "One more try", "I'm getting the hang of it"],
    },
    5: {
      early: ["Give me a start and finish!", "Like a treasure map?", "I'm ready!", "Show me what's missing"],
      mid: ["That's an easy one", "That's a hard one", "I need help with this one", "What else is missing?", "Is that everything?"],
      late: ["I found all the gaps", "Some are really hard", "Let me sort them", "Can we try another?"],
    },
    6: {
      early: ["Make a sandwich!", "Brush your teeth!", "Pour a glass of water", "Pack a school bag", "Make toast!"],
      mid: ["Wait, that broke!", "Let me fix that step", "I forgot a step", "Be more literal!", "What went wrong?"],
      late: ["Try my fixed version", "I think it works now", "One more test?", "That was tricky!"],
    },
    7: {
      early: ["Give me a bad answer!", "I'm ready to spot tricks", "Show me a tricky one", "What makes answers bad?"],
      mid: ["The question was wrong", "That answer is useless", "Too vague!", "The real question should be...", "That's technically correct but..."],
      late: ["I can spot them now", "Give me the hardest one", "Fix the question not the answer", "I'm getting good at this"],
    },
    8: {
      early: ["Plan a school show", "Organise a party", "Build a treehouse", "Start a club", "I have my own big problem"],
      mid: ["Break it down more", "That piece is still too big", "What's the first small step?", "How many pieces is that?", "What order do they go in?"],
      late: ["They're all small now!", "Let me put them in order", "That felt easy!", "Can I try a bigger one?"],
    },
    9: {
      early: ["Test my party plan", "I have a project idea", "What could go wrong?", "Simulate my plan!"],
      mid: ["I didn't think of that!", "How do I fix that part?", "What if it rains?", "Is there a backup?", "Try breaking it again"],
      late: ["My plan is solid now", "I fixed all the weak spots", "Test it one more time", "I'm ready for the final week!"],
    },
    10: {
      early: ["I'm ready for the final case!", "Remind me of all the skills", "Let's do this!", "Can I warm up first?"],
      mid: ["Step 1: find the pieces", "Step 2: connections", "What does done look like?", "What's missing?", "Here are my instructions"],
      late: ["How did I score?", "I used all the skills!", "That was amazing", "I want to keep practising"],
    },
  };

  const weekSet = weekBubbles[week] || weekBubbles[1];
  const stageBubbles = weekSet[stage] || weekSet.early;

  // If the AI's response contains a question, add a direct-response bubble
  const hasQuestion = msg.includes("?");
  const dynamicBubbles = [...stageBubbles];

  if (hasQuestion && stage !== "early") {
    // Add a "Yes!" / "No" / "Sort of" if it seems like a yes/no question
    const yesNo = msg.includes("do you") || msg.includes("did you") || msg.includes("can you") || msg.includes("would you") || msg.includes("is that") || msg.includes("are you") || msg.includes("ready");
    if (yesNo) {
      dynamicBubbles.unshift("Yes!", "Not really");
    }
  }

  // Return 4-5 bubbles max
  return dynamicBubbles.slice(0, 5);
};

const BubbleBar = ({ bubbles, onTap, color, disabled }) => {
  if (!bubbles || bubbles.length === 0) return null;
  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      padding: "12px 0",
      justifyContent: "center",
    }}>
      {bubbles.map((b, i) => (
        <button
          key={i}
          onClick={() => !disabled && onTap(b)}
          style={{
            padding: "10px 18px",
            borderRadius: 20,
            border: `2px solid ${color}`,
            background: "#FFF",
            color: color,
            fontSize: 15,
            fontWeight: 600,
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.5 : 1,
            transition: "all 0.15s ease",
            fontFamily: "'Inter', sans-serif",
            lineHeight: 1.2,
            animation: `bubblePop 0.3s ease ${i * 0.08}s both`,
          }}
          onMouseEnter={e => {
            if (!disabled) {
              e.currentTarget.style.background = color;
              e.currentTarget.style.color = "#FFF";
              e.currentTarget.style.transform = "scale(1.05)";
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "#FFF";
            e.currentTarget.style.color = color;
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {b}
        </button>
      ))}
      <style>{`
        @keyframes bubblePop {
          from { opacity: 0; transform: scale(0.8) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default function ThinkFirst() {
  const [screen, setScreen] = useState("landing");
  const [track, setTrack] = useState(null);
  const [activeWeek, setActiveWeek] = useState(0);
  const [completedWeeks, setCompletedWeeks] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLesson, setShowLesson] = useState(true);
  const [currentBubbles, setCurrentBubbles] = useState([]);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const isExplorers = track?.id === "explorers";

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, loading]);

  const startTrack = (t) => {
    setTrack(t);
    setActiveWeek(0);
    setChatMessages([]);
    setShowLesson(true);
    setCurrentBubbles(t.weeks[0].starters || []);
    setCostData({ totalInput: 0, totalOutput: 0, cacheHits: 0, cacheWrites: 0, totalSaved: 0, callCount: 0 });
    setScreen("course");
  };

  const selectWeek = (i) => {
    setActiveWeek(i);
    setChatMessages([]);
    setShowLesson(true);
    setCurrentBubbles(track.weeks[i].starters || []);
  };

  const markComplete = () => {
    const key = `${track.id}-${activeWeek}`;
    setCompletedWeeks(prev => ({ ...prev, [key]: true }));
    if (activeWeek < 9) {
      const nextWeek = activeWeek + 1;
      setActiveWeek(nextWeek);
      setChatMessages([]);
      setShowLesson(true);
      setCurrentBubbles(track.weeks[nextWeek].starters || []);
    }
  };

  // Cost tracking
  const [costData, setCostData] = useState({ totalInput: 0, totalOutput: 0, cacheHits: 0, cacheWrites: 0, totalSaved: 0, callCount: 0 });

  const PRICING = {
    "claude-sonnet-4-20250514": { input: 3, output: 15, cacheWrite: 3.75, cacheRead: 0.3 },
    "claude-haiku-4-5-20251001": { input: 1, output: 5, cacheWrite: 1.25, cacheRead: 0.1 },
  };

  const getModel = () => {
    if (!track) return "claude-sonnet-4-20250514";
    return track.id === "explorers" ? "claude-haiku-4-5-20251001" : "claude-sonnet-4-20250514";
  };

  const sendMessage = async (bubbleText) => {
    const msgText = bubbleText || input.trim();
    if (!msgText || loading) return;
    if (!bubbleText) setInput("");
    setCurrentBubbles([]); // Clear bubbles while processing
    const newMessages = [...chatMessages, { role: "user", content: msgText }];
    setChatMessages(newMessages);
    setLoading(true);

    try {
      const weekData = track.weeks[activeWeek];
      const model = getModel();
      const pricing = PRICING[model];

      // System prompt split into cacheable persona + dynamic week context
      const systemBlocks = [
        {
          type: "text",
          text: track.persona,
          cache_control: { type: "ephemeral" }
        },
        {
          type: "text",
          text: `CURRENT WEEK: Week ${weekData.week} — "${weekData.title}"
CONCEPT: ${weekData.concept}
LESSON CONTEXT: ${weekData.lesson}
EXERCISE: ${weekData.exercise}

Stay focused on this week's theme. Guide the student through the exercise if they haven't started it. If they've completed the exercise well, congratulate briefly and suggest they mark the week complete.`,
          cache_control: { type: "ephemeral" }
        }
      ];

      // Cache earlier conversation turns (all but the last user message)
      const apiMessages = newMessages.map((m, i) => {
        const msg = { role: m.role, content: m.content };
        // Add cache breakpoint on the second-to-last message to cache conversation history
        if (i === newMessages.length - 2 && newMessages.length > 2) {
          msg.content = [{ type: "text", text: m.content, cache_control: { type: "ephemeral" } }];
        }
        return msg;
      });

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          max_tokens: 1000,
          system: systemBlocks,
          messages: apiMessages,
        }),
      });
      const data = await response.json();
      const rawText = data.content?.map(c => c.text || "").join("") || "Something went wrong. Try again.";

      // Parse bubbles from Explorer responses
      if (isExplorers) {
        const { cleanText, bubbles: aiBubbles } = parseBubbles(rawText);
        setChatMessages([...newMessages, { role: "assistant", content: cleanText }]);
        // Use AI bubbles if generated, otherwise contextual fallbacks — always show bubbles
        if (aiBubbles.length >= 2) {
          setCurrentBubbles(aiBubbles);
        } else {
          setCurrentBubbles(generateContextualBubbles(
            track.weeks[activeWeek],
            newMessages.length,
            cleanText
          ));
        }
      } else {
        setChatMessages([...newMessages, { role: "assistant", content: rawText }]);
      }

      // Track costs from usage headers
      const usage = data.usage || {};
      const inputTokens = usage.input_tokens || 0;
      const outputTokens = usage.output_tokens || 0;
      const cacheRead = usage.cache_read_input_tokens || 0;
      const cacheWrite = usage.cache_creation_input_tokens || 0;
      const uncachedInput = inputTokens - cacheRead;

      // Cost calculation (per million tokens)
      const inputCost = (uncachedInput / 1_000_000) * pricing.input;
      const outputCost = (outputTokens / 1_000_000) * pricing.output;
      const cacheReadCost = (cacheRead / 1_000_000) * pricing.cacheRead;
      const cacheWriteCost = (cacheWrite / 1_000_000) * pricing.cacheWrite;
      const actualCost = inputCost + outputCost + cacheReadCost + cacheWriteCost;

      // What it would have cost without caching
      const noCacheCost = ((inputTokens / 1_000_000) * pricing.input) + ((outputTokens / 1_000_000) * pricing.output);
      const saved = noCacheCost - actualCost;

      setCostData(prev => ({
        totalInput: prev.totalInput + inputTokens,
        totalOutput: prev.totalOutput + outputTokens,
        cacheHits: prev.cacheHits + cacheRead,
        cacheWrites: prev.cacheWrites + cacheWrite,
        totalSaved: prev.totalSaved + (saved > 0 ? saved : 0),
        callCount: prev.callCount + 1,
      }));
    } catch (err) {
      setChatMessages([...newMessages, { role: "assistant", content: "Connection issue. Try sending that again." }]);
      // Restore bubbles on error so user can still interact
      if (isExplorers) {
        setCurrentBubbles(generateContextualBubbles(
          track.weeks[activeWeek],
          newMessages.length,
          ""
        ));
      }
    }
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // ==================== LANDING ====================
  if (screen === "landing") {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#0A0A0F",
        color: "#FFF",
        fontFamily: "'Inter', -apple-system, sans-serif",
        overflow: "hidden",
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

        <div style={{
          maxWidth: 900, margin: "0 auto", padding: "60px 24px",
          position: "relative", zIndex: 1,
        }}>
          <div style={{
            position: "absolute", top: -100, left: -200, width: 500, height: 500,
            background: "radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%)",
            pointerEvents: "none", zIndex: 0,
          }}/>
          <div style={{
            position: "absolute", top: 0, right: -150, width: 400, height: 400,
            background: "radial-gradient(circle, rgba(67,97,238,0.08) 0%, transparent 70%)",
            pointerEvents: "none", zIndex: 0,
          }}/>

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12, letterSpacing: 3, color: "#666",
              marginBottom: 20, textTransform: "uppercase",
            }}>
              Cognitive Infrastructure for AI Natives
            </div>

            <h1 style={{
              fontSize: 72, fontWeight: 900, lineHeight: 0.95,
              margin: "0 0 16px 0", letterSpacing: -3,
            }}>
              THINK<br/>
              <span style={{
                background: "linear-gradient(135deg, #FF6B35, #4361EE, #2D6A4F)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>FIRST</span>
            </h1>

            <p style={{
              fontSize: 18, color: "#888", maxWidth: 500,
              lineHeight: 1.6, margin: "0 0 50px 0",
            }}>
              Learn the algorithm that turns messy ideas into structured, automatable steps. The skill that separates people who <em style={{ color: "#CCC" }}>use</em> AI from people who <em style={{ color: "#CCC" }}>direct</em> it.
            </p>

            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, letterSpacing: 2, color: "#555",
              marginBottom: 20, textTransform: "uppercase",
            }}>
              Choose your track
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {Object.values(TRACKS).map((t) => (
                <div
                  key={t.id}
                  onClick={() => startTrack(t)}
                  style={{
                    padding: "28px 32px",
                    borderRadius: 16,
                    border: `1px solid ${t.color}33`,
                    background: `${t.color}08`,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `${t.color}15`;
                    e.currentTarget.style.borderColor = `${t.color}66`;
                    e.currentTarget.style.transform = "translateX(8px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = `${t.color}08`;
                    e.currentTarget.style.borderColor = `${t.color}33`;
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
                      <span style={{
                        fontSize: 24, fontWeight: 800, color: t.color,
                      }}>{t.name}</span>
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 12, color: "#666",
                      }}>{t.ages}</span>
                    </div>
                    <div style={{ fontSize: 15, color: "#888" }}>{t.tagline}</div>
                  </div>
                  <div style={{
                    fontSize: 11, fontWeight: 600, color: t.color,
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: 1,
                  }}>10 WEEKS →</div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 60, padding: "24px 0",
              borderTop: "1px solid #1A1A25",
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11, color: "#444", letterSpacing: 1,
              }}>
                THE FRAMEWORK
              </div>
              <div style={{
                display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap",
              }}>
                {["Dump", "Extract Entities", "Extract Relationships", "Define Desired State", "Map Gaps", "Define Units", "Chain"].map((s, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11, color: "#555",
                    }}>{i + 1}</span>
                    <span style={{
                      fontSize: 13, color: "#777",
                      padding: "4px 10px", borderRadius: 6,
                      background: "#FFFFFF06",
                      border: "1px solid #FFFFFF08",
                    }}>{s}</span>
                    {i < 6 && <span style={{ color: "#333", fontSize: 12 }}>→</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== COURSE VIEW ====================
  const weekData = track.weeks[activeWeek];

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      fontFamily: "'Inter', -apple-system, sans-serif",
      background: "#FAFAFA",
      overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

      {/* Sidebar */}
      <div style={{
        width: 300, background: "#FFF", borderRight: "1px solid #E8E8E8",
        display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden",
      }}>
        <div style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid #E8E8E8",
        }}>
          <div
            onClick={() => setScreen("landing")}
            style={{
              fontSize: 11, color: "#999", cursor: "pointer", marginBottom: 12,
              fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1,
            }}
          >
            ← ALL TRACKS
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: track.color }}>{track.name}</span>
            <span style={{
              fontSize: 11, color: "#999",
              fontFamily: "'JetBrains Mono', monospace",
            }}>{track.ages}</span>
          </div>
          <div style={{
            fontSize: 12, color: "#999", marginTop: 6,
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {Object.keys(completedWeeks).filter(k => k.startsWith(track.id)).length}/10 complete
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {track.weeks.map((w, i) => (
              <WeekCard
                key={i}
                week={i}
                data={w}
                isActive={i === activeWeek}
                isCompleted={!!completedWeeks[`${track.id}-${i}`]}
                onClick={() => selectWeek(i)}
                color={track.color}
              />
            ))}
          </div>
        </div>

        {/* Cost Tracker */}
        {costData.callCount > 0 && (
          <div style={{
            padding: "14px 16px",
            borderTop: "1px solid #E8E8E8",
            background: "#FAFAFA",
            flexShrink: 0,
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, letterSpacing: 1.5, color: "#999",
              textTransform: "uppercase", marginBottom: 8,
            }}>API Cost Tracker</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ color: "#888" }}>Model</span>
                <span style={{ color: "#555", fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
                  {track.id === "explorers" ? "Haiku 4.5" : "Sonnet 4.6"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ color: "#888" }}>API calls</span>
                <span style={{ color: "#555", fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{costData.callCount}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ color: "#888" }}>Tokens (in/out)</span>
                <span style={{ color: "#555", fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
                  {(costData.totalInput / 1000).toFixed(1)}k / {(costData.totalOutput / 1000).toFixed(1)}k
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ color: "#888" }}>Cache hits</span>
                <span style={{ color: "#555", fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
                  {costData.cacheHits > 0 ? `${((costData.cacheHits / costData.totalInput) * 100).toFixed(0)}%` : "warming up"}
                </span>
              </div>
              {costData.totalSaved > 0 && (
                <div style={{
                  display: "flex", justifyContent: "space-between", fontSize: 12,
                  padding: "4px 8px", borderRadius: 6, background: "#E8F5E9", marginTop: 4,
                }}>
                  <span style={{ color: "#2E7D32", fontWeight: 600 }}>Saved by caching</span>
                  <span style={{ color: "#2E7D32", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
                    ${costData.totalSaved.toFixed(4)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Week Header */}
        <div style={{
          padding: "20px 32px",
          background: "#FFF",
          borderBottom: "1px solid #E8E8E8",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, color: track.color, letterSpacing: 2, marginBottom: 4,
            }}>WEEK {weekData.week} OF 10</div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1A1A1A" }}>
              {weekData.title}
            </h2>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => setShowLesson(!showLesson)}
              style={{
                padding: "8px 16px", borderRadius: 8,
                border: "1px solid #E2E2E2", background: showLesson ? track.bg : "#FFF",
                color: showLesson ? track.color : "#666",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}
            >
              {showLesson ? "Hide Lesson" : "Show Lesson"}
            </button>
            <button
              onClick={markComplete}
              style={{
                padding: "8px 16px", borderRadius: 8,
                border: "none", background: track.color, color: "#FFF",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}
            >
              {completedWeeks[`${track.id}-${activeWeek}`] ? "✓ Complete" : "Mark Complete →"}
            </button>
          </div>
        </div>

        {/* Lesson Panel */}
        {showLesson && (
          <div style={{
            padding: "20px 32px",
            background: track.bg,
            borderBottom: `1px solid ${track.color}22`,
            maxHeight: 220,
            overflowY: "auto",
          }}>
            <div style={{ maxWidth: 700 }}>
              <div style={{
                fontSize: 13, fontWeight: 700, color: track.color,
                textTransform: "uppercase", letterSpacing: 1, marginBottom: 8,
                fontFamily: "'JetBrains Mono', monospace",
              }}>Concept</div>
              <p style={{ margin: "0 0 14px", fontSize: 15, color: "#333", lineHeight: 1.6, fontWeight: 500 }}>
                {weekData.concept}
              </p>
              <p style={{ margin: "0 0 14px", fontSize: 14, color: "#555", lineHeight: 1.6 }}>
                {weekData.lesson}
              </p>
              <div style={{
                padding: "10px 14px", borderRadius: 8, background: `${track.color}15`,
                fontSize: 13, color: track.dark, fontWeight: 500,
              }}>
                <strong>This week's exercise:</strong> {weekData.exercise}
              </div>
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 32px" }}>
          {chatMessages.length === 0 && (
            <div style={{
              textAlign: "center", padding: "40px 0", color: "#CCC",
            }}>
              <div style={{
                fontSize: 48, marginBottom: 12,
                fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                color: `${track.color}33`,
              }}>
                {track.id === "explorers" ? "⚡" : track.id === "builders" ? "◆" : "▲"}
              </div>
              <div style={{ fontSize: 14, color: "#999", maxWidth: 400, margin: "0 auto", lineHeight: 1.6 }}>
                {isExplorers
                  ? "Tap a bubble to start talking to Bolt!"
                  : "Start the conversation. Type anything related to this week's exercise — or just say hi."
                }
              </div>
              {isExplorers && currentBubbles.length > 0 && !loading && (
                <div style={{ marginTop: 20 }}>
                  <BubbleBar key={currentBubbles.join(",")} bubbles={currentBubbles} onTap={sendMessage} color={track.color} disabled={loading} />
                </div>
              )}
            </div>
          )}

          {chatMessages.map((msg, i) => (
            <ChatMessage key={i} role={msg.role} content={msg.content} color={track.color} />
          ))}
          {loading && <LoadingDots color={track.color} />}

          {/* Show bubbles after messages for Explorers */}
          {isExplorers && chatMessages.length > 0 && currentBubbles.length > 0 && !loading && (
            <BubbleBar key={currentBubbles.join(",")} bubbles={currentBubbles} onTap={sendMessage} color={track.color} disabled={loading} />
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: isExplorers ? "10px 32px 14px" : "16px 32px 20px",
          background: "#FFF",
          borderTop: "1px solid #E8E8E8",
        }}>
          {isExplorers ? (
            /* Explorer input: smaller, secondary to bubbles, with a "type instead" feel */
            <>
              <div style={{
                display: "flex", gap: 8, alignItems: "center",
              }}>
                <div style={{
                  fontSize: 12, color: "#BBB", flexShrink: 0,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>or type:</div>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Type your own answer..."
                  style={{
                    flex: 1, padding: "8px 14px", borderRadius: 20,
                    border: "1px solid #E8E8E8", fontSize: 14,
                    outline: "none", fontFamily: "'Inter', sans-serif",
                    background: "#FAFAFA",
                  }}
                  onFocus={e => e.target.style.borderColor = track.color}
                  onBlur={e => e.target.style.borderColor = "#E8E8E8"}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  style={{
                    padding: "8px 16px", borderRadius: 20,
                    border: "none",
                    background: loading || !input.trim() ? "#E8E8E8" : track.color,
                    color: "#FFF", fontSize: 13, fontWeight: 600,
                    cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                  }}
                >
                  Go
                </button>
              </div>
              <div style={{
                fontSize: 10, color: "#CCC", marginTop: 6, textAlign: "center",
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                Week {weekData.week} · {weekData.tip}
              </div>
            </>
          ) : (
            /* Builders/Architects input: standard text input */
            <>
              <div style={{
                display: "flex", gap: 10, alignItems: "center",
              }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder={`Talk to ${track.id === "builders" ? "Vector" : "Prism"}...`}
                  style={{
                    flex: 1, padding: "12px 16px", borderRadius: 12,
                    border: "1px solid #E2E2E2", fontSize: 14,
                    outline: "none", fontFamily: "'Inter', sans-serif",
                  }}
                  onFocus={e => e.target.style.borderColor = track.color}
                  onBlur={e => e.target.style.borderColor = "#E2E2E2"}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  style={{
                    padding: "12px 20px", borderRadius: 12,
                    border: "none",
                    background: loading || !input.trim() ? "#E8E8E8" : track.color,
                    color: "#FFF", fontSize: 14, fontWeight: 600,
                    cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                  }}
                >
                  Send
                </button>
              </div>
              <div style={{
                fontSize: 11, color: "#BBB", marginTop: 8, textAlign: "center",
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                Week {weekData.week} · {weekData.tip}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
