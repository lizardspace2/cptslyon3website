import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
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

const Actualites = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative py-24 bg-navy text-navy-foreground">
          <div className="container text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-display font-bold"
            >
              Actualités
            </motion.h1>
          </div>
        </section>

        <section className="py-20">
          <div className="container max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {articles.map((article, i) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="relative h-56 overflow-hidden">
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
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{article.excerpt}</p>
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
