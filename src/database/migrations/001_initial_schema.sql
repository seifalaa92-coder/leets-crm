-- ============================================================================
-- LEETS Sports Venue CRM - Database Schema
-- ============================================================================
-- This SQL file creates all necessary tables, indexes, and RLS policies
-- for the Leets CRM system.
-- 
-- Run this in your Supabase SQL Editor to set up the database from scratch.
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUMS
-- ============================================================================

DO $$
BEGIN
  -- User roles enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('super_admin', 'manager', 'coach', 'front_desk', 'member');
  END IF;

  -- Membership tier types enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'membership_tier_type') THEN
    CREATE TYPE membership_tier_type AS ENUM ('monthly', 'annual', 'day_pass', 'corporate');
  END IF;

  -- Membership status enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'membership_status') THEN
    CREATE TYPE membership_status AS ENUM ('active', 'expired', 'suspended', 'cancelled', 'pending');
  END IF;

  -- Access types enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'access_type') THEN
    CREATE TYPE access_type AS ENUM ('entry', 'exit');
  END IF;

  -- Access status enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'access_status') THEN
    CREATE TYPE access_status AS ENUM ('granted', 'denied', 'expired_membership', 'invalid_qr');
  END IF;

  -- Payment methods enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
    CREATE TYPE payment_method AS ENUM ('cash', 'card', 'bank_transfer', 'check', 'other');
  END IF;

  -- Payment categories enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_category') THEN
    CREATE TYPE payment_category AS ENUM ('membership', 'class', 'day_pass', 'merchandise', 'other');
  END IF;

  -- Payment status enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
    CREATE TYPE payment_status AS ENUM ('completed', 'pending', 'failed', 'refunded');
  END IF;

  -- Class types enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'class_type') THEN
    CREATE TYPE class_type AS ENUM ('group', 'private', 'open_play', 'tournament');
  END IF;

  -- Class status enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'class_status') THEN
    CREATE TYPE class_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
  END IF;

  -- Booking status enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
    CREATE TYPE booking_status AS ENUM ('confirmed', 'cancelled', 'waitlist', 'attended', 'no_show');
  END IF;

  -- Lead status enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_status') THEN
    CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'trial_scheduled', 'trial_completed', 'converted', 'churned', 'lost');
  END IF;

  -- Lead source enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_source') THEN
    CREATE TYPE lead_source AS ENUM ('walk_in', 'referral', 'social_media', 'website', 'phone', 'other');
  END IF;

  -- Notification types enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
    CREATE TYPE notification_type AS ENUM ('membership_expiry', 'class_reminder', 'payment_received', 'booking_confirmed', 'announcement', 'points_earned', 'system');
  END IF;

  -- Loyalty transaction types enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'loyalty_transaction_type') THEN
    CREATE TYPE loyalty_transaction_type AS ENUM ('earned', 'redeemed', 'adjusted', 'bonus');
  END IF;
END$$;

-- ============================================================================
-- TABLES
-- ============================================================================

-- User Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'member',
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  first_name_ar VARCHAR(100),
  last_name_ar VARCHAR(100),
  phone VARCHAR(20),
  photo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Membership Tiers
CREATE TABLE IF NOT EXISTS membership_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  name_ar VARCHAR(100),
  type membership_tier_type NOT NULL,
  duration_days INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients (Members)
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  first_name_ar VARCHAR(100),
  last_name_ar VARCHAR(100),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  photo_url TEXT,
  date_of_birth DATE,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  nationality VARCHAR(50),
  emergency_contact JSONB,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  referred_by UUID REFERENCES clients(id),
  loyalty_points INTEGER DEFAULT 0,
  current_membership_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Memberships
CREATE TABLE IF NOT EXISTS memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  tier_id UUID NOT NULL REFERENCES membership_tiers(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  status membership_status DEFAULT 'pending',
  auto_renew BOOLEAN DEFAULT false,
  company_name VARCHAR(200),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  cancelled_at TIMESTAMPTZ,
  CONSTRAINT valid_membership_dates CHECK (end_date >= start_date)
);

-- QR Codes
CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  code VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Access Logs
CREATE TABLE IF NOT EXISTS access_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  qr_code_id UUID REFERENCES qr_codes(id),
  access_type access_type NOT NULL,
  status access_status NOT NULL,
  scanned_by UUID REFERENCES user_profiles(id),
  scanned_at TIMESTAMPTZ DEFAULT NOW(),
  location VARCHAR(100),
  notes TEXT
);

-- Employee Attendance
CREATE TABLE IF NOT EXISTS employee_attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  clock_in_at TIMESTAMPTZ NOT NULL,
  clock_out_at TIMESTAMPTZ,
  clock_in_method VARCHAR(20) DEFAULT 'app',
  clock_out_method VARCHAR(20),
  total_hours DECIMAL(5, 2),
  is_late BOOLEAN DEFAULT false,
  late_reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Loyalty Transactions
CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  type loyalty_transaction_type NOT NULL,
  points INTEGER NOT NULL,
  reason TEXT NOT NULL,
  reference_id UUID,
  reference_type VARCHAR(50),
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rewards Catalog
CREATE TABLE IF NOT EXISTS rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  name_ar VARCHAR(200),
  description TEXT,
  description_ar TEXT,
  points_cost INTEGER NOT NULL,
  quantity_available INTEGER,
  is_active BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reward Redemptions
CREATE TABLE IF NOT EXISTS reward_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES rewards(id),
  points_used INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  redeemed_at TIMESTAMPTZ DEFAULT NOW(),
  fulfilled_at TIMESTAMPTZ,
  fulfilled_by UUID REFERENCES user_profiles(id)
);

-- Courts
CREATE TABLE IF NOT EXISTS courts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  name_ar VARCHAR(100),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Class Schedules
CREATE TABLE IF NOT EXISTS class_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  name_ar VARCHAR(200),
  description TEXT,
  type class_type NOT NULL,
  court_id UUID NOT NULL REFERENCES courts(id),
  coach_id UUID NOT NULL REFERENCES user_profiles(id),
  class_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration INTEGER NOT NULL,
  max_capacity INTEGER NOT NULL DEFAULT 4,
  price DECIMAL(10, 2) NOT NULL,
  status class_status DEFAULT 'scheduled',
  is_recurring BOOLEAN DEFAULT false,
  recurring_pattern VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES class_schedules(id),
  status booking_status DEFAULT 'confirmed',
  price DECIMAL(10, 2) NOT NULL,
  paid BOOLEAN DEFAULT false,
  payment_id UUID,
  booked_at TIMESTAMPTZ DEFAULT NOW(),
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  checked_in_at TIMESTAMPTZ
);

-- Waitlist
CREATE TABLE IF NOT EXISTS waitlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES class_schedules(id),
  position INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'waiting',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  promoted_at TIMESTAMPTZ,
  UNIQUE(client_id, class_id)
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  method payment_method NOT NULL,
  category payment_category NOT NULL,
  reference_number VARCHAR(100),
  status payment_status DEFAULT 'completed',
  recorded_by UUID NOT NULL REFERENCES user_profiles(id),
  notes TEXT,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Refunds
CREATE TABLE IF NOT EXISTS refunds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID NOT NULL REFERENCES payments(id),
  amount DECIMAL(10, 2) NOT NULL,
  reason TEXT NOT NULL,
  approved_by UUID NOT NULL REFERENCES user_profiles(id),
  status VARCHAR(20) DEFAULT 'pending',
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  notes TEXT
);

-- Leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  interest_type VARCHAR(100),
  source lead_source DEFAULT 'walk_in',
  status lead_status DEFAULT 'new',
  assigned_to UUID REFERENCES user_profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  converted_at TIMESTAMPTZ,
  converted_to_client_id UUID REFERENCES clients(id)
);

-- Lead Notes
CREATE TABLE IF NOT EXISTS lead_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  follow_up_date DATE,
  created_by UUID NOT NULL REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  sent_via JSONB DEFAULT '["push"]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

-- Venue Settings
CREATE TABLE IF NOT EXISTS venue_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL DEFAULT 'Leets Sports',
  name_ar VARCHAR(200),
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  timezone VARCHAR(50) DEFAULT 'Asia/Dubai',
  operating_hours JSONB DEFAULT '{}',
  currency VARCHAR(3) DEFAULT 'AED',
  currency_symbol VARCHAR(5) DEFAULT 'AED',
  loyalty_points_per_currency DECIMAL(5, 2) DEFAULT 1.00,
  referral_bonus_points INTEGER DEFAULT 100,
  attendance_streak_threshold INTEGER DEFAULT 7,
  attendance_streak_bonus INTEGER DEFAULT 50,
  class_cancellation_window_hours INTEGER DEFAULT 2,
  features JSONB DEFAULT '{"waitlist": true, "referralBonuses": true, "loyaltyProgram": true, "employeeAttendance": true}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES user_profiles(id)
);

-- System Logs
CREATE TABLE IF NOT EXISTS system_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles USING btree (lower(email));

CREATE INDEX IF NOT EXISTS idx_clients_email ON clients USING btree (lower(email));
CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone);
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_is_active ON clients(is_active);

CREATE INDEX IF NOT EXISTS idx_memberships_client_id ON memberships(client_id);
CREATE INDEX IF NOT EXISTS idx_memberships_status ON memberships(status);
CREATE INDEX IF NOT EXISTS idx_memberships_end_date ON memberships(end_date);

CREATE INDEX IF NOT EXISTS idx_qr_codes_client_id ON qr_codes(client_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_code ON qr_codes(code);

CREATE INDEX IF NOT EXISTS idx_access_logs_client_id ON access_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_scanned_at ON access_logs(scanned_at);
CREATE INDEX IF NOT EXISTS idx_access_logs_status ON access_logs(status);

CREATE INDEX IF NOT EXISTS idx_employee_attendance_user_id ON employee_attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_employee_attendance_date ON employee_attendance(clock_in_at);

CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_client_id ON loyalty_transactions(client_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_created_at ON loyalty_transactions(created_at);

CREATE INDEX IF NOT EXISTS idx_class_schedules_date ON class_schedules(class_date);
CREATE INDEX IF NOT EXISTS idx_class_schedules_coach_id ON class_schedules(coach_id);
CREATE INDEX IF NOT EXISTS idx_class_schedules_status ON class_schedules(status);

CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_class_id ON bookings(class_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

CREATE INDEX IF NOT EXISTS idx_payments_client_id ON payments(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);
CREATE INDEX IF NOT EXISTS idx_payments_category ON payments(category);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_system_logs_entity ON system_logs(entity_type, entity_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_membership_tiers_updated_at BEFORE UPDATE ON membership_tiers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_memberships_updated_at BEFORE UPDATE ON memberships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employee_attendance_updated_at BEFORE UPDATE ON employee_attendance
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rewards_updated_at BEFORE UPDATE ON rewards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_class_schedules_updated_at BEFORE UPDATE ON class_schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_venue_settings_updated_at BEFORE UPDATE ON venue_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate total attendance hours
CREATE OR REPLACE FUNCTION calculate_attendance_hours()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.clock_out_at IS NOT NULL AND NEW.clock_in_at IS NOT NULL THEN
    NEW.total_hours = EXTRACT(EPOCH FROM (NEW.clock_out_at - NEW.clock_in_at)) / 3600;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculate_attendance_hours_trigger BEFORE INSERT OR UPDATE ON employee_attendance
  FOR EACH ROW EXECUTE FUNCTION calculate_attendance_hours();

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- User Profiles Policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Super admin can view all profiles" ON user_profiles
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'super_admin'
  ));

CREATE POLICY "Manager can view staff and members" ON user_profiles
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'manager'
  ) AND role IN ('coach', 'front_desk', 'member'));

CREATE POLICY "Super admin can update all profiles" ON user_profiles
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'super_admin'
  ));

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Super admin can insert profiles" ON user_profiles
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'super_admin'
  ));

-- Membership Tiers Policies
CREATE POLICY "All users can view active tiers" ON membership_tiers
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin and manager can view all tiers" ON membership_tiers
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager')
  ));

CREATE POLICY "Admin and manager can manage tiers" ON membership_tiers
  FOR ALL USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager')
  ));

-- Clients Policies
CREATE POLICY "Staff can view all clients" ON clients
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager', 'front_desk', 'coach')
  ));

CREATE POLICY "Members can view own client profile" ON clients
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Staff can manage clients" ON clients
  FOR ALL USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager', 'front_desk')
  ));

-- Memberships Policies
CREATE POLICY "Staff can view all memberships" ON memberships
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager', 'front_desk')
  ));

CREATE POLICY "Members can view own memberships" ON memberships
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM clients c JOIN user_profiles u ON c.user_id = u.id
    WHERE c.id = memberships.client_id AND u.id = auth.uid()
  ));

CREATE POLICY "Staff can manage memberships" ON memberships
  FOR ALL USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager', 'front_desk')
  ));

-- QR Codes Policies
CREATE POLICY "Members can view own QR codes" ON qr_codes
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM clients c JOIN user_profiles u ON c.user_id = u.id
    WHERE c.id = qr_codes.client_id AND u.id = auth.uid()
  ));

CREATE POLICY "Staff can view and create QR codes" ON qr_codes
  FOR ALL USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager', 'front_desk')
  ));

-- Access Logs Policies
CREATE POLICY "Staff can view access logs" ON access_logs
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager', 'front_desk')
  ));

CREATE POLICY "Staff can create access logs" ON access_logs
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager', 'front_desk')
  ));

-- Employee Attendance Policies
CREATE POLICY "Users can view own attendance" ON employee_attendance
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Manager and admin can view all attendance" ON employee_attendance
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager')
  ));

CREATE POLICY "Users can clock in/out" ON employee_attendance
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Manager and admin can update attendance" ON employee_attendance
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager')
  ));

-- Loyalty Transactions Policies
CREATE POLICY "Members can view own transactions" ON loyalty_transactions
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM clients c JOIN user_profiles u ON c.user_id = u.id
    WHERE c.id = loyalty_transactions.client_id AND u.id = auth.uid()
  ));

CREATE POLICY "Staff can view all loyalty transactions" ON loyalty_transactions
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager', 'front_desk')
  ));

CREATE POLICY "Staff can create loyalty transactions" ON loyalty_transactions
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager', 'front_desk')
  ));

-- Rewards Policies
CREATE POLICY "All users can view active rewards" ON rewards
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin and manager can manage rewards" ON rewards
  FOR ALL USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager')
  ));

-- Reward Redemptions Policies
CREATE POLICY "Members can view own redemptions" ON reward_redemptions
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM clients c JOIN user_profiles u ON c.user_id = u.id
    WHERE c.id = reward_redemptions.client_id AND u.id = auth.uid()
  ));

CREATE POLICY "Staff can view and manage redemptions" ON reward_redemptions
  FOR ALL USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager', 'front_desk')
  ));

-- Courts Policies
CREATE POLICY "All users can view active courts" ON courts
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin and manager can manage courts" ON courts
  FOR ALL USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager')
  ));

-- Class Schedules Policies
CREATE POLICY "All users can view scheduled classes" ON class_schedules
  FOR SELECT USING (status = 'scheduled');

CREATE POLICY "Coach can view own classes" ON class_schedules
  FOR SELECT USING (coach_id = auth.uid());

CREATE POLICY "Admin and manager can manage classes" ON class_schedules
  FOR ALL USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager')
  ));

-- Bookings Policies
CREATE POLICY "Members can view own bookings" ON bookings
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM clients c JOIN user_profiles u ON c.user_id = u.id
    WHERE c.id = bookings.client_id AND u.id = auth.uid()
  ));

CREATE POLICY "Coach can view class bookings" ON bookings
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM class_schedules cs 
    WHERE cs.id = bookings.class_id AND cs.coach_id = auth.uid()
  ));

CREATE POLICY "Staff can view all bookings" ON bookings
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager', 'front_desk')
  ));

CREATE POLICY "Members can create own bookings" ON bookings
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM clients c JOIN user_profiles u ON c.user_id = u.id
    WHERE c.id = bookings.client_id AND u.id = auth.uid()
  ));

CREATE POLICY "Staff can manage bookings" ON bookings
  FOR ALL USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager', 'front_desk')
  ));

-- Waitlists Policies
CREATE POLICY "Members can view own waitlist entries" ON waitlists
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM clients c JOIN user_profiles u ON c.user_id = u.id
    WHERE c.id = waitlists.client_id AND u.id = auth.uid()
  ));

CREATE POLICY "Staff can view and manage waitlists" ON waitlists
  FOR ALL USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager', 'front_desk')
  ));

-- Payments Policies
CREATE POLICY "Members can view own payments" ON payments
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM clients c JOIN user_profiles u ON c.user_id = u.id
    WHERE c.id = payments.client_id AND u.id = auth.uid()
  ));

CREATE POLICY "Staff can view all payments" ON payments
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager', 'front_desk')
  ));

CREATE POLICY "Staff can manage payments" ON payments
  FOR ALL USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager', 'front_desk')
  ));

-- Refunds Policies
CREATE POLICY "Staff can view all refunds" ON refunds
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager', 'front_desk')
  ));

CREATE POLICY "Manager and admin can manage refunds" ON refunds
  FOR ALL USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager')
  ));

-- Leads Policies
CREATE POLICY "Staff can view all leads" ON leads
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager', 'front_desk')
  ));

CREATE POLICY "Staff can manage leads" ON leads
  FOR ALL USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager', 'front_desk')
  ));

-- Lead Notes Policies
CREATE POLICY "Staff can view lead notes" ON lead_notes
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager', 'front_desk')
  ));

CREATE POLICY "Staff can create lead notes" ON lead_notes
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager', 'front_desk')
  ));

-- Notifications Policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admin and manager can create notifications" ON notifications
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager')
  ));

-- Venue Settings Policies
CREATE POLICY "All users can view settings" ON venue_settings
  FOR SELECT USING (true);

CREATE POLICY "Admin and manager can update settings" ON venue_settings
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'manager')
  ));

-- System Logs Policies
CREATE POLICY "Only super admin can view logs" ON system_logs
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'super_admin'
  ));

-- ============================================================================
-- SEED DATA
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

-- ============================================================================
-- SETUP COMPLETE
-- ============================================================================

-- Note: To create the first super admin user:
-- 1. Sign up a user through Supabase Auth
-- 2. Run this SQL to assign super_admin role:
--    UPDATE user_profiles SET role = 'super_admin' WHERE email = 'admin@leets.com';
