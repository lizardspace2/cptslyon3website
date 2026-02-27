import { Button } from "@/components/ui/button";
import { Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const NewsletterSection = () => {
  return (
    <section className="py-20 bg-section-alt">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Inscription newsletter
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Ne ratez aucun événement ni actualité, inscrivez-vous à la newsletter de la CPTS.
            </p>
            <Button variant="hero" size="lg" asChild>
              <a href="mailto:cptslyon3@gmail.com?subject=Inscription newsletter">
                <Mail className="w-5 h-5" />
                S'inscrire à la newsletter
              </a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-xl shadow-card p-8"
          >
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Newsletter</span>
            <h3 className="text-xl font-bold text-foreground mt-2 mb-3">Newsletter Janvier 2026</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Retrouvez les dernières nouvelles de la CPTS Lyon 3 dans notre newsletter mensuelle.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" asChild>
                <Link to="/actualites">
                  Lire la newsletter
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/actualites">Voir toutes les newsletters</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
