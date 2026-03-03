/**
 * Leets Header
 * 
 * Brand: PRACTICE > ACHIEVE > INSPIRE
 */

"use client";

import { useState } from "react";
import type { UserRole } from "@/types";

interface HeaderProps {
  user: {
    profile: {
      role: UserRole;
      first_name: string;
      last_name: string;
    };
  };
}

export function Header({ user }: HeaderProps) {
  const [currentLang, setCurrentLang] = useState<"en" | "ar">("en");

  const toggleLanguage = () => {
    const newLang = currentLang === "en" ? "ar" : "en";
    setCurrentLang(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  return (
    <header className="sticky top-0 z-40 bg-neutral-off-white border-b border-border">
      <div className="flex h-16 items-center justify-between px-6 lg:px-8">
        {/* Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-charcoal/40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search anything..."
              className="form-input pl-10"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-white hover:bg-neutral-off-white transition-all font-label"
          >
            <span className="text-lg">{currentLang === "en" ? "🇸🇦" : "🇺🇸"}</span>
            <span className="hidden sm:inline text-neutral-charcoal">
              {currentLang === "en" ? "English" : "العربية"}
            </span>
          </button>

          {/* Notifications */}
          <button className="relative p-2.5 rounded-lg text-neutral-charcoal/60 hover:bg-white hover:text-neutral-charcoal transition-all">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-brand ring-2 ring-neutral-off-white animate-pulse" />
          </button>

          {/* Help */}
          <button className="p-2.5 rounded-lg text-neutral-charcoal/60 hover:bg-white hover:text-neutral-charcoal transition-all">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
