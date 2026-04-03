import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface PageBannerProps {
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href: string }[];
}

const PageBanner = ({ title, subtitle, breadcrumb }: PageBannerProps) => {
  return (
    <section className="relative py-10 bg-navy text-navy-foreground overflow-hidden border-b border-white/5">
      {/* Premium Decorative elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 animate-pulse opacity-60" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(14,165,233,0.05),transparent_50%)]" />

      <div className="container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-block px-3 py-1 mb-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
        >
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-sky-400">
            CPTS Lyon 3 • Espace Information
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 tracking-tight leading-[1.1]"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-base md:text-lg text-navy-foreground/60 max-w-2xl mx-auto font-medium leading-relaxed italic"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
};

export default PageBanner;
