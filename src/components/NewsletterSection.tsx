import { Button } from "@/components/ui/button";
import { Mail, ArrowRight, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const NewsletterSection = () => {
  return (
    <section className="py-24 md:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#F4F9FD] rounded-[2.5rem] p-10 md:p-16 lg:p-20 overflow-hidden relative"
        >
          {/* Decorative background circle */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/40 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-block px-4 py-1.5 rounded-full border border-sky-600/20 text-sky-700 font-bold text-sm mb-8 bg-white shadow-sm"
              >
                Restez Informé
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl font-display font-bold text-navy mb-8 leading-tight">
                Inscription à notre <span className="text-sky-600">newsletter</span>
              </h2>
              
              <p className="text-navy/60 mb-10 text-lg md:text-xl font-medium leading-relaxed">
                Ne ratez aucun événement ni actualité majeure du territoire. Recevez nos derniers dossiers directement dans votre boîte mail.
              </p>
              
              <Button size="xl" className="bg-navy hover:bg-navy/90 text-white rounded-full px-10 h-16 text-lg font-bold shadow-xl shadow-navy/10 transition-all active:scale-95" asChild>
                <a href="mailto:cptslyon3@gmail.com?subject=Inscription newsletter">
                  <Mail className="mr-3 w-6 h-6" />
                  S'abonner gratuitement
                </a>
              </Button>
            </div>

            <motion.div
              initial={{ opacity: 0, rotate: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, rotate: -2, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ rotate: 0, scale: 1.02 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-[2rem] shadow-2xl shadow-navy/[0.05] p-10 md:p-12 relative z-10 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center mb-8">
                <FileText className="w-8 h-8 text-sky-600" />
              </div>
              
              <span className="text-xs font-bold text-sky-600 uppercase tracking-[0.2em] mb-3 block">Dernière édition</span>
              <h3 className="text-2xl font-display font-bold text-navy mb-4">La Lettre de Janvier 2026</h3>
              
              <p className="text-navy/60 text-lg font-medium mb-8 leading-relaxed">
                Au programme : Le nouveau pôle de santé, les groupes de travail sur la prévention et le calendrier des évènements pros.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-full grow h-12" asChild>
                  <Link to="/actualites">
                    Lire le numéro
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="lg" className="text-navy/60 font-bold hover:text-navy hover:bg-navy/5 rounded-full h-12" asChild>
                  <Link to="/actualites">Archives</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
