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

    const systemPrompt = `You are a legislative analyst specializing in personal finance impacts. Identify 2-4 recent or proposed economic legislation (tax bills, student loan policy, minimum wage changes, capital gains rules, housing policy, etc.) that would impact this user based on their financial profile.

For each bill, provide: the bill name, a plain-English summary, the personalized impact on THIS user, and severity (critical/warning/info). Be specific about dollar amounts and timeline.`;

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
          { role: "user", content: `User profile: ${JSON.stringify(profile)}\n\nScan for relevant legislation and map impacts to this user.` },
        ],
        tools: [{
          type: "function",
          function: {
            name: "legislation_scan",
            description: "Report legislation impacts",
            parameters: {
              type: "object",
              properties: {
                alerts: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      bill_name: { type: "string" },
                      summary: { type: "string" },
                      personal_impact: { type: "string" },
                      severity: { type: "string", enum: ["critical", "warning", "info"] },
                      effective_date: { type: "string" },
                    },
                    required: ["bill_name", "summary", "personal_impact", "severity", "effective_date"],
                  },
                },
                overall_outlook: { type: "string" },
              },
              required: ["alerts", "overall_outlook"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "legislation_scan" } },
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
    console.error("legislation-radar error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
