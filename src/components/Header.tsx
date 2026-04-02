import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Présentation", href: "/presentation" },
  { label: "Annuaire", href: "/annuaire" },
  { label: "Actualités", href: "/actualites" },
  { label: "Ressources", href: "/ressources" },
  { label: "Remplacement", href: "/remplacement" },
  { label: "Espace adhérent", href: "/espace-adherent" },
  { label: "Contact", href: "/contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-navy/5">
      <div className="container flex items-center justify-between h-20 md:h-24">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-display font-bold text-navy group-hover:text-sky-600 transition-colors">CPTS</span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-sky-600/80 uppercase">Lyon 3</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/50 backdrop-blur-md p-1 rounded-full border border-navy/5 shadow-2xl shadow-navy/[0.02]">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`px-5 py-2.5 text-sm font-bold rounded-full transition-all duration-500 hover:text-sky-600 ${location.pathname === item.href
                  ? "bg-navy text-white shadow-xl shadow-navy/20"
                  : "text-navy/60 hover:bg-white"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-6">
          <Button variant="ghost" className="text-navy font-bold hover:bg-sky-50 hover:text-sky-600 rounded-full h-12 px-6 transition-all" asChild>
            <Link to="/annuaire">
              <Search className="w-4 h-4 mr-2" strokeWidth={2.5} />
              Recherche
            </Link>
          </Button>
          <Button className="bg-navy hover:bg-sky-600 text-white font-black rounded-full px-8 h-12 shadow-xl shadow-navy/20 transition-all hover:scale-105 active:scale-95" asChild>
            <Link to="/espace-adherent">
              <UserPlus className="w-4 h-4 mr-2" strokeWidth={2.5} />
              Adhérer
            </Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-3 rounded-full bg-navy/5 text-navy hover:bg-navy/10 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-0 z-40 bg-navy/20 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-[85%] max-w-[350px] bg-white shadow-2xl lg:hidden flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b border-navy/5">
                <div className="flex flex-col leading-none">
                  <span className="text-xl font-display font-bold text-navy">CPTS</span>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-sky-600/80 uppercase">Lyon 3</span>
                </div>
                <button 
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-full bg-navy/5 text-navy"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <nav className="p-6 flex flex-col gap-2 overflow-y-auto grow">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-5 py-4 text-lg font-semibold rounded-2xl transition-all ${location.pathname === item.href
                          ? "bg-sky-50 text-sky-600"
                          : "text-navy/70 hover:bg-navy/5 hover:text-navy"
                        }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              
              <div className="p-6 border-t border-navy/5 bg-navy/[0.02] flex flex-col gap-3">
                <Button className="w-full bg-navy hover:bg-navy/90 text-white font-bold rounded-xl h-14" asChild>
                  <Link to="/espace-adherent" onClick={() => setMobileOpen(false)}>
                    <UserPlus className="w-5 h-5 mr-3" />
                    Adhérer à la CPTS
                  </Link>
                </Button>
                <Button variant="outline" className="w-full border-navy/10 text-navy font-semibold rounded-xl h-14" asChild>
                  <Link to="/annuaire" onClick={() => setMobileOpen(false)}>
                    <Search className="w-5 h-5 mr-3 text-sky-600" />
                    Trouver un professionnel
                  </Link>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
