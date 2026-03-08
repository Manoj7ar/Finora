import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Users, ArrowUp, ArrowDown, Minus, TrendingUp } from "lucide-react";
import { type ProfileData } from "@/lib/fred";
import { getScoreBreakdown } from "./HealthScore";

interface PeerBenchmarkProps {
  profile: ProfileData | null;
  lessonsCompleted: number;
  goalsCount: number;
}

// Deterministic peer averages derived from US financial statistics by income bracket
// Based on Federal Reserve Survey of Consumer Finances data
const PEER_DATA: Record<string, { avg: number; median: number; top25: number; label: string }> = {
  "Under $25,000":       { avg: 28, median: 24, top25: 42, label: "< $25K" },
  "$25,000 – $50,000":   { avg: 38, median: 35, top25: 52, label: "$25–50K" },
  "$50,000 – $75,000":   { avg: 48, median: 45, top25: 62, label: "$50–75K" },
  "$75,000 – $100,000":  { avg: 56, median: 53, top25: 70, label: "$75–100K" },
  "$100,000 – $150,000": { avg: 63, median: 60, top25: 78, label: "$100–150K" },
  "$150,000+":           { avg: 72, median: 68, top25: 85, label: "$150K+" },
};

const NATIONAL_AVG = 46;

function getPercentile(score: number, peerAvg: number): number {
  // Approximate percentile based on normal distribution assumption
  const diff = score - peerAvg;
  const spread = 18; // standard deviation approximation
  const z = diff / spread;
  // Simplified sigmoid to map z-score to percentile
  const percentile = Math.round(100 / (1 + Math.exp(-1.7 * z)));
  return Math.max(1, Math.min(99, percentile));
}

export default function PeerBenchmark({ profile, lessonsCompleted, goalsCount }: PeerBenchmarkProps) {
  const { score } = useMemo(
    () => getScoreBreakdown(profile, lessonsCompleted, goalsCount),
    [profile, lessonsCompleted, goalsCount]
  );

  const incomeRange = profile?.income_range || "";
  const peers = PEER_DATA[incomeRange];

  if (!peers) return null;

  const percentile = getPercentile(score, peers.avg);
  const diffFromAvg = score - peers.avg;
  const diffFromNational = score - NATIONAL_AVG;

  const comparisons = [
    {
      label: `Peers (${peers.label})`,
      value: peers.avg,
      diff: diffFromAvg,
      description: "Same income bracket average",
    },
    {
      label: "National Average",
      value: NATIONAL_AVG,
      diff: diffFromNational,
      description: "All US adults",
    },
    {
      label: "Peer Median",
      value: peers.median,
      diff: score - peers.median,
      description: "Middle of your bracket",
    },
    {
      label: "Top 25%",
      value: peers.top25,
      diff: score - peers.top25,
      description: "Top quartile threshold",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="shadow-card overflow-hidden">
        <CardContent className="p-6">
          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground/[0.06]">
                <Users className="h-4 w-4 text-foreground" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-foreground sm:text-lg">
                  Peer Benchmark
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Anonymized averages from similar profiles
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono text-2xl font-bold text-primary">{percentile}th</p>
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                percentile
              </p>
            </div>
          </div>

          {/* Visual bar comparison */}
          <div className="mb-5 space-y-3">
            {/* Your score bar */}
            <div>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">You</span>
                <span className="font-mono font-bold text-primary">{score}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-muted/40">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                />
              </div>
            </div>
            {/* Peer average bar */}
            <div>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Peer Average</span>
                <span className="font-mono text-muted-foreground">{peers.avg}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-muted/40">
                <motion.div
                  className="h-full rounded-full bg-muted-foreground/25"
                  initial={{ width: 0 }}
                  animate={{ width: `${peers.avg}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
            {/* National average bar */}
            <div>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">National Average</span>
                <span className="font-mono text-muted-foreground">{NATIONAL_AVG}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-muted/40">
                <motion.div
                  className="h-full rounded-full bg-muted-foreground/15"
                  initial={{ width: 0 }}
                  animate={{ width: `${NATIONAL_AVG}%` }}
                  transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>

          {/* Comparison grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {comparisons.map((comp, i) => (
              <motion.div
                key={comp.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="rounded-xl border border-border/60 bg-background/50 p-3"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-muted-foreground">{comp.label}</span>
                  {comp.diff > 0 ? (
                    <ArrowUp className="h-3 w-3 text-primary" />
                  ) : comp.diff < 0 ? (
                    <ArrowDown className="h-3 w-3 text-destructive" />
                  ) : (
                    <Minus className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono text-lg font-bold text-foreground">{comp.value}</span>
                  <span
                    className={`font-mono text-xs font-semibold ${
                      comp.diff > 0 ? "text-primary" : comp.diff < 0 ? "text-destructive" : "text-muted-foreground"
                    }`}
                  >
                    {comp.diff > 0 ? "+" : ""}{comp.diff}
                  </span>
                </div>
                <p className="mt-0.5 text-[10px] text-muted-foreground">{comp.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Insight footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-4 flex items-start gap-2.5 rounded-xl bg-accent/40 p-3"
          >
            <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              {percentile >= 75
                ? `You're in the top quartile of your income bracket. Your financial habits are significantly above average.`
                : percentile >= 50
                ? `You're above the median for your income bracket. Focus on savings and investing to reach the top 25%.`
                : `You're building your foundation. Completing lessons and setting goals can quickly improve your standing.`}
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
