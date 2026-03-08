import { motion } from "framer-motion";
import { TrendingUp, Brain, Zap, Target } from "lucide-react";

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6 },
});

const features = [
  {
    icon: TrendingUp,
    title: "Live Economic Data",
    description:
      "Track Fed rates, inflation, unemployment, and treasury yields — each translated into your personal dollar impact.",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description:
      "Receive personalised alerts when the economy moves, explaining what it means for your wallet and what to do.",
  },
  {
    icon: Zap,
    title: "Crisis Simulations",
    description:
      "Run your finances through historical crises like 2008 or COVID to see how you'd be affected.",
  },
  {
    icon: Target,
    title: "Goal Tracking",
    description:
      "Set financial goals and receive AI nudges that adapt to changing economic conditions.",
  },
];

export default function FeaturesGrid() {
  return (
    <section className="border-y border-border bg-card">
      <div className="container py-20 sm:py-24 lg:py-28">
        <motion.div {...fadeIn()} className="mb-12 text-center sm:mb-16">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            What You Get
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
            Everything in one place
          </h2>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:gap-10">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              {...fadeIn(i * 0.1)}
              className="group rounded-2xl border border-border bg-background p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
            >
              <div className="mb-5 inline-flex rounded-xl bg-foreground/[0.06] p-3">
                <feature.icon className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="mb-3 font-display text-xl font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
