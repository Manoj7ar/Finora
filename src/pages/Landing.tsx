import HeroSection from "@/components/landing/HeroSection";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import HowItWorks from "@/components/landing/HowItWorks";
import CTASection from "@/components/landing/CTASection";
import logoImg from "@/assets/logo.png";

export default function Landing() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturesGrid />
      <HowItWorks />
      <CTASection />

      <footer className="border-t border-border bg-card">
        <div className="container py-10 sm:py-14">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <img src={logoImg} alt="Finora" className="h-8 w-8" />
              <span className="font-display text-lg font-bold text-foreground">Finora</span>
            </div>

            <p className="text-sm text-muted-foreground">
              The economy, personalised.
            </p>

            <div className="flex gap-6 text-xs text-muted-foreground">
              <span className="cursor-pointer transition-colors hover:text-foreground">Privacy</span>
              <span className="cursor-pointer transition-colors hover:text-foreground">Terms</span>
              <span className="cursor-pointer transition-colors hover:text-foreground">Contact</span>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground sm:mt-4">
            © {new Date().getFullYear()} Finora. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
