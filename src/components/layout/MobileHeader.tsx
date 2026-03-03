"use client";

/**
 * Mobile Header Component
 * Simplified header for mobile view
 */

import Link from "next/link";
import { useState } from "react";
import { LeetsIcon } from "@/components/ui/LeetsLogo";

interface MobileHeaderProps {
  user: {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
}

export function MobileHeader({ user }: MobileHeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40 flex items-center justify-between px-4 md:hidden">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2">
        <LeetsIcon className="w-8 h-8" />
        <span className="font-display text-lg text-black">LEETS</span>
      </Link>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#EA553B] rounded-full" />
        </button>

        {/* Profile */}
        <button 
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="w-9 h-9 rounded-full bg-[#EA553B]/10 flex items-center justify-center border border-[#EA553B]/20"
        >
          <span className="font-display text-sm text-[#EA553B]">
            {user.first_name.charAt(0)}{user.last_name.charAt(0)}
          </span>
        </button>
      </div>

      {/* Profile Dropdown */}
      {showProfileMenu && (
        <div className="absolute top-16 right-4 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-display text-sm text-black">{user.first_name} {user.last_name}</p>
            <p className="font-body text-xs text-gray-500">{user.role}</p>
          </div>
          <Link href="/profile" className="block px-4 py-2 font-body text-sm text-gray-700 hover:bg-gray-50">
            Profile
          </Link>
          <Link href="/settings" className="block px-4 py-2 font-body text-sm text-gray-700 hover:bg-gray-50">
            Settings
          </Link>
          <hr className="my-1" />
          <button className="block w-full text-left px-4 py-2 font-body text-sm text-red-600 hover:bg-red-50">
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
}
