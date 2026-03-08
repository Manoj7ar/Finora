import { motion } from "framer-motion";
import { Users } from "lucide-react";

// Mock company logos as styled text (in a real app, these would be SVG logos)
const companies = [
  { name: "TechCrunch", style: "font-bold tracking-tight" },
  { name: "Forbes", style: "font-serif italic" },
  { name: "Bloomberg", style: "font-mono uppercase tracking-widest text-xs" },
  { name: "WSJ", style: "font-serif font-bold" },
  { name: "Reuters", style: "font-sans tracking-wide" },
  { name: "CNBC", style: "font-bold uppercase" },
  { name: "Wired", style: "font-mono" },
  { name: "Fast Company", style: "font-sans italic" },
];

export default function SocialProofMarquee() {
  return (
    <section className="relative border-y border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      <div className="py-8">
        {/* Join counter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mb-6 flex items-center justify-center gap-6"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-primary/60 to-secondary/60 flex items-center justify-center text-[10px] font-bold text-primary-foreground"
                >
                  {["JD", "MK", "AS", "LW"][i]}
                </div>
              ))}
            </div>
            <span className="ml-2">
              <span className="font-semibold text-foreground">127</span> people joined this week
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Trusted by <span className="font-semibold text-foreground">12,000+</span> users</span>
          </div>
        </motion.div>

        {/* Logo marquee */}
        <div className="marquee-container">
          <div className="marquee-track">
            {[...companies, ...companies, ...companies].map((company, i) => (
              <div
                key={i}
                className={`marquee-item flex items-center justify-center px-8 py-2 text-muted-foreground/50 hover:text-muted-foreground transition-colors ${company.style}`}
              >
                <span className="text-lg whitespace-nowrap">{company.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Featured in text */}
        <p className="text-center text-xs text-muted-foreground/60 mt-4 uppercase tracking-widest">
          As featured in
        </p>
      </div>
    </section>
  );
}
