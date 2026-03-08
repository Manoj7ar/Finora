import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ClipboardList, Loader2, RefreshCw, Download } from "lucide-react";
import { exportActionPlanPDF } from "@/lib/pdf-export";

interface ActionItem {
  priority: string;
  action: string;
  rationale: string;
  dollarImpact: string;
}

interface ActionPlan {
  title: string;
  summary: string;
  actions: ActionItem[];
  outlook: string;
}

export default function ActionPlan() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [plan, setPlan] = useState<ActionPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [metrics, setMetrics] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const init = async () => {
      const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(p);
      const { data: m, error: mErr } = await supabase.functions.invoke("fred-data");
      if (!mErr && m?.metrics) setMetrics(m.metrics);
    };
    init();
  }, [user]);

  const generatePlan = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-action-plan", {
        body: { profile, metrics },
      });
      if (error) throw new Error(error.message || "Failed to generate plan");
      if (data?.error) throw new Error(data.error);
      if (!data?.actions || data.actions.length === 0) throw new Error("No actions generated. Please try again.");
      setPlan(data);
    } catch (err: any) {
      toast({ title: "Action Plan Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const priorityColor = (p: string) => {
    switch (p) {
      case "high": return "bg-destructive text-destructive-foreground";
      case "medium": return "bg-warning text-warning-foreground";
      default: return "bg-accent text-accent-foreground";
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container max-w-3xl py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
          AI Action Plan
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Your personalized monthly financial roadmap
        </p>
      </div>

      {!plan ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center gap-5 p-8 sm:gap-6 sm:p-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent">
              <ClipboardList className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <h2 className="mb-2 font-display text-lg font-semibold text-foreground sm:text-xl">
                Generate Your Action Plan
              </h2>
              <p className="mb-6 text-sm text-muted-foreground">
                AI will analyze current economic conditions and your financial profile to create a prioritized list of actions for this month.
              </p>
              <Button
                onClick={generatePlan}
                disabled={loading || !profile}
                className="gap-2 bg-primary px-8 hover:bg-finora-green-hover"
              >
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : "Generate Plan"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 sm:space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="font-display text-xl sm:text-2xl">{plan.title}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => plan && exportActionPlanPDF(plan)} className="gap-1">
                    <Download className="h-3.5 w-3.5" /> PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={generatePlan} disabled={loading} className="gap-1">
                    {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />} Regenerate
                  </Button>
                </div>
              </div>
              <CardDescription className="text-sm sm:text-base">{plan.summary}</CardDescription>
            </CardHeader>
          </Card>

          <div className="space-y-3 sm:space-y-4">
            {plan.actions?.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="shadow-card transition-shadow hover:shadow-card-hover">
                  <CardContent className="p-4 sm:p-5">
                    <div className="mb-3 flex flex-wrap items-center gap-2 sm:gap-3">
                      <Badge className={priorityColor(item.priority)}>
                        {item.priority}
                      </Badge>
                      {item.dollarImpact && (
                        <span className="font-mono text-sm font-semibold text-primary">
                          {item.dollarImpact}
                        </span>
                      )}
                    </div>
                    <h3 className="mb-2 text-sm font-medium text-foreground sm:text-base">{item.action}</h3>
                    <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">{item.rationale}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {plan.outlook && (
            <Card className="border-l-4 border-l-primary shadow-card">
              <CardContent className="p-4 sm:p-5">
                <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Next Month Outlook
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">{plan.outlook}</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
