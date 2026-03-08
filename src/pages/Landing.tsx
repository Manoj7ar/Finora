import HeroSectionNew from "@/components/landing/HeroSectionNew";
import SocialProofMarquee from "@/components/landing/SocialProofMarquee";
import BentoFeatures from "@/components/landing/BentoFeatures";
import HowItWorksTimeline from "@/components/landing/HowItWorksTimeline";
import FinalCTA from "@/components/landing/FinalCTA";

export default function Landing() {
  return (
    <div className="flex flex-col">
      <HeroSectionNew />
      <SocialProofMarquee />
      <BentoFeatures />
      <HowItWorksTimeline />
      <FinalCTA />
    </div>
  );
}
