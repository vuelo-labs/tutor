import { useState, useEffect, useRef } from "react";

// ============================================
// DATA
// ============================================
const SKILLS = [
  { id: "clarity",       name: "Clarity",            short: "Vague → precise",        icon: "◎", color: "#3B82F6" },
  { id: "decomposition", name: "Decomposition",       short: "Whole → parts",          icon: "◫", color: "#8B5CF6" },
  { id: "relationships", name: "Relationships",       short: "Parts → system",         icon: "⬡", color: "#EC4899" },
  { id: "outcomes",      name: "Outcome Definition",  short: "Goal → finish line",     icon: "◉", color: "#F59E0B" },
  { id: "gaps",          name: "Gap Analysis",        short: "Here → what's missing",  icon: "▧", color: "#10B981" },
  { id: "procedural",    name: "Procedural Thinking", short: "Intent → steps",         icon: "▤", color: "#06B6D4" },
  { id: "evaluation",    name: "Evaluation",          short: "Output → judgment",      icon: "◈", color: "#EF4444" },
];

const LEVELS = [
  { level: 1,  name: "Seed" },   { level: 2,  name: "Sprout" }, { level: 3,  name: "Root" },
  { level: 4,  name: "Branch" }, { level: 5,  name: "Trunk" },  { level: 6,  name: "Canopy" },
  { level: 7,  name: "Crown" },  { level: 8,  name: "Grove" },  { level: 9,  name: "Forest" },
  { level: 10, name: "Ecosystem" },
];

const AGE_GROUPS = [
  { id: "young", label: "Young Explorer", ages: "Ages 4–8",   emoji: "🤖" },
  { id: "child", label: "Explorer",       ages: "Ages 9–12",  emoji: "🚀" },
  { id: "teen",  label: "Teen",           ages: "Ages 13–17", emoji: "⚡" },
  { id: "adult", label: "Adult",          ages: "Ages 18+",   emoji: "◈"  },
];

const SCENARIOS = [
  {
    skill: "clarity",
    prompts: {
      young: "You ask a robot to get your snack and it brings nothing. What do you tell it? 🤖",
      child: "You ask an AI to help with your project and it gets it wrong. How do you fix your question?",
      teen:  "You asked AI for homework help and got a useless answer. What was missing from your question?",
      adult: "You wrote a prompt and got a generic response. What's the single most important thing you left out?",
    },
    starters: {
      young: ["Get me a 🍪 biscuit", "Bring me the red 🍎 apple", "I want something sweet 🍬", "Find a snack from the 🍽️ cupboard"],
      child: ["Tell me specifically about...", "I need the part that explains...", "Focus only on...", "Give me an example of..."],
      teen:  ["I forgot to mention...", "It needed more context about...", "I should have specified...", "The missing detail was..."],
      adult: ["The missing constraint was...", "I didn't define the output format...", "I omitted the context that...", "The scope I missed was..."],
    },
  },
  {
    skill: "decomposition",
    prompts: {
      young: "A robot has to tidy your room 🏠. Name 3 different jobs it needs to do!",
      child: "You want to build a treehouse 🌳. What are the 3 biggest parts of the problem?",
      teen:  "You want to make a game 🎮. Break it into its main pieces — what are they?",
      adult: "You need to launch something new. Name the 3 most distinct parts of the problem.",
    },
    starters: {
      young: ["Pick up the toys 🧸", "Make the bed 🛏️", "Put books on the shelf 📚", "Tidy the floor 🧹"],
      child: ["Get the right materials,", "Plan the design first,", "Build it step by step,", "Test it when done,"],
      teen:  ["Game logic and rules,", "Visuals and design,", "User input handling,", "Saving progress and..."],
      adult: ["Customer/audience,", "Offer and value prop,", "Distribution channel,", "Measurement and..."],
    },
  },
  {
    skill: "relationships",
    prompts: {
      young: "If it rains ☔ you can't play outside. What else changes because of the rain?",
      child: "If your school cancelled all homework, what other things might change?",
      teen:  "A popular app bans ads. What happens next — beyond the obvious?",
      adult: "A team loses its best person. What are the second-order effects?",
    },
    starters: {
      young: ["We'd have to stay inside and...", "Mum would need to...", "The garden would get...", "I'd be bored so..."],
      child: ["Kids would spend more time...", "Teachers might start...", "Parents would probably...", "Grades could go..."],
      teen:  ["Revenue drops so...", "Competitors might...", "Users would shift to...", "The company would have to..."],
      adult: ["Morale shifts because...", "Workload redistributes to...", "Clients notice when...", "Hiring pressure increases..."],
    },
  },
  {
    skill: "outcomes",
    prompts: {
      young: "You want your robot to clean a plate 🍽️. How do you know it's actually clean?",
      child: "You ask an AI to write you a story ✍️. What makes it a good story — how would you know?",
      teen:  "You want to 'get better at maths'. How would you know in 4 weeks if it worked?",
      adult: "You want to 'improve team communication'. What does success look like in 8 weeks?",
    },
    starters: {
      young: ["No food left on it 🍽️", "It's shiny and dry ✨", "I can see my face in it", "It smells clean 👃"],
      child: ["It has a beginning, middle and end,", "I want to keep reading,", "The characters feel real,", "It makes me feel something,"],
      teen:  ["My test score goes up by...", "I can solve X without help,", "I don't need to ask for...", "I can explain it to someone else"],
      adult: ["Meeting count drops by...", "Issues resolved under...", "Team survey score goes up,", "Escalations reduce by..."],
    },
  },
  {
    skill: "gaps",
    prompts: {
      young: "You want to bake a cake 🎂 but only have flour. What else is missing?",
      child: "You want to make a YouTube video 🎥. You have a camera. What's still missing?",
      teen:  "You want to start a small business 💡. You have an idea. Name your 3 biggest gaps.",
      adult: "You want to ship a product in 60 days. You have a team. What are you missing?",
    },
    starters: {
      young: ["Eggs 🥚", "Sugar 🍬", "Butter 🧈", "Someone to help me 👋"],
      child: ["Ideas for what to film,", "Editing software,", "Somewhere to upload it,", "An audience to watch..."],
      teen:  ["Money to start,", "Actual customers,", "A way to take payment,", "Time to build it..."],
      adult: ["A clear spec,", "Customer validation,", "A go-to-market plan,", "Budget sign-off and..."],
    },
  },
  {
    skill: "procedural",
    prompts: {
      young: "Tell a robot 🤖 exactly how to make a bowl of cereal. Step by step!",
      child: "Write the exact steps for an AI to pick a movie 🎬 for your family tonight.",
      teen:  "Write 4 steps a very literal AI would follow to decide if a message needs a reply.",
      adult: "Write 3 decision steps a literal system would follow to triage an inbound request.",
    },
    starters: {
      young: ["Step 1: get a bowl 🥣", "Step 2: open the cereal box 📦", "Step 3: pour milk 🥛", "Step 4: get a spoon 🥄"],
      child: ["Step 1: ask who is watching,", "Step 2: check ages are OK,", "Step 3: find one everyone likes,", "Step 4: check it's available..."],
      teen:  ["Step 1: is it addressed to me?", "Step 2: does it need action?", "Step 3: is there a deadline?", "Step 4: if yes to both then..."],
      adult: ["Step 1: is it urgent and important?", "Step 2: can it be delegated?", "Step 3: if both yes then...", "Otherwise defer to..."],
    },
  },
  {
    skill: "evaluation",
    prompts: {
      young: "A robot says 2+2=5 😮. How do you know it's wrong and what do you do?",
      child: "An AI says the moon is made of cheese 🧀. How do you check if AI is right or wrong?",
      teen:  "An AI gives you an essay plan. What are the 2 things you'd check before using it?",
      adult: "An AI recommends a strategy. What's the first thing you'd question about its reasoning?",
    },
    starters: {
      young: ["I know because I learned...", "I'd check by counting myself", "I'd ask a grown-up 👨‍👩‍👧", "I'd tell it to try again 🔄"],
      child: ["I'd search for it online,", "I'd check another source,", "I'd ask a teacher,", "I'd look it up in a book 📚"],
      teen:  ["Does it actually answer the question?", "Are the points in the right order?", "Is any evidence missing?", "Does it make logical sense?"],
      adult: ["What assumptions does it make?", "What data is it missing?", "Does it account for risk?", "What's the second-order effect?"],
    },
  },
];

// ============================================
// THEMES — completely different visual identity per age group
// ============================================
const THEMES = {
  young: {
    bg:         "#FFF9F0",
    bgSecond:   "#FFFDF8",
    bgCard:     "#FFFFFF",
    bgInput:    "#FFF4E0",
    border:     "#FFD97D",
    text:       "#3D2B00",
    textMuted:  "#A07840",
    textFaint:  "#C9A870",
    accent:     "#FF8C00",
    accentSoft: "#FFE5B4",
    bubble:     { bg: "#FFF0CC", border: "#FFD97D", selected: { bg: "#FF8C00", border: "#FF8C00", text: "#fff" }, text: "#7A4F00", fontSize: 16, padding: "14px 20px", borderRadius: 50, minWidth: 130 },
    font:       "system-ui, sans-serif",
    fontSize:   { h1: 48, body: 17, label: 13 },
    inputSize:  17,
    dark:       false,
  },
  child: {
    bg:         "#0D0F2B",
    bgSecond:   "#111433",
    bgCard:     "#161940",
    bgInput:    "#0D0F2B",
    border:     "#2A2F6B",
    text:       "#E8EEFF",
    textMuted:  "#7B84CC",
    textFaint:  "#444B80",
    accent:     "#FF6B6B",
    accentSoft: "#FF6B6B22",
    bubble:     { bg: "#1A1F50", border: "#2A2F6B", selected: { bg: "#FF6B6B", border: "#FF6B6B", text: "#fff" }, text: "#7B84CC", fontSize: 14, padding: "12px 18px", borderRadius: 40, minWidth: 120 },
    font:       "system-ui, sans-serif",
    fontSize:   { h1: 44, body: 15, label: 12 },
    inputSize:  15,
    dark:       true,
  },
  teen: {
    bg:         "#09090F",
    bgSecond:   "#0D0D18",
    bgCard:     "#111122",
    bgInput:    "#09090F",
    border:     "#1E1E3A",
    text:       "#C8C8FF",
    textMuted:  "#6060AA",
    textFaint:  "#333355",
    accent:     "#7C3AED",
    accentSoft: "#7C3AED22",
    bubble:     { bg: "#111122", border: "#1E1E3A", selected: { bg: "#7C3AED", border: "#7C3AED", text: "#fff" }, text: "#6060AA", fontSize: 13, padding: "10px 16px", borderRadius: 8, minWidth: 110 },
    font:       "'Courier New', monospace",
    fontSize:   { h1: 42, body: 14, label: 11 },
    inputSize:  14,
    dark:       true,
  },
  adult: {
    bg:         "#0B1121",
    bgSecond:   "#0D1526",
    bgCard:     "#0F172A",
    bgInput:    "#0F172A",
    border:     "#1E293B",
    text:       "#E2E8F0",
    textMuted:  "#64748B",
    textFaint:  "#334155",
    accent:     "#3B82F6",
    accentSoft: "#3B82F622",
    bubble:     { bg: "#0F172A", border: "#1E293B", selected: { bg: "#3B82F6", border: "#3B82F6", text: "#fff" }, text: "#94A3B8", fontSize: 13, padding: "10px 16px", borderRadius: 100, minWidth: 110 },
    font:       "system-ui, sans-serif",
    fontSize:   { h1: 40, body: 14, label: 11 },
    inputSize:  14,
    dark:       true,
  },
};

// ============================================
// MASCOT SVGs — inline, no external deps
// ============================================
const BoltRobot = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="25" y="35" width="70" height="60" rx="16" fill="#FFD97D" stroke="#FF8C00" strokeWidth="3"/>
    <rect x="45" y="20" width="30" height="20" rx="8" fill="#FFB347" stroke="#FF8C00" strokeWidth="2.5"/>
    <line x1="60" y1="20" x2="60" y2="10" stroke="#FF8C00" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="60" cy="8" r="4" fill="#FF6B00"/>
    <circle cx="43" cy="58" r="10" fill="white" stroke="#FF8C00" strokeWidth="2"/>
    <circle cx="77" cy="58" r="10" fill="white" stroke="#FF8C00" strokeWidth="2"/>
    <circle cx="45" cy="60" r="5" fill="#3B82F6"/>
    <circle cx="79" cy="60" r="5" fill="#3B82F6"/>
    <circle cx="46" cy="58" r="2" fill="white"/>
    <circle cx="80" cy="58" r="2" fill="white"/>
    <path d="M 43 80 Q 60 90 77 80" stroke="#FF8C00" strokeWidth="3" strokeLinecap="round" fill="none"/>
    <rect x="10" y="48" width="15" height="30" rx="7" fill="#FFD97D" stroke="#FF8C00" strokeWidth="2"/>
    <rect x="95" y="48" width="15" height="30" rx="7" fill="#FFD97D" stroke="#FF8C00" strokeWidth="2"/>
    <rect x="35" y="95" width="18" height="16" rx="6" fill="#FFB347" stroke="#FF8C00" strokeWidth="2"/>
    <rect x="67" y="95" width="18" height="16" rx="6" fill="#FFB347" stroke="#FF8C00" strokeWidth="2"/>
  </svg>
);

const ExplorerRocket = () => (
  <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M55 10 C55 10 80 30 80 60 L55 75 L30 60 C30 30 55 10 55 10Z" fill="#FF6B6B" stroke="#FF4040" strokeWidth="2"/>
    <ellipse cx="55" cy="57" rx="14" ry="14" fill="#1A1F50" stroke="#7B84CC" strokeWidth="2"/>
    <circle cx="55" cy="57" r="8" fill="#4FC3F7"/>
    <circle cx="52" cy="54" r="3" fill="white" opacity="0.6"/>
    <path d="M30 60 L20 80 L40 72 Z" fill="#FF8C00"/>
    <path d="M80 60 L90 80 L70 72 Z" fill="#FF8C00"/>
    <path d="M45 75 L42 95 L55 88 L68 95 L65 75 Z" fill="#FF6B6B" stroke="#FF4040" strokeWidth="1.5"/>
    <circle cx="38" cy="38" r="4" fill="#FFD700" opacity="0.8"/>
    <circle cx="72" cy="32" r="3" fill="#FFD700" opacity="0.6"/>
    <circle cx="80" cy="50" r="2" fill="#FFD700" opacity="0.4"/>
  </svg>
);

const TeenBolt = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="44,5 20,45 38,45 36,75 60,35 42,35" fill="#7C3AED" stroke="#A855F7" strokeWidth="1.5" strokeLinejoin="round"/>
    <polygon points="44,5 20,45 38,45 36,75 60,35 42,35" fill="url(#boltGrad)"/>
    <defs>
      <linearGradient id="boltGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#A855F7"/>
        <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.6"/>
      </linearGradient>
    </defs>
  </svg>
);

// ============================================
// STORAGE
// ============================================
const STORAGE_KEY = "thinkfirst-v2";
function loadState() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null; } catch { return null; } }
function saveState(s) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {} }

// ============================================
// API
// ============================================
async function callAI(system, messages) {
  try {
    const res = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 600, system, messages }),
    });
    const data = await res.json();
    return data.content?.map(c => c.text || "").join("") || "Error.";
  } catch { return "Connection error."; }
}

const ageLabel = { young: "a 4-8 year old child", child: "a 9-12 year old", teen: "a teenager (13-17)", adult: "an adult professional" };

function assessmentPrompt(skill, ageGroup) {
  return `You are a quick capability assessor for a thinking-skills training tool. Assessing ${ageLabel[ageGroup]}.
Skill: ${skill}. Short answers expected (10 words or less). Reward clarity and structure over length.
Score 1-10 generously if thinking is sound.
Reply in this exact JSON only: {"score": <1-10>, "feedback": "<one warm encouraging sentence, max 12 words>", "ready_to_advance": <true|false>}`;
}

function trainingPrompt(skill, level, ageGroup, userName) {
  const intensity = level <= 3 ? "warm, simple, encouraging" : level <= 6 ? "clear and direct" : "concise, Socratic, rigorous";
  const name = userName ? `The user's name is ${userName}. ` : "";
  return `You are a thinking-skills coach training ${ageLabel[ageGroup]} in "${skill.name}" (${skill.short}). ${name}
Level: ${level}/10. Tone: ${intensity}.
Give ONE short exercise using a toy example appropriate for their age. Max 3 sentences, then a clear prompt.
After they respond, coach their THINKING STRUCTURE — not whether their answer is right or wrong.
Never explain the framework. Never be academic. Just coach.`;
}

// ============================================
// SHARED UI
// ============================================
const ChatMsg = ({ role, content, t }) => (
  <div style={{ display: "flex", justifyContent: role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
    <div style={{
      maxWidth: "85%", padding: "12px 16px",
      borderRadius: role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
      background: role === "user" ? t.accent : t.dark ? "#1E293B" : t.border,
      color: role === "user" ? "#fff" : t.text,
      fontSize: t.fontSize.body, lineHeight: 1.65, whiteSpace: "pre-wrap",
      fontFamily: t.font,
    }}>
      {content}
    </div>
  </div>
);

const Dots = ({ t }) => {
  const [d, setD] = useState("");
  useEffect(() => {
    const i = setInterval(() => setD(v => v.length >= 3 ? "" : v + "."), 400);
    return () => clearInterval(i);
  }, []);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "inline-block", padding: "10px 16px", borderRadius: "18px 18px 18px 4px", background: t.dark ? "#1E293B" : t.border, color: t.textMuted, fontSize: 13, fontFamily: "monospace" }}>
        thinking{d}
      </div>
    </div>
  );
};

const SkillRadar = ({ skills: skillLevels, t }) => {
  const size = 240; const cx = size / 2; const cy = size / 2; const maxR = 90;
  const points = SKILLS.map((s, i) => {
    const angle = (Math.PI * 2 * i) / SKILLS.length - Math.PI / 2;
    const level = skillLevels[s.id] || 0;
    const r = (level / 10) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), lx: cx + (maxR + 22) * Math.cos(angle), ly: cy + (maxR + 22) * Math.sin(angle), skill: s, level };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[2,4,6,8,10].map(l => {
        const r = (l / 10) * maxR;
        const pts = SKILLS.map((_, i) => { const a = (Math.PI*2*i)/SKILLS.length-Math.PI/2; return `${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`; }).join(" ");
        return <polygon key={l} points={pts} fill="none" stroke={t.border} strokeWidth={l===10?1.5:0.5}/>;
      })}
      {SKILLS.map((_, i) => { const a = (Math.PI*2*i)/SKILLS.length-Math.PI/2; return <line key={i} x1={cx} y1={cy} x2={cx+maxR*Math.cos(a)} y2={cy+maxR*Math.sin(a)} stroke={t.border} strokeWidth={0.5}/>; })}
      <polygon points={points.map(p=>`${p.x},${p.y}`).join(" ")} fill={`${t.accent}22`} stroke={t.accent} strokeWidth={2}/>
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill={p.skill.color}/>
          <text x={p.lx} y={p.ly} textAnchor="middle" dominantBaseline="middle" fill={t.textMuted} fontSize={8} fontFamily="monospace">{p.skill.icon}{p.level}</text>
        </g>
      ))}
    </svg>
  );
};

// Multi-select bubble component
const StarterBubbles = ({ starters, selected, onToggle, t }) => {
  const bs = t.bubble;
  return (
    <div style={{ padding: "0 20px 14px", display: "flex", gap: 10, flexWrap: "wrap" }}>
      {starters.map((s, i) => {
        const isSelected = selected.includes(s);
        return (
          <button
            key={i}
            onClick={() => onToggle(s)}
            style={{
              padding: bs.padding,
              borderRadius: bs.borderRadius,
              fontSize: bs.fontSize,
              minWidth: bs.minWidth,
              border: `2px solid ${isSelected ? bs.selected.border : bs.border}`,
              background: isSelected ? bs.selected.bg : bs.bg,
              color: isSelected ? bs.selected.text : bs.text,
              cursor: "pointer",
              transition: "all 0.15s",
              fontFamily: t.font,
              fontWeight: isSelected ? 600 : 400,
              transform: isSelected ? "scale(1.04)" : "scale(1)",
              boxShadow: isSelected ? `0 4px 16px ${t.accent}44` : "none",
            }}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
};

// ============================================
// MAIN APP
// ============================================
export default function ThinkFirstEngine() {
  const [screen, setScreen]         = useState("loading");
  const [userProfile, setUserProfile] = useState(null);
  const [skillLevels, setSkillLevels] = useState({});
  const [skillDetails, setSkillDetails] = useState({});
  const [assessIdx, setAssessIdx]   = useState(0);
  const [assessResults, setAssessResults] = useState({});
  const [activeSkill, setActiveSkill] = useState(null);
  const [messages, setMessages]     = useState([]);
  const [loading, setLoading]       = useState(false);
  const [sessions, setSessions]     = useState(0);
  const [history, setHistory]       = useState([]);
  const [input, setInput]           = useState("");
  const [selectedStarters, setSelectedStarters] = useState([]);
  const [nameInput, setNameInput]   = useState("");
  const [selectedAge, setSelectedAge] = useState(null);
  const chatEnd = useRef(null);
  const inputRef = useRef(null);

  const t = THEMES[userProfile?.ageGroup || selectedAge || "adult"];

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  useEffect(() => {
    const saved = loadState();
    if (saved?.userProfile && saved?.skillLevels && Object.keys(saved.skillLevels).length === SKILLS.length) {
      setUserProfile(saved.userProfile);
      setSkillLevels(saved.skillLevels);
      setSkillDetails(saved.skillDetails || {});
      setSessions(saved.sessions || 0);
      setHistory(saved.history || []);
      setScreen("dashboard");
    } else {
      setScreen("welcome");
    }
  }, []);

  function persist(updates) {
    saveState({ userProfile, skillLevels, skillDetails, sessions, history, ...updates });
  }

  const toggleStarter = (s) => {
    setSelectedStarters(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const buildAnswer = () => {
    const parts = [...selectedStarters];
    if (input.trim()) parts.push(input.trim());
    return parts.join(" ").trim();
  };

  // ---- PROFILE ----
  const startWithProfile = () => {
    if (!selectedAge) return;
    const profile = { name: nameInput.trim() || null, ageGroup: selectedAge };
    setUserProfile(profile);
    setAssessIdx(0);
    setAssessResults({});
    setSelectedStarters([]);
    setInput("");
    const greeting = profile.name ? `Hi ${profile.name}! ` : "";
    setMessages([
      { role: "assistant", content: `${greeting}Let's take a quick look at how you think.\n\nI'll ask 7 short questions — answer however feels natural. Tap the bubbles below or type your own. There are no wrong answers.\n\nReady? Here's the first one.` },
      { role: "assistant", content: SCENARIOS[0].prompts[selectedAge] },
    ]);
    setScreen("assessment");
  };

  // ---- ASSESSMENT ----
  const handleAssessAnswer = async () => {
    const answer = buildAnswer();
    if (!answer || loading) return;
    setInput("");
    setSelectedStarters([]);
    const scenario = SCENARIOS[assessIdx];
    const newMsgs = [...messages, { role: "user", content: answer }];
    setMessages(newMsgs);
    setLoading(true);

    const result = await callAI(
      assessmentPrompt(scenario.skill, userProfile.ageGroup),
      [{ role: "user", content: answer }]
    );
    let parsed;
    try { parsed = JSON.parse(result.replace(/```json|```/g, "").trim()); }
    catch { parsed = { score: 5, feedback: "Got it!", ready_to_advance: false }; }

    const newResults = { ...assessResults, [scenario.skill]: { score: parsed.score, feedback: parsed.feedback } };
    setAssessResults(newResults);
    const nextIdx = assessIdx + 1;

    if (nextIdx < SCENARIOS.length) {
      setMessages([...newMsgs,
        { role: "assistant", content: parsed.feedback },
        { role: "assistant", content: SCENARIOS[nextIdx].prompts[userProfile.ageGroup] },
      ]);
      setAssessIdx(nextIdx);
    } else {
      const levels = {}; const details = {};
      for (const [skillId, res] of Object.entries(newResults)) {
        levels[skillId] = Math.max(1, Math.min(10, res.score));
        details[skillId] = { feedback: res.feedback };
      }
      setSkillLevels(levels);
      setSkillDetails(details);
      persist({ skillLevels: levels, skillDetails: details, userProfile, sessions: 0, history: [] });
      setMessages([...newMsgs,
        { role: "assistant", content: `${parsed.feedback}\n\nAll done — building your profile...` },
      ]);
      setTimeout(() => setScreen("dashboard"), 1300);
    }
    setLoading(false);
  };

  // ---- TRAINING ----
  const startTraining = async (skill) => {
    setActiveSkill(skill);
    setMessages([]);
    setSelectedStarters([]);
    setInput("");
    setScreen("training");
    setLoading(true);
    const level = skillLevels[skill.id] || 1;
    const result = await callAI(
      trainingPrompt(skill, level, userProfile.ageGroup, userProfile.name),
      [{ role: "user", content: "Give me an exercise." }]
    );
    setMessages([{ role: "assistant", content: result }]);
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleTrainingResponse = async () => {
    const answer = buildAnswer();
    if (!answer || loading) return;
    setInput("");
    setSelectedStarters([]);
    const newMsgs = [...messages, { role: "user", content: answer }];
    setMessages(newMsgs);
    setLoading(true);
    const level = skillLevels[activeSkill.id] || 1;
    const result = await callAI(
      trainingPrompt(activeSkill, level, userProfile.ageGroup, userProfile.name),
      newMsgs
    );
    setMessages([...newMsgs, { role: "assistant", content: result }]);
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const completeSession = () => {
    const newSessions = sessions + 1;
    const currentLevel = skillLevels[activeSkill.id] || 1;
    const skillHistory = history.filter(h => h.skill === activeSkill.id).length;
    const newLevels = { ...skillLevels };
    if (skillHistory > 0 && skillHistory % 3 === 0 && currentLevel < 10) newLevels[activeSkill.id] = currentLevel + 1;
    const newHistory = [...history, { skill: activeSkill.id, level: currentLevel, date: new Date().toISOString() }];
    setSessions(newSessions); setSkillLevels(newLevels); setHistory(newHistory);
    persist({ skillLevels: newLevels, skillDetails, userProfile, sessions: newSessions, history: newHistory });
    setActiveSkill(null);
    setScreen("dashboard");
  };

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUserProfile(null); setSkillLevels({}); setSkillDetails({});
    setSessions(0); setHistory([]); setSelectedAge(null); setNameInput(""); setSelectedStarters([]); setInput("");
    setScreen("welcome");
  };

  const recommended = SKILLS.reduce((min, s) => (skillLevels[s.id] || 0) < (skillLevels[min.id] || 0) ? s : min, SKILLS[0]);
  const avgLevel = Object.keys(skillLevels).length
    ? (Object.values(skillLevels).reduce((a, b) => a + b, 0) / SKILLS.length).toFixed(1) : "—";

  const base = { minHeight: "100vh", height: "100vh", background: t.bg, color: t.text, fontFamily: t.font };

  // ==================== LOADING ====================
  if (screen === "loading") return (
    <div style={{ ...base, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: t.textMuted, fontFamily: "monospace", fontSize: 13 }}>loading...</div>
    </div>
  );

  // ==================== WELCOME ====================
  const welcomeTheme = THEMES[selectedAge || "adult"];
  if (screen === "welcome") return (
    <div style={{ minHeight: "100vh", background: welcomeTheme.bg, color: welcomeTheme.text, fontFamily: welcomeTheme.font, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 28, transition: "all 0.3s" }}>
      <div style={{ width: "100%", maxWidth: 500 }}>
        {/* Mascot */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          {selectedAge === "young" ? <BoltRobot /> : selectedAge === "child" ? <ExplorerRocket /> : selectedAge === "teen" ? <TeenBolt /> : (
            <div style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: 4, color: welcomeTheme.textMuted, textTransform: "uppercase", paddingTop: 8 }}>Thinking Skills Trainer</div>
          )}
        </div>

        <h1 style={{ fontSize: welcomeTheme.fontSize.h1, fontWeight: 800, letterSpacing: -2, lineHeight: 1, margin: "0 0 10px", textAlign: selectedAge === "young" ? "center" : "left" }}>
          THINK<span style={{ color: welcomeTheme.accent }}>FIRST</span>
        </h1>
        <p style={{ color: welcomeTheme.textMuted, fontSize: welcomeTheme.fontSize.body, lineHeight: 1.7, margin: "0 0 28px", textAlign: selectedAge === "young" ? "center" : "left" }}>
          {selectedAge === "young" ? "🌟 Let's practise thinking — the superpower that makes every robot do what you want! 🌟"
            : selectedAge === "child" ? "🚀 Short exercises that train your brain to give AI better instructions. The better you think, the better it works."
            : selectedAge === "teen" ? "Level up how you think. Short exercises. Real results."
            : "Short exercises that build the thinking skills behind every effective AI interaction."}
        </p>

        {/* Name */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: welcomeTheme.fontSize.label, color: welcomeTheme.textMuted, marginBottom: 8, fontFamily: "monospace", letterSpacing: 1, textTransform: "uppercase" }}>
            {selectedAge === "young" ? "What's your name? 👋" : "Your name (optional)"}
          </div>
          <input
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && startWithProfile()}
            placeholder={selectedAge === "young" ? "Tell me your name! 😊" : "What should we call you?"}
            style={{ width: "100%", padding: selectedAge === "young" ? "14px 18px" : "12px 16px", borderRadius: selectedAge === "young" ? 16 : 10, border: `2px solid ${welcomeTheme.border}`, background: welcomeTheme.bgInput, color: welcomeTheme.text, fontSize: welcomeTheme.fontSize.body, outline: "none", fontFamily: welcomeTheme.font, transition: "border 0.2s", boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = welcomeTheme.accent}
            onBlur={e => e.target.style.borderColor = welcomeTheme.border}
          />
        </div>

        {/* Age group */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: welcomeTheme.fontSize.label, color: welcomeTheme.textMuted, marginBottom: 12, fontFamily: "monospace", letterSpacing: 1, textTransform: "uppercase" }}>I am...</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {AGE_GROUPS.map(ag => {
              const agT = THEMES[ag.id];
              const isSelected = selectedAge === ag.id;
              return (
                <button
                  key={ag.id}
                  onClick={() => setSelectedAge(ag.id)}
                  style={{
                    padding: "18px 16px", borderRadius: 16, cursor: "pointer", textAlign: "left",
                    border: `2px solid ${isSelected ? agT.accent : welcomeTheme.border}`,
                    background: isSelected ? `${agT.accent}18` : welcomeTheme.bgCard,
                    color: welcomeTheme.text, transition: "all 0.2s",
                    transform: isSelected ? "scale(1.03)" : "scale(1)",
                  }}
                >
                  <div style={{ fontSize: 30, marginBottom: 8 }}>{ag.emoji}</div>
                  <div style={{ fontSize: welcomeTheme.fontSize.body, fontWeight: 700 }}>{ag.label}</div>
                  <div style={{ fontSize: 11, color: welcomeTheme.textMuted, marginTop: 3 }}>{ag.ages}</div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={startWithProfile}
          disabled={!selectedAge}
          style={{
            width: "100%", padding: selectedAge === "young" ? "18px" : "15px",
            borderRadius: selectedAge === "young" ? 50 : 12,
            border: "none", background: selectedAge ? welcomeTheme.accent : welcomeTheme.border,
            color: selectedAge ? "#fff" : welcomeTheme.textFaint,
            fontSize: selectedAge === "young" ? 18 : 15, fontWeight: 700,
            cursor: selectedAge ? "pointer" : "not-allowed", transition: "all 0.2s",
            fontFamily: welcomeTheme.font,
          }}
        >
          {selectedAge === "young" ? "Let's go! 🚀" : selectedAge === "child" ? "Begin Mission 🚀" : selectedAge === "teen" ? "Start →" : "Start — takes about 5 minutes →"}
        </button>
      </div>
    </div>
  );

  // ==================== ASSESSMENT ====================
  if (screen === "assessment") {
    const scenario = SCENARIOS[assessIdx];
    const starters = scenario?.starters?.[userProfile?.ageGroup] || [];
    const hasAnswer = selectedStarters.length > 0 || input.trim().length > 0;

    return (
      <div style={{ ...base, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: t.bgSecond }}>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: t.accent, letterSpacing: 2, textTransform: "uppercase" }}>
            {userProfile?.ageGroup === "young" ? `Question ${assessIdx + 1} of ${SCENARIOS.length} 🌟` : `Quick Assessment · ${assessIdx + 1} of ${SCENARIOS.length}`}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {SCENARIOS.map((_, i) => (
              <div key={i} style={{ width: userProfile?.ageGroup === "young" ? 12 : 8, height: userProfile?.ageGroup === "young" ? 12 : 8, borderRadius: "50%", background: i < assessIdx ? t.accent : i === assessIdx ? t.accent + "88" : t.border, transition: "all 0.3s" }}/>
            ))}
          </div>
        </div>

        {/* Hint bar */}
        <div style={{ padding: "8px 20px", background: t.bgSecond, borderBottom: `1px solid ${t.border}` }}>
          <span style={{ fontSize: 12, color: t.textMuted, fontFamily: "monospace" }}>
            {userProfile?.ageGroup === "young" ? "👆 Tap the bubbles or type your answer below!" :
             userProfile?.ageGroup === "child" ? "💡 Tap bubbles to build your answer, or type it yourself" :
             "💡 Select bubbles to build your answer · ~10 words is plenty"}
          </span>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 8px" }}>
          {messages.map((m, i) => <ChatMsg key={i} role={m.role} content={m.content} t={t}/>)}
          {loading && <Dots t={t}/>}
          <div ref={chatEnd}/>
        </div>

        {/* Starters */}
        {!loading && <StarterBubbles starters={starters} selected={selectedStarters} onToggle={toggleStarter} t={t}/>}

        {/* Input */}
        <div style={{ padding: "8px 20px 20px", borderTop: `1px solid ${t.border}`, background: t.bgSecond }}>
          {selectedStarters.length > 0 && (
            <div style={{ marginBottom: 8, padding: "8px 12px", borderRadius: 8, background: `${t.accent}18`, border: `1px solid ${t.accent}44`, fontSize: 12, color: t.accent, fontFamily: "monospace" }}>
              Building: "{selectedStarters.join(" ")}{input ? " " + input : ""}"
            </div>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleAssessAnswer()}
              placeholder={selectedStarters.length > 0 ? "Add more..." : (userProfile?.ageGroup === "young" ? "Type here too! ✏️" : "Your answer...")}
              style={{ flex: 1, padding: "12px 16px", borderRadius: userProfile?.ageGroup === "young" ? 50 : 10, border: `2px solid ${t.border}`, background: t.bgInput, color: t.text, fontSize: t.inputSize, outline: "none", fontFamily: t.font }}
              onFocus={e => e.target.style.borderColor = t.accent}
              onBlur={e => e.target.style.borderColor = t.border}
            />
            <button
              onClick={handleAssessAnswer}
              disabled={loading || !hasAnswer}
              style={{ padding: "12px 20px", borderRadius: userProfile?.ageGroup === "young" ? 50 : 10, border: "none", background: (loading || !hasAnswer) ? t.border : t.accent, color: "#fff", fontSize: 18, fontWeight: 700, cursor: (loading || !hasAnswer) ? "not-allowed" : "pointer" }}
            >
              →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== TRAINING ====================
  if (screen === "training" && activeSkill) {
    const level = skillLevels[activeSkill.id] || 1;
    const scenario = SCENARIOS.find(s => s.skill === activeSkill.id);
    const starters = scenario?.starters?.[userProfile?.ageGroup] || [];
    const hasAnswer = selectedStarters.length > 0 || input.trim().length > 0;
    const showStarters = !loading && messages.length <= 2;

    return (
      <div style={{ ...base, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: t.bgSecond }}>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: activeSkill.color, letterSpacing: 2, textTransform: "uppercase" }}>
            {activeSkill.icon} {activeSkill.name} · Level {level}
          </div>
          <button onClick={completeSession} style={{ padding: "6px 16px", borderRadius: 8, border: `1px solid ${activeSkill.color}`, background: "transparent", color: activeSkill.color, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "monospace" }}>
            Done →
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 8px" }}>
          {messages.map((m, i) => <ChatMsg key={i} role={m.role} content={m.content} t={t}/>)}
          {loading && <Dots t={t}/>}
          <div ref={chatEnd}/>
        </div>

        {showStarters && <StarterBubbles starters={starters} selected={selectedStarters} onToggle={toggleStarter} t={t}/>}

        <div style={{ padding: "8px 20px 20px", borderTop: `1px solid ${t.border}`, background: t.bgSecond }}>
          {selectedStarters.length > 0 && (
            <div style={{ marginBottom: 8, padding: "8px 12px", borderRadius: 8, background: `${activeSkill.color}18`, border: `1px solid ${activeSkill.color}44`, fontSize: 12, color: activeSkill.color, fontFamily: "monospace" }}>
              Building: "{selectedStarters.join(" ")}{input ? " " + input : ""}"
            </div>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleTrainingResponse()}
              placeholder={selectedStarters.length > 0 ? "Add more..." : "Your response..."}
              style={{ flex: 1, padding: "12px 16px", borderRadius: userProfile?.ageGroup === "young" ? 50 : 10, border: `2px solid ${t.border}`, background: t.bgInput, color: t.text, fontSize: t.inputSize, outline: "none", fontFamily: t.font }}
              onFocus={e => e.target.style.borderColor = activeSkill.color}
              onBlur={e => e.target.style.borderColor = t.border}
            />
            <button
              onClick={handleTrainingResponse}
              disabled={loading || !hasAnswer}
              style={{ padding: "12px 20px", borderRadius: userProfile?.ageGroup === "young" ? 50 : 10, border: "none", background: (loading || !hasAnswer) ? t.border : activeSkill.color, color: "#fff", fontSize: 18, fontWeight: 700, cursor: (loading || !hasAnswer) ? "not-allowed" : "pointer" }}
            >
              →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== DASHBOARD ====================
  if (screen === "dashboard") {
    const ageGroup = AGE_GROUPS.find(a => a.id === userProfile?.ageGroup);
    return (
      <div style={{ ...base, display: "flex", overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{ width: 300, borderRight: `1px solid ${t.border}`, display: "flex", flexDirection: "column", background: t.bgSecond, flexShrink: 0, overflow: "hidden" }}>
          <div style={{ padding: "18px 16px 10px" }}>
            <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 3, color: t.textMuted, textTransform: "uppercase", marginBottom: 4 }}>
              THINK<span style={{ color: t.accent }}>FIRST</span>
            </div>
            <div style={{ fontSize: 12, color: t.textMuted }}>
              {userProfile?.name ? `${userProfile.name} · ` : ""}{ageGroup?.label} · {sessions} sessions · Avg L{avgLevel}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
            <SkillRadar skills={skillLevels} t={t}/>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "6px 12px 10px", display: "flex", flexDirection: "column", gap: 6 }}>
            {SKILLS.map(s => {
              const level = skillLevels[s.id] || 0;
              return (
                <div key={s.id} onClick={() => startTraining(s)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, cursor: "pointer", border: `1px solid ${t.border}`, background: t.bgCard, transition: "all 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = s.color}
                  onMouseLeave={e => e.currentTarget.style.borderColor = t.border}
                >
                  <span style={{ color: s.color, fontSize: 15 }}>{s.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: t.text, marginBottom: 4 }}>{s.name}</div>
                    <div style={{ height: 4, background: t.border, borderRadius: 2 }}>
                      <div style={{ height: "100%", width: `${level * 10}%`, background: s.color, borderRadius: 2, transition: "width 0.5s" }}/>
                    </div>
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: 11, color: s.color, fontWeight: 700 }}>{level}/10</div>
                </div>
              );
            })}
          </div>
          <div style={{ padding: "10px 12px", borderTop: `1px solid ${t.border}` }}>
            <button onClick={reset} style={{ width: "100%", padding: 8, borderRadius: 8, border: `1px solid ${t.border}`, background: "transparent", color: t.textFaint, fontSize: 11, cursor: "pointer", fontFamily: "monospace" }}>Reset</button>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, overflowY: "auto", padding: "30px 32px" }}>
          <h2 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 700, letterSpacing: -0.5, fontFamily: t.font }}>
            {userProfile?.name ? `Hi ${userProfile.name}.` : "Your Profile."}
          </h2>
          <p style={{ color: t.textMuted, fontSize: 13, margin: "0 0 24px" }}>Pick a skill to train. Sessions are short — 2 to 5 minutes.</p>

          {/* Recommended */}
          <div onClick={() => startTraining(recommended)} style={{ padding: "20px 24px", borderRadius: 14, border: `1px solid ${recommended.color}33`, background: `${recommended.color}08`, cursor: "pointer", marginBottom: 24, transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = recommended.color}
            onMouseLeave={e => e.currentTarget.style.borderColor = `${recommended.color}33`}
          >
            <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 2, color: recommended.color, textTransform: "uppercase", marginBottom: 10 }}>Recommended</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 26, color: recommended.color }}>{recommended.icon}</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, fontFamily: t.font }}>
                  {recommended.name}
                  <span style={{ fontFamily: "monospace", fontSize: 11, color: recommended.color, marginLeft: 10 }}>L{skillLevels[recommended.id] || 1}</span>
                </div>
                <div style={{ fontSize: 12, color: t.textMuted, marginTop: 3 }}>{skillDetails[recommended.id]?.feedback || recommended.short}</div>
              </div>
            </div>
          </div>

          {/* All skills */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {SKILLS.map(s => {
              const level = skillLevels[s.id] || 0;
              const levelName = LEVELS[Math.max(0, level - 1)]?.name;
              return (
                <div key={s.id} onClick={() => startTraining(s)} style={{ padding: "14px 16px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.bgCard, cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.background = `${s.color}08`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.background = t.bgCard; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, fontFamily: t.font }}><span style={{ color: s.color, marginRight: 8 }}>{s.icon}</span>{s.name}</div>
                    <div style={{ padding: "2px 8px", borderRadius: 6, background: `${s.color}22`, color: s.color, fontFamily: "monospace", fontSize: 10 }}>L{level} {levelName}</div>
                  </div>
                  <div style={{ fontSize: 11, color: t.textMuted }}>{skillDetails[s.id]?.feedback || s.short}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
