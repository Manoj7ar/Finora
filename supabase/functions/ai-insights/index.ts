import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { profile, metrics } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    if (!profile) throw new Error("Profile data is required");
    if (!metrics || metrics.length === 0) throw new Error("Metrics data is required");

    const metricsDescription = metrics.map((m: any) =>
      `${m.name}: ${m.value != null ? m.value : 'N/A'} (previous: ${m.previousValue != null ? m.previousValue : 'N/A'})`
    ).join("\n");

    const systemPrompt = `You are Finora's AI economic advisor. You analyze macro-economic data and explain impacts in plain English personalized to the user's financial profile.

User profile:
- Income: ${profile.income_range || "not specified"}
- Debts: ${JSON.stringify(profile.debt_types || {})}
- Savings: ${profile.savings_range || "not specified"}
- Location ZIP: ${profile.zip_code || "not specified"}
- Investment level: ${profile.investment_level || "not specified"}

Current economic data (real FRED API data):
${metricsDescription}

Generate 2-3 insight cards. Each insight must be a JSON object with:
- severity: "healthy" | "warning" | "critical"
- headline: one sentence about what happened
- dollarImpact: personal dollar figure (e.g. "+$1,100/yr")
- summary: 2-3 sentences explaining the impact
- lesson: 2-3 paragraphs teaching why this matters economically

Return ONLY valid JSON array of insight objects.`;

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
          { role: "user", content: "Generate personalized economic insights based on the current data and my financial profile." },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a minute." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in workspace settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", status, text);
      throw new Error(`AI service temporarily unavailable (${status})`);
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || "[]";

    let insights;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      insights = JSON.parse(cleaned);
      if (!Array.isArray(insights)) insights = [insights];
    } catch {
      insights = [{ severity: "healthy", headline: "Analysis complete", dollarImpact: "", summary: content, lesson: "" }];
    }

    return new Response(JSON.stringify({ insights }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-insights error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
