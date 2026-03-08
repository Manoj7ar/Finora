import { motion } from "framer-motion";
import landingAdvisor from "@/assets/landing-advisor.jpg";

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
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            How It Works
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
            Three steps to clarity
          </h2>
        </motion.div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Image */}
          <motion.div {...fadeIn(0.1)}>
            <div className="overflow-hidden rounded-2xl shadow-card-hover sm:rounded-3xl">
              <img
                src={landingAdvisor}
                alt="Renaissance scholar's desk with glowing crystal orb showing financial data"
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* Steps */}
          <div className="space-y-8">
            {steps.map((item, i) => (
              <motion.div
                key={item.step}
                {...fadeIn(i * 0.15)}
                className="group flex gap-5"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-foreground text-background shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <span className="font-mono text-lg font-bold">
                    {item.step}
                  </span>
                </div>
                <div>
                  <h3 className="mb-2 font-display text-lg font-semibold text-foreground sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
