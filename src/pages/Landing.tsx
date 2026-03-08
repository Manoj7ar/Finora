import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight, Brain, CloudLightning, Crosshair, User, Mic, ScrollText, Handshake, Users, TrendingUp, Zap, Target, Sparkles, BookOpen, Bot } from "lucide-react";
import { motion } from "framer-motion";
import logoImg from "@/assets/logo.png";
import heroDashboard from "@/assets/hero-dashboard.jpg";

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
  { title: "Live Vitals", description: "Fed rates, inflation, treasury yields — updated in real-time.", icon: TrendingUp },
  { title: "AI Insights", description: "Personalized alerts explaining what economic changes mean for you.", icon: Sparkles },
  { title: "Crisis Simulator", description: "Test your finances against 2008, COVID, or custom scenarios.", icon: Zap },
  { title: "Goal Tracking", description: "Set targets with AI nudges that adapt to economic conditions.", icon: Target },
];

const aiFeatures = [
  { title: "Bias Mirror", description: "Detect cognitive biases in your financial decisions and learn to counteract them.", icon: Brain, color: "text-purple-600 dark:text-purple-400" },
  { title: "Economic Weather", description: "30-day personalized forecasts using weather metaphors you actually understand.", icon: CloudLightning, color: "text-sky-600 dark:text-sky-400" },
  { title: "Predict the Fed", description: "Make predictions about economic events and build your Economic IQ score.", icon: Crosshair, color: "text-amber-600 dark:text-amber-400" },
  { title: "Financial Twin", description: "Your living digital model — see net worth projections across 3 scenarios.", icon: User, color: "text-emerald-600 dark:text-emerald-400" },
  { title: "Morning Briefing", description: "60-second personalized macro briefing with optional audio playback.", icon: Mic, color: "text-rose-600 dark:text-rose-400" },
  { title: "Legislation Radar", description: "AI scans new laws and bills to show exactly how they impact your wallet.", icon: ScrollText, color: "text-orange-600 dark:text-orange-400" },
  { title: "Negotiation Coach", description: "Word-for-word scripts when macro conditions give you leverage.", icon: Handshake, color: "text-teal-600 dark:text-teal-400" },
  { title: "Community Map", description: "Anonymous benchmarks — see how your financial resilience compares.", icon: Users, color: "text-indigo-600 dark:text-indigo-400" },
];

export default function Landing() {
  return (
    <div className="flex flex-col bg-background">
      {/* ─── HERO ─── */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="container">
          <motion.div variants={stagger} initial="initial" animate="animate" className="max-w-3xl">
            <motion.div {...fadeUp(0)} className="mb-6">
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-px w-8 bg-foreground/30" />
                Personal Economic Intelligence
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.1)}
              className="font-display text-5xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl"
            >
              The economy,
              <br />
              <span className="text-primary">explained for you.</span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.2)}
              className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground"
            >
              Finora translates Federal Reserve decisions, inflation data, and market
              shifts into personalized insights — showing exactly how the economy
              affects your money.
            </motion.p>

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
              <span className="text-sm text-muted-foreground">Free · 60 second setup</span>
            </motion.div>

            <motion.div {...fadeUp(0.4)} className="mt-20 flex gap-16 border-t border-border pt-8">
              {[
                { value: "12K+", label: "Users" },
                { value: "12", label: "AI features" },
                { value: "89%", label: "Clarity score" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block xl:right-16"
        >
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-primary/20 blur-2xl" />
            <div className="relative h-[500px] w-[500px] rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
              <img src={heroDashboard} alt="Finora dashboard showing financial analytics and economic indicators" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 via-transparent to-transparent" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-4 -left-4 rounded-xl border border-border bg-card px-4 py-3 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-foreground">Live data</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ─── CORE FEATURES ─── */}
      <section className="py-32 border-t border-border">
        <div className="container">
          <motion.div {...fadeIn()} className="mb-20 max-w-2xl">
            <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
              Everything you need to understand your financial position.
            </h2>
          </motion.div>

          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {coreFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                {...fadeIn(i * 0.1)}
                className="group bg-background p-8 lg:p-10"
              >
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full border border-border text-sm font-mono font-medium text-foreground">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI FEATURES SHOWCASE ─── */}
      <section className="py-32 border-t border-border bg-card/50">
        <div className="container">
          <motion.div {...fadeIn()} className="mb-6 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Bot className="h-3.5 w-3.5" />
              AI-Powered Suite
            </span>
          </motion.div>
          <motion.div {...fadeIn(0.05)} className="mb-16 text-center">
            <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
              8 intelligent tools,<br />one financial brain.
            </h2>
            <p className="mt-6 mx-auto max-w-lg text-lg text-muted-foreground">
              From bias detection to negotiation scripts — Finora's AI works across every dimension of your financial life.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {aiFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                {...fadeIn(i * 0.06)}
                className="group rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
              >
                <div className="mb-4 inline-flex rounded-xl bg-foreground/[0.04] p-3">
                  <feature.icon className={`h-5 w-5 ${feature.color}`} />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-32 bg-foreground text-background">
        <div className="container">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            <motion.div {...fadeIn()}>
              <span className="text-sm text-background/60 uppercase tracking-widest">How it works</span>
              <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
                Three steps to<br />financial clarity.
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

            <div className="space-y-12">
              {[
                { step: "01", title: "Share your profile", description: "Answer five quick questions about income, savings, debts, and investments." },
                { step: "02", title: "See your dashboard", description: "Watch live economic indicators light up with your personal dollar impact." },
                { step: "03", title: "Get smarter", description: "Receive AI insights, run crisis simulations, and build economic literacy." },
              ].map((item, i) => (
                <motion.div key={item.step} {...fadeIn(i * 0.15)} className="flex gap-6">
                  <span className="font-mono text-sm text-background/40 pt-1">{item.step}</span>
                  <div className="flex-1 border-t border-background/20 pt-6">
                    <h3 className="font-display text-2xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-background/70 leading-relaxed">{item.description}</p>
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
          <motion.div {...fadeIn()} className="text-center">
            <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl md:text-6xl">
              Ready to understand<br /><span className="text-primary">your economy?</span>
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
            <p className="mt-4 text-sm text-muted-foreground">No credit card required</p>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border py-12">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="Finora" className="h-7 w-7" />
              <span className="font-display text-lg font-semibold text-foreground">Finora</span>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Finora</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
