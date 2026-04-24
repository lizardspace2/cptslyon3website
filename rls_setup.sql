-- ============================================================
-- Script de configuration RLS pour CPTS Lyon 3
-- À exécuter dans le SQL Editor de Supabase pour débloquer l'admin
-- ============================================================

-- Désactiver RLS pour simplifier ou vous pouvez ajouter des politiques spécifiques après
-- Cette approche garantit que l'interface admin peut communiquer avec la base

ALTER TABLE public.professionals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.news DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.replacements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts DISABLE ROW LEVEL SECURITY;

-- Note : Si vous préférez garder RLS activé, utilisez plutôt les commandes suivantes
-- pour autoriser le rôle 'anon' (utilisé par le client Supabase actuel) :

/*
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for anon" ON public.professionals FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for anon" ON public.news FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for anon" ON public.resources FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.replacements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for anon" ON public.replacements FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for anon" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for anon" ON public.members FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for anon" ON public.contacts FOR ALL USING (true) WITH CHECK (true);
*/
