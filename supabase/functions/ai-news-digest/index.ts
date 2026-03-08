import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FRED_BASE = "https://api.stlouisfed.org/fred/series/observations";
const FRED_SERIES = ["FEDFUNDS", "CPIAUCSL", "UNRATE", "DGS10"];

async function fetchLatestFred(apiKey: string) {
  const results: string[] = [];
  for (const sid of FRED_SERIES) {
    try {
      const res = await fetch(`${FRED_BASE}?series_id=${sid}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=2`);
      if (!res.ok) continue;
      const data = await res.json();
      const obs = data.observations || [];
      const curr = obs[0]?.value !== "." ? obs[0]?.value : "N/A";
      const prev = obs[1]?.value !== "." ? obs[1]?.value : "N/A";
      results.push(`${sid}: current=${curr}, previous=${prev}, date=${obs[0]?.date || "unknown"}`);
    } catch { /* skip */ }
  }
  return results.join("\n") || "No FRED data available";
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { profile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const FRED_API_KEY = Deno.env.get("FRED_API_KEY");
    const fredData = FRED_API_KEY ? await fetchLatestFred(FRED_API_KEY) : "No FRED API key — use general economic knowledge";

    const systemPrompt = `You are Finora's AI economic news analyst. Identify the top 5 most impactful current economic stories and explain how each affects the user's finances.

REAL-TIME ECONOMIC DATA (from FRED API, use these exact numbers):
${fredData}

User profile:
- Income: ${profile?.income_range || "not specified"}
- Debts: ${JSON.stringify(profile?.debt_types || {})}
- Savings: ${profile?.savings_range || "not specified"}
- Location ZIP: ${profile?.zip_code || "not specified"}
- Investment level: ${profile?.investment_level || "not specified"}

Today's date: ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.

Return a JSON object with:
- date: string (today's date in readable format)
- headline: string (overall market mood)
- stories: array of 5 objects, each with:
  - title: string (news headline)
  - source: string (plausible source like "Federal Reserve", "Bureau of Labor Statistics", "Reuters")
  - impact: "positive" | "negative" | "neutral"
  - summary: string (2-3 sentences about what happened, reference real FRED data)
  - personalImpact: string (1-2 sentences with specific dollar amounts for this user)
  - category: string (e.g. "Interest Rates", "Employment", "Inflation", "Markets", "Housing")

Ground your stories in the real FRED data provided above. Return ONLY valid JSON.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Generate today's personalized economic news digest based on the real data." },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a minute." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in workspace settings." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const text = await response.text();
      console.error("AI gateway error:", status, text);
      throw new Error(`AI service temporarily unavailable (${status})`);
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || "{}";

    let digest;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      digest = JSON.parse(cleaned);
    } catch {
      digest = { date: new Date().toLocaleDateString(), headline: "Economic update", stories: [] };
    }

    return new Response(JSON.stringify(digest), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-news-digest error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
