import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const metrics = [
  { label: "Fed Funds Rate", base: 5.33, unit: "%", color: "hsl(var(--primary))" },
  { label: "CPI Inflation", base: 3.2, unit: "%", color: "hsl(var(--warning))" },
  { label: "10Y Treasury", base: 4.25, unit: "%", color: "hsl(var(--secondary))" },
  { label: "Unemployment", base: 3.9, unit: "%", color: "hsl(var(--destructive))" },
  { label: "Housing Index", base: 312.4, unit: "", color: "hsl(var(--accent))" },
  { label: "CC Delinquency", base: 2.98, unit: "%", color: "hsl(var(--primary))" },
];

function generateSparkline(points = 12): number[] {
  const data: number[] = [];
  let val = 40 + Math.random() * 20;
  for (let i = 0; i < points; i++) {
    val += (Math.random() - 0.48) * 8;
    val = Math.max(10, Math.min(70, val));
    data.push(val);
  }
  return data;
}

function SparklineSVG({ data, color }: { data: number[]; color: string }) {
  const w = 80, h = 32;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / 80) * h}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AnimatedNumber({ value, decimals = 2 }: { value: number; decimals?: number }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const start = display;
    const diff = value - start;
    const duration = 600;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + diff * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <span>{display.toFixed(decimals)}</span>;
}

export default function HeroDashboardPreview() {
  const [values, setValues] = useState(() => metrics.map((m) => m.base));
  const [sparklines] = useState(() => metrics.map(() => generateSparkline()));

  useEffect(() => {
    const interval = setInterval(() => {
      setValues((prev) =>
        prev.map((v, i) => {
          const jitter = metrics[i].base > 100
            ? (Math.random() - 0.5) * 1.2
            : (Math.random() - 0.5) * 0.06;
          return +(v + jitter).toFixed(metrics[i].base > 100 ? 1 : 2);
        })
      );
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
      className="mx-auto mt-16 max-w-3xl"
    >
      <div className="relative rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-[var(--shadow-card)]">
        {/* Top bar */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse-live" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Live Economic Vitals
            </span>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground/50">
            Updated just now
          </span>
        </div>

        {/* Metric grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.08, duration: 0.5 }}
              className="rounded-lg border border-border bg-background p-3"
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1 truncate">
                {m.label}
              </p>
              <div className="flex items-end justify-between gap-2">
                <p className="font-mono text-lg font-bold text-foreground leading-none tabular-nums">
                  <AnimatedNumber
                    value={values[i]}
                    decimals={m.base > 100 ? 1 : 2}
                  />
                  <span className="text-xs font-normal text-muted-foreground ml-0.5">{m.unit}</span>
                </p>
                <SparklineSVG data={sparklines[i]} color={m.color} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom insight bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-4 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2"
        >
          <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
          <p className="font-mono text-[10px] text-foreground/70 truncate">
            AI Insight: Current rate environment suggests reviewing variable-rate debt exposure
          </p>
        </motion.div>

        {/* Decorative glow */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
}
