import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";

const CRISES = [
  { id: "2008", label: "2008 Financial Crisis", emoji: "🔴", years: "2007–2009", description: "Housing bubble burst, bank failures, global recession" },
  { id: "2020", label: "2020 COVID Crash", emoji: "🟠", years: "2020", description: "Pandemic lockdowns, unemployment spike, market crash" },
  { id: "2022", label: "2022 Inflation Surge", emoji: "🟡", years: "2021–2023", description: "40-year high inflation, aggressive rate hikes" },
  { id: "1970s", label: "1970s Stagflation", emoji: "⚫", years: "1973–1982", description: "Oil shocks, double-digit inflation, economic stagnation" },
];

interface SimResult {
  months: { month: string; netWorthChange: number; debtCostChange: number; narrative: string }[];
  resilienceScore: number;
  actionPlan: string[];
}

export default function Simulation() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedCrisis, setSelectedCrisis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimResult | null>(null);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [showingResults, setShowingResults] = useState(false);

  const runSimulation = async () => {
    if (!selectedCrisis || !user) return;
    setLoading(true);
    setResult(null);
    setCurrentMonth(0);
    setShowingResults(false);

    try {
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileErr || !profile) throw new Error("Could not load your profile. Please complete onboarding first.");

      const { data, error } = await supabase.functions.invoke("crisis-simulation", {
        body: { crisisId: selectedCrisis, profile },
      });
      if (error) throw new Error(error.message || "Simulation failed");
      if (data?.error) throw new Error(data.error);
      if (!data?.months || data.months.length === 0) throw new Error("Simulation returned no data. Please try again.");
      setResult(data);
      setShowingResults(true);
    } catch (err: any) {
      toast({ title: "Simulation Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const prevMonth = () => {
    if (currentMonth > 0) setCurrentMonth(currentMonth - 1);
  };

  const nextMonth = () => {
    if (result && currentMonth < result.months.length - 1) setCurrentMonth(currentMonth + 1);
  };

  const reset = () => {
    setResult(null);
    setShowingResults(false);
    setCurrentMonth(0);
    setSelectedCrisis(null);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
          Crisis Simulation
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Run your finances through historical economic crises
        </p>
      </div>

      {!showingResults ? (
        <>
          <div className="mb-8 grid gap-3 sm:gap-4 md:grid-cols-2">
            {CRISES.map((crisis) => (
              <button
                key={crisis.id}
                onClick={() => setSelectedCrisis(crisis.id)}
                disabled={loading}
                className={`rounded-lg border p-4 text-left transition-all sm:p-6 ${
                  selectedCrisis === crisis.id
                    ? "border-primary bg-accent shadow-card-hover"
                    : "border-border bg-card shadow-card hover:shadow-card-hover"
                } disabled:opacity-50`}
              >
                <div className="mb-2 flex items-center gap-3">
                  <span className="text-xl sm:text-2xl">{crisis.emoji}</span>
                  <div>
                    <p className="font-display text-base font-semibold text-foreground sm:text-lg">{crisis.label}</p>
                    <p className="text-xs text-muted-foreground">{crisis.years}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground sm:text-sm">{crisis.description}</p>
              </button>
            ))}
          </div>

          <div className="text-center">
            <Button
              size="lg"
              onClick={runSimulation}
              disabled={!selectedCrisis || loading}
              className="gap-2 bg-primary px-8 hover:bg-finora-green-hover"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              {loading ? "Running simulation..." : "Run Simulation"}
            </Button>
          </div>
        </>
      ) : result ? (
        <div className="space-y-6 sm:space-y-8">
          {/* Resilience Score */}
          <Card className="mx-auto max-w-sm text-center shadow-card">
            <CardContent className="p-6 sm:p-8">
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Financial Resilience Score
              </p>
              <div className="relative mx-auto flex h-32 w-32 items-center justify-center sm:h-40 sm:w-40">
                <svg className="absolute inset-0" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="70" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
                  <circle
                    cx="80" cy="80" r="70" fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(result.resilienceScore / 100) * 440} 440`}
                    transform="rotate(-90 80 80)"
                    className="transition-all duration-1000"
                  />
                </svg>
                <span className="font-mono text-3xl font-bold text-foreground sm:text-4xl">
                  {result.resilienceScore}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">out of 100</p>
            </CardContent>
          </Card>

          {/* Timeline */}
          <div>
            <h2 className="mb-4 font-display text-lg font-semibold text-foreground sm:text-xl">Month-by-Month</h2>
            <div className="mb-4">
              <Progress value={((currentMonth + 1) / result.months.length) * 100} className="h-2" />
              <p className="mt-1 text-center text-xs text-muted-foreground">
                Month {currentMonth + 1} of {result.months.length}
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentMonth}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="shadow-card">
                  <CardContent className="p-4 sm:p-6">
                    <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      {result.months[currentMonth].month}
                    </p>
                    <div className="mb-4 flex flex-wrap gap-4 sm:gap-6">
                      <div>
                        <p className="text-xs text-muted-foreground">Net Worth Change</p>
                        <p className={`font-mono text-lg font-bold sm:text-xl ${result.months[currentMonth].netWorthChange >= 0 ? "text-primary" : "text-destructive"}`}>
                          {result.months[currentMonth].netWorthChange >= 0 ? "+" : ""}
                          ${Math.round(result.months[currentMonth].netWorthChange).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Debt Cost Change</p>
                        <p className={`font-mono text-lg font-bold sm:text-xl ${result.months[currentMonth].debtCostChange <= 0 ? "text-primary" : "text-destructive"}`}>
                          {result.months[currentMonth].debtCostChange >= 0 ? "+" : ""}
                          ${Math.round(result.months[currentMonth].debtCostChange).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {result.months[currentMonth].narrative}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            <div className="mt-4 flex justify-center gap-3">
              {currentMonth > 0 && (
                <Button variant="outline" onClick={prevMonth} className="gap-1">
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
              )}
              {currentMonth < result.months.length - 1 && (
                <Button onClick={nextMonth} className="gap-1 bg-primary hover:bg-finora-green-hover">
                  Next Month <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Action Plan */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-lg sm:text-xl">Your Action Plan</CardTitle>
              <CardDescription>Personalised steps to improve your resilience</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {result.actionPlan?.map((action, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Badge className="mt-0.5 shrink-0 bg-primary text-primary-foreground">{i + 1}</Badge>
                    <p className="text-sm text-muted-foreground">{action}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button variant="outline" onClick={reset} className="gap-2">
              <RotateCcw className="h-4 w-4" /> Try Another Crisis
            </Button>
          </div>
        </div>
      ) : null}
    </motion.div>
  );
}
