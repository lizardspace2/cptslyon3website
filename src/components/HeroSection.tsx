import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/lyon-3-pont-lafayette.jpg";

const HeroSection = () => {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden bg-white">
      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 border border-sky-100 text-sky-700 text-sm font-bold mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              CPTS Lyon 3e Arrondissement
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-navy leading-[1.1] mb-8">
              Agir ensemble pour la <span className="text-sky-600">santé</span> des Lyonnais.
            </h1>
            
            <p className="text-xl text-navy/70 mb-10 leading-relaxed max-w-xl">
              La CPTS Lyon 3 rassemble les professionnels de santé du territoire pour construire des solutions concrètes et améliorer l'accès aux soins.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button size="xl" className="bg-navy hover:bg-navy/90 text-white rounded-full px-10 h-16 text-lg font-bold shadow-xl shadow-navy/20 active:scale-95 transition-transform" asChild>
                <Link to="/presentation">
                  Découvrir nos missions
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" className="border-navy/10 text-navy hover:bg-navy/5 rounded-full px-10 h-16 text-lg font-bold active:scale-95 transition-transform" asChild>
                <Link to="/espace-adherent">
                  <LogIn className="mr-2 w-5 h-5" />
                  Espace Adhérent
                </Link>
              </Button>
            </div>
            
            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-sky-100 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="Pro de santé" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-semibold text-navy/60">
                <span className="text-navy font-bold">67 professionnels</span> nous font confiance
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl shadow-navy/10">
              <img 
                src={heroImage} 
                alt="Pont Lafayette, Lyon 3" 
                className="w-full h-[500px] lg:h-[700px] object-cover hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent pointer-events-none" />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FCE280] rounded-full blur-3xl opacity-60 -z-10 animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-sky-100 rounded-full blur-3xl opacity-80 -z-10" />
            
            <div className="absolute top-1/2 -left-12 lg:-left-24 transform -translate-y-1/2 hidden md:block z-30">
              <div className="bg-white/95 backdrop-blur-md p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(21,42,66,0.1)] border border-white/50 max-w-[240px] hover:-translate-y-2 transition-transform duration-500">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
                    <ArrowRight className="w-6 h-6 -rotate-45" />
                  </div>
                  <span className="font-display font-black text-navy uppercase tracking-widest text-[10px]">Proximité</span>
                </div>
                <p className="text-sm text-navy/60 leading-relaxed font-bold italic">
                  Un réseau local de soins à l'écoute du 3ème arrondissement.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
