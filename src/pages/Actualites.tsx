import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Plus, Loader2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  image_url: string;
  published_at: string;
  content?: string;
}

const Actualites = () => {
  const { data: articles, isLoading, error } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("published_at", { ascending: false });
      
      if (error) throw error;
      return data as Article[];
    },
  });

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
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="w-16 h-16 text-sky-600 animate-spin mb-6" />
                <p className="text-navy/40 font-display font-bold text-2xl italic">Chargement des actualités...</p>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center justify-center py-40 bg-red-50/50 rounded-[4rem] border border-dashed border-red-200">
                <AlertCircle className="w-16 h-16 text-red-400 mb-6" />
                <h4 className="text-navy font-display font-bold text-3xl mb-4">Erreur de connexion</h4>
                <p className="text-navy/40 font-bold text-xl italic">Impossible de récupérer les actualités pour le moment.</p>
              </div>
            )}

            {!isLoading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                {articles?.map((article, i) => (
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
                        src={article.image_url || "/placeholder-news.jpg"}
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
                        {new Date(article.published_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
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
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Actualites;
