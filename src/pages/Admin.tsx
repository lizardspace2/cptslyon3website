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
  Calendar
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  name: string;
  specialty: string;
  phone: string;
  address: string;
}

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
                    <SectionHeader title="Gestion de l'Annuaire" description="Gérez la liste des membres professionnels." onAdd={() => {}} />
                    <div className="grid gap-6">
                      {loadingPros ? <Loader /> : pros?.map(item => (
                        <AdminListItem 
                          key={item.id} 
                          title={item.name} 
                          subtitle={item.specialty} 
                          onDelete={() => deleteMutation.mutate({ table: 'professionals', id: item.id })}
                        />
                      ))}
                    </div>
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
