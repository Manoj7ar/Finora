import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FRED_API_KEY = Deno.env.get("FRED_API_KEY");
const FRED_BASE = "https://api.stlouisfed.org/fred/series/observations";

const SERIES = [
  { seriesId: "FEDFUNDS", name: "Federal Funds Rate", unit: "%" },
  { seriesId: "CPIAUCSL", name: "Consumer Price Index", unit: "index" },
  { seriesId: "UNRATE", name: "Unemployment Rate", unit: "%" },
  { seriesId: "DGS10", name: "10-Year Treasury Yield", unit: "%" },
  { seriesId: "DRCCLACBS", name: "Credit Card Delinquency", unit: "%" },
  { seriesId: "CSUSHPINSA", name: "Housing Price Index", unit: "index" },
];

async function fetchSeries(seriesId: string) {
  const apiKey = FRED_API_KEY || "DEMO_KEY";
  // Fetch last 12 observations for sparkline history
  const url = `${FRED_BASE}?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=12`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`FRED API error for ${seriesId}: ${res.status}`);
      return { value: null, previousValue: null, history: [] };
    }
    const data = await res.json();
    const obs = data.observations || [];
    const current = obs[0]?.value !== "." ? parseFloat(obs[0]?.value) : null;
    const previous = obs[1]?.value !== "." ? parseFloat(obs[1]?.value) : null;
    
    // Build history array (oldest first) for sparkline
    const history = obs
      .map((o: any) => ({ date: o.date, value: o.value !== "." ? parseFloat(o.value) : null }))
      .filter((h: any) => h.value !== null)
      .reverse();

    return { value: current, previousValue: previous, history };
  } catch (e) {
    console.error(`Failed to fetch ${seriesId}:`, e);
    return { value: null, previousValue: null, history: [] };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const results = await Promise.all(
      SERIES.map(async (s) => {
        const { value, previousValue, history } = await fetchSeries(s.seriesId);
        return {
          ...s,
          id: s.seriesId,
          value,
          previousValue,
          history,
          description: "",
        };
      })
    );

    return new Response(JSON.stringify({ metrics: results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("fred-data error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
