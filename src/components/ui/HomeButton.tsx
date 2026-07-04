"use client";

/**
 * HomeButton Component
 * Floating home button to navigate back to dashboard
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

export function HomeButton() {
  const pathname = usePathname();
  
  // Don't show on dashboard or home page
  if (pathname === "/dashboard" || pathname === "/") {
    return null;
  }

  return (
    <Link
      href="/dashboard"
      className="fixed bottom-24 right-4 z-50 w-14 h-14 bg-[#EA553B] hover:bg-[#D14028] text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      title="Back to Dashboard"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    </Link>
  );
}

export function HomeButtonWithLabel() {
  const pathname = usePathname();
  
  // Don't show on dashboard or home page
  if (pathname === "/dashboard" || pathname === "/") {
    return null;
  }

  return (
    <Link
      href="/dashboard"
      className="fixed bottom-24 right-4 z-50 flex items-center gap-2 bg-[#EA553B] hover:bg-[#D14028] text-white px-4 py-3 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"
      title="Back to Dashboard"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
      <span className="font-body text-sm font-semibold">Home</span>
    </Link>
  );
}
