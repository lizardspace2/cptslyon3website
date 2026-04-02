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
    category: "Actualités",
    image: news1,
  },
  {
    id: 2,
    title: "Rencontre pluriprofessionnelle",
    excerpt: "La CPTS Lyon 3 organise une rencontre pluriprofessionnelle entre les médecins généralistes, les psychomotriciennes et les orthophonistes du territoire…",
    date: "il y a 3 semaines",
    category: "Évènement",
    image: news2,
  },
  {
    id: 3,
    title: "Wébinaire – Présentation des dispositifs de l'hôpital du Vinatier",
    excerpt: "La CPTS Lyon 3 vous propose un temps d'échange en format webinaire avec le CMP Perrache afin de vous présenter…",
    date: "il y a 2 mois",
    category: "Wébinaire",
    image: news3,
  },
];

const NewsSection = () => {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full border border-sky-600/20 text-sky-700 font-bold text-sm mb-6 bg-white shadow-sm"
            >
              Actualités & Évènements
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-display font-bold text-navy"
            >
              Suivez la vie de votre CPTS
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Button variant="outline" className="border-navy/10 text-navy hover:bg-navy/5 rounded-full px-8 h-12 font-bold transition-all" asChild>
              <Link to="/actualites">
                Toute l'actu
                <ArrowRight className="ml-2 w-4 h-4" />
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
              transition={{ delay: i * 0.15 }}
              className="group bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-navy/[0.04] border border-navy/5 hover:border-sky-600/20 hover:shadow-sky-600/10 transition-all duration-500 flex flex-col"
            >
              <div className="relative h-64 overflow-hidden rounded-t-[2rem]">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                <span className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-navy text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                  {article.category}
                </span>
                <Link 
                  to={`/actualites/${article.id}`}
                  className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-white text-navy flex items-center justify-center shadow-lg group-hover:bg-sky-600 group-hover:text-white transition-colors duration-300"
                >
                  <Plus className="w-6 h-6" />
                </Link>
              </div>
              <div className="p-8 flex flex-col grow">
                <div className="flex items-center gap-2 text-xs font-bold text-navy/40 mb-4 uppercase tracking-widest">
                  <Clock className="w-3.5 h-3.5" strokeWidth={3} />
                  {article.date}
                </div>
                <h3 className="text-xl md:text-2xl font-display font-bold text-navy mb-4 line-clamp-2 leading-tight group-hover:text-sky-600 transition-colors">
                  <Link to={`/actualites/${article.id}`}>
                    {article.title}
                  </Link>
                </h3>
                <p className="text-navy/60 font-medium line-clamp-3 leading-relaxed mb-6 grow">{article.excerpt}</p>
                <Link 
                  to={`/actualites/${article.id}`}
                  className="inline-flex items-center text-sky-600 font-bold hover:underline group/link transition-all"
                >
                  Lire la suite
                  <ArrowRight className="ml-2 w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
