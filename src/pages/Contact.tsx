import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, MessageCircle, ArrowRight, Sparkles, Zap, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message envoyé", description: "Nous vous répondrons dans les plus brefs délais." });
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background text-base">
      <Header />
      <main>
        <PageBanner 
          title="Contact" 
          subtitle="Une question ? Un projet ? Notre équipe est à votre écoute pour vous accompagner."
        />

        <section className="py-32 relative overflow-hidden">
          <div className="absolute top-1/2 left-0 w-full h-full bg-[radial-gradient(circle_at_left_center,rgba(2,132,199,0.03),transparent)] pointer-events-none" />
          
          <div className="container max-w-7xl relative z-10 px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-32 items-start">
              <div className="lg:col-span-5 space-y-20">
                <div className="max-w-xl">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    whileInView={{ opacity: 1, scale: 1 }} 
                    viewport={{ once: true }}
                    className="w-24 h-24 bg-white rounded-[2.2rem] flex items-center justify-center mb-12 shadow-3xl border border-sky-100 ring-4 ring-sky-50"
                  >
                    <MessageCircle className="w-12 h-12 text-sky-600" strokeWidth={1} />
                  </motion.div>
                  <span className="px-5 py-2 rounded-full bg-sky-50 text-sky-700 font-black text-[10px] uppercase tracking-[0.3em] border border-sky-600/10 mb-8 inline-block shadow-sm">
                    Dialogue & Échange
                  </span>
                  <h2 className="text-4xl md:text-8xl font-display font-bold text-navy mb-10 tracking-tighter leading-tight">Restons en contact</h2>
                  <p className="text-navy/40 text-xl lg:text-2xl font-medium leading-relaxed mb-12 italic leading-relaxed">
                    Que vous soyez professionnel de santé, partenaire institutionnel ou usager, notre bureau est prêt à répondre à vos sollicitations.
                  </p>
                </div>

                <div className="space-y-16">
                  {[
                    { icon: Mail, title: "Courriel Officiel", value: "cptslyon3@gmail.com", href: "mailto:cptslyon3@gmail.com", color: "sky" },
                    { icon: MapPin, title: "Siège Administratif", value: "24 rue Barrier, 69006 Lyon", href: "#", color: "navy" },
                    { icon: Phone, title: "Ligne de Coordination", value: "07 45 28 16 26", href: "tel:0745281626", color: "emerald" }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15, duration: 0.7 }}
                      className="flex items-center gap-10 group"
                    >
                      <div className="w-20 h-20 rounded-[2rem] bg-white text-navy flex items-center justify-center shrink-0 group-hover:bg-sky-600 group-hover:text-white transition-all duration-700 shadow-3xl border border-navy/5 group-hover:rotate-6 group-hover:scale-110">
                        <item.icon className="w-9 h-9 opacity-40 group-hover:opacity-100" strokeWidth={1} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <h3 className="font-black text-navy/20 text-[10px] uppercase tracking-[0.4em]">{item.title}</h3>
                        {item.href !== "#" ? (
                          <a href={item.href} className="text-2xl lg:text-3xl font-display font-bold text-navy hover:text-sky-600 transition-colors tracking-tighter leading-none">
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-2xl lg:text-3xl font-display font-bold text-navy tracking-tighter leading-none">{item.value}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-7 relative"
              >
                <div className="absolute inset-0 bg-sky-600/10 blur-[150px] opacity-20 pointer-events-none -translate-y-20" />
                <div className="bg-white rounded-[4.5rem] p-1 shadow-3xl border border-white relative overflow-hidden group/form">
                  <div className="bg-white rounded-[4.4rem] p-12 md:p-24 relative z-10">
                    <div className="flex items-center gap-4 mb-16 px-8 py-3 rounded-full bg-sky-50 border border-sky-600/10 w-fit">
                       <Sparkles className="w-4 h-4 text-sky-600" />
                       <span className="font-black text-[10px] uppercase tracking-widest text-sky-700">Formulaire de Prestige</span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-14">
                      <div className="grid gap-14 md:grid-cols-2">
                        <div className="space-y-6">
                          <Label htmlFor="name" className="text-navy font-black text-[10px] uppercase tracking-[0.4em] ml-2 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-sky-500" />
                            Votre Nom
                          </Label>
                          <Input
                            id="name"
                            placeholder="Dr. Jean-Pierre Durant"
                            className="h-20 rounded-[1.8rem] border-navy/5 bg-sky-50/10 font-bold text-navy placeholder:text-navy/10 focus-visible:ring-sky-500/20 px-10 transition-all text-xl shadow-inner border-0"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-6">
                          <Label htmlFor="email" className="text-navy font-black text-[10px] uppercase tracking-[0.4em] ml-2 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-sky-500" />
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="contact@institution.fr"
                            className="h-20 rounded-[1.8rem] border-navy/5 bg-sky-50/10 font-bold text-navy placeholder:text-navy/10 focus-visible:ring-sky-500/20 px-10 transition-all text-xl shadow-inner border-0"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-6">
                        <Label htmlFor="message" className="text-navy font-black text-[10px] uppercase tracking-[0.4em] ml-2 flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-sky-500" />
                          Message
                        </Label>
                        <Textarea
                          id="message"
                          placeholder="Détaillez votre demande ou votre projet de coordination..."
                          rows={6}
                          className="rounded-[2.8rem] border-navy/5 bg-sky-50/10 font-bold text-navy placeholder:text-navy/10 focus-visible:ring-sky-500/20 p-12 transition-all text-xl shadow-inner border-0"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                        />
                      </div>
                      <div className="pt-8">
                        <Button type="submit" className="w-full h-24 rounded-[2.5rem] bg-navy hover:bg-sky-600 text-white font-black text-2xl shadow-[0_30px_60px_rgba(21,42,66,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-6 group/submit border-b-8 border-navy-foreground/10" size="lg">
                          <Send className="w-8 h-8 group-hover/submit:translate-x-4 group-hover/submit:-translate-y-4 transition-transform duration-500" />
                          Transmettre ma demande
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-40 bg-[#0F1C2E] text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(2,132,199,0.1),transparent)] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[150px] pointer-events-none" />
          
          <div className="container max-w-5xl relative z-10 text-center px-6">
            <div className="w-28 h-28 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center mx-auto mb-16 shadow-3xl border border-white/5 ring-8 ring-white/[0.02]">
               <Heart className="w-14 h-14 text-sky-400" strokeWidth={1} />
            </div>
            <h2 className="text-4xl md:text-8xl font-display font-bold mb-12 tracking-tighter leading-none text-white">Nous rejoindre ?</h2>
            <p className="text-white/40 text-xl lg:text-3xl font-medium mb-20 italic leading-relaxed max-w-3xl mx-auto leading-relaxed">
              Vous êtes professionnel de santé sur le 3ème arrondissement de Lyon et souhaitez participer activement à nos missions ?
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-10">
              <Button variant="outline" className="w-full md:w-auto h-24 border-white/10 text-white hover:bg-white hover:text-navy rounded-[2.5rem] px-20 text-2xl font-black transition-all shadow-3xl active:scale-95 group/btn-join min-w-[350px]" asChild>
                <Link to="/espace-adherent">
                  L'Espace Adhérent
                  <ArrowRight className="ml-6 w-8 h-8 group-hover/btn-join:translate-x-3 transition-transform" />
                </Link>
              </Button>
              <div className="flex items-center gap-4 bg-white/5 px-10 py-6 rounded-full border border-white/10 backdrop-blur-xl">
                 <Zap className="w-6 h-6 text-emerald-400" />
                 <span className="font-black text-[10px] uppercase tracking-[0.3em] text-white/60 select-none">Adhésion en 2 minutes</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
