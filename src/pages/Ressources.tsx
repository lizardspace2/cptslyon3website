import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { FileText, Download, ExternalLink, BookOpen, Video, ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const documents = [
  { title: "Guide d'installation en libéral", description: "Toutes les étapes pour s'installer sur le 5ème arrondissement.", icon: ClipboardList, category: "guides" },
  { title: "Protocoles de coordination", description: "Protocoles pluriprofessionnels validés par la CPTS.", icon: FileText, category: "protocoles" },
  { title: "Annuaire des structures de soin", description: "Liste complète des structures sanitaires et médico-sociales.", icon: BookOpen, category: "guides" },
  { title: "Charte de la CPTS Lyon 5", description: "Charte d'engagement des professionnels adhérents.", icon: FileText, category: "protocoles" },
  { title: "Fiche parcours patient complexe", description: "Outil de coordination pour les situations complexes.", icon: ClipboardList, category: "outils" },
  { title: "Kit de communication", description: "Supports de communication pour informer vos patients.", icon: FileText, category: "outils" },
];

const webinars = [
  { title: "Coordination ville-hôpital", date: "12 février 2025", duration: "45 min" },
  { title: "Prise en charge des patients chroniques", date: "28 janvier 2025", duration: "1h" },
  { title: "Outils numériques en santé", date: "15 décembre 2024", duration: "30 min" },
];

const links = [
  { title: "ARS Auvergne-Rhône-Alpes", url: "#", description: "Agence régionale de santé" },
  { title: "CPAM du Rhône", url: "#", description: "Caisse primaire d'assurance maladie" },
  { title: "Ordre des Médecins du Rhône", url: "#", description: "Conseil départemental" },
  { title: "URPS Médecins Libéraux", url: "#", description: "Union régionale des professionnels de santé" },
];

const Ressources = () => {
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
              Ressources
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-lg text-navy-foreground/80 max-w-2xl mx-auto"
            >
              Documents, guides et outils à disposition des professionnels de santé du territoire.
            </motion.p>
          </div>
        </section>

        <section className="py-16">
          <div className="container max-w-5xl">
            <Tabs defaultValue="guides" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="guides">Guides</TabsTrigger>
                <TabsTrigger value="protocoles">Protocoles</TabsTrigger>
                <TabsTrigger value="outils">Outils</TabsTrigger>
                <TabsTrigger value="webinaires">Webinaires</TabsTrigger>
              </TabsList>

              {["guides", "protocoles", "outils"].map((cat) => (
                <TabsContent key={cat} value={cat}>
                  <div className="grid gap-4 md:grid-cols-2">
                    {documents
                      .filter((d) => d.category === cat)
                      .map((doc, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                          <Card className="hover:shadow-md transition-shadow h-full">
                            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <doc.icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <CardTitle className="text-base">{doc.title}</CardTitle>
                                <CardDescription className="mt-1">{doc.description}</CardDescription>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <Button variant="outline" size="sm">
                                <Download className="w-4 h-4" />
                                Télécharger
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                  </div>
                </TabsContent>
              ))}

              <TabsContent value="webinaires">
                <div className="grid gap-4">
                  {webinars.map((w, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Video className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-base">{w.title}</CardTitle>
                            <CardDescription>{w.date} · {w.duration}</CardDescription>
                          </div>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-4 h-4" />
                            Voir le replay
                          </Button>
                        </CardHeader>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="py-16 bg-muted/50">
          <div className="container max-w-5xl">
            <h2 className="text-2xl font-display font-bold mb-8">Liens utiles</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {links.map((link, i) => (
                <a key={i} href={link.url} className="group">
                  <Card className="hover:shadow-md hover:border-primary/30 transition-all">
                    <CardHeader className="flex flex-row items-center gap-3 space-y-0 py-4">
                      <ExternalLink className="w-4 h-4 text-primary group-hover:translate-x-0.5 transition-transform" />
                      <div>
                        <CardTitle className="text-sm">{link.title}</CardTitle>
                        <CardDescription className="text-xs">{link.description}</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Ressources;
