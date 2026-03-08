import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { biasEvents, profile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are a behavioral finance expert. Analyze the user's interaction patterns and identify cognitive biases they're exhibiting. For each bias found, explain:
1. The bias name (loss_aversion, recency_bias, anchoring, overconfidence, negativity_bias, confirmation_bias, herd_mentality, sunk_cost_fallacy)
2. How many times it appeared
3. The estimated annual financial cost of this bias for average consumers
4. A teaching explanation of what it is and how to counteract it

Return JSON using the provided tool.`;

    const userPrompt = `Here are the user's recent interaction events:
${JSON.stringify(biasEvents, null, 2)}

User profile: ${JSON.stringify(profile)}

Analyze these patterns for cognitive biases.`;

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
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "report_biases",
            description: "Report identified cognitive biases",
            parameters: {
              type: "object",
              properties: {
                biases: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      bias_type: { type: "string" },
                      occurrences: { type: "number" },
                      estimated_annual_cost: { type: "string" },
                      explanation: { type: "string" },
                      counteraction_tip: { type: "string" },
                    },
                    required: ["bias_type", "occurrences", "estimated_annual_cost", "explanation", "counteraction_tip"],
                  },
                },
                overall_insight: { type: "string" },
              },
              required: ["biases", "overall_insight"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "report_biases" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "Payment required" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    const result = toolCall ? JSON.parse(toolCall.function.arguments) : { biases: [], overall_insight: "Unable to analyze patterns." };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("cognitive-bias-analysis error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
