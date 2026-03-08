import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Percent, DollarSign, BarChart3 } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import logoImg from "@/assets/logo.png";

// Floating particle component
const FloatingParticle = ({ 
  icon: Icon, 
  delay, 
  duration, 
  x, 
  y, 
  size = 24 
}: { 
  icon: React.ElementType; 
  delay: number; 
  duration: number; 
  x: string; 
  y: string; 
  size?: number;
}) => (
  <motion.div
    className="absolute text-primary/20 dark:text-primary/10"
    style={{ left: x, top: y }}
    animate={{
      y: [0, -30, 0],
      x: [0, 15, 0],
      rotate: [0, 10, -10, 0],
      opacity: [0.3, 0.6, 0.3],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <Icon size={size} strokeWidth={1.5} />
  </motion.div>
);

// Typewriter effect hook
const useTypewriter = (text: string, speed: number = 50) => {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayText, isComplete };
};

// Counter animation hook
const useCounter = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const startCounting = () => {
    if (hasStarted) return;
    setHasStarted(true);
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  };

  return { count, startCounting };
};

// Live ticker data
const tickerItems = [
  { label: "Fed Rate", value: "5.25%", trend: "stable" },
  { label: "Inflation", value: "2.9%", trend: "down" },
  { label: "Unemployment", value: "3.7%", trend: "stable" },
  { label: "10Y Treasury", value: "4.2%", trend: "up" },
  { label: "S&P 500", value: "+0.8%", trend: "up" },
  { label: "GDP Growth", value: "2.1%", trend: "up" },
];

// Magnetic button component
const MagneticButton = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = (e.clientX - centerX) * 0.15;
    const distY = (e.clientY - centerY) * 0.15;
    x.set(distX);
    y.set(distY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
};

export default function HeroSectionNew() {
  const { displayText, isComplete } = useTypewriter("Economic Intelligence,", 40);
  const usersCounter = useCounter(12847);
  const insightsCounter = useCounter(89);
  const [logoClicks, setLogoClicks] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  // Easter egg: click logo 5 times
  const handleLogoClick = () => {
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    if (newCount >= 5) {
      setShowEasterEgg(true);
      setTimeout(() => setShowEasterEgg(false), 3000);
      setLogoClicks(0);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="gradient-blob gradient-blob-1" />
        <div className="gradient-blob gradient-blob-2" />
        <div className="gradient-blob gradient-blob-3" />
        {/* Noise texture overlay */}
        <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingParticle icon={DollarSign} delay={0} duration={6} x="10%" y="20%" size={32} />
        <FloatingParticle icon={Percent} delay={1} duration={7} x="85%" y="15%" size={28} />
        <FloatingParticle icon={TrendingUp} delay={0.5} duration={8} x="75%" y="60%" size={36} />
        <FloatingParticle icon={BarChart3} delay={2} duration={6.5} x="15%" y="70%" size={30} />
        <FloatingParticle icon={DollarSign} delay={1.5} duration={7.5} x="90%" y="75%" size={24} />
        <FloatingParticle icon={Percent} delay={0.8} duration={6} x="5%" y="45%" size={20} />
        <FloatingParticle icon={TrendingUp} delay={2.5} duration={8} x="60%" y="85%" size={28} />
      </div>

      {/* Easter egg message */}
      {showEasterEgg && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-lg"
        >
          🎉 You found the secret! Built with 💚 by the Finora team
        </motion.div>
      )}

      {/* Main content */}
      <div className="container relative z-10 flex min-h-screen flex-col justify-center pb-24 pt-32">
        {/* Logo badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <button
            onClick={handleLogoClick}
            className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:border-primary/30 hover:bg-card"
          >
            <img src={logoImg} alt="Finora" className="h-5 w-5" />
            <span>Introducing Finora</span>
            <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">Beta</span>
          </button>
        </motion.div>

        {/* Headline with typewriter */}
        <div className="max-w-4xl">
          <h1 className="font-display text-5xl font-bold leading-[1.1] text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="inline-block">
              {displayText}
              {!isComplete && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="ml-1 inline-block w-1 h-[0.8em] bg-primary align-middle"
                />
              )}
            </span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isComplete ? 1 : 0, y: isComplete ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-2 block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient"
            >
              Tailored to You
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            Stop guessing how the economy affects you. Finora translates Federal Reserve decisions, 
            inflation data, and market shifts into{" "}
            <span className="text-foreground font-medium">personalized dollar-impact insights</span> — 
            in real time.
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
            className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
          >
            <MagneticButton>
              <Link to="/auth">
                <Button
                  size="lg"
                  className="group gap-2 rounded-xl bg-primary px-8 py-6 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary hover:shadow-xl hover:shadow-primary/30"
                >
                  Start Free — 60 Seconds
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </MagneticButton>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Live data
              </span>
              <span className="text-border">•</span>
              <span>No credit card</span>
            </div>
          </motion.div>

          {/* Stats row with counters */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            onViewportEnter={() => {
              usersCounter.startCounting();
              insightsCounter.startCounting();
            }}
            transition={{ duration: 0.6, delay: 2 }}
            className="mt-16 flex flex-wrap gap-12 border-t border-border/50 pt-8"
          >
            {[
              { value: usersCounter.count.toLocaleString() + "+", label: "Users tracking their economy" },
              { value: insightsCounter.count + "%", label: "Avg. clarity improvement" },
              { value: "6", label: "Live economic indicators" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2 + i * 0.15 }}
              >
                <p className="font-mono text-3xl font-bold text-foreground sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Live ticker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.5 }}
          className="absolute bottom-8 left-0 right-0"
        >
          <div className="container">
            <div className="flex items-center gap-3 overflow-hidden rounded-xl border border-border/50 bg-card/30 backdrop-blur-md px-4 py-3">
              <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground shrink-0">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse-live" />
                LIVE
              </span>
              <div className="ticker-wrapper overflow-hidden flex-1">
                <div className="ticker-content">
                  {[...tickerItems, ...tickerItems].map((item, i) => (
                    <span key={i} className="ticker-item inline-flex items-center gap-2 px-4">
                      <span className="text-muted-foreground text-sm">{item.label}</span>
                      <span className={`font-mono text-sm font-semibold ${
                        item.trend === "up" ? "text-green-600 dark:text-green-400" : 
                        item.trend === "down" ? "text-red-600 dark:text-red-400" : 
                        "text-foreground"
                      }`}>
                        {item.value}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
