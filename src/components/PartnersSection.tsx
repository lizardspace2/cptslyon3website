import { motion } from "framer-motion";

const partners = [
    { name: "ARS", logo: "ARS" },
    { name: "Assurance Maladie", logo: "CPAM" },
    { name: "HCL", logo: "HCL" },
    { name: "Conseil de l'Ordre", logo: "Ordre" },
    { name: "URPS", logo: "URPS" },
    { name: "Région Web", logo: "Région" },
];

const PartnersSection = () => {
    return (
        <section className="py-16 bg-muted/20 border-y border-muted/30">
            <div className="container">
                <h3 className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-10">
                    Nos partenaires institutionnels
                </h3>
                <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {partners.map((partner, i) => (
                        <motion.div
                            key={partner.name}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="text-2xl font-display font-bold text-muted-foreground/60 select-none"
                        >
                            {partner.logo}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PartnersSection;
