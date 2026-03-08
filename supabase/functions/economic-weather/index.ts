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

    const systemPrompt = `You are an economic weather forecaster. Given current FRED macro data and a user's financial profile, generate a personalized 30-day "Economic Weather Report" using weather metaphors.

Outlook should be one of: sunny, partly_cloudy, cloudy, stormy, hurricane.
Include specific action items personalized to their profile.
Be specific about dates and upcoming events (Fed meetings, CPI releases, etc).`;

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
          { role: "user", content: `Current FRED metrics: ${JSON.stringify(metrics)}\nUser profile: ${JSON.stringify(profile)}\n\nGenerate the 30-day economic weather forecast.` },
        ],
        tools: [{
          type: "function",
          function: {
            name: "weather_report",
            description: "Generate economic weather report",
            parameters: {
              type: "object",
              properties: {
                outlook: { type: "string", enum: ["sunny", "partly_cloudy", "cloudy", "stormy", "hurricane"] },
                headline: { type: "string" },
                summary: { type: "string" },
                upcoming_events: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      date: { type: "string" },
                      event: { type: "string" },
                      impact: { type: "string" },
                    },
                    required: ["date", "event", "impact"],
                  },
                },
                action_items: {
                  type: "array",
                  items: { type: "string" },
                },
                umbrella_tip: { type: "string" },
              },
              required: ["outlook", "headline", "summary", "upcoming_events", "action_items", "umbrella_tip"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "weather_report" } },
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
    console.error("economic-weather error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
