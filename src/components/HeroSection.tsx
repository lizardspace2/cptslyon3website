import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-lyon5.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Vue aérienne de Lyon 3ème" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/75 to-navy/40" />
      </div>

      <div className="container relative z-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-navy-foreground leading-tight mb-4">
            Bienvenue sur le site de la{" "}
            <span className="text-gradient">CPTS Lyon 3</span>
          </h1>
          <p className="text-lg md:text-xl font-semibold text-navy-foreground/80 mb-2">
            Communauté Professionnelle Territoriale de Santé
          </p>
          <p className="text-base md:text-lg text-navy-foreground/70 mb-8 leading-relaxed max-w-xl">
            La CPTS Lyon 3 rassemble les professionnels de santé du territoire pour améliorer la coordination des soins, la prévention et l'accès à la santé.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="hero" size="lg" asChild>
              <Link to="/presentation">
                En savoir plus
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="lg" asChild>
              <Link to="/espace-adherent">
                <LogIn className="w-5 h-5" />
                Accéder à l'espace adhérent
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
