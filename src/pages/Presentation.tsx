import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { motion } from "framer-motion";
import { Users, Heart, ShieldCheck, Mail, Zap, Target, Star, Globe, ArrowRight } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import MissionsSection from "@/components/MissionsSection";
import NewsSection from "@/components/NewsSection";
import KeyFigures from "@/components/KeyFigures";
import FAQSection from "@/components/FAQSection";
import PartnersSection from "@/components/PartnersSection";
import NewsletterSection from "@/components/NewsletterSection";
import TerritorySection from "@/components/TerritorySection";
import SearchProSection from "@/components/SearchProSection";
import ContactSection from "@/components/ContactSection";

const Presentation = () => {
  return (
    <div className="min-h-screen bg-background text-base">
      <Header />
      <main>
        <PageBanner 
          title="Présentation" 
          subtitle="Découvrez notre vision, nos missions et l'équipe qui porte la CPTS Lyon 3."
        />

        <div className="bg-white">
          <HeroSection />
        </div>

        <section className="py-24 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="container max-w-5xl relative z-10">
            <div className="text-center mb-20">
              <span className="inline-block px-4 py-1.5 rounded-full bg-sky-50 text-sky-600 font-black text-[10px] uppercase tracking-[0.2em] mb-6 shadow-sm border border-sky-600/10">
                Qui sommes-nous ?
              </span>
              <h2 className="text-3xl md:text-6xl font-display font-bold text-navy mb-8 tracking-tighter decoration-sky-600/30 decoration-8">Une démarche de terrain</h2>
              <p className="text-navy/60 text-xl font-medium leading-[1.8] max-w-3xl mx-auto italic">
                La CPTS Lyon 3 est une démarche portée par et pour tous les professionnels de santé du territoire. Elle s’appuie sur une conviction forte : les besoins du terrain sont le point de départ de nos actions.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-20">
              {[
                { title: "Accès aux soins", icon: Users, color: "bg-sky-50 text-sky-600", desc: "Favoriser l'accès à un médecin traitant." },
                { title: "Parcours de soins", icon: Heart, color: "bg-emerald-50 text-emerald-600", desc: "Fluidifier le lien ville-hôpital." },
                { title: "Prévention", icon: Zap, color: "bg-rose-50 text-rose-600", desc: "Développer des actions de terrain." },
                { title: "Coordination", icon: Star, color: "bg-amber-50 text-amber-600", desc: "Fédérer les acteurs de santé." }
              ].map((mission, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-white p-10 rounded-[3rem] border border-navy/5 shadow-2xl shadow-navy/[0.03] flex flex-col items-center text-center group hover:shadow-sky-600/20 hover:border-sky-600/30 transition-all duration-700 hover:-translate-y-2"
                >
                  <div className={`w-20 h-20 rounded-[2rem] ${mission.color} flex items-center justify-center mb-8 shadow-xl shadow-current/10 group-hover:scale-110 transition-transform duration-500`}>
                    <mission.icon className="w-10 h-10" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-display font-bold text-navy mb-4 tracking-tight uppercase tracking-widest">{mission.title}</h3>
                  <p className="text-navy/40 text-sm font-bold leading-relaxed">{mission.desc}</p>
                </motion.div>
              ))}
            </div>

            <MissionsSection />
            <KeyFigures />
            <TerritorySection />

            <div className="text-center mb-20">
              <span className="inline-block px-4 py-1.5 rounded-full bg-navy/5 text-navy/40 font-black text-[10px] uppercase tracking-[0.2em] mb-6 shadow-sm border border-navy/10">
                Notre Équipe
              </span>
              <h2 className="text-3xl md:text-6xl font-display font-bold text-navy mb-8 tracking-tighter">L'équipe de la CPTS</h2>
              <p className="text-navy/60 text-xl font-medium leading-relaxed italic">Les visages qui s'engagent au quotidien pour le territoire de Lyon 3ème.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { name: "David Ciabrini", role: "Médecin Généraliste, Président de la CPTS", email: "cptslyon3@gmail.com" },
                { name: "Camille Bordagaray", role: "Chargée de Mission en Santé", email: "cptslyon3@gmail.com" },
                { name: "Elsa Châlons-Cottavoz", role: "Kiné, Vice-Présidente de la CPTS", email: "cptslyon3@gmail.com" }
              ].map((member, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.7 }}
                  className="group bg-white p-12 rounded-[4rem] border border-navy/5 shadow-3xl shadow-navy/[0.04] hover:shadow-sky-600/15 hover:border-sky-600/30 transition-all duration-700 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-all duration-1000" />
                  
                  <div className="w-24 h-24 rounded-[2.5rem] bg-sky-50 text-sky-600 flex items-center justify-center mb-10 font-display font-bold text-4xl group-hover:bg-sky-600 group-hover:text-white transition-all duration-500 shadow-2xl shadow-sky-600/10 group-hover:rotate-6">
                    {member.name.charAt(0)}
                  </div>
                  <h4 className="font-display font-bold text-3xl text-navy mb-4 tracking-tight group-hover:text-sky-600 transition-colors">{member.name}</h4>
                  <p className="text-sky-600 font-black text-xs tracking-[0.2em] uppercase mb-10 opacity-70">{member.role}</p>
                  
                  <div className="pt-8 border-t border-navy/5 flex justify-between items-center group/link">
                    <a href={`mailto:${member.email}`} className="flex items-center gap-3 text-navy/40 hover:text-sky-600 font-bold transition-all text-sm uppercase tracking-widest">
                      <Mail className="w-4 h-4 text-sky-600" />
                      Contact
                    </a>
                    <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center group-hover/link:bg-sky-600 group-hover/link:text-white transition-all">
                       <ArrowRight className="w-5 h-5 -rotate-45" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <NewsSection />
        <PartnersSection />
        <FAQSection />
        <SearchProSection />
        <ContactSection />
        <NewsletterSection />

        <section className="py-24 bg-navy text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(2,132,199,0.1),transparent)] pointer-events-none" />
          <div className="container max-w-4xl relative z-10 text-center">
            <h2 className="text-3xl md:text-6xl font-display font-bold mb-10 tracking-tight text-white leading-tight">Envie de contribuer à la santé du territoire ?</h2>
            <p className="text-white/60 text-xl font-medium mb-16 italic max-w-2xl mx-auto leading-relaxed">
              La CPTS est une association ouverte à tous les acteurs de santé de Lyon 3ème. Rejoignez-nous pour construire ensemble demain.
            </p>
            <div className="flex flex-col md:flex-row gap-8 justify-center">
               <button className="h-20 px-12 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-black text-xl shadow-2xl shadow-sky-600/30 transition-all hover:scale-105 active:scale-95">
                 Adhérer à la CPTS
               </button>
               <button className="h-20 px-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black text-xl transition-all hover:scale-105 active:scale-95 backdrop-blur-sm">
                 En savoir plus
               </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Presentation;
