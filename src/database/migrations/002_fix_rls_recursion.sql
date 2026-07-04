-- ============================================================================
-- FIX: Infinite Recursion in RLS Policies
-- ============================================================================
-- The original policies caused infinite recursion by querying user_profiles
-- within policies on user_profiles. This fix uses auth.jwt() to get roles
-- from the JWT token metadata instead.

-- First, drop the problematic policies
DROP POLICY IF EXISTS "Super admin can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Manager can view staff and members" ON user_profiles;
DROP POLICY IF EXISTS "Super admin can update all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Super admin can insert profiles" ON user_profiles;

-- Create a security definer function to check user role (bypasses RLS)
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM user_profiles
  WHERE id = user_id;
  RETURN user_role;
END;
$$;

-- Recreate policies using the function (avoids recursion)
CREATE POLICY "Super admin can view all profiles" ON user_profiles
  FOR SELECT USING (get_user_role(auth.uid()) = 'super_admin');

CREATE POLICY "Manager can view staff and members" ON user_profiles
  FOR SELECT USING (
    get_user_role(auth.uid()) = 'manager' 
    AND role IN ('coach', 'front_desk', 'member')
  );

CREATE POLICY "Super admin can update all profiles" ON user_profiles
  FOR UPDATE USING (get_user_role(auth.uid()) = 'super_admin');

CREATE POLICY "Super admin can insert profiles" ON user_profiles
  FOR INSERT WITH CHECK (get_user_role(auth.uid()) = 'super_admin');

-- ============================================================================
-- ALTERNATIVE: Simpler approach if you don't need complex role checking
-- ============================================================================
-- If you prefer a simpler setup, you can disable RLS on user_profiles 
-- and handle permissions in application code:
--
-- ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
--
-- Then secure access in your Next.js middleware/actions instead.

-- ============================================================================
-- SEED DATA FOR TESTING
-- ============================================================================

-- Insert default venue settings
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
