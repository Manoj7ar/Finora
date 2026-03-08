import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { calculateImpact, type FredMetric, type ProfileData } from "@/lib/fred";

interface MetricCardProps {
  metric: FredMetric;
  profile: ProfileData | null;
  index: number;
}

export default function MetricCard({ metric, profile, index }: MetricCardProps) {
  const impact = profile ? calculateImpact(metric, profile) : null;

  const getTrend = (current: number | null, previous: number | null) => {
    if (current == null || previous == null) return <Minus className="h-4 w-4 text-muted-foreground" />;
    if (current > previous) return <TrendingUp className="h-4 w-4 text-destructive" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-primary" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Card className="group shadow-card transition-all hover:shadow-card-hover hover:scale-[1.01]">
        <CardContent className="p-4 sm:p-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground sm:text-xs">
              {metric.name}
            </span>
            <div className="flex items-center gap-2">
              {getTrend(metric.value, metric.previousValue)}
              <span className="inline-block h-2 w-2 rounded-full bg-secondary animate-pulse-live" />
            </div>
          </div>

          <p className="font-mono text-2xl font-bold text-foreground sm:text-3xl">
            {metric.value != null
              ? metric.unit === "%" ? `${metric.value.toFixed(2)}%` : metric.value.toFixed(1)
              : "—"}
          </p>

          {metric.history && metric.history.length > 2 && (
            <div className="my-3 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metric.history}>
                  <YAxis domain={["dataMin", "dataMax"]} hide />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {impact && (
            <p className="mt-2 font-mono text-sm font-semibold text-primary">
              {impact.dollarImpact}
            </p>
          )}

          <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {impact?.explanation || metric.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
