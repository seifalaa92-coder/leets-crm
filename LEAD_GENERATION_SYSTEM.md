# LEETS CRM - Lead Generation & Tracking System
## Complete Implementation Documentation

**Created:** February 21, 2026  
**Status:** ✅ Complete & Ready for Deployment

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Database Schema](#database-schema)
4. [API Routes](#api-routes)
5. [Components](#components)
6. [Setup Instructions](#setup-instructions)
7. [Usage Guide](#usage-guide)
8. [File Structure](#file-structure)
9. [Troubleshooting](#troubleshooting)

---

## Overview

This implementation adds a complete lead generation and visitor tracking system to the LEETS Sports Venue CRM. The system automatically tracks all website visitors, captures leads through a beautiful modal form, and provides an admin dashboard for lead management.

### Key Capabilities

- **Automatic Visitor Tracking**: Every page visit is logged with device, location, and referrer data
- **Lead Capture Form**: Dark-themed modal that auto-triggers after 5 seconds
- **Real-time Analytics**: Dashboard showing conversion rates, lead sources, and pipeline status
- **Lead Management**: View, filter, update status, and export leads to CSV
- **UTM Tracking**: Track marketing campaign effectiveness
- **Session Attribution**: Link leads to their browsing history

---

## Features

### For Visitors
- ✅ Automatic tracking (no cookies required)
- ✅ Beautiful dark modal form
- ✅ Quick "Contact Us" access from navigation
- ✅ Mobile-responsive design
- ✅ Form validation with helpful error messages
- ✅ Success confirmation

### For Administrators
- ✅ Dashboard with key metrics
- ✅ Lead list with search and filters
- ✅ Pipeline visualization
- ✅ Lead status management
- ✅ CSV export functionality
- ✅ Individual lead detail view
- ✅ Email and phone quick actions
- ✅ Source attribution tracking

### Technical Features
- ✅ Next.js 14 App Router
- ✅ Supabase PostgreSQL database
- ✅ TypeScript throughout
- ✅ Real-time updates
- ✅ Row Level Security (RLS)
- ✅ Automatic session management
- ✅ Device fingerprinting
- ✅ Scroll depth tracking
- ✅ Duration tracking

---

## Database Schema

### New Table: `visitor_tracking`

Tracks every page visit automatically.

```sql
CREATE TABLE visitor_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(255) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  page_url TEXT NOT NULL,
  page_title VARCHAR(255),
  referrer TEXT,
  country VARCHAR(100),
  city VARCHAR(100),
  device_type VARCHAR(50),
  browser VARCHAR(100),
  browser_version VARCHAR(50),
  os VARCHAR(100),
  os_version VARCHAR(50),
  duration_seconds INTEGER DEFAULT 0,
  scroll_depth INTEGER DEFAULT 0,
  is_unique_visit BOOLEAN DEFAULT true,
  is_logged_in BOOLEAN DEFAULT false,
  user_id UUID REFERENCES user_profiles(id),
  converted_to_lead BOOLEAN DEFAULT false,
  lead_id UUID REFERENCES leads(id),
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(200),
  utm_content VARCHAR(200),
  utm_term VARCHAR(200),
  entered_at TIMESTAMPTZ DEFAULT NOW(),
  exited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
- `idx_visitor_tracking_session` - For session lookups
- `idx_visitor_tracking_created_at` - For time-based queries
- `idx_visitor_tracking_converted` - For conversion analysis
- `idx_visitor_tracking_lead_id` - For lead attribution
- `idx_visitor_tracking_page_url` - For page analytics
- `idx_visitor_tracking_utm_source` - For marketing attribution

### Updated Table: `leads`

Extended with tracking fields:

```sql
-- New columns added to existing leads table:
ALTER TABLE leads ADD COLUMN utm_source VARCHAR(100);
ALTER TABLE leads ADD COLUMN utm_medium VARCHAR(100);
ALTER TABLE leads ADD COLUMN utm_campaign VARCHAR(200);
ALTER TABLE leads ADD COLUMN utm_content VARCHAR(200);
ALTER TABLE leads ADD COLUMN utm_term VARCHAR(200);
ALTER TABLE leads ADD COLUMN landing_page TEXT;
ALTER TABLE leads ADD COLUMN referrer TEXT;
ALTER TABLE leads ADD COLUMN session_id VARCHAR(255);
ALTER TABLE leads ADD COLUMN form_location VARCHAR(100) DEFAULT 'landing_page_modal';
ALTER TABLE leads ADD COLUMN time_to_conversion_seconds INTEGER;
ALTER TABLE leads ADD COLUMN device_type VARCHAR(50);
ALTER TABLE leads ADD COLUMN browser VARCHAR(100);
ALTER TABLE leads ADD COLUMN country VARCHAR(100);
ALTER TABLE leads ADD COLUMN city VARCHAR(100);
ALTER TABLE leads ADD COLUMN notification_sent BOOLEAN DEFAULT false;
ALTER TABLE leads ADD COLUMN notification_sent_at TIMESTAMPTZ;
```

### Analytics Views

**daily_visitor_stats**: Aggregated daily metrics
```sql
CREATE VIEW daily_visitor_stats AS
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
```

**lead_source_stats**: Lead attribution by source
```sql
CREATE VIEW lead_source_stats AS
SELECT 
  COALESCE(utm_source, 'direct') as source,
  COUNT(*) as lead_count,
  COUNT(*) FILTER (WHERE status = 'converted') as converted_count,
  ROUND(COUNT(*) FILTER (WHERE status = 'converted') * 100.0 / NULLIF(COUNT(*), 0), 2) as conversion_rate
FROM leads
GROUP BY COALESCE(utm_source, 'direct')
ORDER BY lead_count DESC;
```

**device_stats**: Device breakdown
```sql
CREATE VIEW device_stats AS
SELECT 
  device_type,
  COUNT(*) as visitor_count,
  COUNT(*) FILTER (WHERE converted_to_lead) as conversions
FROM visitor_tracking
WHERE device_type IS NOT NULL
GROUP BY device_type
ORDER BY visitor_count DESC;
```

### Automated Triggers

**update_visitor_tracking_on_lead**: Links visits to leads
```sql
CREATE FUNCTION update_visitor_tracking_on_lead()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE visitor_tracking
  SET converted_to_lead = true, lead_id = NEW.id
  WHERE session_id = NEW.session_id AND converted_to_lead = false;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_visitor_tracking_on_lead
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_visitor_tracking_on_lead();
```

**calculate_time_to_conversion**: Calculates conversion time
```sql
CREATE FUNCTION calculate_time_to_conversion()
RETURNS TRIGGER AS $$
DECLARE
  first_visit TIMESTAMPTZ;
BEGIN
  SELECT MIN(created_at) INTO first_visit
  FROM visitor_tracking WHERE session_id = NEW.session_id;
  
  IF first_visit IS NOT NULL THEN
    NEW.time_to_conversion_seconds := EXTRACT(EPOCH FROM (NEW.created_at - first_visit));
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_time_to_conversion
  BEFORE INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION calculate_time_to_conversion();
```

---

## API Routes

### 1. Visitor Tracking API

**POST /api/tracking**
- Tracks a new page visit
- Captures device info, UTM params, referrer
- Returns session ID and tracking ID

**Request Body:**
```json
{
  "pageUrl": "https://leets.sa/",
  "pageTitle": "LEETS - Luxury Padel Club",
  "sessionId": "optional-existing-session-id",
  "referrer": "https://google.com",
  "scrollDepth": 0,
  "duration": 0,
  "utmParams": {
    "utm_source": "google",
    "utm_medium": "cpc",
    "utm_campaign": "spring2026"
  }
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "1234567890-abc123",
  "trackingId": "uuid-here"
}
```

**PATCH /api/tracking**
- Updates visit duration on page exit
- Captures final scroll depth

**Request Body:**
```json
{
  "trackingId": "uuid-here",
  "duration": 45,
  "scrollDepth": 75,
  "exitedAt": "2026-02-21T10:30:00Z"
}
```

### 2. Leads API

**POST /api/leads**
- Creates a new lead from form submission
- Validates input with Zod
- Checks for duplicates (updates existing)
- Captures visitor tracking data

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+966 50 123 4567",
  "interestType": "membership",
  "message": "Interested in annual membership",
  "sessionId": "1234567890-abc123",
  "formLocation": "landing_page_modal",
  "landingPage": "https://leets.sa/",
  "referrer": "https://google.com",
  "utmParams": {
    "utm_source": "google",
    "utm_medium": "cpc"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lead created successfully",
  "leadId": "uuid-here",
  "isUpdate": false
}
```

**GET /api/leads**
- Fetches leads with filtering and pagination
- Requires authentication (admin/manager/front_desk)

**Query Parameters:**
- `status` - Filter by status
- `source` - Filter by source
- `startDate` - Filter from date
- `endDate` - Filter to date
- `limit` - Number of results (default: 50)
- `offset` - Pagination offset

**Response:**
```json
{
  "leads": [...],
  "total": 150,
  "limit": 50,
  "offset": 0
}
```

**PATCH /api/leads/[id]**
- Updates lead status and notes
- Requires authentication

**Request Body:**
```json
{
  "status": "contacted",
  "notes": "Called customer, scheduled tour"
}
```

**DELETE /api/leads/[id]**
- Deletes a lead
- Requires admin/manager role

### 3. Analytics API

**GET /api/analytics**
- Returns dashboard analytics data
- Requires authentication

**Query Parameters:**
- `days` - Number of days to analyze (default: 30)

**Response:**
```json
{
  "summary": {
    "totalVisits": 5000,
    "uniqueVisitors": 3500,
    "totalLeads": 150,
    "convertedLeads": 45,
    "conversionRate": 3.0
  },
  "leadsBySource": {
    "google": 80,
    "facebook": 40,
    "direct": 30
  },
  "leadsByStatus": {
    "new": 50,
    "contacted": 40,
    "converted": 45,
    "lost": 15
  },
  "leadsByInterest": {
    "membership": 80,
    "court_booking": 40,
    "coaching": 30
  },
  "dailyStats": [
    {"date": "2026-02-21", "visits": 200, "leads": 8}
  ],
  "deviceBreakdown": {
    "mobile": 3000,
    "desktop": 1500,
    "tablet": 500
  }
}
```

---

## Components

### 1. LeadCaptureForm

**Location:** `src/components/forms/LeadCaptureForm.tsx`

A beautiful dark-themed modal form with:
- Glassmorphism design
- Framer Motion animations
- Real-time validation
- Success/error states
- Auto-focus management
- Keyboard navigation (Escape to close)
- Mobile responsive

**Props:**
```typescript
interface LeadCaptureFormProps {
  isOpen: boolean;
  onClose: () => void;
  triggerSource?: string;
  sessionId?: string;
}
```

**Usage:**
```tsx
<LeadCaptureForm
  isOpen={isFormOpen}
  onClose={() => setIsFormOpen(false)}
  triggerSource="landing_page_auto"
/>
```

**Form Fields:**
1. First Name (required, min 2 chars)
2. Last Name (required, min 2 chars)
3. Email (required, validated)
4. Phone (required, 8+ digits)
5. Interest Type (dropdown):
   - Court Booking
   - Private Coaching
   - Membership
   - General Inquiry
6. Message (optional, textarea)

**Features:**
- ✅ Auto-opens after 5 seconds (configurable)
- ✅ Shows only once per session
- ✅ Captures UTM parameters automatically
- ✅ Links to visitor session
- ✅ Validates Saudi phone format
- ✅ Loading state with spinner
- ✅ Success animation
- ✅ Error handling with retry

### 2. VisitorTracker

**Location:** `src/components/tracking/VisitorTracker.tsx`

Invisible component that tracks all page visits:

**Features:**
- ✅ Automatic session management
- ✅ Device detection (mobile/desktop/tablet)
- ✅ Browser detection
- ✅ OS detection
- ✅ UTM parameter capture
- ✅ Scroll depth tracking (0-100%)
- ✅ Duration tracking (time on page)
- ✅ Referrer tracking
- ✅ Page URL tracking

**Usage:**
```tsx
// Add to layout or specific pages
<VisitorTracker />

// Or with custom page info
<VisitorTracker 
  pageUrl="/special-offer"
  pageTitle="Spring Special Offer"
/>
```

**How It Works:**
1. Generates unique session ID on first visit
2. Stores in localStorage for persistence
3. Sends tracking data on every page load
4. Updates duration on page exit
5. Links to lead when form is submitted

### 3. useTracking Hook

**Location:** `src/hooks/useTracking.ts`

React hook for accessing tracking data:

```typescript
const { sessionId, trackingId } = useTracking();

// Or manually track page views
const trackPageView = useTrackPageView();
trackPageView("/custom-page", "Custom Page Title");

// Get UTM parameters
const utmParams = useUtmParams();
// Returns: { utm_source, utm_medium, utm_campaign, ... }
```

---

## Setup Instructions

### Step 1: Run Database Migration

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Create a **New Query**
4. Copy the entire contents of:
   `src/database/migrations/004_add_visitor_tracking.sql`
5. Click **Run**

**Verification:**
- Check that `visitor_tracking` table exists
- Check that `leads` table has new columns
- Verify views were created:
  - `daily_visitor_stats`
  - `lead_source_stats`
  - `device_stats`

### Step 2: Install Dependencies

```bash
cd E:/Codes/leets-crm
npm install zod ua-parser-js
npm install -D @types/ua-parser-js
```

### Step 3: Restart Development Server

```bash
npm run dev
```

### Step 4: Test the System

1. **Visit Landing Page:**
   - Open http://localhost:3000
   - Wait 5 seconds → Form should appear
   - Check browser console for tracking calls

2. **Submit Test Lead:**
   - Fill out the form
   - Click "Get in Touch"
   - Should see success message

3. **View in Dashboard:**
   - Navigate to http://localhost:3000/leads
   - Should see your test lead
   - Check analytics cards

4. **Verify Tracking:**
   - Check Supabase `visitor_tracking` table
   - Should see visit records
   - Verify `converted_to_lead` is true

### Step 5: Deploy to Production

**Environment Variables:**
Make sure these are set in production:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Build and Deploy:**
```bash
npm run build
# Deploy to Vercel/Railway/your host
```

**Post-Deployment:**
1. Run database migration on production Supabase
2. Test form submission
3. Verify tracking is working
4. Check analytics dashboard

---

## Usage Guide

### For Website Visitors

**Automatic Form Trigger:**
- Form opens automatically after 5 seconds
- Only shows once per browser session
- Can be reopened via "Contact Us" button

**Manual Form Access:**
1. Click "Contact Us" in top navigation
2. Or click "Contact Us" in Quick Booking section
3. Fill out all required fields
4. Submit and wait for confirmation

### For Administrators

**Accessing the Dashboard:**
1. Log in to your admin account
2. Navigate to `/leads`
3. View dashboard with all metrics

**Managing Leads:**

1. **View All Leads:**
   - See list with name, contact, interest, status
   - Use search to find specific leads
   - Filter by status

2. **Update Lead Status:**
   - Click dropdown in "Status" column
   - Select new status:
     - `new` - Just submitted
     - `contacted` - You've reached out
     - `trial_scheduled` - Demo/trial booked
     - `converted` - Became a paying customer
     - `lost` - Didn't convert

3. **View Lead Details:**
   - Click "View" button
   - See full information
   - View UTM source, device, location
   - Click "Send Email" or "Call" buttons

4. **Export Leads:**
   - Click "Export CSV" button
   - Downloads CSV with all lead data
   - Use for email marketing or reports

**Understanding Analytics:**

- **Total Leads:** All leads captured (last 30 days)
- **New Leads:** Recently submitted leads
- **Converted:** Successfully became customers
- **Conversion Rate:** Leads ÷ Total Visitors × 100

**Pipeline Breakdown:**
Shows count of leads in each status stage.

### Marketing Attribution

**Track Campaigns with UTM Parameters:**

Add UTM parameters to your marketing links:
```
https://leets.sa/?utm_source=google&utm_medium=cpc&utm_campaign=spring2026
```

**UTM Parameters:**
- `utm_source` - Where traffic came from (google, facebook, instagram)
- `utm_medium` - Marketing medium (cpc, email, social)
- `utm_campaign` - Campaign name (spring2026, ramadan_offer)
- `utm_content` - Ad variation (banner_a, video_1)
- `utm_term` - Keywords used

**View Results:**
- Check "Source" column in leads table
- See breakdown in analytics
- Export and analyze in Excel

---

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── tracking/
│   │   │   └── route.ts              # Visitor tracking API
│   │   ├── leads/
│   │   │   ├── route.ts              # Lead CRUD API
│   │   │   └── [id]/
│   │   │       └── route.ts          # Individual lead API
│   │   └── analytics/
│   │       └── route.ts              # Analytics data API
│   ├── leads/
│   │   └── page.tsx                  # Admin dashboard (updated)
│   └── page.tsx                      # Landing page (updated)
├── components/
│   ├── forms/
│   │   └── LeadCaptureForm.tsx       # Dark modal form
│   └── tracking/
│       └── VisitorTracker.tsx        # Invisible tracking
├── hooks/
│   └── useTracking.ts                # React tracking hooks
└── database/
    └── migrations/
        └── 004_add_visitor_tracking.sql  # Database schema
```

---

## Troubleshooting

### Form Not Appearing

**Check:**
1. Is `isLeadFormOpen` state being set?
2. Check browser console for errors
3. Verify component is imported correctly
4. Check if `sessionStorage.hasSeenLeadForm` exists

**Solution:**
```javascript
// Clear session storage to test again
sessionStorage.removeItem('hasSeenLeadForm');
sessionStorage.removeItem('visitorSessionId');
```

### Leads Not Saving

**Check:**
1. Database migration ran successfully?
2. Supabase connection working?
3. Check browser Network tab for API errors
4. Verify RLS policies allow public inserts

**Solution:**
```sql
-- Check if policy exists
SELECT * FROM pg_policies WHERE tablename = 'leads';

-- Recreate if needed
CREATE POLICY leads_insert_public_policy ON leads
  FOR INSERT TO PUBLIC
  WITH CHECK (true);
```

### Tracking Not Working

**Check:**
1. VisitorTracker component mounted?
2. Check console for fetch errors
3. Verify `/api/tracking` endpoint exists
4. Check if `ua-parser-js` is installed

**Solution:**
```bash
npm install ua-parser-js
npm install -D @types/ua-parser-js
```

### Analytics Empty

**Check:**
1. Are you authenticated as admin/manager?
2. Check if `visitor_tracking` table has data
3. Verify API is returning data

**Test:**
```javascript
// In browser console
fetch('/api/analytics?days=7')
  .then(r => r.json())
  .then(console.log)
```

### Session Not Linking to Lead

**Check:**
1. Is `sessionId` being passed to form?
2. Check if localStorage has `visitorSessionId`
3. Verify trigger is running

**Debug:**
```javascript
// Check session ID
console.log(localStorage.getItem('visitorSessionId'));
console.log(sessionStorage.getItem('currentTrackingId'));
```

---

## Customization

### Change Form Trigger Delay

Edit `src/app/page.tsx`:
```typescript
// Change 5000 (5 seconds) to desired delay
const timer = setTimeout(() => {
  // Form trigger logic
}, 10000); // 10 seconds
```

### Change Form Fields

Edit `src/components/forms/LeadCaptureForm.tsx`:
- Add/remove fields in `FormData` interface
- Update validation in `validateForm()`
- Update API payload in `handleSubmit()`

### Change Form Colors

The form uses your brand colors:
- Background: `#0F172A` (navy)
- Accent: `#EA553B` (orange)
- Text: White with opacity variations

Edit in component CSS classes.

### Add Email Notifications

If you want email alerts later:

1. Install email service (Resend, SendGrid)
2. Create edge function or API route
3. Call from `POST /api/leads`

Example:
```typescript
// In leads API, after successful insert
await fetch('/api/send-email', {
  method: 'POST',
  body: JSON.stringify({
    to: 'manager@leets.sa',
    subject: 'New Lead: ' + lead.first_name,
    lead: lead
  })
});
```

---

## Performance Considerations

- **Database**: Indexes added for common queries
- **API**: Rate limiting recommended for production
- **Tracking**: Uses `sendBeacon` for reliable exit tracking
- **Images**: Lazy loaded in form
- **Bundle**: Dynamic imports can reduce initial load

---

## Security

- ✅ Row Level Security (RLS) enabled
- ✅ Input validation with Zod
- ✅ SQL injection prevention via Supabase
- ✅ XSS protection via React
- ✅ Admin-only access to sensitive data
- ✅ Public form submission allowed
- ✅ No PII in logs

---

## Future Enhancements

Ideas for later:
- [ ] Email notifications to managers
- [ ] SMS notifications
- [ ] Lead scoring algorithm
- [ ] Automated follow-up emails
- [ ] Integration with CRM (Salesforce, HubSpot)
- [ ] A/B testing for form variations
- [ ] Chat widget integration
- [ ] Lead assignment rules
- [ ] Calendar integration for bookings
- [ ] WhatsApp integration

---

## Support

For issues or questions:
1. Check **Troubleshooting** section above
2. Review **Supabase logs** in dashboard
3. Check **Browser console** for errors
4. Verify **Database schema** is correct

---

## License

This implementation is part of the LEETS Sports Venue CRM.

---

**Last Updated:** February 21, 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
