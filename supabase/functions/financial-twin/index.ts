import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { metrics, profile, goals } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are a wealth management AI building a "Financial Digital Twin." Given FRED macro data, user profile, and their financial goals, project their financial trajectory across three scenarios over 1, 3, and 5 years:
1. Current Path: If current macro trends continue
2. Best Case: Optimistic macro scenario (rates drop, inflation cools, employment strong)
3. Worst Case: Pessimistic scenario (rates rise, inflation spikes, recession)

For each scenario, project: net worth trajectory, total debt cost, savings purchasing power. Include a key insight comparing to historical baselines. Be specific with dollar amounts based on their income/savings ranges.`;

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
          { role: "user", content: `FRED metrics: ${JSON.stringify(metrics)}\nProfile: ${JSON.stringify(profile)}\nGoals: ${JSON.stringify(goals)}\n\nBuild the financial twin projection.` },
        ],
        tools: [{
          type: "function",
          function: {
            name: "financial_twin",
            description: "Generate financial twin projections",
            parameters: {
              type: "object",
              properties: {
                current_path: {
                  type: "object",
                  properties: {
                    year_1: { type: "object", properties: { net_worth: { type: "string" }, debt_cost: { type: "string" }, purchasing_power: { type: "string" } }, required: ["net_worth", "debt_cost", "purchasing_power"] },
                    year_3: { type: "object", properties: { net_worth: { type: "string" }, debt_cost: { type: "string" }, purchasing_power: { type: "string" } }, required: ["net_worth", "debt_cost", "purchasing_power"] },
                    year_5: { type: "object", properties: { net_worth: { type: "string" }, debt_cost: { type: "string" }, purchasing_power: { type: "string" } }, required: ["net_worth", "debt_cost", "purchasing_power"] },
                  },
                  required: ["year_1", "year_3", "year_5"],
                },
                best_case: {
                  type: "object",
                  properties: {
                    year_1: { type: "object", properties: { net_worth: { type: "string" }, debt_cost: { type: "string" }, purchasing_power: { type: "string" } }, required: ["net_worth", "debt_cost", "purchasing_power"] },
                    year_3: { type: "object", properties: { net_worth: { type: "string" }, debt_cost: { type: "string" }, purchasing_power: { type: "string" } }, required: ["net_worth", "debt_cost", "purchasing_power"] },
                    year_5: { type: "object", properties: { net_worth: { type: "string" }, debt_cost: { type: "string" }, purchasing_power: { type: "string" } }, required: ["net_worth", "debt_cost", "purchasing_power"] },
                  },
                  required: ["year_1", "year_3", "year_5"],
                },
                worst_case: {
                  type: "object",
                  properties: {
                    year_1: { type: "object", properties: { net_worth: { type: "string" }, debt_cost: { type: "string" }, purchasing_power: { type: "string" } }, required: ["net_worth", "debt_cost", "purchasing_power"] },
                    year_3: { type: "object", properties: { net_worth: { type: "string" }, debt_cost: { type: "string" }, purchasing_power: { type: "string" } }, required: ["net_worth", "debt_cost", "purchasing_power"] },
                    year_5: { type: "object", properties: { net_worth: { type: "string" }, debt_cost: { type: "string" }, purchasing_power: { type: "string" } }, required: ["net_worth", "debt_cost", "purchasing_power"] },
                  },
                  required: ["year_1", "year_3", "year_5"],
                },
                key_insight: { type: "string" },
                historical_comparison: { type: "string" },
              },
              required: ["current_path", "best_case", "worst_case", "key_insight", "historical_comparison"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "financial_twin" } },
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
    console.error("financial-twin error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
