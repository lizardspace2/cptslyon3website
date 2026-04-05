import React, { useState, ChangeEvent } from 'react';
import { useMessaging } from '@/hooks/useMessaging';
import { Member } from '@/hooks/useAuth';
import { MessagingRoom, MessagingMessage } from '@/types/messaging';
import { 
  Search, Send, MessageSquare, User, Trash2, 
  MoreVertical, Hash, Smile, Paperclip, Loader2, Plus, 
  FileText, ExternalLink, Download, Image as ImageIcon,
  Pencil, Check, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MessagingCenterProps {
  currentMember: Member;
}

const COMMON_EMOJIS = ["😊", "😂", "👍", "🙌", "👋", "🏥", "🩺", "💉", "💊", "🚑", "🤝", "✨"];

export default function MessagingCenter({ currentMember }: MessagingCenterProps) {
  const { 
    rooms, 
    messages, 
    activeRoomId, 
    setActiveRoomId, 
    loading, 
    onlineMembers,
    typingMembers,
    sendMessage, 
    deleteMessage,
    editMessage,
    createDirectMessage,
    sendTyping,
    uploadFile
  } = useMessaging(currentMember.id);
  
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [memberSearch, setMemberSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  const activeRoom = rooms.find(r => r.id === activeRoomId);

  const fetchMembers = async () => {
    const { data } = await supabase
      .from('members')
      .select('*')
      .eq('status', 'approved')
      .neq('id', currentMember.id);
    if (data) setAllMembers(data as any);
  };

  const handleEditMessage = async (id: string) => {
    if (editingContent.trim()) {
      await editMessage(id, editingContent);
      setEditingMessageId(null);
      setEditingContent('');
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput('');
      sendTyping(false);
    }
  };

  const handleInputChange = (val: string) => {
    setMessageInput(val);
    if (val.length > 0) {
      sendTyping(true);
    } else {
      sendTyping(false);
    }
  };

  const onFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const attachment = await uploadFile(file);
    if (attachment) {
      sendMessage("", attachment);
    }
    setIsUploading(false);
  };

  const addEmoji = (emoji: string) => {
    if (editingMessageId) {
      setEditingContent(prev => prev + emoji);
    } else {
      setMessageInput(prev => prev + emoji);
    }
  };

  return (
    <div className="flex h-[700px] bg-white rounded-[3rem] border border-navy/5 shadow-3xl overflow-hidden ring-1 ring-navy/[0.02]">
      {/* Sidebar: Rooms List */}
      <aside className="w-80 border-r border-navy/5 flex flex-col bg-sky-50/20">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-navy tracking-tight">Messages</h2>
            <Dialog open={isSearchOpen} onOpenChange={(open) => {
              setIsSearchOpen(open);
              if (open) fetchMembers();
            }}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white text-sky-600">
                  <Plus className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-[2.5rem] border-none shadow-3xl max-w-md p-8 bg-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-display font-bold text-navy tracking-tight mb-4">Nouvelle conversation</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/30" />
                    <Input 
                      placeholder="Rechercher un confrère..." 
                      className="pl-10 h-12 rounded-2xl border-navy/5 bg-sky-50/30 font-bold"
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                    />
                  </div>
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-2">
                       {allMembers
                        .filter(m => `${m.first_name} ${m.last_name}`.toLowerCase().includes(memberSearch.toLowerCase()))
                        .map(member => (
                        <button
                          key={member.id}
                          onClick={() => {
                            createDirectMessage(member.id);
                            setIsSearchOpen(false);
                          }}
                          className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-sky-50 transition-all text-left"
                        >
                          <Avatar className="w-10 h-10 rounded-xl">
                            <AvatarImage src={member.photo_url} />
                            <AvatarFallback className="bg-sky-100 text-sky-600 font-bold">{member.first_name?.[0]}{member.last_name?.[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-navy text-sm">{member.title} {member.first_name} {member.last_name}</p>
                            <p className="text-[10px] text-navy/40 font-medium uppercase tracking-widest">{member.specialty}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/30" />
            <Input 
              placeholder="Rechercher..." 
              className="pl-10 h-11 rounded-2xl border-navy/5 bg-white/80 focus-visible:ring-sky-500/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="px-3 pb-6 space-y-1">
            {rooms.length === 0 && !loading && (
              <div className="p-8 text-center space-y-2">
                <MessageSquare className="w-8 h-8 text-navy/10 mx-auto" />
                <p className="text-xs font-bold text-navy/30 italic">Aucune conversation</p>
              </div>
            )}
            
            {rooms
              .filter(r => r.name?.toLowerCase().includes(searchTerm.toLowerCase()) || !r.name)
              .map((room) => (
              <button
                key={room.id}
                onClick={() => setActiveRoomId(room.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all duration-300 ${
                  activeRoomId === room.id 
                    ? 'bg-white shadow-xl shadow-navy/[0.05] ring-1 ring-navy/[0.05]' 
                    : 'hover:bg-white/60'
                }`}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12 rounded-2xl border-2 border-white shadow-md">
                    <AvatarFallback className="bg-sky-100 text-sky-600 font-bold">
                      {room.is_group ? <Hash className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </AvatarFallback>
                  </Avatar>
                  {!room.is_group && room.members?.some(m => m.id !== currentMember.id && onlineMembers.includes(m.id)) && (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full animate-pulse shadow-sm" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-navy text-sm truncate">
                    {room.name || "Conversation privée"}
                  </p>
                  <p className="text-[10px] text-navy/40 font-medium">
                    {format(new Date(room.last_message_at), 'HH:mm', { locale: fr })}
                  </p>
                </div>
                {room.unread_count > 0 && (
                  <Badge className="bg-sky-600 text-white rounded-full h-5 min-w-[20px] flex items-center justify-center text-[10px] font-black border-none shadow-lg">
                    {room.unread_count}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-white">
        {activeRoomId ? (
          <>
            {/* Header */}
            <header className="p-6 border-b border-navy/5 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <Avatar className="w-10 h-10 rounded-xl">
                  <AvatarFallback className="bg-sky-50 text-sky-600 font-bold">
                    {activeRoom?.is_group ? <Hash className="w-5 h-5" /> : <User className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-navy leading-none">{activeRoom?.name || "Conversation"}</h3>
                  {activeRoom && Object.entries(typingMembers).some(([id, isTyping]) => 
                    isTyping && activeRoom.members?.some(m => m.id === id)
                  ) ? (
                    <p className="text-[10px] text-sky-500 font-bold italic mt-1 animate-bounce">En train d'écrire...</p>
                  ) : (
                    <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${
                      !activeRoom?.is_group && activeRoom?.members?.some(m => m.id !== currentMember.id && onlineMembers.includes(m.id))
                        ? "text-emerald-500" 
                        : "text-navy/20"
                    }`}>
                      {!activeRoom?.is_group && activeRoom?.members?.some(m => m.id !== currentMember.id && onlineMembers.includes(m.id))
                        ? "En ligne" 
                        : "Hors ligne"}
                    </p>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-xl text-navy/30 hover:text-navy hover:bg-sky-50">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </header>

            {/* Messages List */}
            <ScrollArea className="flex-1 p-6 bg-sky-50/10">
              <div className="space-y-6">
                {messages.map((msg, i) => {
                  const isOwn = msg.sender_id === currentMember.id;
                  return (
                    <div key={msg.id} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                      <div className={`flex gap-3 max-w-[80%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                        <Avatar className="w-8 h-8 rounded-lg shrink-0 mt-1">
                          <AvatarImage src={msg.sender?.photo_url} />
                          <AvatarFallback className="bg-sky-100 text-[10px] font-black">{msg.sender?.first_name?.[0]}{msg.sender?.last_name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className={`p-4 rounded-3xl text-sm ${
                            isOwn 
                              ? 'bg-navy text-white rounded-tr-none shadow-xl shadow-navy/10' 
                              : 'bg-white text-navy rounded-tl-none border border-navy/5 shadow-sm'
                          }`}>
                            {editingMessageId === msg.id ? (
                              <div className="space-y-2 py-1 min-w-[200px]">
                                <textarea
                                  autoFocus
                                  value={editingContent}
                                  onChange={(e) => setEditingContent(e.target.value)}
                                  className={`w-full p-2 rounded-xl text-sm font-medium resize-none border-none outline-none ring-1 ring-sky-500/30 ${
                                    isOwn ? 'bg-white/10 text-white placeholder:text-white/40' : 'bg-sky-50 text-navy'
                                  }`}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                      e.preventDefault();
                                      handleEditMessage(msg.id);
                                    }
                                  }}
                                />
                                <div className="flex justify-end gap-1">
                                  <button 
                                    className="flex items-center justify-center h-7 w-7 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                                    onClick={() => handleEditMessage(msg.id)}
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button 
                                    className="flex items-center justify-center h-7 w-7 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                                    onClick={() => setEditingMessageId(null)}
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <p className="leading-relaxed whitespace-pre-wrap">
                                  {msg.content}
                                </p>
                                {msg.created_at !== msg.updated_at && (
                                  <p className={`text-[9px] italic opacity-40 font-bold ${isOwn ? 'text-white' : 'text-navy'}`}>
                                    (modifié)
                                  </p>
                                )}
                              </div>
                            )}

                            {msg.attachment_url && (
                              <div className="mt-2">
                                {msg.attachment_type?.startsWith('image/') ? (
                                  <div className="relative group/img cursor-pointer" onClick={() => window.open(msg.attachment_url, '_blank')}>
                                    <img 
                                      src={msg.attachment_url} 
                                      alt={msg.attachment_name} 
                                      className="max-w-[240px] rounded-2xl border border-navy/5 shadow-sm transition-all group-hover/img:brightness-90"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                                      <ExternalLink className="w-6 h-6 text-white drop-shadow-lg" />
                                    </div>
                                  </div>
                                ) : (
                                  <a 
                                    href={msg.attachment_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                                      isOwn 
                                        ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                                        : 'bg-sky-50/50 border-navy/5 text-navy hover:bg-white hover:shadow-md'
                                    }`}
                                  >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                      isOwn ? 'bg-white/20' : 'bg-white shadow-sm'
                                    }`}>
                                      <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[11px] font-bold truncate uppercase tracking-widest">{msg.attachment_name}</p>
                                      <p className="text-[9px] opacity-40 font-black">DOCUMENT</p>
                                    </div>
                                    <ExternalLink className="w-4 h-4 opacity-40 shrink-0" />
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                          <div className={`flex items-center gap-2 px-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                            <span className="text-[9px] font-black text-navy/20 uppercase tracking-tighter">
                              {format(new Date(msg.created_at), 'HH:mm', { locale: fr })}
                            </span>
                            {isOwn && !editingMessageId && (
                               <div className="flex items-center gap-1">
                                 <button 
                                   onClick={() => {
                                     setEditingMessageId(msg.id);
                                     setEditingContent(msg.content);
                                   }}
                                   className="w-6 h-6 rounded-lg flex items-center justify-center text-navy/20 hover:text-sky-600 hover:bg-sky-50 transition-all"
                                   title="Modifier le message"
                                 >
                                   <Pencil className="w-3 h-3" />
                                 </button>
                                 <AlertDialog>
                                   <AlertDialogTrigger asChild>
                                     <button 
                                       className="w-6 h-6 rounded-lg flex items-center justify-center text-navy/20 hover:text-red-500 hover:bg-red-50 transition-all"
                                       title="Supprimer le message et le fichier"
                                     >
                                       <Trash2 className="w-3.5 h-3.5" />
                                     </button>
                                   </AlertDialogTrigger>
                                   <AlertDialogContent className="rounded-[2rem] border-none shadow-3xl bg-white p-8">
                                     <AlertDialogHeader>
                                       <AlertDialogTitle className="text-2xl font-display font-bold text-navy tracking-tight">Supprimer ce message ?</AlertDialogTitle>
                                       <AlertDialogDescription className="text-navy/40 font-medium">
                                         Êtes-vous sûr de vouloir supprimer ce message ? Si un fichier est joint, il sera également supprimé définitivement.
                                       </AlertDialogDescription>
                                     </AlertDialogHeader>
                                     <AlertDialogFooter className="gap-3 mt-6">
                                       <AlertDialogCancel className="rounded-xl border-navy/5 hover:bg-sky-50 font-bold">Annuler</AlertDialogCancel>
                                       <AlertDialogAction 
                                         onClick={() => deleteMessage(msg.id)}
                                         className="rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold border-none"
                                       >
                                         Supprimer
                                       </AlertDialogAction>
                                     </AlertDialogFooter>
                                   </AlertDialogContent>
                                 </AlertDialog>
                               </div>
                             )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <footer className="p-6 bg-white border-t border-navy/5">
              <div className="bg-sky-50/50 rounded-3xl p-2 px-4 flex items-center gap-2 ring-1 ring-navy/[0.03] shadow-inner">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-navy/30 hover:text-navy hover:bg-white rounded-2xl">
                      <Smile className="w-5 h-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2 rounded-2xl shadow-2xl border-none bg-white">
                    <div className="grid grid-cols-4 gap-1">
                      {COMMON_EMOJIS.map(emoji => (
                        <Button 
                          key={emoji} 
                          variant="ghost" 
                          className="h-10 w-10 text-xl p-0 hover:bg-sky-50 rounded-xl"
                          onClick={() => addEmoji(emoji)}
                        >
                          {emoji}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <div className="relative">
                  <input 
                    type="file" 
                    id="file-upload" 
                    className="hidden" 
                    onChange={onFileSelect}
                    accept=".pdf,.docx,.jpg,.jpeg,.png"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    asChild
                    className="text-navy/30 hover:text-navy hover:bg-white rounded-2xl cursor-pointer"
                  >
                    <label htmlFor="file-upload">
                      {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5" />}
                    </label>
                  </Button>
                </div>
                
                <Input 
                  value={messageInput}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Écrivez votre message..." 
                  className="border-none bg-transparent shadow-none focus-visible:ring-0 text-navy font-medium placeholder:text-navy/20"
                />
                
                <Button 
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() && !isUploading}
                  className="bg-navy hover:bg-sky-600 text-white rounded-2xl h-10 w-10 p-0 shadow-lg"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </Button>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
            <div className="w-32 h-32 bg-sky-50 rounded-[3rem] flex items-center justify-center shadow-2xl border border-sky-100 rotate-3">
              <MessageSquare className="w-14 h-14 text-sky-600" strokeWidth={1.5} />
            </div>
            <div className="max-w-xs">
              <h3 className="text-2xl font-display font-bold text-navy tracking-tight">Messagerie CPTS</h3>
              <p className="text-navy/40 text-sm mt-3 leading-relaxed italic">Sélectionnez une conversation pour commencer à échanger avec vos confrères.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
