import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const Presentation = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Page banner */}
        <section className="relative py-24 bg-navy text-navy-foreground">
          <div className="container text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-display font-bold"
            >
              Présentation
            </motion.h1>
            <p className="mt-4 text-navy-foreground/60">Accueil &gt; Présentation</p>
          </div>
        </section>

        <section className="py-20">
          <div className="container max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-display font-bold text-foreground mb-6">Présentation de la CPTS</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                La Communauté Professionnelle Territoriale de Santé Lyon 3 est une association loi 1901, créée le 12 mars 2021, qui a pour objectif de coordonner et structurer l'offre de soins sur le territoire du 3ème arrondissement de Lyon (population de 48 277 habitants — INSEE, 2022).
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Nous avons signé un contrat d'objectifs et de financement avec l'Assurance Maladie du Rhône et l'ARS Auvergne-Rhône-Alpes en septembre 2023.
              </p>
              <h3 className="text-2xl font-display font-bold text-foreground mt-10 mb-4">Les missions</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0" />
                  Améliorer l'accès aux soins sur le territoire
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0" />
                  Organiser les parcours de soins des patients
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0" />
                  Développer des actions de prévention
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0" />
                  Favoriser la coordination entre professionnels de santé
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Presentation;
