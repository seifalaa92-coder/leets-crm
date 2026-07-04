"use client";

/**
 * Mobile Sidebar Drawer Component - NO EMOJIS
 * Uses SVG icons instead
 */

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LeetsIcon } from "@/components/ui/LeetsLogo";

interface MobileSidebarProps {
  user: {
    role: string;
    first_name: string;
  };
}

// SVG Icons
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CoachIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const TicketIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const QrIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4h2v-4zM6 20h2v-4H6v4zm6-8h2V8h-2v4zM6 12h2V8H6v4zm12-4V4h-4v4h4zm0 6v-2h-4v2h4zM8 4v4H4V4h4z" />
  </svg>
);

const menuItems = [
  { Icon: DashboardIcon, label: "Dashboard", href: "/dashboard" },
  { Icon: CalendarIcon, label: "Book Court", href: "/classes/book-court" },
  { Icon: CoachIcon, label: "Book Coach", href: "/classes/book-coach" },
  { Icon: UserIcon, label: "My Profile", href: "/profile" },
  { Icon: TicketIcon, label: "My Bookings", href: "/bookings" },
  { Icon: StarIcon, label: "Loyalty", href: "/loyalty" },
  { Icon: QrIcon, label: "QR Code", href: "/access-control/my-qr" },
];

export function MobileSidebar({ user }: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Menu Toggle Button - Fixed to left side */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-[#EA553B] text-white rounded-full shadow-lg flex items-center justify-center md:hidden hover:bg-[#D14028] transition-colors"
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-[280px] bg-white z-50 shadow-2xl md:hidden"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                <LeetsIcon className="w-10 h-10" />
                <div>
                  <span className="font-display text-xl text-black block">LEETS</span>
                  <span className="font-body text-[10px] text-[#EA553B] uppercase tracking-wider">CRM</span>
                </div>
              </Link>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* User Info */}
            <div className="p-4 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#EA553B]/10 flex items-center justify-center border-2 border-[#EA553B]/20">
                  <span className="font-display text-lg text-[#EA553B]">{user.first_name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-display text-base text-black">{user.first_name}</p>
                  <p className="font-body text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="p-4">
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-gray-500"><item.Icon /></span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
              <p className="font-body text-xs text-gray-400 text-center">
                © 2026 Leets Sports
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
