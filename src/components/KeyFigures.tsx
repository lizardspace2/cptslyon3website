import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, MapPin, Briefcase } from "lucide-react";

const figures = [
  { value: 102000, label: "Habitants couverts", icon: MapPin, color: "text-sky-600", bg: "bg-sky-50" },
  { value: 577, label: "Professionnels de santé", icon: Briefcase, color: "text-emerald-600", bg: "bg-emerald-50" },
  { value: 90, label: "Adhérents", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
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
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#F4F9FD]/50 rounded-l-[10rem] -z-10" />
      
      <div className="container">
        <div className="flex flex-col lg:flex-row items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full border border-navy/10 text-navy/60 font-bold text-sm mb-6 bg-white"
            >
              Notre Impact
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-display font-bold text-navy"
            >
              La CPTS Lyon 3 en quelques chiffres
            </motion.h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {figures.map((fig, i) => {
            const Icon = fig.icon;
            return (
              <motion.div
                key={fig.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white rounded-[2rem] p-10 shadow-xl shadow-navy/[0.04] border border-navy/5 flex flex-col items-center text-center group active:scale-95 transition-transform"
              >
                <div className={`w-20 h-20 rounded-2xl ${fig.bg} flex items-center justify-center mb-8 transform group-hover:rotate-6 transition-transform duration-500`}>
                  <Icon className={`w-10 h-10 ${fig.color}`} strokeWidth={2} />
                </div>
                <div className="text-4xl md:text-5xl font-display font-bold text-navy mb-4">
                  <AnimatedCounter target={fig.value} />
                </div>
                <div className="text-navy/50 font-bold text-sm uppercase tracking-[0.15em]">
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
