import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, MapPin, Briefcase } from "lucide-react";

const figures = [
  { value: 120, label: "Adhérents", icon: Users, suffix: "" },
  { value: 40000, label: "Habitants", icon: MapPin, suffix: "" },
  { value: 8, label: "Salariés", icon: Briefcase, suffix: "" },
];

const AnimatedCounter = ({ target, duration = 2 }: { target: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = target / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count.toLocaleString("fr-FR")}</span>;
};

const KeyFigures = () => {
  return (
    <section className="py-20 bg-navy text-navy-foreground">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-display font-bold text-center mb-14"
        >
          Quelques chiffres clés
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {figures.map((fig, i) => {
            const Icon = fig.icon;
            return (
              <motion.div
                key={fig.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-navy-foreground/10 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-green-light" />
                </div>
                <div className="text-4xl md:text-5xl font-display font-bold mb-2">
                  <AnimatedCounter target={fig.value} />
                  {fig.suffix}
                </div>
                <div className="text-sm uppercase tracking-wider text-navy-foreground/60 font-medium">
                  {fig.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default KeyFigures;
