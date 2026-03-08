import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Minus, RefreshCw, Sparkles, BookOpen, Zap, Trophy, Download } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { calculateImpact, type FredMetric, type ProfileData } from "@/lib/fred";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [metrics, setMetrics] = useState<FredMetric[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null);
  const [lessonsCompleted, setLessonsCompleted] = useState(0);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    const init = async () => {
      // Load profile
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (cancelled) return;
      if (error || !data?.onboarding_completed) {
        navigate("/onboarding");
        return;
      }
      setProfile(data as unknown as ProfileData);

      // Load lesson count
      const { count } = await supabase
        .from("lesson_progress")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      if (!cancelled) setLessonsCompleted(count || 0);
    };

    init();
    return () => { cancelled = true; };
  }, [user]);

  useEffect(() => {
    if (profile) fetchMetrics();
  }, [profile]);

  const fetchMetrics = useCallback(async () => {
    setLoadingMetrics(true);
    try {
      const { data, error } = await supabase.functions.invoke("fred-data");
      if (error) throw error;
      setMetrics(data?.metrics || []);
    } catch (err: any) {
      toast({ title: "Data fetch error", description: err.message, variant: "destructive" });
    } finally {
      setLoadingMetrics(false);
    }
  }, [toast]);

  const fetchInsights = async () => {
    if (!profile || metrics.length === 0) return;
    setLoadingInsights(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-insights", {
        body: { profile, metrics },
      });
      if (error) throw error;
      setInsights(data?.insights || []);
    } catch (err: any) {
      toast({ title: "Insight error", description: err.message, variant: "destructive" });
    } finally {
      setLoadingInsights(false);
    }
  };

  const getTrend = (current: number | null, previous: number | null) => {
    if (current == null || previous == null) return <Minus className="h-4 w-4 text-muted-foreground" />;
    if (current > previous) return <TrendingUp className="h-4 w-4 text-destructive" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-primary" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Your Economic Vitals
          </h1>
          <p className="mt-1 text-muted-foreground">
            Live macro indicators personalised to your finances
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchMetrics} className="gap-1">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
          <Button size="sm" onClick={fetchInsights} disabled={loadingInsights} className="gap-1 bg-primary hover:bg-finora-green-hover">
            <Sparkles className="h-3.5 w-3.5" /> {loadingInsights ? "Generating..." : "AI Insights"}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="shadow-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Indicators</p>
              <p className="font-mono text-lg font-bold text-foreground">{metrics.length || "—"}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">AI Insights</p>
              <p className="font-mono text-lg font-bold text-foreground">{insights.length || "—"}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Lessons</p>
              <p className="font-mono text-lg font-bold text-foreground">{lessonsCompleted}/4</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card cursor-pointer transition-shadow hover:shadow-card-hover" onClick={() => navigate("/simulation")}>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Crisis Sim</p>
              <p className="text-xs font-medium text-primary">Run now →</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metric Cards */}
      <div className="mb-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loadingMetrics
          ? Array(6).fill(0).map((_, i) => (
              <Card key={i} className="shadow-card">
                <CardContent className="p-6">
                  <Skeleton className="mb-4 h-4 w-32" />
                  <Skeleton className="mb-2 h-10 w-24" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))
          : metrics.map((metric, i) => {
              const impact = profile ? calculateImpact(metric, profile) : null;
              return (
                <motion.div
                  key={metric.seriesId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card className="shadow-card transition-shadow hover:shadow-card-hover">
                    <CardContent className="p-6">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                          {metric.name}
                        </span>
                        <div className="flex items-center gap-2">
                          {getTrend(metric.value, metric.previousValue)}
                          <span className="inline-block h-2 w-2 rounded-full bg-secondary animate-pulse-live" />
                        </div>
                      </div>

                      <p className="font-mono text-3xl font-bold text-foreground">
                        {metric.value != null ? (
                          metric.unit === "%" ? `${metric.value.toFixed(2)}%` : metric.value.toFixed(1)
                        ) : "—"}
                      </p>

                      {/* Sparkline */}
                      {metric.history && metric.history.length > 2 && (
                        <div className="my-3 h-12">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={metric.history}>
                              <YAxis domain={["dataMin", "dataMax"]} hide />
                              <Line
                                type="monotone"
                                dataKey="value"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                dot={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}

                      {impact && (
                        <p className="mt-2 font-mono text-sm font-semibold text-primary">
                          {impact.dollarImpact}
                        </p>
                      )}

                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {impact?.explanation || metric.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
      </div>

      {/* AI Insight Cards */}
      {insights.length > 0 && (
        <section>
          <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
            AI Insights
          </h2>
          <div className="space-y-4">
            {insights.map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`shadow-card border-l-4 ${
                  insight.severity === "critical" ? "border-l-destructive" :
                  insight.severity === "warning" ? "border-l-warning" :
                  "border-l-primary"
                }`}>
                  <CardContent className="p-6">
                    <div className="mb-3 flex items-center gap-3">
                      <Badge
                        variant={insight.severity === "critical" ? "destructive" : "default"}
                        className={
                          insight.severity === "warning"
                            ? "bg-warning text-warning-foreground"
                            : insight.severity === "healthy"
                            ? "bg-accent text-accent-foreground"
                            : ""
                        }
                      >
                        {insight.severity}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date().toLocaleDateString()} · Live data
                      </span>
                    </div>

                    <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                      {insight.headline}
                    </h3>

                    {insight.dollarImpact && (
                      <p className="mb-3 font-mono text-2xl font-bold text-primary">
                        {insight.dollarImpact}
                      </p>
                    )}

                    <p className="text-muted-foreground leading-relaxed">
                      {insight.summary}
                    </p>

                    {insight.lesson && (
                      <div className="mt-4">
                        <button
                          onClick={() => setExpandedInsight(expandedInsight === i ? null : i)}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          {expandedInsight === i ? "Show less" : "Learn more →"}
                        </button>
                        {expandedInsight === i && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-3 rounded-md bg-background p-4 text-sm text-muted-foreground leading-relaxed"
                          >
                            {insight.lesson}
                          </motion.div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
