import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Presentation from "./pages/Presentation";
import Actualites from "./pages/Actualites";
import Annuaire from "./pages/Annuaire";
import Contact from "./pages/Contact";
import Ressources from "./pages/Ressources";
import Remplacement from "./pages/Remplacement";
import EspaceAdherent from "./pages/EspaceAdherent";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/presentation" element={<Presentation />} />
          <Route path="/actualites" element={<Actualites />} />
          <Route path="/annuaire" element={<Annuaire />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/ressources" element={<Ressources />} />
          <Route path="/remplacement" element={<Remplacement />} />
          <Route path="/espace-adherent" element={<EspaceAdherent />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
