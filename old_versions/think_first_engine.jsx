import { useState, useEffect, useRef, useCallback } from "react";

// ============================================
// ENGINE SCHEMA - THE UNIVERSAL SKILL FRAMEWORK
// ============================================
const SKILLS = [
  {
    id: "clarity",
    name: "Clarity",
    short: "Vague thought → precise question",
    icon: "◎",
    color: "#3B82F6",
  },
  {
    id: "decomposition",
    name: "Decomposition",
    short: "Whole → meaningful parts",
    icon: "◫",
    color: "#8B5CF6",
  },
  {
    id: "relationships",
    name: "Relationships",
    short: "Parts → connected system",
    icon: "⬡",
    color: "#EC4899",
  },
  {
    id: "outcomes",
    name: "Outcome Definition",
    short: "Vague goal → measurable finish line",
    icon: "◉",
    color: "#F59E0B",
  },
  {
    id: "gaps",
    name: "Gap Analysis",
    short: "Here → there, what's missing",
    icon: "▧",
    color: "#10B981",
  },
  {
    id: "procedural",
    name: "Procedural Thinking",
    short: "Intent → executable steps",
    icon: "▤",
    color: "#06B6D4",
  },
  {
    id: "evaluation",
    name: "Evaluation",
    short: "Output → judgment",
    icon: "◈",
    color: "#EF4444",
  },
];

const LEVELS = [
  { level: 1, name: "Seed", desc: "Has instinct, can't articulate" },
  { level: 2, name: "Sprout", desc: "Can do with scaffolding" },
  { level: 3, name: "Root", desc: "Independent on familiar problems" },
  { level: 4, name: "Branch", desc: "Applies to novel situations" },
  { level: 5, name: "Trunk", desc: "Self-corrects and teaches others" },
  { level: 6, name: "Canopy", desc: "Designs systems using the skill" },
  { level: 7, name: "Crown", desc: "Innovates on the framework" },
  { level: 8, name: "Grove", desc: "Cross-pollinates skills fluidly" },
  { level: 9, name: "Forest", desc: "Unconscious mastery, shapes environments" },
  { level: 10, name: "Ecosystem", desc: "Creates new skills from the meta-pattern" },
];

const ASSESSMENT_SCENARIOS = [
  {
    skill: "clarity",
    prompt: "Your team just said: 'We need to be more strategic about our approach.' What's the first thing you'd do with that statement?",
    rubric: {
      low: ["accept it", "agree", "start planning", "brainstorm"],
      mid: ["ask what they mean", "clarify", "define strategic", "ask for specifics"],
      high: ["reframe into specific questions", "decompose into measurable", "identify what decision", "translate to testable"],
    },
  },
  {
    skill: "decomposition",
    prompt: "You need to 'improve customer retention.' Before doing anything — what are ALL the components of this problem?",
    rubric: {
      low: ["make customers happier", "better service", "discounts", "talk to them"],
      mid: ["onboarding, support, pricing, product quality", "reasons they leave", "segments", "touchpoints"],
      high: ["churn triggers by segment", "retention levers by lifecycle stage", "measurement framework", "causal factors vs symptoms"],
    },
  },
  {
    skill: "relationships",
    prompt: "You cut your product price by 20%. Map what happens next — not just the obvious first-order effects.",
    rubric: {
      low: ["more sales", "less revenue", "competitors react"],
      mid: ["margin impact", "volume needed to compensate", "brand perception shift", "sales team behaviour change"],
      high: ["feedback loops: price drop → volume up → support costs up → quality pressure", "competitor response → price war risk", "customer anchoring → future pricing power reduced"],
    },
  },
  {
    skill: "outcomes",
    prompt: "You want to 'get better at public speaking.' Define what 'done' looks like in a way that both of us would agree on.",
    rubric: {
      low: ["feel more confident", "be better", "not nervous", "good feedback"],
      mid: ["deliver 10-min talk without notes", "audience rates 7+", "no filler words"],
      high: ["deliver 20-min talk to 50+ people, Q&A handled, audience NPS 8+, recordable quality, within 6 months, measurable improvement trajectory"],
    },
  },
  {
    skill: "gaps",
    prompt: "You want to launch a side project in 3 months. You have the idea and basic skills. What's missing? Categorise each gap.",
    rubric: {
      low: ["time", "money", "knowledge"],
      mid: ["market validation, MVP scope, distribution, landing page, first 10 users", "some categorisation"],
      high: ["categorised as: validate now / build / automate / defer", "sequenced by dependency", "risk-weighted", "distinguishes known gaps from unknown unknowns"],
    },
  },
  {
    skill: "procedural",
    prompt: "Write the exact steps someone else would follow to decide whether to accept a meeting invitation. Make it specific enough that a very literal person could follow it without asking you questions.",
    rubric: {
      low: ["check if free", "decide if important", "accept or decline"],
      mid: ["check calendar, check agenda exists, check if you're needed, check if async works, decide"],
      high: ["input: invitation details. step 1: does it have an agenda? no → decline with template. step 2: am I a decision-maker or an FYI? FYI → request notes instead. step 3: can this be async? yes → propose alternative..."],
    },
  },
  {
    skill: "evaluation",
    prompt: "An AI gives you this analysis: 'Your company should expand to Japan because the market is $50B and growing 12% annually.' What's wrong with this reasoning (if anything)?",
    rubric: {
      low: ["nothing, sounds good", "seems right", "big market"],
      mid: ["market size doesn't mean accessible", "what about competition", "cultural differences"],
      high: ["TAM ≠ SAM ≠ SOM", "growth rate without base is meaningless", "no competitive analysis", "no mention of localisation cost, regulatory barriers, or go-to-market fit", "correlation between market size and company success is weak"],
    },
  },
];

// ============================================
// AI SYSTEM PROMPTS
// ============================================

const buildAssessmentPrompt = (scenario, skillName) => `You are an assessment engine for a structured thinking course. You are evaluating a user's capability in "${skillName}".

The user was given this scenario:
"${scenario.prompt}"

Evaluate their response. Score it 1-10 based on:
- Depth: Did they go beyond surface-level?
- Specificity: Did they use concrete language or stay vague?
- Structure: Did they organise their thinking?
- Completeness: Did they cover multiple angles?

Respond in this EXACT JSON format only, no other text:
{"score": <number 1-10>, "assessment": "<1-2 sentence evaluation>", "strength": "<what they did well>", "gap": "<specific area to develop>"}`;

const buildTrainingPrompt = (skill, level, userProfile) => {
  const levelData = LEVELS[level - 1];
  const intensity = level <= 3 ? "supportive and guiding" : level <= 6 ? "challenging and direct" : "rigorous, Socratic, expects excellence";

  return `You are a cognitive training engine. You are training a user in "${skill.name}" (${skill.short}).

Their current level: ${level}/10 — "${levelData.name}" (${levelData.desc}).

${userProfile ? `User context: ${userProfile}` : ""}

Your tone: ${intensity}.

RULES:
- Deliver ONE micro-exercise that takes 60-120 seconds
- The exercise should be at level ${level} difficulty — challenging but achievable
- Frame it as a real-world scenario, not academic
- End with a clear prompt for them to respond to
- Keep your setup to 2-3 sentences max, then the exercise
- If this is a follow-up in a conversation, build on what they just said — push deeper, challenge an assumption, or level up the difficulty

Never explain the framework. Never be meta about what you're teaching. Just do it.`;
};

// ============================================
// STORAGE HELPERS
// ============================================

const STORAGE_KEY = "thinkfirst-profile";

async function loadProfile() {
  try {
    const result = await window.storage.get(STORAGE_KEY);
    return result ? JSON.parse(result.value) : null;
  } catch {
    return null;
  }
}

async function saveProfile(profile) {
  try {
    await window.storage.set(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error("Save failed:", e);
  }
}

// ============================================
// COMPONENTS
// ============================================

const SkillRadar = ({ skills: skillLevels }) => {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 110;

  const points = SKILLS.map((s, i) => {
    const angle = (Math.PI * 2 * i) / SKILLS.length - Math.PI / 2;
    const level = skillLevels[s.id] || 0;
    const r = (level / 10) * maxR;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      labelX: cx + (maxR + 28) * Math.cos(angle),
      labelY: cy + (maxR + 28) * Math.sin(angle),
      skill: s,
      level,
    };
  });

  const polyPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  const gridLines = [2, 4, 6, 8, 10].map((l) => {
    const r = (l / 10) * maxR;
    const pts = SKILLS.map((_, i) => {
      const a = (Math.PI * 2 * i) / SKILLS.length - Math.PI / 2;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(" ");
    return <polygon key={l} points={pts} fill="none" stroke="#1E293B" strokeWidth={l === 10 ? 1.5 : 0.5} />;
  });

  const axisLines = SKILLS.map((_, i) => {
    const a = (Math.PI * 2 * i) / SKILLS.length - Math.PI / 2;
    return (
      <line key={i} x1={cx} y1={cy} x2={cx + maxR * Math.cos(a)} y2={cy + maxR * Math.sin(a)}
        stroke="#1E293B" strokeWidth={0.5} />
    );
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {gridLines}
      {axisLines}
      <polygon points={polyPoints} fill="rgba(59,130,246,0.15)" stroke="#3B82F6" strokeWidth={2} />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill={p.skill.color} />
          <text x={p.labelX} y={p.labelY} textAnchor="middle" dominantBaseline="middle"
            fill="#94A3B8" fontSize={9} fontFamily="'DM Mono', monospace">
            {p.skill.icon} {p.level}
          </text>
        </g>
      ))}
    </svg>
  );
};

const SkillBar = ({ skill, level, onClick }) => (
  <div onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: 14, padding: "12px 16px",
    borderRadius: 10, cursor: "pointer", transition: "all 0.2s",
    border: "1px solid #1E293B",
    background: "#0F172A",
  }}
    onMouseEnter={e => e.currentTarget.style.borderColor = skill.color}
    onMouseLeave={e => e.currentTarget.style.borderColor = "#1E293B"}
  >
    <div style={{ fontSize: 20, width: 28, textAlign: "center", color: skill.color }}>{skill.icon}</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0", marginBottom: 6 }}>
        {skill.name}
        <span style={{ fontWeight: 400, color: "#64748B", marginLeft: 8, fontSize: 11 }}>{skill.short}</span>
      </div>
      <div style={{ height: 6, background: "#1E293B", borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${(level / 10) * 100}%`,
          background: `linear-gradient(90deg, ${skill.color}88, ${skill.color})`,
          borderRadius: 3, transition: "width 0.5s ease",
        }} />
      </div>
    </div>
    <div style={{
      fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 700,
      color: skill.color, minWidth: 36, textAlign: "right",
    }}>
      {level}<span style={{ fontSize: 10, color: "#475569" }}>/10</span>
    </div>
  </div>
);

const ChatMsg = ({ role, content }) => (
  <div style={{
    display: "flex", justifyContent: role === "user" ? "flex-end" : "flex-start",
    marginBottom: 10, animation: "fadeUp 0.3s ease",
  }}>
    <div style={{
      maxWidth: "85%", padding: "12px 16px",
      borderRadius: role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
      background: role === "user" ? "#1E40AF" : "#1E293B",
      color: "#E2E8F0", fontSize: 14, lineHeight: 1.65,
      whiteSpace: "pre-wrap", fontFamily: "'DM Sans', sans-serif",
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
  return <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 10 }}>
    <div style={{
      padding: "12px 16px", borderRadius: "14px 14px 14px 4px",
      background: "#1E293B", color: "#475569", fontSize: 14,
      fontFamily: "'DM Mono', monospace",
    }}>thinking{d}</div>
  </div>;
};

// ============================================
// MAIN APP
// ============================================

export default function ThinkFirstEngine() {
  const [screen, setScreen] = useState("loading");
  const [profile, setProfile] = useState(null);
  const [assessmentIndex, setAssessmentIndex] = useState(0);
  const [assessmentResults, setAssessmentResults] = useState({});
  const [activeSkill, setActiveSkill] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const chatEnd = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Load profile on mount
  useEffect(() => {
    (async () => {
      const p = await loadProfile();
      if (p && p.skills) {
        setProfile(p);
        setScreen("dashboard");
      } else {
        setScreen("welcome");
      }
    })();
  }, []);

  const callAI = async (systemPrompt, msgs) => {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
          messages: msgs,
        }),
      });
      const data = await response.json();
      return data.content?.map(c => c.text || "").join("") || "Error. Try again.";
    } catch {
      return "Connection error. Try again.";
    }
  };

  // ---- ASSESSMENT FLOW ----
  const startAssessment = () => {
    setAssessmentIndex(0);
    setAssessmentResults({});
    setMessages([
      { role: "assistant", content: "Let's map your thinking. I'll give you 7 scenarios — one per skill. Answer naturally, no right or wrong. This takes about 5 minutes.\n\nReady? Here's the first one." },
      { role: "assistant", content: ASSESSMENT_SCENARIOS[0].prompt },
    ]);
    setScreen("assessment");
  };

  const handleAssessmentResponse = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    const idx = assessmentIndex;
    const scenario = ASSESSMENT_SCENARIOS[idx];
    const skill = SKILLS.find(s => s.id === scenario.skill);

    const newMsgs = [...messages, { role: "user", content: userMsg }];
    setMessages(newMsgs);
    setLoading(true);

    const result = await callAI(
      buildAssessmentPrompt(scenario, skill.name),
      [{ role: "user", content: userMsg }]
    );

    let parsed;
    try {
      const clean = result.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(clean);
    } catch {
      parsed = { score: 5, assessment: "Noted. Moving on.", strength: "Engaged with the question.", gap: "Could be more specific." };
    }

    const newResults = { ...assessmentResults, [scenario.skill]: parsed };
    setAssessmentResults(newResults);

    const nextIdx = idx + 1;
    if (nextIdx < ASSESSMENT_SCENARIOS.length) {
      const nextScenario = ASSESSMENT_SCENARIOS[nextIdx];
      setMessages([...newMsgs,
        { role: "assistant", content: `${parsed.assessment}\n\nNext one.` },
        { role: "assistant", content: nextScenario.prompt },
      ]);
      setAssessmentIndex(nextIdx);
    } else {
      // Assessment complete — build profile
      const skillLevels = {};
      const skillDetails = {};
      for (const [skillId, res] of Object.entries(newResults)) {
        skillLevels[skillId] = Math.max(1, Math.min(10, res.score));
        skillDetails[skillId] = { strength: res.strength, gap: res.gap, assessment: res.assessment };
      }

      const newProfile = {
        skills: skillLevels,
        details: skillDetails,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        sessions: 0,
        history: [],
      };

      await saveProfile(newProfile);
      setProfile(newProfile);
      setMessages([...newMsgs,
        { role: "assistant", content: `${parsed.assessment}\n\nAssessment complete. Building your profile...` },
      ]);
      setTimeout(() => setScreen("dashboard"), 1500);
    }
    setLoading(false);
  };

  // ---- TRAINING SESSION ----
  const startTraining = async (skill) => {
    setActiveSkill(skill);
    setMessages([]);
    setScreen("training");
    setLoading(true);

    const level = profile.skills[skill.id] || 1;
    const detail = profile.details?.[skill.id];
    const context = detail ? `Known strength: ${detail.strength}. Known gap: ${detail.gap}.` : "";

    const prompt = buildTrainingPrompt(skill, level, context);
    const result = await callAI(prompt, [
      { role: "user", content: "Start a training exercise." },
    ]);

    setMessages([{ role: "assistant", content: result }]);
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleTrainingResponse = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    const newMsgs = [...messages, { role: "user", content: userMsg }];
    setMessages(newMsgs);
    setLoading(true);

    const level = profile.skills[activeSkill.id] || 1;
    const detail = profile.details?.[activeSkill.id];
    const context = detail ? `Known strength: ${detail.strength}. Known gap: ${detail.gap}.` : "";

    const prompt = buildTrainingPrompt(activeSkill, level, context);
    const apiMsgs = newMsgs.map(m => ({ role: m.role, content: m.content }));

    const result = await callAI(prompt, apiMsgs);
    setMessages([...newMsgs, { role: "assistant", content: result }]);
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const completeSession = async () => {
    if (!profile || !activeSkill) return;
    const updated = { ...profile };
    const currentLevel = updated.skills[activeSkill.id] || 1;

    // Micro-progression: small chance of level up per session
    const sessionsOnSkill = (updated.history || []).filter(h => h.skill === activeSkill.id).length;
    if (sessionsOnSkill > 0 && sessionsOnSkill % 3 === 0 && currentLevel < 10) {
      updated.skills[activeSkill.id] = currentLevel + 1;
    }

    updated.sessions = (updated.sessions || 0) + 1;
    updated.updated = new Date().toISOString();
    updated.history = [...(updated.history || []), {
      skill: activeSkill.id,
      level: currentLevel,
      date: new Date().toISOString(),
      exchanges: messages.length,
    }];

    await saveProfile(updated);
    setProfile(updated);
    setActiveSkill(null);
    setScreen("dashboard");
  };

  const resetProfile = async () => {
    try { await window.storage.delete(STORAGE_KEY); } catch {}
    setProfile(null);
    setScreen("welcome");
  };

  // Find weakest skill for recommendation
  const getRecommendedSkill = () => {
    if (!profile?.skills) return SKILLS[0];
    let min = 11;
    let minSkill = SKILLS[0];
    for (const s of SKILLS) {
      const level = profile.skills[s.id] || 0;
      if (level < min) { min = level; minSkill = s; }
    }
    return minSkill;
  };

  const avgLevel = profile?.skills
    ? (Object.values(profile.skills).reduce((a, b) => a + b, 0) / SKILLS.length).toFixed(1)
    : "0";

  const fonts = <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />;

  const globalStyles = <style>{`
    @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    * { box-sizing: border-box; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 3px; }
  `}</style>;

  // ==================== LOADING ====================
  if (screen === "loading") {
    return <div style={{ height: "100vh", background: "#0B1121", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {fonts}{globalStyles}
      <div style={{ color: "#475569", fontFamily: "'DM Mono', monospace", fontSize: 14, animation: "pulse 1.5s infinite" }}>loading...</div>
    </div>;
  }

  // ==================== WELCOME ====================
  if (screen === "welcome") {
    return (
      <div style={{
        height: "100vh", background: "#0B1121", color: "#E2E8F0",
        fontFamily: "'DM Sans', sans-serif",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}>
        {fonts}{globalStyles}

        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "radial-gradient(ellipse at 30% 20%, rgba(59,130,246,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(139,92,246,0.04) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 540 }}>
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 4,
            color: "#475569", textTransform: "uppercase", marginBottom: 24,
          }}>
            Cognitive Infrastructure Engine
          </div>

          <h1 style={{
            fontSize: 64, fontWeight: 700, margin: "0 0 8px",
            letterSpacing: -2, lineHeight: 1,
          }}>
            THINK<span style={{ color: "#3B82F6" }}>FIRST</span>
          </h1>

          <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.7, margin: "16px 0 40px" }}>
            7 skills. 10 levels each. Assessed on your actual capability, not assumptions.
            Trained in microdoses at the moments you think best.
          </p>

          <div style={{
            display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 40,
          }}>
            {SKILLS.map(s => (
              <div key={s.id} style={{
                padding: "6px 14px", borderRadius: 6, fontSize: 12,
                border: `1px solid ${s.color}33`, color: s.color,
                fontFamily: "'DM Mono', monospace",
              }}>
                {s.icon} {s.name}
              </div>
            ))}
          </div>

          <button
            onClick={startAssessment}
            style={{
              padding: "16px 48px", borderRadius: 12,
              border: "none", background: "#3B82F6", color: "#FFF",
              fontSize: 16, fontWeight: 600, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            Begin Assessment →
          </button>

          <div style={{
            fontSize: 12, color: "#334155", marginTop: 16,
            fontFamily: "'DM Mono', monospace",
          }}>
            ~5 minutes • 7 scenarios • no wrong answers
          </div>
        </div>
      </div>
    );
  }

  // ==================== ASSESSMENT / TRAINING (shared chat UI) ====================
  if (screen === "assessment" || screen === "training") {
    const isAssessment = screen === "assessment";
    const handleSend = isAssessment ? handleAssessmentResponse : handleTrainingResponse;
    const headerText = isAssessment
      ? `Assessment · ${assessmentIndex + 1} of ${ASSESSMENT_SCENARIOS.length}`
      : `Training · ${activeSkill?.name} · L${profile?.skills?.[activeSkill?.id] || 1}`;
    const headerColor = isAssessment ? "#3B82F6" : activeSkill?.color || "#3B82F6";

    return (
      <div style={{
        height: "100vh", background: "#0B1121", color: "#E2E8F0",
        fontFamily: "'DM Sans', sans-serif",
        display: "flex", flexDirection: "column",
      }}>
        {fonts}{globalStyles}

        {/* Header */}
        <div style={{
          padding: "14px 24px", borderBottom: "1px solid #1E293B",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexShrink: 0,
        }}>
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: 12,
            color: headerColor, letterSpacing: 1.5, textTransform: "uppercase",
          }}>
            {headerText}
          </div>
          {!isAssessment && (
            <button onClick={completeSession} style={{
              padding: "6px 16px", borderRadius: 8, border: `1px solid ${headerColor}`,
              background: "transparent", color: headerColor, fontSize: 12,
              fontWeight: 600, cursor: "pointer", fontFamily: "'DM Mono', monospace",
            }}>
              Complete Session →
            </button>
          )}
          {isAssessment && (
            <div style={{ display: "flex", gap: 4 }}>
              {ASSESSMENT_SCENARIOS.map((_, i) => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: i < assessmentIndex ? "#3B82F6" : i === assessmentIndex ? "#60A5FA" : "#1E293B",
                  transition: "all 0.3s",
                }} />
              ))}
            </div>
          )}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {messages.map((m, i) => <ChatMsg key={i} role={m.role} content={m.content} />)}
          {loading && <Dots />}
          <div ref={chatEnd} />
        </div>

        {/* Input */}
        <div style={{
          padding: "14px 24px 18px", borderTop: "1px solid #1E293B",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Your response..."
              style={{
                flex: 1, padding: "12px 16px", borderRadius: 10,
                border: "1px solid #1E293B", background: "#0F172A",
                color: "#E2E8F0", fontSize: 14, outline: "none",
                fontFamily: "'DM Sans', sans-serif",
              }}
              onFocus={e => e.target.style.borderColor = headerColor}
              onBlur={e => e.target.style.borderColor = "#1E293B"}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                padding: "12px 20px", borderRadius: 10, border: "none",
                background: loading || !input.trim() ? "#1E293B" : headerColor,
                color: "#FFF", fontSize: 14, fontWeight: 600,
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              }}
            >
              →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== DASHBOARD ====================
  if (screen === "dashboard" && profile) {
    const recommended = getRecommendedSkill();

    return (
      <div style={{
        height: "100vh", background: "#0B1121", color: "#E2E8F0",
        fontFamily: "'DM Sans', sans-serif",
        display: "flex", overflow: "hidden",
      }}>
        {fonts}{globalStyles}

        {/* Left: Profile & Radar */}
        <div style={{
          width: 340, borderRight: "1px solid #1E293B",
          display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden",
          background: "#0D1526",
        }}>
          <div style={{ padding: "24px 20px 16px" }}>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 3,
              color: "#475569", textTransform: "uppercase", marginBottom: 8,
            }}>THINK<span style={{ color: "#3B82F6" }}>FIRST</span></div>
            <div style={{
              fontSize: 13, color: "#64748B",
              fontFamily: "'DM Mono', monospace",
            }}>
              Sessions: {profile.sessions || 0} · Avg: L{avgLevel}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
            <SkillRadar skills={profile.skills} />
          </div>

          <div style={{
            flex: 1, overflowY: "auto", padding: "8px 16px 16px",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {SKILLS.map(s => (
                <SkillBar
                  key={s.id}
                  skill={s}
                  level={profile.skills[s.id] || 0}
                  onClick={() => startTraining(s)}
                />
              ))}
            </div>
          </div>

          <div style={{
            padding: "12px 16px", borderTop: "1px solid #1E293B",
            flexShrink: 0,
          }}>
            <button onClick={resetProfile} style={{
              width: "100%", padding: "8px", borderRadius: 8,
              border: "1px solid #1E293B", background: "transparent",
              color: "#475569", fontSize: 11, cursor: "pointer",
              fontFamily: "'DM Mono', monospace",
            }}>
              Reset Profile
            </button>
          </div>
        </div>

        {/* Right: Dashboard */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>
          <h2 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 700, letterSpacing: -1 }}>
            Your Cognitive Profile
          </h2>
          <p style={{ color: "#64748B", fontSize: 14, margin: "0 0 32px" }}>
            Tap any skill on the left to start a training session. Or use the recommendation below.
          </p>

          {/* Recommendation Card */}
          <div
            onClick={() => startTraining(recommended)}
            style={{
              padding: "24px 28px", borderRadius: 14,
              border: `1px solid ${recommended.color}33`,
              background: `linear-gradient(135deg, ${recommended.color}08, ${recommended.color}03)`,
              cursor: "pointer", marginBottom: 32, transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = recommended.color}
            onMouseLeave={e => e.currentTarget.style.borderColor = `${recommended.color}33`}
          >
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 2,
              color: recommended.color, textTransform: "uppercase", marginBottom: 10,
            }}>
              Recommended Next Session
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: 32, color: recommended.color }}>{recommended.icon}</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>
                  {recommended.name}
                  <span style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 12,
                    color: recommended.color, marginLeft: 10,
                  }}>
                    L{profile.skills[recommended.id] || 1} → L{Math.min(10, (profile.skills[recommended.id] || 1) + 1)}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>
                  {profile.details?.[recommended.id]?.gap || recommended.short}
                </div>
              </div>
            </div>
          </div>

          {/* Skill Details Grid */}
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 2,
            color: "#475569", textTransform: "uppercase", marginBottom: 14,
          }}>
            Skill Assessment Details
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
          }}>
            {SKILLS.map(s => {
              const detail = profile.details?.[s.id];
              const level = profile.skills[s.id] || 0;
              const levelData = LEVELS[Math.max(0, level - 1)];
              return (
                <div key={s.id} style={{
                  padding: "16px 18px", borderRadius: 10,
                  border: "1px solid #1E293B", background: "#0F172A",
                }}>
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    marginBottom: 10,
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>
                      <span style={{ color: s.color, marginRight: 8 }}>{s.icon}</span>
                      {s.name}
                    </div>
                    <div style={{
                      padding: "2px 10px", borderRadius: 6,
                      background: `${s.color}22`, color: s.color,
                      fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 700,
                    }}>
                      L{level} {levelData?.name}
                    </div>
                  </div>
                  {detail ? (
                    <>
                      <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 6 }}>
                        <span style={{ color: "#10B981" }}>+</span> {detail.strength}
                      </div>
                      <div style={{ fontSize: 12, color: "#94A3B8" }}>
                        <span style={{ color: "#F59E0B" }}>→</span> {detail.gap}
                      </div>
                    </>
                  ) : (
                    <div style={{ fontSize: 12, color: "#334155" }}>Not yet assessed</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Session History */}
          {profile.history && profile.history.length > 0 && (
            <div style={{ marginTop: 32 }}>
              <div style={{
                fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 2,
                color: "#475569", textTransform: "uppercase", marginBottom: 14,
              }}>
                Recent Sessions
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {profile.history.slice(-10).reverse().map((h, i) => {
                  const sk = SKILLS.find(s => s.id === h.skill);
                  return (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "8px 14px", borderRadius: 8,
                      border: "1px solid #1E293B",
                      fontSize: 12,
                    }}>
                      <span style={{ color: sk?.color }}>{sk?.icon}</span>
                      <span style={{ color: "#94A3B8", flex: 1 }}>{sk?.name} · L{h.level}</span>
                      <span style={{
                        color: "#475569", fontFamily: "'DM Mono', monospace", fontSize: 11,
                      }}>
                        {new Date(h.date).toLocaleDateString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
