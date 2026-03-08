import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import logoImg from "@/assets/logo.png";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-primary/20 via-secondary/10 to-primary/20 rounded-full blur-3xl opacity-30" />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-primary/10"
            style={{
              width: 100 + i * 80,
              height: 100 + i * 80,
              left: `${20 + i * 10}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="container relative z-10 py-32 sm:py-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl font-bold text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Ready to understand
            <span className="block mt-2 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] bg-clip-text text-transparent animate-gradient">
              your economy?
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-lg text-muted-foreground leading-relaxed sm:text-xl max-w-2xl mx-auto"
          >
            Join 12,000+ users who've transformed how they understand economic data. 
            Set up your profile in 60 seconds — live data, AI insights, and crisis preparedness await.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col items-center gap-4"
          >
            <Link to="/auth">
              <Button
                size="lg"
                className="group gap-2 rounded-xl bg-primary px-10 py-6 text-base font-semibold text-primary-foreground shadow-2xl shadow-primary/30 transition-all hover:shadow-primary/50 hover:scale-[1.02]"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              No credit card • No spam • Just clarity
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50">
        <div className="container py-12">
          <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="Finora" className="h-8 w-8" />
              <div>
                <span className="font-display text-lg font-bold text-foreground">Finora</span>
                <p className="text-xs text-muted-foreground">The economy, personalised.</p>
              </div>
            </div>

            {/* Links */}
            <div className="flex gap-8 text-sm text-muted-foreground">
              <a href="#" className="transition-colors hover:text-foreground">Privacy</a>
              <a href="#" className="transition-colors hover:text-foreground">Terms</a>
              <a href="#" className="transition-colors hover:text-foreground">Contact</a>
              <a href="#" className="transition-colors hover:text-foreground">Twitter</a>
            </div>

            {/* Copyright */}
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Finora
            </p>
          </div>

          {/* Easter egg hint */}
          <p className="mt-8 text-center text-[10px] text-muted-foreground/30">
            Hint: Try clicking the logo 5 times in the hero ↑
          </p>
        </div>
      </footer>
    </section>
  );
}
