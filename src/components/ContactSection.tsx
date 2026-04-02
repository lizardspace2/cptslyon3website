import { Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const ContactSection = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#FCE280] rounded-[2rem] p-8 md:p-16 lg:p-20 overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left side text content */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-navy mb-6 leading-tight">
                Prendre contact avec la<br className="hidden md:block" />
                CPTS Lyon 3
              </h2>
              <div className="space-y-6 text-navy/80 text-lg">
                <p>
                  Vous souhaitez rejoindre la CPTS Lyon 3 ou tout simplement en savoir plus sur ses actions ?
                </p>
                <p>
                  Prenez contact directement avec leur équipe.
                </p>
              </div>
            </div>

            {/* Right side contact card */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <motion.div 
                whileHover={{ rotate: 0, scale: 1.02 }}
                className="bg-white rounded-3xl p-8 md:p-10 shadow-xl w-full max-w-md transform lg:rotate-3 transition-all duration-300"
              >
                <div className="space-y-6 text-sm md:text-base font-medium text-navy/90">
                  <div className="flex items-center gap-4">
                    <MapPin className="w-5 h-5 text-sky-600 shrink-0" strokeWidth={2} />
                    <span>24 rue Barrier, 69006 Lyon</span>
                  </div>
                  <a href="mailto:cptslyon3@gmail.com" className="flex items-center gap-4 hover:text-sky-600 transition-colors">
                    <Mail className="w-5 h-5 text-sky-600 shrink-0" strokeWidth={2} />
                    <span>cptslyon3@gmail.com</span>
                  </a>
                  <a href="tel:0745281626" className="flex items-center gap-4 hover:text-sky-600 transition-colors">
                    <Phone className="w-5 h-5 text-sky-600 shrink-0" strokeWidth={2} />
                    <span>07 45 28 16 26</span>
                  </a>
                </div>

                <a 
                  href="mailto:cptslyon3@gmail.com"
                  className="mt-10 inline-flex items-center justify-center gap-2 bg-[#FFB938] hover:bg-[#F2A922] text-navy font-semibold px-8 py-4 rounded-full transition-colors w-full sm:w-auto"
                >
                  <ArrowUpRight className="w-5 h-5" />
                  Contacter
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
