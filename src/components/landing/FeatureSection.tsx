import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { delay, duration: 0.6 },
});

interface FeatureSectionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  bullets: string[];
  image: string;
  imageAlt: string;
  reverse?: boolean;
  dark?: boolean;
  tags?: string[];
}

export default function FeatureSection({
  icon: Icon,
  title,
  description,
  bullets,
  image,
  imageAlt,
  reverse = false,
  dark = false,
  tags,
}: FeatureSectionProps) {
  return (
    <section className={dark ? "border-y border-border bg-card" : "bg-background"}>
      <div className="container py-20 sm:py-24 lg:py-32">
        <div className="grid items-center gap-10 sm:gap-16 lg:grid-cols-2">
          {/* Text */}
          <motion.div
            {...fadeIn()}
            className={reverse ? "order-2 lg:order-2" : "order-2 lg:order-1"}
          >
            <div className="mb-5 inline-flex rounded-2xl bg-foreground/[0.06] p-3.5">
              <Icon className="h-6 w-6 text-foreground" />
            </div>
            <h2 className="mb-5 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              {title}
            </h2>
            <p className="mb-8 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </p>

            {tags ? (
              <div className="flex flex-wrap gap-2.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-accent/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <ul className="space-y-3.5">
                {bullets.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-start gap-3 text-muted-foreground"
                  >
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <span className="leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>

          {/* Image */}
          <motion.div
            {...fadeIn(0.15)}
            className={reverse ? "order-1 lg:order-1" : "order-1 lg:order-2"}
          >
            <div className="overflow-hidden rounded-2xl shadow-card-hover sm:rounded-3xl">
              <img
                src={image}
                alt={imageAlt}
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-[1.03] sm:aspect-square"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
