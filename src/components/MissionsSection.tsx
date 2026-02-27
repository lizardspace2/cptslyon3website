import { motion } from "framer-motion";
import {
    Users,
    Heart,
    ShieldCheck,
    Search,
    Activity,
    UserPlus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const missions = [
    {
        title: "Accès aux soins",
        description: "Améliorer l'accès aux soins et la prise en charge des patients sur le territoire.",
        icon: UserPlus,
        color: "bg-blue-50 text-blue-600",
    },
    {
        title: "Parcours de soins",
        description: "Organiser des parcours de soins coordonnés autour du patient.",
        icon: Activity,
        color: "bg-green-50 text-green-600",
    },
    {
        title: "Prévention",
        description: "Développer des actions de prévention et de promotion de la santé.",
        icon: Heart,
        color: "bg-red-50 text-red-600",
    },
    {
        title: "Crise sanitaire",
        description: "Se préparer et répondre aux situations sanitaires exceptionnelles.",
        icon: ShieldCheck,
        color: "bg-orange-50 text-orange-600",
    },
];

const MissionsSection = () => {
    return (
        <section className="py-24 bg-background">
            <div className="container">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-display font-bold mb-6"
                    >
                        Nos Missions Socles
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground text-lg"
                    >
                        La CPTS Lyon 3 s'engage autour de missions prioritaires définies dans l'Accord Conventionnel Interprofessionnel (ACI).
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {missions.map((mission, i) => (
                        <motion.div
                            key={mission.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="h-full hover:shadow-lg transition-shadow border-none bg-muted/30">
                                <CardHeader>
                                    <div className={`w-12 h-12 rounded-xl ${mission.color} flex items-center justify-center mb-4`}>
                                        <mission.icon className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="text-xl font-display">{mission.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {mission.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MissionsSection;
