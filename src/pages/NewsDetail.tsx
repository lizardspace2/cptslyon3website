import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { motion } from "framer-motion";
import { Clock, Tag, ArrowLeft, Calendar, Share2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  image_url: string;
  published_at: string;
  content: string;
}

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: article, isLoading, error } = useQuery({
    queryKey: ["news", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data as Article;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center py-60">
          <Loader2 className="w-16 h-16 text-sky-600 animate-spin mb-6" />
          <p className="text-navy/40 font-display font-bold text-2xl italic">Chargement de l'article...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-4xl py-40 text-center">
          <div className="bg-red-50/50 rounded-[4rem] p-20 border border-dashed border-red-200">
            <AlertCircle className="w-20 h-20 text-red-400 mx-auto mb-8" />
            <h2 className="text-4xl font-display font-bold text-navy mb-6">Article introuvable</h2>
            <p className="text-navy/60 text-xl font-medium mb-12">Désolé, l'article que vous recherchez n'existe pas ou a été déplacé.</p>
            <Button asChild className="h-20 rounded-[2rem] px-12 bg-navy hover:bg-sky-600 text-white font-bold text-lg transition-all shadow-2xl">
              <Link to="/actualites">Retour aux actualités</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* News Specific Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-navy/5 -z-10" />
          <div className="container max-w-5xl relative z-10 px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-8"
            >
              <div className="flex items-center flex-wrap gap-4">
                <Link to="/actualites" className="flex items-center gap-2 text-sky-600 font-black text-[10px] uppercase tracking-widest hover:text-navy transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Actualités
                </Link>
                <span className="w-1.5 h-1.5 rounded-full bg-navy/10" />
                <span className="px-4 py-1.5 rounded-full bg-sky-50 text-sky-700 font-black text-[10px] uppercase tracking-widest border border-sky-600/10">
                  {article.category}
                </span>
              </div>

              <h1 className="text-4xl md:text-7xl font-display font-bold text-navy tracking-tight leading-[1.1]">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-8 pt-4 border-t border-navy/5">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center border border-navy/5">
                      <Calendar className="w-5 h-5 text-sky-600" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-navy/20">Publié le</p>
                      <p className="font-bold text-navy">
                        {new Date(article.published_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </p>
                   </div>
                </div>
                
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center border border-navy/5">
                      <Clock className="w-5 h-5 text-sky-600" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-navy/20">Temps de lecture</p>
                      <p className="font-bold text-navy">Environ 4 min</p>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Big Cover Image */}
        <section className="container max-w-6xl px-6">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1 }}
             className="relative h-[400px] md:h-[650px] rounded-[3.5rem] md:rounded-[5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(21,42,66,0.15)] border-8 border-white"
           >
              <img 
                src={article.image_url || "/placeholder-news.jpg"} 
                alt={article.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent" />
           </motion.div>
        </section>

        {/* Content Area */}
        <section className="py-24 md:py-32 relative">
          <div className="container max-w-4xl px-6">
            <div className="flex flex-col md:flex-row gap-20">
              {/* Sidebar Info */}
              <aside className="md:w-64 shrink-0 space-y-12">
                 <div className="p-8 rounded-[2.5rem] bg-navy text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-150 duration-700" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-6">Partager</p>
                    <div className="flex flex-col gap-4">
                       <Button variant="ghost" className="w-full justify-start gap-4 h-14 rounded-2xl hover:bg-white/10 text-white font-bold border border-white/5">
                          <Share2 className="w-5 h-5 text-sky-400" />
                          Copier le lien
                       </Button>
                    </div>
                 </div>

                 <div className="space-y-6 px-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-navy/20">Mots-clés</h4>
                    <div className="flex flex-wrap gap-3">
                       {["Santé", article.category, "Lyon 3"].map(tag => (
                         <span key={tag} className="px-4 py-2 rounded-xl bg-sky-50 text-sky-600 font-bold text-xs border border-sky-200/50">
                           #{tag}
                         </span>
                       ))}
                    </div>
                 </div>
              </aside>

              {/* Main Content */}
              <div className="flex-1">
                <div className="prose prose-2xl prose-navy max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-lead:text-navy/60 prose-lead:italic prose-p:text-navy/80 prose-p:leading-relaxed prose-strong:text-navy prose-strong:font-black">
                  <p className="text-3xl lg:text-4xl text-navy/40 font-medium italic leading-normal mb-16 border-l-8 border-sky-100 pl-10 py-4 underline-offset-8 decoration-sky-500/30">
                    {article.excerpt}
                  </p>
                  
                  <div 
                    className="article-content rich-text space-y-8"
                    dangerouslySetInnerHTML={{ __html: article.content || '<p>Contenu en cours de rédaction...</p>' }}
                  />
                </div>

                <div className="mt-24 pt-12 border-t border-navy/5 flex flex-col md:flex-row items-center justify-between gap-10">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-sky-50 flex items-center justify-center border border-sky-100 shadow-sm">
                         <span className="font-display font-black text-2xl text-sky-600">C.</span>
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-navy/20">Écrit par</p>
                         <p className="font-bold text-navy text-xl">L'équipe CPTS Lyon 3</p>
                      </div>
                   </div>
                   <Button asChild variant="outline" className="h-20 rounded-[2.2rem] px-10 border-navy/10 text-navy font-bold hover:bg-navy hover:text-white transition-all shadow-inner hover:shadow-2xl">
                     <Link to="/actualites" className="flex items-center gap-4">
                        <ArrowLeft className="w-5 h-5" />
                        Toutes les actualités
                     </Link>
                   </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default NewsDetail;
