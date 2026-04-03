import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface Member {
  id: string;
  email: string;
  password?: string;
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
  member: Member | null;
  loading: boolean;
  isApproved: boolean;
  isPending: boolean;
  isRejected: boolean;
}

const SESSION_KEY = 'cpts_member_session';

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    member: null,
    loading: true,
    isApproved: false,
    isPending: false,
    isRejected: false,
  });

  const fetchMember = useCallback(async (memberId: string) => {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', memberId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching member:', error);
      return null;
    }
    return data as Member | null;
  }, []);

  const updateState = useCallback((member: Member | null) => {
    setState({
      member,
      loading: false,
      isApproved: member?.status === 'approved',
      isPending: member?.status === 'pending',
      isRejected: member?.status === 'rejected',
    });
    
    if (member) {
      localStorage.setItem(SESSION_KEY, member.id);
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const savedMemberId = localStorage.getItem(SESSION_KEY);
      if (savedMemberId) {
        const member = await fetchMember(savedMemberId);
        if (member) {
          updateState(member);
          return;
        }
      }
      updateState(null);
    };
    init();
  }, [fetchMember, updateState]);

  const signUp = async (
    email: string,
    password: string,
    memberData: Omit<Member, 'id' | 'email' | 'status' | 'created_at'>
  ) => {
    // Check if email already exists
    const { data: existing } = await supabase
      .from('members')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    
    if (existing) {
      throw new Error('Cet email est déjà utilisé.');
    }

    // Insert member row
    const { data, error } = await supabase.from('members').insert({
      email,
      password, // Plain text as requested for simplicity
      title: memberData.title || null,
      first_name: memberData.first_name || null,
      last_name: memberData.last_name || null,
      specialty: memberData.specialty || null,
      public_phone: memberData.public_phone || null,
      private_phone: memberData.private_phone || null,
      address: memberData.address || null,
      photo_url: memberData.photo_url || null,
      status: 'pending',
    }).select().single();

    if (error) throw error;

    const newMember = data as Member;
    updateState(newMember);
    return newMember;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Email ou mot de passe incorrect.');

    const member = data as Member;
    updateState(member);
    return member;
  };

  const signOut = async () => {
    updateState(null);
  };

  const updateProfile = async (updates: Partial<Omit<Member, 'id' | 'email' | 'status' | 'created_at'>>) => {
    if (!state.member) throw new Error('Non connecté');
    const { error } = await supabase
      .from('members')
      .update(updates)
      .eq('id', state.member.id);
    
    if (error) throw error;

    // Refresh member data
    const member = await fetchMember(state.member.id);
    if (member) {
      updateState(member);
    }
  };

  return {
    user: state.member, // Keep 'user' alias for compatibility with components
    member: state.member,
    ...state,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshMember: async () => {
      if (state.member) {
        const member = await fetchMember(state.member.id);
        updateState(member);
      }
    },
  };
}

