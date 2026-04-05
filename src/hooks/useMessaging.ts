import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { MessagingRoom, MessagingMessage } from '@/types/messaging';
import { useToast } from '@/hooks/use-toast';

export function useMessaging(memberId: string | undefined) {
  const [rooms, setRooms] = useState<MessagingRoom[]>([]);
  const [messages, setMessages] = useState<MessagingMessage[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRooms = useCallback(async () => {
    if (!memberId) return;
    const { data, error } = await supabase
      .from('messaging_rooms')
      .select('*, messaging_room_members!inner(*), members!messaging_room_members(*)')
      .eq('messaging_room_members.member_id', memberId)
      .order('last_message_at', { ascending: false });

    if (error) {
      console.error('Error fetching rooms:', error);
      return;
    }
    setRooms(data as any);
    setLoading(false);
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

  // Realtime subscription
  useEffect(() => {
    if (!activeRoomId) return;

    fetchMessages(activeRoomId);

    const subscription = supabase
      .channel(`room:${activeRoomId}`)
      .on(
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
            // Fetch the sender profile for the new message
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
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [activeRoomId, fetchMessages]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const sendMessage = async (content: string) => {
    if (!activeRoomId || !memberId || !content.trim()) return;

    const { error } = await supabase.from('messaging_messages').insert({
      room_id: activeRoomId,
      sender_id: memberId,
      content,
    });

    if (error) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible d\'envoyer le message.' });
    } else {
      // Update the room's last_message_at
      await supabase
        .from('messaging_rooms')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', activeRoomId);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!memberId) return;
    
    const { error } = await supabase
      .from('messaging_messages')
      .delete()
      .eq('id', messageId)
      .eq('sender_id', memberId); // Only the sender can delete

    if (error) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer le message.' });
    }
  };

  const createDirectMessage = async (targetMemberId: string) => {
    if (!memberId) return;

    // Check if room already exists
    const { data: myRooms } = await supabase
      .from('messaging_room_members')
      .select('room_id')
      .eq('member_id', memberId);

    const { data: targetRooms } = await supabase
      .from('messaging_room_members')
      .select('room_id')
      .eq('member_id', targetMemberId);

    const commonRooms = myRooms?.filter(mr => targetRooms?.some(tr => tr.room_id === mr.room_id));

    if (commonRooms && commonRooms.length > 0) {
      setActiveRoomId(commonRooms[0].room_id);
      return;
    }
    
    const { data: room, error: roomError } = await supabase
      .from('messaging_rooms')
      .insert({ is_group: false })
      .select()
      .single();

    if (roomError) throw roomError;

    await supabase.from('messaging_room_members').insert([
      { room_id: room.id, member_id: memberId },
      { room_id: room.id, member_id: targetMemberId },
    ]);

    await fetchRooms();
    setActiveRoomId(room.id);
  };

  return {
    rooms,
    messages,
    activeRoomId,
    setActiveRoomId,
    loading,
    sendMessage,
    deleteMessage,
    createDirectMessage,
    refreshRooms: fetchRooms,
  };
}
