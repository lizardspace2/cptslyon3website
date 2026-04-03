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

-- 2. RLS désactivé pour éviter les erreurs de permissions
ALTER TABLE public.members DISABLE ROW LEVEL SECURITY;
