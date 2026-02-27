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
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-display font-bold text-gradient">CPTS</span>
            <span className="text-xs font-semibold tracking-wider text-muted-foreground">LYON 3</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground ${location.pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Button variant="nav-outline" size="sm" asChild>
            <Link to="/annuaire">
              <Search className="w-4 h-4" />
              Recherche médecin
            </Link>
          </Button>
          <Button variant="nav" size="sm" asChild>
            <Link to="/espace-adherent">
              <UserPlus className="w-4 h-4" />
              Adhérer
            </Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-accent"
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
              className="fixed inset-0 top-[65px] z-40 bg-background/80 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-[65px] bottom-0 z-50 w-[280px] bg-card border-l shadow-2xl lg:hidden"
            >
              <nav className="p-6 flex flex-col gap-2">
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
                      className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors ${location.pathname === item.href
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted"
                        }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="mt-8 pt-6 border-t flex flex-col gap-3">
                  <Button variant="outline" className="justify-start gap-2 rounded-xl" asChild>
                    <Link to="/annuaire" onClick={() => setMobileOpen(false)}>
                      <Search className="w-4 h-4 text-primary" />
                      Recherche Pro
                    </Link>
                  </Button>
                  <Button className="justify-start gap-2 rounded-xl" asChild>
                    <Link to="/espace-adherent" onClick={() => setMobileOpen(false)}>
                      <UserPlus className="w-4 h-4" />
                      Devenir Adhérent
                    </Link>
                  </Button>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
