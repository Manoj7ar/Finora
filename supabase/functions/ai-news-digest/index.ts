import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { profile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are Finora's AI economic news analyst. Your job is to identify the top 5 most impactful recent economic news stories and explain how each one specifically affects the user's finances.

User profile:
- Income: ${profile?.income_range || "not specified"}
- Debts: ${JSON.stringify(profile?.debt_types || {})}
- Savings: ${profile?.savings_range || "not specified"}
- Location ZIP: ${profile?.zip_code || "not specified"}
- Investment level: ${profile?.investment_level || "not specified"}

Return a JSON object with:
- date: string (today's date in readable format)
- headline: string (overall market mood, e.g. "Markets cautious as Fed signals hold")
- stories: array of 5 objects, each with:
  - title: string (news headline)
  - source: string (plausible source like "Federal Reserve", "Bureau of Labor Statistics", "Reuters")
  - impact: "positive" | "negative" | "neutral"
  - summary: string (2-3 sentences about what happened)
  - personalImpact: string (1-2 sentences explaining how this specifically affects this user's finances with dollar amounts)
  - category: string (e.g. "Interest Rates", "Employment", "Inflation", "Markets", "Housing")

Use today's date: ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.
Base your stories on real, plausible current economic trends. Return ONLY valid JSON.`;

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
          { role: "user", content: "Generate today's personalized economic news digest." },
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
