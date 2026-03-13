/**
 * Netlify Function: /api/sync
 *
 * Two jobs:
 *   1. Always: upsert anonymous session heartbeat to `sessions` table
 *   2. If email provided: upsert full user record to `users` table, link session
 *
 * Fire-and-forget from the client — never blocks the user.
 *
 * Run this SQL in Supabase to set up both tables:
 *
 *   -- Anonymous session tracking (no email required)
 *   create table sessions (
 *     id             text        primary key,  -- localStorage UUID
 *     total_sessions int         default 0,
 *     last_seen      timestamptz default now(),
 *     created_at     timestamptz default now(),
 *     email          text        -- linked when user registers
 *   );
 *
 *   -- Registered users
 *   create table users (
 *     id            uuid        default gen_random_uuid() primary key,
 *     email         text        unique not null,
 *     session_id    text,
 *     name          text,
 *     intro_text    text,
 *     theme         text        default 'studio',
 *     segment       text        default 'individual',
 *     levels        jsonb       default '{}',
 *     output_levels jsonb       default '{}',
 *     scaffold_dial int         default 1,
 *     total_sessions int        default 0,
 *     last_active   timestamptz default now(),
 *     created_at    timestamptz default now()
 *   );
 */

const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

const ALLOWED_ORIGINS = new Set([
  "https://thinkingtutor.netlify.app",
  "http://localhost:5173",
  "http://localhost:8888",
]);

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.has(origin) ? origin : null;
  return {
    "Access-Control-Allow-Origin":  allowed || "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function sanitiseEmail(raw) {
  if (typeof raw !== "string") return null;
  return raw.replace(/[\x00-\x1F\x7F]/g, "").replace(/[<>"']/g, "").trim().toLowerCase().slice(0, 254);
}

async function supabaseUpsert(url, key, table, record, onConflict) {
  const res = await fetch(`${url}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      "apikey":        key,
      "Authorization": `Bearer ${key}`,
      "Content-Type":  "application/json",
      "Prefer":        `resolution=merge-duplicates,return=minimal`,
    },
    body: JSON.stringify(record),
  });
  if (!res.ok) console.error(`Supabase ${table} upsert failed:`, await res.text());
}

export default async function handler(req, context) {
  const origin = req.headers.get("origin") || "";
  const cors   = corsHeaders(origin);

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "Method not allowed" }), {
      status: 405, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return new Response(JSON.stringify({ ok: true, stored: false }), {
      status: 200, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  let body;
  try { body = await req.json(); }
  catch {
    return new Response(JSON.stringify({ ok: false, error: "Invalid request" }), {
      status: 400, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const sessionId = typeof body.sessionId === "string" ? body.sessionId.slice(0, 36) : null;
  const email     = sanitiseEmail(body.email);
  const hasEmail  = email && EMAIL_RE.test(email);
  const now       = new Date().toISOString();

  try {
    // 1. Always track the anonymous session
    if (sessionId) {
      await supabaseUpsert(SUPABASE_URL, SUPABASE_KEY, "sessions", {
        id:             sessionId,
        total_sessions: Number.isInteger(body.totalSessions) ? body.totalSessions : 0,
        last_seen:      now,
        email:          hasEmail ? email : undefined,
      });
    }

    // 2. If email provided, upsert the full user record
    if (hasEmail) {
      await supabaseUpsert(SUPABASE_URL, SUPABASE_KEY, "users", {
        email,
        session_id:     sessionId || null,
        name:           typeof body.name      === "string" ? body.name.slice(0, 100)   : null,
        intro_text:     typeof body.introText === "string" ? body.introText.slice(0, 1000) : null,
        theme:          ["forest","studio","mirror"].includes(body.theme) ? body.theme : "studio",
        segment:        ["leader","individual"].includes(body.segment)    ? body.segment : "individual",
        levels:         body.levels       && typeof body.levels       === "object" ? body.levels       : {},
        output_levels:  body.outputLevels && typeof body.outputLevels === "object" ? body.outputLevels : {},
        scaffold_dial:  Number.isInteger(body.scaffoldDial)  ? body.scaffoldDial  : 1,
        total_sessions: Number.isInteger(body.totalSessions) ? body.totalSessions : 0,
        last_active:    now,
      });
    }
  } catch (err) {
    console.error("Supabase sync error:", err?.message);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: { ...cors, "Content-Type": "application/json" },
  });
}
