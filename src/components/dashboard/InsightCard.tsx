import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

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

  const severityConfig = {
    critical: { border: "border-l-destructive", badge: "bg-destructive text-destructive-foreground" },
    warning: { border: "border-l-warning", badge: "bg-warning text-warning-foreground" },
    healthy: { border: "border-l-primary", badge: "bg-accent text-accent-foreground" },
    default: { border: "border-l-primary", badge: "bg-primary text-primary-foreground" },
  };

  const config = severityConfig[insight.severity as keyof typeof severityConfig] || severityConfig.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={`shadow-card border-l-4 transition-shadow hover:shadow-card-hover ${config.border}`}>
        <CardContent className="p-4 sm:p-6">
          <div className="mb-3 flex flex-wrap items-center gap-2 sm:gap-3">
            <Badge className={config.badge}>
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
                className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:underline"
              >
                {expanded ? "Show less" : "Learn more"}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 overflow-hidden rounded-xl bg-background p-4 text-sm leading-relaxed text-muted-foreground"
                  >
                    {insight.lesson}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
