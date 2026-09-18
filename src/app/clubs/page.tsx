import { SiteHeader, SiteFooter } from "@/components/leets/Shell";
import { ClubCardVisual } from "@/components/leets/ClubCardVisual";
import { CLUBS } from "@/data/company";

export const metadata = {
  title: "Our Clubs",
  description:
    "Padel clubs built and operated by Leets Sports: Pyramids Park View, Westmark Mall and Padel Ace across Cairo, Egypt.",
};

export default function ClubsPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white selection:bg-[#EA553B] selection:text-white">
      <SiteHeader />
      <main id="main" className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-md bg-[#EA553B]/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#EA553B] mb-3">
            Track Record & Venues
          </span>
          <h1 className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-5xl sm:text-6xl font-extrabold uppercase tracking-tight">
            Our Facilities
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/70 leading-relaxed">
            Every facility below was built or operated end-to-end by Leets Sports — operations, coaching staff, booking systems, tournaments, and member communities.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {CLUBS.map((club, idx) => (
            <ClubCardVisual key={club.slug} club={club} priority={idx === 0} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
