import { motion } from "framer-motion";
import {
    Heart,
    ShieldCheck,
    Activity,
    UserPlus
} from "lucide-react";

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
        color: "bg-emerald-50 text-emerald-600",
    },
    {
        title: "Prévention",
        description: "Développer des actions de prévention et de promotion de la santé.",
        icon: Heart,
        color: "bg-rose-50 text-rose-600",
    },
    {
        title: "Crise sanitaire",
        description: "Se préparer et répondre aux situations sanitaires exceptionnelles.",
        icon: ShieldCheck,
        color: "bg-amber-50 text-amber-600",
    },
];

const MissionsSection = () => {
    return (
        <section className="py-24 md:py-32 bg-[#F4F9FD]/30">
            <div className="container">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 rounded-full border border-sky-600/20 text-sky-700 font-bold text-sm mb-6 bg-white shadow-sm"
                    >
                        Nos Engagements
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-display font-bold text-navy mb-8"
                    >
                        Nos Missions Socles
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-navy/60 text-lg md:text-xl font-medium leading-relaxed"
                    >
                        La CPTS Lyon 3 s'engage autour de missions prioritaires pour transformer durablement l'offre de soins locale.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {missions.map((mission, i) => (
                        <motion.div
                            key={mission.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="group h-full"
                        >
                            <div className="h-full bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-navy/[0.03] border border-navy/5 transition-all duration-300 group-hover:shadow-sky-600/10 group-hover:border-sky-600/20 flex flex-col items-center text-center">
                                <div className={`w-16 h-16 rounded-2xl ${mission.color} flex items-center justify-center mb-8 transform group-hover:scale-110 transition-transform duration-500`}>
                                    <mission.icon className="w-8 h-8" strokeWidth={2.5} />
                                </div>
                                <h3 className="text-xl md:text-2xl font-display font-bold text-navy mb-4 group-hover:text-sky-600 transition-colors">
                                    {mission.title}
                                </h3>
                                <p className="text-navy/60 leading-relaxed font-medium">
                                    {mission.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MissionsSection;
