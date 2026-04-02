import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const SearchProSection = () => {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-navy rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-navy/20"
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-lg border border-white/10">
              <Search className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-8 leading-tight">
              Trouvez votre professionnel de santé
            </h2>
            
            <p className="text-xl md:text-2xl text-white/70 mb-12 font-medium leading-relaxed">
              Médecin généraliste, kinésithérapeute, infirmière libérale… accédez facilement à l'annuaire complet du territoire.
            </p>
            
            <Button size="xl" className="bg-sky-500 hover:bg-sky-600 text-white rounded-full px-12 h-16 text-lg font-bold shadow-xl shadow-sky-500/20 active:scale-95 transition-transform" asChild>
              <Link to="/annuaire">
                Consulter l'annuaire
                <ArrowRight className="ml-3 w-6 h-6" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SearchProSection;
