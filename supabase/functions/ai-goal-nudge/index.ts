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
    const { goal, profile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");
    if (!goal) throw new Error("Goal data is required");

    const progress = goal.target_amount > 0
      ? ((goal.current_amount / goal.target_amount) * 100).toFixed(1)
      : "0";

    const daysLeft = goal.deadline
      ? Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : null;

    const monthlyNeeded = daysLeft && daysLeft > 0 && goal.target_amount > goal.current_amount
      ? ((goal.target_amount - goal.current_amount) / (daysLeft / 30)).toFixed(0)
      : null;

    const systemPrompt = `You are Finora's encouraging financial coach. Give a short, actionable nudge (2-3 sentences max) for this savings goal.

Goal: "${goal.name}"
Category: ${goal.category}
Target: $${goal.target_amount}
Current: $${goal.current_amount} (${progress}% complete)
${daysLeft !== null ? `Days remaining: ${daysLeft}` : "No deadline set"}
${monthlyNeeded ? `Monthly savings needed: $${monthlyNeeded}` : ""}

User profile:
- Income: ${profile?.income_range || "not specified"}
- Savings: ${profile?.savings_range || "not specified"}
- Investment level: ${profile?.investment_level || "not specified"}

Rules:
- Be specific with dollar amounts and timeframes
- If behind pace, suggest concrete micro-actions (skip 2 coffees/week, sell unused items, etc.)
- If on track or ahead, celebrate briefly and suggest stretching the goal
- Keep tone warm but direct — no fluff
- Return ONLY the nudge text, no JSON`;

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
          { role: "user", content: "Give me a personalized nudge for this goal." },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI service error (${status})`);
    }

    const aiData = await response.json();
    const nudge = aiData.choices?.[0]?.message?.content?.trim() || "Keep going — you're making progress!";

    return new Response(JSON.stringify({ nudge }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-goal-nudge error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
