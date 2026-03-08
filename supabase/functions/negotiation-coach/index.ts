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

    const systemPrompt = `You are a financial negotiation coach. Analyze current macro conditions (interest rates, inflation, unemployment) and the user's financial profile to identify 2-4 negotiation opportunities where the macro environment is in their favor.

For each opportunity: explain the macro context creating leverage, provide a word-for-word script they can use, and estimate potential savings. Focus on: mortgage/refinance rates, credit card APR negotiations, salary timing, loan terms, insurance rates.`;

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
          { role: "user", content: `Current FRED metrics: ${JSON.stringify(metrics)}\nUser profile: ${JSON.stringify(profile)}\n\nFind negotiation opportunities.` },
        ],
        tools: [{
          type: "function",
          function: {
            name: "negotiation_opportunities",
            description: "Report negotiation opportunities",
            parameters: {
              type: "object",
              properties: {
                opportunities: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      opportunity_type: { type: "string" },
                      title: { type: "string" },
                      macro_context: { type: "string" },
                      script: { type: "string" },
                      estimated_savings: { type: "string" },
                      urgency: { type: "string", enum: ["act_now", "this_month", "watch"] },
                    },
                    required: ["opportunity_type", "title", "macro_context", "script", "estimated_savings", "urgency"],
                  },
                },
                market_summary: { type: "string" },
              },
              required: ["opportunities", "market_summary"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "negotiation_opportunities" } },
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
    console.error("negotiation-coach error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
