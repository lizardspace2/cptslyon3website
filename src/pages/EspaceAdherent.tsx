import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Shield, Users, Heart, CheckCircle2, ArrowRight, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const avantages = [
  {
    icon: Users,
    title: "Réseau professionnel",
    description: "Intégrez un réseau de professionnels de santé engagés pour améliorer le parcours de soins.",
  },
  {
    icon: Shield,
    title: "Formations & webinaires",
    description: "Accédez à des formations continues et des webinaires exclusifs gratuits.",
  },
  {
    icon: Heart,
    title: "Coordination facilitée",
    description: "Bénéficiez d'outils de coordination et de protocoles partagés entre professionnels.",
  },
];

const tarifs = [
  { profession: "Médecin", cotisation: "50 €/an" },
  { profession: "Infirmier(ère)", cotisation: "30 €/an" },
  { profession: "Kinésithérapeute", cotisation: "30 €/an" },
  { profession: "Pharmacien(ne)", cotisation: "40 €/an" },
  { profession: "Autre professionnel de santé", cotisation: "25 €/an" },
];

const faq = [
  {
    q: "Qui peut adhérer à la CPTS Lyon 5 ?",
    a: "Tous les professionnels de santé exerçant sur le territoire de Lyon 5ème (libéraux, salariés de structures de soins, etc.) peuvent adhérer à la CPTS.",
  },
  {
    q: "Comment fonctionne l'adhésion ?",
    a: "Il suffit de remplir le formulaire d'adhésion et de régler la cotisation annuelle. Vous recevrez ensuite vos accès à l'espace adhérent en ligne.",
  },
  {
    q: "Quels sont les engagements de l'adhérent ?",
    a: "L'adhérent s'engage à respecter la charte de la CPTS, à participer aux réunions plénières (au moins une par an) et à contribuer à la coordination des soins sur le territoire.",
  },
  {
    q: "Puis-je résilier mon adhésion ?",
    a: "Oui, vous pouvez résilier votre adhésion à tout moment par courrier ou email. La cotisation de l'année en cours n'est pas remboursable.",
  },
];

const EspaceAdherent = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative py-24 bg-navy text-navy-foreground">
          <div className="container text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-display font-bold"
            >
              Espace adhérent
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-lg text-navy-foreground/80 max-w-2xl mx-auto"
            >
              Rejoignez la communauté des professionnels de santé de Lyon 5 et participez à la coordination des soins.
            </motion.p>
          </div>
        </section>

        {/* Avantages */}
        <section className="py-16">
          <div className="container max-w-5xl">
            <h2 className="text-2xl font-display font-bold text-center mb-12">Pourquoi adhérer ?</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {avantages.map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card className="text-center h-full hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                        <a.icon className="w-7 h-7" />
                      </div>
                      <CardTitle className="text-lg">{a.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">{a.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Cotisations */}
        <section className="py-16 bg-muted/50">
          <div className="container max-w-3xl">
            <h2 className="text-2xl font-display font-bold text-center mb-8">Cotisations annuelles</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-0 divide-y">
                  {tarifs.map((t, i) => (
                    <div key={i} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                      <span className="font-medium">{t.profession}</span>
                      <span className="font-display font-bold text-primary text-lg">{t.cotisation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="text-center mt-10">
              <Button size="lg" asChild>
                <Link to="/contact">
                  <ArrowRight className="w-4 h-4" />
                  Demander à adhérer
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                Ou contactez-nous : <Mail className="w-3 h-3 inline" /> contact@cptslyon5.fr · <Phone className="w-3 h-3 inline" /> 04 XX XX XX XX
              </p>
            </div>
          </div>
        </section>

        {/* Inclus */}
        <section className="py-16">
          <div className="container max-w-3xl">
            <h2 className="text-2xl font-display font-bold text-center mb-8">Ce qui est inclus</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                "Accès à l'annuaire des adhérents",
                "Formations et webinaires gratuits",
                "Outils de coordination partagés",
                "Newsletter mensuelle réservée",
                "Participation aux groupes de travail",
                "Vote aux assemblées générales",
                "Protocoles pluriprofessionnels",
                "Support et accompagnement dédié",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-card border"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-muted/50">
          <div className="container max-w-3xl">
            <h2 className="text-2xl font-display font-bold text-center mb-8">Questions fréquentes</h2>
            <Accordion type="single" collapsible className="w-full">
              {faq.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default EspaceAdherent;
