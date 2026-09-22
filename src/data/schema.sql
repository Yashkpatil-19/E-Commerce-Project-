-- PurePro PostgreSQL Schema for InsForge BaaS

-- 1. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  form TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  rating NUMERIC DEFAULT 4.8,
  reviews_count INTEGER DEFAULT 0,
  image TEXT NOT NULL,
  match_score INTEGER,
  match_reason TEXT,
  description TEXT,
  servings INTEGER DEFAULT 30,
  protein_g NUMERIC DEFAULT 0,
  target_diet TEXT DEFAULT 'Vegetarian',
  flavors TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  nutrition_facts JSONB DEFAULT '{}'::jsonb,
  reviews JSONB DEFAULT '[]'::jsonb,
  brand_verification_badge TEXT,
  is_featured BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. User Profiles Table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  age INTEGER DEFAULT 24,
  weight INTEGER DEFAULT 65,
  goal TEXT DEFAULT 'Muscle Gain',
  activity TEXT DEFAULT 'High',
  diet TEXT DEFAULT 'Vegetarian',
  saved_addresses JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Carts Table
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  flavor TEXT NOT NULL,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  order_number TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'placed',
  tracking_number TEXT,
  estimated_delivery TEXT,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  shipping_fee NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  shipping_details JSONB NOT NULL,
  payment_method TEXT DEFAULT 'upi',
  payment_status TEXT DEFAULT 'pending',
  payment_proof_url TEXT,
  payment_proof_key TEXT,
  user_profile JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Scratch Codes Table
CREATE TABLE IF NOT EXISTS public.scratch_codes (
  code TEXT PRIMARY KEY,
  brand TEXT NOT NULL,
  product TEXT NOT NULL,
  batch TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  verified_by_user TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scratch_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Public/Authenticated access
DROP POLICY IF EXISTS "Public all products" ON public.products;
CREATE POLICY "Public all products" ON public.products FOR ALL USING (true);

DROP POLICY IF EXISTS "Profiles access" ON public.user_profiles;
CREATE POLICY "Profiles access" ON public.user_profiles FOR ALL USING (true);

DROP POLICY IF EXISTS "Carts access" ON public.carts;
CREATE POLICY "Carts access" ON public.carts FOR ALL USING (true);

DROP POLICY IF EXISTS "Orders access" ON public.orders;
CREATE POLICY "Orders access" ON public.orders FOR ALL USING (true);

DROP POLICY IF EXISTS "Scratch codes access" ON public.scratch_codes;
CREATE POLICY "Scratch codes access" ON public.scratch_codes FOR ALL USING (true);
