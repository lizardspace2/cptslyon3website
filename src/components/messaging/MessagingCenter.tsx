import { useState } from 'react';
import { useMessaging } from '@/hooks/useMessaging';
import { Member } from '@/hooks/useAuth';
import { MessagingRoom, MessagingMessage } from '@/types/messaging';
import { 
  Search, Send, MessageSquare, User, Trash2, 
  MoreVertical, Hash, Smile, Paperclip, Loader2 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
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
    sendMessage, 
    deleteMessage 
  } = useMessaging(currentMember.id);
  
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const activeRoom = rooms.find(r => r.id === activeRoomId);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput('');
    }
  };

  const addEmoji = (emoji: string) => {
    setMessageInput(prev => prev + emoji);
  };

  return (
    <div className="flex h-[700px] bg-white rounded-[3rem] border border-navy/5 shadow-3xl overflow-hidden ring-1 ring-navy/[0.02]">
      {/* Sidebar: Rooms List */}
      <aside className="w-80 border-r border-navy/5 flex flex-col bg-sky-50/20">
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-display font-bold text-navy tracking-tight">Messages</h2>
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
                <Avatar className="w-12 h-12 rounded-2xl border-2 border-white shadow-md">
                  <AvatarFallback className="bg-sky-100 text-sky-600 font-bold">
                    {room.is_group ? <Hash className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="font-bold text-navy text-sm truncate">
                    {room.name || "Conversation privée"}
                  </p>
                  <p className="text-[10px] text-navy/40 font-medium">
                    {format(new Date(room.last_message_at), 'HH:mm', { locale: fr })}
                  </p>
                </div>
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
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1">En ligne</p>
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
                            {msg.content}
                          </div>
                          <div className={`flex items-center gap-2 px-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                            <span className="text-[9px] font-black text-navy/20 uppercase tracking-tighter">
                              {format(new Date(msg.created_at), 'HH:mm', { locale: fr })}
                            </span>
                            {isOwn && (
                              <button 
                                onClick={() => deleteMessage(msg.id)}
                                className="text-navy/10 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
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
                
                <Input 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Écrivez votre message..." 
                  className="border-none bg-transparent shadow-none focus-visible:ring-0 text-navy font-medium placeholder:text-navy/20"
                />
                
                <Button 
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
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
