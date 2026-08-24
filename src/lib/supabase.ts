import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mstvejqcygcmsirlvgwo.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zdHZlanFjeWdjbXNpcmx2Z3dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczMzA2NjMsImV4cCI6MjEwMjkwNjY2M30.gnxc528OUIJRe9jd3wmoqTqpWKklErYgj4-BDrx69qg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

export interface DbProfile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  activity_type?: string;
  primary_network?: string;
  role: "user" | "admin";
  wallet_balance: number;
  created_at: string;
}

export interface DbOrder {
  id: string;
  user_id?: string;
  network: string;
  service_type: string;
  target_url: string;
  quantity: number;
  price: number;
  panel_order_id?: string;
  status: "pending" | "processing" | "completed" | "canceled";
  created_at: string;
  updated_at?: string;
}

export interface DbAnalysisReport {
  id: string;
  user_id?: string;
  profile_url: string;
  network: string;
  score: number;
  summary: string;
  full_report: any;
  is_unlocked: boolean;
  created_at: string;
}

export interface DbTransaction {
  id: string;
  user_id?: string;
  type: "topup" | "purchase" | "unlock";
  amount: number;
  payment_method: string;
  status: "pending" | "completed" | "failed";
  reference_id?: string;
  created_at: string;
}

// SQL Schema Reference migration script for Supabase console
export const SUPABASE_SQL_SCHEMA = `
-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user',
  wallet_balance NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  network TEXT NOT NULL,
  service_type TEXT NOT NULL,
  target_url TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  panel_order_id TEXT,
  status TEXT DEFAULT 'processing',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Create analysis_reports table
CREATE TABLE IF NOT EXISTS public.analysis_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  profile_url TEXT NOT NULL,
  network TEXT NOT NULL,
  score INTEGER NOT NULL,
  summary TEXT NOT NULL,
  full_report JSONB NOT NULL,
  is_unlocked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT DEFAULT 'completed',
  reference_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "User can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "User can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "User can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User can view own reports" ON public.analysis_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "User can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
`;
