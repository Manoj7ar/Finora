import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { User, BarChart3, Lightbulb } from "lucide-react";

const steps = [
  {
    icon: User,
    number: "01",
    title: "Tell Us About You",
    description: "Answer five quick questions about your income, debts, savings, location, and investments. Takes 60 seconds.",
    detail: "We use this to calibrate your personal economic impact model.",
  },
  {
    icon: BarChart3,
    number: "02",
    title: "See Your Vitals",
    description: "Your dashboard lights up with live economic data — each indicator translated into your personal dollar impact.",
    detail: "Fed rate changes? We'll show you exactly how much more or less you'll pay on debt.",
  },
  {
    icon: Lightbulb,
    number: "03",
    title: "Learn & Prepare",
    description: "AI-generated insights, crisis simulations, and lessons — all built around your actual numbers.",
    detail: "Run your finances through historical crises. Get personalized action plans.",
  },
];

export default function HowItWorksTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="relative bg-card/50 py-24 sm:py-32 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      
      <div className="container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <span className="inline-block mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            How It Works
          </span>
          <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl md:text-6xl">
            Three steps to
            <span className="block mt-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              financial clarity
            </span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Animated connecting line */}
          <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-px bg-border/50 sm:-translate-x-px">
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary via-secondary to-primary"
              style={{ height: lineHeight }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-16 sm:space-y-24">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className={`relative flex flex-col sm:flex-row items-start gap-6 sm:gap-12 ${
                  i % 2 === 1 ? "sm:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline dot */}
                <motion.div
                  whileInView={{ scale: [0, 1.2, 1] }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.3 }}
                  className="absolute left-8 sm:left-1/2 -translate-x-1/2 flex h-16 w-16 items-center justify-center rounded-full border-4 border-background bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/20 z-10"
                >
                  <step.icon className="h-7 w-7 text-primary-foreground" strokeWidth={1.5} />
                </motion.div>

                {/* Content card */}
                <div className={`ml-24 sm:ml-0 sm:w-[calc(50%-4rem)] ${i % 2 === 1 ? "sm:text-right" : ""}`}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="group rounded-2xl border border-border/50 bg-background/80 backdrop-blur-sm p-6 sm:p-8 transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
                  >
                    {/* Step number */}
                    <span className="inline-block font-mono text-4xl font-bold text-primary/20 mb-4">
                      {step.number}
                    </span>
                    
                    <h3 className="font-display text-2xl font-semibold text-foreground mb-3 sm:text-3xl">
                      {step.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {step.description}
                    </p>
                    
                    <p className="text-sm text-muted-foreground/70 border-t border-border/50 pt-4">
                      {step.detail}
                    </p>
                  </motion.div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden sm:block sm:w-[calc(50%-4rem)]" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
