import { Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";

const ContactSection = () => {
  return (
    <section className="py-20 bg-section-alt">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Une question ? Contactez-nous !
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-8">
            <a
              href="mailto:cptslyon3@gmail.com"
              className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium">cptslyon3@gmail.com</span>
            </a>
            <div className="flex items-center gap-3 text-foreground">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium text-sm">24 rue Barrier, 69006 Lyon</span>
            </div>
            <a
              href="tel:0745281626"
              className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium">07 45 28 16 26</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
