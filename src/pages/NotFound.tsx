import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="container max-w-lg text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertCircle size={48} />
            </div>

            <h1 className="text-8xl font-display font-bold text-navy mb-4">404</h1>
            <h2 className="text-2xl font-display font-bold mb-6">Page introuvable</h2>

            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
              Pas d'inquiétude, vous pouvez retourner à l'accueil pour continuer votre navigation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="gap-2">
                <Link to="/">
                  <Home size={18} />
                  Retour à l'accueil
                </Link>
              </Button>
              <Button size="lg" variant="outline" onClick={() => window.history.back()} className="gap-2">
                <ArrowLeft size={18} />
                Page précédente
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
