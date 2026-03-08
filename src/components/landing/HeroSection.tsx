import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import heroImg from "@/assets/hero-illustration.jpg";

export default function HeroSection() {
  return (
    <section className="-mt-20 relative overflow-hidden bg-background">
      {/* Full-width hero image */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Renaissance observatory with celestial globe showing economic data"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      </div>

      <div className="container relative flex min-h-screen items-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl space-y-8 py-32"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="font-display text-5xl font-bold leading-[1.08] text-foreground md:text-6xl lg:text-7xl"
          >
            The economy is moving.
            <span className="mt-2 block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              See what it means for you.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="max-w-lg text-lg leading-relaxed text-muted-foreground"
          >
            Finora connects real-time economic data to your personal finances —
            so you always know what's changing and what to do about it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-start gap-4 sm:flex-row sm:items-center"
          >
            <Link to="/auth">
              <Button
                size="lg"
                className="gap-2 rounded-xl bg-primary px-8 text-base text-primary-foreground shadow-lg transition-all hover:bg-finora-green-hover hover:shadow-xl hover:scale-[1.02]"
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
            className="flex max-w-md gap-12 border-t border-border/60 pt-8"
          >
            {[
              { value: "6", label: "Live Indicators" },
              { value: "60s", label: "Setup Time" },
              { value: "AI", label: "Powered Insights" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="text-center"
              >
                <p className="font-mono text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
