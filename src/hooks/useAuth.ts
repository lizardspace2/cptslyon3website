import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface Member {
  id: string;
  email: string;
  title?: string;
  first_name?: string;
  last_name?: string;
  specialty?: string;
  public_phone?: string;
  private_phone?: string;
  address?: string;
  photo_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  member: Member | null;
  loading: boolean;
  isApproved: boolean;
  isPending: boolean;
  isRejected: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    member: null,
    loading: true,
    isApproved: false,
    isPending: false,
    isRejected: false,
  });

  const fetchMember = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching member:', error);
      return null;
    }
    return data as Member | null;
  }, []);

  const updateState = useCallback((user: User | null, session: Session | null, member: Member | null) => {
    setState({
      user,
      session,
      member,
      loading: false,
      isApproved: member?.status === 'approved',
      isPending: member?.status === 'pending',
      isRejected: member?.status === 'rejected',
    });
  }, []);

  useEffect(() => {
    // Get initial session — also handles email confirmation redirect tokens
    const init = async () => {
      // If URL has hash params (from email confirmation link), exchange them
      const hash = window.location.hash;
      if (hash && (hash.includes('access_token') || hash.includes('type=signup') || hash.includes('type=recovery'))) {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) console.error('Error exchanging token:', error);
        window.history.replaceState(null, '', window.location.pathname);
        if (session?.user) {
          const member = await fetchMember(session.user.id);
          updateState(session.user, session, member);
          return;
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Force refresh member data from DB to get the latest 'status'
        const member = await fetchMember(session.user.id);
        updateState(session.user, session, member);
      } else {
        updateState(null, null, null);
      }
    };
    init();

    // Listen for auth changes (including email confirmation)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const member = await fetchMember(session.user.id);
        updateState(session.user, session, member);
      } else if (event === 'SIGNED_OUT') {
        updateState(null, null, null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchMember, updateState]);

  const signUp = async (
    email: string,
    password: string,
    memberData: Omit<Member, 'id' | 'email' | 'status' | 'created_at'>
  ) => {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/espace-adherent`,
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Erreur lors de la création du compte.');

    // 2. Insert member row
    const { error: memberError } = await supabase.from('members').insert({
      id: authData.user.id,
      email,
      title: memberData.title || null,
      first_name: memberData.first_name || null,
      last_name: memberData.last_name || null,
      specialty: memberData.specialty || null,
      public_phone: memberData.public_phone || null,
      private_phone: memberData.private_phone || null,
      address: memberData.address || null,
      photo_url: memberData.photo_url || null,
      status: 'pending',
    });

    if (memberError) throw memberError;

    // Refresh the state locally to show "Pending" screen immediately
    const member = await fetchMember(authData.user.id);
    updateState(authData.user, authData.session, member);

    return authData;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateProfile = async (updates: Partial<Omit<Member, 'id' | 'email' | 'status' | 'created_at'>>) => {
    if (!state.user) throw new Error('Non connecté');
    const { error } = await supabase
      .from('members')
      .update(updates)
      .eq('id', state.user.id);
    if (error) throw error;

    // Refresh member data
    const member = await fetchMember(state.user.id);
    if (member) {
      updateState(state.user, state.session, member);
    }
  };

  return {
    ...state,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshMember: async () => {
      if (state.user) {
        const member = await fetchMember(state.user.id);
        updateState(state.user, state.session, member);
      }
    },
  };
}
