import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Sparkles, BookOpen, Zap } from "lucide-react";

interface QuickStatsProps {
  metricsCount: number;
  insightsCount: number;
  lessonsCompleted: number;
}

export default function QuickStats({ metricsCount, insightsCount, lessonsCompleted }: QuickStatsProps) {
  const navigate = useNavigate();

  const stats = [
    { icon: TrendingUp, label: "Indicators", value: metricsCount || "—" },
    { icon: Sparkles, label: "AI Insights", value: insightsCount || "—" },
    { icon: BookOpen, label: "Lessons", value: `${lessonsCompleted}/4` },
  ];

  return (
    <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      {stats.map(({ icon: Icon, label, value }) => (
        <Card key={label} className="shadow-card">
          <CardContent className="flex items-center gap-3 p-3 sm:p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs text-muted-foreground">{label}</p>
              <p className="font-mono text-lg font-bold text-foreground">{value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
      <Card
        className="shadow-card cursor-pointer transition-shadow hover:shadow-card-hover"
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
    </div>
  );
}
