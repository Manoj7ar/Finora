import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Shield, Brain, Zap } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg-new.jpg";
import ctaBg from "@/assets/cta-bg-new.jpg";
import featureVitals from "@/assets/feature-vitals.jpg";
import featureInsights from "@/assets/feature-insights.jpg";
import featureCrisis from "@/assets/feature-crisis.jpg";
import featureEducation from "@/assets/feature-education.jpg";

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6 },
});

export default function Landing() {
  return (
    <div className="flex flex-col">
      {/* Hero — full background */}
      <section className="relative -mt-20 min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />

        <div className="container relative z-10 flex min-h-screen flex-col items-center justify-center gap-8 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl space-y-6"
          >
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              Macro Intelligence for Everyone
            </p>
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
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-4 pt-4"
            >
              <Link to="/auth">
                <Button size="lg" className="gap-2 rounded-xl bg-primary px-8 text-lg text-primary-foreground shadow-lg backdrop-blur-sm hover:bg-finora-green-hover">
                  Start in 60 Seconds <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8"
          >
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="h-8 w-5 rounded-full border-2 border-primary/40 p-1">
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

      {/* Feature 1: Live Vitals — text left, image right */}
      <section className="container py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <motion.div {...fadeIn()}>
            <div className="mb-4 inline-flex rounded-xl bg-accent/80 p-3 backdrop-blur-sm">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mb-4 font-display text-4xl font-bold text-foreground">
              Live Economic Vitals
            </h2>
            <p className="mb-6 text-lg text-muted-foreground leading-relaxed">
              Track the Federal Funds Rate, CPI inflation, unemployment, treasury yields, and more — each indicator translated into your personal dollar impact in real time.
            </p>
            <ul className="space-y-3 text-muted-foreground">
              {["Fed rate changes → your extra debt cost", "Inflation rate → your savings purchasing power loss", "Unemployment → your income risk level"].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div {...fadeIn(0.2)}>
            <div className="overflow-hidden rounded-2xl shadow-card-hover">
              <img src={featureVitals} alt="Renaissance astronomer observing the stars" className="h-full w-full object-cover" loading="lazy" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature 2: AI Insights — image left, text right */}
      <section className="border-y border-border bg-card py-24">
        <div className="container grid items-center gap-12 md:grid-cols-2">
          <motion.div {...fadeIn()} className="order-2 md:order-1">
            <div className="overflow-hidden rounded-2xl shadow-card-hover">
              <img src={featureInsights} alt="Renaissance alchemist's workshop with potions and books" className="h-full w-full object-cover" loading="lazy" />
            </div>
          </motion.div>
          <motion.div {...fadeIn(0.2)} className="order-1 md:order-2">
            <div className="mb-4 inline-flex rounded-xl bg-accent/80 p-3 backdrop-blur-sm">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mb-4 font-display text-4xl font-bold text-foreground">
              AI-Powered Insights
            </h2>
            <p className="mb-6 text-lg text-muted-foreground leading-relaxed">
              When the economy moves beyond a threshold, Finora fires a personalised insight — explaining what happened, how it hits your wallet, and what you should consider doing.
            </p>
            <div className="space-y-3 text-muted-foreground">
              {["Severity-coded alerts: green, amber, red", "Dollar impact in large, unmissable type", "3-paragraph AI lesson with 'Learn more' expansion"].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature 3: Crisis Simulation — text left, image right */}
      <section className="container py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <motion.div {...fadeIn()}>
            <div className="mb-4 inline-flex rounded-xl bg-accent/80 p-3 backdrop-blur-sm">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mb-4 font-display text-4xl font-bold text-foreground">
              Crisis Simulation
            </h2>
            <p className="mb-6 text-lg text-muted-foreground leading-relaxed">
              Run your exact finances through the 2008 crash, COVID, the 2022 inflation surge, or 1970s stagflation. Watch month-by-month how your money would have been affected.
            </p>
            <div className="flex flex-wrap gap-2">
              {["🔴 2008 Crisis", "🟠 COVID 2020", "🟡 Inflation 2022", "⚫ 1970s Stagflation"].map((tag) => (
                <span key={tag} className="rounded-xl border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
          <motion.div {...fadeIn(0.2)}>
            <div className="overflow-hidden rounded-2xl shadow-card-hover">
              <img src={featureCrisis} alt="Renaissance ships navigating a dramatic storm" className="h-full w-full object-cover" loading="lazy" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature 4: Education — image left, text right */}
      <section className="border-y border-border bg-card py-24">
        <div className="container grid items-center gap-12 md:grid-cols-2">
          <motion.div {...fadeIn()} className="order-2 md:order-1">
            <div className="overflow-hidden rounded-2xl shadow-card-hover">
              <img src={featureEducation} alt="Grand Renaissance library with towering bookshelves" className="h-full w-full object-cover" loading="lazy" />
            </div>
          </motion.div>
          <motion.div {...fadeIn(0.2)} className="order-1 md:order-2">
            <div className="mb-4 inline-flex rounded-xl bg-accent/80 p-3 backdrop-blur-sm">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mb-4 font-display text-4xl font-bold text-foreground">
              Financial Education
            </h2>
            <p className="mb-6 text-lg text-muted-foreground leading-relaxed">
              Learn what the Federal Funds Rate really means, how inflation erodes your savings, what a yield curve predicts — all through lessons built around your actual numbers.
            </p>
            <div className="space-y-3 text-muted-foreground">
              {["Personalised to your income and debts", "3-minute lessons, not lectures", "Comprehension quiz to lock in learning"].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="container py-24">
        <motion.div {...fadeIn()} className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.15em] text-primary">How It Works</p>
          <h2 className="font-display text-4xl font-bold text-foreground">Three steps to financial clarity</h2>
        </motion.div>
        <div className="grid gap-12 md:grid-cols-3">
          {[
            { step: "01", title: "Tell Us About You", desc: "Answer five quick questions about your income, debts, savings, location, and investments." },
            { step: "02", title: "See Your Vitals", desc: "Your dashboard lights up with live economic data — each indicator translated into your personal dollar impact." },
            { step: "03", title: "Learn & Prepare", desc: "AI-generated insights, crisis simulations, and lessons — all built around your actual numbers." },
          ].map((item, i) => (
            <motion.div key={item.step} {...fadeIn(i * 0.15)} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 backdrop-blur-sm">
                <span className="font-mono text-lg font-bold text-primary-foreground">{item.step}</span>
              </div>
              <h3 className="mb-2 font-display text-xl font-semibold text-foreground">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA — full background */}
      <section className="relative overflow-hidden py-32">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${ctaBg})` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/75 to-background/85" />
        <div className="container relative z-10 text-center">
          <motion.div {...fadeIn()} className="mx-auto max-w-2xl">
            <h2 className="font-display text-4xl font-bold text-foreground md:text-5xl">
              Ready to understand your economy?
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-lg text-finora-text-secondary">
              Set up your financial profile in 60 seconds. Finora does the rest — live data, AI insights, and crisis preparedness.
            </p>
            <Link to="/auth" className="mt-10 inline-block">
              <Button size="lg" className="gap-2 rounded-xl bg-primary px-10 text-lg shadow-lg backdrop-blur-sm hover:bg-finora-green-hover">
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
          <p className="mt-1 text-sm text-muted-foreground">The economy, personalised. © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
