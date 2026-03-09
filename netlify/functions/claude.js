/**
 * Netlify Function: /api/claude
 *
 * This is our server-side proxy to the Anthropic API.
 * The ANTHROPIC_API_KEY environment variable is stored securely in Netlify's
 * dashboard — it never touches the browser. The frontend sends requests here,
 * and we forward them to Anthropic, then return the response.
 *
 * Why a proxy?
 * - API keys in browser code are publicly visible (anyone can open DevTools)
 * - This function runs on Netlify's servers, not in the user's browser
 * - We can also add rate limiting, auth checks, and logging here later
 */

export default async function handler(req, context) {
  // Only allow POST requests — Claude always needs a body
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Pull the API key from environment variables (set in Netlify dashboard)
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Validate required fields — don't forward garbage to Anthropic
  if (!body.messages || !Array.isArray(body.messages)) {
    return new Response(JSON.stringify({ error: "messages array required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Forward the request to Anthropic
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: body.model || "claude-sonnet-4-6",
        max_tokens: body.max_tokens || 1000,
        system: body.system || undefined,
        messages: body.messages,
      }),
    });

    const data = await anthropicRes.json();

    if (!anthropicRes.ok) {
      return new Response(JSON.stringify({ error: data.error?.message || "Anthropic API error" }), {
        status: anthropicRes.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // CORS header — allows our frontend (same domain) to call this
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to reach Anthropic API" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}
