import { Link } from "react-router-dom";
import { Mail, MapPin, Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="mb-4">
              <span className="text-2xl font-display font-bold">CPTS Lyon 3</span>
            </div>
            <p className="text-navy-foreground/70 text-sm leading-relaxed">
              Communauté Professionnelle Territoriale de Santé du 3ème arrondissement de Lyon.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-navy-foreground/50">Navigation</h4>
            <ul className="space-y-2">
              {[
                { label: "Présentation", href: "/presentation" },
                { label: "Annuaire", href: "/annuaire" },
                { label: "Actualités", href: "/actualites" },
                { label: "Ressources", href: "/ressources" },
                { label: "Remplacement", href: "/remplacement" },
              ].map((item) => (
                <li key={item.href}>
                  <Link to={item.href} className="text-sm text-navy-foreground/70 hover:text-navy-foreground transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-navy-foreground/50">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-navy-foreground/70">
                <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                <a href="mailto:cptslyon3@gmail.com" className="hover:text-navy-foreground transition-colors">
                  cptslyon3@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-navy-foreground/70">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>6 Rue Marie-Louise et Anne-Marie Soucelier, 69005 Lyon</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-navy-foreground/50">Suivez-nous</h4>
            <div className="flex gap-3">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Twitter, label: "X" },
                { icon: Instagram, label: "Instagram" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="w-10 h-10 rounded-full bg-navy-foreground/10 flex items-center justify-center hover:bg-navy-foreground/20 transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-navy-foreground/10 text-center text-sm text-navy-foreground/50">
          © {new Date().getFullYear()} CPTS Lyon 3. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
