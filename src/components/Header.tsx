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
            <span className="text-xs font-semibold tracking-wider text-muted-foreground">LYON 5</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground ${
                location.pathname === item.href
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
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-card border-b"
          >
            <nav className="container py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors hover:bg-accent ${
                    location.pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex gap-2 mt-3 px-4">
                <Button variant="nav-outline" size="sm" className="flex-1" asChild>
                  <Link to="/annuaire" onClick={() => setMobileOpen(false)}>
                    <Search className="w-4 h-4" />
                    Recherche médecin
                  </Link>
                </Button>
                <Button variant="nav" size="sm" className="flex-1" asChild>
                  <Link to="/espace-adherent" onClick={() => setMobileOpen(false)}>
                    Adhérer
                  </Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
