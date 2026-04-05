import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { motion } from "framer-motion";
import {
  Shield, Users, Heart, CheckCircle2, ArrowRight, Mail, Phone, HelpCircle,
  Sparkles, LogOut, Loader2, User, BookOpen, Newspaper, FileText,
  Eye, EyeOff, Clock, XCircle, Save, Home, MessageSquare, LayoutDashboard
} from "lucide-react";
import MessagingCenter from "@/components/messaging/MessagingCenter";
import WorkspaceGroups from "@/components/messaging/WorkspaceGroups";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { useAuth, type Member } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

const titles = ["Dr.", "Pr.", "Mme.", "M.", "Mlle.", "Me."];

const avantages = [
  { icon: Users, title: "Réseau professionnel", description: "Intégrez un réseau de professionnels de santé engagés pour améliorer le parcours de soins au quotidien." },
  { icon: Shield, title: "Formations exclusives", description: "Accédez à des formations continues et des webinaires exclusifs gratuits, réservés à nos membres." },
  { icon: Heart, title: "Coordination de pointe", description: "Bénéficiez d'outils de coordination et de protocoles partagés pour une prise en charge optimale." },
];

const faq = [
  { q: "Qui peut adhérer à la CPTS Lyon 3 ?", a: "Tous les professionnels de santé exerçant sur le territoire de Lyon 3ème (libéraux, salariés de structures de soins, etc.) peuvent adhérer à la CPTS." },
  { q: "Comment fonctionne l'adhésion ?", a: "Il suffit de remplir le formulaire d'adhésion et de régler la cotisation annuelle. Vous recevrez ensuite vos accès à l'espace adhérent en ligne." },
  { q: "Quels sont les engagements de l'adhérent ?", a: "L'adhérent s'engage à respecter la charte de la CPTS, à participer aux réunions plénières (au moins une par an) et à contribuer à la coordination des soins sur le territoire." },
  { q: "Puis-je résilier mon adhésion ?", a: "Oui, vous pouvez résilier votre adhésion à tout moment par courrier ou email. La cotisation de l'année en cours n'est pas remboursable." },
];

const includes = [
  "Accès à l'annuaire des adhérents", "Formations et webinaires offerts",
  "Outils de coordination avancés", "Newsletter confidentielle mensuelle",
  "Intégration aux groupes de travail", "Droits de vote aux assemblées",
  "Protocoles pluriprofessionnels", "Accompagnement administratif dédié",
];

// ===========================
// MAIN COMPONENT
// ===========================
const EspaceAdherent = () => {
  const { user, member, loading, isApproved, isPending, isRejected, signUp, signIn, signOut, updateProfile } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-sky-600 animate-spin" />
      </div>
    );
  }

  // STATE 3: Approved member dashboard
  if (user && member && isApproved) {
    return <MemberDashboard member={member} onSignOut={signOut} onUpdateProfile={updateProfile} />;
  }

  // STATE 2: Pending / Rejected
  if (user && member && (isPending || isRejected)) {
    return <PendingScreen member={member} isPending={isPending} onSignOut={signOut} />;
  }

  // STATE 1: Not logged in — marketing + auth forms
  return <PublicPage onSignUp={signUp} onSignIn={signIn} />;
};

// ===========================
// STATE 1: PUBLIC PAGE
// ===========================
const PublicPage = ({ onSignUp, onSignIn }: { onSignUp: any; onSignIn: any }) => {
  const { toast } = useToast();
  const [authTab, setAuthTab] = useState("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    email: "", password: "", confirmPassword: "",
    title: "Dr.", first_name: "", last_name: "", specialty: "",
    public_phone: "", private_phone: "", address: "",
  });

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      toast({ variant: "destructive", title: "Erreur", description: "Veuillez remplir tous les champs." });
      return;
    }
    setIsSubmitting(true);
    try {
      await onSignIn(loginForm.email, loginForm.password);
      toast({ title: "Connexion réussie", description: "Bienvenue dans votre espace adhérent !" });
    } catch (err: any) {
      const msg = err.message?.includes("Email ou mot de passe incorrect") ? "Email ou mot de passe incorrect." 
        : err.message;
      toast({ variant: "destructive", title: "Erreur de connexion", description: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async () => {
    if (!registerForm.email || !registerForm.password || !registerForm.first_name || !registerForm.last_name || !registerForm.specialty) {
      toast({ variant: "destructive", title: "Champs requis", description: "Veuillez remplir au minimum : email, mot de passe, prénom, nom et spécialité." });
      return;
    }
    if (registerForm.password.length < 6) {
      toast({ variant: "destructive", title: "Mot de passe trop court", description: "Le mot de passe doit contenir au moins 6 caractères." });
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({ variant: "destructive", title: "Erreur", description: "Les mots de passe ne correspondent pas." });
      return;
    }
    setIsSubmitting(true);
    try {
      const { title, first_name, last_name, specialty, public_phone, private_phone, address } = registerForm;
      await onSignUp(registerForm.email, registerForm.password, {
        title, first_name, last_name, specialty, public_phone, private_phone, address,
      });
      toast({ title: "Demande envoyée !", description: "Votre compte a été créé. Il est maintenant en attente de validation par un administrateur." });
      // No need to setAuthTab("login") because useAuth now logs them in immediately
    } catch (err: any) {
      toast({ variant: "destructive", title: "Erreur", description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = "h-14 rounded-2xl border-navy/5 bg-sky-50/30 font-bold text-navy focus-visible:ring-sky-500/20";
  const labelCls = "text-[10px] font-black uppercase tracking-widest text-navy/30 px-2";

  return (
    <div className="min-h-screen bg-background text-base">
      <Header />
      <main>
        <PageBanner title="Espace Adhérent" subtitle="Rejoignez la communauté des professionnels de santé de Lyon 3 et participez à la coordination des soins." />

        {/* AUTH SECTION */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
          <div className="container max-w-xl relative z-10">
            <Card className="rounded-[3rem] border border-navy/5 shadow-3xl bg-white overflow-hidden">
              <CardContent className="p-0">
                <Tabs value={authTab} onValueChange={setAuthTab}>
                  <TabsList className="w-full h-auto bg-sky-50/50 p-2 rounded-none border-b border-navy/5 grid grid-cols-2 gap-2">
                    <TabsTrigger value="login" className="h-14 rounded-2xl font-black text-sm data-[state=active]:bg-navy data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">Connexion</TabsTrigger>
                    <TabsTrigger value="register" className="h-14 rounded-2xl font-black text-sm data-[state=active]:bg-sky-600 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">Inscription</TabsTrigger>
                  </TabsList>

                  {/* LOGIN */}
                  <TabsContent value="login" className="p-8 md:p-12 space-y-6 mt-0">
                    <div className="text-center mb-4">
                      <h3 className="text-2xl font-display font-bold text-navy tracking-tight">Connexion Adhérent</h3>
                      <p className="text-navy/40 text-sm mt-2 italic">Accédez à votre espace personnel</p>
                    </div>
                    <div className="space-y-2"><Label className={labelCls}>Email</Label><Input value={loginForm.email} onChange={(e) => setLoginForm({...loginForm, email: e.target.value})} placeholder="votre@email.fr" type="email" className={inputCls} /></div>
                    <div className="space-y-2">
                      <Label className={labelCls}>Mot de passe</Label>
                      <div className="relative">
                        <Input value={loginForm.password} onChange={(e) => setLoginForm({...loginForm, password: e.target.value})} type={showPassword ? "text" : "password"} placeholder="••••••••" className={inputCls + " pr-12"} onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/30 hover:text-navy/60 transition-colors">
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <Button onClick={handleLogin} disabled={isSubmitting} className="w-full h-14 rounded-2xl bg-navy hover:bg-sky-600 text-white font-black text-base shadow-xl transition-all">
                      {isSubmitting && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                      Se connecter
                    </Button>
                  </TabsContent>

                  {/* REGISTER */}
                  <TabsContent value="register" className="p-8 md:p-12 space-y-6 mt-0">
                    <div className="text-center mb-4">
                      <h3 className="text-2xl font-display font-bold text-navy tracking-tight">Demande d'adhésion</h3>
                      <p className="text-navy/40 text-sm mt-2 italic">Remplissez vos coordonnées professionnelles</p>
                    </div>

                    <div className="space-y-2"><Label className={labelCls}>Email *</Label><Input value={registerForm.email} onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})} placeholder="votre@email.fr" type="email" className={inputCls} /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className={labelCls}>Mot de passe *</Label>
                        <div className="relative">
                          <Input value={registerForm.password} onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})} type={showPassword ? "text" : "password"} placeholder="Min. 6 caractères" className={inputCls + " pr-12"} />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/30 hover:text-navy/60 transition-colors">
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className={labelCls}>Confirmer *</Label>
                        <div className="relative">
                          <Input value={registerForm.confirmPassword} onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})} type={showPassword ? "text" : "password"} placeholder="Confirmez" className={inputCls + " pr-12"} />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/30 hover:text-navy/60 transition-colors">
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-navy/10 to-transparent my-4" />

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className={labelCls}>Titre</Label>
                        <Select value={registerForm.title} onValueChange={(val) => setRegisterForm({...registerForm, title: val})}>
                          <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
                          <SelectContent className="rounded-2xl">{titles.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2"><Label className={labelCls}>Prénom *</Label><Input value={registerForm.first_name} onChange={(e) => setRegisterForm({...registerForm, first_name: e.target.value})} placeholder="Jean" className={inputCls} /></div>
                      <div className="space-y-2"><Label className={labelCls}>Nom *</Label><Input value={registerForm.last_name} onChange={(e) => setRegisterForm({...registerForm, last_name: e.target.value})} placeholder="DUPONT" className={inputCls} /></div>
                    </div>
                    <div className="space-y-2"><Label className={labelCls}>Spécialité / Profession *</Label><Input value={registerForm.specialty} onChange={(e) => setRegisterForm({...registerForm, specialty: e.target.value})} placeholder="Médecin Généraliste, Infirmier..." className={inputCls} /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label className={labelCls}>Tél. Public</Label><Input value={registerForm.public_phone} onChange={(e) => setRegisterForm({...registerForm, public_phone: e.target.value})} placeholder="01 23 45 67 89" className={inputCls} /></div>
                      <div className="space-y-2"><Label className={labelCls}>Tél. Privé</Label><Input value={registerForm.private_phone} onChange={(e) => setRegisterForm({...registerForm, private_phone: e.target.value})} placeholder="06 12 34 56 78" className={inputCls} /></div>
                    </div>
                    <div className="space-y-2"><Label className={labelCls}>Adresse professionnelle</Label><Input value={registerForm.address} onChange={(e) => setRegisterForm({...registerForm, address: e.target.value})} placeholder="24 rue Barrier, 69003 Lyon" className={inputCls} /></div>

                    <Button onClick={handleRegister} disabled={isSubmitting} className="w-full h-14 rounded-2xl bg-sky-600 hover:bg-navy text-white font-black text-base shadow-xl transition-all">
                      {isSubmitting && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                      Envoyer ma demande d'adhésion
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* MARKETING SECTIONS (same as before) */}
        <MarketingSections />
      </main>
      <Footer />
    </div>
  );
};

// ===========================
// STATE 2: PENDING SCREEN
// ===========================
const PendingScreen = ({ member, isPending, onSignOut }: { member: Member; isPending: boolean; onSignOut: () => void }) => (
  <div className="min-h-screen bg-background text-base">
    <Header />
    <main>
      <PageBanner title="Espace Adhérent" subtitle="Votre demande d'adhésion" />
      <section className="py-24">
        <div className="container max-w-2xl">
          <Card className="rounded-[3rem] border border-navy/5 shadow-3xl bg-white overflow-hidden">
            <CardContent className="p-12 md:p-16 text-center">
              {isPending ? (
                <>
                  <div className="w-24 h-24 bg-amber-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl border border-amber-100">
                    <Clock className="w-12 h-12 text-amber-500" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-navy tracking-tight mb-4">Demande en cours de validation</h2>
                  <p className="text-navy/40 text-lg italic leading-relaxed mb-8">Votre demande d'adhésion a bien été reçue. L'équipe CPTS Lyon 3 va la examiner et vous serez notifié par email une fois approuvé.</p>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl border border-red-100">
                    <XCircle className="w-12 h-12 text-red-500" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-navy tracking-tight mb-4">Demande refusée</h2>
                  <p className="text-navy/40 text-lg italic leading-relaxed mb-8">Votre demande d'adhésion n'a pas été retenue. Pour plus d'informations, contactez-nous à cptslyon3@gmail.com.</p>
                </>
              )}
              <div className="bg-sky-50/50 rounded-[2rem] p-8 text-left space-y-3 mb-8 border border-sky-100">
                <p className="text-xs font-black uppercase tracking-widest text-navy/30 mb-4">Votre profil soumis</p>
                <p className="text-navy font-bold">{member.title} {member.first_name} {member.last_name}</p>
                <p className="text-navy/50">{member.specialty}</p>
                <p className="text-navy/50">{member.email}</p>
                {member.address && <p className="text-navy/50">{member.address}</p>}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.location.reload()} 
                  className="h-14 rounded-2xl px-10 font-black bg-sky-600 hover:bg-navy text-white shadow-xl transition-all"
                >
                  <Clock className="w-5 h-5 mr-2" /> Vérifier mon statut
                </Button>
                <Button onClick={onSignOut} variant="outline" className="h-14 rounded-2xl px-10 font-bold border-navy/10 text-navy hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all">
                  <LogOut className="w-4 h-4 mr-2" /> Déconnexion
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

// ===========================
// STATE 3: MEMBER DASHBOARD
// ===========================
const MemberDashboard = ({ member, onSignOut, onUpdateProfile }: { member: Member; onSignOut: () => void; onUpdateProfile: (u: any) => Promise<void> }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("home");
  const [editForm, setEditForm] = useState({
    title: member.title || "", first_name: member.first_name || "", last_name: member.last_name || "",
    specialty: member.specialty || "", public_phone: member.public_phone || "", private_phone: member.private_phone || "", address: member.address || "",
  });
  const [isSaving, setIsSaving] = useState(false);



  const { data: news } = useQuery({
    queryKey: ["member_news"],
    queryFn: async () => {
      const { data, error } = await supabase.from("news").select("*").order("published_at", { ascending: false }).limit(10);
      if (error) throw error;
      return data;
    },
  });

  const { data: resources } = useQuery({
    queryKey: ["member_resources"],
    queryFn: async () => {
      const { data, error } = await supabase.from("resources").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await onUpdateProfile(editForm);
      toast({ 
        title: "Profil mis à jour", 
        description: "Vos modifications ont été enregistrées avec succès.",
        className: "bg-emerald-50 border-emerald-200 text-emerald-800 rounded-2xl"
      });
    } catch (err: any) {
      toast({ 
        variant: "destructive", 
        title: "Erreur", 
        description: err.message,
        className: "rounded-2xl"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const sidebarItems = [
    { value: "home", label: "Accueil", icon: Home },
    { value: "messaging", label: "Messages", icon: MessageSquare },
    { value: "workspace", label: "Groupes", icon: LayoutDashboard },
    { value: "profile", label: "Mon profil", icon: User },
    { value: "resources", label: "Ressources", icon: FileText },
    { value: "news", label: "Actualités", icon: Newspaper },
  ];

  const inputCls = "h-14 rounded-2xl border-navy/5 bg-sky-50/30 font-bold text-navy focus-visible:ring-sky-500/20";
  const labelCls = "text-[10px] font-black uppercase tracking-widest text-navy/30 px-2";

  return (
    <div className="min-h-screen bg-background text-base">
      <Header />
      <main>
        <PageBanner title={`Bienvenue, ${member.first_name || "Adhérent"}`} subtitle="Votre espace personnel CPTS Lyon 3" />
        <section className="py-16">
          <div className="container max-w-7xl">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col lg:flex-row gap-10">
                <aside className="lg:w-72 shrink-0">
                  <div className="sticky top-32 space-y-4">
                    <TabsList className="flex flex-col h-auto bg-white/40 backdrop-blur-3xl p-4 rounded-[3rem] border border-white/50 shadow-3xl shadow-navy/[0.02] gap-3 w-full">
                      {sidebarItems.map((tab) => (
                        <TabsTrigger key={tab.value} value={tab.value} className="w-full flex items-center justify-start gap-4 px-6 py-4 rounded-[2rem] text-navy/40 data-[state=active]:bg-navy data-[state=active]:text-white data-[state=active]:shadow-2xl transition-all font-black text-xs uppercase tracking-widest">
                          <tab.icon className="w-5 h-5" />
                          {tab.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <Button onClick={onSignOut} variant="ghost" className="w-full h-14 rounded-[2rem] text-red-400 hover:text-red-600 hover:bg-red-50 font-black text-xs uppercase tracking-widest flex items-center gap-4 transition-all">
                      <LogOut className="w-5 h-5" /> Déconnexion
                    </Button>
                  </div>
                </aside>

                <div className="flex-1 min-w-0">
                  {/* HOME */}
                  <TabsContent value="home" className="mt-0">
                    <Card className="rounded-[3rem] border border-navy/5 shadow-3xl bg-white p-12">
                      <div className="flex items-center gap-6 mb-8">
                        <div className="w-20 h-20 bg-sky-50 rounded-[2rem] flex items-center justify-center shadow-xl border border-sky-100">
                          <User className="w-10 h-10 text-sky-600" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-display font-bold text-navy tracking-tight">{member.title} {member.first_name} {member.last_name}</h2>
                          <p className="text-navy/40 font-bold italic">{member.specialty}</p>
                        </div>
                      </div>

                    </Card>
                  </TabsContent>

                  {/* MESSAGING */}
                  <TabsContent value="messaging" className="mt-0">
                    <MessagingCenter currentMember={member} />
                  </TabsContent>

                  {/* WORKSPACE */}
                  <TabsContent value="workspace" className="mt-0">
                    <WorkspaceGroups currentMember={member} />
                  </TabsContent>

                  {/* PROFILE */}
                  <TabsContent value="profile" className="mt-0">
                    <Card className="rounded-[3rem] border border-navy/5 shadow-3xl bg-white p-12">
                      <h2 className="text-3xl font-display font-bold text-navy tracking-tight mb-8">Mon Profil</h2>
                      <div className="grid gap-6">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className={labelCls}>Titre</Label>
                            <Select value={editForm.title} onValueChange={(v) => setEditForm({...editForm, title: v})}>
                              <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
                              <SelectContent className="rounded-2xl">{titles.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2"><Label className={labelCls}>Prénom</Label><Input value={editForm.first_name} onChange={(e) => setEditForm({...editForm, first_name: e.target.value})} className={inputCls} /></div>
                          <div className="space-y-2"><Label className={labelCls}>Nom</Label><Input value={editForm.last_name} onChange={(e) => setEditForm({...editForm, last_name: e.target.value})} className={inputCls} /></div>
                        </div>
                        <div className="space-y-2"><Label className={labelCls}>Spécialité</Label><Input value={editForm.specialty} onChange={(e) => setEditForm({...editForm, specialty: e.target.value})} className={inputCls} /></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2"><Label className={labelCls}>Tél. Public</Label><Input value={editForm.public_phone} onChange={(e) => setEditForm({...editForm, public_phone: e.target.value})} className={inputCls} /></div>
                          <div className="space-y-2"><Label className={labelCls}>Tél. Privé</Label><Input value={editForm.private_phone} onChange={(e) => setEditForm({...editForm, private_phone: e.target.value})} className={inputCls} /></div>
                        </div>
                        <div className="space-y-2"><Label className={labelCls}>Adresse</Label><Input value={editForm.address} onChange={(e) => setEditForm({...editForm, address: e.target.value})} className={inputCls} /></div>
                        <Button onClick={handleSaveProfile} disabled={isSaving} className="h-14 rounded-2xl bg-navy hover:bg-sky-600 text-white font-black shadow-xl transition-all w-full md:w-auto md:px-12">
                          {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                          Enregistrer
                        </Button>
                      </div>
                    </Card>
                  </TabsContent>



                  {/* RESOURCES */}
                  <TabsContent value="resources" className="mt-0">
                    <h2 className="text-3xl font-display font-bold text-navy tracking-tight mb-8">Ressources</h2>
                    <div className="grid gap-4">
                      {resources?.map((r: any) => (
                        <Card key={r.id} className="rounded-[2rem] border border-navy/5 shadow-xl bg-white p-6 hover:border-sky-600/20 transition-all">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center border border-sky-100">
                                <FileText className="w-6 h-6 text-sky-600" />
                              </div>
                              <div>
                                <p className="font-bold text-navy">{r.title}</p>
                                {r.description && <p className="text-navy/40 text-sm">{r.description}</p>}
                              </div>
                            </div>
                            <Button asChild variant="ghost" className="rounded-xl text-sky-600 hover:bg-sky-50">
                              <a href={r.url} target="_blank" rel="noopener noreferrer"><BookOpen className="w-4 h-4" /></a>
                            </Button>
                          </div>
                        </Card>
                      ))}
                      {(!resources || resources.length === 0) && (
                        <div className="p-16 text-center bg-white/40 rounded-[3rem] border border-navy/5">
                          <FileText className="w-12 h-12 text-navy/10 mx-auto mb-4" />
                          <p className="text-navy/20 font-bold italic">Aucune ressource disponible.</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* NEWS */}
                  <TabsContent value="news" className="mt-0">
                    <h2 className="text-3xl font-display font-bold text-navy tracking-tight mb-8">Actualités</h2>
                    <div className="grid gap-4">
                      {news?.map((n: any) => (
                        <Card key={n.id} className="rounded-[2rem] border border-navy/5 shadow-xl bg-white p-6 hover:border-sky-600/20 transition-all">
                          <div className="flex items-start gap-4">
                            {n.image_url && <img src={n.image_url} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0" />}
                            <div>
                              <p className="font-display font-bold text-navy text-lg tracking-tight">{n.title}</p>
                              {n.excerpt && <p className="text-navy/40 text-sm mt-1">{n.excerpt}</p>}
                              <p className="text-[10px] font-black uppercase tracking-widest text-navy/20 mt-2">{new Date(n.published_at).toLocaleDateString("fr-FR")}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                      {(!news || news.length === 0) && (
                        <div className="p-16 text-center bg-white/40 rounded-[3rem] border border-navy/5">
                          <Newspaper className="w-12 h-12 text-navy/10 mx-auto mb-4" />
                          <p className="text-navy/20 font-bold italic">Aucune actualité pour le moment.</p>
                        </div>
                      )}
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

// ===========================
// MARKETING SECTIONS (reused from original)
// ===========================
const MarketingSections = () => (
  <>
    {/* Avantages */}
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-sky-500/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="container max-w-6xl relative z-10">
        <div className="text-center mb-24">
          <span className="px-5 py-2 rounded-full bg-sky-50 text-sky-700 font-black text-[10px] uppercase tracking-[0.3em] border border-sky-600/10 mb-8 inline-block shadow-sm">Privilèges Adhérents</span>
          <h2 className="text-4xl md:text-7xl font-display font-bold text-navy mb-8 tracking-tighter leading-tight">Pourquoi adhérer ?</h2>
          <p className="text-navy/40 text-xl max-w-3xl mx-auto font-medium leading-relaxed italic">Rejoignez une organisation dynamique pour transformer l'offre de soins de notre territoire.</p>
        </div>
        <div className="grid gap-12 md:grid-cols-3">
          {avantages.map((a, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7 }}>
              <Card className="rounded-[3rem] border border-navy/5 shadow-3xl shadow-navy/[0.03] hover:shadow-sky-600/20 hover:border-sky-600/30 transition-all duration-700 h-full flex flex-col items-center text-center p-12 group bg-white relative overflow-hidden group/card">
                <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover/card:scale-150 transition-transform duration-1000" />
                <CardHeader className="p-0 mb-12 relative z-10">
                  <div className="w-24 h-24 rounded-[2.2rem] bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 group-hover/card:bg-sky-600 group-hover/card:text-white transition-all duration-700 shadow-2xl shadow-sky-600/5 group-hover/card:rotate-6">
                    <a.icon className="w-12 h-12" strokeWidth={1} />
                  </div>
                </CardHeader>
                <CardContent className="p-0 relative z-10">
                  <CardTitle className="text-2xl font-display font-bold text-navy mb-6 group-hover/card:text-sky-600 transition-all tracking-tight uppercase leading-tight">{a.title}</CardTitle>
                  <CardDescription className="text-navy/40 font-medium leading-relaxed italic text-lg">"{a.description}"</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Pricing */}
    <section className="py-32 bg-[#0F1C2E] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(2,132,199,0.1),transparent)] pointer-events-none" />
      <div className="container max-w-4xl relative z-10 text-center">
        <span className="px-5 py-2 rounded-full bg-white/5 text-sky-400 font-black text-[10px] uppercase tracking-[0.3em] border border-white/10 mb-10 inline-block shadow-sm">Engagement Annuel</span>
        <h2 className="text-4xl md:text-8xl font-display font-bold mb-20 tracking-tighter leading-tight">Cotisation unique</h2>
        <Card className="rounded-[4rem] border border-white/5 bg-white text-navy p-4 shadow-3xl overflow-hidden group/price ring-1 ring-white/10">
          <CardContent className="p-14 md:p-24 relative">
            <div className="flex flex-col items-center gap-12">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-3 bg-sky-50 px-6 py-2 rounded-full mb-8 border border-sky-600/10 text-sky-700 font-black text-[10px] uppercase tracking-widest shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />Tarif Préférentiel
                </div>
                <span className="text-2xl md:text-4xl font-display font-bold text-navy/40 tracking-tight mb-4">Tous les professionnels de santé</span>
                <div className="flex items-baseline gap-6">
                  <span className="text-7xl md:text-[10rem] font-display font-black text-navy leading-none tracking-tighter group-hover/price:text-sky-600 transition-colors duration-700">10 €</span>
                  <span className="text-navy/20 font-black uppercase text-sm tracking-[0.3em] border-l border-navy/10 pl-6 h-10 flex items-center">an / ttc</span>
                </div>
              </div>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-navy/10 to-transparent" />
              <div className="flex flex-col items-center w-full">
                <div className="mt-8 flex flex-wrap justify-center gap-12 font-black tracking-[0.3em] text-[10px] uppercase text-navy/30">
                  <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shadow-lg"><Mail className="w-5 h-5" /></div>cptslyon3@gmail.com</div>
                  <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shadow-lg"><Phone className="w-5 h-5" /></div>07 45 28 16 26</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>

    {/* Includes */}
    <section className="py-32 relative overflow-hidden">
      <div className="container max-w-5xl relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-7xl font-display font-bold text-navy tracking-tighter leading-tight">Ce qui est inclus</h2>
          <p className="text-navy/40 font-medium mt-8 text-xl italic max-w-2xl mx-auto leading-relaxed">Des services et ressources conçus pour valoriser et accompagner votre engagement professionnel.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {includes.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.6 }} className="flex items-center gap-8 p-10 rounded-[2.5rem] bg-white border border-navy/5 shadow-2xl shadow-navy/[0.02] hover:border-sky-600/30 group/item transition-all duration-700 relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 group-hover/item:bg-sky-600 group-hover/item:text-white transition-all duration-500 shadow-xl shadow-sky-600/5">
                <CheckCircle2 className="w-7 h-7" strokeWidth={2.5} />
              </div>
              <span className="text-navy font-display font-bold text-xl group-hover/item:text-sky-600 transition-colors tracking-tight">{item}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* FAQ */}
    <section className="py-32 bg-sky-50/30 relative overflow-hidden">
      <div className="container max-w-4xl relative z-10 px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="text-center mb-24">
          <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-3xl border border-sky-100 ring-4 ring-sky-50">
            <HelpCircle className="w-12 h-12 text-sky-600" strokeWidth={1} />
          </div>
          <h2 className="text-4xl md:text-7xl font-display font-bold text-navy tracking-tighter leading-tight">Questions fréquentes</h2>
        </motion.div>
        <Accordion type="single" collapsible className="space-y-10">
          {faq.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-none">
              <AccordionTrigger className="bg-white px-12 py-12 rounded-[3rem] text-left text-navy font-display font-bold text-xl md:text-3xl hover:no-underline hover:shadow-3xl hover:shadow-sky-600/10 transition-all duration-700 data-[state=open]:rounded-b-none data-[state=open]:shadow-3xl data-[state=open]:shadow-sky-600/10 tracking-tighter leading-tight decoration-transparent group">
                <span className="group-hover:text-sky-600 transition-colors">{item.q}</span>
              </AccordionTrigger>
              <AccordionContent className="bg-white px-12 pb-14 pt-4 rounded-b-[3rem] text-navy/40 text-xl md:text-2xl font-medium leading-relaxed italic border-t border-navy/5">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  </>
);

export default EspaceAdherent;
