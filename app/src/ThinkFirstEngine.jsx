import { useState, useEffect, useRef } from "react";

// ============================================
// ABILITIES — the 7 skills, in-world names
// ============================================
const ABILITIES = [
  {
    id: "clarity",
    name: "FOCUS",
    skill: "Clarity",
    icon: "◎",
    tagline: "Sharpen a fuzzy thought into a precise command",
    story: "AXIS only responds to clear instructions. Vague requests return silence.",
    color: "#F59E0B",
    unlockLevel: 1,
  },
  {
    id: "decomposition",
    name: "FRAGMENT",
    skill: "Decomposition",
    icon: "◫",
    tagline: "Break the impossible into the possible",
    story: "Large requests overwhelm AXIS. Split them into parts it can handle.",
    color: "#8B5CF6",
    unlockLevel: 2,
  },
  {
    id: "relationships",
    name: "WEAVE",
    skill: "Relationships",
    icon: "⬡",
    tagline: "See the threads that connect everything",
    story: "AXIS misses second-order effects. You must map the connections it cannot.",
    color: "#EC4899",
    unlockLevel: 3,
  },
  {
    id: "outcomes",
    name: "ANCHOR",
    skill: "Outcome Definition",
    icon: "◉",
    tagline: "Know exactly where you're trying to land",
    story: "Without a destination, AXIS wanders. Give it a finish line.",
    color: "#10B981",
    unlockLevel: 3,
  },
  {
    id: "gaps",
    name: "SCOUT",
    skill: "Gap Analysis",
    icon: "▲",
    tagline: "Find what stands between you and the goal",
    story: "AXIS cannot see what's missing. That's your job.",
    color: "#06B6D4",
    unlockLevel: 4,
  },
  {
    id: "procedural",
    name: "SEQUENCE",
    skill: "Procedural Thinking",
    icon: "▤",
    tagline: "Write instructions a literal machine can follow",
    story: "AXIS is completely literal. It follows steps exactly. Write them well.",
    color: "#3B82F6",
    unlockLevel: 5,
  },
  {
    id: "evaluation",
    name: "DISCERN",
    skill: "Evaluation",
    icon: "◆",
    tagline: "Judge whether what came back is actually good",
    story: "AXIS never questions its own output. You must.",
    color: "#EF4444",
    unlockLevel: 6,
  },
];

// ============================================
// VISUAL THEMES
// ============================================
const VISUAL_THEMES = {
  wildwood: {
    name: "Wildwood",
    emoji: "🌲",
    desc: "Ancient forest. Organic. Earned.",
    bg: "#0A120A",
    bgCard: "#111A11",
    bgInput: "#0D160D",
    border: "#1E3A1E",
    text: "#C8E6C8",
    textMuted: "#5A8A5A",
    textFaint: "#2A4A2A",
    accent: "#4ADE80",
    accentWarm: "#86EFAC",
    gradient: "radial-gradient(ellipse at 20% 20%, #0F2A0F 0%, #0A120A 60%)",
  },
  neon: {
    name: "Neon City",
    emoji: "⚡",
    desc: "Cyberpunk dark. Electric. Sharp.",
    bg: "#06060F",
    bgCard: "#0D0D1A",
    bgInput: "#08081A",
    border: "#1A1A3A",
    text: "#C8C8FF",
    textMuted: "#5A5A9A",
    textFaint: "#2A2A5A",
    accent: "#818CF8",
    accentWarm: "#A5B4FC",
    gradient: "radial-gradient(ellipse at 80% 20%, #0D0D2A 0%, #06060F 60%)",
  },
  ember: {
    name: "Ember",
    emoji: "🌅",
    desc: "Desert warmth. Ancient. Glowing.",
    bg: "#120A04",
    bgCard: "#1A1008",
    bgInput: "#160D06",
    border: "#3A1E0A",
    text: "#F5D6A8",
    textMuted: "#8A5A28",
    textFaint: "#3A2A10",
    accent: "#F59E0B",
    accentWarm: "#FCD34D",
    gradient: "radial-gradient(ellipse at 30% 80%, #2A1208 0%, #120A04 60%)",
  },
};

// ============================================
// LEVEL TITLES
// ============================================
const RANK_TITLES = [
  "", "Initiate", "Apprentice", "Apprentice", "Journeyman",
  "Journeyman", "Adept", "Adept", "Master", "Master", "Legend",
];

// ============================================
// QUEST SCENARIOS — story-framed, age-aware
// ============================================
const QUESTS = [
  {
    abilityId: "clarity",
    title: "The First Signal",
    intro: {
      young:  "AXIS is waiting. You type: 'do the thing'. AXIS replies: '...I do not understand.' What do you tell it instead?",
      child:  "You've found AXIS. Your first test: it can only act on clear instructions. You type 'help me'. It returns nothing. Fix your instruction.",
      teen:   "AXIS is online. Your first command: 'help me with stuff'. Response: null. The machine is literal. Rewrite the command so it actually works.",
      adult:  "AXIS initialised. You send: 'help me with the project'. Response: insufficient parameters. Rewrite the command with the specificity it needs.",
    },
    starters: {
      young:  ["Get me a 🍪 biscuit from the tin", "Draw a red 🔴 circle", "Play the song called 🎵 Happy"],
      child:  ["Help me write a 3-paragraph story about...", "Find 5 facts about...", "Give me 3 ideas for..."],
      teen:   ["Summarise this topic in bullet points:", "Write a 200-word explanation of...", "List the pros and cons of..."],
      adult:  ["Draft a 3-point summary of...", "Identify the key risks in...", "Propose 3 options for solving..."],
    },
  },
  {
    abilityId: "decomposition",
    title: "The Great Split",
    intro: {
      young:  "You ask AXIS to 'tidy everything'. It freezes — too big! Break it into 3 smaller jobs for it.",
      child:  "AXIS can only do one thing at a time. Your mission: 'build a treehouse'. Too big. Split it into its parts.",
      teen:   "AXIS returned an error: 'request too complex'. Break your task into its component parts so it can handle them one by one.",
      adult:  "AXIS flagged your request as out of scope. Decompose the problem into distinct, independently executable parts.",
    },
    starters: {
      young:  ["First: pick up the toys 🧸", "Then: put books on shelf 📚", "Next: make the bed 🛏️"],
      child:  ["Part 1: gather materials,", "Part 2: design the plan,", "Part 3: build section by section,"],
      teen:   ["Component 1: define the brief,", "Component 2: research options,", "Component 3: execute,"],
      adult:  ["Phase 1: scope and constraints,", "Phase 2: options analysis,", "Phase 3: recommendation,"],
    },
  },
  {
    abilityId: "relationships",
    title: "The Web",
    intro: {
      young:  "AXIS can only see what's in front of it. If it rains ☔, it says 'you get wet'. But what ELSE changes?",
      child:  "AXIS misses connections. If school cancelled homework — it only sees 'kids are happy'. What else happens?",
      teen:   "AXIS sees first-order effects only. A popular app bans ads. It says 'revenue drops'. What does it miss?",
      adult:  "AXIS lacks systems thinking. Your team loses its best performer. It flags 'capacity reduction'. What does it miss?",
    },
    starters: {
      young:  ["We'd have to stay inside and...", "Mum would need to...", "The garden would..."],
      child:  ["Teachers would change how they...", "Parents might start...", "Other kids would..."],
      teen:   ["Users migrate to competitors,", "Advertisers shift budget,", "Content quality changes because..."],
      adult:  ["Knowledge loss compounds because...", "Team morale shifts when...", "Client relationships weaken as..."],
    },
  },
  {
    abilityId: "outcomes",
    title: "The Destination",
    intro: {
      young:  "You tell AXIS to 'clean the plate 🍽️'. But what does clean ACTUALLY mean? How does AXIS know when it's done?",
      child:  "You ask AXIS to write 'a good story'. It asks: what makes it good? You need to define done.",
      teen:   "AXIS needs a finish line. 'Get better at maths' isn't one. Define what success looks like in 4 weeks.",
      adult:  "AXIS cannot optimise without a target state. Define what 'improved team communication' looks like in measurable terms.",
    },
    starters: {
      young:  ["Done means: no food left on it 🍽️", "Done means: it's shiny ✨", "Done means: I can eat off it again"],
      child:  ["Good means: I want to read it twice,", "Good means: it makes me feel something,", "Good means: it has a real ending,"],
      teen:   ["Success = test score up by X in 4 weeks,", "Success = I can explain it to someone,", "Success = I don't need to google it anymore,"],
      adult:  ["Target: escalations down 30%,", "Target: decisions made in meeting, not after,", "Target: team survey score 7+ by week 8,"],
    },
  },
  {
    abilityId: "gaps",
    title: "The Missing Pieces",
    intro: {
      young:  "You want to bake a cake 🎂. You have flour. AXIS lists what you have — but can you find what's missing?",
      child:  "You want to make a YouTube video. You have a camera. AXIS says 'you're ready'. But what's actually missing?",
      teen:   "You want to start something. You have an idea. List your 3 biggest gaps — the things between you and launch.",
      adult:  "Your team wants to ship in 60 days. You have people. Name what's missing — categorised by type of gap.",
    },
    starters: {
      young:  ["I'm missing eggs 🥚", "I need sugar 🍬", "I don't have butter 🧈"],
      child:  ["Missing: a script or plan,", "Missing: editing software,", "Missing: an audience,"],
      teen:   ["Gap 1: money to start,", "Gap 2: actual customers,", "Gap 3: way to get paid,"],
      adult:  ["Knowledge gap: no validated spec,", "Resource gap: no design capacity,", "Market gap: no validated demand,"],
    },
  },
  {
    abilityId: "procedural",
    title: "The Protocol",
    intro: {
      young:  "AXIS needs exact steps 🤖. Tell it how to make cereal — step by step. If you skip a step, it gets confused!",
      child:  "AXIS is very literal. Write the exact steps for it to pick tonight's movie. Miss nothing.",
      teen:   "AXIS follows instructions exactly, no guessing. Write 4 steps it would follow to decide if an email needs a reply.",
      adult:  "AXIS has no judgement. Write 3 decision steps it would follow to triage an inbound request. Make each branch explicit.",
    },
    starters: {
      young:  ["Step 1: get a bowl 🥣", "Step 2: open the box 📦", "Step 3: pour cereal first 🌾"],
      child:  ["Step 1: check who's watching,", "Step 2: filter by age rating,", "Step 3: find one everyone hasn't seen,"],
      teen:   ["Step 1: is it addressed to me?", "Step 2: does it require action?", "Step 3: is there a deadline?"],
      adult:  ["Step 1: is it time-sensitive? If yes →", "Step 2: is it in my scope? If no →", "Step 3: does it need a decision?"],
    },
  },
  {
    abilityId: "evaluation",
    title: "The Judgement",
    intro: {
      young:  "AXIS says 2+2=5 😮. How do you know it's wrong? What do you do next?",
      child:  "AXIS says the moon is made of cheese 🧀. It sounds confident. How do you know to trust it — or not?",
      teen:   "AXIS just wrote your essay plan. Before you use it — what are the 2 things you'd check?",
      adult:  "AXIS recommended a strategy. Before you act — what's the first thing you'd question about its reasoning?",
    },
    starters: {
      young:  ["I know it's wrong because...", "I'd check by counting myself 🔢", "I'd ask a grown-up 👨‍👩‍👧"],
      child:  ["I'd check a second source,", "I'd look it up to compare,", "I'd ask it to show its working,"],
      teen:   ["Does it actually answer the question?", "Is anything obviously missing?", "Are the sources reliable?"],
      adult:  ["What assumptions did it make?", "What data is it missing?", "Does it account for risk?"],
    },
  },
];

// ============================================
// STORAGE
// ============================================
const STORAGE_KEY = "thinkfirst-rpg-v1";
function load() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null; } catch { return null; } }
function save(s) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {} }

// ============================================
// API
// ============================================
async function callAI(system, messages) {
  try {
    const res = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 500, system, messages }),
    });
    const data = await res.json();
    return data.content?.map(c => c.text || "").join("") || "...";
  } catch { return "AXIS is unreachable. Check your connection."; }
}

const ageLabel = { young: "a 4-8 year old", child: "a 9-12 year old", teen: "a teenager", adult: "an adult" };

function questPrompt(ability, ageGroup, userName) {
  const name = userName ? `The player's name is ${userName}. ` : "";
  return `You are AXIS — a powerful but completely literal machine. You are training ${ageLabel[ageGroup]} in the ability called "${ability.name}" (which is really about: ${ability.skill} — ${ability.tagline}).

${name}You exist in a light RPG/adventure world. Stay in character as AXIS: precise, a little dry, never warm but never cruel.

Your job: respond to their attempt, then coach their THINKING STRUCTURE in one sentence. If they're on the right track, acknowledge it and push them one level deeper with a follow-up challenge.

Keep responses SHORT — max 4 sentences. Use simple language appropriate for ${ageLabel[ageGroup]}.
Never explain the framework. Never say words like "decomposition" or "clarity". Just respond as AXIS and coach their thinking.`;
}

function assessPrompt(ability, ageGroup) {
  return `You are a hidden assessment engine. The player just attempted a quest testing "${ability.skill}". They are ${ageLabel[ageGroup]}.

Short answers (even 5-10 words) are fine — reward clarity of thinking over length.

Score 1-10. Be generous if the thinking structure is sound.
JSON only: {"score": <1-10>, "feedback": "<one short encouraging line, in-world, as if AXIS is acknowledging them>", "ready_to_advance": <true|false>}`;
}

// ============================================
// MULTI-SELECT BUBBLES
// ============================================
const Bubbles = ({ options, selected, onToggle, vt }) => (
  <div style={{ padding: "0 20px 16px", display: "flex", gap: 10, flexWrap: "wrap" }}>
    {options.map((s, i) => {
      const on = selected.includes(s);
      return (
        <button key={i} onClick={() => onToggle(s)} style={{
          padding: "12px 20px", borderRadius: 50, fontSize: 14, fontWeight: on ? 700 : 400,
          border: `2px solid ${on ? vt.accent : vt.border}`,
          background: on ? vt.accent : vt.bgCard,
          color: on ? "#000" : vt.textMuted,
          cursor: "pointer", transition: "all 0.15s",
          transform: on ? "scale(1.05)" : "scale(1)",
          boxShadow: on ? `0 0 16px ${vt.accent}66` : "none",
          minWidth: 100,
        }}>
          {s}
        </button>
      );
    })}
  </div>
);

// ============================================
// CHAT MESSAGE
// ============================================
const Msg = ({ role, content, vt, isAxis }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: role === "user" ? "flex-end" : "flex-start", marginBottom: 14 }}>
    {isAxis && role === "assistant" && (
      <div style={{ fontSize: 10, letterSpacing: 2, color: vt.accent, fontFamily: "monospace", marginBottom: 4, textTransform: "uppercase" }}>AXIS</div>
    )}
    <div style={{
      maxWidth: "88%", padding: "14px 18px",
      borderRadius: role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
      background: role === "user" ? `${vt.accent}22` : vt.bgCard,
      border: `1px solid ${role === "user" ? vt.accent + "44" : vt.border}`,
      color: vt.text, fontSize: 15, lineHeight: 1.7, whiteSpace: "pre-wrap",
    }}>
      {content}
    </div>
  </div>
);

const Thinking = ({ vt }) => {
  const [d, setD] = useState("");
  useEffect(() => {
    const i = setInterval(() => setD(v => v.length >= 3 ? "" : v + "."), 350);
    return () => clearInterval(i);
  }, []);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 10, letterSpacing: 2, color: vt.accent, fontFamily: "monospace", marginBottom: 4, textTransform: "uppercase" }}>AXIS</div>
      <div style={{ display: "inline-block", padding: "12px 18px", borderRadius: "4px 18px 18px 18px", background: vt.bgCard, border: `1px solid ${vt.border}`, color: vt.textMuted, fontFamily: "monospace", fontSize: 13 }}>
        processing{d}
      </div>
    </div>
  );
};

// ============================================
// ABILITY CARD
// ============================================
const AbilityCard = ({ ability, level, unlocked, onClick, vt }) => {
  const locked = !unlocked;
  return (
    <div onClick={unlocked ? onClick : undefined} style={{
      padding: "18px 20px", borderRadius: 14,
      border: `1px solid ${locked ? vt.border : ability.color + "44"}`,
      background: locked ? vt.bgCard : `${ability.color}08`,
      cursor: locked ? "default" : "pointer", opacity: locked ? 0.4 : 1,
      transition: "all 0.2s", position: "relative", overflow: "hidden",
    }}
      onMouseEnter={e => { if (!locked) e.currentTarget.style.borderColor = ability.color; }}
      onMouseLeave={e => { if (!locked) e.currentTarget.style.borderColor = `${ability.color}44`; }}
    >
      {locked && (
        <div style={{ position: "absolute", top: 12, right: 14, fontSize: 16, opacity: 0.4 }}>🔒</div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22, color: ability.color }}>{ability.icon}</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", color: locked ? vt.textMuted : vt.text }}>{ability.name}</div>
            <div style={{ fontSize: 11, color: vt.textMuted }}>{ability.skill}</div>
          </div>
        </div>
        {!locked && (
          <div style={{ fontFamily: "monospace", fontSize: 11, color: ability.color, background: `${ability.color}22`, padding: "3px 10px", borderRadius: 20 }}>
            {RANK_TITLES[level] || "Initiate"} · L{level}
          </div>
        )}
      </div>
      <div style={{ fontSize: 13, color: vt.textMuted, lineHeight: 1.5 }}>{ability.tagline}</div>
      {!locked && (
        <div style={{ marginTop: 10, height: 4, background: vt.border, borderRadius: 2 }}>
          <div style={{ height: "100%", width: `${level * 10}%`, background: ability.color, borderRadius: 2, transition: "width 0.5s", boxShadow: `0 0 8px ${ability.color}88` }} />
        </div>
      )}
    </div>
  );
};

// ============================================
// MAIN APP
// ============================================
export default function ThinkFirstEngine() {
  const [screen, setScreen]     = useState("loading");
  const [vTheme, setVTheme]     = useState("neon");
  const [userName, setUserName] = useState("");
  const [ageGroup, setAgeGroup] = useState(null);
  const [levels, setLevels]     = useState({});
  const [activeAbility, setActiveAbility] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [selected, setSelected] = useState([]);
  const [input, setInput]       = useState("");
  const [nameInput, setNameInput] = useState("");
  const [chosenAge, setChosenAge] = useState(null);
  const [questStep, setQuestStep] = useState(0); // 0=intro, 1=playing
  const [totalSessions, setTotalSessions] = useState(0);
  const [justLevelledUp, setJustLevelledUp] = useState(null);
  const chatEnd = useRef(null);
  const inputRef = useRef(null);

  const vt = VISUAL_THEMES[vTheme];

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  useEffect(() => {
    const saved = load();
    if (saved?.ageGroup && saved?.levels && Object.keys(saved.levels).length > 0) {
      setVTheme(saved.vTheme || "neon");
      setUserName(saved.userName || "");
      setAgeGroup(saved.ageGroup);
      setLevels(saved.levels);
      setTotalSessions(saved.totalSessions || 0);
      setScreen("hub");
    } else {
      setScreen("theme");
    }
  }, []);

  function persist(updates) {
    save({ vTheme, userName, ageGroup, levels, totalSessions, ...updates });
  }

  const toggleBubble = (s) => setSelected(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const buildAnswer = () => [...selected, input.trim()].filter(Boolean).join(" ").trim();
  const hasAnswer = selected.length > 0 || input.trim().length > 0;

  // ============================================
  // QUEST ENGINE
  // ============================================
  const startQuest = async (ability) => {
    setActiveAbility(ability);
    setMessages([]);
    setSelected([]);
    setInput("");
    setQuestStep(1);
    setScreen("quest");
    const quest = QUESTS.find(q => q.abilityId === ability.id);
    const intro = quest?.intro?.[ageGroup] || quest?.intro?.adult;
    const level = levels[ability.id] || 1;
    const rank = RANK_TITLES[level] || "Initiate";
    setMessages([
      {
        role: "assistant",
        content: `── QUEST: ${quest?.title || ability.name} ──\n\n${intro}`,
      }
    ]);
  };

  const sendAnswer = async () => {
    const answer = buildAnswer();
    if (!answer || loading) return;
    setInput("");
    setSelected([]);

    const newMsgs = [...messages, { role: "user", content: answer }];
    setMessages(newMsgs);
    setLoading(true);

    // Score + respond
    const ability = activeAbility;
    const quest = QUESTS.find(q => q.abilityId === ability.id);

    const [axisReply, scoreRaw] = await Promise.all([
      callAI(questPrompt(ability, ageGroup, userName), newMsgs),
      callAI(assessPrompt(ability, ageGroup), [{ role: "user", content: answer }]),
    ]);

    let parsed;
    try { parsed = JSON.parse(scoreRaw.replace(/```json|```/g, "").trim()); }
    catch { parsed = { score: 5, feedback: "Signal received.", ready_to_advance: false }; }

    const currentLevel = levels[ability.id] || 1;
    const newLevel = parsed.ready_to_advance && parsed.score >= 7
      ? Math.min(10, currentLevel + 1)
      : currentLevel;

    const newLevels = { ...levels, [ability.id]: newLevel };
    const levelled = newLevel > currentLevel;

    const updatedMsgs = [...newMsgs, { role: "assistant", content: axisReply }];
    if (levelled) {
      updatedMsgs.push({
        role: "assistant",
        content: `── LEVEL UP ──\n\n${ability.name} advanced to ${RANK_TITLES[newLevel]} · L${newLevel}\n\n${parsed.feedback}`,
      });
      setJustLevelledUp(ability);
      setTimeout(() => setJustLevelledUp(null), 4000);
    }

    setMessages(updatedMsgs);
    setLevels(newLevels);
    const newSessions = totalSessions + 1;
    setTotalSessions(newSessions);
    persist({ levels: newLevels, totalSessions: newSessions });
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const returnToHub = () => {
    setActiveAbility(null);
    setMessages([]);
    setSelected([]);
    setInput("");
    setScreen("hub");
  };

  // Which abilities are unlocked?
  // First one always unlocked. Others unlock as you level up previous ones.
  const isUnlocked = (ability) => {
    const idx = ABILITIES.findIndex(a => a.id === ability.id);
    if (idx === 0) return true;
    const prev = ABILITIES[idx - 1];
    return (levels[prev.id] || 0) >= 2;
  };

  const overallLevel = ABILITIES.length
    ? Math.round(Object.values(levels).reduce((a, b) => a + b, 0) / ABILITIES.length) || 1
    : 1;

  // ============================================
  // SCREEN: THEME SELECT
  // ============================================
  if (screen === "theme") return (
    <div style={{ minHeight: "100vh", background: VISUAL_THEMES[vTheme].gradient || VISUAL_THEMES[vTheme].bg, color: VISUAL_THEMES[vTheme].text, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 28, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <div style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: 4, color: VISUAL_THEMES[vTheme].textMuted, textTransform: "uppercase", marginBottom: 12 }}>Initialising...</div>
        <h1 style={{ fontSize: 52, fontWeight: 800, letterSpacing: -2, margin: "0 0 8px" }}>
          AXIS <span style={{ color: VISUAL_THEMES[vTheme].accent, fontWeight: 300 }}>awaits.</span>
        </h1>
        <p style={{ color: VISUAL_THEMES[vTheme].textMuted, fontSize: 15, lineHeight: 1.7, margin: "0 0 32px" }}>
          A device of unknown origin. It responds only to structured thought.<br />
          Choose your world first.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
          {Object.entries(VISUAL_THEMES).map(([key, theme]) => (
            <button key={key} onClick={() => setVTheme(key)} style={{
              padding: "18px 20px", borderRadius: 14, cursor: "pointer", textAlign: "left",
              border: `2px solid ${vTheme === key ? theme.accent : theme.border}`,
              background: vTheme === key ? `${theme.accent}15` : theme.bgCard,
              color: theme.text, transition: "all 0.2s", display: "flex", gap: 16, alignItems: "center",
            }}>
              <span style={{ fontSize: 28 }}>{theme.emoji}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{theme.name}</div>
                <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>{theme.desc}</div>
              </div>
              {vTheme === key && <div style={{ marginLeft: "auto", color: theme.accent, fontSize: 18 }}>✓</div>}
            </button>
          ))}
        </div>

        <button onClick={() => setScreen("profile")} style={{
          width: "100%", padding: "16px", borderRadius: 12, border: "none",
          background: VISUAL_THEMES[vTheme].accent, color: "#000", fontSize: 16, fontWeight: 800,
          cursor: "pointer", letterSpacing: 1, fontFamily: "monospace",
        }}>
          CONTINUE →
        </button>
      </div>
    </div>
  );

  // ============================================
  // SCREEN: PROFILE
  // ============================================
  if (screen === "profile") {
    const pvt = VISUAL_THEMES[vTheme];
    const AGE_OPTIONS = [
      { id: "young", label: "Young Explorer", ages: "4–8",   emoji: "🌱" },
      { id: "child", label: "Explorer",       ages: "9–12",  emoji: "🚀" },
      { id: "teen",  label: "Teen",           ages: "13–17", emoji: "⚡" },
      { id: "adult", label: "Adult",          ages: "18+",   emoji: "◈"  },
    ];
    return (
      <div style={{ minHeight: "100vh", background: pvt.gradient || pvt.bg, color: pvt.text, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 28, fontFamily: "system-ui, sans-serif" }}>
        <div style={{ width: "100%", maxWidth: 480 }}>
          <div style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: 4, color: pvt.textMuted, textTransform: "uppercase", marginBottom: 20 }}>
            Who are you, traveller?
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: pvt.textMuted, marginBottom: 8, fontFamily: "monospace", letterSpacing: 1 }}>YOUR NAME</div>
            <input
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && chosenAge && (() => {
                setUserName(nameInput.trim());
                setAgeGroup(chosenAge);
                setLevels({ clarity: 1, decomposition: 1, relationships: 1, outcomes: 1, gaps: 1, procedural: 1, evaluation: 1 });
                persist({ userName: nameInput.trim(), ageGroup: chosenAge, levels: { clarity: 1, decomposition: 1, relationships: 1, outcomes: 1, gaps: 1, procedural: 1, evaluation: 1 }, totalSessions: 0, vTheme });
                setScreen("intro");
              })()}
              placeholder="Optional — what should AXIS call you?"
              style={{ width: "100%", padding: "13px 16px", borderRadius: 10, border: `2px solid ${pvt.border}`, background: pvt.bgInput, color: pvt.text, fontSize: 15, outline: "none", boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = pvt.accent}
              onBlur={e => e.target.style.borderColor = pvt.border}
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 12, color: pvt.textMuted, marginBottom: 12, fontFamily: "monospace", letterSpacing: 1 }}>YOUR LEVEL</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {AGE_OPTIONS.map(ag => (
                <button key={ag.id} onClick={() => setChosenAge(ag.id)} style={{
                  padding: "16px", borderRadius: 12, cursor: "pointer", textAlign: "left",
                  border: `2px solid ${chosenAge === ag.id ? pvt.accent : pvt.border}`,
                  background: chosenAge === ag.id ? `${pvt.accent}18` : pvt.bgCard,
                  color: pvt.text, transition: "all 0.2s",
                  transform: chosenAge === ag.id ? "scale(1.03)" : "scale(1)",
                }}>
                  <div style={{ fontSize: 26, marginBottom: 6 }}>{ag.emoji}</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{ag.label}</div>
                  <div style={{ fontSize: 11, color: pvt.textMuted, marginTop: 2 }}>Ages {ag.ages}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            disabled={!chosenAge}
            onClick={() => {
              const initLevels = { clarity: 1, decomposition: 1, relationships: 1, outcomes: 1, gaps: 1, procedural: 1, evaluation: 1 };
              setUserName(nameInput.trim());
              setAgeGroup(chosenAge);
              setLevels(initLevels);
              persist({ userName: nameInput.trim(), ageGroup: chosenAge, levels: initLevels, totalSessions: 0, vTheme });
              setScreen("intro");
            }}
            style={{
              width: "100%", padding: "16px", borderRadius: 12, border: "none",
              background: chosenAge ? pvt.accent : pvt.border,
              color: chosenAge ? "#000" : pvt.textFaint,
              fontSize: 15, fontWeight: 800, cursor: chosenAge ? "pointer" : "not-allowed",
              letterSpacing: 1, fontFamily: "monospace",
            }}
          >
            INITIALISE →
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // SCREEN: STORY INTRO
  // ============================================
  if (screen === "intro") {
    const introText = [
      `${userName ? `${userName}.` : "You."} That's who you are.`,
      `And AXIS has been waiting.`,
      `It doesn't know you yet. It doesn't know what you want, what you're trying to build, or where you're trying to go.`,
      `It's powerful. Impossibly so. But it is completely literal — it responds only to structured thought.`,
      `The better you learn to think, the more AXIS can do.`,
      `Seven abilities stand between you and full mastery. You'll unlock them one by one.`,
      `Start with the first: FOCUS — the ability to turn a fuzzy thought into something AXIS can act on.`,
    ];
    const [step, setStep] = useState(0);

    return (
      <div style={{ minHeight: "100vh", background: vt.gradient || vt.bg, color: vt.text, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 28, fontFamily: "system-ui, sans-serif" }}>
        <div style={{ width: "100%", maxWidth: 520, textAlign: "center" }}>
          <div style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: 4, color: vt.textMuted, textTransform: "uppercase", marginBottom: 32 }}>
            Establishing connection...
          </div>

          <div style={{ minHeight: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ fontSize: 20, lineHeight: 1.8, color: step < introText.length - 1 ? vt.text : vt.accentWarm, fontWeight: step === 0 ? 700 : 400, transition: "all 0.3s" }}>
              {introText[step]}
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 6, margin: "24px 0" }}>
            {introText.map((_, i) => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i <= step ? vt.accent : vt.border, transition: "all 0.3s" }}/>
            ))}
          </div>

          {step < introText.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)} style={{
              padding: "14px 40px", borderRadius: 50, border: `1px solid ${vt.border}`,
              background: "transparent", color: vt.textMuted, fontSize: 14, cursor: "pointer", fontFamily: "monospace",
            }}>
              continue →
            </button>
          ) : (
            <button onClick={() => setScreen("hub")} style={{
              padding: "16px 48px", borderRadius: 12, border: "none",
              background: vt.accent, color: "#000", fontSize: 15, fontWeight: 800,
              cursor: "pointer", fontFamily: "monospace", letterSpacing: 1,
              boxShadow: `0 0 32px ${vt.accent}66`,
            }}>
              BEGIN →
            </button>
          )}
        </div>
      </div>
    );
  }

  // ============================================
  // SCREEN: HUB
  // ============================================
  if (screen === "hub") {
    return (
      <div style={{ minHeight: "100vh", background: vt.gradient || vt.bg, color: vt.text, fontFamily: "system-ui, sans-serif" }}>
        {/* Header */}
        <div style={{ padding: "16px 28px", borderBottom: `1px solid ${vt.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: vt.bgCard }}>
          <div>
            <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 3, color: vt.textMuted, textTransform: "uppercase" }}>AXIS Interface</div>
            <div style={{ fontWeight: 700, fontSize: 17, marginTop: 2 }}>
              {userName || "Traveller"} <span style={{ color: vt.accent, fontFamily: "monospace", fontSize: 12 }}>· {RANK_TITLES[overallLevel]} · L{overallLevel}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: vt.textMuted, fontFamily: "monospace" }}>SESSIONS</div>
              <div style={{ fontFamily: "monospace", fontSize: 18, color: vt.accent, fontWeight: 700 }}>{totalSessions}</div>
            </div>
            <button onClick={() => { save(null); localStorage.removeItem(STORAGE_KEY); setScreen("theme"); setLevels({}); }} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${vt.border}`, background: "transparent", color: vt.textFaint, fontSize: 11, cursor: "pointer", fontFamily: "monospace" }}>
              reset
            </button>
          </div>
        </div>

        {/* Level up toast */}
        {justLevelledUp && (
          <div style={{ position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)", zIndex: 100, padding: "16px 28px", borderRadius: 14, background: justLevelledUp.color, color: "#000", fontFamily: "monospace", fontWeight: 700, fontSize: 15, boxShadow: `0 0 40px ${justLevelledUp.color}`, animation: "fadeUp 0.4s ease" }}>
            ↑ {justLevelledUp.name} levelled up!
          </div>
        )}

        <div style={{ padding: "28px", maxWidth: 900, margin: "0 auto" }}>
          {/* Intro nudge for new players */}
          {totalSessions === 0 && (
            <div style={{ padding: "18px 22px", borderRadius: 14, border: `1px solid ${vt.accent}44`, background: `${vt.accent}0A`, marginBottom: 28 }}>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: vt.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Your first quest awaits</div>
              <div style={{ fontSize: 14, color: vt.textMuted, lineHeight: 1.6 }}>
                Start with <strong style={{ color: vt.text }}>FOCUS</strong> — tap the card below to begin. Each ability unlocks the next. Sessions take 2–5 minutes.
              </div>
            </div>
          )}

          <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 3, color: vt.textMuted, textTransform: "uppercase", marginBottom: 16 }}>Your Abilities</div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {ABILITIES.map(ability => (
              <AbilityCard
                key={ability.id}
                ability={ability}
                level={levels[ability.id] || 1}
                unlocked={isUnlocked(ability)}
                onClick={() => startQuest(ability)}
                vt={vt}
              />
            ))}
          </div>
        </div>

        <style>{`@keyframes fadeUp { from { opacity:0; transform: translateX(-50%) translateY(10px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }`}</style>
      </div>
    );
  }

  // ============================================
  // SCREEN: QUEST
  // ============================================
  if (screen === "quest" && activeAbility) {
    const quest = QUESTS.find(q => q.abilityId === activeAbility.id);
    const starters = quest?.starters?.[ageGroup] || [];
    const showBubbles = !loading && messages.length <= 2;

    return (
      <div style={{ height: "100vh", background: vt.bg, color: vt.text, fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${vt.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: vt.bgCard, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 20, color: activeAbility.color }}>{activeAbility.icon}</span>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: activeAbility.color, letterSpacing: 2 }}>{activeAbility.name}</div>
              <div style={{ fontSize: 11, color: vt.textMuted }}>{quest?.title}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: vt.textMuted }}>
              L{levels[activeAbility.id] || 1} · {RANK_TITLES[levels[activeAbility.id] || 1]}
            </div>
            <button onClick={returnToHub} style={{ padding: "7px 16px", borderRadius: 8, border: `1px solid ${activeAbility.color}66`, background: "transparent", color: activeAbility.color, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "monospace" }}>
              ← Hub
            </button>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "22px 22px 8px" }}>
          {messages.map((m, i) => <Msg key={i} role={m.role} content={m.content} vt={vt} isAxis={true}/>)}
          {loading && <Thinking vt={vt}/>}
          <div ref={chatEnd}/>
        </div>

        {/* Bubbles */}
        {showBubbles && <Bubbles options={starters} selected={selected} onToggle={toggleBubble} vt={vt}/>}

        {/* Selected preview */}
        {selected.length > 0 && (
          <div style={{ padding: "0 20px 10px" }}>
            <div style={{ padding: "8px 14px", borderRadius: 8, background: `${activeAbility.color}18`, border: `1px solid ${activeAbility.color}44`, fontSize: 12, color: activeAbility.color, fontFamily: "monospace" }}>
              → "{selected.join(" ")}{input ? " " + input : ""}"
            </div>
          </div>
        )}

        {/* Input */}
        <div style={{ padding: "10px 20px 20px", borderTop: `1px solid ${vt.border}`, background: vt.bgCard, flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendAnswer()}
              placeholder={selected.length > 0 ? "Add more, or just send →" : "Send a command to AXIS..."}
              style={{ flex: 1, padding: "13px 18px", borderRadius: 10, border: `2px solid ${vt.border}`, background: vt.bgInput, color: vt.text, fontSize: 15, outline: "none" }}
              onFocus={e => e.target.style.borderColor = activeAbility.color}
              onBlur={e => e.target.style.borderColor = vt.border}
            />
            <button
              onClick={sendAnswer}
              disabled={loading || !hasAnswer}
              style={{ padding: "13px 22px", borderRadius: 10, border: "none", background: (loading || !hasAnswer) ? vt.border : activeAbility.color, color: "#000", fontSize: 18, fontWeight: 800, cursor: (loading || !hasAnswer) ? "not-allowed" : "pointer", transition: "all 0.15s" }}
            >
              →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
