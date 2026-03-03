# Leets Sports CRM - Project Context

## Project Overview

**Leets Sports CRM** is a comprehensive customer relationship management platform designed for modern sports venues, specifically focused on Padel academies and sports facilities in Saudi Arabia (Jeddah launch).

**Brand Identity:**
- **Name:** Leets
- **Tagline:** PRACTICE > ACHIEVE > INSPIRE
- **Industry:** Sports Management / Fitness & Wellness
- **Market:** GCC (Saudi Arabia — Jeddah)
- **Brand Tone:** Energetic · Aspirational · Inclusive · Premium-Athletic

**Facilities Supported:**
- Padel Academy
- Functional Fitness (Gym)
- Pilates & Yoga Studios
- Swimming Pool
- Kids Area
- F&B (Food & Beverage)

---

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom components + shadcn/ui
- **Animations:** Framer Motion
- **Icons:** Lucide React (SVG icons, no emojis)
- **Fonts:** 
  - Display: Bebas Neue (bold, condensed, uppercase)
  - Body: Inter (clean, readable)

### Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (email/password + OTP)
- **Storage:** Supabase Storage
- **Real-time:** Supabase Realtime (optional)

### Development Tools
- **Package Manager:** npm
- **Linting:** ESLint
- **Type Checking:** TypeScript
- **Version Control:** Git

---

## Project Structure

```
leets-crm/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── (routes)/                 # Route groups
│   │   │   ├── page.tsx              # Landing page (Home)
│   │   │   ├── layout.tsx            # Root layout
│   │   │   ├── globals.css           # Global styles
│   │   │   ├── dashboard/            # Dashboard pages
│   │   │   │   ├── page.tsx          # Main dashboard
│   │   │   │   └── layout.tsx        # Dashboard layout
│   │   │   ├── classes/              # Booking pages
│   │   │   │   ├── book-court/       # Court booking
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── book-coach/       # Coach booking
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── bookings/             # My Bookings page
│   │   │   │   └── page.tsx
│   │   │   ├── auth/                 # Authentication
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── signup/
│   │   │   │       └── page.tsx
│   │   │   ├── memberships/
│   │   │   ├── clients/
│   │   │   ├── loyalty/
│   │   │   ├── reports/
│   │   │   └── access-control/
│   │   │       ├── page.tsx
│   │   │       └── my-qr/
│   │   │           └── page.tsx
│   │   └── api/                      # API routes (if any)
│   │
│   ├── components/                   # React components
│   │   ├── layout/                   # Layout components
│   │   │   ├── sidebar.tsx           # Desktop sidebar
│   │   │   ├── MobileHeader.tsx      # Mobile header
│   │   │   ├── MobileBottomNav.tsx   # Mobile bottom navigation
│   │   │   ├── MobileSidebar.tsx     # Mobile drawer menu
│   │   │   ├── header.tsx            # Desktop header
│   │   │   └── DeviceSimulator.tsx   # Mobile preview simulator
│   │   ├── ui/                       # UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── LeetsLogo.tsx         # Brand logo component
│   │   │   └── HomeButton.tsx        # Floating home button
│   │   └── providers/                # Context providers
│   │
│   ├── lib/                          # Utilities and configs
│   │   ├── utils.ts                  # Utility functions
│   │   ├── auth/
│   │   │   └── middleware.ts         # Auth middleware
│   │   └── supabase/
│   │       ├── client.ts             # Supabase client
│   │       └── server.ts             # Server-side Supabase
│   │
│   ├── types/                        # TypeScript types
│   │   └── index.ts
│   │
│   └── hooks/                        # Custom React hooks
│       └── useAuth.ts
│
├── public/                           # Static assets
│   └── favicon.ico
│
├── src/database/migrations/          # Database migrations
│   ├── 001_initial_schema.sql
│   ├── 002_fix_rls_recursion.sql
│   └── 003_fix_signup_rls.sql
│
├── tailwind.config.ts                # Tailwind configuration
├── next.config.js                    # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies
├── .env.local                        # Environment variables
└── leets-design-system.md            # Brand manual
```

---

## Design System

### Colors

**Primary Brand Colors:**
```css
--color-primary:        #EA553B;  /* Leets Orange-Red */
--color-primary-light:  #F26035;  /* Lighter orange */
--color-primary-dark:   #C93B14;  /* Darker orange */
--color-primary-10:     #EA553B1A; /* 10% opacity */
--color-primary-20:     #EA553B33; /* 20% opacity */
```

**Neutral Colors:**
```css
--color-white:          #FFFFFF;
--color-off-white:      #F5F4F0;  /* Warm white background */
--color-cream:          #E8E1D0;  /* Sandy/beige */
--color-black:          #111111;  /* Near-black text */
--color-dark:           #1E1E1E;
--color-charcoal:       #2D2D2D;
```

**Zone Accent Colors:**
```css
/* Padel Courts */
--color-padel-court:    #C85A2A;  /* Clay/terracotta */
--color-padel-bg:       #F0EBE3;

/* Gym */
--color-gym-dark:       #1A1A1A;
--color-gym-accent:     #EA553B;

/* Pool & Wellness */
--color-pool-teal:      #3ABFBF;
--color-wellness-sand:  #D4C4A8;

/* Kids */
--color-kids-warm:      #F28C38;

/* Semantic */
--color-success:        #2ECC71;
--color-warning:        #F39C12;
--color-error:          #E74C3C;
--color-info:           #3498DB;
```

### Typography

**Font Stack:**
```css
/* Display - Bold, condensed, athletic */
--font-display: 'Bebas Neue', sans-serif;

/* Body - Clean, readable */
--font-body: 'Inter', system-ui, sans-serif;
```

**Type Scale:**
- **Display 2XL:** 48-80px, uppercase, letter-spacing 0.02em
- **Display XL:** 40-64px, uppercase
- **H1:** 40-72px, uppercase, line-height 0.9
- **H2:** 32-48px, uppercase
- **H3:** 24-36px, uppercase
- **Body LG:** 18px, line-height 1.6
- **Body:** 16px, line-height 1.6
- **Label:** 11-12px, uppercase, letter-spacing 0.1em

### Spacing (8px Grid)
```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

### Border Radius
```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-2xl: 24px;
--radius-full: 9999px;
```

---

## Key Components

### 1. Layout Components

**DeviceSimulator.tsx**
- Mobile device preview wrapper
- iPhone/iPad frame simulation
- Toggle between desktop/mobile views
- Zoom and rotation controls

**MobileHeader.tsx**
- Fixed top navigation for mobile
- Logo + notifications + profile
- Height: 64px

**MobileBottomNav.tsx**
- Fixed bottom tab bar
- 5 tabs: Home, Court, Coach, Bookings, Profile
- Active state indicator

**MobileSidebar.tsx**
- Drawer menu from left
- Menu items with icons
- User info section

### 2. UI Components

**LeetsLogo.tsx**
- Brand logo component
- Geometric hexagonal L design
- Multiple sizes: small (32px), default (40px), large (64px)
- Exact recreation from brand book image

**Button**
- Variants: primary, secondary, ghost, tertiary
- Minimum touch target: 44x44px
- Hover and active states
- Icons support

**Card**
- Consistent border-radius: 16-24px
- Shadows: layered for depth
- Hover lift effect

**HomeButton.tsx**
- Floating button to return to dashboard
- Fixed position: bottom-right
- Appears on all pages except dashboard

### 3. Page Components

**Landing Page (/)**
- Hero section with large headline
- Feature grid
- Stats section
- CTA sections for booking
- Footer with quick links

**Dashboard (/dashboard)**
- Welcome card
- Stats row (Sessions, Points, Streak)
- Quick actions grid
- Upcoming bookings list
- Recent activity feed

**Book Court (/classes/book-court)**
- Court selection cards
- Date picker (calendar)
- Time slots grid
- Duration selector
- Price calculator
- Checkout flow

**Book Coach (/classes/book-coach)**
- Coach cards with profiles
- Coach: Seif (500 SAR/hour)
- Coach: Ahmed (400 SAR/hour)
- Coach: Maria (450 SAR/hour)
- Date/time selection
- Duration options (1hr, 1.5hr, 2hr)
- Payment method selection

**My Bookings (/bookings)**
- Stats overview (All/Upcoming/Completed)
- Combined list of courts + coaching
- Filter by status
- Cancel booking functionality
- Check-in button

---

## Database Schema (Supabase)

### Core Tables

**users**
- id (uuid, primary key)
- email (string, unique)
- first_name (string)
- last_name (string)
- role (enum: super_admin, manager, coach, front_desk, member)
- avatar_url (string, nullable)
- phone (string)
- created_at (timestamp)

**memberships**
- id (uuid)
- user_id (foreign key)
- type (enum)
- start_date (date)
- end_date (date)
- status (active, expired, cancelled)
- price (decimal)

**bookings**
- id (uuid)
- user_id (foreign key)
- type (court, coaching)
- court_id (uuid, nullable)
- coach_id (uuid, nullable)
- date (date)
- time (time)
- duration (integer, minutes)
- price (decimal)
- status (upcoming, completed, cancelled)
- payment_status (pending, paid, refunded)

**coaches**
- id (uuid)
- user_id (foreign key)
- specialty (string)
- bio (text)
- hourly_rate (decimal)
- certifications (jsonb)
- availability (jsonb)

**courts**
- id (uuid)
- name (string)
- type (indoor, outdoor)
- surface (string)
- hourly_rate (decimal)
- status (available, maintenance)

---

## Authentication System

**Methods:**
1. Email + Password
2. Phone + OTP (SMS)

**Roles:**
- **super_admin:** Full system access
- **manager:** Venue management
- **coach:** View schedule, member info
- **front_desk:** Check-ins, bookings
- **member:** Book courts, view own data

**Dev Bypass:**
```env
DEV_BYPASS_AUTH=true
DEV_BYPASS_ROLE=member  # or super_admin, manager, coach, front_desk
```

---

## Navigation Structure

### Desktop
- Sidebar (left): Full navigation menu
- Header (top): Logo, notifications, profile

### Mobile
- Header (top): Logo + actions
- Bottom Nav: 5 primary tabs
- Drawer (left): Full menu

### Routes
```
/                          - Landing page
/dashboard                 - Main dashboard
/classes/book-court        - Book padel court
/classes/book-coach        - Book coaching session
/bookings                  - My bookings
/profile                   - User profile
/loyalty                   - Loyalty program
/access-control/my-qr      - QR code for entry
/auth/login                - Login page
/auth/signup               - Registration
```

---

## Important Files

**Configuration:**
- `tailwind.config.ts` - Tailwind + design tokens
- `next.config.js` - Next.js settings
- `tsconfig.json` - TypeScript config
- `.env.local` - Environment variables

**Design:**
- `leets-design-system.md` - Complete brand manual
- `src/app/globals.css` - Global styles + CSS variables

**Core Components:**
- `src/components/ui/LeetsLogo.tsx` - Brand logo
- `src/components/layout/DeviceSimulator.tsx` - Mobile preview
- `src/app/layout.tsx` - Root layout with fonts

**Pages:**
- `src/app/page.tsx` - Landing page
- `src/app/dashboard/page.tsx` - Dashboard
- `src/app/classes/book-court/page.tsx` - Court booking
- `src/app/classes/book-coach/page.tsx` - Coach booking
- `src/app/bookings/page.tsx` - My bookings

---

## Development Guidelines

### Code Style
- Use TypeScript for all files
- Functional components with hooks
- Props interface for each component
- No `any` types
- Export default for page components

### Styling
- Tailwind classes preferred
- Custom CSS in globals.css for complex styles
- Use CSS variables for theme values
- Mobile-first responsive design

### Icons
- Use Lucide React or custom SVG
- **NO EMOJIS** anywhere in UI
- Consistent 24x24 viewBox for icons
- 2px stroke width

### Colors
- Use Tailwind classes: `bg-[#EA553B]`, `text-black`
- Reference CSS variables for consistency
- Maintain WCAG 4.5:1 contrast ratio

### Fonts
- Always use `font-display` for headings (uppercase)
- Use `font-body` for body text
- Navigation: uppercase, Bebas Neue

### Animations
- Framer Motion for page transitions
- 200-300ms duration for micro-interactions
- Use `transform` and `opacity` for performance

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Development
DEV_BYPASS_AUTH=true
DEV_BYPASS_ROLE=member

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Common Patterns

### Page Structure
```tsx
export default function PageName() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Top Nav with Logo */}
      <div className="bg-white border-b px-4 py-3">
        <LogoComponent />
      </div>
      
      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Content here */}
      </main>
    </div>
  );
}
```

### Button Pattern
```tsx
<Link 
  href="/route"
  className="bg-[#EA553B] hover:bg-[#D14028] text-white px-6 py-3 rounded-xl font-display"
>
  Button Text
</Link>
```

### Card Pattern
```tsx
<div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
  <h3 className="font-display text-xl text-black">Title</h3>
  <p className="font-body text-gray-600">Description</p>
</div>
```

---

## Testing the App

**Local Development:**
```bash
npm run dev
# Opens at http://localhost:3000
```

**Key Pages to Test:**
1. `/` - Landing page (logo, navigation, CTAs)
2. `/dashboard` - Dashboard (stats, quick actions)
3. `/classes/book-court` - Court booking flow
4. `/classes/book-coach` - Coach booking (see Coach Seif 500 SAR)
5. `/bookings` - My bookings list

**Mobile Testing:**
- Use device simulator (Ctrl/Cmd + M)
- Test iPhone 14/15 Pro views
- Check bottom navigation
- Test drawer menu

---

## Known Issues & Solutions

1. **Port already in use:** Kill processes on ports 3000-3010
2. **Font loading:** Bebas Neue loads from Google Fonts CDN
3. **Auth bypass:** Set DEV_BYPASS_AUTH=true for testing
4. **Supabase connection:** Check env variables if auth fails

---

## Future Enhancements

- [ ] Real-time notifications (Supabase Realtime)
- [ ] Payment integration (Stripe/Moyasar)
- [ ] Email notifications
- [ ] PDF receipts
- [ ] Data export functionality
- [ ] Mobile app (React Native)
- [ ] Admin dashboard improvements
- [ ] Analytics dashboard

---

## Contact & Support

- **Project:** Leets Sports CRM
- **Location:** Jeddah, Saudi Arabia
- **Support:** support@leets.sa

---

*This document provides complete context for AI assistants to understand and edit the Leets CRM project effectively.*
