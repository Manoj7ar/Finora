import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface InsightData {
  severity: string;
  headline: string;
  dollarImpact?: string;
  summary: string;
  lesson?: string;
}

interface InsightCardProps {
  insight: InsightData;
  index: number;
}

export default function InsightCard({ insight, index }: InsightCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card
        className={`shadow-card border-l-4 ${
          insight.severity === "critical"
            ? "border-l-destructive"
            : insight.severity === "warning"
            ? "border-l-warning"
            : "border-l-primary"
        }`}
      >
        <CardContent className="p-4 sm:p-6">
          <div className="mb-3 flex flex-wrap items-center gap-2 sm:gap-3">
            <Badge
              variant={insight.severity === "critical" ? "destructive" : "default"}
              className={
                insight.severity === "warning"
                  ? "bg-warning text-warning-foreground"
                  : insight.severity === "healthy"
                  ? "bg-accent text-accent-foreground"
                  : ""
              }
            >
              {insight.severity}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString()} · Live data
            </span>
          </div>

          <h3 className="mb-2 font-display text-base font-semibold text-foreground sm:text-lg">
            {insight.headline}
          </h3>

          {insight.dollarImpact && (
            <p className="mb-3 font-mono text-xl font-bold text-primary sm:text-2xl">
              {insight.dollarImpact}
            </p>
          )}

          <p className="text-sm leading-relaxed text-muted-foreground">
            {insight.summary}
          </p>

          {insight.lesson && (
            <div className="mt-4">
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-sm font-medium text-primary hover:underline"
              >
                {expanded ? "Show less" : "Learn more →"}
              </button>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 rounded-md bg-background p-4 text-sm leading-relaxed text-muted-foreground"
                >
                  {insight.lesson}
                </motion.div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
