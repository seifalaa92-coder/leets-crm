# Leets Sports CRM - Project Summary

## Live Site
- **URL**: https://leetssports.com
- **Hosting**: Vercel
- **Database**: Supabase (pending setup)

## Changes Made

### 1. Homepage (/)
- Simplified design for faster loading
- Added Sign Up button in navigation
- Added Sign Up button in hero section
- Added Sign Up link in footer
- Removed heavy animations (framer-motion)
- Reduced images for performance

### 2. Booking Page (/classes/book-court)
- Simplified from 3 steps to 2 steps
- Easier court selection
- Simple date picker
- Clean time slot grid
- Page size reduced from 6.82 kB to 2.08 kB

### 3. Sign Up Page (/auth/signup)
- Added profile picture upload (optional)
- Added Full Name (required)
- Added Email (required)
- Added Phone Number (required)
- Added Age (optional)
- Added email notification to mgmt@leetssports.com when someone signs up

### 4. API Routes
- Created `/api/signup-notify` - sends email notification to management

## To Do After Supabase Restores

1. Run SQL in Supabase SQL Editor to create `clients` table:
```sql
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  age INTEGER,
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON public.clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated read" ON public.clients FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow own update" ON public.clients FOR UPDATE USING (auth.uid() = user_id);
```

2. Set up SMTP environment variables in Vercel:
   - SMTP_HOST = smtp.gmail.com
   - SMTP_PORT = 587
   - SMTP_USER = your email
   - SMTP_PASSWORD = your app password

## GitHub Repo
https://github.com/seifalaa92-coder/leets-crm

## Court Names
- Clay Court Alpha
- Clay Court Beta
- Ahmed Alaa's Zalata Court (was Terracotta Court)
- Sunset Court
