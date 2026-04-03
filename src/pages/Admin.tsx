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
  AlertCircle,
  Calendar, 
  Search, 
  MapPin, 
  Navigation,
  Phone, 
  PhoneForwarded,
  Upload,
  Image as ImageIcon,
  Zap,
  UserCheck,
  XCircle,
  Clock,
  ShieldCheck
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as XLSX from "xlsx";

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
  photo_url?: string;
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
  title?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  email: string;
  phone?: string;
  message: string;
  created_at: string;
}

interface Replacement {
  id: string;
  type: string;
  profession: string;
  titre?: string;
  nom?: string;
  prenom?: string;
  adresse?: string;
  lieu: string;
  periode: string;
  description: string;
  urgent: boolean;
  email: string;
  phone?: string;
  status: string;
  created_at: string;
}

interface MemberRow {
  id: string;
  email: string;
  title?: string;
  first_name?: string;
  last_name?: string;
  specialty?: string;
  public_phone?: string;
  private_phone?: string;
  address?: string;
  status: string;
  created_at: string;
}

const Admin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  // --- States ---
  const [activeTab, setActiveTab] = useState("dashboard");
  const [memberFilter, setMemberFilter] = useState<string>("all");
  
  // Professionals
  const [isAddProOpen, setIsAddProOpen] = useState(false);
  const [editingPro, setEditingPro] = useState<Professional | null>(null);
  const [newPro, setNewPro] = useState({ 
    title: "Dr.", 
    first_name: "", 
    last_name: "", 
    specialty: "", 
    public_phone: "", 
    private_phone: "", 
    email: "", 
    address: "",
    photo_url: ""
  });

  // News
  const [isAddNewsOpen, setIsAddNewsOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<Article | null>(null);
  const [newNews, setNewNews] = useState({
    title: "",
    excerpt: "",
    category: "Santé",
    image_url: "",
  });

  // Announcements
  const [isEditAnnouncementOpen, setIsEditAnnouncementOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Replacement | null>(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    profession: "",
    titre: "Dr.",
    nom: "",
    prenom: "",
    adresse: "",
    lieu: "",
    periode: "",
    description: "",
    email: "",
    phone: "",
    urgent: false,
    status: "active"
  });

  const announcementUpdateMutation = useMutation({
    mutationFn: async (variables: { id: string; data: any }) => {
      const { error } = await supabase.from("replacements").update(variables.data).eq("id", variables.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_announcements"] });
      toast({ title: "Annonce mise à jour", description: "Les modifications ont été enregistrées avec succès.", className: "bg-emerald-500 text-white rounded-3xl" });
      setIsEditAnnouncementOpen(false);
    },
    onError: (error) => {
       toast({ variant: "destructive", title: "Erreur", description: error.message });
    }
  });

  // Resources
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [newResource, setNewResource] = useState({
    title: "",
    description: "",
    type: "guide",
    url: "",
  });

  // Global Delete Security
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ table: string, id: string } | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [contactPhoneInput, setContactPhoneInput] = useState("");
  const [calendarUrlInput, setCalendarUrlInput] = useState("");
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [searchPro, setSearchPro] = useState("");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, bucket: string, folder: string = "general") => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      toast({ title: "Fichier chargé", description: "Le fichier a été téléchargé avec succès." });
      return publicUrl;
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erreur d'upload", description: error.message });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

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
      const { data, error } = await supabase.from("professionals").select("*").order("last_name");
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

  const { data: messages, isLoading: loadingMessages, error: errorMessages } = useQuery({
    queryKey: ["admin_messages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contacts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Message[];
    }
  });

  const { data: announcements, isLoading: loadingAnnouncements } = useQuery({
    queryKey: ["admin_announcements"],
    queryFn: async () => {
      const { data, error } = await supabase.from("replacements").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Replacement[];
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

  const { data: members, isLoading: loadingMembers } = useQuery({
    queryKey: ["admin_members"],
    queryFn: async () => {
      const { data, error } = await supabase.from("members").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as MemberRow[];
    }
  });

  const memberStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("members").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_members"] });
      toast({ title: "Statut mis à jour", description: "Le statut de l'adhérent a été modifié." });
    },
    onError: (error) => toast({ variant: "destructive", title: "Erreur", description: error.message })
  });

  useEffect(() => {
    if (settings && Array.isArray(settings)) {
      const calendar = settings.find((s: any) => s.key === "google_calendar_url")?.value || "";
      const phone = settings.find((s: any) => s.key === "contact_phone")?.value || "";
      setCalendarUrlInput(calendar || "");
      setContactPhoneInput(phone || "");
    }
  }, [settings]);

  // --- Mutations ---
  const proMutation = useMutation({
    mutationFn: async (pro: any) => {
      if (editingPro) {
        const { error } = await supabase.from("professionals").update(pro).eq("id", editingPro.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("professionals").insert([pro]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_pros"] });
      toast({ title: editingPro ? "Mis à jour" : "Ajouté", description: `Le professionnel a été ${editingPro ? "modifié" : "ajouté"} avec succès.` });
      setIsAddProOpen(false);
      setEditingPro(null);
      setNewPro({ title: "Dr.", first_name: "", last_name: "", specialty: "", public_phone: "", private_phone: "", email: "", address: "", photo_url: "" });
    },
    onError: (error) => toast({ variant: "destructive", title: "Erreur", description: error.message })
  });

  // Bulk Professionals Mutation
  const bulkProMutation = useMutation({
    mutationFn: async (pros: any[]) => {
      const { error } = await supabase.from("professionals").insert(pros);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_pros"] });
      toast({ title: "Import réussi", description: `${previewData.length} professionnels ont été importés.` });
      setIsImportDialogOpen(false);
      setPreviewData([]);
    },
    onError: (error) => toast({ variant: "destructive", title: "Erreur d'importation", description: error.message })
  });

  // News Mutation
  const newsMutation = useMutation({
    mutationFn: async (article: any) => {
      if (editingNews) {
        const { error } = await supabase.from("news").update(article).eq("id", editingNews.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("news").insert([{ ...article, published_at: new Date().toISOString() }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_news"] });
      toast({ title: editingNews ? "Mis à jour" : "Ajouté", description: `L'article a été ${editingNews ? "modifié" : "ajouté"} avec succès.` });
      setIsAddNewsOpen(false);
      setEditingNews(null);
      setNewNews({ title: "", excerpt: "", category: "Santé", image_url: "" });
    },
    onError: (error) => toast({ variant: "destructive", title: "Erreur", description: error.message })
  });

  // Resources Mutation
  const resourceMutation = useMutation({
    mutationFn: async (resource: any) => {
      if (editingResource) {
        const { error } = await supabase.from("resources").update(resource).eq("id", editingResource.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("resources").insert([resource]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_resources"] });
      toast({ title: editingResource ? "Mis à jour" : "Ajouté", description: `La ressource a été ${editingResource ? "modifiée" : "ajoutée"} avec succès.` });
      setIsAddResourceOpen(false);
      setEditingResource(null);
      setNewResource({ title: "", description: "", type: "lien", url: "" });
    },
    onError: (error) => toast({ variant: "destructive", title: "Erreur", description: error.message })
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
                        { value: "news", label: "Blog/Actualités", icon: Newspaper },
                        { value: "pros", label: "Annuaire", icon: Users },
                        { value: "members", label: "Adhérents", icon: ShieldCheck },
                        { value: "resources", label: "Ressources", icon: FileText },
                        { value: "announcements", label: "Annonces", icon: Zap },
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
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
                      <StatCard count={news?.length || 0} label="Actualités" icon={Newspaper} color="sky" />
                      <StatCard count={pros?.length || 0} label="Professionnels" icon={Users} color="emerald" />
                      <StatCard count={members?.filter(m => m.status === 'pending').length || 0} label="Adhésions en attente" icon={Clock} color="amber" />
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
                    <SectionHeader 
                      title="Gestion des Actualités" 
                      description="Publiez et gérez les articles du blog." 
                      onAdd={() => {
                        setEditingNews(null);
                        setNewNews({ title: "", excerpt: "", category: "Santé", image_url: "" });
                        setIsAddNewsOpen(true);
                      }} 
                    />
                    <div className="grid gap-6">
                       {loadingNews ? <Loader /> : (news && news.length > 0) ? news.map(item => (
                         <AdminListItem 
                           key={item.id} 
                           title={item.title} 
                           subtitle={item.category}
                           onEdit={() => {
                             setEditingNews(item);
                             setNewNews({
                               title: item.title,
                               excerpt: item.excerpt,
                               category: item.category,
                               image_url: item.image_url,
                             });
                             setIsAddNewsOpen(true);
                           }}
                           onDelete={() => {
                             setItemToDelete({ table: 'news', id: item.id });
                             setIsDeleteDialogOpen(true);
                           }}
                         />
                       )) : (
                         <div className="p-20 text-center bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-navy/5 shadow-inner animate-in fade-in duration-700">
                            <Newspaper className="w-16 h-16 text-navy/10 mx-auto mb-6" />
                            <p className="text-xl font-bold text-navy/20 italic">Aucune actualité publiée pour le moment.</p>
                         </div>
                       )}
                    </div>

                    <Dialog open={isAddNewsOpen} onOpenChange={setIsAddNewsOpen}>
                      <DialogContent className="rounded-[3rem] border-navy/5 bg-white p-12 max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-4xl font-display font-bold text-navy tracking-tight">
                            {editingNews ? "Modifier l'article" : "Ajouter un article"}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-8 py-8">
                          <div className="grid gap-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-navy/30 px-2">Titre de l'article</Label>
                            <Input 
                              value={newNews.title} 
                              onChange={(e) => setNewNews({...newNews, title: e.target.value})}
                              placeholder="ex: Ouverture d'un nouveau centre..."
                              className="h-16 rounded-2xl border-navy/5 bg-sky-50/30 font-bold text-navy" 
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                             <div className="grid gap-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-navy/30 px-2">Catégorie</Label>
                                <Select value={newNews.category} onValueChange={(val) => setNewNews({...newNews, category: val})}>
                                   <SelectTrigger className="h-16 rounded-2xl border-navy/5 bg-sky-50/30 font-bold text-navy">
                                      <SelectValue placeholder="Catégorie" />
                                   </SelectTrigger>
                                   <SelectContent>
                                      {["Santé", "Vie de la CPTS", "Événement", "Prévention", "Annonce"].map(c => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                      ))}
                                   </SelectContent>
                                </Select>
                             </div>
                             <div className="grid gap-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-navy/30 px-2">Image de couverture</Label>
                                <div className="relative group/upload h-16 w-full">
                                   <input 
                                     type="file" 
                                     accept="image/*"
                                     onChange={async (e) => {
                                       const url = await handleFileUpload(e, "news", "news-images");
                                       if (url) setNewNews({ ...newNews, image_url: url });
                                     }}
                                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                     disabled={isUploading}
                                   />
                                   <div className={`h-16 w-full rounded-2xl border-2 border-dashed border-navy/5 bg-sky-50/30 flex items-center justify-between px-6 transition-all group-hover/upload:border-sky-600/30 ${isUploading ? 'opacity-50' : ''}`}>
                                      <div className="flex items-center gap-4">
                                         {isUploading ? (
                                           <Loader2 className="w-5 h-5 animate-spin text-sky-600" />
                                         ) : (
                                           <Upload className="w-5 h-5 text-sky-600" />
                                         )}
                                         <span className="font-bold text-navy/40 truncate max-w-[200px]">
                                            {newNews.image_url ? "Image sélectionnée" : "Sélectionner un fichier"}
                                         </span>
                                      </div>
                                      {newNews.image_url && (
                                        <div className="w-12 h-10 rounded-lg overflow-hidden border border-white shadow-sm shrink-0 bg-white">
                                          <img src={newNews.image_url} alt="Aperçu" className="w-full h-full object-cover" />
                                        </div>
                                      )}
                                   </div>
                                </div>
                                <Input 
                                  value={newNews.image_url} 
                                  onChange={(e) => setNewNews({...newNews, image_url: e.target.value})}
                                  placeholder="Ou collez une URL ici..."
                                  className="h-12 rounded-xl border-navy/5 bg-sky-50/10 font-bold text-navy mt-2 text-xs" 
                                />
                             </div>
                          </div>
                          <div className="grid gap-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-navy/30 px-2">Extrait / Résumé</Label>
                            <Textarea 
                              value={newNews.excerpt} 
                              onChange={(e) => setNewNews({...newNews, excerpt: e.target.value})}
                              placeholder="Bref résumé de l'article..."
                              className="rounded-2xl border-navy/5 bg-sky-50/30 font-bold text-navy p-6 min-h-[150px]" 
                            />
                          </div>
                        </div>
                        <DialogFooter className="gap-4">
                           <Button 
                             onClick={() => newsMutation.mutate(newNews)} 
                             disabled={newsMutation.isPending || isUploading}
                             className="h-16 rounded-2xl px-12 bg-navy text-white font-bold disabled:opacity-50 transition-all hover:bg-sky-600"
                           >
                              {(newsMutation.isPending || isUploading) && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                              Enregistrer l'article
                           </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TabsContent>

                   {/* Pros Management */}
                   <TabsContent value="pros" className="mt-0 outline-none">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-12">
                      <div>
                        <h2 className="text-4xl font-display font-bold text-navy tracking-tight mb-4">Annuaire</h2>
                        <p className="text-navy/40 font-medium italic text-lg leading-relaxed">Gérez la liste des membres professionnels.</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-4">
                        <Button 
                          onClick={() => setIsImportDialogOpen(true)}
                          className="h-20 rounded-[2rem] bg-white border-2 border-sky-600/20 text-sky-600 hover:bg-sky-50 px-10 font-display font-bold text-lg transition-all shadow-xl flex items-center gap-4 active:scale-95"
                        >
                          <Upload className="w-6 h-6" strokeWidth={3} />
                          Importer
                        </Button>
                        <Button 
                          onClick={() => {
                            setEditingPro(null);
                            setNewPro({ title: "Dr.", first_name: "", last_name: "", specialty: "", public_phone: "", private_phone: "", email: "", address: "", photo_url: "" });
                            setIsAddProOpen(true);
                          }} 
                          className="h-20 rounded-[2rem] bg-sky-600 hover:bg-navy text-white px-10 font-display font-bold text-lg transition-all shadow-3xl shadow-sky-600/30 flex items-center gap-4 active:scale-95"
                        >
                          <Plus className="w-6 h-6" strokeWidth={3} />
                          Ajouter
                        </Button>
                      </div>
                     </div>
                    
                    <div className="mb-10">
                       <div className="relative group">
                          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-navy/20 transition-colors group-focus-within:text-sky-600">
                             <Search className="w-6 h-6" />
                          </div>
                          <Input 
                            value={searchPro}
                            onChange={(e) => setSearchPro(e.target.value)}
                            placeholder="Rechercher par nom ou spécialité..."
                            className="h-20 w-full rounded-[2rem] border-navy/5 bg-white/50 backdrop-blur-xl pl-16 pr-8 font-bold text-navy text-xl shadow-inner focus-visible:ring-sky-500/20"
                          />
                       </div>
                    </div>

                    <div className="grid gap-6">
                       {loadingPros ? <Loader /> : (pros && pros.length > 0) ? (
                         pros
                           .filter(item => {
                             const search = searchPro.toLowerCase();
                             return item.last_name?.toLowerCase().includes(search) || 
                                    item.first_name?.toLowerCase().includes(search) || 
                                    item.specialty?.toLowerCase().includes(search);
                           })
                           .map(item => (
                             <AdminListItem 
                               key={item.id} 
                               title={`${item.title || ''} ${item.first_name || ''} ${item.last_name || ''}`} 
                               subtitle={item.specialty}
                               onEdit={() => {
                                 setEditingPro(item);
                                 setNewPro({
                                   title: item.title || "Dr.",
                                   first_name: item.first_name || "",
                                   last_name: item.last_name || "",
                                   specialty: item.specialty,
                                   public_phone: item.public_phone || "",
                                   private_phone: item.private_phone || "",
                                   email: item.email || "",
                                   address: item.address || "",
                                   photo_url: item.photo_url || "",
                                 });
                                 setIsAddProOpen(true);
                               }}
                               onDelete={() => {
                                 setItemToDelete({ table: 'professionals', id: item.id });
                                 setIsDeleteDialogOpen(true);
                               }}
                             />
                           ))
                       ) : (
                         <div className="p-20 text-center bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-navy/5 shadow-inner">
                            <Users className="w-16 h-16 text-navy/10 mx-auto mb-6" />
                            <p className="text-xl font-bold text-navy/20 italic">Aucun professionnel dans l'annuaire.</p>
                         </div>
                       )}
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

                            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-sky-600 mb-2">Localisation & Photo</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

                               <div className="grid gap-3">
                                 <Label className="text-[10px] font-black uppercase tracking-widest text-navy/30 px-2">Photo de profil</Label>
                                 <div className="relative group/upload h-16 w-full">
                                    <input 
                                      type="file" 
                                      accept="image/*"
                                      onChange={async (e) => {
                                        const url = await handleFileUpload(e, "annuaire", "pros");
                                        if (url) setNewPro({ ...newPro, photo_url: url });
                                      }}
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                      disabled={isUploading}
                                    />
                                    <div className={`h-16 w-full rounded-2xl border-2 border-dashed border-navy/5 bg-sky-50/30 flex items-center justify-between px-6 transition-all group-hover/upload:border-sky-600/30 ${isUploading ? 'opacity-50' : ''}`}>
                                       <div className="flex items-center gap-4">
                                          {isUploading ? (
                                            <Loader2 className="w-5 h-5 animate-spin text-sky-600" />
                                          ) : (
                                            <Upload className="w-5 h-5 text-sky-600" />
                                          )}
                                          <span className="font-bold text-navy/40 truncate max-w-[150px]">
                                             {newPro.photo_url ? "Photo prête" : "Uploader"}
                                          </span>
                                       </div>
                                       {newPro.photo_url && (
                                         <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                                           <img src={newPro.photo_url} alt="Aperçu" className="w-full h-full object-cover" />
                                         </div>
                                       )}
                                    </div>
                                 </div>
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
                            onClick={() => proMutation.mutate(newPro)}
                            disabled={proMutation.isPending}
                            className="h-20 rounded-[2rem] px-16 bg-navy hover:bg-sky-600 text-white font-display font-bold text-xl shadow-3xl shadow-navy/20 transition-all flex items-center gap-6 active:scale-95"
                          >
                            {proMutation.isPending ? <Loader2 className="w-7 h-7 animate-spin" /> : <Save className="w-7 h-7" />}
                            {editingPro ? "Mettre à jour" : "Enregistrer le professionnel"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TabsContent>

                  {/* Resources Management */}
                  <TabsContent value="resources" className="mt-0 outline-none">
                    <SectionHeader 
                      title="Gestion des Ressources" 
                      description="Gérez les documents et liens de téléchargement." 
                      onAdd={() => {
                        setEditingResource(null);
                        setNewResource({ title: "", description: "", type: "lien", url: "" });
                        setIsAddResourceOpen(true);
                      }} 
                    />
                    <div className="grid gap-6">
                      {loadingResources ? <Loader /> : resources?.map(item => {
                        const colors: Record<string, string> = {
                          guide: "sky",
                          protocole: "emerald",
                          outil: "amber",
                          webinaire: "purple",
                          lien: "navy"
                        };
                        const color = colors[item.type as keyof typeof colors] || "slate";
                        
                        return (
                          <AdminListItem 
                            key={item.id} 
                            title={item.title} 
                            subtitle={item.type.toUpperCase()}
                            badgeColor={color}
                            onEdit={() => {
                              setEditingResource(item);
                              setNewResource({
                                title: item.title,
                                description: item.description,
                                type: item.type,
                                url: item.url,
                              });
                              setIsAddResourceOpen(true);
                            }}
                            onDelete={() => {
                              setItemToDelete({ table: 'resources', id: item.id });
                              setIsDeleteDialogOpen(true);
                            }}
                          />
                        );
                      })}
                    </div>

                    <Dialog open={isAddResourceOpen} onOpenChange={setIsAddResourceOpen}>
                      <DialogContent className="rounded-[3rem] border-navy/5 bg-white p-12 max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-4xl font-display font-bold text-navy tracking-tight">{editingResource ? "Modifier la ressource" : "Ajouter une ressource"}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-8 py-8">
                           <div className="grid grid-cols-2 gap-6">
                              <div className="grid gap-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-navy/30 px-2">Titre</Label>
                                <Input 
                                  value={newResource.title} 
                                  onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                                  placeholder="ex: Guide de vaccination..."
                                  className="h-16 rounded-2xl border-navy/5 bg-sky-50/30 font-bold text-navy" 
                                />
                              </div>
                              <div className="grid gap-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-navy/30 px-2">Catégorie</Label>
                                <Select value={newResource.type} onValueChange={(val) => setNewResource({...newResource, type: val})}>
                                   <SelectTrigger className="h-16 rounded-2xl border-navy/5 bg-sky-50/30 font-bold text-navy">
                                      <SelectValue placeholder="Choisir une catégorie" />
                                   </SelectTrigger>
                                   <SelectContent>
                                      {[
                                         { id: "guide", label: "GUIDE" },
                                         { id: "protocole", label: "PROTOCOLE" },
                                         { id: "outil", label: "OUTIL" },
                                         { id: "webinaire", label: "WEBINAIRE" },
                                         { id: "lien", label: "LIEN UTILE" }
                                       ].map(t => (
                                        <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                                      ))}
                                   </SelectContent>
                                </Select>
                              </div>
                           </div>
                           <div className="grid gap-3">
                             <Label className="text-[10px] font-black uppercase tracking-widest text-navy/30 px-2 flex justify-between">
                               <span>Fichier de la ressource (PDF, Image...)</span>
                               <span className="text-sky-600 lowercase italic">Nécessite le bucket "documents" dans Supabase</span>
                             </Label>
                             <div className="relative group/upload h-16 w-full mb-2">
                                <input 
                                  type="file" 
                                  onChange={async (e) => {
                                    const url = await handleFileUpload(e, "documents", "resources");
                                    if (url) setNewResource({ ...newResource, url: url });
                                  }}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                  disabled={isUploading}
                                />
                                <div className={`h-16 w-full rounded-2xl border-2 border-dashed border-navy/5 bg-sky-50/30 flex items-center justify-between px-6 transition-all group-hover/upload:border-sky-600/30 ${isUploading ? 'opacity-50' : ''}`}>
                                   <div className="flex items-center gap-4">
                                      {isUploading ? (
                                        <Loader2 className="w-5 h-5 animate-spin text-sky-600" />
                                      ) : (
                                        <FileText className="w-5 h-5 text-sky-600" />
                                      )}
                                      <span className="font-bold text-navy/40 truncate max-w-[250px]">
                                         {newResource.url ? "Fichier sélectionné" : "Choisir un fichier"}
                                      </span>
                                   </div>
                                </div>
                             </div>
                             <Input 
                               value={newResource.url} 
                               onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                               placeholder="Ou URL externe (si lien)..."
                               className="h-12 rounded-xl border-navy/5 bg-sky-50/10 font-bold text-navy text-xs px-6" 
                             />
                           </div>
                           <div className="grid gap-3">
                             <Label className="text-[10px] font-black uppercase tracking-widest text-navy/30 px-2">Description</Label>
                             <Textarea 
                               value={newResource.description} 
                               onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                               placeholder="Description rapide..."
                               className="rounded-2xl border-navy/5 bg-sky-50/30 font-bold text-navy p-6" 
                             />
                           </div>
                        </div>
                        <DialogFooter className="gap-4">
                           <Button variant="ghost" onClick={() => setIsAddResourceOpen(false)} className="h-16 rounded-2xl px-10 font-bold">Annuler</Button>
                           <Button 
                             onClick={() => resourceMutation.mutate(newResource)} 
                             disabled={resourceMutation.isPending}
                             className="h-16 rounded-2xl px-12 bg-navy text-white font-bold"
                           >
                              {resourceMutation.isPending && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                              Enregistrer la ressource
                           </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TabsContent>

                  {/* Announcements Management */}
                  <TabsContent value="announcements" className="mt-0 outline-none">
                    <div className="mb-12">
                      <h2 className="text-4xl font-display font-bold text-navy tracking-tight mb-4">Gestion des Annonces</h2>
                      <p className="text-navy/40 font-medium italic text-lg leading-relaxed">Approuvez ou archivez les offres de remplacement.</p>
                    </div>

                    <div className="grid gap-6">
                      {loadingAnnouncements ? <Loader /> : (announcements && announcements.length > 0) ? announcements.map(item => (
                        <Card 
                          key={item.id} 
                          className="rounded-[2.5rem] border border-navy/5 shadow-2xl bg-white overflow-hidden p-8 hover:border-sky-600/30 transition-all duration-500 group/item"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex-1">
                               <div className="flex items-center gap-4 mb-4">
                                  <div className="flex flex-col">
                                     <h3 className="text-xl font-display font-bold text-navy tracking-tight uppercase">{item.profession}</h3>
                                     <p className="text-[10px] font-black text-sky-600/60 tracking-[0.2em] uppercase mt-1">{item.titre} {item.prenom} {item.nom}</p>
                                  </div>
                                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${item.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'}`}>
                                    {item.status === 'active' ? 'En ligne' : 'En attente'}
                                  </span>
                                  {item.urgent && (
                                    <span className="px-3 py-1 rounded-full bg-rose-500 text-white text-[8px] font-black uppercase tracking-widest animate-bounce">Urgent</span>
                                  )}
                               </div>
                               <div className="flex flex-wrap gap-x-8 gap-y-2 mb-6">
                                  <p className="flex items-center gap-2 text-navy/40 font-bold text-xs"><MapPin className="w-3 h-3" /> {item.lieu}</p>
                                  {item.adresse && <p className="flex items-center gap-2 text-navy/40 font-bold text-xs"><Navigation className="w-3 h-3" /> {item.adresse}</p>}
                                  <p className="flex items-center gap-2 text-navy/40 font-bold text-xs"><Calendar className="w-3 h-3" /> {item.periode}</p>
                                  <p className="flex items-center gap-2 text-navy/40 font-bold text-xs"><Mail className="w-3 h-3" /> {item.email}</p>
                               </div>
                               <p className="text-navy/60 italic leading-relaxed text-sm bg-sky-50/20 p-4 rounded-2xl">"{item.description}"</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="text-sky-600 hover:bg-sky-50 rounded-2xl h-14 w-14"
                                  onClick={() => {
                                    setEditingAnnouncement(item);
                                    setNewAnnouncement({
                                      profession: item.profession,
                                      titre: item.titre || "Dr.",
                                      nom: item.nom || "",
                                      prenom: item.prenom || "",
                                      adresse: item.adresse || "",
                                      lieu: item.lieu,
                                      periode: item.periode,
                                      description: item.description,
                                      email: item.email,
                                      phone: item.phone || "",
                                      urgent: item.urgent,
                                      status: item.status
                                    });
                                    setIsEditAnnouncementOpen(true);
                                  }}
                                >
                                   <Edit className="w-6 h-6" />
                                </Button>
                                {item.status !== 'active' && (
                                 <Button 
                                   variant="ghost" 
                                   size="icon"
                                   className="text-emerald-500 hover:bg-emerald-50 rounded-2xl h-14 w-14"
                                   onClick={async () => {
                                     const { error } = await supabase.from("replacements").update({ status: 'active' }).eq("id", item.id);
                                     if (error) toast({ variant: "destructive", title: "Erreur", description: error.message });
                                     else queryClient.invalidateQueries({ queryKey: ["admin_announcements"] });
                                   }}
                                 >
                                    <CheckCircle2 className="w-6 h-6" />
                                 </Button>
                               )}
                               <Button 
                                 variant="ghost" 
                                 size="icon" 
                                 className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-2xl h-14 w-14"
                                 onClick={() => {
                                   setItemToDelete({ table: 'replacements', id: item.id });
                                   setIsDeleteDialogOpen(true);
                                 }}
                               >
                                 <Trash2 className="w-6 h-6" />
                               </Button>
                            </div>
                          </div>
                        </Card>
                      )) : (
                        <div className="p-20 text-center bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-navy/5">
                           <Zap className="w-16 h-16 text-navy/10 mx-auto mb-6" />
                           <p className="text-xl font-bold text-navy/20 italic">Aucune annonce de remplacement.</p>
                        </div>
                      )}
                    </div>

                    {/* Edit Announcement Dialog */}
                    <Dialog open={isEditAnnouncementOpen} onOpenChange={setIsEditAnnouncementOpen}>
                      <DialogContent className="rounded-[4rem] border-navy/5 bg-white p-8 max-w-2xl shadow-3xl overflow-y-auto max-h-[90vh]">
                        <DialogHeader className="mb-8 text-left">
                          <DialogTitle className="text-3xl font-display font-bold text-navy tracking-tight mb-2">Modifier l'annonce</DialogTitle>
                          <DialogDescription className="text-sm italic text-navy/40 font-medium">Mettez à jour les détails de cette offre de remplacement.</DialogDescription>
                        </DialogHeader>
                        
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                            <div className="space-y-2">
                               <Label className="text-navy font-black text-[10px] uppercase tracking-widest opacity-40">Civilité</Label>
                               <Select value={newAnnouncement.titre} onValueChange={(val) => setNewAnnouncement({...newAnnouncement, titre: val})}>
                                 <SelectTrigger className="rounded-xl border-navy/5 bg-sky-50/30 font-bold text-navy h-12 flex"><SelectValue /></SelectTrigger>
                                 <SelectContent className="rounded-2xl border-navy/5 bg-white shadow-3xl">
                                   <SelectItem value="Dr.">Dr.</SelectItem>
                                   <SelectItem value="Pr.">Pr.</SelectItem>
                                   <SelectItem value="Mr.">Mr.</SelectItem>
                                   <SelectItem value="Mme.">Mme.</SelectItem>
                                 </SelectContent>
                               </Select>
                            </div>
                            <div className="space-y-2">
                               <Label className="text-navy font-black text-[10px] uppercase tracking-widest opacity-40">Profession</Label>
                               <Input 
                                 value={newAnnouncement.profession} 
                                 onChange={(e) => setNewAnnouncement({...newAnnouncement, profession: e.target.value})}
                                 className="rounded-xl border-navy/5 bg-sky-50/30 font-bold text-navy h-12 px-4 focus:ring-sky-500/20 flex" 
                               />
                            </div>
                            <div className="space-y-2">
                               <Label className="text-navy font-black text-[10px] uppercase tracking-widest opacity-40">Prénom</Label>
                               <Input 
                                 value={newAnnouncement.prenom} 
                                 onChange={(e) => setNewAnnouncement({...newAnnouncement, prenom: e.target.value})}
                                 className="rounded-xl border-navy/5 bg-sky-50/30 font-bold text-navy h-12 px-4 flex" 
                               />
                            </div>
                            <div className="space-y-2">
                               <Label className="text-navy font-black text-[10px] uppercase tracking-widest opacity-40">Nom</Label>
                               <Input 
                                 value={newAnnouncement.nom} 
                                 onChange={(e) => setNewAnnouncement({...newAnnouncement, nom: e.target.value})}
                                 className="rounded-xl border-navy/5 bg-sky-50/30 font-bold text-navy h-12 px-4 flex" 
                               />
                            </div>
                            <div className="space-y-2">
                               <Label className="text-navy font-black text-[10px] uppercase tracking-widest opacity-40">Adresse Précise</Label>
                               <Input 
                                 value={newAnnouncement.adresse} 
                                 onChange={(e) => setNewAnnouncement({...newAnnouncement, adresse: e.target.value})}
                                 className="rounded-xl border-navy/5 bg-sky-50/30 font-bold text-navy h-12 px-4 flex" 
                               />
                            </div>
                            <div className="space-y-2">
                               <Label className="text-navy font-black text-[10px] uppercase tracking-widest opacity-40">Lieu (Secteur)</Label>
                               <Input 
                                 value={newAnnouncement.lieu} 
                                 onChange={(e) => setNewAnnouncement({...newAnnouncement, lieu: e.target.value})}
                                 className="rounded-xl border-navy/5 bg-sky-50/30 font-bold text-navy h-12 px-4 flex" 
                               />
                            </div>
                            <div className="space-y-2">
                               <Label className="text-navy font-black text-[10px] uppercase tracking-widest opacity-40">Période</Label>
                               <Input 
                                 value={newAnnouncement.periode} 
                                 onChange={(e) => setNewAnnouncement({...newAnnouncement, periode: e.target.value})}
                                 className="rounded-xl border-navy/5 bg-sky-50/30 font-bold text-navy h-12 px-4 flex" 
                               />
                            </div>
                            <div className="space-y-2">
                               <Label className="text-navy font-black text-[10px] uppercase tracking-widest opacity-40">Email de contact</Label>
                               <Input 
                                 value={newAnnouncement.email} 
                                 onChange={(e) => setNewAnnouncement({...newAnnouncement, email: e.target.value})}
                                 className="rounded-xl border-navy/5 bg-sky-50/30 font-bold text-navy h-12 px-4 flex" 
                               />
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-2">
                               <Label className="text-navy font-black text-[10px] uppercase tracking-widest opacity-40">Description</Label>
                               <Textarea 
                                 value={newAnnouncement.description} 
                                 onChange={(e) => setNewAnnouncement({...newAnnouncement, description: e.target.value})}
                                 rows={4}
                                 className="rounded-xl border-navy/5 bg-sky-50/30 font-bold text-navy p-4 min-h-[100px] flex" 
                               />
                            </div>
                            <div className="flex items-center gap-4 bg-navy/5 p-4 rounded-xl">
                               <input 
                                 type="checkbox" 
                                 id="urgent_edit"
                                 checked={newAnnouncement.urgent}
                                 onChange={(e) => setNewAnnouncement({...newAnnouncement, urgent: e.target.checked})}
                                 className="w-5 h-5 rounded accent-rose-500"
                               />
                               <Label htmlFor="urgent_edit" className="text-navy font-bold text-sm tracking-tight cursor-pointer">Marquer comme Urgent</Label>
                            </div>
                         </div>
                        <DialogFooter className="gap-3 mt-8">
                           <Button variant="ghost" onClick={() => setIsEditAnnouncementOpen(false)} className="rounded-xl px-6 font-bold h-12">Annuler</Button>
                           <Button 
                             onClick={() => {
                               if (editingAnnouncement) {
                                 announcementUpdateMutation.mutate({ id: editingAnnouncement.id, data: newAnnouncement });
                               }
                             }} 
                             disabled={announcementUpdateMutation.isPending}
                             className="rounded-xl px-8 bg-sky-600 text-white font-bold hover:bg-sky-500 transition-all shadow-lg shadow-sky-600/20 h-12"
                           >
                              {announcementUpdateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                              Sauvegarder
                           </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TabsContent>

                  {/* Messages Management */}
                  <TabsContent value="messages" className="mt-0 outline-none">
                    <div className="mb-12">
                      <h2 className="text-4xl font-display font-bold text-navy tracking-tight mb-4">Messages Reçus</h2>
                      <p className="text-navy/40 font-medium italic text-lg leading-relaxed">Consultez les demandes de contact envoyées via le site.</p>
                    </div>
                    <div className="grid gap-6">
                      {loadingMessages ? (
                        <Loader />
                      ) : errorMessages ? (
                        <div className="p-20 text-center bg-red-50/50 backdrop-blur-3xl rounded-[3rem] border border-red-200">
                           <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
                           <h4 className="text-navy font-display font-bold text-2xl mb-4">Erreur de chargement</h4>
                           <p className="text-navy/40 font-medium italic text-lg leading-relaxed max-w-xl mx-auto">
                              Impossible de récupérer les messages : <strong>{(errorMessages as any).message}</strong>. 
                           </p>
                           <p className="text-sky-600 mt-8 font-black text-xs uppercase tracking-widest">
                              Vérifiez que la table "contacts" existe et que les permissions RLS sont configurées.
                           </p>
                        </div>
                      ) : messages && messages.length > 0 ? (
                        messages.map((item) => (
                          <Card
                            key={item.id}
                            className="rounded-[2.5rem] border border-navy/5 shadow-2xl bg-white overflow-hidden p-8 hover:border-sky-600/30 transition-all duration-500"
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                              <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                  <h3 className="text-xl font-display font-bold text-navy tracking-tight">
                                    {item.title} {item.first_name} {item.last_name || item.name}
                                  </h3>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-navy/20">
                                    {new Date(item.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
                                   <p className="text-sky-600 font-bold bg-sky-50 px-4 py-1.5 rounded-xl text-xs flex items-center gap-2">
                                      <Mail className="w-3.5 h-3.5" />
                                      {item.email}
                                   </p>
                                   {item.phone && (
                                     <p className="text-emerald-600 font-bold bg-emerald-50 px-4 py-1.5 rounded-xl text-xs flex items-center gap-2">
                                        <Phone className="w-3.5 h-3.5" />
                                        {item.phone}
                                     </p>
                                   )}
                                </div>
                                <p className="text-navy/60 italic leading-relaxed border-l-4 border-sky-100 pl-8 py-4 bg-sky-50/10 rounded-r-[2rem]">"{item.message}"</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-2xl h-14 w-14 shrink-0 transition-all"
                                onClick={() => {
                                  setItemToDelete({ table: "contacts", id: item.id });
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="w-6 h-6" />
                              </Button>
                            </div>
                          </Card>
                        ))
                      ) : (
                        <div className="p-20 text-center bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-navy/5">
                          <Mail className="w-16 h-16 text-navy/10 mx-auto mb-6" />
                          <p className="text-xl font-bold text-navy/20 italic">Aucun message pour le moment.</p>
                        </div>
                      )}
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
                           <div className="flex flex-col gap-12">
                              {/* Calendar URL */}
                              <div className="flex flex-col gap-6">
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
                                      className="h-16 rounded-[1.2rem] px-8 bg-navy hover:bg-sky-600 text-white font-bold transition-all shadow-xl disabled:opacity-50"
                                    >
                                       {updateSettingMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 mr-4" />}
                                       Enregistrer
                                    </Button>
                                 </div>
                              </div>
                              
                              <div className="w-full h-px bg-navy/5" />

                              {/* Contact Phone */}
                              <div className="flex flex-col gap-6">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                       <Phone className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-display font-bold text-navy tracking-tight">Téléphone de Contact</h3>
                                 </div>
                                 <div className="flex gap-4">
                                    <Input 
                                       value={contactPhoneInput} 
                                       onChange={(e) => setContactPhoneInput(e.target.value)}
                                       placeholder="ex : 07 45 28 16 26"
                                       className="h-16 rounded-2xl border-navy/10 bg-sky-50/20 font-bold text-navy focus-visible:ring-sky-500/20"
                                    />
                                    <Button 
                                      onClick={() => updateSettingMutation.mutate({ key: "contact_phone", value: contactPhoneInput })}
                                      disabled={updateSettingMutation.isPending}
                                      className="h-16 rounded-[1.2rem] px-8 bg-navy hover:bg-sky-600 text-white font-bold transition-all shadow-xl disabled:opacity-50"
                                    >
                                       {updateSettingMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 mr-4" />}
                                       Enregistrer
                                    </Button>
                                 </div>
                              </div>
                           </div>
                        </Card>
                    </div>
                  </TabsContent>

                  {/* Members Management */}
                  <TabsContent value="members" className="mt-0 outline-none">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-12">
                      <div>
                        <h2 className="text-4xl font-display font-bold text-navy tracking-tight mb-4">Gestion des Adhérents</h2>
                        <p className="text-navy/40 font-medium italic text-lg leading-relaxed">Approuvez ou refusez les demandes d'adhésion.</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {(["all", "pending", "approved", "rejected"] as const).map((f) => {
                          const labels: Record<string, string> = { all: "Tous", pending: "En attente", approved: "Approuvés", rejected: "Refusés" };
                          const colors: Record<string, string> = { all: "bg-navy/5 text-navy", pending: "bg-amber-50 text-amber-700 border-amber-200", approved: "bg-emerald-50 text-emerald-700 border-emerald-200", rejected: "bg-red-50 text-red-600 border-red-200" };
                          return (
                            <button
                              key={f}
                              onClick={() => setMemberFilter(f)}
                              className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${
                                memberFilter === f ? colors[f] + " shadow-lg" : "border-navy/5 text-navy/30 hover:bg-navy/5"
                              }`}
                            >
                              {labels[f]}
                              {f === "pending" && members?.filter(m => m.status === "pending").length ? (
                                <span className="ml-2 w-5 h-5 inline-flex items-center justify-center rounded-full bg-amber-500 text-white text-[9px] font-black">{members.filter(m => m.status === "pending").length}</span>
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid gap-6">
                      {loadingMembers ? (
                        <div className="flex items-center justify-center py-20"><Loader2 className="w-12 h-12 text-sky-600 animate-spin" /></div>
                      ) : (() => {
                        const filtered = members?.filter(m => memberFilter === "all" ? true : m.status === memberFilter) || [];
                        if (filtered.length === 0) return (
                          <div className="p-20 text-center bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-navy/5 shadow-inner">
                            <ShieldCheck className="w-16 h-16 text-navy/10 mx-auto mb-6" />
                            <p className="text-xl font-bold text-navy/20 italic">Aucun adhérent dans cette catégorie.</p>
                          </div>
                        );
                        return filtered.map((m) => {
                          const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
                            pending: { label: "En attente", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
                            approved: { label: "Approuvé", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
                            rejected: { label: "Refusé", color: "text-red-500", bg: "bg-red-50 border-red-200" },
                          };
                          const sc = statusConfig[m.status] || statusConfig.pending;
                          return (
                            <Card key={m.id} className="rounded-[2.5rem] border border-navy/5 shadow-2xl bg-white overflow-hidden p-8 hover:border-sky-600/20 transition-all duration-500">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-4 mb-2 flex-wrap">
                                    <h3 className="text-xl font-display font-bold text-navy tracking-tight uppercase">
                                      {m.title} {m.first_name} {m.last_name}
                                    </h3>
                                    <span className={`px-4 py-1 rounded-full text-[9px] font-black tracking-widest border ${sc.bg} ${sc.color}`}>{sc.label}</span>
                                  </div>
                                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-navy/40">
                                    <span className="font-bold">{m.specialty}</span>
                                    <span>{m.email}</span>
                                    {m.public_phone && <span>{m.public_phone}</span>}
                                    {m.address && <span>{m.address}</span>}
                                  </div>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-navy/15 mt-2">Inscrit le {new Date(m.created_at).toLocaleDateString("fr-FR")}</p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                  {m.status !== "approved" && (
                                    <Button
                                      onClick={() => memberStatusMutation.mutate({ id: m.id, status: "approved" })}
                                      disabled={memberStatusMutation.isPending}
                                      className="h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 shadow-lg transition-all"
                                    >
                                      <UserCheck className="w-4 h-4 mr-2" /> Approuver
                                    </Button>
                                  )}
                                  {m.status !== "rejected" && (
                                    <Button
                                      onClick={() => memberStatusMutation.mutate({ id: m.id, status: "rejected" })}
                                      disabled={memberStatusMutation.isPending}
                                      variant="outline"
                                      className="h-12 rounded-2xl border-red-200 text-red-500 hover:bg-red-50 font-bold px-6 transition-all"
                                    >
                                      <XCircle className="w-4 h-4 mr-2" /> Refuser
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-2xl h-12 w-12 transition-all"
                                    onClick={() => { setItemToDelete({ table: "members", id: m.id }); setIsDeleteDialogOpen(true); }}
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          );
                        });
                      })()}
                    </div>
                  </TabsContent>

                </div>
              </div>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />

      {/* Import Professional Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
         <DialogContent className="max-w-4xl rounded-[3rem] border-navy/5 bg-white p-12">
           <DialogHeader>
              <DialogTitle className="text-3xl font-display font-bold text-navy tracking-tight">Importer l'annuaire</DialogTitle>
              <DialogDescription className="text-lg italic text-navy/40 mt-4 leading-relaxed">
                 Importez vos professionnels en masse à partir d'un fichier CSV ou Excel.
              </DialogDescription>
           </DialogHeader>
           
           <div className="py-10 space-y-10">
              <div className="grid gap-6">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-navy/30 px-2">Sélectionner le fichier (CSV, XLSX)</Label>
                 <div className="relative h-40 w-full group/import">
                    <input 
                      type="file" 
                      accept=".csv, .xlsx, .xls, .json"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            try {
                              const bstr = evt.target?.result;
                              let data: any[] = [];
                              
                              if (file.name.endsWith('.json')) {
                                data = JSON.parse(bstr as string);
                              } else {
                                const wb = XLSX.read(bstr, { type: 'binary' });
                                const wsname = wb.SheetNames[0];
                                const ws = wb.Sheets[wsname];
                                data = XLSX.utils.sheet_to_json(ws);
                              }
                              
                              // Mapping intelligent
                              const mappedData = data.map((row: any) => ({
                                title: row.Titre || row.title || row.titre || "Dr.",
                                first_name: row.Prénom || row.first_name || row.prenom || "",
                                last_name: row.Nom || row.last_name || row.nom || "",
                                specialty: row.Spécialité || row.specialty || row.specialite || "",
                                public_phone: String(row.Téléphone || row.public_phone || row.telephone || ""),
                                email: row.Email || row.email || "",
                                address: row.Adresse || row.address || row.adresse || ""
                              }));
                              
                              setPreviewData(mappedData);
                            } catch (err) {
                              toast({ variant: "destructive", title: "Erreur de lecture", description: "Le fichier n'a pas pu être lu correctement." });
                            }
                          };

                          if (file.name.endsWith('.json')) {
                            reader.readAsText(file);
                          } else {
                            reader.readAsBinaryString(file);
                          }
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="h-40 w-full rounded-[2.5rem] border-4 border-dashed border-navy/5 bg-sky-50/20 flex flex-col items-center justify-center gap-4 transition-all group-hover/import:border-sky-600/30 group-hover/import:bg-sky-50/50">
                       <Upload className="w-12 h-12 text-sky-600" />
                       <p className="font-bold text-navy/40">Cliquez pour choisir un fichier ou glissez-le ici</p>
                    </div>
                 </div>
              </div>

              {previewData.length > 0 && (
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <h4 className="text-xl font-display font-bold text-navy tracking-tight">{previewData.length} professionnels détectés</h4>
                       <Button variant="ghost" className="text-red-500 font-bold" onClick={() => setPreviewData([])}>Vider</Button>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto rounded-3xl border border-navy/5 shadow-inner bg-navy/[0.02] p-6">
                       <table className="w-full text-left">
                          <thead>
                             <tr className="text-[10px] font-black uppercase tracking-widest text-navy/30">
                                <th className="pb-4 px-4">Nom Complet</th>
                                <th className="pb-4 px-4">Spécialité</th>
                                <th className="pb-4 px-4">Ville / Adresse</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-navy/5">
                             {previewData.slice(0, 10).map((p, i) => (
                                <tr key={i} className="text-sm">
                                   <td className="py-4 px-4 font-bold text-navy">{p.title} {p.first_name} {p.last_name}</td>
                                   <td className="py-4 px-4 font-medium text-navy/60">{p.specialty}</td>
                                   <td className="py-4 px-4 font-medium text-navy/40 truncate max-w-[200px]">{p.address}</td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                       {previewData.length > 10 && (
                         <p className="text-center text-xs italic text-navy/20 pt-6">... et {previewData.length - 10} autres professionnels</p>
                       )}
                    </div>
                 </div>
              )}
           </div>

           <DialogFooter className="gap-6 pt-8 border-t border-navy/5">
              <Button variant="ghost" onClick={() => { setIsImportDialogOpen(false); setPreviewData([]); }} className="h-16 rounded-2xl px-10 font-bold border-navy/5 hover:bg-sky-50">Annuler</Button>
              <Button 
                onClick={() => bulkProMutation.mutate(previewData)} 
                disabled={bulkProMutation.isPending || previewData.length === 0}
                className="h-16 rounded-2xl px-20 bg-sky-600 hover:bg-navy text-white font-bold transition-all shadow-3xl shadow-sky-600/30 disabled:opacity-50"
              >
                 {bulkProMutation.isPending && <Loader2 className="w-5 h-5 mr-4 animate-spin text-white" />}
                 Confirmer l'importation de {previewData.length} pros
              </Button>
           </DialogFooter>
         </DialogContent>
      </Dialog>

      {/* Global Deletion Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-[2.5rem] border-navy/5 bg-white p-12">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-3xl font-display font-bold text-navy tracking-tight">Êtes-vous absolument sûr ?</AlertDialogTitle>
            <AlertDialogDescription className="text-lg italic text-navy/40 mt-4 leading-relaxed">
              Cette action est irréversible. Cela supprimera définitivement l'élément de la base de données.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-4 mt-8">
            <AlertDialogCancel className="h-16 rounded-2xl px-8 font-bold border-navy/10 text-navy hover:bg-navy/5">Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (itemToDelete) {
                  deleteMutation.mutate(itemToDelete);
                  setIsDeleteDialogOpen(false);
                  setItemToDelete(null);
                }
              }}
              className="h-16 rounded-2xl px-10 bg-red-500 hover:bg-red-600 text-white font-bold shadow-xl shadow-red-500/20"
            >
              Confirmer la suppression
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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

const AdminListItem = ({ title, subtitle, onEdit, onDelete, badgeColor }: any) => {
  const colorMap: Record<string, string> = {
    sky: "bg-sky-50 text-sky-600 border-sky-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    navy: "bg-navy/5 text-navy/60 border-navy/10",
    slate: "bg-slate-50 text-slate-600 border-slate-100"
  };
  const colorClasses = colorMap[badgeColor as keyof typeof colorMap] || colorMap.slate;

  return (
    <Card className="rounded-[2.5rem] border border-navy/5 shadow-2xl bg-white overflow-hidden p-8 hover:border-sky-600/30 transition-all duration-500 group/item">
      <div className="flex items-center justify-between gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 mb-2">
            <h3 className="text-xl font-display font-bold text-navy tracking-tight truncate group-hover/item:text-sky-600 transition-colors uppercase">{title}</h3>
            {badgeColor && (
              <span className={`px-4 py-1 rounded-full text-[9px] font-black tracking-widest border transition-all ${colorClasses}`}>
                {subtitle}
              </span>
            )}
          </div>
          {!badgeColor && <p className="text-navy/20 font-black text-[10px] uppercase tracking-widest mt-2">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-navy/40 hover:text-sky-600 hover:bg-sky-50 rounded-2xl h-14 w-14 transition-all"
            onClick={onEdit}
          >
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
};

const Loader = () => (
  <div className="flex items-center justify-center py-20">
    <Loader2 className="w-12 h-12 text-sky-600 animate-spin" />
  </div>
);

export default Admin;
