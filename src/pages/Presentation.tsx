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
                Créée en novembre 2025, la CPTS Lyon 3 est une démarche portée par et pour tous les professionnels de santé du territoire. Elle s’appuie sur une conviction forte : les besoins du terrain sont le point de départ et le fondement de leurs actions.
              </p>
              <h3 className="text-2xl font-display font-bold text-foreground mt-10 mb-4">Les missions</h3>
              <ul className="space-y-3 text-muted-foreground mb-10">
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

              <h3 className="text-2xl font-display font-bold text-foreground mt-10 mb-4">Les référents de la CPTS</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 not-prose">
                <div className="bg-card p-6 rounded-xl border">
                  <h4 className="font-bold text-lg mb-1">David Ciabrini</h4>
                  <p className="text-sm text-primary font-medium mb-3">Médecin Généraliste, Président de la CPTS</p>
                  <a href="mailto:cptslyon3@gmail.com" className="text-sm text-muted-foreground hover:text-primary">cptslyon3@gmail.com</a>
                </div>
                <div className="bg-card p-6 rounded-xl border">
                  <h4 className="font-bold text-lg mb-1">Camille Bordagaray</h4>
                  <p className="text-sm text-primary font-medium mb-3">Chargée de Mission en Santé</p>
                  <a href="mailto:cptslyon3@gmail.com" className="text-sm text-muted-foreground hover:text-primary">cptslyon3@gmail.com</a>
                </div>
                <div className="bg-card p-6 rounded-xl border">
                  <h4 className="font-bold text-lg mb-1">Elsa Châlons-Cottavoz</h4>
                  <p className="text-sm text-primary font-medium mb-3">Kiné, Vice-Présidente de la CPTS</p>
                  <a href="mailto:cptslyon3@gmail.com" className="text-sm text-muted-foreground hover:text-primary">cptslyon3@gmail.com</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Presentation;
