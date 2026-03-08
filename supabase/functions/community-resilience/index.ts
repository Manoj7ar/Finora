import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { userId, profile, healthScore } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const ageGroup = profile?.age_group || "";
    const city = profile?.city || "";

    // Upsert the user's score
    if (userId && ageGroup && city && healthScore != null) {
      await supabase.from("community_scores").upsert({
        user_id: userId,
        age_group: ageGroup,
        city: city,
        resilience_score: Math.round(healthScore),
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
    }

    // Get user's own score
    const { data: userScore } = await supabase
      .from("community_scores")
      .select("resilience_score")
      .eq("user_id", userId)
      .single();

    // Get community stats via function
    const { data: communityStats } = await supabase.rpc("get_community_stats");

    // Calculate percentile if user has a score
    let percentile = null;
    if (userScore?.resilience_score != null) {
      const { count: totalUsers } = await supabase
        .from("community_scores")
        .select("*", { count: "exact", head: true });
      const { count: belowCount } = await supabase
        .from("community_scores")
        .select("*", { count: "exact", head: true })
        .lt("resilience_score", userScore.resilience_score);

      if (totalUsers && totalUsers > 0) {
        percentile = Math.round(((belowCount || 0) / totalUsers) * 100);
      }
    }

    return new Response(JSON.stringify({
      user_score: userScore?.resilience_score ?? null,
      percentile,
      community_stats: communityStats || [],
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("community-resilience error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
