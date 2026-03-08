import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, Sparkles, Download, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { type FredMetric, type ProfileData } from "@/lib/fred";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/use-notifications";
import { exportDashboardPDF } from "@/lib/pdf-export";
import QuickStats from "@/components/dashboard/QuickStats";
import MetricCard from "@/components/dashboard/MetricCard";
import InsightCard from "@/components/dashboard/InsightCard";
import HealthScore from "@/components/dashboard/HealthScore";
import PeerBenchmark from "@/components/dashboard/PeerBenchmark";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkAndCreateAlerts } = useNotifications();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [metrics, setMetrics] = useState<FredMetric[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [goalsCount, setGoalsCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    const init = async () => {
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

      const [{ count: lessonCount }, { count: goalCount }] = await Promise.all([
        supabase
          .from("lesson_progress")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("financial_goals")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),
      ]);
      if (!cancelled) {
        setLessonsCompleted(lessonCount || 0);
        setGoalsCount(goalCount || 0);
      }
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
      if (error) throw new Error(error.message || "Failed to fetch economic data");
      if (data?.error) throw new Error(data.error);
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
      if (error) throw new Error(error.message || "Failed to generate insights");
      if (data?.error) throw new Error(data.error);
      setInsights(data?.insights || []);
    } catch (err: any) {
      toast({ title: "Insight error", description: err.message, variant: "destructive" });
    } finally {
      setLoadingInsights(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="container py-6 sm:py-8"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
            Your Economic Vitals
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Live macro indicators personalised to your finances
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportDashboardPDF(metrics, insights)}
            disabled={metrics.length === 0}
            className="gap-1"
          >
            <Download className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Export</span> PDF
          </Button>
          <Button variant="outline" size="sm" onClick={fetchMetrics} className="gap-1">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
          <Button
            size="sm"
            onClick={fetchInsights}
            disabled={loadingInsights}
            className="gap-1 bg-primary hover:bg-finora-green-hover"
          >
            {loadingInsights ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            {loadingInsights ? "Generating..." : "AI Insights"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        <HealthScore
          profile={profile}
          lessonsCompleted={lessonsCompleted}
          goalsCount={goalsCount}
          metricsCount={metrics.length}
          insightsCount={insights.length}
        />
        <PeerBenchmark
          profile={profile}
          lessonsCompleted={lessonsCompleted}
          goalsCount={goalsCount}
        />
      </div>

      <div className="h-6 sm:h-8" />

      <QuickStats
        metricsCount={metrics.length}
        insightsCount={insights.length}
        lessonsCompleted={lessonsCompleted}
        goalsCount={goalsCount}
      />

      {/* Metric Cards */}
      <div className="mb-10 grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loadingMetrics
          ? Array(6)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="shadow-card">
                  <CardContent className="p-6">
                    <Skeleton className="mb-4 h-4 w-32" />
                    <Skeleton className="mb-2 h-10 w-24" />
                    <Skeleton className="mb-2 h-12 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))
          : metrics.map((metric, i) => (
              <MetricCard key={metric.seriesId} metric={metric} profile={profile} index={i} />
            ))}
      </div>

      {/* AI Insights */}
      {loadingInsights && insights.length === 0 && (
        <Card className="mb-10 shadow-card">
          <CardContent className="flex items-center justify-center gap-3 p-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-muted-foreground">Generating personalized insights...</p>
          </CardContent>
        </Card>
      )}

      {insights.length > 0 && (
        <section>
          <h2 className="mb-6 font-display text-xl font-bold text-foreground sm:text-2xl">
            AI Insights
          </h2>
          <div className="space-y-4">
            {insights.map((insight, i) => (
              <InsightCard key={i} insight={insight} index={i} />
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}
