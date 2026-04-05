import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { MessagingRoom, MessagingMessage } from '@/types/messaging';
import { useToast } from '@/hooks/use-toast';

export function useMessaging(memberId: string | undefined) {
  const [rooms, setRooms] = useState<MessagingRoom[]>([]);
  const [messages, setMessages] = useState<MessagingMessage[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [onlineMembers, setOnlineMembers] = useState<string[]>([]);
  const [typingMembers, setTypingMembers] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  
  const typingTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

  const fetchRooms = useCallback(async () => {
    if (!memberId) return;
    const { data: roomsData, error } = await supabase
      .from('messaging_rooms')
      .select('*, messaging_room_members!inner(*), members!messaging_room_members(*)')
      .eq('messaging_room_members.member_id', memberId)
      .order('last_message_at', { ascending: false });

    if (error) {
      console.error('Error fetching rooms:', error);
      return;
    }

    const processedRooms = await Promise.all((roomsData as any[]).map(async (room) => {
      const myMembership = room.messaging_room_members.find((m: any) => m.member_id === memberId);
      const { count } = await supabase
        .from('messaging_messages')
        .select('*', { count: 'exact', head: true })
        .eq('room_id', room.id)
        .gt('created_at', myMembership.last_read_at);
      
      return { ...room, unread_count: count || 0 };
    }));

    setRooms(processedRooms);
    setLoading(false);
  }, [memberId]);

  const markAsRead = useCallback(async (roomId: string) => {
    if (!memberId) return;
    const { error } = await supabase
      .from('messaging_room_members')
      .update({ last_read_at: new Date().toISOString() })
      .eq('room_id', roomId)
      .eq('member_id', memberId);

    if (!error) {
      setRooms(prev => prev.map(r => r.id === roomId ? { ...r, unread_count: 0 } : r));
    }
  }, [memberId]);

  const fetchMessages = useCallback(async (roomId: string) => {
    const { data, error } = await supabase
      .from('messaging_messages')
      .select('*, sender:members(*)')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .limit(50);

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }
    setMessages(data as any);
  }, []);

  useEffect(() => {
    if (!memberId) return;

    const channel = supabase.channel(activeRoomId ? `room:${activeRoomId}` : 'global_presence', {
      config: {
        presence: { key: memberId },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setOnlineMembers(Object.keys(state));
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        setOnlineMembers((prev) => [...new Set([...prev, key])]);
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        setOnlineMembers((prev) => prev.filter((id) => id !== key));
      })
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        const { memberId: typingId, isTyping } = payload;
        if (typingId === memberId) return;

        setTypingMembers((prev) => ({ ...prev, [typingId]: isTyping }));
        
        if (isTyping) {
          if (typingTimeoutRef.current[typingId]) clearTimeout(typingTimeoutRef.current[typingId]);
          typingTimeoutRef.current[typingId] = setTimeout(() => {
            setTypingMembers((prev) => ({ ...prev, [typingId]: false }));
          }, 3000);
        }
      });

    if (activeRoomId) {
      fetchMessages(activeRoomId);
      markAsRead(activeRoomId);

      channel.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messaging_messages',
          filter: `room_id=eq.${activeRoomId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMessage = payload.new as MessagingMessage;
            if (activeRoomId === newMessage.room_id) markAsRead(activeRoomId);
            supabase
              .from('members')
              .select('*')
              .eq('id', newMessage.sender_id)
              .single()
              .then(({ data }) => {
                setMessages((prev) => [...prev, { ...newMessage, sender: data as any }]);
              });
          } else if (payload.eventType === 'DELETE') {
            setMessages((prev) => prev.filter((m) => m.id !== payload.old.id));
          }
        }
      );
    }

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ online_at: new Date().toISOString() });
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeRoomId, memberId, fetchMessages, markAsRead]);

  const sendTyping = (isTyping: boolean) => {
    if (!activeRoomId || !memberId) return;
    supabase.channel(`room:${activeRoomId}`).send({
      type: 'broadcast',
      event: 'typing',
      payload: { memberId, isTyping },
    });
  };

  const uploadFile = async (file: File) => {
    if (!memberId) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `messaging/${activeRoomId}/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('cpts-workspace')
      .upload(filePath, file);

    if (uploadError) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Échec de l\'envoi du fichier.' });
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('cpts-workspace')
      .getPublicUrl(filePath);

    return { 
      url: publicUrl, 
      name: file.name, 
      type: file.type,
      storagePath: filePath 
    };
  };

  const sendMessage = async (content: string, attachment?: { url: string, name: string, type: string }) => {
    if (!activeRoomId || !memberId || (!content.trim() && !attachment)) return;

    const { error } = await supabase.from('messaging_messages').insert({
      room_id: activeRoomId,
      sender_id: memberId,
      content,
      attachment_url: attachment?.url,
      attachment_name: attachment?.name,
      attachment_type: attachment?.type
    });

    if (error) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible d\'envoyer le message.' });
    } else {
      await supabase
        .from('messaging_rooms')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', activeRoomId);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!memberId) return;
    
    // First, find if there's an attachment to delete from storage
    const { data: message } = await supabase
      .from('messaging_messages')
      .select('attachment_url')
      .eq('id', messageId)
      .single();

    if (message?.attachment_url) {
      const path = message.attachment_url.split('/public/cpts-workspace/')[1];
      if (path) {
        await supabase.storage.from('cpts-workspace').remove([path]);
      }
    }

    const { error } = await supabase
      .from('messaging_messages')
      .delete()
      .eq('id', messageId)
      .eq('sender_id', memberId);

    if (error) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer le message.' });
    }
  };

  const createDirectMessage = async (targetMemberId: string) => {
    if (!memberId) return;
    const { data: myRooms } = await supabase.from('messaging_room_members').select('room_id').eq('member_id', memberId);
    const { data: targetRooms } = await supabase.from('messaging_room_members').select('room_id').eq('member_id', targetMemberId);
    const commonRooms = myRooms?.filter(mr => targetRooms?.some(tr => tr.room_id === mr.room_id));

    if (commonRooms && commonRooms.length > 0) {
      setActiveRoomId(commonRooms[0].room_id);
      return;
    }
    
    const { data: room, error: roomError } = await supabase.from('messaging_rooms').insert({ is_group: false }).select().single();
    if (roomError) throw roomError;

    await supabase.from('messaging_room_members').insert([
      { room_id: room.id, member_id: memberId },
      { room_id: room.id, member_id: targetMemberId },
    ]);

    await fetchRooms();
    setActiveRoomId(room.id);
  };

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return {
    rooms,
    messages,
    activeRoomId,
    setActiveRoomId,
    loading,
    onlineMembers,
    typingMembers,
    sendMessage,
    deleteMessage,
    createDirectMessage,
    sendTyping,
    uploadFile,
    refreshRooms: fetchRooms,
  };
}
