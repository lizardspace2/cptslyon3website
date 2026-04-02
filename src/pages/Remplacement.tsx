import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Send, AlertCircle, UserSearch, ArrowRight, CheckCircle2, Zap, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const annonces = [
  {
    type: "Recherche remplaçant",
    profession: "Médecin généraliste",
    lieu: "Lyon 3 – Montchat",
    periode: "Du 10 au 21 mars 2025",
    description: "Cabinet de groupe, 3 médecins. Patientèle variée. Logiciel Doctolib. Rétrocession 80%.",
    urgent: true,
    date: "il y a 2 jours",
  },
  {
    type: "Recherche remplaçant",
    profession: "Infirmier(ère)",
    lieu: "Lyon 3 – Part-Dieu",
    periode: "Tous les lundis à partir d'avril 2025",
    description: "Cabinet libéral, tournée mixte (domicile + cabinet). Véhicule nécessaire.",
    urgent: false,
    date: "il y a 1 semaine",
  },
  {
    type: "Disponible pour remplacement",
    profession: "Kinésithérapeute",
    lieu: "Lyon 3 et alentours",
    periode: "Disponible de suite",
    description: "5 ans d'expérience. Spécialisé en rééducation post-opératoire et sport.",
    urgent: false,
    date: "il y a 3 semaines",
  },
];

const Remplacement = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast({ title: "Annonce envoyée", description: "Votre annonce sera publiée après validation." });
  };

  return (
    <div className="min-h-screen bg-background text-base">
      <Header />
      <main>
        <PageBanner 
          title="Remplacement" 
          subtitle="Trouvez un remplaçant ou proposez vos disponibilités sur le territoire de Lyon 3."
        />

        <section className="py-24 relative overflow-hidden">
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-sky-500/5 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2" />
          
          <div className="container max-w-5xl relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div>
                <span className="px-5 py-2 rounded-full bg-sky-50 text-sky-700 font-black text-[10px] uppercase tracking-[0.3em] border border-sky-600/10 mb-6 inline-block">
                  Opportunités
                </span>
                <h2 className="text-4xl md:text-6xl font-display font-bold text-navy tracking-tighter leading-tight">Annonces locales</h2>
              </div>
              <div className="flex items-center gap-4 bg-white px-8 py-4 rounded-[2rem] border border-navy/5 shadow-2xl shadow-navy/[0.02]">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-display font-bold text-navy">{annonces.length} annonces</span>
                <span className="text-navy/20 font-bold font-display italic">actives</span>
              </div>
            </div>

            <div className="grid gap-16">
              {annonces.map((a, i) => (
                <motion.article 
                  key={i} 
                  initial={{ opacity: 0, x: -30 }} 
                  whileInView={{ opacity: 1, x: 0 }} 
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.7 }}
                  className="group relative"
                >
                  <Card className="rounded-[3rem] border border-navy/5 shadow-3xl shadow-navy/[0.03] overflow-hidden hover:shadow-sky-600/20 hover:border-sky-600/30 transition-all duration-700 bg-white p-2 group/card">
                    <div className="flex flex-col lg:grid lg:grid-cols-12">
                      <div className="p-12 lg:col-span-8">
                        <div className="flex flex-wrap items-center gap-6 mb-10">
                          <div className={`px-6 py-2 rounded-full font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl flex items-center gap-3 ${a.type === "Recherche remplaçant" ? "bg-navy text-white shadow-navy/20" : "bg-emerald-500 text-white shadow-emerald-500/20"}`}>
                            {a.type === "Recherche remplaçant" ? <Zap className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                            {a.type}
                          </div>
                          {a.urgent && (
                            <div className="px-6 py-2 rounded-full bg-rose-500 text-white font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 shadow-2xl shadow-rose-500/30 animate-bounce group-hover/card:animate-none">
                              <AlertCircle className="w-3.5 h-3.5" /> Urgent
                            </div>
                          )}
                          <div className="ml-auto flex items-center gap-3 text-navy/20 font-black text-[10px] uppercase tracking-widest bg-sky-50/50 px-5 py-2.5 rounded-full border border-sky-600/5 group-hover/card:text-sky-600 transition-colors">
                            <Clock className="w-3.5 h-3.5" />
                            {a.date}
                          </div>
                        </div>
                        
                        <h3 className="text-3xl lg:text-4xl font-display font-bold text-navy group-hover/card:text-sky-600 transition-all mb-8 tracking-tighter leading-none">{a.profession}</h3>
                        
                        <div className="flex flex-wrap gap-x-12 gap-y-6 mb-12">
                          <div className="flex items-center gap-4 text-navy/40 font-bold uppercase tracking-widest text-xs italic group-hover/card:text-navy/60 transition-colors">
                            <MapPin className="w-6 h-6 text-sky-600/50 group-hover/card:text-sky-600 transition-colors" />
                            {a.lieu}
                          </div>
                          <div className="flex items-center gap-4 text-navy/40 font-bold uppercase tracking-widest text-xs italic group-hover/card:text-navy/60 transition-colors">
                            <CalendarDays className="w-6 h-6 text-sky-600/50 group-hover/card:text-sky-600 transition-colors" />
                            {a.periode}
                          </div>
                        </div>

                        <div className="p-10 rounded-[2.5rem] bg-sky-50/30 border border-sky-600/5 shadow-inner group-hover/card:bg-white transition-all duration-700">
                          <p className="text-navy/60 leading-relaxed font-medium italic text-lg lg:text-xl">"{a.description}"</p>
                        </div>
                      </div>
                      
                      <div className="p-12 lg:col-span-4 bg-[#0F1C2E] flex flex-col items-center justify-center rounded-b-[2.5rem] lg:rounded-b-none lg:rounded-r-[2.5rem] relative overflow-hidden group-hover/card:bg-navy transition-all duration-700 min-h-[300px]">
                         <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(2,132,199,0.1),transparent)] pointer-events-none" />
                         <div className="w-24 h-24 bg-white/5 backdrop-blur-xl rounded-[2rem] flex items-center justify-center mb-10 shadow-3xl border border-white/5 group-hover/card:bg-sky-600 group-hover/card:text-white transition-all duration-700 group-hover/card:scale-110 group-hover/card:rotate-6">
                            <UserSearch className="w-12 h-12 text-sky-400 group-hover/card:text-white" strokeWidth={1} />
                         </div>
                         <Button className="w-full h-20 rounded-[1.8rem] bg-white text-navy hover:bg-sky-400 hover:text-navy font-black text-lg transition-all shadow-3xl shadow-white/5 active:scale-95 group-hover/card:-translate-y-2 flex items-center justify-center gap-4 group/btn">
                           Répondre
                           <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-3 transition-transform" />
                         </Button>
                      </div>
                    </div>
                  </Card>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-32 bg-[#0F1C2E] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(2,132,199,0.05),transparent)] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(2,132,199,0.05),transparent)] pointer-events-none" />
          
          <div className="container max-w-4xl relative z-10">
            <div className="text-center mb-24">
              <span className="px-5 py-2 rounded-full bg-white/5 text-sky-400 font-black text-[10px] uppercase tracking-[0.3em] border border-white/10 mb-10 inline-block shadow-sm">
                Publication
              </span>
              <h2 className="text-4xl md:text-8xl font-display font-bold text-white tracking-tighter mb-10 leading-tight">Déposer une annonce</h2>
              <p className="text-white/40 text-xl max-w-2xl mx-auto font-medium leading-relaxed italic">
                Vous recherchez un remplaçant ou vous êtes disponible ? Diffusez votre annonce auprès du réseau local en quelques instants.
              </p>
            </div>

            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center">
                <Card className="text-center p-14 rounded-[4rem] border-none shadow-3xl bg-white/5 backdrop-blur-3xl border border-white/10 max-w-2xl">
                  <CardContent className="p-0">
                    <div className="w-28 h-28 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(16,185,129,0.3)] border-4 border-emerald-400/20">
                      <CheckCircle2 className="w-16 h-16" />
                    </div>
                    <h3 className="text-5xl font-display font-bold mb-8 text-white tracking-tighter">C'est envoyé !</h3>
                    <p className="text-white/40 text-xl font-medium mb-16 italic leading-relaxed">
                      Votre annonce a bien été transmise. Elle sera vérifiée puis publiée sous 48h.
                    </p>
                    <Button variant="outline" className="h-20 px-14 rounded-[2rem] border-white/10 text-white hover:bg-white hover:text-navy font-black text-lg transition-all shadow-3xl active:scale-95 uppercase tracking-widest" onClick={() => setSubmitted(false)}>
                      Nouvelle annonce
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="relative group">
                <div className="absolute inset-0 bg-sky-500/10 blur-[150px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
                <Card className="rounded-[4rem] p-1 border border-white/5 shadow-3xl bg-white relative overflow-hidden transition-all duration-1000">
                  <CardContent className="p-12 md:p-20">
                    <form onSubmit={handleSubmit} className="space-y-12">
                      <div className="grid gap-12 md:grid-cols-2">
                        <div className="space-y-6">
                          <Label htmlFor="type" className="text-navy font-black text-[10px] uppercase tracking-[0.4em] ml-2 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-sky-500" />
                            Type d'annonce
                          </Label>
                          <Select>
                            <SelectTrigger className="h-20 rounded-[1.8rem] border-navy/5 bg-sky-50/10 font-bold text-navy focus:ring-sky-500/20 transition-all text-lg px-8"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                            <SelectContent className="rounded-[2rem] border-navy/5 shadow-3xl p-3 bg-white/95 backdrop-blur-xl">
                              <SelectItem value="recherche" className="rounded-[1.2rem] h-14 font-bold text-lg focus:bg-sky-50 focus:text-sky-700">Recherche remplaçant</SelectItem>
                              <SelectItem value="disponible" className="rounded-[1.2rem] h-14 font-bold text-lg focus:bg-sky-50 focus:text-sky-700">Disponible</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-6">
                          <Label htmlFor="profession" className="text-navy font-black text-[10px] uppercase tracking-[0.4em] ml-2 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-sky-500" />
                            Profession
                          </Label>
                          <Select>
                            <SelectTrigger className="h-20 rounded-[1.8rem] border-navy/5 bg-sky-50/10 font-bold text-navy focus:ring-sky-500/20 transition-all text-lg px-8"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                            <SelectContent className="rounded-[2rem] border-navy/5 shadow-3xl p-3 bg-white/95 backdrop-blur-xl">
                              <SelectItem value="medecin" className="rounded-[1.2rem] h-14 font-bold text-lg">Médecin généraliste</SelectItem>
                              <SelectItem value="infirmier" className="rounded-[1.2rem] h-14 font-bold text-lg">Infirmier(ère)</SelectItem>
                              <SelectItem value="kine" className="rounded-[1.2rem] h-14 font-bold text-lg">Kinésithérapeute</SelectItem>
                              <SelectItem value="autre" className="rounded-[1.2rem] h-14 font-bold text-lg">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid gap-12 md:grid-cols-2">
                        <div className="space-y-6">
                          <Label htmlFor="nom" className="text-navy font-black text-[10px] uppercase tracking-[0.4em] ml-2 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-sky-500" />
                            Votre Identité
                          </Label>
                          <Input id="nom" placeholder="Ex: Dr. Sarah Martin" required className="h-20 rounded-[1.8rem] border-navy/5 bg-sky-50/10 font-bold text-navy placeholder:text-navy/10 focus:ring-sky-500/20 transition-all text-lg px-8 shadow-inner" />
                        </div>
                        <div className="space-y-6">
                          <Label htmlFor="email" className="text-navy font-black text-[10px] uppercase tracking-[0.4em] ml-2 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-sky-500" />
                            Contact Direct
                          </Label>
                          <Input id="email" type="email" placeholder="sarah.m@medical.fr" required className="h-20 rounded-[1.8rem] border-navy/5 bg-sky-50/10 font-bold text-navy placeholder:text-navy/10 focus:ring-sky-500/20 transition-all text-lg px-8 shadow-inner" />
                        </div>
                      </div>

                      <div className="space-y-6">
                        <Label htmlFor="periode" className="text-navy font-black text-[10px] uppercase tracking-[0.4em] ml-2 flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-sky-500" />
                          Calendrier Prévu
                        </Label>
                        <Input id="periode" placeholder="Ex: Du 10 au 25 Août – Possible extension" required className="h-20 rounded-[1.8rem] border-navy/5 bg-sky-50/10 font-bold text-navy placeholder:text-navy/10 focus:ring-sky-500/20 transition-all text-lg px-8 shadow-inner" />
                      </div>

                      <div className="space-y-6">
                        <Label htmlFor="description" className="text-navy font-black text-[10px] uppercase tracking-[0.4em] ml-2 flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-sky-500" />
                          Détails de l'offre
                        </Label>
                        <Textarea id="description" placeholder="Logiciel, patientèle, rétrocession, outils à disposition..." rows={5} required className="rounded-[2.5rem] border-navy/5 bg-sky-50/10 font-bold text-navy placeholder:text-navy/10 focus:ring-sky-500/20 transition-all text-lg p-10 shadow-inner" />
                      </div>

                      <div className="pt-8">
                        <Button type="submit" className="w-full h-24 rounded-[2.5rem] bg-sky-600 hover:bg-sky-500 text-white font-black text-2xl shadow-[0_20px_50px_rgba(2,132,199,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-6 group/submit border-b-8 border-sky-800">
                          <Send className="w-8 h-8 group-hover:translate-x-3 group-hover:-translate-y-3 transition-transform" strokeWidth={2.5} />
                          Diffuser l'annonce
                        </Button>
                        <p className="text-navy/20 text-center mt-8 font-bold text-xs uppercase tracking-[0.2em] italic">Validation par le bureau sous 48h</p>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Remplacement;
