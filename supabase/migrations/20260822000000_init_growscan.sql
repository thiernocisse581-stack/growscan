-- =====================================================================
-- MIGRATION SUPABASE OFFICIELLE GROWSCAN SAAS
-- Tables, Triggers, RLS (Row Level Security) & Indices de Performance
-- =====================================================================

-- 1. Table Profiles (Profils utilisateurs avec rôle & solde)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  activity_type TEXT DEFAULT 'Créateur de contenu',
  primary_network TEXT DEFAULT 'instagram',
  role TEXT DEFAULT 'user',
  wallet_balance NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table Orders (Commandes SMM Abonnés / Likes / Vues)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT,
  network TEXT NOT NULL,
  service_type TEXT NOT NULL,
  target_url TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  panel_order_id TEXT,
  status TEXT DEFAULT 'processing',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table Transactions (Historique des paiements 1-Shot Moneroo / Stripe / PayTech)
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'purchase', 'ai_unlock', 'topup'
  amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL, -- 'Moneroo Mobile Money', 'Stripe', 'PayTech'
  status TEXT DEFAULT 'completed',
  reference_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Table Reports (Rapports d'Audit IA de profils)
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_url TEXT NOT NULL,
  network TEXT DEFAULT 'instagram',
  handle TEXT,
  score INTEGER DEFAULT 75,
  is_unlocked BOOLEAN DEFAULT FALSE,
  full_report JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Activation du Row Level Security (RLS) sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- 6. Politiques RLS pour Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles 
  FOR SELECT USING (auth.uid() = id OR role = 'admin');

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id OR role = 'admin');

DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;
CREATE POLICY "Enable insert for authenticated users" ON public.profiles 
  FOR INSERT WITH CHECK (true);

-- 7. Politiques RLS pour Orders
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders 
  FOR SELECT USING (auth.uid() = user_id OR user_email = auth.jwt()->>'email' OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Users can insert orders" ON public.orders;
CREATE POLICY "Users can insert orders" ON public.orders 
  FOR INSERT WITH CHECK (true);

-- 8. Politiques RLS pour Transactions
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
CREATE POLICY "Users can view own transactions" ON public.transactions 
  FOR SELECT USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Users can insert transactions" ON public.transactions;
CREATE POLICY "Users can insert transactions" ON public.transactions 
  FOR INSERT WITH CHECK (true);

-- 9. Politiques RLS pour Reports
DROP POLICY IF EXISTS "Users can view own reports" ON public.reports;
CREATE POLICY "Users can view own reports" ON public.reports 
  FOR SELECT USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Users can insert reports" ON public.reports;
CREATE POLICY "Users can insert reports" ON public.reports 
  FOR INSERT WITH CHECK (true);

-- 10. Trigger d'auto-création de profil à chaque inscription d'utilisateur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', ''), 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
