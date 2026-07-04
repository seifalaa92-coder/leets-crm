-- ============================================================================
-- FIX: Allow new users to create their own client record during signup
-- ============================================================================

-- Drop existing insert policy and create one that allows users to create their own client
DROP POLICY IF EXISTS "Users can create own client" ON clients;
DROP POLICY IF EXISTS "Staff can manage clients" ON clients;

-- Allow authenticated users to insert their own client record
CREATE POLICY "Users can create own client" ON clients
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager', 'front_desk')
    )
  );

-- Keep the existing policies for viewing and let staff manage
CREATE POLICY "Staff can view all clients" ON clients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager', 'front_desk', 'coach')
    )
  );

CREATE POLICY "Members can view own client profile" ON clients
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Staff can update clients" ON clients
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager', 'front_desk')
    )
  );

-- ============================================================================
-- FIX: Similar issue might occur with user_profiles during signup
-- Allow users to create their own profile
-- ============================================================================

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- Allow users to insert their own profile (fixes signup issues)
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================================
-- QUICK WORKAROUND: If you want to disable RLS temporarily for testing
-- Uncomment these lines to disable RLS on problematic tables:
-- ============================================================================

-- ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- IMPORTANT: Make sure the trigger function exists to auto-create user_profiles
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, role, first_name, last_name, email, phone)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'role', 'member'),
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    new.email,
    new.phone
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- SEED DATA (if not already present)
-- ============================================================================

-- Ensure venue settings exist
INSERT INTO venue_settings (name, operating_hours, features) VALUES (
  'Leets Sports',
  '{
    "monday": {"open": "06:00", "close": "23:00", "isOpen": true},
    "tuesday": {"open": "06:00", "close": "23:00", "isOpen": true},
    "wednesday": {"open": "06:00", "close": "23:00", "isOpen": true},
    "thursday": {"open": "06:00", "close": "23:00", "isOpen": true},
    "friday": {"open": "06:00", "close": "23:00", "isOpen": true},
    "saturday": {"open": "07:00", "close": "22:00", "isOpen": true},
    "sunday": {"open": "07:00", "close": "22:00", "isOpen": true}
  }'::jsonb,
  '{"waitlist": true, "referralBonuses": true, "loyaltyProgram": true, "employeeAttendance": true}'::jsonb
) ON CONFLICT DO NOTHING;

-- Insert default membership tiers
INSERT INTO membership_tiers (name, name_ar, type, duration_days, price, description, features) VALUES
  ('Monthly', 'شهري', 'monthly', 30, 800, 'Full access for 30 days', '["Unlimited court access", "Free group classes", "Locker room access"]'),
  ('Annual', 'سنوي', 'annual', 365, 8000, 'Full access for 1 year with 2 months free', '["Unlimited court access", "Free group classes", "Private coaching discount", "Priority booking", "Locker room access"]'),
  ('Day Pass', 'يومي', 'day_pass', 1, 150, 'Single day access', '["Full day court access", "Group class access"]'),
  ('Corporate', 'شركات', 'corporate', 365, 7000, 'Corporate membership for teams', '["Unlimited court access", "Team building events", "Priority booking"]')
ON CONFLICT DO NOTHING;

-- Insert default courts
INSERT INTO courts (name, name_ar, description, is_active) VALUES
  ('Court 1', 'ملعب 1', 'Indoor professional padel court', true),
  ('Court 2', 'ملعب 2', 'Indoor professional padel court', true),
  ('Court 3', 'ملعب 3', 'Indoor professional padel court', true),
  ('Court 4', 'ملعب 4', 'Outdoor padel court', true)
ON CONFLICT DO NOTHING;

-- Insert sample rewards
INSERT INTO rewards (name, name_ar, description, description_ar, points_cost, quantity_available) VALUES
  ('Free Class', 'حصة مجانية', 'One free group class', 'حصة جماعية مجانية', 500, 100),
  ('20% Discount', 'خصم 20%', '20% off on any purchase', 'خصم 20% على أي عملية شراء', 1000, 50),
  ('Free Day Pass', 'يومية مجانية', 'One free day pass', 'يومية مجانية', 750, 75),
  ('Private Lesson', 'حصة خاصة', 'One free private lesson', 'حصة خاصة مجانية', 2000, 25)
ON CONFLICT DO NOTHING;
