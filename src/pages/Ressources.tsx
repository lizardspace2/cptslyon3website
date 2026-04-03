import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { motion } from "framer-motion";
import { FileText, Download, ExternalLink, BookOpen, Video, ClipboardList, ArrowRight, Bookmark } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2, AlertCircle } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'protocole' | 'outil' | 'webinaire' | 'lien';
  url: string;
  duration?: string;
  category?: string;
}

const getIconForType = (type: string) => {
  switch (type) {
    case 'guide': return BookOpen;
    case 'protocole': return FileText;
    case 'outil': return ClipboardList;
    case 'webinaire': return Video;
    case 'lien': return ExternalLink;
    default: return FileText;
  }
};

const Ressources = () => {
  const { data: resources, isLoading, error } = useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Resource[];
    },
  });

  const guides = resources?.filter(r => r.type === 'guide') || [];
  const protocoles = resources?.filter(r => r.type === 'protocole') || [];
  const outils = resources?.filter(r => r.type === 'outil') || [];
  const webinaires = resources?.filter(r => r.type === 'webinaire') || [];
  const liens = resources?.filter(r => r.type === 'lien') || [];
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
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="w-16 h-16 text-sky-600 animate-spin mb-6" />
                <p className="text-navy/40 font-display font-bold text-2xl italic">Chargement des ressources...</p>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center justify-center py-40 bg-red-50/50 rounded-[4rem] border border-dashed border-red-200">
                <AlertCircle className="w-16 h-16 text-red-400 mb-6" />
                <h4 className="text-navy font-display font-bold text-3xl mb-4">Erreur de connexion</h4>
                <p className="text-navy/40 font-bold text-xl italic">Impossible de récupérer les ressources.</p>
              </div>
            )}

            {!isLoading && !error && (
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

                {[
                  { id: "guides", data: guides },
                  { id: "protocoles", data: protocoles },
                  { id: "outils", data: outils }
                ].map((category) => (
                  <TabsContent key={category.id} value={category.id} className="mt-0 outline-none">
                    <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
                      {category.data.map((doc, i) => {
                        const Icon = getIconForType(doc.type);
                        return (
                          <motion.div 
                            key={doc.id} 
                            initial={{ opacity: 0, y: 40 }} 
                            whileInView={{ opacity: 1, y: 0 }} 
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05, duration: 0.7 }}
                          >
                            <Card className="rounded-[3rem] border border-navy/5 shadow-3xl shadow-navy/[0.03] hover:shadow-sky-600/20 hover:border-sky-600/30 transition-all duration-700 h-full flex flex-col group overflow-hidden bg-white group/card">
                              <CardHeader className="flex flex-col items-start gap-8 space-y-0 p-12">
                                <div className="w-20 h-20 rounded-[2rem] bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 group-hover/card:bg-sky-600 group-hover/card:text-white transition-all duration-700 shadow-2xl shadow-sky-600/5 group-hover/card:rotate-6">
                                  <Icon className="w-10 h-10" strokeWidth={1.5} />
                                </div>
                                <div className="flex-1">
                                  <CardTitle className="text-2xl lg:text-3xl font-display font-bold text-navy group-hover/card:text-sky-600 transition-all tracking-tight leading-tight">{doc.title}</CardTitle>
                                  <CardDescription className="mt-6 text-navy/40 font-medium leading-relaxed italic text-lg">{doc.description}</CardDescription>
                                </div>
                              </CardHeader>
                              <CardContent className="px-12 pb-12 mt-auto">
                                <Button 
                                  asChild
                                  className="w-full bg-navy text-white hover:bg-sky-600 rounded-[2rem] h-20 font-black text-lg transition-all shadow-3xl shadow-navy/30 active:scale-95 group-hover/card:shadow-sky-600/30 flex items-center gap-4"
                                >
                                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                    <Download className="w-6 h-6" strokeWidth={2.5} />
                                    Télécharger
                                  </a>
                                </Button>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  </TabsContent>
                ))}

                <TabsContent value="webinaires" className="mt-0 outline-none">
                  <div className="grid gap-12">
                    {webinaires.map((w, i) => (
                      <motion.div 
                        key={w.id} 
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
                                <span className="flex items-center gap-3 bg-sky-50 px-6 py-2 rounded-full border border-sky-600/10 text-sky-700">Webinaire</span>
                                {w.duration && (
                                  <>
                                    <span className="w-2 h-2 rounded-full bg-sky-200 hidden md:block" />
                                    <span className="flex items-center gap-3 bg-sky-50 px-6 py-2 rounded-full border border-sky-600/10 text-sky-700 italic">{w.duration}</span>
                                  </>
                                )}
                              </CardDescription>
                            </div>
                            <Button variant="outline" className="rounded-[2rem] px-14 h-20 border-navy/10 text-navy font-black text-lg hover:bg-navy hover:text-white hover:border-navy transition-all shrink-0 shadow-2xl shadow-navy/[0.04] group-hover/card:-translate-x-4" asChild>
                              <a href={w.url} target="_blank" rel="noopener noreferrer">
                                <ArrowRight className="w-6 h-6 mr-4 -rotate-45" />
                                Voir le replay
                              </a>
                            </Button>
                          </CardHeader>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            )}
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
              {liens.map((link, i) => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="group h-full">
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
