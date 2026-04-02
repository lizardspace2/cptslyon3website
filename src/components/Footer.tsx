import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-navy text-white relative overflow-hidden">
      {/* Subtle decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="container pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          <div className="space-y-6">
            <div className="flex flex-col leading-none">
              <span className="text-3xl font-display font-bold text-white tracking-tight">CPTS</span>
              <span className="text-[10px] font-bold tracking-[0.3em] text-sky-400 uppercase mt-1">Lyon 3e Arrondissement</span>
            </div>
            <p className="text-white/60 text-lg font-medium leading-relaxed max-w-xs">
              Communauté Professionnelle Territoriale de Santé du 3ème arrondissement de Lyon.
            </p>
          </div>

          <div>
            <h4 className="text-sky-400 font-bold text-xs uppercase tracking-[0.2em] mb-8">Navigation</h4>
            <ul className="space-y-4">
              {[
                { label: "Présentation", href: "/presentation" },
                { label: "Annuaire", href: "/annuaire" },
                { label: "Actualités", href: "/actualites" },
                { label: "Ressources", href: "/ressources" },
                { label: "Remplacement", href: "/remplacement" },
              ].map((item) => (
                <li key={item.href}>
                  <Link to={item.href} className="text-white/60 hover:text-sky-400 font-bold transition-all flex items-center group">
                    <span className="w-0 group-hover:w-4 h-[2px] bg-sky-400 transition-all mr-0 group-hover:mr-2"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sky-400 font-bold text-xs uppercase tracking-[0.2em] mb-8">Contact</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-sky-400" />
                </div>
                <a href="mailto:cptslyon3@gmail.com" className="text-white/60 hover:text-white font-bold transition-colors mt-1">
                  cptslyon3@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-sky-400" />
                </div>
                <span className="text-white/60 font-bold mt-1">24 rue Barrier, 69006 Lyon</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-sky-400" />
                </div>
                <a href="tel:0745281626" className="text-white/60 hover:text-white font-bold transition-colors mt-1">
                  07 45 28 16 26
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sky-400 font-bold text-xs uppercase tracking-[0.2em] mb-8">Suivez-nous</h4>
            <div className="flex gap-4">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Twitter, label: "X" },
                { icon: Instagram, label: "Instagram" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-sky-400 hover:border-sky-400 hover:text-navy transition-all duration-300"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <div className="mt-10 p-6 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-xs font-bold text-white/40 leading-relaxed uppercase tracking-widest">
                Rejoignez notre réseau de professionnels de santé dès aujourd'hui.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-white/30 text-xs font-bold uppercase tracking-widest">
          <span>© {new Date().getFullYear()} CPTS Lyon 3. Tous droits réservés.</span>
          <div className="flex gap-8">
            <Link to="#" className="hover:text-white transition-colors">Mentions légales</Link>
            <Link to="#" className="hover:text-white transition-colors">Politique de confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
