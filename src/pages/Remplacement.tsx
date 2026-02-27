import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Clock, Stethoscope, Send, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const annonces = [
  {
    type: "Recherche remplaçant",
    profession: "Médecin généraliste",
    lieu: "Lyon 3 – Point du Jour",
    periode: "Du 10 au 21 mars 2025",
    description: "Cabinet de groupe, 3 médecins. Patientèle variée. Logiciel Doctolib. Rétrocession 80%.",
    urgent: true,
    date: "Publié le 20/02/2025",
  },
  {
    type: "Recherche remplaçant",
    profession: "Infirmier(ère)",
    lieu: "Lyon 3 – Saint-Just",
    periode: "Tous les lundis à partir d'avril 2025",
    description: "Cabinet libéral, tournée mixte (domicile + cabinet). Véhicule nécessaire.",
    urgent: false,
    date: "Publié le 18/02/2025",
  },
  {
    type: "Disponible pour remplacement",
    profession: "Kinésithérapeute",
    lieu: "Lyon 3 et alentours",
    periode: "Disponible de suite",
    description: "5 ans d'expérience. Spécialisé en rééducation post-opératoire et sport.",
    urgent: false,
    date: "Publié le 15/02/2025",
  },
  {
    type: "Recherche remplaçant",
    profession: "Médecin généraliste",
    lieu: "Lyon 3 – Vieux Lyon",
    periode: "Été 2025 (juillet-août)",
    description: "Cabinet individuel. Patientèle fidèle. Cadre agréable en centre historique.",
    urgent: false,
    date: "Publié le 10/02/2025",
  },
];

const Remplacement = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast({ title: "Annonce envoyée", description: "Votre annonce sera publiée après validation." });
  };

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
              Remplacement
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-lg text-navy-foreground/80 max-w-2xl mx-auto"
            >
              Trouvez un remplaçant ou proposez vos disponibilités sur le territoire de Lyon 3.
            </motion.p>
          </div>
        </section>

        {/* Annonces */}
        <section className="py-16">
          <div className="container max-w-5xl">
            <h2 className="text-2xl font-display font-bold mb-8">Annonces en cours</h2>
            <div className="grid gap-6">
              {annonces.map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant={a.type === "Recherche remplaçant" ? "default" : "secondary"}>
                          {a.type}
                        </Badge>
                        {a.urgent && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Urgent
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{a.profession}</CardTitle>
                      <CardDescription>{a.date}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 text-primary" />
                        {a.lieu}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="w-4 h-4 text-primary" />
                        {a.periode}
                      </div>
                      <p className="text-sm mt-3">{a.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm">Contacter</Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Formulaire */}
        <section className="py-16 bg-muted/50">
          <div className="container max-w-2xl">
            <h2 className="text-2xl font-display font-bold mb-2">Déposer une annonce</h2>
            <p className="text-muted-foreground mb-8">
              Remplissez le formulaire ci-dessous. Votre annonce sera publiée après validation par l'équipe CPTS.
            </p>

            {submitted ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-display font-bold mb-2">Annonce envoyée !</h3>
                  <p className="text-muted-foreground">
                    Notre équipe la validera sous 48h. Vous recevrez une confirmation par email.
                  </p>
                  <Button className="mt-6" onClick={() => setSubmitted(false)}>
                    Déposer une autre annonce
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="type">Type d'annonce</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="recherche">Recherche remplaçant</SelectItem>
                            <SelectItem value="disponible">Disponible pour remplacement</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profession">Profession</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="medecin">Médecin généraliste</SelectItem>
                            <SelectItem value="infirmier">Infirmier(ère)</SelectItem>
                            <SelectItem value="kine">Kinésithérapeute</SelectItem>
                            <SelectItem value="pharmacien">Pharmacien(ne)</SelectItem>
                            <SelectItem value="autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="nom">Nom</Label>
                        <Input id="nom" placeholder="Votre nom" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="votre@email.fr" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="periode">Période souhaitée</Label>
                      <Input id="periode" placeholder="Ex: Du 10 au 21 mars 2025" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Décrivez votre annonce (conditions, spécificités...)" rows={4} required />
                    </div>
                    <Button type="submit" className="w-full" size="lg">
                      <Send className="w-4 h-4" />
                      Envoyer l'annonce
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Remplacement;
