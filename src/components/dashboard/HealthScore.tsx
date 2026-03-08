import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { type ProfileData } from "@/lib/fred";

interface HealthScoreProps {
  profile: ProfileData | null;
  lessonsCompleted: number;
  goalsCount: number;
  metricsCount: number;
  insightsCount: number;
}

function getScoreBreakdown(profile: ProfileData | null, lessons: number, goals: number) {
  let score = 0;
  const factors: { label: string; points: number; max: number }[] = [];

  // Income score (0-20)
  const incomeMap: Record<string, number> = {
    "Under $25,000": 4, "$25,000 – $50,000": 8, "$50,000 – $75,000": 12,
    "$75,000 – $100,000": 16, "$100,000 – $150,000": 18, "$150,000+": 20,
  };
  const incPts = incomeMap[profile?.income_range || ""] || 0;
  factors.push({ label: "Income", points: incPts, max: 20 });
  score += incPts;

  // Savings score (0-25)
  const savingsMap: Record<string, number> = {
    "Under $1,000": 3, "$1,000 – $5,000": 8, "$5,000 – $15,000": 14,
    "$15,000 – $50,000": 19, "$50,000 – $100,000": 22, "$100,000+": 25,
  };
  const savPts = savingsMap[profile?.savings_range || ""] || 0;
  factors.push({ label: "Savings", points: savPts, max: 25 });
  score += savPts;

  // Low debt score (0-20)
  const debts = profile?.debt_types as Record<string, number> | null;
  const totalDebt = debts ? Object.values(debts).reduce((s, v) => s + (v || 0), 0) : 0;
  const debtPts = totalDebt === 0 ? 20 : totalDebt < 10000 ? 15 : totalDebt < 50000 ? 10 : totalDebt < 150000 ? 5 : 2;
  factors.push({ label: "Low Debt", points: debtPts, max: 20 });
  score += debtPts;

  // Investment score (0-15)
  const invMap: Record<string, number> = { none: 2, some: 10, heavy: 15 };
  const invPts = invMap[profile?.investment_level || ""] || 0;
  factors.push({ label: "Investing", points: invPts, max: 15 });
  score += invPts;

  // Engagement score (0-20)
  const engPts = Math.min(20, (lessons * 4) + (goals * 3));
  factors.push({ label: "Engagement", points: engPts, max: 20 });
  score += engPts;

  return { score: Math.min(100, score), factors };
}

function getScoreColor(score: number) {
  if (score >= 75) return { ring: "stroke-primary", label: "text-primary", badge: "Excellent" };
  if (score >= 50) return { ring: "stroke-[hsl(var(--warning))]", label: "text-[hsl(var(--warning))]", badge: "Good" };
  return { ring: "stroke-destructive", label: "text-destructive", badge: "Needs Work" };
}

export default function HealthScore({ profile, lessonsCompleted, goalsCount }: HealthScoreProps) {
  const { score, factors } = useMemo(
    () => getScoreBreakdown(profile, lessonsCompleted, goalsCount),
    [profile, lessonsCompleted, goalsCount]
  );
  const { ring, label, badge } = getScoreColor(score);

  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <Card className="shadow-card overflow-hidden">
        <CardContent className="flex flex-col items-center gap-5 p-6 sm:flex-row sm:gap-8">
          {/* Ring */}
          <div className="relative flex shrink-0 items-center justify-center">
            <svg width="132" height="132" className="-rotate-90">
              <circle cx="66" cy="66" r="54" fill="none" strokeWidth="10"
                className="stroke-muted/40" />
              <motion.circle
                cx="66" cy="66" r="54" fill="none" strokeWidth="10" strokeLinecap="round"
                className={ring}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                style={{ strokeDasharray: circumference }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <motion.span
                className={`font-mono text-3xl font-bold ${label}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {score}
              </motion.span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                / 100
              </span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="flex-1 space-y-2 w-full">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-foreground sm:text-lg">
                Financial Health
              </h3>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                score >= 75 ? "bg-primary/15 text-primary" :
                score >= 50 ? "bg-[hsl(var(--warning))]/15 text-[hsl(var(--warning))]" :
                "bg-destructive/15 text-destructive"
              }`}>
                {badge}
              </span>
            </div>
            <div className="space-y-1.5">
              {factors.map(({ label: fl, points, max }) => (
                <div key={fl} className="flex items-center gap-2 text-xs">
                  <span className="w-20 shrink-0 text-muted-foreground">{fl}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted/50">
                    <motion.div
                      className="h-full rounded-full bg-primary/70"
                      initial={{ width: 0 }}
                      animate={{ width: `${(points / max) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    />
                  </div>
                  <span className="w-10 text-right font-mono text-muted-foreground">
                    {points}/{max}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
