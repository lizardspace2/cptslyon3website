import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Plus } from "lucide-react";
import { motion } from "framer-motion";
import news1 from "@/assets/lyon-place-bellecour.jpg";
import news2 from "@/assets/lyon-hotel-de-ville.jpg";
import news3 from "@/assets/lyon-vue-generale.jpg";

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

const NewsSection = () => {
  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-sky-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
      
      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-block px-5 py-2 rounded-full border border-sky-600/10 text-sky-700 font-bold text-xs uppercase tracking-widest mb-6 bg-white shadow-xl shadow-navy/[0.02]"
            >
              Actualités & Événements
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-display font-bold text-navy tracking-tight"
            >
              Suivez la vie de votre CPTS
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Button size="lg" variant="outline" className="border-navy/10 text-navy hover:bg-navy hover:text-white rounded-full px-10 h-14 font-bold transition-all shadow-lg shadow-navy/[0.02]" asChild>
              <Link to="/actualites">
                Voir toutes les actualités
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {articles.map((article, i) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-navy/[0.03] border border-navy/5 hover:border-sky-600/20 hover:shadow-sky-600/15 transition-all duration-500 flex flex-col h-full"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent opacity-0 group-hover:opacity-1 transition-opacity duration-500" />
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-sky-700 text-xs font-bold px-4 py-2 rounded-full shadow-xl">
                  {article.category}
                </div>
                <Link 
                  to={`/actualites/${article.id}`}
                  className="absolute bottom-6 right-6 w-14 h-14 rounded-2xl bg-white text-navy flex items-center justify-center shadow-xl transform translate-y-20 group-hover:translate-y-0 transition-all duration-500 hover:bg-sky-600 hover:text-white"
                >
                  <Plus className="w-7 h-7" />
                </Link>
              </div>
              <div className="p-10 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-600/60 uppercase tracking-widest mb-4">
                  <Clock className="w-4 h-4" strokeWidth={3} />
                  {article.date}
                </div>
                <h3 className="text-2xl font-display font-bold text-navy mb-4 line-clamp-2 leading-tight group-hover:text-sky-600 transition-colors duration-300">
                  <Link to={`/actualites/${article.id}`}>
                    {article.title}
                  </Link>
                </h3>
                <p className="text-navy/60 font-medium line-clamp-3 leading-relaxed mb-8 italic">
                  {article.excerpt}
                </p>
                <div className="mt-auto pt-6 border-t border-navy/5">
                  <Link 
                    to={`/actualites/${article.id}`}
                    className="inline-flex items-center text-navy font-bold hover:text-sky-600 group/link transition-colors"
                  >
                    Lire l'article complet
                    <ArrowRight className="ml-2 w-5 h-5 transform group-hover/link:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
