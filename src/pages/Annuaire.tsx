import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const professionals = [
  { name: "Dr. Martin Dupont", specialty: "Médecin généraliste", phone: "04 78 XX XX XX", address: "12 Rue de la République, 69005" },
  { name: "Sophie Leroux", specialty: "Infirmière libérale", phone: "06 XX XX XX XX", address: "45 Avenue du Point du Jour, 69005" },
  { name: "Pierre Moreau", specialty: "Kinésithérapeute", phone: "04 72 XX XX XX", address: "8 Place de Fourvière, 69005" },
  { name: "Marie Blanc", specialty: "Orthophoniste", phone: "04 78 XX XX XX", address: "23 Rue Saint-Just, 69005" },
  { name: "Jean-Luc Bernard", specialty: "Diététicien", phone: "06 XX XX XX XX", address: "5 Quai de la Saône, 69005" },
  { name: "Dr. Claire Fontaine", specialty: "Médecin généraliste", phone: "04 78 XX XX XX", address: "17 Rue de Champvert, 69005" },
];

const Annuaire = () => {
  const [search, setSearch] = useState("");

  const filtered = professionals.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.specialty.toLowerCase().includes(search.toLowerCase())
  );

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
              Annuaire des professionnels
            </motion.h1>
          </div>
        </section>

        <section className="py-20">
          <div className="container max-w-4xl">
            <div className="flex gap-3 mb-10">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou spécialité..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              {filtered.map((pro, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-xl shadow-card p-6 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold text-lg">{pro.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">{pro.name}</h3>
                    <p className="text-sm text-primary font-medium">{pro.specialty}</p>
                    <p className="text-xs text-muted-foreground mt-1">{pro.address}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">{pro.phone}</div>
                </motion.div>
              ))}
              {filtered.length === 0 && (
                <p className="text-center text-muted-foreground py-10">Aucun professionnel trouvé.</p>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Annuaire;
