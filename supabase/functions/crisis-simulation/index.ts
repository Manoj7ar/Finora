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
    const { crisisId, profile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const crisisContext: Record<string, string> = {
      "2008": "2008 Financial Crisis: Housing bubble burst, Lehman Brothers collapse. Fed rate went from 5.25% to near 0%. Unemployment peaked at 10%. S&P 500 fell 57%. Housing prices dropped 33%.",
      "2020": "2020 COVID Crash: Pandemic lockdowns. Unemployment spiked to 14.7%. S&P 500 dropped 34% in weeks. Fed cut rates to 0%. Massive stimulus spending.",
      "2022": "2022 Inflation Surge: CPI hit 9.1% (40-year high). Fed raised rates from 0.25% to 4.5%. Mortgage rates doubled. Housing market cooled. Stock market fell 25%.",
      "1970s": "1970s Stagflation: Oil embargo, double-digit inflation (peaked 14.8%). Fed rate hit 20%. Unemployment rose to 9%. Stock market lost 50% in real terms over decade.",
    };

    const systemPrompt = `You are Finora's crisis simulation engine. Given a user's financial profile and a historical crisis, simulate how their finances would be affected month by month over 12 months.

User profile:
- Income: ${profile.income_range}
- Debts: ${JSON.stringify(profile.debt_types)}
- Savings: ${profile.savings_range}
- Location ZIP: ${profile.zip_code}
- Investment level: ${profile.investment_level}

Crisis: ${crisisContext[crisisId] || "Unknown crisis"}

Return a JSON object with:
- months: array of 12 objects, each with: month (string like "Month 1"), netWorthChange (number, cumulative $), debtCostChange (number, monthly $ change), narrative (2-3 sentences describing what happened that month)
- resilienceScore: 0-100 integer (higher = more resilient)
- actionPlan: array of 5 specific actionable strings tailored to this user

Make numbers realistic based on the user's profile. Be specific with dollar amounts.
Return ONLY valid JSON.`;

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
          { role: "user", content: `Run the ${crisisId} crisis simulation on my financial profile.` },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${status}`);
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || "{}";

    let result;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      result = JSON.parse(cleaned);
    } catch {
      result = {
        months: Array.from({ length: 12 }, (_, i) => ({
          month: `Month ${i + 1}`,
          netWorthChange: -(i + 1) * 500,
          debtCostChange: (i + 1) * 50,
          narrative: "Economic conditions continue to deteriorate.",
        })),
        resilienceScore: 50,
        actionPlan: ["Build emergency fund", "Reduce variable-rate debt", "Diversify investments", "Review insurance", "Cut discretionary spending"],
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("crisis-simulation error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
