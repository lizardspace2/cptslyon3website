import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { motion } from "framer-motion";
import { Shield, Users, Heart, CheckCircle2, ArrowRight, Mail, Phone, HelpCircle, Star, Sparkles, Zap } from "lucide-react";
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
    description: "Intégrez un réseau de professionnels de santé engagés pour améliorer le parcours de soins au quotidien.",
  },
  {
    icon: Shield,
    title: "Formations exclusives",
    description: "Accédez à des formations continues et des webinaires exclusifs gratuits, réservés à nos membres.",
  },
  {
    icon: Heart,
    title: "Coordination de pointe",
    description: "Bénéficiez d'outils de coordination et de protocoles partagés pour une prise en charge optimale.",
  },
];

const faq = [
  {
    q: "Qui peut adhérer à la CPTS Lyon 3 ?",
    a: "Tous les professionnels de santé exerçant sur le territoire de Lyon 3ème (libéraux, salariés de structures de soins, etc.) peuvent adhérer à la CPTS.",
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
    <div className="min-h-screen bg-background text-base">
      <Header />
      <main>
        <PageBanner 
          title="Espace Adhérent" 
          subtitle="Rejoignez la communauté des professionnels de santé de Lyon 3 et participez à la coordination des soins."
        />

        <section className="py-24 relative overflow-hidden">
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-sky-500/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          
          <div className="container max-w-6xl relative z-10">
            <div className="text-center mb-24">
              <span className="px-5 py-2 rounded-full bg-sky-50 text-sky-700 font-black text-[10px] uppercase tracking-[0.3em] border border-sky-600/10 mb-8 inline-block shadow-sm">
                Privilèges Adhérents
              </span>
              <h2 className="text-4xl md:text-7xl font-display font-bold text-navy mb-8 tracking-tighter leading-tight">Pourquoi adhérer ?</h2>
              <p className="text-navy/40 text-xl max-w-3xl mx-auto font-medium leading-relaxed italic">Rejoignez une organisation dynamique pour transformer l'offre de soins de notre territoire.</p>
            </div>
            
            <div className="grid gap-12 md:grid-cols-3">
              {avantages.map((a, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 40 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.7 }}
                >
                  <Card className="rounded-[3rem] border border-navy/5 shadow-3xl shadow-navy/[0.03] hover:shadow-sky-600/20 hover:border-sky-600/30 transition-all duration-700 h-full flex flex-col items-center text-center p-12 group bg-white relative overflow-hidden group/card">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover/card:scale-150 transition-transform duration-1000" />
                    
                    <CardHeader className="p-0 mb-12 relative z-10">
                      <div className="w-24 h-24 rounded-[2.2rem] bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 group-hover/card:bg-sky-600 group-hover/card:text-white transition-all duration-700 shadow-2xl shadow-sky-600/5 group-hover/card:rotate-6">
                        <a.icon className="w-12 h-12" strokeWidth={1} />
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 relative z-10">
                      <CardTitle className="text-2xl font-display font-bold text-navy mb-6 group-hover/card:text-sky-600 transition-all tracking-tight uppercase leading-tight">{a.title}</CardTitle>
                      <CardDescription className="text-navy/40 font-medium leading-relaxed italic text-lg leading-relaxed">"{a.description}"</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-32 bg-[#0F1C2E] text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(2,132,199,0.1),transparent)] pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
          
          <div className="container max-w-4xl relative z-10 text-center">
            <span className="px-5 py-2 rounded-full bg-white/5 text-sky-400 font-black text-[10px] uppercase tracking-[0.3em] border border-white/10 mb-10 inline-block shadow-sm">
              Engagement Annuel
            </span>
            <h2 className="text-4xl md:text-8xl font-display font-bold mb-20 tracking-tighter leading-tight">Cotisation unique</h2>
            
            <Card className="rounded-[4rem] border border-white/5 bg-white text-navy p-4 shadow-3xl overflow-hidden group/price ring-1 ring-white/10">
              <CardContent className="p-14 md:p-24 relative">
                <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover/price:scale-150 transition-transform duration-1000" />
                
                <div className="flex flex-col items-center gap-12 lg:gap-16">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-3 bg-sky-50 px-6 py-2 rounded-full mb-8 border border-sky-600/10 text-sky-700 font-black text-[10px] uppercase tracking-widest shadow-sm">
                      <Sparkles className="w-3.5 h-3.5" />
                      Tarif Préférentiel
                    </div>
                    <span className="text-2xl md:text-4xl font-display font-bold text-navy/40 tracking-tight mb-4">Tous les professionnels de santé</span>
                    <div className="flex items-baseline gap-6">
                      <span className="text-7xl md:text-[10rem] font-display font-black text-navy leading-none tracking-tighter group-hover/price:text-sky-600 transition-colors duration-700">10 €</span>
                      <span className="text-navy/20 font-black uppercase text-sm tracking-[0.3em] border-l border-navy/10 pl-6 h-10 flex items-center">an / ttc</span>
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-navy/10 to-transparent" />
                  
                  <div className="flex flex-col items-center w-full">
                    <Button className="w-full md:w-auto min-w-[300px] bg-navy hover:bg-sky-600 text-white rounded-[2.5rem] px-16 h-24 text-2xl font-black shadow-[0_20px_50px_rgba(21,42,66,0.3)] hover:shadow-sky-600/30 transition-all active:scale-95 group/btn flex items-center justify-center gap-6" asChild>
                      <Link to="/contact">
                        Adhérer maintenant
                        <ArrowRight className="w-8 h-8 group-hover/btn:translate-x-3 transition-transform" />
                      </Link>
                    </Button>
                    
                    <div className="mt-16 flex flex-wrap justify-center gap-12 font-black tracking-[0.3em] text-[10px] uppercase text-navy/30">
                      <div className="flex items-center gap-3 group/contact hover:text-sky-600 transition-colors">
                         <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shadow-lg group-hover/contact:bg-sky-600 group-hover/contact:text-white transition-all"><Mail className="w-5 h-5" /></div>
                         cptslyon3@gmail.com
                      </div>
                      <div className="flex items-center gap-3 group/contact hover:text-sky-600 transition-colors">
                         <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shadow-lg group-hover/contact:bg-sky-600 group-hover/contact:text-white transition-all"><Phone className="w-5 h-5" /></div>
                         07 45 28 16 26
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-32 relative overflow-hidden">
          <div className="absolute top-1/2 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(2,132,199,0.03),transparent)] pointer-events-none" />
          
          <div className="container max-w-5xl relative z-10">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-7xl font-display font-bold text-navy tracking-tighter leading-tight">Ce qui est inclus</h2>
              <p className="text-navy/40 font-medium mt-8 text-xl italic max-w-2xl mx-auto leading-relaxed">Des services et ressources conçus pour valoriser et accompagner votre engagement professionnel.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {[
                "Accès à l'annuaire des adhérents",
                "Formations et webinaires offerts",
                "Outils de coordination avancés",
                "Newsletter confidentielle mensuelle",
                "Intégration aux groupes de travail",
                "Droits de vote aux assemblées",
                "Protocoles pluriprofessionnels",
                "Accompagnement administratif dédié",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.6 }}
                  className="flex items-center gap-8 p-10 rounded-[2.5rem] bg-white border border-navy/5 shadow-2xl shadow-navy/[0.02] hover:border-sky-600/30 group/item transition-all duration-700 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover/item:scale-150 transition-transform duration-1000" />
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 group-hover/item:bg-sky-600 group-hover/item:text-white transition-all duration-500 shadow-xl shadow-sky-600/5 group-hover/item:scale-110 group-hover/item:rotate-6">
                    <CheckCircle2 className="w-7 h-7" strokeWidth={2.5} />
                  </div>
                  <span className="text-navy font-display font-bold text-xl group-hover/item:text-sky-600 transition-colors tracking-tight">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-32 bg-sky-50/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,rgba(2,132,199,0.05),transparent)] pointer-events-none" />
          
          <div className="container max-w-4xl relative z-10 px-6">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="text-center mb-24"
            >
              <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-3xl border border-sky-100 ring-4 ring-sky-50">
                 <HelpCircle className="w-12 h-12 text-sky-600" strokeWidth={1} />
              </div>
              <h2 className="text-4xl md:text-7xl font-display font-bold text-navy tracking-tighter leading-tight">Questions fréquentes</h2>
            </motion.div> 

            <Accordion type="single" collapsible className="space-y-10">
              {faq.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-none">
                  <AccordionTrigger className="bg-white px-12 py-12 rounded-[3rem] text-left text-navy font-display font-bold text-xl md:text-3xl hover:no-underline hover:shadow-3xl hover:shadow-sky-600/10 transition-all duration-700 data-[state=open]:rounded-b-none data-[state=open]:shadow-3xl data-[state=open]:shadow-sky-600/10 tracking-tighter leading-tight decoration-transparent group">
                    <span className="group-hover:text-sky-600 transition-colors">{item.q}</span>
                  </AccordionTrigger>
                  <AccordionContent className="bg-white px-12 pb-14 pt-4 rounded-b-[3rem] text-navy/40 text-xl md:text-2xl font-medium leading-relaxed italic border-t border-navy/5">
                    {item.a}
                  </AccordionContent>
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
