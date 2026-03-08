import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Activity,
  Brain,
  Shield,
  TrendingUp,
  BarChart3,
  Zap,
  Target,
  MessageSquare,
  Cloud,
  Scale,
  Users,
  BookOpen,
  Sparkles,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import logoImg from "@/assets/logo.png";

/* ── animation helpers ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: "easeOut" as const },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { delay, duration: 0.7 },
});

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

/* ── data ── */
const pillars = [
  {
    icon: Activity,
    title: "Live Economic Data",
    description:
      "Fed rates, CPI, treasury yields, and unemployment — updated in real-time from FRED.",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description:
      "Every data point translated into what it means for your wallet, powered by AI.",
  },
  {
    icon: Shield,
    title: "Crisis Ready",
    description:
      "Stress-test your finances against 2008, COVID, or custom recession scenarios.",
  },
];

const showcases = [
  {
    label: "Live Vitals",
    title: "Track live economic vitals that matter to you",
    description:
      "See Fed rates, inflation, treasury yields, and unemployment in real-time. Each indicator shows your personal dollar impact based on your financial profile.",
    bullets: [
      "Real-time FRED data integration",
      "Personal dollar-impact calculations",
      "Trend arrows & historical context",
    ],
    visual: "vitals",
  },
  {
    label: "AI Insights",
    title: "AI insights personalized to your finances",
    description:
      "Get plain-English explanations of what economic changes mean for you — not generic market commentary, but advice calibrated to your income, debts, and goals.",
    bullets: [
      "Personalized to your profile",
      "Actionable recommendations",
      "Updated with every data release",
    ],
    visual: "insights",
  },
  {
    label: "Crisis Simulator",
    title: "Run crisis simulations before they happen",
    description:
      "Model how your finances would perform in past recessions or custom scenarios. See projected impacts and get a preparedness action plan.",
    bullets: [
      "Historical scenario library",
      "Custom scenario builder",
      "Preparedness scoring",
    ],
    visual: "crisis",
  },
  {
    label: "AI Suite",
    title: "12 AI tools, one financial brain",
    description:
      "From bias detection to negotiation scripts, morning briefings to legislation radar — an entire suite of AI-powered tools working for your financial wellbeing.",
    bullets: [
      "Bias Mirror & Financial Twin",
      "Economic Weather & Predict the Fed",
      "Negotiation Coach & Legislation Radar",
    ],
    visual: "suite",
  },
];

const aiTools = [
  { icon: Sparkles, name: "Bias Mirror" },
  { icon: Cloud, name: "Economic Weather" },
  { icon: TrendingUp, name: "Predict the Fed" },
  { icon: Users, name: "Financial Twin" },
  { icon: MessageSquare, name: "Morning Briefing" },
  { icon: Scale, name: "Legislation Radar" },
  { icon: Zap, name: "Negotiation Coach" },
  { icon: Target, name: "Community Map" },
  { icon: BookOpen, name: "Education Hub" },
  { icon: BarChart3, name: "What-If Analysis" },
  { icon: Activity, name: "Action Plan" },
  { icon: Brain, name: "AI Advisor" },
];

const steps = [
  {
    num: "01",
    title: "Share your profile",
    description: "Answer five quick questions about income, savings, debts, and investments.",
  },
  {
    num: "02",
    title: "See your dashboard",
    description: "Watch live economic indicators light up with your personal dollar impact.",
  },
  {
    num: "03",
    title: "Get smarter daily",
    description: "Receive AI insights, run simulations, and build economic literacy over time.",
  },
];

const freeFeatures = [
  "All 12 AI-powered tools",
  "Real-time economic data from FRED",
  "Personalized dollar-impact analysis",
  "Crisis simulation engine",
  "Goal tracking with AI nudges",
  "Morning briefings & news digest",
];

/* ── visual components (CSS-only, no images) ── */
function DashboardVisual() {
  return (
    <div className="relative rounded-2xl border border-[hsl(153,40%,30%,0.3)] bg-[hsl(150,10%,10%)] p-6 shadow-2xl">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-[hsl(4,63%,46%)]" />
        <div className="h-3 w-3 rounded-full bg-[hsl(33,88%,45%)]" />
        <div className="h-3 w-3 rounded-full bg-[hsl(153,40%,52%)]" />
        <span className="ml-auto font-mono text-[10px] text-[hsl(0,0%,100%,0.3)]">
          finora — dashboard
        </span>
      </div>
      {/* Mini metric cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Fed Rate", value: "5.33%", color: "hsl(153,40%,52%)" },
          { label: "CPI", value: "3.2%", color: "hsl(33,88%,45%)" },
          { label: "10Y Yield", value: "4.25%", color: "hsl(153,47%,71%)" },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-lg bg-[hsl(150,10%,14%)] p-3 border border-[hsl(150,10%,20%)]"
          >
            <p className="font-mono text-[10px] text-[hsl(0,0%,100%,0.4)]">{m.label}</p>
            <p className="font-mono text-lg font-bold" style={{ color: m.color }}>
              {m.value}
            </p>
          </div>
        ))}
      </div>
      {/* Chart area */}
      <div className="rounded-lg bg-[hsl(150,10%,14%)] p-4 border border-[hsl(150,10%,20%)]">
        <svg viewBox="0 0 300 80" className="w-full h-20">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(153,40%,52%)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(153,40%,52%)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,60 Q30,55 60,50 T120,35 T180,45 T240,20 T300,25"
            fill="none"
            stroke="hsl(153,40%,52%)"
            strokeWidth="2"
          />
          <path
            d="M0,60 Q30,55 60,50 T120,35 T180,45 T240,20 T300,25 L300,80 L0,80 Z"
            fill="url(#chartGrad)"
          />
        </svg>
      </div>
      {/* Glow effect */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[hsl(153,40%,52%,0.15)] to-transparent pointer-events-none" />
    </div>
  );
}

function InsightVisual() {
  return (
    <div className="relative rounded-2xl border border-[hsl(153,40%,30%,0.3)] bg-[hsl(150,10%,10%)] p-6 shadow-2xl space-y-3">
      {[
        {
          severity: "hsl(153,40%,52%)",
          title: "Rate hold benefits your mortgage",
          desc: "The Fed's pause saves you ~$47/mo on your variable-rate debt.",
        },
        {
          severity: "hsl(33,88%,45%)",
          title: "Inflation ticking up",
          desc: "CPI rose 0.3% — your grocery budget may need a $35 adjustment.",
        },
        {
          severity: "hsl(153,47%,71%)",
          title: "Treasury yields favorable",
          desc: "Consider locking in a 4.25% CD for your emergency fund.",
        },
      ].map((insight, i) => (
        <div
          key={i}
          className="rounded-lg bg-[hsl(150,10%,14%)] p-4 border border-[hsl(150,10%,20%)] flex gap-3"
        >
          <div
            className="mt-1 h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: insight.severity }}
          />
          <div>
            <p className="text-sm font-medium text-[hsl(0,0%,100%,0.9)]">{insight.title}</p>
            <p className="text-xs text-[hsl(0,0%,100%,0.45)] mt-1">{insight.desc}</p>
          </div>
        </div>
      ))}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[hsl(153,40%,52%,0.1)] to-transparent pointer-events-none" />
    </div>
  );
}

function CrisisVisual() {
  return (
    <div className="relative rounded-2xl border border-[hsl(153,40%,30%,0.3)] bg-[hsl(150,10%,10%)] p-6 shadow-2xl">
      <p className="font-mono text-xs text-[hsl(0,0%,100%,0.4)] mb-3">SCENARIO: 2008 Financial Crisis</p>
      <div className="space-y-3 mb-4">
        {[
          { label: "Income Impact", value: "-12%", color: "hsl(4,63%,46%)" },
          { label: "Portfolio Drawdown", value: "-38%", color: "hsl(4,63%,46%)" },
          { label: "Emergency Runway", value: "4.2 months", color: "hsl(33,88%,45%)" },
          { label: "Recovery Time", value: "~18 months", color: "hsl(153,40%,52%)" },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-lg bg-[hsl(150,10%,14%)] px-4 py-3 border border-[hsl(150,10%,20%)]">
            <span className="text-sm text-[hsl(0,0%,100%,0.6)]">{item.label}</span>
            <span className="font-mono text-sm font-bold" style={{ color: item.color }}>{item.value}</span>
          </div>
        ))}
      </div>
      <div className="rounded-lg bg-[hsl(153,40%,52%,0.1)] border border-[hsl(153,40%,52%,0.2)] p-3">
        <p className="text-xs text-[hsl(153,47%,71%)]">
          Preparedness Score: <span className="font-mono font-bold">67/100</span> — Moderate
        </p>
      </div>
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[hsl(153,40%,52%,0.1)] to-transparent pointer-events-none" />
    </div>
  );
}

function SuiteVisual() {
  return (
    <div className="relative rounded-2xl border border-[hsl(153,40%,30%,0.3)] bg-[hsl(150,10%,10%)] p-6 shadow-2xl">
      <div className="grid grid-cols-3 gap-3">
        {aiTools.slice(0, 9).map((tool) => (
          <div
            key={tool.name}
            className="flex flex-col items-center gap-2 rounded-lg bg-[hsl(150,10%,14%)] p-4 border border-[hsl(150,10%,20%)] transition-colors hover:border-[hsl(153,40%,52%,0.4)]"
          >
            <tool.icon className="h-5 w-5 text-[hsl(153,47%,71%)]" />
            <span className="text-[10px] text-center text-[hsl(0,0%,100%,0.5)] leading-tight">
              {tool.name}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center font-mono text-xs text-[hsl(0,0%,100%,0.35)]">
        + 3 more tools
      </p>
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[hsl(153,40%,52%,0.1)] to-transparent pointer-events-none" />
    </div>
  );
}

const visualMap: Record<string, React.FC> = {
  vitals: DashboardVisual,
  insights: InsightVisual,
  crisis: CrisisVisual,
  suite: SuiteVisual,
};

/* ── LANDING PAGE ── */
export default function Landing() {
  return (
    <div className="flex flex-col bg-[hsl(150,10%,5%)] text-white">
      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 inset-x-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logoImg} alt="Finora" className="h-8 w-8" />
            <span className="font-display text-lg font-semibold text-white">Finora</span>
          </Link>
          <Link to="/auth">
            <Button
              size="sm"
              className="rounded-full bg-[hsl(153,40%,52%)] text-[hsl(150,10%,5%)] font-medium hover:bg-[hsl(153,40%,58%)] border-0"
            >
              Get Started
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative flex min-h-screen items-center justify-center pt-16 overflow-hidden">
        {/* Gradient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-[radial-gradient(ellipse,hsl(153,40%,30%,0.15),transparent_70%)] blur-3xl pointer-events-none" />

        <div className="container relative">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="mx-auto max-w-4xl text-center"
          >
            {/* Badge */}
            <motion.div {...fadeUp(0)} className="mb-8 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(153,40%,52%,0.3)] bg-[hsl(153,40%,52%,0.08)] px-4 py-1.5 text-xs font-medium text-[hsl(153,47%,71%)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[hsl(153,40%,52%)] animate-pulse" />
                Personal Economic Intelligence
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...fadeUp(0.1)}
              className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.5rem]"
            >
              The economy,{" "}
              <span className="bg-gradient-to-r from-[hsl(153,47%,71%)] to-[hsl(153,40%,52%)] bg-clip-text text-transparent">
                explained
              </span>
              <br />
              for you.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              {...fadeUp(0.2)}
              className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-[hsl(0,0%,100%,0.55)] sm:text-xl"
            >
              Finora translates Federal Reserve decisions, inflation data, and market
              shifts into personalized insights — showing exactly how the economy
              affects your money.
            </motion.p>

            {/* CTAs */}
            <motion.div {...fadeUp(0.3)} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/auth">
                <Button
                  size="lg"
                  className="group h-13 gap-2 rounded-full bg-[hsl(153,40%,52%)] px-8 text-base font-semibold text-[hsl(150,10%,5%)] hover:bg-[hsl(153,40%,58%)] border-0 shadow-[0_0_30px_hsl(153,40%,52%,0.3)]"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-13 gap-2 rounded-full border-[hsl(0,0%,100%,0.15)] bg-transparent px-8 text-base font-medium text-white hover:bg-[hsl(0,0%,100%,0.05)] hover:text-white"
                >
                  See How It Works
                </Button>
              </a>
            </motion.div>

            {/* Dashboard visual */}
            <motion.div {...fadeUp(0.45)} className="mx-auto mt-20 max-w-2xl">
              <DashboardVisual />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── THREE PILLARS ─── */}
      <section className="relative py-24 sm:py-32 border-t border-[hsl(0,0%,100%,0.06)]">
        <div className="container">
          <motion.div {...fadeIn()} className="text-center mb-16">
            <span className="font-mono text-sm text-[hsl(153,47%,71%,0.6)] tracking-widest uppercase">
              Why Finora
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl md:text-5xl">
              Everything you need,{" "}
              <span className="text-[hsl(0,0%,100%,0.5)]">nothing you don't.</span>
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-3">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                {...fadeIn(i * 0.1)}
                className="group rounded-2xl border border-[hsl(0,0%,100%,0.06)] bg-[hsl(150,10%,8%)] p-8 transition-all duration-300 hover:border-[hsl(153,40%,52%,0.3)] hover:bg-[hsl(150,10%,10%)]"
              >
                <div className="mb-5 inline-flex rounded-xl bg-[hsl(153,40%,52%,0.1)] p-3">
                  <pillar.icon className="h-6 w-6 text-[hsl(153,47%,71%)]" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{pillar.title}</h3>
                <p className="text-sm leading-relaxed text-[hsl(0,0%,100%,0.5)]">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURE SHOWCASES ─── */}
      {showcases.map((showcase, i) => {
        const reversed = i % 2 === 1;
        const Visual = visualMap[showcase.visual];
        return (
          <section
            key={showcase.label}
            className="py-24 sm:py-32 border-t border-[hsl(0,0%,100%,0.06)]"
          >
            <div className="container">
              <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                {/* Text */}
                <motion.div
                  {...fadeIn()}
                  className={reversed ? "lg:order-2" : "lg:order-1"}
                >
                  <span className="font-mono text-xs text-[hsl(153,47%,71%,0.6)] tracking-widest uppercase">
                    {showcase.label}
                  </span>
                  <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
                    {showcase.title}
                  </h2>
                  <p className="mt-5 text-[hsl(0,0%,100%,0.55)] leading-relaxed text-lg max-w-lg">
                    {showcase.description}
                  </p>
                  <ul className="mt-8 space-y-3">
                    {showcase.bullets.map((bullet, j) => (
                      <motion.li
                        key={bullet}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + j * 0.1 }}
                        className="flex items-center gap-3 text-[hsl(0,0%,100%,0.65)]"
                      >
                        <Check className="h-4 w-4 text-[hsl(153,40%,52%)] shrink-0" />
                        <span className="text-sm">{bullet}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Visual */}
                <motion.div
                  {...fadeIn(0.15)}
                  className={reversed ? "lg:order-1" : "lg:order-2"}
                >
                  {Visual && <Visual />}
                </motion.div>
              </div>
            </div>
          </section>
        );
      })}

      {/* ─── HOW IT WORKS ─── */}
      <section
        id="how-it-works"
        className="py-24 sm:py-32 border-t border-[hsl(0,0%,100%,0.06)] bg-[hsl(150,10%,7%)]"
      >
        <div className="container">
          <motion.div {...fadeIn()} className="text-center mb-20">
            <span className="font-mono text-sm text-[hsl(153,47%,71%,0.6)] tracking-widest uppercase">
              How it works
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl md:text-5xl">
              Three steps to{" "}
              <span className="text-[hsl(0,0%,100%,0.5)]">financial clarity.</span>
            </h2>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div key={step.num} {...fadeIn(i * 0.12)} className="relative text-center">
                {/* Number circle */}
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[hsl(153,40%,52%,0.3)] bg-[hsl(153,40%,52%,0.08)]">
                  <span className="font-mono text-xl font-bold text-[hsl(153,47%,71%)]">
                    {step.num}
                  </span>
                </div>
                {/* Connecting line (hidden on mobile, between circles) */}
                {i < 2 && (
                  <div className="absolute top-8 left-[calc(50%+40px)] right-[calc(-50%+40px)] h-px bg-[hsl(0,0%,100%,0.08)] hidden sm:block" />
                )}
                <h3 className="font-display text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-sm text-[hsl(0,0%,100%,0.45)] leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FREE SECTION ─── */}
      <section className="py-24 sm:py-32 border-t border-[hsl(0,0%,100%,0.06)]">
        <div className="container">
          <motion.div {...fadeIn()} className="mx-auto max-w-2xl text-center">
            <span className="font-mono text-sm text-[hsl(153,47%,71%,0.6)] tracking-widest uppercase">
              Pricing
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl md:text-5xl">
              Free for everyone.
            </h2>
            <p className="mt-5 text-lg text-[hsl(0,0%,100%,0.5)]">
              No credit card, no premium tier, no catch. Every feature, every tool.
            </p>

            <div className="mt-12 mx-auto max-w-md">
              <div className="rounded-2xl border border-[hsl(0,0%,100%,0.06)] bg-[hsl(150,10%,8%)] p-8">
                <p className="font-display text-4xl font-bold text-[hsl(153,47%,71%)] mb-6">
                  $0<span className="text-lg text-[hsl(0,0%,100%,0.35)]"> / forever</span>
                </p>
                <ul className="space-y-3 text-left">
                  {freeFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-[hsl(0,0%,100%,0.65)]">
                      <Check className="h-4 w-4 text-[hsl(153,40%,52%)] shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/auth" className="mt-8 block">
                  <Button className="w-full rounded-full bg-[hsl(153,40%,52%)] text-[hsl(150,10%,5%)] font-semibold hover:bg-[hsl(153,40%,58%)] border-0 h-12">
                    Start Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-32 border-t border-[hsl(0,0%,100%,0.06)]">
        <div className="container">
          <motion.div {...fadeIn()} className="mx-auto max-w-3xl text-center">
            <div className="rounded-3xl border border-[hsl(153,40%,52%,0.2)] bg-gradient-to-b from-[hsl(153,40%,52%,0.08)] to-transparent p-12 sm:p-16">
              <h2 className="font-display text-3xl font-bold sm:text-4xl md:text-5xl">
                Ready to understand your economy?
              </h2>
              <p className="mt-5 text-lg text-[hsl(0,0%,100%,0.5)] max-w-lg mx-auto">
                Join Finora and start translating economic data into personal financial clarity.
              </p>
              <div className="mt-10">
                <Link to="/auth">
                  <Button
                    size="lg"
                    className="group h-14 gap-3 rounded-full bg-[hsl(153,40%,52%)] px-10 text-base font-semibold text-[hsl(150,10%,5%)] hover:bg-[hsl(153,40%,58%)] border-0 shadow-[0_0_40px_hsl(153,40%,52%,0.25)]"
                  >
                    Get Started Free
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-[hsl(0,0%,100%,0.06)] py-12">
        <div className="container">
          <div className="grid gap-8 sm:grid-cols-4">
            {/* Brand */}
            <div className="sm:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <img src={logoImg} alt="Finora" className="h-7 w-7" />
                <span className="font-display text-lg font-semibold">Finora</span>
              </div>
              <p className="text-sm text-[hsl(0,0%,100%,0.4)] leading-relaxed">
                Personal economic intelligence, powered by AI.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-medium text-sm mb-4 text-[hsl(0,0%,100%,0.7)]">Product</h4>
              <ul className="space-y-2.5">
                {["Dashboard", "AI Insights", "Crisis Simulator", "Education"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-[hsl(0,0%,100%,0.4)] hover:text-[hsl(153,47%,71%)] transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Tools */}
            <div>
              <h4 className="font-medium text-sm mb-4 text-[hsl(0,0%,100%,0.7)]">AI Tools</h4>
              <ul className="space-y-2.5">
                {["Bias Mirror", "Financial Twin", "Predict the Fed", "Morning Briefing"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-[hsl(0,0%,100%,0.4)] hover:text-[hsl(153,47%,71%)] transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-medium text-sm mb-4 text-[hsl(0,0%,100%,0.7)]">Legal</h4>
              <ul className="space-y-2.5">
                {["Privacy", "Terms", "Contact"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-[hsl(0,0%,100%,0.4)] hover:text-[hsl(153,47%,71%)] transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[hsl(0,0%,100%,0.06)] flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-[hsl(0,0%,100%,0.3)]">
              © {new Date().getFullYear()} Finora. All rights reserved.
            </p>
            <p className="text-xs text-[hsl(0,0%,100%,0.2)]">
              Data sourced from Federal Reserve Economic Data (FRED)
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
