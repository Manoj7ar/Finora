import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import logoImg from "@/assets/logo.png";
import heroVisual from "@/assets/hero-visual.jpg";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function Landing() {
  return (
    <div className="flex flex-col bg-background">
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 1: HERO
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="container">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="max-w-3xl"
          >
            {/* Eyebrow */}
            <motion.div {...fadeUp(0)} className="mb-6">
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-px w-8 bg-foreground/30" />
                Personal Economic Intelligence
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...fadeUp(0.1)}
              className="font-display text-5xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl"
            >
              The economy,
              <br />
              <span className="text-primary">explained for you.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              {...fadeUp(0.2)}
              className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground"
            >
              Finora translates Federal Reserve decisions, inflation data, and market 
              shifts into personalized insights — showing exactly how the economy 
              affects your money.
            </motion.p>

            {/* CTA */}
            <motion.div {...fadeUp(0.3)} className="mt-10 flex items-center gap-6">
              <Link to="/auth">
                <Button
                  size="lg"
                  className="group h-14 gap-3 rounded-full bg-foreground px-8 text-base font-medium text-background hover:bg-foreground/90"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <span className="text-sm text-muted-foreground">
                Free • 60 second setup
              </span>
            </motion.div>

            {/* Stats */}
            <motion.div
              {...fadeUp(0.4)}
              className="mt-20 flex gap-16 border-t border-border pt-8"
            >
              {[
                { value: "12K+", label: "Users" },
                { value: "6", label: "Live indicators" },
                { value: "89%", label: "Clarity score" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:block"
        >
          <div className="relative h-[480px] w-[480px] rounded-2xl overflow-hidden shadow-2xl shadow-foreground/10">
            <img
              src={heroVisual}
              alt="Financial data visualization with charts and economic indicators"
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 2: FEATURES
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-32 border-t border-border">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20 max-w-2xl"
          >
            <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
              Everything you need to understand your financial position.
            </h2>
          </motion.div>

          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Live Vitals",
                description: "Fed rates, inflation, treasury yields — updated in real-time.",
              },
              {
                title: "AI Insights",
                description: "Personalized alerts explaining what economic changes mean for you.",
              },
              {
                title: "Crisis Simulator",
                description: "Test your finances against 2008, COVID, or custom scenarios.",
              },
              {
                title: "Goal Tracking",
                description: "Set targets with AI nudges that adapt to economic conditions.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-background p-8 lg:p-10"
              >
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full border border-border text-sm font-mono font-medium text-foreground">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 3: HOW IT WORKS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-32 bg-foreground text-background">
        <div className="container">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            {/* Left: Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm text-background/60 uppercase tracking-widest">
                How it works
              </span>
              <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
                Three steps to
                <br />
                financial clarity.
              </h2>
              <p className="mt-6 text-lg text-background/70 leading-relaxed max-w-md">
                From sign-up to personalized economic intelligence in under two minutes.
              </p>
              <Link to="/auth" className="mt-10 inline-block">
                <Button
                  variant="outline"
                  size="lg"
                  className="group h-14 gap-3 rounded-full border-background/30 bg-transparent px-8 text-base font-medium text-background hover:bg-background hover:text-foreground"
                >
                  Start now
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Button>
              </Link>
            </motion.div>

            {/* Right: Steps */}
            <div className="space-y-12">
              {[
                {
                  step: "01",
                  title: "Share your profile",
                  description: "Answer five quick questions about income, savings, debts, and investments.",
                },
                {
                  step: "02",
                  title: "See your dashboard",
                  description: "Watch live economic indicators light up with your personal dollar impact.",
                },
                {
                  step: "03",
                  title: "Get smarter",
                  description: "Receive AI insights, run crisis simulations, and build economic literacy.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex gap-6"
                >
                  <span className="font-mono text-sm text-background/40 pt-1">
                    {item.step}
                  </span>
                  <div className="flex-1 border-t border-background/20 pt-6">
                    <h3 className="font-display text-2xl font-semibold mb-2">
                      {item.title}
                    </h3>
                    <p className="text-background/70 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 4: CTA + FOOTER
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl md:text-6xl">
              Ready to understand
              <br />
              <span className="text-primary">your economy?</span>
            </h2>
            <p className="mt-6 mx-auto max-w-lg text-lg text-muted-foreground">
              Join thousands who've transformed how they understand economic data.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link to="/auth">
                <Button
                  size="lg"
                  className="group h-14 gap-3 rounded-full bg-primary px-10 text-base font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="Finora" className="h-7 w-7" />
              <span className="font-display text-lg font-semibold text-foreground">
                Finora
              </span>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Finora
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
