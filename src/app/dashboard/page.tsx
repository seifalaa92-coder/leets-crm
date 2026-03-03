"use client";

/**
 * Dashboard Page - Mobile Optimized (NO EMOJIS VERSION)
 * Uses SVG icons instead of emojis
 */

import Link from "next/link";

// SVG Icon Components
const CalendarIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CoachIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const QrIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4h2v-4zM6 20h2v-4H6v4zm6-8h2V8h-2v4zM6 12h2V8H6v4zm12-4V4h-4v4h4zm0 6v-2h-4v2h4zM8 4v4H4V4h4z" />
  </svg>
);

const StarIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const ChartIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const RunIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const FireIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
  </svg>
);

const CheckIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const RacketIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="3" strokeWidth={2} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v6M9 12H3m18 0h-6" />
  </svg>
);

const quickActions = [
  { Icon: CalendarIcon, label: "Book Court", href: "/classes/book-court", color: "#EA553B" },
  { Icon: CoachIcon, label: "Book Coach", href: "/classes/book-coach", color: "#8B5CF6" },
  { Icon: QrIcon, label: "My QR Code", href: "/access-control/my-qr", color: "#22C55E" },
  { Icon: StarIcon, label: "Loyalty", href: "/loyalty", color: "#F59E0B" },
  { Icon: ChartIcon, label: "Reports", href: "/reports", color: "#3B82F6" },
];

const upcomingBookings = [
  { id: 1, court: "Court A", date: "Today", time: "6:00 PM", type: "Padel" },
  { id: 2, court: "Court B", date: "Tomorrow", time: "7:00 PM", type: "Padel" },
];

const stats = [
  { label: "Sessions", value: "24", Icon: RunIcon, color: "#3B82F6" },
  { label: "Points", value: "1,250", Icon: StarIcon, color: "#F59E0B" },
  { label: "Streak", value: "5 days", Icon: FireIcon, color: "#EA553B" },
];

const recentActivities = [
  { action: "Booked Court A", time: "2 hours ago", Icon: CalendarIcon, color: "#3B82F6" },
  { action: "Earned 50 points", time: "Yesterday", Icon: StarIcon, color: "#F59E0B" },
  { action: "Completed session", time: "2 days ago", Icon: CheckIcon, color: "#22C55E" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-[#EA553B] to-[#D14028] rounded-2xl p-5 text-white">
        <h1 className="font-display text-2xl mb-1">Welcome back!</h1>
        <p className="font-body text-sm text-white/80">Ready to play some padel today?</p>
        <div className="mt-4 flex items-center gap-2">
          <Link
            href="/classes/book-court"
            className="inline-flex items-center gap-2 bg-white text-[#EA553B] px-4 py-2 rounded-lg font-display text-sm tracking-wide"
          >
            Book Now
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
            <div className="mb-2 flex justify-center">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.Icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
            </div>
            <div className="font-display text-xl text-black">{stat.value}</div>
            <div className="font-body text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-display text-lg text-black mb-3">Quick Actions</h2>
        <div className="grid grid-cols-5 gap-2">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col items-center gap-2"
            >
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform active:scale-95"
                style={{ backgroundColor: `${action.color}15`, color: action.color }}
              >
                <action.Icon className="w-6 h-6" />
              </div>
              <span className="font-body text-[10px] text-gray-700 text-center leading-tight">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg text-black">Upcoming</h2>
          <Link href="/bookings" className="font-body text-sm text-[#EA553B]">
            See All
          </Link>
        </div>
        
        <div className="space-y-3">
          {upcomingBookings.map((booking) => (
            <div 
              key={booking.id}
              className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#EA553B]/10 flex items-center justify-center text-[#EA553B]">
                  <RacketIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-display text-base text-black">{booking.court}</p>
                  <p className="font-body text-xs text-gray-500">{booking.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-body text-sm font-semibold text-black">{booking.time}</p>
                <p className="font-body text-xs text-[#EA553B]">{booking.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="pb-4">
        <h2 className="font-display text-lg text-black mb-3">Recent Activity</h2>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-100">
          {recentActivities.map((activity, index) => (
            <div key={index} className="p-4 flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${activity.color}15`, color: activity.color }}
              >
                <activity.Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-body text-sm text-black">{activity.action}</p>
                <p className="font-body text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
