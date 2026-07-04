-- Marketplace Schema for User-to-User Product Listings
-- Creates tables for the marketplace feature where authenticated users can list products for sale

-- Create marketplace_categories lookup table
CREATE TABLE IF NOT EXISTS marketplace_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create marketplace_products table
CREATE TABLE IF NOT EXISTS marketplace_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  category TEXT,
  condition TEXT CHECK (condition IN ('new', 'like_new', 'good', 'fair')),
  images JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'removed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_marketplace_products_status ON marketplace_products(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_products_seller ON marketplace_products(seller_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_products_category ON marketplace_products(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_products_created ON marketplace_products(created_at DESC);

-- Enable RLS
ALTER TABLE marketplace_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_products ENABLE ROW LEVEL SECURITY;

-- RLS: anyone can read active products
CREATE POLICY "Anyone can view active products"
  ON marketplace_products FOR SELECT
  USING (status = 'active');

-- RLS: sellers can view their own products regardless of status
CREATE POLICY "Sellers can view own products"
  ON marketplace_products FOR SELECT
  USING (seller_id = auth.uid());

-- RLS: authenticated users can create products
CREATE POLICY "Authenticated users can create products"
  ON marketplace_products FOR INSERT
  WITH CHECK (seller_id = auth.uid());

-- RLS: sellers can update their own products
CREATE POLICY "Sellers can update own products"
  ON marketplace_products FOR UPDATE
  USING (seller_id = auth.uid());

-- RLS: sellers can delete their own products
CREATE POLICY "Sellers can delete own products"
  ON marketplace_products FOR DELETE
  USING (seller_id = auth.uid());

-- Seed categories
INSERT INTO marketplace_categories (name, slug) VALUES
  ('Sports Equipment', 'sports-equipment'),
  ('Padel Gear', 'padel-gear'),
  ('Fitness & Gym', 'fitness-gym'),
  ('Apparel', 'apparel'),
  ('Accessories', 'accessories'),
  ('Electronics', 'electronics'),
  ('Home & Garden', 'home-garden'),
  ('Other', 'other')
ON CONFLICT (slug) DO NOTHING;
