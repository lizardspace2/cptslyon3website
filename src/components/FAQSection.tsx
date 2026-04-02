import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
    {
        question: "Qu'est-ce qu'une CPTS ?",
        answer: "Une Communauté Professionnelle Territoriale de Santé (CPTS) est une organisation regroupant les professionnels de santé d'un même territoire qui souhaitent s'organiser autour d'un projet de santé commun pour répondre aux besoins de la population.",
    },
    {
        question: "Qui peut adhérer à la CPTS Lyon 3 ?",
        answer: "Tous les professionnels de santé (libéraux ou salariés), les établissements de santé et les structures médico-sociales exerçant ou ayant une activité sur le territoire du 3ème arrondissement de Lyon.",
    },
    {
        question: "Quelles sont les communes couvertes ?",
        answer: "La CPTS Lyon 3 couvre l'intégralité du 3ème arrondissement de Lyon, incluant les quartiers de la Part-Dieu, Villette, Montchat, Sans Souci et la Guillotière Nord.",
    },
    {
        question: "Comment participer aux groupes de travail ?",
        answer: "Une fois adhérent, vous recevez régulièrement des invitations pour participer à nos groupes de travail thématiques (accès aux soins, parcours, prévention, etc.). C'est le cœur de l'action de la CPTS.",
    },
];

const FAQSection = () => {
    return (
        <section className="py-24 md:py-32 bg-[#F4F9FD]/30">
            <div className="container max-w-4xl">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 rounded-full border border-navy/10 text-navy/60 font-bold text-sm mb-6 bg-white"
                    >
                        FAQ
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-display font-bold text-navy mb-8"
                    >
                        Questions fréquentes
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-navy/60 text-lg font-medium"
                    >
                        Tout ce que vous devez savoir sur la CPTS Lyon 3 pour nous rejoindre sereinement.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <Accordion type="single" collapsible className="w-full bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-navy/[0.03] border border-navy/5">
                        {faqs.map((faq, i) => (
                            <AccordionItem key={i} value={`item-${i}`} className="border-b last:border-0 border-navy/5">
                                <AccordionTrigger className="text-left font-bold text-xl md:text-2xl text-navy hover:text-sky-600 hover:no-underline py-8 transition-colors">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-navy/60 text-lg font-medium leading-relaxed pb-8">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>
            </div>
        </section>
    );
};

export default FAQSection;
