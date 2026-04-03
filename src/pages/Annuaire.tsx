import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { motion } from "framer-motion";
import { Search, MapPin, Phone, User, ArrowRight, UserCheck, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2, AlertCircle } from "lucide-react";

interface Professional {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  address: string;
  description?: string;
  image_url?: string;
}

const Annuaire = () => {
  const [search, setSearch] = useState("");

  const { data: professionals, isLoading, error } = useQuery({
    queryKey: ["professionals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("professionals")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as Professional[];
    },
  });

  const filtered = (professionals || []).filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
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
                      <h3 className="text-3xl font-display font-bold text-navy group-hover:text-sky-600 transition-colors tracking-tight">{pro.name}</h3>
                      <div className="flex items-center gap-2 px-6 py-2 rounded-full bg-sky-50 text-sky-700 text-[10px] font-black uppercase tracking-[0.2em] border border-sky-600/10 group-hover:bg-sky-100 transition-colors shadow-sm">
                         <ShieldCheck className="w-3.5 h-3.5" />
                        {pro.specialty}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-x-12 gap-y-4">
                      <div className="flex items-center gap-4 text-navy/40 font-bold text-sm uppercase tracking-widest italic group-hover:text-navy/60 transition-colors">
                        <MapPin className="w-5 h-5 text-sky-600/50 group-hover:text-sky-600 transition-colors" />
                        {pro.address}
                      </div>
                      <div className="flex items-center gap-4 text-navy/40 font-bold text-sm uppercase tracking-widest italic group-hover:text-navy/60 transition-colors">
                        <Phone className="w-5 h-5 text-sky-600/50 group-hover:text-sky-600 transition-colors" />
                        {pro.phone}
                      </div>
                    </div>
                  </div>
                  
                  <Button className="h-20 rounded-[2rem] bg-navy hover:bg-sky-600 text-white px-12 font-black text-lg transition-all shadow-3xl shadow-navy/30 active:scale-95 group-hover:-translate-x-4 flex items-center gap-4 group/btn">
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
      </main>
      <Footer />
    </div>
  );
};

export default Annuaire;
