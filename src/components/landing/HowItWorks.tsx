import { motion } from "framer-motion";

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6 },
});

const steps = [
  {
    step: "01",
    title: "Tell Us About You",
    desc: "Answer five quick questions about your income, debts, savings, location, and investments.",
  },
  {
    step: "02",
    title: "See Your Vitals",
    desc: "Your dashboard lights up with live economic data — each indicator translated into your personal dollar impact.",
  },
  {
    step: "03",
    title: "Learn & Prepare",
    desc: "AI-generated insights, crisis simulations, and lessons — all built around your actual numbers.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-background">
      <div className="container py-20 sm:py-24 lg:py-32">
        <motion.div {...fadeIn()} className="mb-12 text-center sm:mb-16">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-primary">
            How It Works
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
            Three steps to clarity
          </h2>
        </motion.div>
        <div className="grid gap-8 sm:gap-12 md:grid-cols-3">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              {...fadeIn(i * 0.15)}
              className="group text-center"
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary transition-transform duration-300 group-hover:scale-110">
                <span className="font-mono text-xl font-bold text-primary-foreground">
                  {item.step}
                </span>
              </div>
              <h3 className="mb-3 font-display text-lg font-semibold text-foreground sm:text-xl">
                {item.title}
              </h3>
              <p className="mx-auto max-w-xs leading-relaxed text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
