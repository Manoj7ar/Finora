import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import heroImg from "@/assets/hero-illustration.jpg";

export default function HeroSection() {
  return (
    <section className="-mt-20 bg-background pt-28 sm:pt-32">
      <div className="container grid min-h-[85vh] items-center gap-12 py-16 lg:grid-cols-2 lg:gap-16">
        {/* Left: Text content */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="font-display text-4xl font-bold leading-[1.1] text-foreground sm:text-5xl md:text-6xl"
          >
            Economic Intelligence,
            <span className="mt-2 block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Tailored to You
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Transform complex macroeconomic data into actionable personal insights. 
            Finora monitors Federal Reserve policy, inflation trends, and market indicators — 
            then translates their impact directly to your financial situation.
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
                Get Started Free <ArrowRight className="h-5 w-5" />
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
              { value: "6+", label: "Live Indicators" },
              { value: "60s", label: "Setup Time" },
              { value: "AI", label: "Powered Analysis" },
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

        {/* Right: Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative hidden lg:block"
        >
          <div className="aspect-square overflow-hidden rounded-3xl shadow-2xl">
            <img
              src={heroImg}
              alt="Renaissance observatory with celestial globe showing economic data"
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
