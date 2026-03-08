import { motion } from "framer-motion";
import { useState } from "react";
import { User, BarChart3, Lightbulb, ChevronRight } from "lucide-react";

const steps = [
  {
    icon: User,
    number: "01",
    title: "Tell Us About You",
    description: "Five quick questions about your income, debts, savings, and investments.",
    detail: "60 seconds to calibrate your personal economic model",
    visual: "profile",
  },
  {
    icon: BarChart3,
    number: "02",
    title: "See Your Vitals",
    description: "Live economic data translated into your personal dollar impact.",
    detail: "Fed rate changes show exactly how much more you'll pay",
    visual: "dashboard",
  },
  {
    icon: Lightbulb,
    number: "03",
    title: "Learn & Prepare",
    description: "AI insights, crisis simulations, and lessons built around your numbers.",
    detail: "Run your finances through 2008 or COVID scenarios",
    visual: "insights",
  },
];

// Mini visual preview for each step
const StepVisual = ({ type, isActive }: { type: string; isActive: boolean }) => {
  if (type === "profile") {
    return (
      <div className="space-y-2">
        {["Income", "Savings", "Location"].map((label, i) => (
          <motion.div
            key={label}
            initial={{ width: "0%" }}
            animate={{ width: isActive ? "100%" : "0%" }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <span className="text-[10px] text-muted-foreground w-12">{label}</span>
            <div className="flex-1 h-2 bg-border/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: isActive ? `${60 + i * 15}%` : "0%" }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
              />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "dashboard") {
    return (
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Fed Rate", value: "5.25%", color: "primary" },
          { label: "Impact", value: "-$127", color: "destructive" },
          { label: "Score", value: "78", color: "secondary" },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.8 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className="text-center p-2 rounded-lg bg-background/50"
          >
            <p className="text-[10px] text-muted-foreground">{item.label}</p>
            <p className={`font-mono text-sm font-bold ${
              item.color === "primary" ? "text-primary" :
              item.color === "destructive" ? "text-destructive" :
              "text-secondary"
            }`}>
              {item.value}
            </p>
          </motion.div>
        ))}
      </div>
    );
  }

  // insights
  return (
    <div className="space-y-2">
      {["AI Insight ready", "Crisis sim complete", "3 actions suggested"].map((text, i) => (
        <motion.div
          key={text}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -10 }}
          transition={{ delay: i * 0.15, duration: 0.3 }}
          className="flex items-center gap-2 text-[11px]"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: isActive ? 1 : 0 }}
            transition={{ delay: i * 0.15 + 0.1 }}
            className="h-1.5 w-1.5 rounded-full bg-primary"
          />
          <span className="text-muted-foreground">{text}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default function HowItWorksTimeline() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <section className="relative bg-background py-24 sm:py-32 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/50 via-transparent to-card/50" />
      
      <div className="container relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 sm:mb-20"
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <span className="inline-block mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                How It Works
              </span>
              <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl">
                Three steps to
                <span className="block mt-1 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  clarity
                </span>
              </h2>
            </div>
            <p className="max-w-sm text-muted-foreground leading-relaxed">
              From sign-up to personalized economic intelligence in under 2 minutes.
            </p>
          </div>
        </motion.div>

        {/* Steps - horizontal cards */}
        <div className="grid gap-6 lg:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              onMouseEnter={() => setActiveStep(i)}
              onMouseLeave={() => setActiveStep(null)}
              className="group relative"
            >
              <div className={`
                relative h-full rounded-2xl border border-border/50 
                bg-gradient-to-br from-card to-card/50 
                p-6 sm:p-8 transition-all duration-500
                hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10
                ${activeStep === i ? "scale-[1.02]" : ""}
              `}>
                {/* Large background number */}
                <div className="absolute top-4 right-4 font-mono text-[120px] font-bold leading-none text-primary/[0.04] select-none pointer-events-none transition-all duration-500 group-hover:text-primary/[0.08]">
                  {step.number}
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon + Number row */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 transition-all duration-300 group-hover:from-primary/20 group-hover:to-primary/10 group-hover:border-primary/20">
                      <step.icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
                    </div>
                    <span className="font-mono text-sm font-semibold text-primary/60 tracking-wider">
                      STEP {step.number}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-2xl font-semibold text-foreground mb-3 sm:text-3xl">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {step.description}
                  </p>

                  {/* Mini visual preview */}
                  <div className="rounded-xl bg-muted/30 border border-border/30 p-4 mb-4 min-h-[80px]">
                    <StepVisual type={step.visual} isActive={activeStep === i} />
                  </div>

                  {/* Detail with arrow */}
                  <div className="flex items-center gap-2 text-sm text-primary font-medium">
                    <span>{step.detail}</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>

                {/* Bottom gradient line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-gradient-to-r from-transparent via-primary/0 to-transparent transition-all duration-500 group-hover:via-primary/50" />
              </div>

              {/* Connecting arrow (visible on lg+) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 h-8 w-6 items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0.3 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-border"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA hint */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Ready in <span className="font-mono font-semibold text-foreground">60 seconds</span> — no credit card required
          </p>
        </motion.div>
      </div>
    </section>
  );
}
