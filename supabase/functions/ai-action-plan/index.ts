import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FRED_BASE = "https://api.stlouisfed.org/fred/series/observations";
const FRED_SERIES = ["FEDFUNDS", "CPIAUCSL", "UNRATE", "DGS10", "DRCCLACBS", "CSUSHPINSA"];

async function fetchFredData(apiKey: string) {
  const results: string[] = [];
  for (const sid of FRED_SERIES) {
    try {
      const res = await fetch(`${FRED_BASE}?series_id=${sid}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=2`);
      if (!res.ok) continue;
      const data = await res.json();
      const obs = data.observations || [];
      const curr = obs[0]?.value !== "." ? obs[0]?.value : "N/A";
      const prev = obs[1]?.value !== "." ? obs[1]?.value : "N/A";
      results.push(`${sid}: current=${curr}, previous=${prev}`);
    } catch { /* skip */ }
  }
  return results.join("\n") || "No data available";
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { profile, metrics } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Use passed metrics if available, otherwise fetch live
    let metricsStr: string;
    if (metrics && metrics.length > 0) {
      metricsStr = metrics.map((m: any) =>
        `${m.name}: ${m.value ?? "N/A"} (prev: ${m.previousValue ?? "N/A"})`
      ).join("\n");
    } else {
      const FRED_API_KEY = Deno.env.get("FRED_API_KEY");
      metricsStr = FRED_API_KEY ? await fetchFredData(FRED_API_KEY) : "No economic data available";
    }

    const systemPrompt = `You are Finora's AI financial planner. Generate a personalized monthly action plan based on the user's profile and current economic conditions.

User profile:
- Income: ${profile?.income_range || "not specified"}
- Debts: ${JSON.stringify(profile?.debt_types || {})}
- Savings: ${profile?.savings_range || "not specified"}
- Location ZIP: ${profile?.zip_code || "not specified"}
- Investment level: ${profile?.investment_level || "not specified"}

Current economic data (real FRED API data):
${metricsStr}

Return a JSON object with:
- title: string (catchy plan title for this month)
- summary: string (2-3 sentence overview of this month's focus)
- actions: array of 5-7 objects, each with:
  - priority: "high" | "medium" | "low"
  - action: string (specific actionable step)
  - rationale: string (why this matters now, referencing the real economic data)
  - dollarImpact: string (estimated savings/gain, e.g. "+$200/mo")
- outlook: string (2-3 sentences about what to watch for next month)

Be specific with dollar amounts based on the user's actual profile. Reference the real economic data. Return ONLY valid JSON.`;

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
          { role: "user", content: "Generate my personalized financial action plan for this month." },
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

    let plan;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      plan = JSON.parse(cleaned);
    } catch {
      plan = { title: "Your Action Plan", summary: content, actions: [], outlook: "" };
    }

    return new Response(JSON.stringify(plan), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-action-plan error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
