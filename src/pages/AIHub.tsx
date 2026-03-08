import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain, CloudLightning, Crosshair, User, Mic, ScrollText, Handshake, Users,
  ArrowRight, Sun, Cloud, CloudRain, Zap as Storm, AlertTriangle
} from "lucide-react";

const weatherIcons: Record<string, React.ReactNode> = {
  sunny: <Sun className="h-8 w-8 text-yellow-500" />,
  partly_cloudy: <Cloud className="h-8 w-8 text-blue-400" />,
  cloudy: <Cloud className="h-8 w-8 text-muted-foreground" />,
  stormy: <CloudRain className="h-8 w-8 text-destructive" />,
  hurricane: <Storm className="h-8 w-8 text-destructive" />,
};

export default function AIHub() {
  const { user } = useAuth();
  const [biasCount, setBiasCount] = useState<number | null>(null);
  const [weather, setWeather] = useState<{ outlook: string; summary: string } | null>(null);
  const [ecoIQ, setEcoIQ] = useState<{ avg: number; count: number } | null>(null);
  const [twin, setTwin] = useState<{ key_insight: string; snapshot_date: string } | null>(null);
  const [briefing, setBriefing] = useState<string | null>(null);
  const [legislation, setLegislation] = useState<number>(0);
  const [negotiations, setNegotiations] = useState<number>(0);
  const [community, setCommunity] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    const uid = user.id;

    // Fetch all summaries in parallel
    Promise.allSettled([
      supabase.from("cognitive_bias_events").select("id", { count: "exact", head: true }).eq("user_id", uid),
      supabase.from("economic_forecasts").select("outlook, summary").eq("user_id", uid).order("created_at", { ascending: false }).limit(1).single(),
      supabase.from("fed_predictions").select("score").eq("user_id", uid).not("score", "is", null),
      supabase.from("financial_twin_snapshots").select("key_insight, snapshot_date").eq("user_id", uid).order("created_at", { ascending: false }).limit(1).single(),
      supabase.from("economic_forecasts").select("details").eq("user_id", uid).order("created_at", { ascending: false }).limit(1).single(),
      supabase.from("legislation_alerts").select("id", { count: "exact", head: true }).eq("user_id", uid).eq("read", false),
      supabase.from("negotiation_opportunities").select("id", { count: "exact", head: true }).eq("user_id", uid).eq("dismissed", false),
      supabase.from("community_scores").select("resilience_score").eq("user_id", uid).single(),
    ]).then(([biasRes, weatherRes, fedRes, twinRes, briefRes, legRes, negRes, comRes]) => {
      if (biasRes.status === "fulfilled") setBiasCount((biasRes.value as any).count ?? 0);
      if (weatherRes.status === "fulfilled" && (weatherRes.value as any).data) {
        const d = (weatherRes.value as any).data;
        setWeather({ outlook: d.outlook, summary: d.summary });
      }
      if (fedRes.status === "fulfilled" && (fedRes.value as any).data) {
        const scores = (fedRes.value as any).data as { score: number }[];
        if (scores.length > 0) {
          const avg = Math.round(scores.reduce((s, p) => s + p.score, 0) / scores.length);
          setEcoIQ({ avg, count: scores.length });
        }
      }
      if (twinRes.status === "fulfilled" && (twinRes.value as any).data) {
        const d = (twinRes.value as any).data;
        setTwin({ key_insight: d.key_insight, snapshot_date: d.snapshot_date });
      }
      if (briefRes.status === "fulfilled" && (briefRes.value as any).data) {
        const details = (briefRes.value as any).data.details;
        if (details && typeof details === "object" && "full_script" in details) {
          setBriefing((details as any).full_script?.slice(0, 120) + "…");
        }
      }
      if (legRes.status === "fulfilled") setLegislation((legRes.value as any).count ?? 0);
      if (negRes.status === "fulfilled") setNegotiations((negRes.value as any).count ?? 0);
      if (comRes.status === "fulfilled" && (comRes.value as any).data) {
        setCommunity((comRes.value as any).data.resilience_score);
      }
    });
  }, [user]);

  const cards = [
    {
      title: "Bias Mirror",
      icon: Brain,
      to: "/bias-mirror",
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/30",
      content: biasCount !== null
        ? <><span className="font-display text-3xl font-bold">{biasCount}</span><span className="text-sm text-muted-foreground ml-2">bias events tracked</span></>
        : <span className="text-sm text-muted-foreground">No data yet — interact with lessons & simulations</span>,
    },
    {
      title: "Economic Weather",
      icon: CloudLightning,
      to: "/weather",
      color: "text-sky-600 dark:text-sky-400",
      bg: "bg-sky-50 dark:bg-sky-950/30",
      content: weather
        ? <div className="flex items-center gap-3">{weatherIcons[weather.outlook] || <Cloud className="h-8 w-8" />}<span className="text-sm leading-snug">{weather.summary.slice(0, 100)}…</span></div>
        : <span className="text-sm text-muted-foreground">Generate your first forecast →</span>,
    },
    {
      title: "Economic IQ",
      icon: Crosshair,
      to: "/predict",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/30",
      content: ecoIQ
        ? <><span className="font-display text-3xl font-bold">{ecoIQ.avg}</span><span className="text-sm text-muted-foreground ml-2">avg score ({ecoIQ.count} predictions)</span></>
        : <span className="text-sm text-muted-foreground">Make your first prediction →</span>,
    },
    {
      title: "Financial Twin",
      icon: User,
      to: "/twin",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      content: twin
        ? <span className="text-sm leading-snug">{twin.key_insight.slice(0, 120)}…</span>
        : <span className="text-sm text-muted-foreground">Generate your digital twin →</span>,
    },
    {
      title: "Morning Briefing",
      icon: Mic,
      to: "/briefing",
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-950/30",
      content: briefing
        ? <span className="text-sm leading-snug italic">"{briefing}"</span>
        : <span className="text-sm text-muted-foreground">Get today's briefing →</span>,
    },
    {
      title: "Legislation Radar",
      icon: ScrollText,
      to: "/legislation",
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-950/30",
      content: legislation > 0
        ? <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" /><span className="font-display text-2xl font-bold">{legislation}</span><span className="text-sm text-muted-foreground">unread alerts</span></div>
        : <span className="text-sm text-muted-foreground">Scan for legislation impacts →</span>,
    },
    {
      title: "Negotiation Coach",
      icon: Handshake,
      to: "/negotiate",
      color: "text-teal-600 dark:text-teal-400",
      bg: "bg-teal-50 dark:bg-teal-950/30",
      content: negotiations > 0
        ? <><span className="font-display text-3xl font-bold">{negotiations}</span><span className="text-sm text-muted-foreground ml-2">active opportunities</span></>
        : <span className="text-sm text-muted-foreground">Find negotiation leverage →</span>,
    },
    {
      title: "Community Map",
      icon: Users,
      to: "/community",
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-950/30",
      content: community !== null
        ? <><span className="font-display text-3xl font-bold">{community}</span><span className="text-sm text-muted-foreground ml-2">resilience score</span></>
        : <span className="text-sm text-muted-foreground">See where you stand →</span>,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="container max-w-5xl py-6 sm:py-8"
    >
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">AI Command Center</h1>
        <p className="mt-2 text-muted-foreground">All your AI-powered financial intelligence at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card, i) => (
          <motion.div
            key={card.to}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link to={card.to} className="block group">
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/20">
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <div className={`rounded-xl p-2.5 ${card.bg}`}>
                    <card.icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                  <CardTitle className="text-base font-semibold">{card.title}</CardTitle>
                  <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-1 flex-wrap">{card.content}</div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
