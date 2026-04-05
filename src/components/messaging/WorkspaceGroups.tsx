import React, { useState, ChangeEvent } from 'react';
import { useWorkspace } from '@/hooks/useWorkspace';
import { Member } from '@/hooks/useAuth';
import { WorkspaceGroup, WorkspacePost } from '@/types/messaging';
import { 
  Plus, Users, MessageCircle, Heart, Share2, 
  Trash2, Search, Filter, Hash, Star, LayoutGrid, Calendar, Pin, PinOff,
  FileText, ExternalLink, Loader2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface WorkspaceGroupsProps {
  currentMember: Member;
}

export default function WorkspaceGroups({ currentMember }: WorkspaceGroupsProps) {
  const { 
    groups, 
    posts, 
    activeGroupId, 
    setActiveGroupId, 
    loading, 
    createPost, 
    deletePost,
    togglePinPost,
    uploadFile,
    createGroup 
  } = useWorkspace(currentMember.id);
  
  const [postInput, setPostInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '', tag: 'Général' });

  const handleCreateGroup = async () => {
    if (newGroup.name.trim()) {
      await createGroup(newGroup.name, newGroup.description, newGroup.tag);
      setNewGroup({ name: '', description: '', tag: 'Général' });
      setIsCreateDialogOpen(false);
    }
  };

  const activeGroup = groups.find(g => g.id === activeGroupId);

  const handleCreatePost = () => {
    if (postInput.trim()) {
      createPost(postInput);
      setPostInput('');
    }
  };

  const onFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const attachment = await uploadFile(file);
    if (attachment) {
      createPost("", attachment);
    }
    setIsUploading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Group Sidebar */}
      <aside className="lg:col-span-1 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display font-bold text-navy tracking-tight uppercase tracking-widest text-xs">Groupes Thématiques</h2>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-sky-50 text-sky-600">
                <Plus className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[2.5rem] border-none shadow-3xl max-w-md p-8 bg-white">
              <DialogHeader>
                <DialogTitle className="text-2xl font-display font-bold text-navy tracking-tight mb-4">Créer un groupe</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest px-1">Nom du groupe</label>
                  <Input 
                    placeholder="Ex: Cardiologie, Coordination..." 
                    className="h-12 rounded-2xl border-navy/5 bg-sky-50/30 font-bold"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest px-1">Description</label>
                  <Input 
                    placeholder="Objectif de ce groupe..." 
                    className="h-12 rounded-2xl border-navy/5 bg-sky-50/30 font-bold"
                    value={newGroup.description}
                    onChange={(e) => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest px-1">Tag (Catégorie)</label>
                  <Input 
                    placeholder="Ex: Médical, Administratif..." 
                    className="h-12 rounded-2xl border-navy/5 bg-sky-50/30 font-bold"
                    value={newGroup.tag}
                    onChange={(e) => setNewGroup(prev => ({ ...prev, tag: e.target.value }))}
                  />
                </div>
                <Button 
                  onClick={handleCreateGroup}
                  disabled={!newGroup.name.trim()}
                  className="w-full bg-navy hover:bg-sky-600 text-white rounded-2xl h-12 font-black shadow-xl transition-all"
                >
                  Créer le groupe
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/30" />
          <Input 
            placeholder="Rechercher un groupe..." 
            className="pl-10 h-12 rounded-2xl border-navy/5 bg-white/80 focus-visible:ring-sky-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-3">
            {groups
              .filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((group) => (
              <button
                key={group.id}
                onClick={() => setActiveGroupId(group.id)}
                className={`w-full text-left p-6 rounded-[2.5rem] transition-all duration-500 relative overflow-hidden group ${
                  activeGroupId === group.id 
                    ? 'bg-navy text-white shadow-2xl shadow-navy/20 active:scale-95' 
                    : 'bg-white hover:bg-sky-50 border border-navy/5 hover:border-sky-600/20'
                }`}
              >
                {activeGroupId === group.id && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                )}
                <div className="relative z-10 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={`rounded-lg uppercase text-[9px] font-black tracking-widest px-2 py-0.5 ${
                      activeGroupId === group.id ? 'border-white/20 text-white' : 'border-sky-600/10 text-sky-600 bg-sky-50'
                    }`}>
                      {group.tag || 'Général'}
                    </Badge>
                    <Hash className={`w-4 h-4 ${activeGroupId === group.id ? 'text-white/20' : 'text-navy/5'}`} />
                  </div>
                  <h3 className="font-bold text-lg tracking-tight leading-none group-hover:translate-x-1 transition-transform">{group.name}</h3>
                  <p className={`text-xs font-medium line-clamp-1 ${activeGroupId === group.id ? 'text-white/40' : 'text-navy/40 italic'}`}>
                    {group.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Main Feed Area */}
      <main className="lg:col-span-3 space-y-8">
        {activeGroupId ? (
          <>
            {/* Group Header & Post Input */}
            <Card className="rounded-[3rem] border border-navy/5 shadow-3xl bg-white overflow-hidden ring-1 ring-navy/[0.02]">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-display font-bold text-navy tracking-tight">{activeGroup?.name}</h2>
                    <p className="text-navy/40 font-medium mt-1 italic text-sm">{activeGroup?.description}</p>
                  </div>
                  <div className="flex -space-x-4">
                    {[1,2,3].map(i => (
                      <Avatar key={i} className="w-10 h-10 border-4 border-white shadow-xl rounded-full">
                        <AvatarFallback className="bg-sky-50 text-sky-600 text-[10px] font-black">+{i}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
                
                <Separator className="bg-navy/5" />
                
                <div className="flex gap-6">
                  <Avatar className="w-14 h-14 rounded-2xl shadow-xl border-2 border-sky-50">
                    <AvatarImage src={currentMember.photo_url} />
                    <AvatarFallback className="bg-sky-100 text-sky-600 font-bold">{currentMember.first_name?.[0]}{currentMember.last_name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-4">
                    <textarea 
                      placeholder={`Partagez quelque chose avec le groupe ${activeGroup?.name}...`}
                      value={postInput}
                      onChange={(e) => setPostInput(e.target.value)}
                      className="w-full min-h-[120px] p-6 rounded-[2rem] bg-sky-50/30 border-none focus:ring-2 ring-sky-500/20 text-navy font-medium placeholder:text-navy/20 resize-none shadow-inner"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <input 
                          type="file" 
                          id="workspace-file-upload" 
                          className="hidden" 
                          onChange={onFileSelect}
                          accept=".pdf,.docx,.jpg,.jpeg,.png"
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          asChild
                          className="rounded-xl text-navy/40 hover:text-navy hover:bg-sky-50 gap-2 cursor-pointer"
                        >
                          <label htmlFor="workspace-file-upload">
                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LayoutGrid className="w-4 h-4" />} Media
                          </label>
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-xl text-navy/40 hover:text-navy hover:bg-sky-50 gap-2">
                          <Calendar className="w-4 h-4" /> Événement
                        </Button>
                      </div>
                      <Button 
                        onClick={handleCreatePost}
                        disabled={!postInput.trim() && !isUploading}
                        className="bg-sky-600 hover:bg-navy text-white rounded-[1.5rem] px-8 h-12 font-black shadow-xl shadow-sky-600/10 transition-all hover:scale-105"
                      >
                        Publier
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

             {/* Posts List */}
             <div className="space-y-8">
               {posts.map((post) => (
                 <Card key={post.id} className={`rounded-[3rem] border shadow-2xl overflow-hidden transition-all hover:shadow-sky-600/10 hover:border-sky-600/20 group/post relative ${
                   post.is_pinned ? 'bg-sky-50/40 border-sky-600/30 ring-1 ring-sky-600/10' : 'bg-white border-navy/5'
                 }`}>
                   {post.is_pinned && (
                     <div className="absolute top-6 right-10 flex items-center gap-2">
                       <Badge className="bg-sky-600 text-white border-none text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                         Épinglé
                       </Badge>
                     </div>
                   )}
                   <CardContent className="p-8 md:p-10">
                    <div className="flex items-start justify-between gap-6 mb-8">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-14 h-14 rounded-2xl shadow-lg border-2 border-sky-50">
                          <AvatarImage src={post.author?.photo_url} />
                          <AvatarFallback className="bg-sky-50 text-sky-600 font-bold">
                            {post.author?.first_name?.[0]}{post.author?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-navy text-lg leading-none">{post.author?.title} {post.author?.first_name} {post.author?.last_name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest">{post.author?.specialty}</span>
                            <span className="w-1 h-1 bg-navy/10 rounded-full" />
                            <span className="text-[10px] font-black text-navy/20 uppercase tracking-widest">
                              {format(new Date(post.created_at), "d MMMM 'à' HH:mm", { locale: fr })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover/post:opacity-100 transition-all">
                        <Button 
                          onClick={() => togglePinPost(post.id, !!post.is_pinned)}
                          variant="ghost" 
                          size="icon" 
                          className={`rounded-xl transition-all ${
                            post.is_pinned ? 'text-sky-600 bg-sky-100' : 'text-navy/10 hover:text-sky-600 hover:bg-sky-50'
                          }`}
                        >
                          {post.is_pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                        </Button>
                        {post.author_id === currentMember.id && (
                          <Button 
                            onClick={() => deletePost(post.id)}
                            variant="ghost" 
                            size="icon" 
                            className="rounded-xl text-navy/10 hover:text-red-500 hover:bg-red-50 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-navy text-lg leading-relaxed font-normal p-6 bg-sky-50/30 rounded-[2rem] border border-sky-600/5 mb-8">
                      {post.content}

                      {post.attachment_url && (
                        <div className="mt-6">
                           {post.attachment_type?.startsWith('image/') ? (
                            <div className="relative group/postimg cursor-pointer" onClick={() => window.open(post.attachment_url, '_blank')}>
                              <img 
                                src={post.attachment_url} 
                                alt={post.attachment_name} 
                                className="max-h-[400px] rounded-[2rem] border border-navy/5 shadow-xl transition-all group-hover/postimg:brightness-90"
                              />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/postimg:opacity-100 transition-opacity">
                                <ExternalLink className="w-10 h-10 text-white drop-shadow-2xl" />
                              </div>
                            </div>
                          ) : (
                            <a 
                              href={post.attachment_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-6 p-6 rounded-[2rem] bg-white border border-navy/5 hover:border-sky-600/20 hover:shadow-xl transition-all group/file"
                            >
                              <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center group-hover/file:bg-sky-600 group-hover/file:text-white transition-colors">
                                <FileText className="w-8 h-8" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-navy truncate uppercase tracking-widest">{post.attachment_name}</p>
                                <p className="text-[10px] text-navy/40 font-black mt-1">CLIQUEZ POUR CONSULTER LE DOCUMENT</p>
                              </div>
                              <ExternalLink className="w-6 h-6 text-navy/10" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-navy/5">
                      <div className="flex gap-8">
                        <button className="flex items-center gap-3 text-navy/30 hover:text-sky-600 transition-colors group/action">
                          <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover/action:bg-sky-50 transition-colors">
                            <Heart className="w-5 h-5 group-hover/action:scale-110 transition-transform" />
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest">Aimer</span>
                        </button>
                        <button className="flex items-center gap-3 text-navy/30 hover:text-sky-600 transition-colors group/action">
                          <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover/action:bg-sky-50 transition-colors">
                            <MessageCircle className="w-5 h-5 group-hover/action:scale-110 transition-transform" />
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest">Commenter</span>
                        </button>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-xl text-navy/20">
                        <Share2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {posts.length === 0 && (
                <div className="p-24 text-center space-y-4">
                  <div className="w-20 h-20 bg-sky-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 opacity-40">
                    <Hash className="w-10 h-10 text-sky-600" />
                  </div>
                  <p className="text-navy/20 font-bold italic text-lg uppercase tracking-widest">Aucune publication pour le moment</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="h-[600px] flex flex-col items-center justify-center text-center space-y-8 bg-sky-50/10 rounded-[4rem] border-2 border-dashed border-navy/5">
            <div className="w-40 h-40 bg-white rounded-[3.5rem] flex items-center justify-center shadow-3xl border border-sky-100 animate-pulse">
              <Users className="w-20 h-20 text-sky-600" strokeWidth={1} />
            </div>
            <div className="max-w-md px-8">
              <h3 className="text-3xl font-display font-bold text-navy tracking-tight">Espace Collaboratif</h3>
              <p className="text-navy/40 text-lg mt-4 leading-relaxed font-medium italic">Rejoignez un groupe de travail thématique pour échanger avec vos pairs et partager vos expériences.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
