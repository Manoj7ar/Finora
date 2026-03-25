import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Brain, CloudLightning, Users, ArrowRight, Sun, Cloud, CloudRain, Zap as Storm, AlertTriangle } from "lucide-react";

const weatherIcons: Record<string, React.ReactNode> = {
  sunny: <Sun className="h-8 w-8 text-yellow-500" />,
  partly_cloudy: <Cloud className="h-8 w-8 text-blue-400" />,
  cloudy: <Cloud className="h-8 w-8 text-muted-foreground" />,
  stormy: <CloudRain className="h-8 w-8 text-destructive" />,
  hurricane: <Storm className="h-8 w-8 text-destructive" />,
};

const cardMeta = [
  { title: "Bias Mirror", icon: Brain, to: "/bias-mirror", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/10" },
  { title: "Economic Weather", icon: CloudLightning, to: "/weather", color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-500/10" },
  { title: "Community Map", icon: Users, to: "/community", color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-500/10" },
];

export default function AIHub() {
  const { user } = useAuth();
  const [data, setData] = useState<Record<string, React.ReactNode>>({});

  useEffect(() => {
    if (!user) return;
    const uid = user.id;

    Promise.allSettled([
      supabase.from("cognitive_bias_events").select("id", { count: "exact", head: true }).eq("user_id", uid),
      supabase.from("economic_forecasts").select("outlook, summary").eq("user_id", uid).order("created_at", { ascending: false }).limit(1).single(),
      supabase.from("community_scores").select("resilience_score").eq("user_id", uid).single(),
    ]).then(([biasRes, weatherRes, comRes]) => {
      const d: Record<string, React.ReactNode> = {};
      const val = (r: any) => r.status === "fulfilled" ? r.value : null;

      const biasCount = val(biasRes)?.count ?? 0;
      d["/bias-mirror"] = biasCount > 0
        ? <><span className="font-mono text-2xl font-bold text-foreground">{biasCount}</span><span className="text-sm text-muted-foreground ml-2">events tracked</span></>
        : <span className="text-sm text-muted-foreground">Interact with features to build data</span>;

      const w = val(weatherRes)?.data;
      d["/weather"] = w
        ? <div className="flex items-center gap-3">{weatherIcons[w.outlook] || <Cloud className="h-8 w-8" />}<span className="text-sm leading-snug line-clamp-2">{w.summary}</span></div>
        : <span className="text-sm text-muted-foreground">Generate your first forecast →</span>;

      const comScore = val(comRes)?.data?.resilience_score;
      d["/community"] = comScore != null
        ? <><span className="font-mono text-2xl font-bold text-foreground">{comScore}</span><span className="text-sm text-muted-foreground ml-2">resilience score</span></>
        : <span className="text-sm text-muted-foreground">See where you stand →</span>;

      setData(d);
    });
  }, [user]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="container max-w-5xl py-6 sm:py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">AI Command Center</h1>
        </div>
        <p className="text-muted-foreground">All your AI-powered financial intelligence at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {cardMeta.map((card, i) => (
          <motion.div
            key={card.to}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link to={card.to} className="block group">
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-primary/20">
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <div className={`rounded-xl p-2.5 ${card.bg}`}>
                    <card.icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                  <CardTitle className="text-base font-semibold">{card.title}</CardTitle>
                  <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-1 flex-wrap">{data[card.to] || <span className="text-sm text-muted-foreground">Loading…</span>}</div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
