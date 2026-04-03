import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Newspaper, 
  Users, 
  FileText, 
  Mail, 
  Settings, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  Loader2, 
  CheckCircle2, 
  ExternalLink, 
  Calendar, 
  Search, 
  MapPin, 
  Phone, 
  PhoneForwarded 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// --- Types ---
interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  image_url: string;
  published_at: string;
}

interface Professional {
  id: string;
  title?: string;
  first_name?: string;
  last_name?: string;
  specialty: string;
  public_phone?: string;
  private_phone?: string;
  email?: string;
  address: string;
}

const titles = ["Dr.", "Pr.", "Mme.", "M.", "Mlle.", "Me."];

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  url: string;
}

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

const Admin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAddProOpen, setIsAddProOpen] = useState(false);
  const [newPro, setNewPro] = useState({ 
    title: "Dr.", 
    first_name: "", 
    last_name: "", 
    specialty: "", 
    public_phone: "", 
    private_phone: "", 
    email: "", 
    address: "" 
  });
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);

  const handleAddressSearch = async (query: string) => {
    setNewPro({ ...newPro, address: query });
    if (query.length < 3) {
      setAddressSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`);
      const data = await response.json();
      setAddressSuggestions(data.features || []);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    }
  };

  // --- Queries ---
  const { data: news, isLoading: loadingNews } = useQuery({
    queryKey: ["admin_news"],
    queryFn: async () => {
      const { data, error } = await supabase.from("news").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Article[];
    }
  });

  const { data: pros, isLoading: loadingPros } = useQuery({
    queryKey: ["admin_pros"],
    queryFn: async () => {
      const { data, error } = await supabase.from("professionals").select("*").order("name");
      if (error) throw error;
      return data as Professional[];
    }
  });

  const { data: resources, isLoading: loadingResources } = useQuery({
    queryKey: ["admin_resources"],
    queryFn: async () => {
      const { data, error } = await supabase.from("resources").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Resource[];
    }
  });

  const { data: messages, isLoading: loadingMessages } = useQuery({
    queryKey: ["admin_messages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contacts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Message[];
    }
  });

  const { data: settings } = useQuery({
    queryKey: ["admin_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error) throw error;
      return data;
    }
  });

  const [calendarUrlInput, setCalendarUrlInput] = useState("");

  useEffect(() => {
    const calendarSetting = settings?.find((s: any) => s.key === "google_calendar_url");
    if (calendarSetting) setCalendarUrlInput(calendarSetting.value);
  }, [settings]);

  // --- Mutations ---
  const insertProMutation = useMutation({
    mutationFn: async (pro: Omit<Professional, 'id'>) => {
      const { error } = await supabase.from("professionals").insert([pro]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_pros"] });
      toast({ title: "Ajouté", description: "Le professionnel a été ajouté avec succès." });
      setIsAddProOpen(false);
      setNewPro({ 
        title: "Dr.", 
        first_name: "", 
        last_name: "", 
        specialty: "", 
        public_phone: "", 
        private_phone: "", 
        email: "", 
        address: "" 
      });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    }
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string, value: string }) => {
      const { error } = await supabase.from("site_settings").update({ value }).eq("key", key);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_settings"] });
      toast({ title: "Enregistré", description: "Les paramètres ont été mis à jour." });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ table, id }: { table: string, id: string }) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`admin_${variables.table === 'contacts' ? 'messages' : (variables.table === 'news' ? 'news' : (variables.table === 'professionals' ? 'pros' : 'resources'))}`] });
      toast({ title: "Supprimé", description: "L'élément a été supprimé avec succès." });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <PageBanner 
          title="Administration" 
          subtitle="Gérez le contenu de votre plateforme en toute simplicité."
        />

        <section className="py-24 relative overflow-hidden">
          <div className="container max-w-7xl relative z-10">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col lg:flex-row gap-12">
                {/* Sidebar Navigation */}
                <aside className="lg:w-80 shrink-0">
                  <div className="sticky top-32 space-y-4">
                    <TabsList className="flex flex-col h-auto bg-white/40 backdrop-blur-3xl p-4 rounded-[3rem] border border-white/50 shadow-3xl shadow-navy/[0.02] gap-4 w-full">
                      {[
                        { value: "dashboard", label: "Dashboard", icon: LayoutDashboard },
                        { value: "news", label: "Actualités", icon: Newspaper },
                        { value: "pros", label: "Annuaire", icon: Users },
                        { value: "resources", label: "Ressources", icon: FileText },
                        { value: "messages", label: "Messages", icon: Mail },
                        { value: "settings", label: "Paramètres", icon: Settings },
                      ].map((tab) => (
                        <TabsTrigger 
                          key={tab.value}
                          value={tab.value} 
                          className="w-full flex items-center justify-start gap-4 px-8 py-5 rounded-[2rem] text-navy/40 data-[state=active]:bg-navy data-[state=active]:text-white data-[state=active]:shadow-2xl transition-all font-black text-xs uppercase tracking-widest"
                        >
                          <tab.icon className="w-5 h-5" />
                          {tab.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                </aside>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                  {/* Dashboard */}
                  <TabsContent value="dashboard" className="mt-0 outline-none">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
                      <StatCard count={news?.length || 0} label="Actualités" icon={Newspaper} color="sky" />
                      <StatCard count={pros?.length || 0} label="Professionnels" icon={Users} color="emerald" />
                      <StatCard count={messages?.length || 0} label="Messages Reçus" icon={Mail} color="navy" />
                    </div>
                    
                    <Card className="rounded-[3rem] border border-navy/5 shadow-3xl bg-white/40 backdrop-blur-3xl overflow-hidden p-1">
                      <CardHeader className="p-12 pb-0">
                        <CardTitle className="text-3xl font-display font-bold text-navy tracking-tight">Bienvenue sur votre espace admin</CardTitle>
                        <CardDescription className="text-lg italic text-navy/40 mt-4 leading-relaxed">
                          Utilisez le menu latéral pour naviguer entre les différentes sections de gestion. 
                          Toutes les modifications effectuées ici sont répercutées en temps réel sur le site public.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-12 pt-16">
                         <div className="grid gap-8">
                            <div className="flex items-center gap-6 p-8 rounded-[2rem] bg-emerald-50/50 border border-emerald-500/10 text-emerald-700">
                               <CheckCircle2 className="w-10 h-10 shrink-0" />
                               <div>
                                  <p className="font-display font-bold text-xl">Base de données opérationnelle</p>
                                  <p className="font-medium italic opacity-70">Le client Supabase est correctement configuré.</p>
                               </div>
                            </div>
                         </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* News Management */}
                  <TabsContent value="news" className="mt-0 outline-none">
                    <SectionHeader title="Gestion des Actualités" description="Publiez et gérez les articles du blog." onAdd={() => toast({ title: "Note", description: "Interface de création en cours de développement." })} />
                    <div className="grid gap-6">
                      {loadingNews ? <Loader /> : news?.map(item => (
                        <AdminListItem 
                          key={item.id} 
                          title={item.title} 
                          subtitle={item.category} 
                          onDelete={() => deleteMutation.mutate({ table: 'news', id: item.id })}
                        />
                      ))}
                    </div>
                  </TabsContent>

                   {/* Pros Management */}
                   <TabsContent value="pros" className="mt-0 outline-none">
                    <SectionHeader 
                      title="Gestion de l'Annuaire" 
                      description="Gérez la liste des membres professionnels." 
                      onAdd={() => setIsAddProOpen(true)} 
                    />
                    <div className="grid gap-6">
                      {loadingPros ? <Loader /> : pros?.map(item => (
                        <AdminListItem 
                          key={item.id} 
                          title={`${item.title || ''} ${item.first_name || ''} ${item.last_name || item.name || ''}`} 
                          subtitle={item.specialty} 
                          onDelete={() => deleteMutation.mutate({ table: 'professionals', id: item.id })}
                        />
                      ))}
                    </div>

                    <Dialog open={isAddProOpen} onOpenChange={setIsAddProOpen}>
                      <DialogContent className="rounded-[3rem] border-navy/5 bg-white p-12 max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-4xl font-display font-bold text-navy tracking-tight">Ajouter un professionnel</DialogTitle>
                          <DialogDescription className="text-xl italic text-navy/40 mt-4 leading-relaxed">
                            Remplissez les informations détaillées pour enrichir l'annuaire de la CPTS.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-10 py-12">
                          {/* Identité */}
                          <div className="grid gap-6">
                            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-sky-600 mb-2">Identité & Spécialité</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="grid gap-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-navy/30 px-2">Titre</Label>
                                <Select 
                                  value={newPro.title} 
                                  onValueChange={(val) => setNewPro({...newPro, title: val})}
                                >
                                  <SelectTrigger className="h-16 rounded-2xl border-navy/5 bg-sky-50/30 font-bold text-navy focus:ring-sky-500/20">
                                    <SelectValue placeholder="Titre" />
                                  </SelectTrigger>
                                  <SelectContent className="rounded-2xl border-navy/5 shadow-2xl">
                                    {titles.map(t => <SelectItem key={t} value={t} className="font-bold py-3">{t}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-navy/30 px-2">Prénom</Label>
                                <Input 
                                  value={newPro.first_name} 
                                  onChange={(e) => setNewPro({...newPro, first_name: e.target.value})}
                                  placeholder="ex: Jean"
                                  className="h-16 rounded-2xl border-navy/5 bg-sky-50/30 font-bold text-navy focus-visible:ring-sky-500/20" 
                                />
                              </div>
                              <div className="grid gap-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-navy/30 px-2">Nom de famille</Label>
                                <Input 
                                  value={newPro.last_name} 
                                  onChange={(e) => setNewPro({...newPro, last_name: e.target.value})}
                                  placeholder="ex: DUPONT"
                                  className="h-16 rounded-2xl border-navy/5 bg-sky-50/30 font-bold text-navy focus-visible:ring-sky-500/20" 
                                />
                              </div>
                            </div>
                            <div className="grid gap-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-navy/30 px-2">Spécialité / Profession</Label>
                                <Input 
                                  value={newPro.specialty} 
                                  onChange={(e) => setNewPro({...newPro, specialty: e.target.value})}
                                  placeholder="ex: Médecin Généraliste, Infirmier, etc."
                                  className="h-16 rounded-2xl border-navy/5 bg-sky-50/30 font-bold text-navy focus-visible:ring-sky-500/20" 
                                />
                            </div>
                          </div>

                          {/* Coordonnées */}
                          <div className="grid gap-6">
                            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-sky-600 mb-2">Coordonnées</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="grid gap-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-navy/30 px-2 flex items-center gap-2">
                                  <Phone className="w-3 h-3" /> Téléphone Public
                                </Label>
                                <Input 
                                  value={newPro.public_phone} 
                                  onChange={(e) => setNewPro({...newPro, public_phone: e.target.value})}
                                  placeholder="Visible sur le site"
                                  className="h-16 rounded-2xl border-navy/5 bg-sky-50/30 font-bold text-navy focus-visible:ring-sky-500/20" 
                                />
                              </div>
                              <div className="grid gap-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-navy/30 px-2 flex items-center gap-2">
                                  <PhoneForwarded className="w-3 h-3" /> Téléphone Privé
                                </Label>
                                <Input 
                                  value={newPro.private_phone} 
                                  onChange={(e) => setNewPro({...newPro, private_phone: e.target.value})}
                                  placeholder="Réservé aux membres"
                                  className="h-16 rounded-2xl border-navy/5 bg-sky-50/30 font-bold text-navy focus-visible:ring-sky-500/20" 
                                />
                              </div>
                            </div>
                            <div className="grid gap-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-navy/30 px-2 flex items-center gap-2">
                                  <Mail className="w-3 h-3" /> Email Professionnel
                                </Label>
                                <Input 
                                  value={newPro.email} 
                                  onChange={(e) => setNewPro({...newPro, email: e.target.value})}
                                  placeholder="contact@exemple.fr"
                                  className="h-16 rounded-2xl border-navy/5 bg-sky-50/30 font-bold text-navy focus-visible:ring-sky-500/20" 
                                />
                            </div>
                          </div>

                          {/* Localisation */}
                          <div className="grid gap-6 relative">
                            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-sky-600 mb-2">Localisation</h4>
                            <div className="grid gap-3 relative">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-navy/30 px-2 flex items-center gap-2">
                                <MapPin className="w-3 h-3" /> Adresse du cabinet (Autocomplétion)
                              </Label>
                              <div className="relative">
                                <Input 
                                  value={newPro.address} 
                                  onChange={(e) => handleAddressSearch(e.target.value)}
                                  placeholder="Saisissez l'adresse..."
                                  className="h-16 rounded-2xl border-navy/5 bg-sky-50/30 font-bold text-navy focus-visible:ring-sky-500/20 pr-12" 
                                />
                                <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/20" />
                              </div>

                              {addressSuggestions.length > 0 && (
                                <Card className="absolute top-full left-0 right-0 z-50 mt-2 rounded-2xl border-navy/5 shadow-2xl bg-white/95 backdrop-blur-xl overflow-hidden p-2">
                                  {addressSuggestions.map((s, idx) => (
                                    <button
                                      key={idx}
                                      onClick={() => {
                                        setNewPro({ ...newPro, address: s.properties.label });
                                        setAddressSuggestions([]);
                                      }}
                                      className="w-full text-left p-4 hover:bg-sky-50 rounded-xl transition-all flex items-start gap-4 group"
                                    >
                                      <MapPin className="w-5 h-5 text-sky-600 mt-0.5 shrink-0" />
                                      <div>
                                        <p className="font-bold text-navy leading-tight">{s.properties.label}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-navy/20 mt-1">{s.properties.context}</p>
                                      </div>
                                    </button>
                                  ))}
                                </Card>
                              )}
                            </div>
                          </div>
                        </div>

                        <DialogFooter className="gap-6 pt-8 border-t border-navy/5">
                          <Button 
                            variant="ghost" 
                            onClick={() => setIsAddProOpen(false)}
                            className="h-20 rounded-[2rem] px-10 text-navy/40 font-bold hover:bg-navy/5 text-lg"
                          >
                            Annuler
                          </Button>
                          <Button 
                            onClick={() => insertProMutation.mutate(newPro)}
                            disabled={insertProMutation.isPending}
                            className="h-20 rounded-[2rem] px-16 bg-navy hover:bg-sky-600 text-white font-display font-bold text-xl shadow-3xl shadow-navy/20 transition-all flex items-center gap-6 active:scale-95"
                          >
                            {insertProMutation.isPending ? <Loader2 className="w-7 h-7 animate-spin" /> : <Save className="w-7 h-7" />}
                            Enregistrer le professionnel
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TabsContent>

                  {/* Resources Management */}
                  <TabsContent value="resources" className="mt-0 outline-none">
                    <SectionHeader title="Gestion des Ressources" description="Gérez les documents et liens de téléchargement." onAdd={() => {}} />
                    <div className="grid gap-6">
                      {loadingResources ? <Loader /> : resources?.map(item => (
                        <AdminListItem 
                          key={item.id} 
                          title={item.title} 
                          subtitle={item.type.toUpperCase()} 
                          onDelete={() => deleteMutation.mutate({ table: 'resources', id: item.id })}
                        />
                      ))}
                    </div>
                  </TabsContent>

                  {/* Messages Management */}
                  <TabsContent value="messages" className="mt-0 outline-none">
                    <div className="mb-12">
                      <h2 className="text-4xl font-display font-bold text-navy tracking-tight mb-4">Messages Reçus</h2>
                      <p className="text-navy/40 font-medium italic text-lg leading-relaxed">Consultez les demandes de contact envoyées via le site.</p>
                    </div>
                    <div className="grid gap-6">
                      {loadingMessages ? <Loader /> : messages?.map(item => (
                        <Card key={item.id} className="rounded-[2.5rem] border border-navy/5 shadow-2xl bg-white overflow-hidden p-8 hover:border-sky-600/30 transition-all duration-500">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex-1">
                               <div className="flex items-center gap-4 mb-4">
                                  <h3 className="text-xl font-display font-bold text-navy tracking-tight">{item.name}</h3>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-navy/20">{new Date(item.created_at).toLocaleDateString()}</span>
                               </div>
                               <p className="text-sky-600/60 font-bold mb-4">{item.email}</p>
                               <p className="text-navy/60 italic leading-relaxed">"{item.message}"</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-2xl h-14 w-14 shrink-0 transition-all"
                              onClick={() => deleteMutation.mutate({ table: 'contacts', id: item.id })}
                            >
                               <Trash2 className="w-6 h-6" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Settings Management */}
                  <TabsContent value="settings" className="mt-0 outline-none">
                    <div className="mb-12">
                      <h2 className="text-4xl font-display font-bold text-navy tracking-tight mb-4">Paramètres Globaux</h2>
                      <p className="text-navy/40 font-medium italic text-lg leading-relaxed">Configurez les éléments structurels de votre site.</p>
                    </div>
                    <div className="grid gap-8">
                       <Card className="rounded-[3rem] border border-navy/5 shadow-3xl bg-white p-10">
                          <div className="flex flex-col gap-8">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                                   <Calendar className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-display font-bold text-navy tracking-tight">URL Google Agenda</h3>
                             </div>
                             <div className="flex gap-4">
                                <Input 
                                   value={calendarUrlInput} 
                                   onChange={(e) => setCalendarUrlInput(e.target.value)}
                                   placeholder="URL d'intégration Google Calendar..."
                                   className="h-16 rounded-2xl border-navy/10 bg-sky-50/20 font-bold text-navy focus-visible:ring-sky-500/20"
                                />
                                <Button 
                                  onClick={() => updateSettingMutation.mutate({ key: "google_calendar_url", value: calendarUrlInput })}
                                  disabled={updateSettingMutation.isPending}
                                  className="h-16 rounded-2xl px-8 bg-navy hover:bg-sky-600 text-white font-bold transition-all shadow-xl disabled:opacity-50"
                                >
                                   {updateSettingMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                                   Enregistrer
                                </Button>
                             </div>
                          </div>
                       </Card>
                    </div>
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

// --- Sub-components ---

const StatCard = ({ count, label, icon: Icon, color }: any) => (
  <Card className="rounded-[3rem] border border-navy/5 shadow-3xl bg-white p-10 group overflow-hidden relative">
    <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000`} />
    <div className="flex items-center gap-8 relative z-10">
      <div className={`w-16 h-16 rounded-[1.5rem] bg-${color}-50 text-${color}-600 flex items-center justify-center shrink-0 shadow-lg group-hover:rotate-6 group-hover:scale-110 transition-all`}>
        <Icon className="w-7 h-7" strokeWidth={2.5} />
      </div>
      <div>
        <p className="text-4xl font-display font-black text-navy leading-none mb-2">{count}</p>
        <p className="text-[10px] uppercase font-black tracking-[0.2em] text-navy/20">{label}</p>
      </div>
    </div>
  </Card>
);

const SectionHeader = ({ title, description, onAdd }: any) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-12">
    <div>
      <h2 className="text-4xl font-display font-bold text-navy tracking-tight mb-4">{title}</h2>
      <p className="text-navy/40 font-medium italic text-lg leading-relaxed">{description}</p>
    </div>
    <Button 
      onClick={onAdd}
      className="h-20 rounded-[2rem] bg-sky-600 hover:bg-navy text-white px-10 font-display font-bold text-lg transition-all shadow-3xl shadow-sky-600/30 flex items-center gap-4 active:scale-95"
    >
      <Plus className="w-6 h-6" strokeWidth={3} />
      Ajouter
    </Button>
  </div>
);

const AdminListItem = ({ title, subtitle, onDelete }: any) => (
  <Card className="rounded-[2.5rem] border border-navy/5 shadow-2xl bg-white overflow-hidden p-8 hover:border-sky-600/30 transition-all duration-500 group/item">
    <div className="flex items-center justify-between gap-6">
      <div className="flex-1 min-w-0">
        <h3 className="text-xl font-display font-bold text-navy tracking-tight truncate group-hover/item:text-sky-600 transition-colors uppercase">{title}</h3>
        <p className="text-navy/20 font-black text-[10px] uppercase tracking-widest mt-2">{subtitle}</p>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-navy/40 hover:text-sky-600 hover:bg-sky-50 rounded-2xl h-14 w-14 transition-all">
          <Edit className="w-5 h-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-2xl h-14 w-14 transition-all"
          onClick={onDelete}
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
    </div>
  </Card>
);

const Loader = () => (
  <div className="flex items-center justify-center py-20">
    <Loader2 className="w-12 h-12 text-sky-600 animate-spin" />
  </div>
);

export default Admin;
