import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Handshake, Loader2, Copy, Check, Clock, Zap, Eye, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { fetchFredData } from "@/lib/fred";

const urgencyConfig: Record<string, { label: string; color: string }> = {
  act_now: { label: "Act Now", color: "bg-destructive text-destructive-foreground" },
  this_month: { label: "This Month", color: "bg-orange-500 text-white" },
  watch: { label: "Watch", color: "bg-muted text-muted-foreground" },
};

export default function NegotiationCoach() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [marketSummary, setMarketSummary] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (user) loadOpportunities();
  }, [user]);

  const loadOpportunities = async () => {
    const { data } = await supabase
      .from("negotiation_opportunities")
      .select("*")
      .eq("user_id", user!.id)
      .eq("dismissed", false)
      .order("created_at", { ascending: false })
      .limit(10);
    setOpportunities(data || []);
  };

  const findOpportunities = async () => {
    setLoading(true);
    try {
      const metrics = await fetchFredData();
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
      const { data, error } = await supabase.functions.invoke("negotiation-coach", {
        body: { metrics, profile },
      });
      if (error) throw error;
      setMarketSummary(data.market_summary || "");

      for (const opp of data.opportunities || []) {
        await supabase.from("negotiation_opportunities").insert({
          user_id: user!.id,
          opportunity_type: opp.opportunity_type,
          title: opp.title,
          script: opp.script,
          macro_context: opp.macro_context,
        });
      }
      loadOpportunities();
    } catch (e: any) {
      toast({ title: "Search failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyScript = async (script: string, id: string) => {
    await navigator.clipboard.writeText(script);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: "Script copied!" });
  };

  const dismiss = async (id: string) => {
    await supabase.from("negotiation_opportunities").update({ dismissed: true }).eq("id", id);
    setOpportunities(prev => prev.filter(o => o.id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container max-w-4xl py-6 sm:py-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Handshake className="h-8 w-8 text-primary" />
            <h1 className="font-display text-3xl font-bold">Negotiation Coach</h1>
          </div>
          <p className="text-muted-foreground">When macro conditions are in your favor — and word-for-word scripts to act</p>
        </div>
        <Button onClick={findOpportunities} disabled={loading}>
          {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Searching...</> : "Find Opportunities"}
        </Button>
      </div>

      {marketSummary && (
        <Card className="mb-6 bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm">{marketSummary}</p>
          </CardContent>
        </Card>
      )}

      {opportunities.length > 0 ? (
        <div className="space-y-4">
          {opportunities.map((opp) => {
            const urgency = urgencyConfig[opp.urgency] || urgencyConfig.watch;
            const isExpanded = expandedId === opp.id;
            return (
              <motion.div key={opp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{opp.title}</CardTitle>
                      <Badge className={urgency?.color || ""}>{urgency?.label || "Watch"}</Badge>
                    </div>
                    <CardDescription>{opp.opportunity_type.replace(/_/g, " ")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{opp.macro_context}</p>
                    <Button variant="outline" size="sm" onClick={() => setExpandedId(isExpanded ? null : opp.id)}>
                      {isExpanded ? "Hide Script" : "Show Script"}
                    </Button>
                    {isExpanded && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                        <div className="relative rounded-lg bg-muted/50 p-4">
                          <Button
                            variant="ghost" size="sm"
                            className="absolute right-2 top-2"
                            onClick={() => copyScript(opp.script, opp.id)}
                          >
                            {copiedId === opp.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                          </Button>
                          <p className="text-sm whitespace-pre-wrap pr-10">{opp.script}</p>
                        </div>
                      </motion.div>
                    )}
                    <div className="flex justify-end">
                      <Button variant="ghost" size="sm" onClick={() => dismiss(opp.id)} className="text-xs text-muted-foreground">
                        Dismiss
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Handshake className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-medium mb-1">No opportunities found</p>
            <p className="text-sm text-muted-foreground">Click "Find Opportunities" to discover where macro conditions give you negotiating leverage.</p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
