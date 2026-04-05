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
      .order('is_pinned', { ascending: false })
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

  const uploadFile = async (file: File) => {
    if (!memberId || !activeGroupId) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `workspace/${activeGroupId}/${fileName}`;

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

  const createPost = async (content: string, attachment?: { url: string, name: string, type: string }) => {
    if (!activeGroupId || !memberId) return;
    const { error } = await supabase
      .from('workspace_posts')
      .insert({ 
        group_id: activeGroupId, 
        author_id: memberId, 
        content,
        attachment_url: attachment?.url,
        attachment_name: attachment?.name,
        attachment_type: attachment?.type
      });

    if (error) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de publier le message.' });
    } else {
      fetchPosts(activeGroupId);
    }
  };

  const deletePost = async (postId: string) => {
    if (!memberId) return;
    
    const { data: post } = await supabase
      .from('workspace_posts')
      .select('attachment_url')
      .eq('id', postId)
      .single();

    if (post?.attachment_url) {
      const path = post.attachment_url.split('/public/cpts-workspace/')[1];
      if (path) {
        await supabase.storage.from('cpts-workspace').remove([path]);
      }
    }

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

  const editPost = async (postId: string, content: string) => {
    if (!memberId || !content.trim()) return;

    const { error } = await supabase
      .from('workspace_posts')
      .update({ content })
      .eq('id', postId)
      .eq('author_id', memberId);

    if (error) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de modifier la publication.' });
    } else if (activeGroupId) {
      fetchPosts(activeGroupId);
    }
  };

  const togglePinPost = async (postId: string, isPinned: boolean) => {
    const { error } = await supabase
      .from('workspace_posts')
      .update({ 
        is_pinned: !isPinned,
        pinned_at: !isPinned ? new Date().toISOString() : null
      })
      .eq('id', postId);

    if (error) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de modifier l\'épinglage.' });
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
    editPost,
    togglePinPost,
    uploadFile,
    refreshGroups: fetchGroups,
  };
}
