/**
 * Netlify Function: /api/subscribe
 *
 * Validates and sanitises an email address, then submits it to the
 * Netlify Forms "engine-capture" form for storage.
 *
 * The client never touches storage directly — all validation happens here.
 * Swapping to Resend / Beehiiv / Kit later is a change to this file only.
 */

// RFC 5321 compliant email regex — covers real-world valid addresses
// without accepting obviously broken or injection-carrying strings
const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

const ALLOWED_ORIGINS = new Set([
  "https://thinkingtutor.netlify.app",
  "http://localhost:5173",
  "http://localhost:8888",
]);

function sanitiseEmail(raw) {
  if (typeof raw !== "string") return null;
  return raw
    .replace(/[\x00-\x1F\x7F]/g, "")  // strip all control chars (incl. null, CR, LF)
    .replace(/[<>"']/g, "")            // strip characters used in injection attacks
    .trim()
    .toLowerCase()
    .slice(0, 254);                    // RFC 5321 max email length
}

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.has(origin) ? origin : null;
  return {
    "Access-Control-Allow-Origin":  allowed || "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export default async function handler(req, context) {
  const origin = req.headers.get("origin") || "";
  const cors   = corsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "Method not allowed" }), {
      status: 405, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Invalid request" }), {
      status: 400, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const email = sanitiseEmail(body.email);
  const segment = ["leader", "individual"].includes(body.segment) ? body.segment : "individual";

  if (!email || !EMAIL_RE.test(email)) {
    return new Response(JSON.stringify({ ok: false, error: "Please enter a valid email address." }), {
      status: 400, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  // Submit to Netlify Forms — the hidden form in index.html makes this work.
  // Failures are logged but don't block the user; storage is best-effort at this stage.
  try {
    const siteUrl = ALLOWED_ORIGINS.has(origin)
      ? origin
      : "https://thinkingtutor.netlify.app";

    await fetch(`${siteUrl}/`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        "form-name": "waitlist",
        "email":     email,
        "segment":   segment,
      }).toString(),
    });
  } catch (err) {
    // Don't block the user if form submission fails — we'll add resilient
    // storage (Resend / Beehiiv) here when ready.
    console.error("engine-capture form submission failed:", err?.message);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: { ...cors, "Content-Type": "application/json" },
  });
}
