import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Facebook, Twitter, Instagram, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

const Footer = () => {
  const { data: settings } = useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error) throw error;
      return data;
    }
  });

  const contactPhone = settings?.find((s: any) => s.key === "contact_phone")?.value || "07 45 28 16 26";
  const contactEmail = "cptslyon3@gmail.com"; 
  return (
    <footer className="bg-[#0F1C2E] text-white relative overflow-hidden border-t border-white/5">
      {/* Sophisticated decorative backgrounds */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(2,132,199,0.08),transparent)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[120px] translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="container pt-24 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24">
          <div className="space-y-8">
            <div className="flex flex-col leading-none">
              <span className="text-4xl font-display font-bold text-white tracking-tighter">CPTS</span>
              <span className="text-[10px] font-black tracking-[0.4em] text-sky-400 uppercase mt-2 opacity-80">Lyon 3e Arrondissement</span>
            </div>
            <p className="text-white/50 text-lg font-medium leading-relaxed italic">
              "Agir ensemble pour la santé des Lyonnais du 3ème arrondissement."
            </p>
            <div className="flex gap-4">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Twitter, label: "X" },
                { icon: Instagram, label: "Instagram" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-sky-500 hover:border-sky-500 hover:text-white transition-all duration-500 group"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-sky-500" />
              Navigation
            </h4>
            <ul className="space-y-5">
              {[
                { label: "Présentation", href: "/presentation" },
                { label: "Annuaire", href: "/annuaire" },
                { label: "Actualités", href: "/actualites" },
                { label: "Ressources", href: "/ressources" },
                { label: "Remplacement", href: "/remplacement" },
              ].map((item) => (
                <li key={item.href}>
                  <Link to={item.href} className="text-white/40 hover:text-sky-400 font-bold transition-all flex items-center group text-base">
                    <ArrowRight className="w-0 group-hover:w-4 h-4 transition-all opacity-0 group-hover:opacity-100 mr-0 group-hover:mr-3 text-sky-500" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
               <span className="w-8 h-[1px] bg-sky-500" />
               Contact
            </h4>
            <ul className="space-y-8">
              <li className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-sky-500/10 group-hover:border-sky-500/20 transition-all duration-500">
                  <Mail className="w-5 h-5 text-sky-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Email</span>
                  <a href={`mailto:${contactEmail}`} className="text-white/60 hover:text-white font-bold transition-colors">
                    {contactEmail}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-sky-500/10 group-hover:border-sky-500/20 transition-all duration-500">
                  <Phone className="w-5 h-5 text-sky-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Téléphone</span>
                  <a href={`tel:${contactPhone.replace(/\s/g, '')}`} className="text-white/60 hover:text-white font-bold transition-colors">
                    {contactPhone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-sky-500/10 group-hover:border-sky-500/20 transition-all duration-500">
                  <MapPin className="w-5 h-5 text-sky-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Siège</span>
                  <span className="text-white/60 font-bold">24 rue Barrier, 69006 Lyon</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
               <span className="w-8 h-[1px] bg-sky-500" />
               Newsletter
            </h4>
            <p className="text-white/40 text-sm font-bold leading-relaxed">
              Restez informé des dernières actualités de santé sur le 3ème arrondissement.
            </p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="votre@email.fr" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-6 text-sm font-bold focus:outline-none focus:border-sky-500/50 transition-all group-hover:bg-white/10"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl px-4 transition-all active:scale-95 shadow-xl shadow-sky-600/20">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
          <span className="text-center md:text-left">© {new Date().getFullYear()} CPTS Lyon 3. Tous droits réservés.</span>
          <div className="flex gap-10">
            <Link to="#" className="hover:text-sky-400 transition-colors">Mentions légales</Link>
            <Link to="#" className="hover:text-sky-400 transition-colors">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
