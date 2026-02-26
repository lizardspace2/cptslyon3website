import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const GenericPage = ({ title }: { title: string }) => {
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
              {title}
            </motion.h1>
          </div>
        </section>

        <section className="py-20">
          <div className="container max-w-4xl text-center">
            <p className="text-lg text-muted-foreground">
              Cette page est en cours de construction. Revenez bientôt !
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default GenericPage;
