import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import logoImg from "@/assets/logo.png";
import HeroDashboardPreview from "@/components/landing/HeroDashboardPreview";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6 },
});

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const coreFeatures = [
  { title: "Live Vitals", description: "Fed rates, inflation, treasury yields — updated in real-time and translated into your dollar impact." },
  { title: "AI Insights", description: "Personalized alerts explaining what economic changes mean for your wallet and what to do next." },
  { title: "Crisis Simulator", description: "Test your finances against 2008, COVID, or custom recession scenarios before they happen." },
  { title: "Goal Tracking", description: "Set financial targets with AI nudges that adapt to changing economic conditions." },
];

const aiFeatures = [
  { title: "Bias Mirror", description: "Detect cognitive biases in your financial decisions." },
  { title: "Economic Weather", description: "30-day personalized forecasts using weather metaphors." },
  { title: "Predict the Fed", description: "Make predictions and build your Economic IQ score." },
  { title: "Financial Twin", description: "Your living digital model with net worth projections." },
  { title: "Morning Briefing", description: "60-second personalized macro briefing with audio." },
  { title: "Legislation Radar", description: "AI scans new laws to show how they impact your wallet." },
  { title: "Negotiation Coach", description: "Word-for-word scripts when macro gives you leverage." },
  { title: "Community Map", description: "Anonymous benchmarks of your financial resilience." },
];

export default function Landing() {
  return (
    <div className="flex flex-col bg-background">
      {/* ─── HERO ─── */}
      <section className="relative flex min-h-[85vh] items-center justify-center">
        <div className="container">
          <motion.div variants={stagger} initial="initial" animate="animate" className="mx-auto max-w-3xl text-center">
            <motion.p {...fadeUp(0)} className="mb-6 font-mono text-sm text-muted-foreground tracking-wide">
              — 01 &nbsp; Personal Economic Intelligence
            </motion.p>

            <motion.h1
              {...fadeUp(0.1)}
              className="font-display text-5xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl"
            >
              The economy,
              <br />
              explained for you.
            </motion.h1>

            <motion.p
              {...fadeUp(0.2)}
              className="mx-auto mt-8 max-w-lg text-lg leading-relaxed text-muted-foreground"
            >
              Finora translates Federal Reserve decisions, inflation data, and market
              shifts into personalized insights — showing exactly how the economy
              affects your money.
            </motion.p>

            <motion.div {...fadeUp(0.3)} className="mt-10 flex items-center justify-center gap-6">
              <Link to="/auth">
                <Button
                  size="lg"
                  className="group h-14 gap-3 rounded-full bg-foreground px-8 text-base font-medium text-background hover:bg-foreground/90"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <span className="text-sm text-muted-foreground">Free · 60s setup</span>
            </motion.div>

            <HeroDashboardPreview />

            <motion.div {...fadeUp(0.4)} className="mx-auto mt-12 flex max-w-md justify-between border-t border-border pt-8">
              {[
                { value: "6", label: "Live indicators" },
                { value: "12", label: "AI tools" },
                { value: "<2 min", label: "Setup" },
              ].map((stat, i) => (
                <div key={stat.label} className={i > 0 ? "border-l border-border pl-8" : ""}>
                  <p className="font-mono text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── CORE FEATURES (dark inverted) ─── */}
      <section className="bg-foreground text-background py-24 sm:py-32">
        <div className="container">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            <motion.div {...fadeIn()}>
              <span className="font-mono text-sm text-background/50 uppercase tracking-widest">— 02 &nbsp; What you get</span>
              <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
                Everything in
                <br />one place.
              </h2>
            </motion.div>

            <div className="space-y-0">
              {coreFeatures.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  {...fadeIn(i * 0.1)}
                  className="border-t border-background/15 py-8 first:border-t-0 first:pt-0"
                >
                  <div className="flex gap-5">
                    <span className="font-mono text-sm text-background/35 pt-1 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-background/65 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── AI SUITE (light) ─── */}
      <section className="py-24 sm:py-32">
        <div className="container">
          <motion.div {...fadeIn()} className="mb-6 text-center">
            <span className="font-mono text-sm text-muted-foreground tracking-wide">— 03 &nbsp; AI-Powered Suite</span>
          </motion.div>
          <motion.div {...fadeIn(0.05)} className="mb-16 text-center">
            <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
              8 intelligent tools,
              <br />one financial brain.
            </h2>
          </motion.div>

          <div className="mx-auto max-w-4xl">
            <div className="grid sm:grid-cols-2">
              {aiFeatures.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  {...fadeIn(i * 0.05)}
                  className="border-t border-border py-6 px-4 sm:px-6"
                >
                  <div className="flex gap-4">
                    <span className="font-mono text-xs text-muted-foreground/60 pt-1 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-base font-semibold text-foreground">{feature.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS (dark inverted) ─── */}
      <section className="py-24 sm:py-32 bg-foreground text-background">
        <div className="container">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            <motion.div {...fadeIn()}>
              <span className="font-mono text-sm text-background/50 uppercase tracking-widest">— 04 &nbsp; How it works</span>
              <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
                Three steps to
                <br />financial clarity.
              </h2>
              <p className="mt-6 text-lg text-background/65 leading-relaxed max-w-md">
                From sign-up to personalized economic intelligence in under two minutes.
              </p>
              <Link to="/auth" className="mt-10 inline-block">
                <Button
                  variant="outline"
                  size="lg"
                  className="group h-14 gap-3 rounded-full border-background/25 bg-transparent px-8 text-base font-medium text-background hover:bg-background hover:text-foreground"
                >
                  Start now
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Button>
              </Link>
            </motion.div>

            <div className="space-y-0">
              {[
                { step: "01", title: "Share your profile", description: "Answer five quick questions about income, savings, debts, and investments." },
                { step: "02", title: "See your dashboard", description: "Watch live economic indicators light up with your personal dollar impact." },
                { step: "03", title: "Get smarter", description: "Receive AI insights, run crisis simulations, and build economic literacy." },
              ].map((item, i) => (
                <motion.div key={item.step} {...fadeIn(i * 0.15)} className="border-t border-background/15 py-8 first:border-t-0 first:pt-0">
                  <div className="flex gap-5">
                    <span className="font-mono text-sm text-background/35 pt-1 shrink-0">{item.step}</span>
                    <div>
                      <h3 className="font-display text-2xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-background/65 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-32">
        <div className="container">
          <motion.div {...fadeIn()} className="mx-auto max-w-2xl text-center">
            <p className="mb-6 font-mono text-sm text-muted-foreground tracking-wide">— 05</p>
            <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl md:text-6xl">
              Ready to understand
              <br />your economy?
            </h2>
            <p className="mt-6 mx-auto max-w-lg text-lg text-muted-foreground">
              Start translating economic data into personal financial clarity.
            </p>
            <div className="mt-10">
              <Link to="/auth">
                <Button
                  size="lg"
                  className="group h-14 gap-3 rounded-full bg-foreground px-10 text-base font-medium text-background hover:bg-foreground/90"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">No credit card required</p>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border bg-foreground text-background">
        <div className="container py-16 sm:py-20">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img src={logoImg} alt="Finora" className="h-7 w-7 brightness-0 invert" />
                <span className="font-display text-lg font-bold">Finora</span>
              </div>
              <p className="text-sm text-background/55 leading-relaxed max-w-xs">
                Personal economic intelligence — translating macro data into decisions that matter for your wallet.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-background/40 mb-4">Product</h4>
              <ul className="space-y-2.5">
                {["Dashboard", "AI Advisor", "Crisis Simulator", "Goal Tracking"].map((item) => (
                  <li key={item}>
                    <Link to="/auth" className="text-sm text-background/60 hover:text-background transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Suite */}
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-background/40 mb-4">AI Suite</h4>
              <ul className="space-y-2.5">
                {["Bias Mirror", "Economic Weather", "Financial Twin", "Legislation Radar"].map((item) => (
                  <li key={item}>
                    <Link to="/auth" className="text-sm text-background/60 hover:text-background transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-background/40 mb-4">Company</h4>
              <ul className="space-y-2.5">
                {["Privacy Policy", "Terms of Service", "Contact", "About"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-background/60 hover:text-background transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/10">
          <div className="container flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
            <p className="font-mono text-xs text-background/35">© {new Date().getFullYear()} Finora. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="https://www.linkedin.com/in/manoj07ar/" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-background/35 hover:text-background transition-colors">LinkedIn</a>
              <span className="text-background/15">·</span>
              <p className="font-mono text-xs text-background/35">Built for financial clarity.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
