import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FRED_BASE = "https://api.stlouisfed.org/fred/series/observations";
const FRED_SERIES = ["FEDFUNDS", "CPIAUCSL", "UNRATE", "DGS10"];

async function fetchFredSnapshot(apiKey: string) {
  const results: string[] = [];
  for (const sid of FRED_SERIES) {
    try {
      const res = await fetch(`${FRED_BASE}?series_id=${sid}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=1`);
      if (!res.ok) continue;
      const data = await res.json();
      const val = data.observations?.[0]?.value;
      if (val && val !== ".") results.push(`${sid}: ${val} (as of ${data.observations[0].date})`);
    } catch { /* skip */ }
  }
  return results.length ? results.join(", ") : null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, profile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const FRED_API_KEY = Deno.env.get("FRED_API_KEY");
    const fredSnapshot = FRED_API_KEY ? await fetchFredSnapshot(FRED_API_KEY) : null;

    const country = profile?.country || "US";

    const systemPrompt = `You are Finora, a calm and clear financial advisor. You help people understand their money in plain language.

RULES — follow these strictly:
1. Be brief. Use 2–3 short paragraphs max. No walls of text.
2. Use simple words. Explain like the user is smart but not a finance expert.
3. Use bullet points for lists, bold for key numbers only.
4. Give one clear recommendation at the end — start it with "→"
5. Reference the user's real numbers when relevant, not hypotheticals.
6. Never use jargon without a one-line explanation.
7. Never give specific stock picks or guarantee returns.
8. If asked about non-finance topics, redirect politely in one sentence.
9. Use the user's local currency (${country}) for all amounts.

User profile:
- Country: ${country}
- Income: ${profile?.income_range || "not shared"}
- Debts: ${JSON.stringify(profile?.debt_types || {})}
- Savings: ${profile?.savings_range || "not shared"}
- Location: ${profile?.zip_code || "not shared"}
- Investment level: ${profile?.investment_level || "not shared"}

${fredSnapshot ? `Live economic data: ${fredSnapshot}` : ""}`;

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
          ...messages,
        ],
        stream: true,
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
      const t = await response.text();
      console.error("AI gateway error:", status, t);
      throw new Error(`AI service temporarily unavailable (${status})`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-chat error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
