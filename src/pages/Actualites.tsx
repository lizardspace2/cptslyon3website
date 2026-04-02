import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Plus } from "lucide-react";
import news1 from "@/assets/news-1.jpg";
import news2 from "@/assets/news-2.jpg";
import news3 from "@/assets/news-3.jpg";
import { Link } from "react-router-dom";

const articles = [
  {
    id: 1,
    title: "Groupe de pairs infirmières et infirmiers",
    excerpt: "Afin d'organiser au mieux l'espace et le repas, merci de nous informer de votre participation via le lien suivant…",
    date: "il y a 2 jours",
    category: "Réunion",
    image: news1,
  },
  {
    id: 2,
    title: "Rencontre pluriprofessionnelle",
    excerpt: "La CPTS Lyon 3 organise une rencontre pluriprofessionnelle entre les médecins généralistes, les psychomotriciennes et les orthophonistes du territoire…",
    date: "il y a 3 semaines",
    category: "Événement",
    image: news2,
  },
  {
    id: 3,
    title: "Wébinaire – Présentation des dispositifs de l'hôpital du Vinatier",
    excerpt: "La CPTS Lyon 3 vous propose un temps d'échange en format webinaire avec le CMP Perrache afin de vous présenter…",
    date: "il y a 2 mois",
    category: "Formation",
    image: news3,
  },
];

const Actualites = () => {
  return (
    <div className="min-h-screen bg-background text-base">
      <Header />
      <main>
        <PageBanner 
          title="Actualités" 
          subtitle="Suivez les dernières nouvelles de la CPTS et les événements du territoire."
        />

        <section className="py-24 relative overflow-hidden">
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="container max-w-6xl relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
              {articles.map((article, i) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.7 }}
                  className="group bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-navy/[0.03] border border-navy/5 hover:border-sky-600/30 hover:shadow-sky-600/20 transition-all duration-700 flex flex-col h-full"
                >
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md text-sky-700 text-xs font-black px-5 py-2.5 rounded-2xl shadow-2xl uppercase tracking-widest border border-white/20">
                      {article.category}
                    </div>
                    <div className="absolute bottom-8 right-8 w-16 h-16 rounded-[1.8rem] bg-white text-navy flex items-center justify-center shadow-3xl transform translate-y-32 group-hover:translate-y-0 transition-all duration-700 hover:bg-sky-600 hover:text-white cursor-pointer group/plus">
                      <Plus className="w-8 h-8 group-hover/plus:rotate-90 transition-transform duration-500" />
                    </div>
                  </div>
                  <div className="p-12 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-xs font-black text-sky-600/60 uppercase tracking-[0.2em] mb-6">
                      <Clock className="w-4 h-4 text-sky-600" />
                      {article.date}
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-display font-bold text-navy mb-6 line-clamp-2 leading-tight group-hover:text-sky-600 transition-colors duration-500 tracking-tight">
                      {article.title}
                    </h3>
                    <p className="text-navy/60 font-medium line-clamp-3 leading-relaxed mb-10 italic text-lg">
                      {article.excerpt}
                    </p>
                    <div className="mt-auto pt-8 border-t border-navy/5">
                      <button className="flex items-center gap-3 text-navy font-black hover:text-sky-600 transition-all uppercase text-xs tracking-widest group/btn">
                        Lire l'article complet
                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-3 transition-transform text-sky-600" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Actualites;
