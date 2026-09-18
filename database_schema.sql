-- ZOOPCART SUPABASE SCHEMA
-- Run this in the Supabase SQL Editor of the NEW client account.

CREATE TABLE businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  username TEXT UNIQUE NOT NULL,
  business_name TEXT,
  business_description TEXT,
  profile_image TEXT,
  instagram_profile_url TEXT, -- Used for storing Theme JSON
  whatsapp_country_code TEXT DEFAULT '91',
  whatsapp_number TEXT,
  category TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  slug TEXT,
  name TEXT NOT NULL,
  description TEXT, -- Used for storing Delivery/Video JSON at the end
  price NUMERIC NOT NULL,
  sale_price NUMERIC,
  category TEXT,
  availability TEXT DEFAULT 'in_stock',
  image TEXT,
  stock NUMERIC DEFAULT 50,
  published BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_token TEXT NOT NULL,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  customer_name TEXT,
  customer_phone TEXT,
  delivery_location TEXT,
  quantity NUMERIC DEFAULT 1,
  budget NUMERIC,
  required_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS (Row Level Security) Policies
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow public read access to businesses
CREATE POLICY "Public profiles are viewable by everyone." ON businesses FOR SELECT USING (true);

-- Allow users to update their own businesses
CREATE POLICY "Users can update own businesses." ON businesses FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to insert their own businesses
CREATE POLICY "Users can insert own businesses." ON businesses FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow public read access to published products
CREATE POLICY "Public products are viewable by everyone." ON products FOR SELECT USING (true);

-- Allow sellers to manage their products
CREATE POLICY "Sellers can manage their products" ON products FOR ALL USING (
  business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())
);

-- Allow public to insert orders (buyers submitting orders)
CREATE POLICY "Anyone can submit orders" ON orders FOR INSERT WITH CHECK (true);

-- Allow sellers to read/update their own orders
CREATE POLICY "Sellers can view own orders" ON orders FOR SELECT USING (
  business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())
);
CREATE POLICY "Sellers can update own orders" ON orders FOR UPDATE USING (
  business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())
);

-- For Admin Dashboard and the Track Page (to allow users to view their order by token), 
-- you may want to enable anon read temporarily or write specific policies:
CREATE POLICY "Allow public read for tracking" ON orders FOR SELECT USING (true);

