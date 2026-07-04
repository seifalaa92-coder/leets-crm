# Leets Sports Venue CRM

A complete, production-ready CRM platform for sports venues specializing in padel facilities. Built with modern web technologies for scalability, ease of maintenance, and excellent user experience.

![Leets CRM](https://img.shields.io/badge/Leets-CRM-orange)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)

## 🚀 Features

### Core Modules

1. **User Authentication**
   - Email/password login for staff
   - Phone number + OTP for members
   - Role-based access control (RBAC)
   - Password reset functionality

2. **QR Code Access Control**
   - Dynamic QR codes that refresh daily
   - Staff scanner for check-in/check-out
   - Entry/exit tracking with access logs
   - Membership validation on scan

3. **Client Database**
   - Complete member profiles
   - Multi-language support (English & Arabic)
   - Membership and payment history
   - Soft delete functionality

4. **Membership Management**
   - Four tiers: Monthly, Annual, Day Pass, Corporate
   - Automatic renewal and expiration handling
   - Upgrade/downgrade capabilities
   - Expiration notifications

5. **Employee Attendance**
   - Clock in/out with timestamp
   - QR code or app-based tracking
   - Late arrival and absence flagging
   - Monthly reports

6. **Loyalty Program**
   - Points for spending, referrals, and attendance
   - Rewards catalog management
   - Redemption history
   - Leaderboard

7. **Class Scheduling**
   - Padel court booking system
   - Group sessions, private lessons, tournaments
   - Waitlist management
   - Coach assignment

8. **Sales Pipeline**
   - Lead tracking from prospect to conversion
   - Follow-up notes and reminders
   - Conversion metrics
   - Revenue forecasting

9. **Admin Panel**
   - User management
   - System settings
   - Feature toggles
   - Activity logs

10. **Payment Tracking**
    - POS-style manual entry
    - Receipt generation
    - Daily cash summaries
    - Refund processing

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **QR Codes**: `qrcode` library
- **Internationalization**: Custom i18n implementation
- **Charts**: Recharts
- **Icons**: Lucide React

## 📁 Project Structure

```
leets-crm/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   │   ├── login/
│   │   │   └── forgot-password/
│   │   ├── dashboard/         # Main dashboard
│   │   ├── clients/           # Client management
│   │   ├── memberships/       # Membership management
│   │   ├── classes/           # Class scheduling
│   │   ├── payments/          # Payment tracking
│   │   ├── staff/             # Employee management
│   │   ├── access-control/    # QR code system
│   │   ├── loyalty/           # Loyalty program
│   │   ├── leads/             # Sales pipeline
│   │   ├── reports/           # Analytics
│   │   └── admin/             # Admin panel
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   ├── forms/             # Form components
│   │   ├── layout/            # Layout components
│   │   └── qr/                # QR code components
│   ├── lib/
│   │   ├── supabase/          # Supabase clients
│   │   ├── auth/              # Auth utilities
│   │   └── utils.ts           # Helper functions
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript definitions
│   ├── i18n/                  # Internationalization
│   │   ├── config.ts
│   │   └── locales/
│   │       ├── en/
│   │       └── ar/
│   └── database/
│       └── migrations/        # SQL migrations
├── supabase/
│   └── functions/             # Edge functions
├── public/                    # Static assets
├── .env.local.example         # Environment template
├── tailwind.config.ts
├── next.config.js
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (free tier works)

### 1. Clone and Install

```bash
git clone <repository-url>
cd leets-crm
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor
3. Copy the contents of `src/database/migrations/001_initial_schema.sql`
4. Paste and run the SQL to create all tables, enums, and RLS policies

### 3. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_LANGUAGE=en

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Timezone
TIMEZONE=Asia/Dubai
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 5. Create First Admin User

1. Sign up a user through the application
2. In Supabase SQL Editor, run:

```sql
UPDATE user_profiles 
SET role = 'super_admin' 
WHERE email = 'your-email@example.com';
```

## 👥 User Roles

| Role | Access Level |
|------|-------------|
| **Super Admin** | Full system access, user management, settings |
| **Manager** | All modules except system settings |
| **Coach** | Own classes, attendance, client check-ins |
| **Front Desk** | Check-ins, bookings, payments, client lookup |
| **Member** | Profile, QR code, bookings, loyalty points |

## 🌍 Internationalization

The application supports both **English** and **Arabic** with RTL layout support.

- Toggle language from the header on any page
- Arabic text renders correctly with proper RTL flipping
- All UI components adapt to the selected language direction

## 📱 Mobile App

A companion React Native + Expo mobile app is included in the `/mobile` directory.

### Setup Mobile App

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with Expo Go (iOS/Android) to run on your device.

## 🔐 Security

- **Row Level Security (RLS)** enabled on all database tables
- Policies enforce role-based access at the database level
- QR codes refresh daily for access control
- All authentication handled by Supabase Auth
- Password requirements enforced

## 📊 Database Schema

### Core Tables

- `user_profiles` - User accounts with roles
- `clients` - Member profiles
- `memberships` - Active subscriptions
- `membership_tiers` - Available plans
- `qr_codes` - Access codes
- `access_logs` - Entry/exit tracking
- `employee_attendance` - Staff clock in/out
- `loyalty_transactions` - Points tracking
- `class_schedules` - Bookable sessions
- `bookings` - Class reservations
- `payments` - Payment records
- `leads` - Sales pipeline

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Seed Test Data

```bash
npm run seed
```

## 🚀 Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

```bash
vercel --prod
```

### Supabase Production

1. Create a new Supabase project for production
2. Run the database migrations
3. Update environment variables
4. Configure custom domain if needed

## 📈 Performance

- Server-side rendering with Next.js App Router
- Database queries optimized with indexes
- Images optimized and lazy-loaded
- API routes cached where appropriate

## 🎨 Customization

### Branding

Edit `tailwind.config.ts` to customize colors:

```typescript
colors: {
  primary: {
    DEFAULT: "#FF6B00", // Your brand color
  },
}
```

### Venue Settings

Update in Admin Panel or directly in `venue_settings` table:
- Venue name and logo
- Operating hours
- Currency
- Loyalty point rules

## 🆘 Support

### Common Issues

1. **RLS Policy Errors**: Ensure user has correct role in `user_profiles`
2. **QR Code Not Generating**: Check camera permissions
3. **Language Not Switching**: Verify `dir` attribute on html element

### Getting Help

- Check the [Issues](https://github.com/your-repo/issues) page
- Review Supabase logs in Dashboard
- Enable React Developer Tools for debugging

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Credits

Built with:
- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.com)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) (component patterns)

---

**Leets Sports CRM** - Empowering sports venues with modern technology
