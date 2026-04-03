import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { motion } from "framer-motion";
import { Search, MapPin, Phone, User, ArrowRight, UserCheck, ShieldCheck, Mail, X, ExternalLink, Globe, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2, AlertCircle } from "lucide-react";

interface Professional {
  id: string;
  title?: string;
  first_name?: string;
  last_name?: string;
  name?: string; // Compatibilité
  specialty: string;
  public_phone?: string;
  private_phone?: string;
  email?: string;
  address: string;
  description?: string;
  image_url?: string;
}

const Annuaire = () => {
  const [search, setSearch] = useState("");
  const [selectedPro, setSelectedPro] = useState<Professional | null>(null);

  const { data: professionals, isLoading, error } = useQuery({
    queryKey: ["professionals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("professionals")
        .select("*")
        .order("last_name");
      
      if (error) throw error;
      return data as Professional[];
    },
  });

  const filtered = (professionals || []).filter(
    (p) =>
      (p.first_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.last_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
      p.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-base">
      <Header />
      <main>
        <PageBanner 
          title="Annuaire" 
          subtitle="Retrouvez tous les professionnels de santé membres de la CPTS Lyon 3."
        />

        <section className="py-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(2,132,199,0.05),transparent)] pointer-events-none" />
          
          <div className="container max-w-5xl relative z-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative mb-24 group"
            >
              <div className="absolute inset-0 bg-sky-500/10 blur-[100px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000" />
              <div className="relative bg-white/40 backdrop-blur-3xl rounded-[3rem] p-4 shadow-3xl border border-white/50 group-focus-within:border-sky-500/30 transition-all duration-700">
                <Search className="absolute left-10 top-1/2 -translate-y-1/2 w-8 h-8 text-sky-600/20 group-focus-within:text-sky-600 group-focus-within:scale-110 transition-all duration-500" strokeWidth={2.5} />
                <Input
                  placeholder="Rechercher par nom ou spécialité (ex: Médecin...)"
                  className="pl-24 h-20 rounded-[2.5rem] border-none bg-transparent text-2xl font-display font-bold text-navy focus-visible:ring-0 placeholder:text-navy/10 placeholder:font-display transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </motion.div>

            <div className="grid gap-12 lg:gap-16">
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-40">
                  <Loader2 className="w-16 h-16 text-sky-600 animate-spin mb-6" />
                  <p className="text-navy/40 font-display font-bold text-2xl italic">Chargement de l'annuaire...</p>
                </div>
              )}

              {error && (
                <div className="flex flex-col items-center justify-center py-40 bg-red-50/50 rounded-[4rem] border border-dashed border-red-200">
                  <AlertCircle className="w-16 h-16 text-red-400 mb-6" />
                  <h4 className="text-navy font-display font-bold text-3xl mb-4">Erreur de connexion</h4>
                  <p className="text-navy/40 font-bold text-xl italic">Impossible de récupérer la liste des professionnels.</p>
                </div>
              )}

              {!isLoading && !error && filtered.map((pro, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.6 }}
                  className="group bg-white rounded-[3rem] border border-navy/5 shadow-3xl shadow-navy/[0.02] p-10 md:p-14 flex flex-col md:flex-row md:items-center gap-12 hover:shadow-sky-600/20 hover:border-sky-600/30 transition-all duration-700 relative overflow-hidden group/card"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover/card:scale-150 transition-transform duration-1000" />
                  
                  <div className="w-24 h-24 rounded-[2.2rem] bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 group-hover:bg-sky-600 group-hover:text-white transition-all duration-700 shadow-2xl shadow-sky-600/5 group-hover:rotate-6">
                    <UserCheck className="w-10 h-10" strokeWidth={1.5} />
                  </div>
                  
                  <div className="flex-1 relative z-10">
                    <div className="flex flex-wrap items-center gap-6 mb-6">
                      <h3 className="text-3xl font-display font-bold text-navy group-hover:text-sky-600 transition-colors tracking-tight">
                        {pro.title} {pro.first_name} {pro.last_name || pro.name}
                      </h3>
                      <div className="flex items-center gap-2 px-6 py-2 rounded-full bg-sky-50 text-sky-700 text-[10px] font-black uppercase tracking-[0.2em] border border-sky-600/10 group-hover:bg-sky-100 transition-colors shadow-sm">
                         <ShieldCheck className="w-3.5 h-3.5" />
                        {pro.specialty}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-x-12 gap-y-6">
                      <div className="flex items-center gap-4 text-navy/40 font-bold text-sm uppercase tracking-widest italic group-hover:text-navy/60 transition-colors">
                        <MapPin className="w-5 h-5 text-sky-600/50 group-hover:text-sky-600 transition-colors" />
                        {pro.address}
                      </div>
                      {pro.public_phone && (
                        <div className="flex items-center gap-4 text-navy/40 font-bold text-sm uppercase tracking-widest italic group-hover:text-navy/60 transition-colors">
                          <Phone className="w-5 h-5 text-sky-600/50 group-hover:text-sky-600 transition-colors" />
                          {pro.public_phone}
                        </div>
                      )}
                      {pro.email && (
                        <div className="flex items-center gap-4 text-navy/40 font-bold text-sm uppercase tracking-widest italic group-hover:text-navy/60 transition-colors">
                          <Mail className="w-5 h-5 text-sky-600/50 group-hover:text-sky-600 transition-colors" />
                          {pro.email}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setSelectedPro(pro)}
                    className="h-20 rounded-[2rem] bg-navy hover:bg-sky-600 text-white px-12 font-black text-lg transition-all shadow-3xl shadow-navy/30 active:scale-95 group-hover:-translate-x-4 flex items-center gap-4 group/btn"
                  >
                    Voir Fiche
                    <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-3 transition-transform" />
                  </Button>
                </motion.div>
              ))}
              
              {filtered.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-40 bg-sky-50/10 backdrop-blur-sm rounded-[4rem] border border-dashed border-sky-600/20">
                  <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-3xl shadow-sky-600/10">
                     <Search className="w-12 h-12 text-sky-200" strokeWidth={1} />
                  </div>
                  <h4 className="text-navy font-display font-bold text-3xl mb-4">Aucun résultat</h4>
                  <p className="text-navy/30 font-bold text-xl mb-12">Aucun professionnel ne correspond à votre recherche.</p>
                  <Button 
                    variant="outline" 
                    className="h-16 px-12 rounded-2xl border-navy/10 text-navy font-black hover:bg-navy hover:text-white transition-all shadow-xl"
                    onClick={() => setSearch("")}
                  >
                    Réinitialiser les filtres
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Fiche Détaillée Modal */}
        <Dialog open={!!selectedPro} onOpenChange={(open) => !open && setSelectedPro(null)}>
          <DialogContent className="max-w-3xl rounded-[3rem] border-none bg-white p-0 overflow-hidden shadow-4xl animate-in fade-in zoom-in duration-300">
            {selectedPro && (
              <div className="relative">
                {/* Header with Background Accent */}
                <div className="h-48 bg-sky-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)]" />
                  <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-navy/20 rounded-full blur-3xl" />
                  <div className="absolute top-12 left-12 z-10 text-white">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <UserCheck className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-[0.4em] opacity-80">Fiche Professionnelle</span>
                    </div>
                    <h2 className="text-4xl font-display font-bold tracking-tight">
                      {selectedPro.title} {selectedPro.first_name} {selectedPro.last_name || selectedPro.name}
                    </h2>
                  </div>
                </div>

                <div className="p-12 pt-16">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Infos Principales */}
                    <div className="space-y-10 focus:outline-none">
                       <div>
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-600 block mb-6">Spécialité & Expertise</label>
                          <div className="flex items-center gap-4 p-6 rounded-3xl bg-sky-50 border border-sky-600/10">
                             <ShieldCheck className="w-8 h-8 text-sky-600" />
                             <span className="text-xl font-display font-bold text-navy">{selectedPro.specialty}</span>
                          </div>
                       </div>

                       <div>
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-600 block mb-6">Localisation</label>
                          <div className="space-y-4">
                             <div className="flex items-start gap-4 p-6 rounded-3xl bg-navy/[0.02] border border-navy/5 group hover:border-sky-600/20 transition-all">
                                <MapPin className="w-6 h-6 text-sky-600 shrink-0 mt-1" />
                                <div>
                                   <p className="font-bold text-navy text-lg leading-snug mb-4">{selectedPro.address}</p>
                                   <a 
                                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedPro.address}, 69003 Lyon`)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 text-sky-600 font-black text-xs uppercase tracking-widest hover:gap-4 transition-all"
                                   >
                                      Voir l'itinéraire
                                      <ExternalLink className="w-3.5 h-3.5" />
                                   </a>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Contact & Actions */}
                    <div className="space-y-10">
                       <div>
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-600 block mb-6">Coordonnées de contact</label>
                          <div className="space-y-4">
                             {selectedPro.public_phone && (
                               <a 
                                 href={`tel:${selectedPro.public_phone.replace(/\s/g, '')}`}
                                 className="flex items-center gap-6 p-6 rounded-3xl bg-navy text-white hover:bg-sky-600 transition-all shadow-xl shadow-navy/10 group"
                               >
                                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                     <Phone className="w-6 h-6" />
                                  </div>
                                  <div>
                                     <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1">Téléphone Public</p>
                                     <p className="text-xl font-display font-bold">{selectedPro.public_phone}</p>
                                  </div>
                               </a>
                             )}

                             {selectedPro.email && (
                               <a 
                                 href={`mailto:${selectedPro.email}`}
                                 className="flex items-center gap-6 p-6 rounded-3xl border border-navy/5 bg-white hover:bg-sky-50 transition-all group"
                               >
                                  <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                     <Mail className="w-6 h-6 text-sky-600" />
                                  </div>
                                  <div>
                                     <p className="text-[10px] font-bold uppercase tracking-widest text-navy/30 mb-1">Email Professionnel</p>
                                     <p className="text-xl font-display font-bold text-navy truncate max-w-[200px]">{selectedPro.email}</p>
                                  </div>
                               </a>
                             )}
                          </div>
                       </div>

                       <div className="pt-6">
                           <div className="p-8 rounded-[2.5rem] bg-emerald-50 border border-emerald-500/10 flex items-center gap-6">
                              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                                 <ShieldCheck className="w-6 h-6" />
                              </div>
                              <p className="text-sm font-medium text-emerald-800 leading-relaxed italic">
                                Ce praticien est membre certifié de la **CPTS Lyon 3**.
                              </p>
                           </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default Annuaire;
