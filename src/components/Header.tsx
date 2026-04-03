import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, UserPlus, Users, UserSearch, Newspaper, FileText, Zap, ShieldCheck, MessageCircle, ArrowRight, Calendar, Settings } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { label: "Présentation", href: "/presentation", icon: Users },
  { label: "Annuaire", href: "/annuaire", icon: UserSearch },
  { label: "Blog/Actualités", href: "/actualites", icon: Newspaper },
  { label: "Ressources", href: "/ressources", icon: FileText },
  { label: "Remplacement", href: "/remplacement", icon: Zap },
  { label: "Espace adhérent", href: "/espace-adherent", icon: ShieldCheck },
  { label: "Agenda", href: "/agenda", icon: Calendar },
  { label: "Contact", href: "/contact", icon: MessageCircle },
  { label: "Admin", href: "/admin", icon: Settings },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
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

        {/* Mobile Nav with Sheet */}
        <div className="lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="p-3 rounded-full bg-navy/5 text-navy hover:bg-navy/10 transition-colors">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] sm:max-w-md p-0 bg-white border-l-0 shadow-2xl">
              <div className="flex flex-col h-full bg-white">
                <SheetHeader className="p-6 border-b border-navy/5 bg-white shrink-0">
                  <SheetTitle className="text-left flex flex-col leading-none">
                    <span className="text-2xl font-display font-bold text-navy uppercase tracking-tight">CPTS</span>
                    <span className="text-xs font-black tracking-[0.4em] text-sky-600 uppercase">Lyon 3</span>
                  </SheetTitle>
                </SheetHeader>
                
                <nav className="flex-1 p-4 flex flex-col gap-1.5 bg-white overflow-hidden">
                  <p className="px-5 py-1 font-black text-[10px] uppercase tracking-[0.5em] text-navy/30 mb-1">Navigation</p>
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-4 py-2.5 px-5 rounded-[1.5rem] transition-all duration-300 border ${location.pathname === item.href
                          ? "bg-navy text-white shadow-xl shadow-navy/20 border-navy"
                          : "bg-white text-navy/70 hover:bg-sky-50 border-navy/5"
                        }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${location.pathname === item.href ? "bg-white/10 text-white" : "bg-sky-50 text-sky-600"}`}>
                        <item.icon className="w-5 h-5" strokeWidth={1.5} />
                      </div>
                      <span className="font-display font-bold tracking-tight">{item.label}</span>
                      <ArrowRight className={`ml-auto w-4 h-4 transition-transform duration-300 ${location.pathname === item.href ? "opacity-30" : "opacity-0"}`} />
                    </Link>
                  ))}
                </nav>
                
                <div className="p-6 border-t border-navy/5 bg-white flex flex-col gap-3 shadow-[0_-15px_50px_rgba(0,0,0,0.03)] shrink-0">
                  <Button className="w-full h-14 rounded-2xl bg-navy hover:bg-sky-600 text-white font-black text-md shadow-xl shadow-navy/10 transition-all flex items-center justify-center gap-3" asChild>
                    <Link to="/espace-adherent" onClick={() => setIsOpen(false)}>
                      <UserPlus className="w-5 h-5" />
                      Adhérer à la CPTS
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full h-14 rounded-2xl border-navy/10 text-navy font-bold text-md hover:bg-sky-50 transition-all flex items-center justify-center gap-3 bg-white" asChild>
                    <Link to="/annuaire" onClick={() => setIsOpen(false)}>
                      <Search className="w-5 h-5 text-sky-600" />
                      Annuaire Santé
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
