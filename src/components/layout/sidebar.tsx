/**
 * Leets Sidebar Navigation - High Visibility
 * 
 * Brand: PRACTICE > ACHIEVE > INSPIRE
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

interface SidebarProps {
  user: {
    profile: {
      role: UserRole;
      first_name: string;
      last_name: string;
    };
  };
}

// Icons
const Icons: Record<string, React.ReactNode> = {
  LayoutDashboard: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Users: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  CreditCard: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  Calendar: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  QrCode: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  DollarSign: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  UserCog: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Target: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6" fill="currentColor" fillOpacity="0.2"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>,
  BarChart3: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Settings: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Clock: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  BookOpen: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  Gift: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
  User: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  LogOut: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
};

const navigation = {
  super_admin: [
    { name: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { name: "Clients", href: "/clients", icon: "Users" },
    { name: "Memberships", href: "/memberships", icon: "CreditCard" },
    { name: "Classes", href: "/classes", icon: "Calendar" },
    { name: "Access Control", href: "/access-control", icon: "QrCode" },
    { name: "Payments", href: "/payments", icon: "DollarSign" },
    { name: "Staff", href: "/staff", icon: "UserCog" },
    { name: "Leads", href: "/leads", icon: "Target" },
    { name: "Reports", href: "/reports", icon: "BarChart3" },
    { name: "Admin", href: "/admin", icon: "Settings" },
  ],
  manager: [
    { name: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { name: "Clients", href: "/clients", icon: "Users" },
    { name: "Memberships", href: "/memberships", icon: "CreditCard" },
    { name: "Classes", href: "/classes", icon: "Calendar" },
    { name: "Access Control", href: "/access-control", icon: "QrCode" },
    { name: "Payments", href: "/payments", icon: "DollarSign" },
    { name: "Staff", href: "/staff", icon: "UserCog" },
    { name: "Leads", href: "/leads", icon: "Target" },
    { name: "Reports", href: "/reports", icon: "BarChart3" },
  ],
  coach: [
    { name: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { name: "My Classes", href: "/classes/my-schedule", icon: "Calendar" },
    { name: "Attendance", href: "/staff/attendance", icon: "Clock" },
  ],
  front_desk: [
    { name: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { name: "Clients", href: "/clients", icon: "Users" },
    { name: "Access Control", href: "/access-control", icon: "QrCode" },
    { name: "Bookings", href: "/classes/bookings", icon: "Calendar" },
    { name: "Payments", href: "/payments", icon: "DollarSign" },
    { name: "Leads", href: "/leads", icon: "Target" },
  ],
  member: [
    { name: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { name: "My QR Code", href: "/access-control/my-qr", icon: "QrCode" },
    { name: "Book Padel", href: "/classes/book-court", icon: "Target" },
    { name: "Book Class", href: "/classes", icon: "Calendar" },
    { name: "My Bookings", href: "/classes/my-bookings", icon: "BookOpen" },
    { name: "Loyalty", href: "/loyalty", icon: "Gift" },
    { name: "Profile", href: "/profile", icon: "User" },
  ],
};

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const userNav = navigation[user.profile.role] || [];

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      {/* Main sidebar with cream/off-white background for high visibility */}
      <div className="flex grow flex-col gap-y-6 overflow-y-auto bg-neutral-off-white border-r border-border px-6 py-6">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
              <rect width="40" height="40" rx="8" fill="#E8461A"/>
              <path d="M12 12h8v20h-8V12zm12 0h8v8h-8V12zm0 12h8v8h-8v-8z" fill="white"/>
            </svg>
            <div>
              <h1 className="font-display text-2xl text-neutral-black tracking-wide">LEETS</h1>
              <p className="font-label text-neutral-charcoal/60 text-[10px]">PRACTICE &gt; ACHIEVE &gt; INSPIRE</p>
            </div>
          </div>
        </div>

        {/* User Info - High visibility card */}
        <div className="bg-white rounded-lg p-4 border border-border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-lg">
              {user.profile.first_name?.[0]}{user.profile.last_name?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-neutral-black truncate">{user.profile.first_name} {user.profile.last_name}</p>
              <p className="font-label text-neutral-charcoal/60 text-[10px] uppercase">{user.profile.role.replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        {/* Navigation - High contrast text */}
        <nav className="flex flex-1 flex-col">
          <p className="font-label text-neutral-charcoal/50 mb-3 px-2 uppercase tracking-wider">Menu</p>
          <ul role="list" className="flex flex-1 flex-col gap-y-1">
            {userNav.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex gap-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-brand text-white shadow-brand"
                        : "text-neutral-charcoal hover:bg-brand/5 hover:text-brand"
                    )}
                  >
                    <span className={cn(
                      "transition-colors",
                      isActive ? "text-white" : "text-neutral-charcoal/50 group-hover:text-brand"
                    )}>
                      {Icons[item.icon]}
                    </span>
                    <span>{item.name}</span>
                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="border-t border-border pt-4">
          <form action="/auth/logout" method="POST">
            <button
              type="submit"
              className="flex w-full items-center gap-x-3 rounded-lg px-4 py-3 text-sm font-medium text-neutral-charcoal hover:bg-brand/5 hover:text-brand transition-all"
            >
              {Icons.LogOut}
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
