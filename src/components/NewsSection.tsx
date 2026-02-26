import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";
import { motion } from "framer-motion";
import news1 from "@/assets/news-1.jpg";
import news2 from "@/assets/news-2.jpg";
import news3 from "@/assets/news-3.jpg";

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
    excerpt: "La CPTS Lyon 5 organise une rencontre pluriprofessionnelle entre les médecins généralistes, les psychomotriciennes et les orthophonistes du territoire…",
    date: "il y a 3 semaines",
    category: "Actualités",
    image: news2,
  },
  {
    id: 3,
    title: "Wébinaire – Présentation des dispositifs de l'hôpital du Vinatier",
    excerpt: "La CPTS Lyon 5 vous propose un temps d'échange en format webinaire avec le CMP Perrache afin de vous présenter…",
    date: "il y a 2 mois",
    category: "Actualités",
    image: news3,
  },
];

const NewsSection = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Les dernières actualités de la CPTS
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, i) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  {article.category}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                  <Clock className="w-3.5 h-3.5" />
                  {article.date}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3">{article.excerpt}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link to="/actualites">
              Voir toutes les actualités
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
