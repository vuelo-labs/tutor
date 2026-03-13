/**
 * Netlify Function: /api/sync
 *
 * Upserts a user record to Supabase on key events:
 *   - First email capture (profile page)
 *   - After each quest session
 *
 * The client calls this fire-and-forget — failures never block the user.
 * localStorage remains the fast local cache; Supabase is the durable record.
 *
 * Schema (supabase SQL):
 *
 *   create table users (
 *     id            uuid        default gen_random_uuid() primary key,
 *     email         text        unique not null,
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
 *
 *   -- allow upserts from the anon key
 *   alter table users enable row level security;
 *   create policy "service role only" on users using (false);
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

export default async function handler(req, context) {
  const origin = req.headers.get("origin") || "";
  const cors   = corsHeaders(origin);

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "Method not allowed" }), {
      status: 405, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const SUPABASE_URL  = process.env.SUPABASE_URL;
  const SUPABASE_KEY  = process.env.SUPABASE_SERVICE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    // DB not configured — fail silently, don't block the user
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

  const email = sanitiseEmail(body.email);
  if (!email || !EMAIL_RE.test(email)) {
    return new Response(JSON.stringify({ ok: false, error: "Valid email required." }), {
      status: 400, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const record = {
    email,
    name:           typeof body.name        === "string" ? body.name.slice(0, 100)  : null,
    intro_text:     typeof body.introText   === "string" ? body.introText.slice(0, 1000) : null,
    theme:          ["forest","studio","mirror"].includes(body.theme) ? body.theme : "studio",
    segment:        ["leader","individual"].includes(body.segment) ? body.segment : "individual",
    levels:         body.levels        && typeof body.levels        === "object" ? body.levels        : {},
    output_levels:  body.outputLevels  && typeof body.outputLevels  === "object" ? body.outputLevels  : {},
    scaffold_dial:  Number.isInteger(body.scaffoldDial) ? body.scaffoldDial : 1,
    total_sessions: Number.isInteger(body.totalSessions) ? body.totalSessions : 0,
    last_active:    new Date().toISOString(),
  };

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
      method: "POST",
      headers: {
        "apikey":       SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer":       "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(record),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Supabase upsert failed:", err);
      // Still return ok — don't surface DB errors to the user
    }
  } catch (err) {
    console.error("Supabase sync error:", err?.message);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: { ...cors, "Content-Type": "application/json" },
  });
}
