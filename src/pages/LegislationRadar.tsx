import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollText, Loader2, AlertTriangle, AlertCircle, Info, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const severityConfig: Record<string, { icon: any; color: string; variant: "default" | "destructive" | "secondary" | "outline" }> = {
  critical: { icon: AlertTriangle, color: "text-destructive", variant: "destructive" },
  warning: { icon: AlertCircle, color: "text-orange-500", variant: "default" },
  info: { icon: Info, color: "text-blue-500", variant: "secondary" },
};

export default function LegislationRadar() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [outlook, setOutlook] = useState("");

  useEffect(() => {
    if (user) loadAlerts();
  }, [user]);

  const loadAlerts = async () => {
    const { data } = await supabase
      .from("legislation_alerts")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(20);
    setAlerts(data || []);
  };

  const scanLegislation = async () => {
    setLoading(true);
    try {
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
      const { data, error } = await supabase.functions.invoke("legislation-radar", {
        body: { profile },
      });
      if (error) throw error;
      setOutlook(data.overall_outlook || "");

      for (const alert of data.alerts || []) {
        await supabase.from("legislation_alerts").insert({
          user_id: user!.id,
          bill_name: alert.bill_name,
          summary: alert.summary,
          personal_impact: alert.personal_impact,
          severity: alert.severity,
        });
      }
      loadAlerts();
    } catch (e: any) {
      toast({ title: "Scan failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id: string) => {
    await supabase.from("legislation_alerts").update({ read: true }).eq("id", id);
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container max-w-4xl py-6 sm:py-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <ScrollText className="h-8 w-8 text-primary" />
            <h1 className="font-display text-3xl font-bold">Legislation Radar</h1>
          </div>
          <p className="text-muted-foreground">How new laws and proposals impact YOUR finances</p>
        </div>
        <Button onClick={scanLegislation} disabled={loading}>
          {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Scanning...</> : "Scan for Legislation"}
        </Button>
      </div>

      {outlook && (
        <Card className="mb-6 bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm">{outlook}</p>
          </CardContent>
        </Card>
      )}

      {alerts.length > 0 ? (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const cfg = severityConfig[alert.severity] || severityConfig.info;
            const SevIcon = cfg.icon;
            return (
              <motion.div key={alert.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className={alert.read ? "opacity-70" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <SevIcon className={`h-5 w-5 ${cfg.color}`} />
                        {alert.bill_name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={cfg.variant}>{alert.severity}</Badge>
                        {!alert.read && (
                          <Button variant="ghost" size="sm" onClick={() => markRead(alert.id)}>
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">{alert.summary}</p>
                    <div className="rounded-lg bg-primary/5 p-3">
                      <p className="text-sm font-medium">Impact on You</p>
                      <p className="text-sm text-muted-foreground mt-1">{alert.personal_impact}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{new Date(alert.created_at).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <ScrollText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-medium mb-1">No alerts yet</p>
            <p className="text-sm text-muted-foreground">Click "Scan for Legislation" to check for laws that affect your finances.</p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
