import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Shield, Brain, Zap } from "lucide-react";
import { motion } from "framer-motion";

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

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

export default function Landing() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="container flex min-h-[80vh] flex-col items-center justify-center gap-8 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl space-y-6"
        >
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Macro Intelligence for Everyone
          </p>
          <h1 className="font-display text-5xl font-bold leading-tight text-foreground md:text-6xl lg:text-7xl">
            The economy is moving.{" "}
            <span className="text-primary">See exactly what it means for you.</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Finora connects real-time economic data to your personal finances — so you always know 
            what's changing and what to do about it.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link to="/auth">
              <Button size="lg" className="gap-2 rounded-md bg-primary px-8 text-primary-foreground hover:bg-finora-green-hover">
                Start in 60 Seconds <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="container py-24">
        <div className="grid gap-8 md:grid-cols-2">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="group rounded-lg border border-border bg-card p-8 shadow-card transition-shadow hover:shadow-card-hover"
            >
              <div className="mb-4 inline-flex rounded-md bg-accent p-3">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-display text-xl font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24 text-center">
        <div className="rounded-lg border border-border bg-card p-12 shadow-card">
          <h2 className="font-display text-3xl font-bold text-foreground">
            Ready to understand your economy?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Set up your financial profile in 60 seconds. Finora does the rest.
          </p>
          <Link to="/auth" className="mt-8 inline-block">
            <Button size="lg" className="gap-2 bg-primary px-8 hover:bg-finora-green-hover">
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Finora. The economy, personalised.
        </div>
      </footer>
    </div>
  );
}
