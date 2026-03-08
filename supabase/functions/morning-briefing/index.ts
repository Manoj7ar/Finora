import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { metrics, profile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are a personal financial radio anchor. Generate a 60-second morning macro briefing personalized to this user's financial profile. Write it as spoken text (conversational, warm, direct). Structure:
1. Greeting + overnight headline
2. What it means for THEIR specific financial situation
3. One thing to watch today
4. Closing encouragement

Keep it under 200 words. Use "you" and "your" throughout. Reference specific metrics.`;

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
          { role: "user", content: `Current FRED data: ${JSON.stringify(metrics)}\nUser profile: ${JSON.stringify(profile)}\n\nGenerate this morning's briefing.` },
        ],
        tools: [{
          type: "function",
          function: {
            name: "morning_briefing",
            description: "Generate morning macro briefing",
            parameters: {
              type: "object",
              properties: {
                greeting: { type: "string" },
                headline: { type: "string" },
                personal_impact: { type: "string" },
                watch_today: { type: "string" },
                closing: { type: "string" },
                full_script: { type: "string" },
                estimated_read_seconds: { type: "number" },
              },
              required: ["greeting", "headline", "personal_impact", "watch_today", "closing", "full_script", "estimated_read_seconds"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "morning_briefing" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "Payment required" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    const result = toolCall ? JSON.parse(toolCall.function.arguments) : null;

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("morning-briefing error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
