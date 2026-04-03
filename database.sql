-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.contacts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  title text,
  first_name text,
  last_name text,
  phone text,
  CONSTRAINT contacts_pkey PRIMARY KEY (id)
);

CREATE TABLE public.news (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text,
  content text,
  category text,
  image_url text,
  published_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT news_pkey PRIMARY KEY (id)
);

CREATE TABLE public.profiles (
  id uuid NOT NULL,
  full_name text,
  specialty text,
  phone text,
  address text,
  is_admin boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
create table public.professionals (
  id uuid not null default gen_random_uuid (),
  name text null,
  specialty text not null,
  phone text null,
  address text null,
  description text null,
  image_url text null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  title text null,
  first_name text null,
  last_name text null,
  public_phone text null,
  private_phone text null,
  email text null,
  photo_url text null,
  constraint professionals_pkey primary key (id)
) TABLESPACE pg_default;

CREATE TABLE public.replacements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  type text NOT NULL,
  profession text NOT NULL,
  lieu text NOT NULL,
  periode text NOT NULL,
  description text NOT NULL,
  urgent boolean DEFAULT false,
  email text NOT NULL,
  phone text,
  status text DEFAULT 'pending'::text,
  titre text,
  nom text,
  prenom text,
  adresse text,
  CONSTRAINT replacements_pkey PRIMARY KEY (id)
);
CREATE TABLE public.resources (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text NOT NULL,
  url text NOT NULL,
  duration text,
  category text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT resources_pkey PRIMARY KEY (id)
);
CREATE TABLE public.site_settings (
  key text NOT NULL,
  value text NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT site_settings_pkey PRIMARY KEY (key)
);

CREATE TABLE public.members (
  id uuid NOT NULL,
  email text NOT NULL,
  title text,
  first_name text,
  last_name text,
  specialty text,
  public_phone text,
  private_phone text,
  address text,
  photo_url text,
  status text NOT NULL DEFAULT 'pending'::text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT members_pkey PRIMARY KEY (id),
  CONSTRAINT members_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);