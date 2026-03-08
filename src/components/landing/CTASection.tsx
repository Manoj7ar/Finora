import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6 },
});

export default function CTASection() {
  return (
    <section className="border-t border-border bg-background">
      <div className="container py-28 lg:py-36">
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
