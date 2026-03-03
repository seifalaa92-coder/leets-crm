-- ============================================================================
-- LEETS Sports Venue CRM - Lead Generation & Visitor Tracking Schema
-- Migration 004: Add visitor tracking and lead analytics
-- ============================================================================

-- ============================================================================
-- NEW TABLE: visitor_tracking
-- Tracks all page visits for analytics and lead attribution
-- ============================================================================

CREATE TABLE IF NOT EXISTS visitor_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Session identification
  session_id VARCHAR(255) NOT NULL,
  
  -- Visitor information
  ip_address INET,
  user_agent TEXT,
  
  -- Page details
  page_url TEXT NOT NULL,
  page_title VARCHAR(255),
  referrer TEXT,
  
  -- Geographic data
  country VARCHAR(100),
  city VARCHAR(100),
  
  -- Device information
  device_type VARCHAR(50), -- mobile, tablet, desktop
  browser VARCHAR(100),
  browser_version VARCHAR(50),
  os VARCHAR(100),
  os_version VARCHAR(50),
  
  -- Visit metrics
  duration_seconds INTEGER DEFAULT 0,
  scroll_depth INTEGER DEFAULT 0, -- percentage 0-100
  
  -- Tracking flags
  is_unique_visit BOOLEAN DEFAULT true,
  is_logged_in BOOLEAN DEFAULT false,
  user_id UUID REFERENCES user_profiles(id),
  
  -- Conversion tracking
  converted_to_lead BOOLEAN DEFAULT false,
  lead_id UUID REFERENCES leads(id),
  
  -- UTM parameters for marketing attribution
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(200),
  utm_content VARCHAR(200),
  utm_term VARCHAR(200),
  
  -- Timestamps
  entered_at TIMESTAMPTZ DEFAULT NOW(),
  exited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_visitor_tracking_session ON visitor_tracking(session_id);
CREATE INDEX IF NOT EXISTS idx_visitor_tracking_created_at ON visitor_tracking(created_at);
CREATE INDEX IF NOT EXISTS idx_visitor_tracking_converted ON visitor_tracking(converted_to_lead) WHERE converted_to_lead = true;
CREATE INDEX IF NOT EXISTS idx_visitor_tracking_lead_id ON visitor_tracking(lead_id) WHERE lead_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_visitor_tracking_page_url ON visitor_tracking(page_url);
CREATE INDEX IF NOT EXISTS idx_visitor_tracking_utm_source ON visitor_tracking(utm_source) WHERE utm_source IS NOT NULL;

-- ============================================================================
-- UPDATE TABLE: leads
-- Add tracking and attribution fields
-- ============================================================================

-- Add new columns to leads table if they don't exist
DO $$
BEGIN
  -- UTM tracking
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'utm_source') THEN
    ALTER TABLE leads ADD COLUMN utm_source VARCHAR(100);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'utm_medium') THEN
    ALTER TABLE leads ADD COLUMN utm_medium VARCHAR(100);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'utm_campaign') THEN
    ALTER TABLE leads ADD COLUMN utm_campaign VARCHAR(200);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'utm_content') THEN
    ALTER TABLE leads ADD COLUMN utm_content VARCHAR(200);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'utm_term') THEN
    ALTER TABLE leads ADD COLUMN utm_term VARCHAR(200);
  END IF;
  
  -- Page tracking
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'landing_page') THEN
    ALTER TABLE leads ADD COLUMN landing_page TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'referrer') THEN
    ALTER TABLE leads ADD COLUMN referrer TEXT;
  END IF;
  
  -- Session tracking
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'session_id') THEN
    ALTER TABLE leads ADD COLUMN session_id VARCHAR(255);
  END IF;
  
  -- Form metadata
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'form_location') THEN
    ALTER TABLE leads ADD COLUMN form_location VARCHAR(100) DEFAULT 'landing_page_modal';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'time_to_conversion_seconds') THEN
    ALTER TABLE leads ADD COLUMN time_to_conversion_seconds INTEGER;
  END IF;
  
  -- Device information
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'device_type') THEN
    ALTER TABLE leads ADD COLUMN device_type VARCHAR(50);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'browser') THEN
    ALTER TABLE leads ADD COLUMN browser VARCHAR(100);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'country') THEN
    ALTER TABLE leads ADD COLUMN country VARCHAR(100);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'city') THEN
    ALTER TABLE leads ADD COLUMN city VARCHAR(100);
  END IF;
  
  -- Notification tracking
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'notification_sent') THEN
    ALTER TABLE leads ADD COLUMN notification_sent BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'notification_sent_at') THEN
    ALTER TABLE leads ADD COLUMN notification_sent_at TIMESTAMPTZ;
  END IF;
END$$;

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_leads_session_id ON leads(session_id);
CREATE INDEX IF NOT EXISTS idx_leads_utm_source ON leads(utm_source) WHERE utm_source IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_form_location ON leads(form_location);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on visitor_tracking
ALTER TABLE visitor_tracking ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (for tracking)
CREATE POLICY visitor_tracking_insert_policy ON visitor_tracking
  FOR INSERT TO PUBLIC
  WITH CHECK (true);

-- Policy: Only authenticated users with proper roles can view
CREATE POLICY visitor_tracking_select_policy ON visitor_tracking
  FOR SELECT TO PUBLIC
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'manager', 'front_desk')
    )
  );

-- Update leads policies to allow inserts from public (lead capture form)
CREATE POLICY leads_insert_public_policy ON leads
  FOR INSERT TO PUBLIC
  WITH CHECK (true);

-- ============================================================================
-- VIEWS FOR ANALYTICS
-- ============================================================================

-- Daily visitor stats
CREATE OR REPLACE VIEW daily_visitor_stats AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_visits,
  COUNT(DISTINCT session_id) as unique_visitors,
  COUNT(*) FILTER (WHERE converted_to_lead) as conversions,
  ROUND(COUNT(*) FILTER (WHERE converted_to_lead) * 100.0 / NULLIF(COUNT(*), 0), 2) as conversion_rate,
  AVG(duration_seconds) as avg_duration_seconds
FROM visitor_tracking
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Lead source breakdown
CREATE OR REPLACE VIEW lead_source_stats AS
SELECT 
  COALESCE(utm_source, 'direct') as source,
  COUNT(*) as lead_count,
  COUNT(*) FILTER (WHERE status = 'converted') as converted_count,
  ROUND(COUNT(*) FILTER (WHERE status = 'converted') * 100.0 / NULLIF(COUNT(*), 0), 2) as conversion_rate
FROM leads
GROUP BY COALESCE(utm_source, 'direct')
ORDER BY lead_count DESC;

-- Device breakdown
CREATE OR REPLACE VIEW device_stats AS
SELECT 
  device_type,
  COUNT(*) as visitor_count,
  COUNT(*) FILTER (WHERE converted_to_lead) as conversions
FROM visitor_tracking
WHERE device_type IS NOT NULL
GROUP BY device_type
ORDER BY visitor_count DESC;

-- ============================================================================
-- FUNCTION: Update lead conversion tracking
-- ============================================================================

CREATE OR REPLACE FUNCTION update_visitor_tracking_on_lead()
RETURNS TRIGGER AS $$
BEGIN
  -- Update visitor tracking records for this session
  UPDATE visitor_tracking
  SET 
    converted_to_lead = true,
    lead_id = NEW.id
  WHERE session_id = NEW.session_id
    AND converted_to_lead = false;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update visitor tracking when lead is created
DROP TRIGGER IF EXISTS trigger_update_visitor_tracking_on_lead ON leads;
CREATE TRIGGER trigger_update_visitor_tracking_on_lead
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_visitor_tracking_on_lead();

-- ============================================================================
-- FUNCTION: Calculate time to conversion
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_time_to_conversion()
RETURNS TRIGGER AS $$
DECLARE
  first_visit TIMESTAMPTZ;
BEGIN
  -- Find first visit for this session
  SELECT MIN(created_at) INTO first_visit
  FROM visitor_tracking
  WHERE session_id = NEW.session_id;
  
  -- Calculate time difference in seconds
  IF first_visit IS NOT NULL THEN
    NEW.time_to_conversion_seconds := EXTRACT(EPOCH FROM (NEW.created_at - first_visit));
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to calculate time to conversion
DROP TRIGGER IF EXISTS trigger_calculate_time_to_conversion ON leads;
CREATE TRIGGER trigger_calculate_time_to_conversion
  BEFORE INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION calculate_time_to_conversion();

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
