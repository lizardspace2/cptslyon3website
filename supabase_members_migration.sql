-- ============================================================
-- Migration : Table MEMBERS pour l'Espace Adhérent CPTS Lyon 3
-- À exécuter dans Supabase SQL Editor
-- ============================================================

-- 1. Créer la table members
CREATE TABLE IF NOT EXISTS public.members (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  title text,
  first_name text,
  last_name text,
  specialty text,
  public_phone text,
  private_phone text,
  address text,
  photo_url text,
  status text NOT NULL DEFAULT 'pending',  -- 'pending', 'approved', 'rejected'
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT members_pkey PRIMARY KEY (id)
);

-- 2. Activer RLS
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- 3. Politiques RLS

-- Un membre peut lire son propre profil
CREATE POLICY "Members read own profile" ON public.members
  FOR SELECT USING (auth.uid() = id);

-- Un membre peut modifier son propre profil (mais pas le statut)
CREATE POLICY "Members update own profile" ON public.members
  FOR UPDATE USING (auth.uid() = id);

-- Insertion lors de l'inscription (l'utilisateur crée sa propre ligne)
CREATE POLICY "Users can insert own member row" ON public.members
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Les membres approuvés peuvent voir les autres membres approuvés (annuaire adhérents)
CREATE POLICY "Approved members see other approved members" ON public.members
  FOR SELECT USING (
    auth.uid() IS NOT NULL
    AND EXISTS (SELECT 1 FROM public.members WHERE id = auth.uid() AND status = 'approved')
    AND status = 'approved'
  );

-- Les admins voient et gèrent tous les membres
CREATE POLICY "Admins manage all members" ON public.members
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );
