import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Shield, Brain, Zap } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import ctaBg from "@/assets/cta-bg.jpg";

const features = [
  {
    icon: TrendingUp,
    title: "Live Economic Vitals",
    description: "Track Fed rates, inflation, unemployment — and see exactly what each means for your wallet.",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "When the economy moves, Finora explains why — with lessons built around your actual numbers.",
  },
  {
    icon: Zap,
    title: "Crisis Simulation",
    description: "Run your finances through any historical crisis. See your resilience score and get a personalised action plan.",
  },
  {
    icon: Shield,
    title: "Financial Education",
    description: "Learn macro economics through your own money. Every lesson is personalised, every concept is real.",
  },
];

export default function Landing() {
  return (
    <div className="flex flex-col">
      {/* Hero with background image */}
      <section className="relative -mt-20 min-h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />

        <div className="container relative z-10 flex min-h-[92vh] flex-col items-center justify-center gap-8 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl space-y-6"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm font-medium uppercase tracking-[0.2em] text-primary"
            >
              Macro Intelligence for Everyone
            </motion.p>
            <h1 className="font-display text-5xl font-bold leading-[1.1] text-foreground drop-shadow-sm md:text-6xl lg:text-7xl">
              The economy is moving.{" "}
              <span className="text-primary">See exactly what it means for you.</span>
            </h1>
            <p className="mx-auto max-w-xl text-lg text-finora-text-secondary">
              Finora connects real-time economic data to your personal finances — so you always know
              what's changing and what to do about it.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex items-center justify-center gap-4 pt-4"
            >
              <Link to="/auth">
                <Button
                  size="lg"
                  className="gap-2 rounded-md bg-primary px-8 text-lg text-primary-foreground shadow-lg hover:bg-finora-green-hover"
                >
                  Start in 60 Seconds <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-8 w-5 rounded-full border-2 border-primary/40 p-1"
            >
              <div className="mx-auto h-2 w-1 rounded-full bg-primary/60" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats ribbon */}
      <section className="border-y border-border bg-card py-6">
        <div className="container flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {[
            { value: "6", label: "Live Indicators" },
            { value: "60s", label: "Setup Time" },
            { value: "4", label: "Crisis Simulations" },
            { value: "AI", label: "Powered Insights" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-mono text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.15em] text-primary">
            What Finora Does
          </p>
          <h2 className="font-display text-4xl font-bold text-foreground">
            Your financial renaissance begins here
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative overflow-hidden rounded-lg border border-border bg-card p-8 shadow-card transition-all duration-300 hover:shadow-card-hover"
            >
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-accent/50 blur-2xl transition-all group-hover:bg-accent/80" />
              <div className="relative">
                <div className="mb-4 inline-flex rounded-md bg-accent p-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-display text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-card py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.15em] text-primary">
              How It Works
            </p>
            <h2 className="font-display text-4xl font-bold text-foreground">
              Three steps to financial clarity
            </h2>
          </motion.div>

          <div className="grid gap-12 md:grid-cols-3">
            {[
              { step: "01", title: "Tell Us About You", desc: "Answer five quick questions about your income, debts, savings, location, and investments." },
              { step: "02", title: "See Your Vitals", desc: "Your dashboard lights up with live economic data — each indicator translated into your personal dollar impact." },
              { step: "03", title: "Learn & Prepare", desc: "AI-generated insights, crisis simulations, and lessons — all built around your actual numbers." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="text-center"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
                  <span className="font-mono text-lg font-bold text-primary-foreground">{item.step}</span>
                </div>
                <h3 className="mb-2 font-display text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA with background image */}
      <section className="relative overflow-hidden py-32">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${ctaBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/80 to-background/90" />

        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl"
          >
            <h2 className="font-display text-4xl font-bold text-foreground md:text-5xl">
              Ready to understand your economy?
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-lg text-finora-text-secondary">
              Set up your financial profile in 60 seconds. Finora does the rest — live data, AI insights, and crisis preparedness.
            </p>
            <Link to="/auth" className="mt-10 inline-block">
              <Button
                size="lg"
                className="gap-2 bg-primary px-10 text-lg shadow-lg hover:bg-finora-green-hover"
              >
                Get Started Free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-10">
        <div className="container text-center">
          <p className="font-display text-lg font-semibold text-foreground">Finora</p>
          <p className="mt-1 text-sm text-muted-foreground">
            The economy, personalised. © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
