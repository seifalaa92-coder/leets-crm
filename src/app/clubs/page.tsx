import Link from "next/link";
import { SiteHeader, SiteFooter, StatusBadge } from "@/components/leets/Shell";
import { CLUBS } from "@/data/company";

export const metadata = {
  title: "Our Clubs — Leets Sports",
  description:
    "Padel clubs built and operated by Leets Sports: Pyramids Park View, Westmark Mall and Padel Ace across Cairo, Egypt.",
};

export default function ClubsPage() {
  return (
    <div className="min-h-screen bg-[#0B1420] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-16">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#2E7CF6]">
          Track record
        </p>
        <h1 className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-5xl font-bold uppercase tracking-tight">
          Our Clubs
        </h1>
        <p className="mt-4 max-w-2xl text-white/70">
          Every club below was built or operated end-to-end by Leets Sports — courts, coaching,
          bookings, events and community.
        </p>

        <div className="mt-12 space-y-6">
          {CLUBS.map((club) => (
            <Link
              key={club.slug}
              href={`/clubs/${club.slug}`}
              className="group block rounded-xl border border-white/10 bg-white/[0.03] p-8 transition hover:border-[#2E7CF6]/60 hover:bg-white/[0.06] md:flex md:items-center md:justify-between"
            >
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <StatusBadge status={club.status} />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#2E7CF6]">
                    {club.role}
                  </span>
                </div>
                <h2 className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-3xl font-bold uppercase group-hover:text-[#2E7CF6]">
                  {club.name}
                </h2>
                <p className="mt-1 text-sm text-white/50">
                  {club.city} · {club.country}
                </p>
                <p className="mt-3 max-w-xl text-white/70">{club.short}</p>
              </div>
              <span className="mt-6 inline-block text-sm font-semibold text-[#2E7CF6] md:mt-0">
                View club & media →
              </span>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
