import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const SearchProSection = () => {
  return (
    <section className="py-20 bg-gradient-primary text-primary-foreground">
      <div className="container text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <Search className="w-12 h-12 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Vous recherchez un professionnel de santé ?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Médecin généraliste, kinésithérapeute, diététicien, infirmière libérale… retrouvez le professionnel dont vous avez besoin !
          </p>
          <Button variant="hero-outline" size="xl" asChild>
            <Link to="/annuaire">
              <Search className="w-5 h-5" />
              Accéder à l'annuaire
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default SearchProSection;
