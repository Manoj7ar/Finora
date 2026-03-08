import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="-mt-20 bg-background">
      <div className="container flex min-h-screen items-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl space-y-8 py-32 text-center"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm font-medium uppercase tracking-[0.25em] text-primary"
          >
            Macro Intelligence for Everyone
          </motion.p>

          <h1 className="font-display text-5xl font-bold leading-[1.08] text-foreground md:text-6xl lg:text-7xl">
            The economy is moving.
            <span className="mt-2 block text-primary">
              See what it means for you.
            </span>
          </h1>

          <p className="mx-auto max-w-lg text-lg leading-relaxed text-muted-foreground">
            Finora connects real-time economic data to your personal finances —
            so you always know what's changing and what to do about it.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link to="/auth">
              <Button
                size="lg"
                className="gap-2 rounded-xl bg-primary px-8 text-base text-primary-foreground shadow-lg transition-all hover:bg-finora-green-hover hover:shadow-xl"
              >
                Start Free — 60 Seconds <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <span className="text-sm text-muted-foreground">
              No credit card required
            </span>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mx-auto flex max-w-md justify-center gap-12 border-t border-border/60 pt-8"
          >
            {[
              { value: "6", label: "Live Indicators" },
              { value: "60s", label: "Setup Time" },
              { value: "AI", label: "Powered Insights" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-mono text-2xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
