import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6 },
});

export default function CTASection() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-background">
      {/* Subtle background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-primary/[0.03] blur-3xl" />
        <div className="absolute -left-40 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-secondary/[0.04] blur-3xl" />
      </div>

      <div className="container relative py-24 sm:py-28 lg:py-36">
        <motion.div {...fadeIn()} className="mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Free to use</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            Ready to understand your economy?
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            Set up your financial profile in 60 seconds. Finora does the rest —
            live data, AI insights, and crisis preparedness.
          </p>
          <motion.div {...fadeIn(0.15)} className="mt-10 flex flex-col items-center gap-3">
            <Link to="/auth">
              <Button
                size="lg"
                className="gap-2 rounded-xl bg-primary px-10 text-base shadow-lg transition-all hover:bg-finora-green-hover hover:shadow-xl hover:scale-[1.02] sm:text-lg"
              >
                Get Started Free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground">No credit card · No spam · Just clarity</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
