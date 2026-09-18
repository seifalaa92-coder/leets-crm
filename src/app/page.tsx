import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/leets/Shell";
import { HeroVideo } from "@/components/leets/HeroVideo";
import { ClubCardVisual } from "@/components/leets/ClubCardVisual";
import { LifestyleBento } from "@/components/leets/LifestyleBento";
import { VideoShowcase } from "@/components/leets/VideoShowcase";
import { KidsSpotlight } from "@/components/leets/KidsSpotlight";
import { CreativeCTA } from "@/components/leets/CreativeCTA";
import { STATS, CLUBS } from "@/data/company";

export const metadata = {
  title: "Leets Sports — Sports Management Company | Egypt & KSA",
  description:
    "Leets Sports owns and operates sports facilities across Egypt and Saudi Arabia — padel clubs, academies and boutique fitness studios.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white selection:bg-[#EA553B] selection:text-white">
      <SiteHeader />

      <main id="main">
        {/* 1. Cinematic Hero with Ambient Video & Controls */}
        <HeroVideo stats={STATS} />

        {/* 2. Visual Facilities Showcase with Video Previews on Hover */}
        <section id="facilities" className="relative border-t border-white/10 bg-[#0A0F1E] py-24">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-2 rounded-md bg-[#EA553B]/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#EA553B] mb-3">
                  Track Record & Venues
                </span>
                <h2 className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight text-white">
                  Our Facilities
                </h2>
                <p className="mt-2 text-sm sm:text-base text-white/60 max-w-xl">
                  Built and operated end-to-end by Leets Sports — covering court construction, daily club management, academies, and community events.
                </p>
              </div>

              <Link
                href="/clubs"
                className="group -my-2 flex items-center gap-2 py-2 text-sm font-bold uppercase tracking-wider text-[#EA553B] transition hover:text-[#FF6B4F]"
              >
                <span>View All Facilities</span>
                <span className="transition-transform duration-150 group-hover:translate-x-1">→</span>
              </Link>
            </div>

            {/* Visual Cards Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {CLUBS.map((club, idx) => (
                <ClubCardVisual key={club.slug} club={club} priority={idx === 0} />
              ))}
            </div>
          </div>
        </section>

        {/* 3. The Leets Lifestyle Bento Grid */}
        <LifestyleBento />

        {/* 4. "Experience Leets in Motion" Video Reel */}
        <VideoShowcase />

        {/* 5. Kids Academy Spotlight */}
        <KidsSpotlight />

        {/* 6. Creative CTA */}
        <CreativeCTA />
      </main>

      <SiteFooter />
    </div>
  );
}
