import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/landing-hero.jpg";

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6 },
});

export default function CTASection() {
  return (
    <section className="relative overflow-hidden border-t border-border">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          className="h-full w-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </div>

      <div className="container relative z-10 py-28 lg:py-36">
        <motion.div {...fadeIn()} className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
            Ready to understand your economy?
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Set up your financial profile in 60 seconds. Finora does the rest —
            live data, AI insights, and crisis preparedness.
          </p>
          <motion.div {...fadeIn(0.15)} className="mt-10">
            <Link to="/auth">
              <Button
                size="lg"
                className="gap-2 rounded-xl bg-primary px-10 text-lg shadow-lg transition-all hover:bg-finora-green-hover hover:shadow-xl"
              >
                Get Started Free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
