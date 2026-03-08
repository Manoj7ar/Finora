import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Sparkles, BookOpen, Zap, Target } from "lucide-react";
import { motion } from "framer-motion";

interface QuickStatsProps {
  metricsCount: number;
  insightsCount: number;
  lessonsCompleted: number;
  goalsCount?: number;
}

export default function QuickStats({ metricsCount, insightsCount, lessonsCompleted, goalsCount = 0 }: QuickStatsProps) {
  const navigate = useNavigate();

  const stats = [
    { icon: TrendingUp, label: "Indicators", value: metricsCount || "—", color: "bg-foreground/[0.06]", onClick: undefined },
    { icon: Sparkles, label: "AI Insights", value: insightsCount || "—", color: "bg-foreground/[0.06]", onClick: undefined },
    { icon: BookOpen, label: "Lessons", value: `${lessonsCompleted}/4`, color: "bg-foreground/[0.06]", onClick: () => navigate("/education") },
    { icon: Target, label: "Goals", value: goalsCount || "—", color: "bg-foreground/[0.06]", onClick: () => navigate("/goals") },
  ];

  return (
    <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
      {stats.map(({ icon: Icon, label, value, color, onClick }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
        >
          <Card
            className={`shadow-card transition-all hover:shadow-card-hover ${onClick ? "cursor-pointer hover:scale-[1.02]" : ""}`}
            onClick={onClick}
          >
            <CardContent className="flex items-center gap-3 p-3 sm:p-4">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${color}`}>
                <Icon className="h-4 w-4 text-foreground" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs text-muted-foreground">{label}</p>
                <p className="font-mono text-lg font-bold text-foreground">{value}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: stats.length * 0.06 }}
      >
        <Card
          className="shadow-card cursor-pointer transition-all hover:shadow-card-hover hover:scale-[1.02]"
          onClick={() => navigate("/simulation")}
        >
          <CardContent className="flex items-center gap-3 p-3 sm:p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs text-muted-foreground">Crisis Sim</p>
              <p className="text-xs font-medium text-primary">Run now →</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
