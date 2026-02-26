import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import carteImage from "@/assets/carte-lyon5.jpg";

const TerritorySection = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <img
              src={carteImage}
              alt="Carte du territoire Lyon 5"
              className="rounded-2xl shadow-card w-full"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
              Le territoire de la CPTS Lyon 5
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Le 5ème arrondissement de Lyon regroupe une population d'environ 48 000 habitants répartis sur plusieurs quartiers emblématiques : le Vieux Lyon, Fourvière, Saint‑Just, Point‑du‑Jour, Ménival, Champvert.
            </p>
            <Button variant="default" size="lg" asChild>
              <Link to="/presentation">
                En savoir plus
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TerritorySection;
