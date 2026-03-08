import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Brain, Zap, Target, BookOpen, MessageSquare, AlertTriangle } from "lucide-react";
import { useState } from "react";

const features = [
  {
    icon: TrendingUp,
    title: "Live Economic Vitals",
    description: "Track Fed rates, inflation, unemployment, and treasury yields — each translated into your personal dollar impact.",
    size: "large",
    accent: "primary",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Receive personalized alerts when the economy moves, explaining what it means for your wallet.",
    size: "medium",
    accent: "secondary",
  },
  {
    icon: Zap,
    title: "Crisis Simulations",
    description: "Run your finances through 2008 or COVID scenarios.",
    size: "medium",
    accent: "warning",
    isInteractive: true,
  },
  {
    icon: Target,
    title: "Goal Tracking",
    description: "Set financial goals with AI nudges that adapt to economic conditions.",
    size: "medium",
    accent: "primary",
  },
  {
    icon: BookOpen,
    title: "Economic Education",
    description: "Learn complex concepts through bite-sized lessons tailored to your level.",
    size: "medium",
    accent: "secondary",
  },
  {
    icon: MessageSquare,
    title: "AI Financial Advisor",
    description: "Chat with an AI that knows both the economy and your personal situation.",
    size: "large",
    accent: "primary",
  },
];

// Interactive crisis simulation demo
const CrisisDemo = ({ isActive }: { isActive: boolean }) => {
  const crisisData = [
    { label: "Portfolio", before: "$50,000", after: "$32,500", change: "-35%" },
    { label: "Monthly Income", before: "$6,000", after: "$4,200", change: "-30%" },
    { label: "Emergency Fund", before: "6 months", after: "4 months", change: "-33%" },
  ];

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 space-y-2 overflow-hidden"
        >
          <div className="flex items-center gap-2 text-xs text-warning font-medium mb-3">
            <AlertTriangle className="h-3 w-3" />
            <span>2008 Financial Crisis Simulation</span>
          </div>
          {crisisData.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between text-xs"
            >
              <span className="text-muted-foreground">{item.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground line-through">{item.before}</span>
                <span className="text-red-500 font-mono font-semibold">{item.after}</span>
                <span className="text-red-500/70 text-[10px]">{item.change}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function BentoFeatures() {
  const [activeDemo, setActiveDemo] = useState(false);

  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="inline-block mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Features
          </span>
          <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl md:text-6xl">
            Everything you need,
            <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              nothing you don't
            </span>
          </h2>
        </motion.div>

        {/* Bento grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
          {features.map((feature, i) => {
            const isLarge = feature.size === "large";
            const isInteractive = feature.isInteractive;
            
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -4, scale: 1.01 }}
                onClick={() => isInteractive && setActiveDemo(!activeDemo)}
                className={`
                  group relative overflow-hidden rounded-2xl border border-border/50 
                  bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm
                  p-6 sm:p-8 transition-all duration-300
                  hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5
                  ${isLarge ? "lg:col-span-1 lg:row-span-2" : ""}
                  ${isInteractive ? "cursor-pointer" : ""}
                `}
              >
                {/* Glass reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent pointer-events-none" />
                
                {/* Icon with glow */}
                <div className={`
                  relative mb-6 inline-flex rounded-xl p-3 
                  ${feature.accent === "primary" ? "bg-primary/10 text-primary" : ""}
                  ${feature.accent === "secondary" ? "bg-secondary/10 text-secondary" : ""}
                  ${feature.accent === "warning" ? "bg-warning/10 text-warning" : ""}
                `}>
                  <feature.icon className="h-6 w-6" strokeWidth={1.5} />
                  {/* Icon glow */}
                  <div className={`
                    absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity
                    ${feature.accent === "primary" ? "bg-primary" : ""}
                    ${feature.accent === "secondary" ? "bg-secondary" : ""}
                    ${feature.accent === "warning" ? "bg-warning" : ""}
                  `} />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-semibold text-foreground mb-2 sm:text-2xl">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {feature.description}
                </p>

                {/* Interactive demo for crisis card */}
                {isInteractive && (
                  <>
                    <div className="mt-4 text-xs text-muted-foreground">
                      {activeDemo ? "Click to close" : "Click to try simulation →"}
                    </div>
                    <CrisisDemo isActive={activeDemo} />
                  </>
                )}

                {/* Corner accent */}
                <div className={`
                  absolute -bottom-8 -right-8 h-24 w-24 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity
                  ${feature.accent === "primary" ? "bg-primary" : ""}
                  ${feature.accent === "secondary" ? "bg-secondary" : ""}
                  ${feature.accent === "warning" ? "bg-warning" : ""}
                `} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
