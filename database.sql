-- Schéma de Base de Données Supabase pour CPTS Lyon 3

-- 1. Table des PROFILS (Gère les membres et les administrateurs)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  specialty text,
  phone text,
  address text,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Profils
alter table profiles enable row level security;
create policy "Les profils sont visibles par tous les membres." on profiles for select using (auth.uid() is not null);
create policy "Les utilisateurs modifient leur propre profil." on profiles for update using (auth.uid() = id);

-- 2. Table des CONTACTS (Messages reçus via le formulaire)
create table if not exists contacts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Contacts
alter table contacts enable row level security;
create policy "Tout le monde peut envoyer un message." on contacts for insert with check (true);
create policy "Seuls les admins voient les messages." on contacts for select using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

-- 3. Table de l'ANNUAIRE (Liste des professionnels de santé)
create table if not exists professionals (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  specialty text not null,
  phone text,
  address text,
  description text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Annuaire
alter table professionals enable row level security;
create policy "L'annuaire est public en lecture." on professionals for select using (true);
create policy "Gestion par les admins." on professionals for all using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

-- 4. Table des ACTUALITÉS (Articles et événements)
create table if not exists news (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  excerpt text,
  content text,
  category text,
  image_url text,
  published_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Actualités
alter table news enable row level security;
create policy "Les actus sont publiques." on news for select using (true);
create policy "Gestion par les admins." on news for all using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

-- 5. Table des RESSOURCES (Documents, outils, webinaires)
do $$ begin
    create type resource_type as enum ('guide', 'protocole', 'outil', 'webinaire', 'lien');
exception
    when duplicate_object then null;
end $$;

create table if not exists resources (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  type resource_type not null,
  url text not null,
  duration text,
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Ressources
alter table resources enable row level security;
create policy "Les ressources sont publiques." on resources for select using (true);
create policy "Gestion par les admins." on resources for all using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

-- 6. Table de CONFIGURATION (Google Agenda, URL globales)
create table if not exists site_settings (
  key text primary key,
  value text not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Valeur par défaut pour l'agenda Google
insert into site_settings (key, value) 
values ('google_calendar_url', 'https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Europe%2FParis&bgcolor=%23ffffff&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=0&src=znIuZnJlbmNoI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%230078d4')
on conflict (key) do nothing;

-- RLS Settings
alter table site_settings enable row level security;
create policy "Lecture publique des paramètres." on site_settings for select using (true);
create policy "Modification réservée aux admins." on site_settings for update using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);
