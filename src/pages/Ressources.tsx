import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { motion } from "framer-motion";
import { FileText, Download, ExternalLink, BookOpen, Video, ClipboardList, ArrowRight, Bookmark } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const documents = [
  { title: "Guide d'installation en libéral", description: "Toutes les étapes pour s'installer sur le 3ème arrondissement.", icon: ClipboardList, category: "guides" },
  { title: "Protocoles de coordination", description: "Protocoles pluriprofessionnels validés par la CPTS.", icon: FileText, category: "protocoles" },
  { title: "Annuaire des structures de soin", description: "Liste complète des structures sanitaires et médico-sociales.", icon: BookOpen, category: "guides" },
  { title: "Charte de la CPTS Lyon 3", description: "Charte d'engagement des professionnels adhérents.", icon: Bookmark, category: "protocoles" },
  { title: "Fiche parcours patient complexe", description: "Outil de coordination pour les situations complexes.", icon: ClipboardList, category: "outils" },
  { title: "Kit de communication", description: "Supports de communication pour informer vos patients.", icon: FileText, category: "outils" },
  { title: "Règlement intérieur", description: "Règlement de fonctionnement de l'association.", icon: FileText, category: "protocoles" },
  { title: "Modèle de lettre de liaison", description: "Modèle pour faciliter la communication ville-hôpital.", icon: ClipboardList, category: "outils" },
];

const webinars = [
  { title: "Coordination ville-hôpital", date: "12 février 2025", duration: "45 min" },
  { title: "Prise en charge des patients chroniques", date: "28 janvier 2025", duration: "1h" },
  { title: "Outils numériques en santé", date: "15 décembre 2024", duration: "30 min" },
  { title: "Actualités Vaccinations", date: "10 novembre 2024", duration: "1h" },
];

const links = [
  { title: "ARS Auvergne-Rhône-Alpes", url: "#", description: "Agence régionale de santé" },
  { title: "CPAM du Rhône", url: "#", description: "Caisse primaire d'assurance maladie" },
  { title: "Ordre des Médecins du Rhône", url: "#", description: "Conseil départemental" },
  { title: "URPS Médecins Libéraux", url: "#", description: "Union régionale des professionnels de santé" },
  { title: "Ameli pour les Professionnels", url: "#", description: "Services en ligne de l'Assurance Maladie" },
  { title: "DGS Urgent", url: "#", description: "Alertes sanitaires de la Direction Générale de la Santé" },
];

const Ressources = () => {
  return (
    <div className="min-h-screen bg-background text-base">
      <Header />
      <main>
        <PageBanner 
          title="Ressources" 
          subtitle="Documents, guides et outils à disposition des professionnels de santé du territoire."
        />

        <section className="py-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(2,132,199,0.05),transparent)] pointer-events-none" />
          
          <div className="container max-w-6xl relative z-10">
            <Tabs defaultValue="guides" className="w-full">
              <div className="flex justify-center mb-20">
                <TabsList className="inline-flex h-auto gap-4 bg-white/40 backdrop-blur-3xl p-3 rounded-[3rem] border border-white/50 shadow-3xl shadow-navy/[0.02]">
                  {[
                    { value: "guides", label: "Guides" },
                    { value: "protocoles", label: "Protocoles" },
                    { value: "outils", label: "Outils" },
                    { value: "webinaires", label: "Webinaires" }
                  ].map((tab) => (
                    <TabsTrigger 
                      key={tab.value}
                      value={tab.value} 
                      className="px-10 py-5 rounded-[2.5rem] text-navy/40 data-[state=active]:bg-navy data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-navy/30 transition-all font-black text-xs uppercase tracking-[0.2em]"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {["guides", "protocoles", "outils"].map((cat) => (
                <TabsContent key={cat} value={cat} className="mt-0 outline-none">
                  <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
                    {documents
                      .filter((d) => d.category === cat)
                      .map((doc, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, y: 40 }} 
                          whileInView={{ opacity: 1, y: 0 }} 
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.05, duration: 0.7 }}
                        >
                          <Card className="rounded-[3rem] border border-navy/5 shadow-3xl shadow-navy/[0.03] hover:shadow-sky-600/20 hover:border-sky-600/30 transition-all duration-700 h-full flex flex-col group overflow-hidden bg-white group/card">
                            <CardHeader className="flex flex-col items-start gap-8 space-y-0 p-12">
                              <div className="w-20 h-20 rounded-[2rem] bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 group-hover/card:bg-sky-600 group-hover/card:text-white transition-all duration-700 shadow-2xl shadow-sky-600/5 group-hover/card:rotate-6">
                                <doc.icon className="w-10 h-10" strokeWidth={1.5} />
                              </div>
                              <div className="flex-1">
                                <CardTitle className="text-2xl lg:text-3xl font-display font-bold text-navy group-hover/card:text-sky-600 transition-all tracking-tight leading-tight">{doc.title}</CardTitle>
                                <CardDescription className="mt-6 text-navy/40 font-medium leading-relaxed italic text-lg">{doc.description}</CardDescription>
                              </div>
                            </CardHeader>
                            <CardContent className="px-12 pb-12 mt-auto">
                              <Button className="w-full bg-navy text-white hover:bg-sky-600 rounded-[2rem] h-20 font-black text-lg transition-all shadow-3xl shadow-navy/30 active:scale-95 group-hover/card:shadow-sky-600/30 flex items-center gap-4">
                                <Download className="w-6 h-6" strokeWidth={2.5} />
                                Télécharger
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                  </div>
                </TabsContent>
              ))}

              <TabsContent value="webinaires" className="mt-0 outline-none">
                <div className="grid gap-12">
                  {webinars.map((w, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -20 }} 
                      whileInView={{ opacity: 1, x: 0 }} 
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.7 }}
                    >
                      <Card className="rounded-[3rem] border border-navy/5 shadow-3xl shadow-navy/[0.03] hover:shadow-sky-600/20 hover:border-sky-600/30 transition-all duration-700 group overflow-hidden bg-white group/card">
                        <CardHeader className="flex flex-col lg:flex-row lg:items-center gap-12 space-y-0 p-12 lg:p-14">
                          <div className="w-20 h-20 rounded-[2rem] bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 group-hover/card:bg-sky-600 group-hover/card:text-white transition-all duration-700 shadow-2xl shadow-sky-600/5 group-hover/card:rotate-6">
                            <Video className="w-10 h-10" strokeWidth={1.5} />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-3xl lg:text-4xl font-display font-bold text-navy group-hover/card:text-sky-600 transition-all tracking-tight leading-tight">{w.title}</CardTitle>
                            <CardDescription className="flex flex-wrap items-center gap-6 font-black text-sky-600/40 mt-6 text-xs uppercase tracking-[0.3em]">
                              <span className="flex items-center gap-3 bg-sky-50 px-6 py-2 rounded-full border border-sky-600/10 text-sky-700">{w.date}</span>
                              <span className="w-2 h-2 rounded-full bg-sky-200 hidden md:block" />
                              <span className="flex items-center gap-3 bg-sky-50 px-6 py-2 rounded-full border border-sky-600/10 text-sky-700 italic">{w.duration}</span>
                            </CardDescription>
                          </div>
                          <Button variant="outline" className="rounded-[2rem] px-14 h-20 border-navy/10 text-navy font-black text-lg hover:bg-navy hover:text-white hover:border-navy transition-all shrink-0 shadow-2xl shadow-navy/[0.04] group-hover/card:-translate-x-4">
                            <ArrowRight className="w-6 h-6 mr-4 -rotate-45" />
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

        <section className="py-32 bg-[#0F1C2E] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(2,132,199,0.1),transparent)] pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
          
          <div className="container max-w-6xl relative z-10">
            <div className="text-center mb-24">
              <span className="px-5 py-2 rounded-full bg-white/5 text-sky-400 font-black text-[10px] uppercase tracking-[0.3em] border border-white/10 mb-8 inline-block shadow-sm">
                Ressources Externes
              </span>
              <h2 className="text-4xl md:text-7xl font-display font-bold text-white tracking-tighter mb-8 leading-tight">Liens utiles</h2>
              <p className="text-white/40 font-medium text-xl italic max-w-2xl mx-auto leading-relaxed">Retrouvez les sites de référence pour vos pratiques professionnelles et institutionnelles.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {links.map((link, i) => (
                <a key={i} href={link.url} className="group h-full">
                  <Card className="rounded-[3rem] border border-white/5 bg-white/5 backdrop-blur-xl shadow-3xl shadow-navy/[0.3] hover:shadow-sky-600/20 hover:border-sky-600/30 transition-all duration-700 h-full p-2 group/link border-b-8 border-b-transparent hover:border-b-sky-600">
                    <CardHeader className="flex flex-row items-center gap-8 space-y-0 p-10 h-full">
                      <div className="w-16 h-16 rounded-[1.8rem] bg-white/5 text-sky-400 flex items-center justify-center group-hover/link:bg-sky-400 group-hover/link:text-navy transition-all duration-500 group-hover/link:scale-110 shadow-2xl shadow-sky-600/5">
                        <ExternalLink className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl font-display font-bold text-white group-hover/link:text-sky-400 transition-all leading-tight tracking-tight">{link.title}</CardTitle>
                        <CardDescription className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-3 group-hover/link:text-white/40 transition-colors">{link.description}</CardDescription>
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
