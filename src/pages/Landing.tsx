import { TrendingUp, Brain, Zap, Shield } from "lucide-react";
import HeroSection from "@/components/landing/HeroSection";
import FeatureSection from "@/components/landing/FeatureSection";
import HowItWorks from "@/components/landing/HowItWorks";
import CTASection from "@/components/landing/CTASection";
import landingVitals from "@/assets/landing-vitals.jpg";
import landingInsights from "@/assets/landing-insights.jpg";
import landingCrisis from "@/assets/landing-crisis.jpg";
import landingEducation from "@/assets/landing-education.jpg";
import logoImg from "@/assets/logo.png";

export default function Landing() {
  return (
    <div className="flex flex-col">
      <HeroSection />

      <FeatureSection
        icon={TrendingUp}
        title="Live Economic Vitals"
        description="Track the Federal Funds Rate, CPI inflation, unemployment, treasury yields, and more — each indicator translated into your personal dollar impact in real time."
        bullets={[
          "Fed rate changes → your extra debt cost",
          "Inflation rate → your savings purchasing power loss",
          "Unemployment → your income risk level",
        ]}
        image={landingVitals}
        imageAlt="Ghibli-style Renaissance astronomer's observatory with telescopes and star charts"
      />

      <FeatureSection
        icon={Brain}
        title="AI-Powered Insights"
        description="When the economy moves beyond a threshold, Finora fires a personalised insight — explaining what happened, how it hits your wallet, and what you should consider doing."
        bullets={[
          "Severity-coded alerts: green, amber, red",
          "Dollar impact in large, unmissable type",
          "3-paragraph AI lesson with 'Learn more' expansion",
        ]}
        image={landingInsights}
        imageAlt="Ghibli-style alchemist's workshop with glowing potions and ancient books"
        reverse
        dark
      />

      <FeatureSection
        icon={Zap}
        title="Crisis Simulation"
        description="Run your exact finances through the 2008 crash, COVID, the 2022 inflation surge, or 1970s stagflation. Watch month-by-month how your money would have been affected."
        bullets={[]}
        tags={["🔴 2008 Crisis", "🟠 COVID 2020", "🟡 Inflation 2022", "⚫ 1970s Stagflation"]}
        image={landingCrisis}
        imageAlt="Ghibli-style sailing ship navigating a dramatic ocean storm with lightning"
      />

      <FeatureSection
        icon={Shield}
        title="Financial Education"
        description="Learn what the Federal Funds Rate really means, how inflation erodes your savings, what a yield curve predicts — all through lessons built around your actual numbers."
        bullets={[
          "Personalised to your income and debts",
          "3-minute lessons, not lectures",
          "Comprehension quiz to lock in learning",
        ]}
        image={landingEducation}
        imageAlt="Ghibli-style grand Renaissance library with towering bookshelves and golden light"
        reverse
        dark
      />

      <HowItWorks />
      <CTASection />

      <footer className="border-t border-border bg-card">
        <div className="container py-10 sm:py-14">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <img src={logoImg} alt="Finora" className="h-8 w-8" />
                <span className="font-display text-lg font-bold text-foreground">Finora</span>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                The economy, personalised. Real-time macro data translated into your personal dollar impact.
              </p>
              <p className="rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary inline-block">
                🏆 Built for Hackonomics 2026
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Features</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Live Economic Dashboard</li>
                <li>AI-Powered Insights</li>
                <li>Crisis Simulation Engine</li>
                <li>Financial Education Hub</li>
                <li>What-If Scenario Analysis</li>
                <li>Goal Tracker with AI Nudges</li>
              </ul>
            </div>

            {/* Tech */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Powered By</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>FRED Economic Data API</li>
                <li>AI Language Models</li>
                <li>Real-time Data Processing</li>
                <li>Personalised Financial Modeling</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Finora. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-muted-foreground">
              <span className="cursor-pointer transition-colors hover:text-foreground">Privacy Policy</span>
              <span className="cursor-pointer transition-colors hover:text-foreground">Terms of Service</span>
              <span className="cursor-pointer transition-colors hover:text-foreground">Contact</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
