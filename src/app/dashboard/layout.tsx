"use client";

/**
 * Leets Dashboard Layout with Mobile Device Simulator
 * OPTIMIZED - No loading delays
 */

import { DeviceSimulator } from "@/components/layout/DeviceSimulator";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { HomeButton } from "@/components/ui/HomeButton";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Mock user for demo (bypass auth)
const mockUser = {
  id: "1",
  email: "demo@leets.com",
  first_name: "Demo",
  last_name: "User",
  role: "member",
  avatar_url: null,
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // Remove loading state - render immediately
  return (
    <DeviceSimulator>
      <div className="min-h-screen bg-[#F5F5F5]">
        {/* Mobile Header */}
        <MobileHeader user={mockUser} />
        
        {/* Mobile Sidebar (Drawer) */}
        <MobileSidebar user={mockUser} />
        
        {/* Main Content */}
        <main className="pb-20 md:pb-0 pt-16 md:pt-0">
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
        
        {/* Home Button - Appears on all pages */}
        <HomeButton />
      </div>
    </DeviceSimulator>
  );
}
