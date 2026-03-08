import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { scenario, profile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are Finora's AI financial scenario analyzer. The user wants to explore a "what if" scenario. Analyze the hypothetical and provide a detailed, personalized impact analysis.

User profile:
- Income: ${profile?.income_range || "not specified"}
- Debts: ${JSON.stringify(profile?.debt_types || {})}
- Savings: ${profile?.savings_range || "not specified"}
- Location ZIP: ${profile?.zip_code || "not specified"}
- Investment level: ${profile?.investment_level || "not specified"}

Return a JSON object with:
- scenario: string (restate the scenario clearly)
- verdict: "beneficial" | "risky" | "neutral" | "mixed"
- summary: string (3-4 sentences overview of the impact)
- impacts: array of 3-5 objects, each with:
  - area: string (e.g. "Monthly Cash Flow", "Debt Burden", "Savings Growth", "Investment Returns")
  - change: string (e.g. "+$400/mo", "-15% portfolio value")
  - direction: "positive" | "negative" | "neutral"
  - explanation: string (2-3 sentences explaining this specific impact)
- recommendation: string (2-3 sentences with what the user should consider doing)
- timeframe: string (how long until the effects are felt)

Use specific dollar amounts based on the user's profile. Return ONLY valid JSON.`;

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
          { role: "user", content: `Analyze this scenario: ${scenario}` },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI gateway error: ${status}`);
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || "{}";

    let result;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      result = JSON.parse(cleaned);
    } catch {
      result = { scenario, verdict: "neutral", summary: content, impacts: [], recommendation: "", timeframe: "" };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-what-if error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
