import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sun, Cloud, CloudRain, CloudLightning, Tornado, Loader2, Umbrella, Calendar, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { fetchFredData } from "@/lib/fred";

const outlookConfig: Record<string, { icon: any; color: string; label: string; bg: string }> = {
  sunny: { icon: Sun, color: "text-yellow-500", label: "Sunny", bg: "bg-yellow-500/10" },
  partly_cloudy: { icon: Cloud, color: "text-blue-400", label: "Partly Cloudy", bg: "bg-blue-400/10" },
  cloudy: { icon: Cloud, color: "text-muted-foreground", label: "Cloudy", bg: "bg-muted/50" },
  stormy: { icon: CloudRain, color: "text-orange-500", label: "Stormy", bg: "bg-orange-500/10" },
  hurricane: { icon: Tornado, color: "text-destructive", label: "Hurricane", bg: "bg-destructive/10" },
};

export default function EconomicWeather() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (user) loadHistory();
  }, [user]);

  const loadHistory = async () => {
    const { data } = await supabase
      .from("economic_forecasts")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(5);
    setHistory(data || []);
    if (data?.[0]) {
      try { setForecast(typeof data[0].details === 'string' ? JSON.parse(data[0].details) : data[0].details); } catch {}
    }
  };

  const generateForecast = async () => {
    setLoading(true);
    try {
      const metrics = await fetchFredData();
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
      const { data, error } = await supabase.functions.invoke("economic-weather", {
        body: { metrics, profile },
      });
      if (error) throw error;
      setForecast(data);
      await supabase.from("economic_forecasts").insert({
        user_id: user!.id,
        forecast_date: new Date().toISOString().split("T")[0],
        summary: data.summary,
        outlook: data.outlook,
        details: data,
      });
      loadHistory();
    } catch (e: any) {
      toast({ title: "Forecast failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const cfg = forecast ? outlookConfig[forecast.outlook] || outlookConfig.cloudy : null;
  const OutlookIcon = cfg?.icon || Cloud;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container max-w-4xl py-6 sm:py-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <CloudLightning className="h-8 w-8 text-primary" />
            <h1 className="font-display text-3xl font-bold">Economic Weather</h1>
          </div>
          <p className="text-muted-foreground">Your personalized 30-day economic forecast</p>
        </div>
        <Button onClick={generateForecast} disabled={loading}>
          {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Forecasting...</> : "Generate Forecast"}
        </Button>
      </div>

      {forecast && cfg && (
        <>
          <Card className={`mb-6 ${cfg.bg} border-0`}>
            <CardContent className="p-8">
              <div className="flex items-center gap-6">
                <OutlookIcon className={`h-20 w-20 ${cfg.color}`} />
                <div>
                  <Badge className="mb-2">{cfg.label}</Badge>
                  <h2 className="text-2xl font-bold mb-2">{forecast.headline}</h2>
                  <p className="text-muted-foreground">{forecast.summary}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {forecast.upcoming_events?.length > 0 && (
            <Card className="mb-6">
              <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />Upcoming Events</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {forecast.upcoming_events.map((e: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg bg-muted/30 p-3">
                      <span className="text-xs font-medium text-primary mt-0.5 whitespace-nowrap">{e.date}</span>
                      <div>
                        <p className="text-sm font-medium">{e.event}</p>
                        <p className="text-xs text-muted-foreground">{e.impact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {forecast.action_items?.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Shield className="h-5 w-5" />Action Items</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {forecast.action_items.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            {forecast.umbrella_tip && (
              <Card className="border-primary/20">
                <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Umbrella className="h-5 w-5 text-primary" />Your Umbrella</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{forecast.umbrella_tip}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}

      {!forecast && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Cloud className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-medium mb-1">No forecast yet</p>
            <p className="text-sm text-muted-foreground">Generate your first economic weather report to see personalized predictions.</p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
