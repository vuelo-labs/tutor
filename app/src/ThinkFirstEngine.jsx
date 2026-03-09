import { useState, useEffect, useRef } from "react";

// ============================================
// SKILLS & LEVELS
// ============================================
const SKILLS = [
  { id: "clarity",       name: "Clarity",             short: "Vague → precise",          icon: "◎", color: "#3B82F6" },
  { id: "decomposition", name: "Decomposition",        short: "Whole → parts",            icon: "◫", color: "#8B5CF6" },
  { id: "relationships", name: "Relationships",        short: "Parts → system",           icon: "⬡", color: "#EC4899" },
  { id: "outcomes",      name: "Outcome Definition",   short: "Goal → finish line",       icon: "◉", color: "#F59E0B" },
  { id: "gaps",          name: "Gap Analysis",         short: "Here → what's missing",    icon: "▧", color: "#10B981" },
  { id: "procedural",    name: "Procedural Thinking",  short: "Intent → steps",           icon: "▤", color: "#06B6D4" },
  { id: "evaluation",    name: "Evaluation",           short: "Output → judgment",        icon: "◈", color: "#EF4444" },
];

const LEVELS = [
  { level: 1,  name: "Seed" },     { level: 2,  name: "Sprout" },
  { level: 3,  name: "Root" },     { level: 4,  name: "Branch" },
  { level: 5,  name: "Trunk" },    { level: 6,  name: "Canopy" },
  { level: 7,  name: "Crown" },    { level: 8,  name: "Grove" },
  { level: 9,  name: "Forest" },   { level: 10, name: "Ecosystem" },
];

// ============================================
// AGE GROUPS
// ============================================
const AGE_GROUPS = [
  { id: "young",  label: "Young Explorer", ages: "Ages 4–8",  emoji: "🌱", color: "#F59E0B" },
  { id: "child",  label: "Explorer",       ages: "Ages 9–12", emoji: "🚀", color: "#10B981" },
  { id: "teen",   label: "Teen",           ages: "Ages 13–17",emoji: "⚡", color: "#8B5CF6" },
  { id: "adult",  label: "Adult",          ages: "Ages 18+",  emoji: "◈",  color: "#3B82F6" },
];

// ============================================
// ASSESSMENT SCENARIOS — toy examples, short answers, age-adapted
// Each has a prompt per age group + starters (tappable chips to reduce friction)
// ============================================
const SCENARIOS = [
  {
    skill: "clarity",
    prompts: {
      young: "You ask a robot to get your snack and it brings nothing. What do you tell it?",
      child: "You ask an AI to help with your project and it gives the wrong thing. Fix your question.",
      teen:  "You ask an AI for homework help and get a useless answer. What was missing from your question?",
      adult: "You wrote an AI prompt and got a generic response. What's the single most important thing you left out?",
    },
    starters: {
      young: ["Get me a biscuit from...", "I want the red...", "Bring me something that..."],
      child: ["Tell me about...", "I need help with...", "Explain only the part about..."],
      teen:  ["I forgot to say...", "It needed more context about...", "I should have specified..."],
      adult: ["The missing constraint was...", "I didn't define the output format...", "I omitted the context that..."],
    },
  },
  {
    skill: "decomposition",
    prompts: {
      young: "A robot has to tidy your room. Name 3 different jobs it needs to do.",
      child: "You want to build a treehouse. What are the 3 biggest parts of the problem?",
      teen:  "You want to make a game. Break it into its main pieces — what are they?",
      adult: "You need to launch something new. Name the 3 most distinct parts of the problem.",
    },
    starters: {
      young: ["Pick up toys,", "Make the bed,", "Put books away,"],
      child: ["Get materials,", "Plan the design,", "Build it, then..."],
      teen:  ["Game logic,", "Visuals,", "User input and..."],
      adult: ["Audience,", "Offer,", "Distribution and..."],
    },
  },
  {
    skill: "relationships",
    prompts: {
      young: "If it rains, you can't play outside. What else changes because of the rain?",
      child: "If your school cancelled all homework, what other things might change?",
      teen:  "A popular app bans ads. What happens next — beyond the obvious?",
      adult: "A team loses its best person. What are the second-order effects?",
    },
    starters: {
      young: ["We'd have to...", "Mum would...", "The garden would..."],
      child: ["Kids would...", "Teachers might...", "Parents could..."],
      teen:  ["Revenue drops,", "Competitors react,", "Users might..."],
      adult: ["Morale shifts,", "Workload redistributes,", "Clients notice..."],
    },
  },
  {
    skill: "outcomes",
    prompts: {
      young: "You want your robot to clean a plate. How do you know it's actually clean?",
      child: "You ask an AI to write you a story. What makes it a good story — how would you know?",
      teen:  "You want to 'get better at maths'. How would you know in 4 weeks if it worked?",
      adult: "You want to 'improve team communication'. What does success look like in 8 weeks?",
    },
    starters: {
      young: ["No food on it,", "Shiny and dry,", "I can see my face in..."],
      child: ["It has a beginning,", "I want to keep reading,", "It makes sense and..."],
      teen:  ["Test score goes up by...", "I can do X without...", "I don't need to ask for help with..."],
      adult: ["Meeting count drops,", "Issues resolved in under...", "Team reports feeling..."],
    },
  },
  {
    skill: "gaps",
    prompts: {
      young: "You want to bake a cake but you've only got flour. What else is missing?",
      child: "You want to make a YouTube video. You have a camera. What's still missing?",
      teen:  "You want to start a small business. You have an idea. Name your 3 biggest gaps.",
      adult: "You want to ship a product in 60 days. You have a team. What are you missing?",
    },
    starters: {
      young: ["Eggs,", "Sugar,", "Someone to help me..."],
      child: ["Ideas for what to film,", "Editing software,", "Somewhere to upload..."],
      teen:  ["Money,", "Customers,", "A way to get paid and..."],
      adult: ["A clear spec,", "Customer validation,", "A go-to-market plan and..."],
    },
  },
  {
    skill: "procedural",
    prompts: {
      young: "Tell a robot exactly how to make a bowl of cereal. Step by step.",
      child: "Write the exact steps for an AI to pick a movie for your family to watch tonight.",
      teen:  "Write 4 steps a very literal AI would follow to decide if a message needs a reply.",
      adult: "Write 3 decision steps a literal system would follow to triage an inbound request.",
    },
    starters: {
      young: ["Step 1: get a bowl,", "Step 2: open the box,", "Step 3: pour until..."],
      child: ["Step 1: ask who's watching,", "Step 2: check if any are...", "Step 3: pick the one that..."],
      teen:  ["Step 1: is it addressed to me?", "Step 2: does it need action?", "Step 3: is the deadline..."],
      adult: ["Step 1: is it urgent or important?", "Step 2: can it be delegated?", "Step 3: if both yes then..."],
    },
  },
  {
    skill: "evaluation",
    prompts: {
      young: "A robot says '2+2=5'. How do you know it's wrong and what do you do?",
      child: "An AI says 'the moon is made of cheese'. How do you check if AI is right or wrong?",
      teen:  "An AI gives you an essay plan. What are the 2 things you'd check before using it?",
      adult: "An AI recommends a strategy. What's the first thing you'd question about its reasoning?",
    },
    starters: {
      young: ["I know because...", "I'd check by...", "I'd ask again and say..."],
      child: ["I'd search for...", "I'd check another source like...", "I'd ask it to show its..."],
      teen:  ["Does it answer the question?", "Are the sources...", "Is the structure..."],
      adult: ["What assumptions does it make?", "What data is it missing?", "Does it account for..."],
    },
  },
];

// ============================================
// STORAGE
// ============================================
const STORAGE_KEY = "thinkfirst-v2";

function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null; }
  catch { return null; }
}
function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

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

// ============================================
// SYSTEM PROMPTS
// ============================================
const ageLabel = { young: "a 4-8 year old child", child: "a 9-12 year old", teen: "a teenager (13-17)", adult: "an adult professional" };

function assessmentPrompt(skill, ageGroup) {
  return `You are a quick capability assessor for a thinking-skills training tool. You are assessing ${ageLabel[ageGroup]}.

Skill being assessed: ${skill}
Short answers are expected (10 words or less). Do not penalise brevity — reward clarity and structure.

Score 1–10. Be generous if the thinking is sound. If score >= 7, note they can advance quickly.

Reply in this exact JSON only:
{"score": <1-10>, "feedback": "<one encouraging sentence, max 12 words>", "ready_to_advance": <true|false>}`;
}

function trainingPrompt(skill, level, ageGroup, userName) {
  const intensity = level <= 3 ? "warm, simple, encouraging" : level <= 6 ? "clear and direct" : "concise, Socratic, rigorous";
  const name = userName ? `The user's name is ${userName}.` : "";
  return `You are a thinking-skills coach training ${ageLabel[ageGroup]} in "${skill.name}" (${skill.short}). ${name}

Their level: ${level}/10.
Tone: ${intensity}.

Give ONE short exercise using a toy example appropriate for their age. Max 3 sentences setup, then a clear prompt.
After they respond, coach their THINKING STRUCTURE — not whether their answer is right or wrong.
Never explain the framework. Never be academic. Just coach.`;
}

// ============================================
// UI COMPONENTS
// ============================================
const ChatMsg = ({ role, content }) => (
  <div style={{ display: "flex", justifyContent: role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
    <div style={{
      maxWidth: "85%", padding: "12px 16px",
      borderRadius: role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
      background: role === "user" ? "#1E40AF" : "#1E293B",
      color: "#E2E8F0", fontSize: 14, lineHeight: 1.65, whiteSpace: "pre-wrap",
    }}>
      {content}
    </div>
  </div>
);

const Dots = () => {
  const [d, setD] = useState("");
  useEffect(() => {
    const i = setInterval(() => setD(v => v.length >= 3 ? "" : v + "."), 400);
    return () => clearInterval(i);
  }, []);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "inline-block", padding: "10px 16px", borderRadius: "14px 14px 14px 4px", background: "#1E293B", color: "#475569", fontSize: 14, fontFamily: "monospace" }}>
        thinking{d}
      </div>
    </div>
  );
};

const SkillRadar = ({ skills: skillLevels }) => {
  const size = 260; const cx = size / 2; const cy = size / 2; const maxR = 100;
  const points = SKILLS.map((s, i) => {
    const angle = (Math.PI * 2 * i) / SKILLS.length - Math.PI / 2;
    const level = skillLevels[s.id] || 0;
    const r = (level / 10) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), lx: cx + (maxR + 26) * Math.cos(angle), ly: cy + (maxR + 26) * Math.sin(angle), skill: s, level };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[2,4,6,8,10].map(l => {
        const r = (l / 10) * maxR;
        const pts = SKILLS.map((_, i) => { const a = (Math.PI*2*i)/SKILLS.length - Math.PI/2; return `${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`; }).join(" ");
        return <polygon key={l} points={pts} fill="none" stroke="#1E293B" strokeWidth={l===10?1.5:0.5} />;
      })}
      {SKILLS.map((_, i) => { const a = (Math.PI*2*i)/SKILLS.length - Math.PI/2; return <line key={i} x1={cx} y1={cy} x2={cx+maxR*Math.cos(a)} y2={cy+maxR*Math.sin(a)} stroke="#1E293B" strokeWidth={0.5} />; })}
      <polygon points={points.map(p=>`${p.x},${p.y}`).join(" ")} fill="rgba(59,130,246,0.15)" stroke="#3B82F6" strokeWidth={2} />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill={p.skill.color} />
          <text x={p.lx} y={p.ly} textAnchor="middle" dominantBaseline="middle" fill="#64748B" fontSize={8} fontFamily="monospace">{p.skill.icon} {p.level}</text>
        </g>
      ))}
    </svg>
  );
};

// ============================================
// MAIN APP
// ============================================
export default function ThinkFirstEngine() {
  const [screen, setScreen] = useState("loading");
  const [userProfile, setUserProfile] = useState(null); // { name, ageGroup }
  const [skillLevels, setSkillLevels] = useState({});
  const [skillDetails, setSkillDetails] = useState({});

  // Assessment state
  const [assessIdx, setAssessIdx] = useState(0);
  const [assessResults, setAssessResults] = useState({});

  // Training state
  const [activeSkill, setActiveSkill] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [history, setHistory] = useState([]);

  // Input state
  const [input, setInput] = useState("");
  const chatEnd = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  // Load saved state
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
    const state = { userProfile, skillLevels, skillDetails, sessions, history, ...updates };
    saveState(state);
  }

  // ---- PROFILE SCREEN ----
  const [nameInput, setNameInput] = useState("");
  const [selectedAge, setSelectedAge] = useState(null);

  const startWithProfile = () => {
    if (!selectedAge) return;
    const profile = { name: nameInput.trim() || null, ageGroup: selectedAge };
    setUserProfile(profile);
    setAssessIdx(0);
    setAssessResults({});
    setMessages([
      {
        role: "assistant",
        content: `${profile.name ? `Hi ${profile.name}! ` : ""}Let's take a quick look at how you think.\n\nI'll ask 7 short questions — answer in your own words, as briefly as you like. There are no wrong answers.\n\nReady? Here's the first one.`,
      },
      { role: "assistant", content: SCENARIOS[0].prompts[selectedAge] },
    ]);
    setScreen("assessment");
  };

  // ---- ASSESSMENT ----
  const handleAssessAnswer = async (answerOverride) => {
    const answer = answerOverride ?? input.trim();
    if (!answer || loading) return;
    setInput("");

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
    catch { parsed = { score: 5, feedback: "Got it, moving on.", ready_to_advance: false }; }

    const newResults = { ...assessResults, [scenario.skill]: { score: parsed.score, feedback: parsed.feedback } };
    setAssessResults(newResults);

    const nextIdx = assessIdx + 1;

    if (nextIdx < SCENARIOS.length) {
      const nextScenario = SCENARIOS[nextIdx];
      setMessages([...newMsgs,
        { role: "assistant", content: parsed.feedback },
        { role: "assistant", content: nextScenario.prompts[userProfile.ageGroup] },
      ]);
      setAssessIdx(nextIdx);
    } else {
      // Build skill profile
      const levels = {};
      const details = {};
      for (const [skillId, res] of Object.entries(newResults)) {
        levels[skillId] = Math.max(1, Math.min(10, res.score));
        details[skillId] = { feedback: res.feedback };
      }
      setSkillLevels(levels);
      setSkillDetails(details);
      persist({ skillLevels: levels, skillDetails: details, userProfile, sessions: 0, history: [] });
      setMessages([...newMsgs,
        { role: "assistant", content: `${parsed.feedback}\n\nDone. Building your profile...` },
      ]);
      setTimeout(() => setScreen("dashboard"), 1200);
    }
    setLoading(false);
  };

  // ---- TRAINING ----
  const startTraining = async (skill) => {
    setActiveSkill(skill);
    setMessages([]);
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

  const handleTrainingResponse = async (answerOverride) => {
    const answer = answerOverride ?? input.trim();
    if (!answer || loading) return;
    setInput("");
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
    if (skillHistory > 0 && skillHistory % 3 === 0 && currentLevel < 10) {
      newLevels[activeSkill.id] = currentLevel + 1;
    }
    const newHistory = [...history, { skill: activeSkill.id, level: currentLevel, date: new Date().toISOString() }];
    setSessions(newSessions);
    setSkillLevels(newLevels);
    setHistory(newHistory);
    persist({ skillLevels: newLevels, skillDetails, userProfile, sessions: newSessions, history: newHistory });
    setActiveSkill(null);
    setScreen("dashboard");
  };

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUserProfile(null); setSkillLevels({}); setSkillDetails({});
    setSessions(0); setHistory([]); setSelectedAge(null); setNameInput("");
    setScreen("welcome");
  };

  const recommended = SKILLS.reduce((min, s) =>
    (skillLevels[s.id] || 0) < (skillLevels[min.id] || 0) ? s : min, SKILLS[0]);
  const avgLevel = Object.keys(skillLevels).length
    ? (Object.values(skillLevels).reduce((a, b) => a + b, 0) / SKILLS.length).toFixed(1)
    : "—";

  const base = { height: "100vh", background: "#0B1121", color: "#E2E8F0", fontFamily: "system-ui, sans-serif" };

  // ==================== LOADING ====================
  if (screen === "loading") return (
    <div style={{ ...base, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#475569", fontFamily: "monospace", fontSize: 13 }}>loading...</div>
    </div>
  );

  // ==================== WELCOME ====================
  if (screen === "welcome") return (
    <div style={{ ...base, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 4, color: "#475569", textTransform: "uppercase", marginBottom: 20 }}>
          Thinking Skills Trainer
        </div>
        <h1 style={{ fontSize: 52, fontWeight: 700, letterSpacing: -2, lineHeight: 1, margin: "0 0 12px" }}>
          THINK<span style={{ color: "#3B82F6" }}>FIRST</span>
        </h1>
        <p style={{ color: "#64748B", fontSize: 15, lineHeight: 1.7, margin: "0 0 36px" }}>
          Short exercises that build the thinking skills behind every good AI interaction.
          Adapted to your age and level.
        </p>

        {/* Name */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "#64748B", marginBottom: 8, fontFamily: "monospace", letterSpacing: 1 }}>YOUR NAME (optional)</div>
          <input
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            placeholder="What should we call you?"
            style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1px solid #1E293B", background: "#0F172A", color: "#E2E8F0", fontSize: 15, outline: "none" }}
            onFocus={e => e.target.style.borderColor = "#3B82F6"}
            onBlur={e => e.target.style.borderColor = "#1E293B"}
          />
        </div>

        {/* Age group */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 12, color: "#64748B", marginBottom: 12, fontFamily: "monospace", letterSpacing: 1 }}>I AM...</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {AGE_GROUPS.map(ag => (
              <button
                key={ag.id}
                onClick={() => setSelectedAge(ag.id)}
                style={{
                  padding: "16px", borderRadius: 12, cursor: "pointer", textAlign: "left",
                  border: `2px solid ${selectedAge === ag.id ? ag.color : "#1E293B"}`,
                  background: selectedAge === ag.id ? `${ag.color}15` : "#0F172A",
                  color: "#E2E8F0", transition: "all 0.15s",
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 6 }}>{ag.emoji}</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{ag.label}</div>
                <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{ag.ages}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={startWithProfile}
          disabled={!selectedAge}
          style={{
            width: "100%", padding: "15px", borderRadius: 12, border: "none",
            background: selectedAge ? "#3B82F6" : "#1E293B",
            color: selectedAge ? "#fff" : "#475569",
            fontSize: 15, fontWeight: 700, cursor: selectedAge ? "pointer" : "not-allowed",
            transition: "all 0.2s",
          }}
        >
          Start — takes about 5 minutes →
        </button>
      </div>
    </div>
  );

  // ==================== ASSESSMENT ====================
  if (screen === "assessment") {
    const scenario = SCENARIOS[assessIdx];
    const starters = scenario?.starters?.[userProfile?.ageGroup] || [];
    const accentColor = "#3B82F6";

    return (
      <div style={{ ...base, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ padding: "14px 24px", borderBottom: "1px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: accentColor, letterSpacing: 2, textTransform: "uppercase" }}>
            Quick Assessment · {assessIdx + 1} of {SCENARIOS.length}
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {SCENARIOS.map((_, i) => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i < assessIdx ? accentColor : i === assessIdx ? "#93C5FD" : "#1E293B", transition: "all 0.3s" }} />
            ))}
          </div>
        </div>

        {/* Hint */}
        <div style={{ padding: "8px 24px", background: "#0F172A", borderBottom: "1px solid #1E293B" }}>
          <span style={{ fontSize: 11, color: "#475569", fontFamily: "monospace" }}>
            💡 Aim for ~10 words — clarity beats length
          </span>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {messages.map((m, i) => <ChatMsg key={i} role={m.role} content={m.content} />)}
          {loading && <Dots />}
          <div ref={chatEnd} />
        </div>

        {/* Starters (tappable chips) */}
        {!loading && starters.length > 0 && (
          <div style={{ padding: "0 24px 12px", display: "flex", gap: 8, flexWrap: "wrap" }}>
            {starters.map((s, i) => (
              <button
                key={i}
                onClick={() => setInput(s + " ")}
                style={{
                  padding: "6px 12px", borderRadius: 100, fontSize: 12,
                  border: "1px solid #1E293B", background: "#0F172A",
                  color: "#94A3B8", cursor: "pointer", transition: "all 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.color = accentColor; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#1E293B"; e.currentTarget.style.color = "#94A3B8"; }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ padding: "10px 24px 18px", borderTop: "1px solid #1E293B" }}>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleAssessAnswer()}
              placeholder="Your answer..."
              style={{ flex: 1, padding: "12px 16px", borderRadius: 10, border: "1px solid #1E293B", background: "#0F172A", color: "#E2E8F0", fontSize: 14, outline: "none" }}
              onFocus={e => e.target.style.borderColor = accentColor}
              onBlur={e => e.target.style.borderColor = "#1E293B"}
            />
            <button
              onClick={() => handleAssessAnswer()}
              disabled={loading || !input.trim()}
              style={{ padding: "12px 20px", borderRadius: 10, border: "none", background: loading || !input.trim() ? "#1E293B" : accentColor, color: "#fff", fontSize: 16, fontWeight: 700, cursor: loading || !input.trim() ? "not-allowed" : "pointer" }}
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

    return (
      <div style={{ ...base, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "14px 24px", borderBottom: "1px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: activeSkill.color, letterSpacing: 2, textTransform: "uppercase" }}>
            {activeSkill.icon} {activeSkill.name} · Level {level}
          </div>
          <button
            onClick={completeSession}
            style={{ padding: "6px 16px", borderRadius: 8, border: `1px solid ${activeSkill.color}`, background: "transparent", color: activeSkill.color, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "monospace" }}
          >
            Done →
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {messages.map((m, i) => <ChatMsg key={i} role={m.role} content={m.content} />)}
          {loading && <Dots />}
          <div ref={chatEnd} />
        </div>

        {!loading && starters.length > 0 && messages.length <= 2 && (
          <div style={{ padding: "0 24px 12px", display: "flex", gap: 8, flexWrap: "wrap" }}>
            {starters.map((s, i) => (
              <button
                key={i}
                onClick={() => setInput(s + " ")}
                style={{ padding: "6px 12px", borderRadius: 100, fontSize: 12, border: "1px solid #1E293B", background: "#0F172A", color: "#94A3B8", cursor: "pointer" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = activeSkill.color; e.currentTarget.style.color = activeSkill.color; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#1E293B"; e.currentTarget.style.color = "#94A3B8"; }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div style={{ padding: "10px 24px 18px", borderTop: "1px solid #1E293B" }}>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleTrainingResponse()}
              placeholder="Your response..."
              style={{ flex: 1, padding: "12px 16px", borderRadius: 10, border: "1px solid #1E293B", background: "#0F172A", color: "#E2E8F0", fontSize: 14, outline: "none" }}
              onFocus={e => e.target.style.borderColor = activeSkill.color}
              onBlur={e => e.target.style.borderColor = "#1E293B"}
            />
            <button
              onClick={() => handleTrainingResponse()}
              disabled={loading || !input.trim()}
              style={{ padding: "12px 20px", borderRadius: 10, border: "none", background: loading || !input.trim() ? "#1E293B" : activeSkill.color, color: "#fff", fontSize: 16, fontWeight: 700, cursor: loading || !input.trim() ? "not-allowed" : "pointer" }}
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
        <div style={{ width: 320, borderRight: "1px solid #1E293B", display: "flex", flexDirection: "column", background: "#0D1526", flexShrink: 0, overflow: "hidden" }}>
          <div style={{ padding: "20px 18px 12px" }}>
            <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 3, color: "#475569", textTransform: "uppercase", marginBottom: 4 }}>
              THINK<span style={{ color: "#3B82F6" }}>FIRST</span>
            </div>
            <div style={{ fontSize: 13, color: "#64748B" }}>
              {userProfile?.name ? `${userProfile.name} · ` : ""}{ageGroup?.label} · {sessions} sessions · Avg L{avgLevel}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
            <SkillRadar skills={skillLevels} />
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 14px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
            {SKILLS.map(s => {
              const level = skillLevels[s.id] || 0;
              return (
                <div
                  key={s.id}
                  onClick={() => startTraining(s)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, cursor: "pointer", border: "1px solid #1E293B", background: "#0F172A", transition: "all 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = s.color}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#1E293B"}
                >
                  <span style={{ color: s.color, fontSize: 16 }}>{s.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#E2E8F0", marginBottom: 4 }}>{s.name}</div>
                    <div style={{ height: 4, background: "#1E293B", borderRadius: 2 }}>
                      <div style={{ height: "100%", width: `${level * 10}%`, background: s.color, borderRadius: 2, transition: "width 0.5s" }} />
                    </div>
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: 12, color: s.color, fontWeight: 700 }}>{level}/10</div>
                </div>
              );
            })}
          </div>
          <div style={{ padding: "10px 14px", borderTop: "1px solid #1E293B" }}>
            <button onClick={reset} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #1E293B", background: "transparent", color: "#334155", fontSize: 11, cursor: "pointer", fontFamily: "monospace" }}>
              Reset
            </button>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 36px" }}>
          <h2 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 700, letterSpacing: -0.5 }}>
            {userProfile?.name ? `Hi ${userProfile.name}.` : "Your Profile."}
          </h2>
          <p style={{ color: "#64748B", fontSize: 14, margin: "0 0 28px" }}>Pick a skill to train. Sessions are short — 2 to 5 minutes.</p>

          {/* Recommended */}
          <div
            onClick={() => startTraining(recommended)}
            style={{ padding: "22px 26px", borderRadius: 14, border: `1px solid ${recommended.color}33`, background: `${recommended.color}08`, cursor: "pointer", marginBottom: 28, transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = recommended.color}
            onMouseLeave={e => e.currentTarget.style.borderColor = `${recommended.color}33`}
          >
            <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 2, color: recommended.color, textTransform: "uppercase", marginBottom: 10 }}>Recommended</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 28, color: recommended.color }}>{recommended.icon}</span>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700 }}>
                  {recommended.name}
                  <span style={{ fontFamily: "monospace", fontSize: 11, color: recommended.color, marginLeft: 10 }}>
                    L{skillLevels[recommended.id] || 1}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: "#64748B", marginTop: 3 }}>
                  {skillDetails[recommended.id]?.feedback || recommended.short}
                </div>
              </div>
            </div>
          </div>

          {/* All skills grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {SKILLS.map(s => {
              const level = skillLevels[s.id] || 0;
              const levelName = LEVELS[Math.max(0, level - 1)]?.name;
              return (
                <div
                  key={s.id}
                  onClick={() => startTraining(s)}
                  style={{ padding: "16px", borderRadius: 10, border: "1px solid #1E293B", background: "#0F172A", cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.background = `${s.color}08`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#1E293B"; e.currentTarget.style.background = "#0F172A"; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}><span style={{ color: s.color, marginRight: 8 }}>{s.icon}</span>{s.name}</div>
                    <div style={{ padding: "2px 8px", borderRadius: 6, background: `${s.color}22`, color: s.color, fontFamily: "monospace", fontSize: 10 }}>L{level} {levelName}</div>
                  </div>
                  <div style={{ fontSize: 11, color: "#475569" }}>{skillDetails[s.id]?.feedback || s.short}</div>
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
