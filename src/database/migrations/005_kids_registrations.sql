-- ============================================================================
-- Kids Registrations Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS kids_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_first_name TEXT NOT NULL,
  parent_last_name TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  kid_name TEXT NOT NULL,
  kid_age INTEGER NOT NULL,
  sport_interest TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for looking up by status
CREATE INDEX IF NOT EXISTS idx_kids_registrations_status ON kids_registrations(status);

-- Index for sorting by creation date
CREATE INDEX IF NOT EXISTS idx_kids_registrations_created_at ON kids_registrations(created_at DESC);

-- Enable Row Level Security
ALTER TABLE kids_registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form submission)
CREATE POLICY "Anyone can insert kids registrations"
  ON kids_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can view registrations
CREATE POLICY "Admins can view kids registrations"
  ON kids_registrations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'manager', 'front_desk')
    )
  );

-- Only admins can update registrations
CREATE POLICY "Admins can update kids registrations"
  ON kids_registrations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'manager')
    )
  );

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_kids_registrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_kids_registrations_updated_at ON kids_registrations;
CREATE TRIGGER trg_kids_registrations_updated_at
  BEFORE UPDATE ON kids_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_kids_registrations_updated_at();
