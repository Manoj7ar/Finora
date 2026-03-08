import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Lightbulb, Loader2, ArrowRight, TrendingUp, TrendingDown, Minus, RotateCcw } from "lucide-react";

const PRESET_SCENARIOS = [
  "What if I pay off all my credit card debt?",
  "What if inflation jumps to 8%?",
  "What if I lose my job for 3 months?",
  "What if I double my monthly savings?",
  "What if mortgage rates drop to 4%?",
  "What if the stock market crashes 30%?",
];

interface Impact {
  area: string;
  change: string;
  direction: "positive" | "negative" | "neutral";
  explanation: string;
}

interface WhatIfResult {
  scenario: string;
  verdict: string;
  summary: string;
  impacts: Impact[];
  recommendation: string;
  timeframe: string;
}

export default function WhatIf() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [customScenario, setCustomScenario] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WhatIfResult | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      supabase.from("profiles").select("*").eq("id", user.id).single()
        .then(({ data }) => setProfile(data));
    }
  }, [user]);

  const runScenario = async (scenario: string) => {
    if (!profile || !scenario.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("ai-what-if", {
        body: { scenario, profile },
      });
      if (error) throw error;
      setResult(data);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const verdictColor = (v: string) => {
    switch (v) {
      case "beneficial": return "bg-primary text-primary-foreground";
      case "risky": return "bg-destructive text-destructive-foreground";
      case "mixed": return "bg-warning text-warning-foreground";
      default: return "bg-accent text-accent-foreground";
    }
  };

  const dirIcon = (d: string) => {
    switch (d) {
      case "positive": return <TrendingUp className="h-4 w-4 text-primary" />;
      case "negative": return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const reset = () => {
    setResult(null);
    setCustomScenario("");
  };

  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          What If...?
        </h1>
        <p className="mt-1 text-muted-foreground">
          Explore hypothetical scenarios and see the impact on your finances
        </p>
      </div>

      {!result ? (
        <div className="space-y-6">
          {/* Custom input */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <form
                onSubmit={(e) => { e.preventDefault(); runScenario(customScenario); }}
                className="flex gap-3"
              >
                <Input
                  value={customScenario}
                  onChange={(e) => setCustomScenario(e.target.value)}
                  placeholder="Type your own scenario..."
                  disabled={loading}
                  className="h-12 flex-1 rounded-xl border-border bg-background text-base"
                />
                <Button
                  type="submit"
                  disabled={loading || !customScenario.trim()}
                  className="h-12 gap-2 rounded-xl bg-primary px-6 hover:bg-finora-green-hover"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  Analyze
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Presets */}
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Or try one of these
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {PRESET_SCENARIOS.map((s) => (
                <button
                  key={s}
                  onClick={() => runScenario(s)}
                  disabled={loading}
                  className="rounded-xl border border-border bg-card p-4 text-left text-sm transition-all hover:border-primary/50 hover:shadow-card"
                >
                  <Lightbulb className="mb-2 h-4 w-4 text-primary" />
                  {s}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <Card className="shadow-card">
              <CardContent className="flex items-center justify-center gap-3 p-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-muted-foreground">Analyzing scenario...</p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Header */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge className={verdictColor(result.verdict)}>{result.verdict}</Badge>
                {result.timeframe && (
                  <span className="text-xs text-muted-foreground">⏱ {result.timeframe}</span>
                )}
              </div>
              <CardTitle className="font-display text-xl">{result.scenario}</CardTitle>
              <CardDescription className="text-base">{result.summary}</CardDescription>
            </CardHeader>
          </Card>

          {/* Impacts */}
          <div className="space-y-4">
            {result.impacts?.map((impact, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="shadow-card">
                  <CardContent className="p-5">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {dirIcon(impact.direction)}
                        <span className="text-sm font-medium text-foreground">{impact.area}</span>
                      </div>
                      <span className={`font-mono text-sm font-bold ${
                        impact.direction === "positive" ? "text-primary" :
                        impact.direction === "negative" ? "text-destructive" :
                        "text-muted-foreground"
                      }`}>
                        {impact.change}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{impact.explanation}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Recommendation */}
          {result.recommendation && (
            <Card className="border-l-4 border-l-primary shadow-card">
              <CardContent className="p-5">
                <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Recommendation
                </p>
                <p className="text-muted-foreground leading-relaxed">{result.recommendation}</p>
              </CardContent>
            </Card>
          )}

          <div className="text-center">
            <Button variant="outline" onClick={reset} className="gap-2">
              <RotateCcw className="h-4 w-4" /> Try Another Scenario
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
