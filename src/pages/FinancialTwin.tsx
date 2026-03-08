import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, TrendingUp, TrendingDown, Minus, Loader2, Lightbulb, DollarSign, Wallet, PiggyBank } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { fetchFredData } from "@/lib/fred";

const scenarioConfig = {
  current_path: { label: "Current Path", icon: Minus, color: "text-blue-500", bg: "bg-blue-500/10" },
  best_case: { label: "Best Case", icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
  worst_case: { label: "Worst Case", icon: TrendingDown, color: "text-destructive", bg: "bg-destructive/10" },
};

function ScenarioCard({ scenario, data }: { scenario: string; data: any }) {
  const cfg = scenarioConfig[scenario as keyof typeof scenarioConfig];
  const Icon = cfg.icon;
  return (
    <Card className={cfg.bg}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className={`h-5 w-5 ${cfg.color}`} />
          {cfg.label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {["year_1", "year_3", "year_5"].map(year => (
            <div key={year}>
              <p className="text-xs font-medium text-muted-foreground uppercase mb-1">{year.replace("_", " ")}</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <Wallet className="h-3.5 w-3.5 text-primary mx-auto mb-0.5" />
                  <p className="text-xs text-muted-foreground">Net Worth</p>
                  <p className="text-sm font-bold">{data?.[year]?.net_worth || "—"}</p>
                </div>
                <div className="text-center">
                  <DollarSign className="h-3.5 w-3.5 text-destructive mx-auto mb-0.5" />
                  <p className="text-xs text-muted-foreground">Debt Cost</p>
                  <p className="text-sm font-bold">{data?.[year]?.debt_cost || "—"}</p>
                </div>
                <div className="text-center">
                  <PiggyBank className="h-3.5 w-3.5 text-green-500 mx-auto mb-0.5" />
                  <p className="text-xs text-muted-foreground">Purchasing Power</p>
                  <p className="text-sm font-bold">{data?.[year]?.purchasing_power || "—"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function FinancialTwin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [twin, setTwin] = useState<any>(null);

  useEffect(() => {
    if (user) loadLatest();
  }, [user]);

  const loadLatest = async () => {
    const { data } = await supabase
      .from("financial_twin_snapshots")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    if (data?.projections) {
      try { setTwin(typeof data.projections === 'string' ? JSON.parse(data.projections) : data.projections); } catch {}
    }
  };

  const updateProjection = async () => {
    setLoading(true);
    try {
      const metrics = await fetchFredData();
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
      const { data: goals } = await supabase.from("financial_goals").select("*").eq("user_id", user!.id);
      const { data, error } = await supabase.functions.invoke("financial-twin", {
        body: { metrics, profile, goals },
      });
      if (error) throw error;
      setTwin(data);
      await supabase.from("financial_twin_snapshots").insert({
        user_id: user!.id,
        projections: data,
        key_insight: data.key_insight || "",
      });
    } catch (e: any) {
      toast({ title: "Projection failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container max-w-5xl py-6 sm:py-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <User className="h-8 w-8 text-primary" />
            <h1 className="font-display text-3xl font-bold">Financial Twin</h1>
          </div>
          <p className="text-muted-foreground">Your living digital model — updated as macro conditions change</p>
        </div>
        <Button onClick={updateProjection} disabled={loading}>
          {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Projecting...</> : "Update Projection"}
        </Button>
      </div>

      {twin?.key_insight && (
        <Card className="mb-6 border-primary/30 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">{twin.key_insight}</p>
                {twin.historical_comparison && <p className="text-xs text-muted-foreground mt-2">{twin.historical_comparison}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {twin ? (
        <Tabs defaultValue="current_path">
          <TabsList className="mb-4 w-full grid grid-cols-3">
            <TabsTrigger value="current_path">Current Path</TabsTrigger>
            <TabsTrigger value="best_case">Best Case</TabsTrigger>
            <TabsTrigger value="worst_case">Worst Case</TabsTrigger>
          </TabsList>
          {Object.keys(scenarioConfig).map(key => (
            <TabsContent key={key} value={key}>
              <ScenarioCard scenario={key} data={twin[key]} />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <User className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-medium mb-1">No projection yet</p>
            <p className="text-sm text-muted-foreground">Click "Update Projection" to build your financial digital twin.</p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
