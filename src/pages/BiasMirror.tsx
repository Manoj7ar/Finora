import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, AlertTriangle, DollarSign, Lightbulb, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface BiasResult {
  bias_type: string;
  occurrences: number;
  estimated_annual_cost: string;
  explanation: string;
  counteraction_tip: string;
}

const biasIcons: Record<string, string> = {
  loss_aversion: "🛡️",
  recency_bias: "📅",
  anchoring: "⚓",
  overconfidence: "🎯",
  negativity_bias: "☁️",
  confirmation_bias: "🔍",
  herd_mentality: "🐑",
  sunk_cost_fallacy: "💸",
};

export default function BiasMirror() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [biases, setBiases] = useState<BiasResult[]>([]);
  const [overallInsight, setOverallInsight] = useState("");
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (user) loadEvents();
  }, [user]);

  const loadEvents = async () => {
    const { data } = await supabase
      .from("cognitive_bias_events")
      .select("*")
      .eq("user_id", user!.id)
      .order("detected_at", { ascending: false })
      .limit(100);
    setEvents(data || []);
  };

  const runAnalysis = async () => {
    if (events.length === 0) {
      toast({ title: "Not enough data", description: "Keep using Finora's features to build your pattern profile.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
      const { data, error } = await supabase.functions.invoke("cognitive-bias-analysis", {
        body: { biasEvents: events, profile },
      });
      if (error) throw error;
      setBiases(data.biases || []);
      setOverallInsight(data.overall_insight || "");
    } catch (e: any) {
      toast({ title: "Analysis failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container max-w-4xl py-6 sm:py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="font-display text-3xl font-bold">Cognitive Bias Mirror</h1>
        </div>
        <p className="text-muted-foreground">Your financial decisions are shaped by invisible biases. Let's make them visible.</p>
      </div>

      <Card className="mb-6">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="font-medium">Pattern Events Tracked</p>
            <p className="text-2xl font-bold text-primary">{events.length}</p>
            <p className="text-xs text-muted-foreground mt-1">From lessons, simulations, predictions & scenarios</p>
          </div>
          <Button onClick={runAnalysis} disabled={loading} size="lg">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Analyzing...</> : "Scan My Patterns"}
          </Button>
        </CardContent>
      </Card>

      {overallInsight && (
        <Card className="mb-6 border-primary/30 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm">{overallInsight}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {biases.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {biases.map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-2xl">{biasIcons[b.bias_type] || "🧠"}</span>
                      {b.bias_type.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                    </CardTitle>
                    <Badge variant="secondary">{b.occurrences}x detected</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-destructive" />
                    <span className="text-destructive font-medium">Avg. annual cost: {b.estimated_annual_cost}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{b.explanation}</p>
                  <div className="rounded-lg bg-primary/5 p-3">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-primary" />
                      How to counteract
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{b.counteraction_tip}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {biases.length === 0 && !loading && events.length > 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Brain className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Click "Scan My Patterns" to analyze your cognitive biases</p>
          </CardContent>
        </Card>
      )}

      {events.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Brain className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-medium mb-1">No patterns tracked yet</p>
            <p className="text-sm text-muted-foreground">Complete lessons, run simulations, and make predictions to build your bias profile.</p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
