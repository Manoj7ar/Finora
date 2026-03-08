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
    const { topicId, profile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    if (!topicId) throw new Error("Please select a topic");

    const topics: Record<string, string> = {
      "fed-rate": "The Federal Funds Rate — what it is, how the Federal Reserve sets it, how it transmits through the economy to affect borrowing costs, savings rates, and employment",
      "inflation": "Inflation and purchasing power — how CPI is measured, what causes inflation, how it erodes savings, and strategies to protect against it",
      "yield-curve": "The yield curve — what it is, normal vs inverted yield curves, why inversions predict recessions, and what it means for mortgage and savings rates",
      "recessions": "How recessions start and unfold — business cycles, leading indicators, how downturns affect employment, debt costs, and asset prices",
    };

    if (!topics[topicId]) throw new Error(`Unknown topic: ${topicId}`);

    // Fetch live FRED data for more relevant lessons
    const FRED_API_KEY = Deno.env.get("FRED_API_KEY");
    let fredContext = "";
    if (FRED_API_KEY) {
      try {
        const seriesForTopic: Record<string, string[]> = {
          "fed-rate": ["FEDFUNDS"],
          "inflation": ["CPIAUCSL"],
          "yield-curve": ["DGS10", "DGS2"],
          "recessions": ["UNRATE", "FEDFUNDS"],
        };
        const series = seriesForTopic[topicId] || [];
        for (const sid of series) {
          const res = await fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=${sid}&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&limit=1`);
          if (res.ok) {
            const data = await res.json();
            const val = data.observations?.[0]?.value;
            if (val && val !== ".") fredContext += `Current ${sid}: ${val} (as of ${data.observations[0].date}). `;
          }
        }
      } catch { /* continue without FRED data */ }
    }

    const systemPrompt = `You are Finora's economics teacher. Create a personalized 3-minute lesson about: ${topics[topicId]}.

Personalize to this user:
- Income: ${profile?.income_range || "not specified"}
- Debts: ${JSON.stringify(profile?.debt_types || {})}
- Savings: ${profile?.savings_range || "not specified"}
- Investment level: ${profile?.investment_level || "not specified"}

${fredContext ? `Current real data: ${fredContext}` : ""}

Return a JSON object with:
- content: string with the full lesson (use concrete dollar examples from their profile, reference real current data if available, 4-6 paragraphs, plain English, no jargon without explanation)
- quiz: array of 3 objects, each with: question (string), options (array of 4 strings), correctIndex (0-3 integer)

Make quiz questions test understanding, not memorization. Reference the user's numbers in at least 2 questions.
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
          { role: "user", content: `Teach me about ${topicId} using my financial profile.` },
        ],
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
      const text = await response.text();
      console.error("AI gateway error:", status, text);
      throw new Error(`AI service temporarily unavailable (${status})`);
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || "{}";

    let lesson;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      lesson = JSON.parse(cleaned);
    } catch {
      lesson = {
        content: content,
        quiz: [
          { question: "What did you learn?", options: ["A lot", "Some", "A little", "Nothing"], correctIndex: 0 },
        ],
      };
    }

    return new Response(JSON.stringify(lesson), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("education-lesson error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
