import { SiteHeader, SiteFooter } from "@/components/leets/Shell";
import { HeroSection } from "@/components/leets/HeroSection";
import { ServiceStrip } from "@/components/leets/ServiceStrip";
import { QuickActions } from "@/components/leets/QuickActions";
import { FacilitiesSection } from "@/components/leets/FacilitiesSection";
import { KidsAcademySection } from "@/components/leets/KidsAcademySection";
import { ClosingCommunitySection } from "@/components/leets/ClosingCommunitySection";

export const metadata = {
  title: "Leets Sports | Sports Management Company | Egypt & KSA",
  description:
    "Leets Sports owns and operates sports facilities across Egypt and Saudi Arabia: padel clubs, academies and athletic communities.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#111F35] font-sans">
      <SiteHeader />

      <main id="main">
        {/* A. Hero: Centered, airy, with real Pyramids Park View media card */}
        <HeroSection />

        {/* B. Quiet Service Strip */}
        <ServiceStrip />

        {/* C. Four Quick Actions */}
        <QuickActions />

        {/* D. Facilities Grid: Large Pyramids Flagship + Stacked Delivered Projects */}
        <FacilitiesSection />

        {/* E. Kids Academy Feature Card */}
        <KidsAcademySection />

        {/* F. Closing Navy Community Section */}
        <ClosingCommunitySection />
      </main>

      <SiteFooter />
    </div>
  );
}
