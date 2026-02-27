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
        <section className="py-24 bg-muted/30">
            <div className="container max-w-4xl">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-display font-bold mb-4"
                    >
                        Questions fréquentes
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground"
                    >
                        Tout ce que vous devez savoir sur la CPTS Lyon 3.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <Accordion type="single" collapsible className="w-full bg-background rounded-2xl p-6 md:p-8 shadow-sm">
                        {faqs.map((faq, i) => (
                            <AccordionItem key={i} value={`item-${i}`} className="border-b last:border-0 border-muted">
                                <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline py-5">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-5">
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
