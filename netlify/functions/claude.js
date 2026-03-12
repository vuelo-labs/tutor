/**
 * Netlify Function: /api/claude — hardened coaching proxy
 *
 * Security model:
 *   - API key:       server-side only, never in the browser
 *   - System prompt: built here from validated params — client cannot override it
 *   - Model:         locked server-side, client cannot change it
 *   - Max tokens:    locked server-side
 *   - CORS:          restricted to known origins only
 *   - Rate limiting: per-IP, in-memory fixed window (resets on cold start;
 *                    replace with Upstash Redis for production persistence)
 *   - Input:         all params validated against strict allowlists
 *   - Messages:      role and content sanitised before forwarding
 */

// ─── Locked constants ───────────────────────────────────────────────────────
const MODEL      = "claude-sonnet-4-6";
const MAX_TOKENS = 220;   // enforces brief coaching responses
const MAX_MSGS   = 30;    // max conversation turns accepted
const MAX_CHARS  = 1500;  // max chars per message content
const MAX_NAME   = 50;    // max chars for userName

// ─── CORS allowlist ──────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = new Set([
  "https://thinkingtutor.netlify.app",
  "http://localhost:5173",
  "http://localhost:8888",
]);

// ─── Rate limiting (in-memory, per IP) ───────────────────────────────────────
// 20 requests per 2 minutes per IP — supports a normal learning session,
// blocks automation and scrapers.
const RL_LIMIT  = 20;
const RL_WINDOW = 2 * 60 * 1000; // 2 minutes in ms
const rlMap = new Map(); // ip → { count, windowStart }

function checkRate(ip) {
  const now = Date.now();
  const rec = rlMap.get(ip);
  if (!rec || now - rec.windowStart > RL_WINDOW) {
    rlMap.set(ip, { count: 1, windowStart: now });
    return true;
  }
  if (rec.count >= RL_LIMIT) return false;
  rec.count++;
  return true;
}

// ─── Validated allowlists ────────────────────────────────────────────────────
const VALID_AGE_GROUPS = new Set(["young", "child", "teen", "adult"]);
const VALID_THEMES     = new Set(["forest", "studio", "mirror"]);
const VALID_ABILITIES  = new Set([
  "clarity", "decomposition", "relationships", "outcomes",
  "gaps", "procedural", "evaluation",       // input skills
  "shape", "zoom", "trim", "layer",          // output skills
]);
const VALID_SCAFFOLD   = new Set([0, 1, 2, 3]);

// ─── Minimal world data for server-side prompt building ──────────────────────
const THEMES = {
  forest: { name: "The Forest",  axisName: "The Voice", desc: "a fairytale world where structured thought clears the path" },
  studio: { name: "The Studio",  axisName: "AXIS",       desc: "a modern workspace where clarity is the only tool that matters" },
  mirror: { name: "The Mirror",  axisName: "the mirror", desc: "a reflective space where structured thought becomes self-understanding" },
};

const ABILITIES = {
  clarity:       { name: "FOCUS",    skill: "Clarity",             tagline: "Turn a fuzzy thought into something actionable" },
  decomposition: { name: "FRAGMENT", skill: "Decomposition",       tagline: "Break the impossible into the possible" },
  relationships: { name: "WEAVE",    skill: "Relationships",       tagline: "See the threads that connect everything" },
  outcomes:      { name: "ANCHOR",   skill: "Outcome Definition",  tagline: "Know exactly where you're trying to land" },
  gaps:          { name: "SCOUT",    skill: "Gap Analysis",        tagline: "Find what stands between you and the goal" },
  procedural:    { name: "SEQUENCE", skill: "Procedural Thinking", tagline: "Write instructions a literal machine can follow" },
  evaluation:    { name: "DISCERN",  skill: "Evaluation",          tagline: "Judge whether what came back is actually good" },
  shape:         { name: "SHAPE",    skill: "Format Control",      tagline: "Tell the AI what structure to return" },
  zoom:          { name: "ZOOM",     skill: "Granularity Control", tagline: "Set the altitude — overview to deep dive, on demand" },
  trim:          { name: "TRIM",     skill: "Iterative Refinement",tagline: "Cut until only signal remains — no noise, no caveats" },
  layer:         { name: "LAYER",    skill: "Context & Depth",     tagline: "Map the whole space first, then navigate deliberately" },
};

const OUTPUT_SKILL_IDS = new Set(["shape", "zoom", "trim", "layer"]);

const OUTPUT_SKILL_DESC = {
  shape: "controlling output format — specifying the structure, shape, and length of what the AI returns",
  zoom:  "granularity control — setting the altitude of a response, getting overview first then drilling deliberately",
  trim:  "iterative refinement — cutting a response to exactly the signal needed, removing noise, caveats, and scope creep",
  layer: "context and depth management — mapping before navigating, summarising to preserve cognitive space, expanding deliberately",
};

const AGE_DESC = {
  young: "4–8 year old child",
  child: "9–12 year old",
  teen:  "teenager (13–17)",
  adult: "adult",
};

const TONE = {
  young: "very warm, playful, celebratory",
  child: "warm, encouraging, clear",
  teen:  "direct, honest, subtly encouraging",
  adult: "clear, respectful, collegial",
};

const SCAFFOLD_DESC = {
  0: "Be very guiding — offer a specific next step or suggestion.",
  1: "Be guiding — offer a specific next step or suggestion.",
  2: "Be coaching — respond and push one level deeper.",
  3: "Be Socratic — challenge and expect more.",
};

// ─── Server-side prompt builders ────────────────────────────────────────────
function buildInputPrompt({ abilityId, ageGroup, theme, userName, scaffoldDial }) {
  const t  = THEMES[theme];
  const ab = ABILITIES[abilityId];
  const name = userName ? `Their name is ${userName}. ` : "";
  return `You are ${t.axisName} — a presence in ${t.name}, ${t.desc}.
You are coaching a ${AGE_DESC[ageGroup]} in the thinking skill called "${ab.name}" (${ab.skill}: ${ab.tagline}).
${name}Tone: ${TONE[ageGroup]}. Stay lightly in this world — use its atmosphere without being heavy-handed.
Scaffolding: ${SCAFFOLD_DESC[scaffoldDial]}
Respond in plain prose only — no bullet points, no headers, no markdown formatting of any kind. Name specifically what they did well structurally (not just "good job"), give one precise next step, end with one quiet line from this world. Two sentences, three at most. Never use framework jargon.`;
}

function buildOutputPrompt({ abilityId, ageGroup, theme, userName, scaffoldDial }) {
  const t  = THEMES[theme];
  const ab = ABILITIES[abilityId];
  const name = userName ? `Their name is ${userName}. ` : "";
  return `You are ${t.axisName} — a presence in ${t.name}.
You are coaching a ${AGE_DESC[ageGroup]} in the output control skill "${ab.name}": ${OUTPUT_SKILL_DESC[abilityId]}.
${name}Tone: ${TONE[ageGroup]}. Stay lightly in this world.
Scaffolding: ${SCAFFOLD_DESC[scaffoldDial]}
Evaluate the output control instruction they wrote. Does it specify a format? Constrain scope or length? Is it specific enough that two different responses would clearly differ?
Respond in plain prose only — no bullet points, no headers, no markdown of any kind. Name the specific output control technique they used (not "good job"), give one precise improvement they could add (format spec, word limit, scope constraint), end with one quiet line from this world. Two sentences, three at most.`;
}

// ─── Message sanitiser ───────────────────────────────────────────────────────
function sanitiseMessages(raw) {
  if (!Array.isArray(raw)) return null;
  if (raw.length > MAX_MSGS) return null;

  const cleaned = [];
  for (const msg of raw) {
    // Only user and assistant roles — never system
    if (msg.role !== "user" && msg.role !== "assistant") return null;
    // Content must be a plain string
    if (typeof msg.content !== "string") return null;
    // Trim and enforce length limit
    const content = msg.content.trim().slice(0, MAX_CHARS);
    if (content.length === 0) return null;
    cleaned.push({ role: msg.role, content });
  }

  // Must start with a user turn
  if (cleaned.length === 0 || cleaned[0].role !== "user") return null;

  return cleaned;
}

// ─── CORS helper ─────────────────────────────────────────────────────────────
function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.has(origin) ? origin : null;
  return {
    "Access-Control-Allow-Origin":  allowed || "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

// ─── Handler ─────────────────────────────────────────────────────────────────
export default async function handler(req, context) {
  const origin = req.headers.get("origin") || "";
  const cors   = corsHeaders(origin);

  // Preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  // Rate limiting
  const ip = context.ip || req.headers.get("x-forwarded-for") || "unknown";
  if (!checkRate(ip)) {
    return new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Service unavailable" }), {
      status: 503, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  // ── Validate all client-supplied params against allowlists ──
  const { abilityId, ageGroup, theme, scaffoldDial, isOutputQuest, messages } = body;

  if (!VALID_ABILITIES.has(abilityId)) {
    return new Response(JSON.stringify({ error: "Invalid ability" }), {
      status: 400, headers: { ...cors, "Content-Type": "application/json" },
    });
  }
  if (!VALID_AGE_GROUPS.has(ageGroup)) {
    return new Response(JSON.stringify({ error: "Invalid age group" }), {
      status: 400, headers: { ...cors, "Content-Type": "application/json" },
    });
  }
  if (!VALID_THEMES.has(theme)) {
    return new Response(JSON.stringify({ error: "Invalid theme" }), {
      status: 400, headers: { ...cors, "Content-Type": "application/json" },
    });
  }
  if (!VALID_SCAFFOLD.has(Number(scaffoldDial))) {
    return new Response(JSON.stringify({ error: "Invalid scaffold level" }), {
      status: 400, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  // Sanitise userName — optional, string only, hard length cap
  const userName = typeof body.userName === "string"
    ? body.userName.trim().slice(0, MAX_NAME)
    : "";

  // Sanitise messages
  const cleanMessages = sanitiseMessages(messages);
  if (!cleanMessages) {
    return new Response(JSON.stringify({ error: "Invalid messages" }), {
      status: 400, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  // ── Build system prompt server-side — client never touches this ──
  const params = { abilityId, ageGroup, theme, userName, scaffoldDial: Number(scaffoldDial) };
  const isOutput = isOutputQuest === true && OUTPUT_SKILL_IDS.has(abilityId);
  const systemPrompt = isOutput ? buildOutputPrompt(params) : buildInputPrompt(params);

  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type":    "application/json",
        "x-api-key":       apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model:      MODEL,
        max_tokens: MAX_TOKENS,
        system:     systemPrompt,
        messages:   cleanMessages,
      }),
    });

    const data = await anthropicRes.json();

    if (!anthropicRes.ok) {
      // Never echo Anthropic's raw error message to the client
      return new Response(JSON.stringify({ error: "Upstream error" }), {
        status: anthropicRes.status,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Service unavailable" }), {
      status: 502, headers: { ...cors, "Content-Type": "application/json" },
    });
  }
}
