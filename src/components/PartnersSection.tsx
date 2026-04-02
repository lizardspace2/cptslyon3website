import { motion } from "framer-motion";

const partners = [
    { name: "ARS Auvergne-Rhône-Alpes" },
    { name: "Assurance Maladie" },
    { name: "Hospices Civils de Lyon (HCL)" },
    { name: "Conseil de l'Ordre" },
    { name: "URPS MK ARA" },
    { name: "Ville de Lyon" },
];

const PartnersSection = () => {
    return (
        <section className="py-20 bg-white border-y border-navy/5">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center"
                >
                    <h3 className="text-center text-xs font-bold text-navy/30 uppercase tracking-[0.3em] mb-12">
                        En collaboration avec nos partenaires institutionnels
                    </h3>
                    <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
                        {partners.map((partner, i) => (
                            <motion.div
                                key={partner.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="px-6 py-3 rounded-full border border-navy/5 bg-navy/[0.02] text-navy/50 text-sm font-bold hover:bg-navy/5 hover:text-navy/80 hover:border-navy/10 transition-all cursor-default whitespace-nowrap"
                            >
                                {partner.name}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default PartnersSection;
