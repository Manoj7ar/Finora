import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { eventType, eventDate, userPrediction, metrics } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are a macro-economics professor who gamifies economic forecasting. Given an economic event, the user's prediction, and current FRED data, either:
1. If the event hasn't happened yet: Provide context about what to watch for and rate the prediction's reasoning quality (0-100).
2. If resolving: Score accuracy, explain what actually happened, and teach why.`;

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
          { role: "user", content: `Event: ${eventType} on ${eventDate}\nUser prediction: ${userPrediction}\nCurrent FRED data: ${JSON.stringify(metrics)}\n\nEvaluate this prediction.` },
        ],
        tools: [{
          type: "function",
          function: {
            name: "evaluate_prediction",
            description: "Evaluate an economic prediction",
            parameters: {
              type: "object",
              properties: {
                score: { type: "number" },
                reasoning_quality: { type: "string" },
                explanation: { type: "string" },
                teaching_moment: { type: "string" },
                what_to_watch: { type: "string" },
              },
              required: ["score", "reasoning_quality", "explanation", "teaching_moment", "what_to_watch"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "evaluate_prediction" } },
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
    console.error("predict-fed-score error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
