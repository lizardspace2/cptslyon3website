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
    <section className="relative py-24 bg-navy text-navy-foreground overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <div className="container relative z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 tracking-tight"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-lg md:text-xl text-navy-foreground/80 max-w-2xl mx-auto font-medium"
          >
            {subtitle}
          </motion.p>
        )}

        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 flex justify-center items-center gap-2 text-sm font-medium"
        >
          <Link to="/" className="text-navy-foreground/60 hover:text-white transition-colors">
            Accueil
          </Link>
          <ChevronRight className="w-4 h-4 text-navy-foreground/40" />
          
          {breadcrumb && breadcrumb.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <Link to={item.href} className="text-navy-foreground/60 hover:text-white transition-colors">
                {item.label}
              </Link>
              <ChevronRight className="w-4 h-4 text-navy-foreground/40" />
            </div>
          ))}
          
          <span className="text-primary font-bold">{title}</span>
        </motion.nav>
      </div>
    </section>
  );
};

export default PageBanner;
