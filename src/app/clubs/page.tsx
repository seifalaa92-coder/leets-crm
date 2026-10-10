import { SiteHeader, SiteFooter } from "@/components/leets/Shell";
import { ClubCardVisual } from "@/components/leets/ClubCardVisual";
import { CLUBS } from "@/data/company";

export const metadata = {
  title: "Our Facilities | Leets Sports",
  description:
    "Padel clubs built and operated by Leets Sports: Pyramids Park View, Westmark Mall and Padel Ace across Cairo, Egypt.",
};

export default function ClubsPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#111F35]">
      <SiteHeader />
      <main id="main" className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="max-w-3xl">
          <span className="inline-flex items-center rounded-full bg-[#172D4D]/10 px-3 py-1 text-[9px] font-medium uppercase tracking-[1.5px] text-[#172D4D] mb-3">
            Track Record & Venues
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-[-1.5px] text-[#111F35]">
            Our Facilities
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#687383] leading-relaxed">
            Every facility below was built or operated end-to-end by Leets Sports: court construction, daily operations, coaching staff, booking systems, tournaments, and member communities.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CLUBS.map((club, idx) => (
            <ClubCardVisual key={club.slug} club={club} priority={idx === 0} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
