import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { WorkspaceGroup, WorkspacePost, WorkspaceComment } from '@/types/messaging';
import { useToast } from '@/hooks/use-toast';

export function useWorkspace(memberId: string | undefined) {
  const [groups, setGroups] = useState<WorkspaceGroup[]>([]);
  const [posts, setPosts] = useState<WorkspacePost[]>([]);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchGroups = useCallback(async () => {
    const { data, error } = await supabase
      .from('workspace_groups')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching groups:', error);
      return;
    }
    setGroups(data);
    setLoading(false);
  }, []);

  const fetchPosts = useCallback(async (groupId: string) => {
    const { data, error } = await supabase
      .from('workspace_posts')
      .select('*, author:members(*)')
      .eq('group_id', groupId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return;
    }
    setPosts(data as any);
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  useEffect(() => {
    if (activeGroupId) {
      fetchPosts(activeGroupId);
    }
  }, [activeGroupId, fetchPosts]);

  const createGroup = async (name: string, description: string, tag: string) => {
    if (!memberId) return;
    const { data, error } = await supabase
      .from('workspace_groups')
      .insert({ name, description, tag, created_by: memberId })
      .select()
      .single();

    if (error) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de créer le groupe.' });
      throw error;
    }
    setGroups((prev) => [...prev, data]);
    return data;
  };

  const createPost = async (content: string) => {
    if (!activeGroupId || !memberId) return;
    const { data, error } = await supabase
      .from('workspace_posts')
      .insert({ group_id: activeGroupId, author_id: memberId, content })
      .select()
      .single();

    if (error) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de publier le message.' });
    } else {
      fetchPosts(activeGroupId); // Refresh
    }
  };

  const deletePost = async (postId: string) => {
    if (!memberId) return;
    const { error } = await supabase
      .from('workspace_posts')
      .delete()
      .eq('id', postId)
      .eq('author_id', memberId);

    if (error) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer la publication.' });
    } else if (activeGroupId) {
      fetchPosts(activeGroupId);
    }
  };

  return {
    groups,
    posts,
    activeGroupId,
    setActiveGroupId,
    loading,
    createGroup,
    createPost,
    deletePost,
    refreshGroups: fetchGroups,
  };
}
